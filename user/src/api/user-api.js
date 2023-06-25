const Auth = require("../middlewares/auth");
const { UserService } = require("../service/index");
const { RedisSET, RedisGET } = require("../utils/cache");
const { APIError } = require("../utils/error/app-errors");
const {
	GenerateOTP,
	CanSendOTP,
	VerifyOTP,
	SendOTP,
} = require("../utils/functions");

module.exports = (app, redisClient, rabbitMq) => {
	const service = new UserService();

	app.post("/signup", async (req, res, next) => {
		try {
			const {
				first_name,
				last_name,
				phone_number,
				email,
				password,
				gender,
			} = req.body;
			const { data } = await service.Register({
				first_name,
				last_name,
				phone_number,
				email,
				password,
				gender,
			});

			const publishData = {
				sms_notification: data.sms_notification,
				email_notification: data.email_notification,
				phone: data.phone_number,
				first_name: data.first_name,
				last_name: data.last_name,
				email: data.email,
				id: data.id,
			};

			rabbitMq.PublishMessage(
				rabbitMq.MAIL_BINDING_KEY,
				JSON.stringify({ ...publishData, event: "profile_registered" })
			);

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.post("/login", async (req, res, next) => {
		try {
			const { email, password } = req.body;

			const { data } = await service.Login({ email, password });

			rabbitMq.PublishMessage(
				rabbitMq.MAIL_BINDING_KEY,
				JSON.stringify({ ...data, event: "profile_loggedin" })
			);

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.post("/send-otp", async (req, res, next) => {
		try {
			const { email } = req.body;

			const user_data = await service.FindOneUser({ email });

			const data = await CanSendOTP(redisClient, email);
			if (!data.can_send)
				return res.json({
					success: false,
					data: `Cant send OTP until ${data.time_remaining} seconds`,
				});

			const otp = GenerateOTP(6);

			console.log(otp);
			SendOTP(otp, user_data, rabbitMq);

			await redisClient.RedisSET(email, otp, 60);

			return res.json({ success: true, data: "OTP send to the email" });
		} catch (e) {
			next(e);
		}
	});

	app.post("/verify", async (req, res, next) => {
		try {
			const { otp, email } = req.body;

			const user = await service.FindOneUser({ email });

			await VerifyOTP(redisClient, otp, email);

			await service.UpdateUser(user.id, {
				verified: 1,
			});

			return res.json({
				success: true,
				data: "User verified",
			});
		} catch (e) {
			next(e);
		}
	});

	app.get("/", async (req, res, next) => {
		try {
			const filters = req.query;
			const data = await service.FindAllUsers(filters);
			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.put("/", Auth, async (req, res, next) => {
		try {
			const updates = req.body;
			const id = req.user.id;
			const data = await service.UpdateUser(id, updates);
			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.get("/profile", Auth, async (req, res, next) => {
		try {
			const id = req.user.id;
			const user = await service.FindOneUser({ id: id });
			return res.json({ success: true, data: user });
		} catch (e) {
			next(e);
		}
	});
};
