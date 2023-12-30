const { MachineController } = require("../controller");
const Admin = require("../middlewares/admin");
const Auth = require("../middlewares/auth");

module.exports = (app) => {
	const controller = new MachineController();

	app.post("/add-machine",Auth,Admin, controller.createMachine);
	app.get("/", controller.findAll);
	app.get("/one", controller.findOne);
	app.put("/:machine_id",Auth,Admin, controller.updateMachine);
	app.delete("/:machine_id",Auth,Admin, controller.deleteMachine);
};
