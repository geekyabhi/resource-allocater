const { UserService } = require("../service/index");

module.exports = (app) => {
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
			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.post("/login", async (req, res, next) => {
		try {
			const { email, password } = req.body;

			const { data } = await service.Login({ email, password });

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});
};
