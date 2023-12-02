const { UserService } = require("../service");
const { RedisUtil } = require("../utils/cache");
const { APIError } = require("../utils/error/app-errors");
const {
	GenerateOTP,
	CanSendOTP,
	VerifyOTP,
	SendOTP,
} = require("../utils/functions");
const KafkaProducerHandler = require("../utils/message-broker/kafka-message-broker");

class UserController {
	constructor() {
		this.service = new UserService();
		this.redis = new RedisUtil();
	}

	signUP = async (req, res, next) => {
		try {
			const {
				first_name,
				last_name,
				phone_number,
				email,
				password,
				gender,
			} = req.body;
			const { data } = await this.service.Register({
				first_name,
				last_name,
				phone_number,
				email,
				password,
				gender,
			});

			const filter_data = {
				sms_notification: data.sms_notification,
				email_notification: data.email_notification,
				phone: data.phone_number,
				first_name: data.first_name,
				last_name: data.last_name,
				email: data.email,
				id: data.id,
			};

			const kafkaProducer = new KafkaProducerHandler();
			await kafkaProducer.Produce("user-data", JSON.stringify(data));

			return res.json({ success: true, data: filter_data });
		} catch (e) {
			next(e);
		}
	};

	login = async (req, res, next) => {
		try {
			const { email, password } = req.body;

			const { data } = await this.service.Login({ email, password });

			// rabbitMq.PublishMessage(
			// 	rabbitMq.MAIL_BINDING_KEY,
			// 	JSON.stringify({ ...data, event: "profile_loggedin" })
			// );

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	};

	sendOTP = async (req, res, next) => {
		try {
			const { email } = req.body;
			const user_data = await this.service.FindOneUser({ email });
			const data = await CanSendOTP(this.redis, email);
			if (!data.can_send)
				return res.json({
					success: false,
					data: `Cant send OTP until ${data.time_remaining} seconds`,
				});

			const otp = GenerateOTP(6);

			console.log(otp);
			// SendOTP(otp, user_data, rabbitMq);

			await this.redis.RedisSET(email, otp, 60);

			return res.json({ success: true, data: "OTP send to the email" });
		} catch (e) {
			next(e);
		}
	};

	verifyOTP = async (req, res, next) => {
		try {
			const { otp, email } = req.body;

			const user = await this.service.FindOneUser({ email });

			await VerifyOTP(this.redis, otp, email);

			const updatedUser = await this.service.UpdateUser(user.id, {
				verified: 1,
			});

			return res.json({
				success: true,
				data: updatedUser,
			});
		} catch (e) {
			next(e);
		}
	};

	getAllUsers = async (req, res, next) => {
		try {
			const filters = req.query;
			const data = await this.service.FindAllUsers(filters);
			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	};

	updateUser = async (req, res, next) => {
		try {
			const updates = req.body;
			const id = req.user.id;
			const data = await this.service.UpdateUser(id, updates);
			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	};

	getUserProfile = async (req, res, next) => {
		try {
			const id = req.user.id;
			const user = await this.service.FindOneUser({ id: id });
			return res.json({ success: true, data: user });
		} catch (e) {
			next(e);
		}
	};
}

module.exports = UserController;
