const { UserController } = require("../controller");
const Admin = require("../middlewares/admin");
const Auth = require("../middlewares/auth");

module.exports = (app) => {
	const userController = new UserController();

	app.post("/signup", userController.signUP);

	app.post("/login", userController.login);

	app.post("/send-otp", userController.sendOTP);

	app.get("/verify", userController.verifyOTP);

	app.get("/", userController.getAllUsers);

	app.put("/", Auth, userController.updateUser);

	app.get("/profile", Auth, userController.getUserProfile);

	app.delete("/", Auth, userController.deleteUser);

	app.post('/makeAdmin',Auth,Admin,userController.makeAdmin)
};
