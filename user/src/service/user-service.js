const { UserRepository } = require("../repository");

const {
	GenerateSalt,
	GenerateUniqueString,
	GeneratePassword,
	FormateData,
	ValidatePassword,
	GenerateSignature,
	FilterValues,
	GenerateUUID,
	VerifyOTPUtil,
	CanSendOTP,
	GenerateOTP,
	CreateHashFromFilters,
	CreateHashFromString,
} = require("../utils/functions");

const { APIError, BadRequestError, AppError } = require("../utils/error/app-errors");
const { RedisUtil } = require("../utils/cache");


const KafkaProducerHandler = require("../utils/message-broker/kafka-message-broker");
const kafkaProducer = new KafkaProducerHandler();
const USER_DATA_TOPIC = "user-data";

class UserService {
	constructor() {
		this.repository = new UserRepository();
		this.redis = new RedisUtil();
	}

	async Register(inputs) {
		try {
			const {
				first_name,
				last_name,
				email,
				password,
				gender,
				phone_number,
			} = inputs;

			let exis_user = 0;

			FilterValues(
				[
					"first_name",
					"last_name",
					"email",
					"phone_number",
					"password",
				],
				[null, ""],
				{
					first_name,
					last_name,
					email,
					password,
					gender,
					phone_number,
				}
			);

			exis_user = await this.repository.FindUsersCount({ email });
			if (exis_user > 0) throw new BadRequestError("Email Already exist");

			exis_user = await this.repository.FindUsersCount({ phone_number });
			if (exis_user > 0)
				throw new BadRequestError("Number already exist");
			
			const totalCount = await this.repository.FindUsersCount({})
			const salt = await GenerateSalt();
			const userPassword = await GeneratePassword(password, salt);
			const id = await GenerateUUID();

			const new_user = await this.repository.AddUser({
				id,
				email,
				password: userPassword,
				first_name,
				last_name,
				phone_number,
				gender,
				salt,
				verified: false,
				admin : Boolean(totalCount==0)
			});

			const publish_data = {
				event: "ADD_USER",
				data: new_user,
			};
			await kafkaProducer.Produce(
				USER_DATA_TOPIC,
				JSON.stringify(publish_data)
			);

			return FormateData({
				id: new_user.id,
				email: new_user.email,
				first_name: new_user.first_name,
				last_name: new_user.last_name,
				phone_number: new_user.phone_number,
				gender: new_user.gender,
				password: new_user.password,
				verified: new_user.verified,
				email_notification: new_user.email_notification,
				sms_notification: new_user.sms_notification,
				salt: new_user.salt,
				admin : new_user.admin
			});
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async Login(inputs) {
		try {
			const { email, password } = inputs;
			const exis_user = await this.repository.FindOneUser({ email });
			if (!exis_user) throw new BadRequestError("Wrong email");

			const { password: user_password, salt: user_salt } = exis_user;

			const validPassword = await ValidatePassword(
				password,
				user_password,
				user_salt
			);

			if (!validPassword) throw new BadRequestError("Wrong password");

			// if (!user.verified)
			// 	throw new BadRequestError("Account not Verified");

			const token = await GenerateSignature({
				email: exis_user.email,
				id: exis_user.id,
			});

			return FormateData({
				id: exis_user.id,
				email: exis_user.email,
				first_name: exis_user.first_name,
				last_name: exis_user.last_name,
				phone_number: exis_user.phone_number,
				admin:exis_user.admin,
				token: token,
			});
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async FindAllUsers(filters) {
		try {
			const hash = await CreateHashFromFilters(filters)
			const cache_users = await this.redis.RedisGET(hash)
			if(cache_users){
				return {
					users:cache_users,
					cache:true
				}
			}
			const raw_users = await this.repository.FindUsers(filters);
			const users = raw_users.map((us) => {
				delete us["password"];
				delete us["salt"];
				return us;
			});
			await this.redis.RedisSET(hash,users,100)
			return {
				users,
				cache:false
			} 

		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}
	async FindOneUser(filters) {
		try {
			const id = filters.id
			const hash = CreateHashFromString(id)
			const cache_user = await this.redis.RedisGET(hash)
			if(cache_user){
				return{
					user:cache_user,
					cache:true
				}
			}
			const raw_user = await this.repository.FindOneUser(filters);
			if(!raw_user) return null
			delete raw_user["salt"];
			delete raw_user["password"];
			await this.redis.RedisSET(hash,raw_user,100)
			return {
				user:raw_user,
				cache:false
			}
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async UpdateUser(id, updates) {
		try {
			const filtered_updates = {};

			for (let key in updates) {
				if (updates[key] != null) {
					filtered_updates[key] = updates[key];
				}
			}

			FilterValues(
				["email", "phone_number", "password"],
				[null, ""],
				filtered_updates
			);

			if (
				filtered_updates.phone_number &&
				(await this.repository.FindUsersCount({
					phone_number: filtered_updates.phone_number,
				})) > 0
			)
				throw new BadRequestError("Number already exist");

			if (
				filtered_updates.email &&
				(await this.repository.FindUsersCount({
					email: filtered_updates.email,
				})) > 0
			)
				throw new BadRequestError("Email Already exist");

			if (filtered_updates.password) {
				const salt = await GenerateSalt();
				const userPassword = await GeneratePassword(
					filtered_updates.password,
					salt
				);
				filtered_updates.password = userPassword;
			}
			const user = await this.repository.UpdateUser(id, filtered_updates);
			
			const publish_data = {
				event: "UPDATE_USER",
				data: user,
			};
			await kafkaProducer.Produce(
				USER_DATA_TOPIC,
				JSON.stringify(publish_data)
			);
			const hash = CreateHashFromString(id)
			await this.redis.RedisDEL(hash)
			return {user};
			
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async DeleteUser(id) {
		try {
			
			const data = await this.repository.DeleteUser(id);
			if (data?.success) {
				const publish_data = {
					event: "DELETE_USER",
					data: {
						id,
					},
				};
				await kafkaProducer.Produce(
					USER_DATA_TOPIC,
					JSON.stringify(publish_data)
				);
			}
			const hash = CreateHashFromString(id)
			await this.redis.RedisDEL(hash)
			return {data};
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async SendOTP(email){
		try {
			const user_data = await this.FindOneUser({ email });
			if(!user_data) return {"message":"No such user found"}
			const data = await CanSendOTP(this.redis, email);
			if (!data.can_send)
				return {
					data: `Cant send OTP until ${data.time_remaining} seconds`,
				};
			const otp = GenerateOTP(6);
			await this.redis.RedisSET(email, otp, 60);
			return {
				"message":`OTP send ${otp}`
			}
			
		} catch (e) {
			throw new APIError(e,e.statusCode)
		}
	}
	async VerifyOTP(email,otp){
		try {
			const {user} = await this.FindOneUser({ email });
			const verified = await VerifyOTPUtil(this.redis,otp,email)
			if(!verified){
				return {
					"message":"Wrong OTP"
				}
			}
			if(!user){
				return {
					"message":"No such user"
				}
			}
			const {user:updatedUser} = await this.UpdateUser(user.id,{"verified":true})
			return {updatedUser}
		} catch (e) {
			throw new APIError(e,e.statusCode)
		}
	}

	async MakeAdmin(email){
		try{
			const user = await this.FindOneUser({email})
			if(!user){
				return {
					"message":"No such user exists"
				}
			}
			const updatedUser = await this.UpdateUser(user.id,{"admin":true})
			return updatedUser
		}catch(e){
			throw new AppError(e,e.statusCode)
		}
	}

}

module.exports = UserService;
