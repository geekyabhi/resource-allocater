const { UserController } = require("../controller");
const Auth = require("../middlewares/auth");
const { RedisSET, RedisGET, RedisUtil } = require("../utils/cache");

module.exports = (app) => {
	const userController = new UserController();

	app.post("/signup", userController.signUP);

	app.post("/login", userController.login);

	app.post("/send-otp", userController.sendOTP);

	app.post("/verify", userController.verifyOTP);

	app.get("/", userController.getAllUsers);

	app.put("/", Auth, userController.updateUser);

	app.get("/profile", Auth, userController.getUserProfile);

	app.delete("/", Auth, userController.deleteUser);
};
