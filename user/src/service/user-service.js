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
} = require("../utils/functions");

const { APIError, BadRequestError } = require("../utils/error/app-errors");
class UserService {
	constructor() {
		this.repository = new UserRepository();
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
			});

			return FormateData({
				id: new_user.id,
				email: new_user.email,
				first_name: new_user.first_name,
				last_name: new_user.last_name,
				phone_number: new_user.phone_number,
				gender: new_user.gender,
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
				token: token,
			});
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async FindAllUsers(filters) {
		try {
			// filters["verified"] = 1;
			const raw_users = await this.repository.FindUsers(filters);
			const users = raw_users.map((us) => {
				delete us["password"];
				delete us["salt"];
				return us;
			});
			// console.log(users);
			return users;
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}
	async FindOneUser(filters) {
		try {
			const raw_user = await this.repository.FindOneUser(filters);
			delete raw_user["salt"];
			delete raw_user["password"];
			return raw_user;
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async UpdateUser(id, updates) {
		try {
			const filtered_updates = {};

			for (let key in updates) {
				if (updates[key] !== null) {
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
			delete user["salt"];
			delete user["password"];
			return user;
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}
}

module.exports = UserService;
