const { MachineController } = require("../controller");

module.exports = (app) => {
	const controller = new MachineController();

	app.post("/add-machine", controller.createMachine);
	app.get("/", controller.findAll);
	app.get("/one", controller.findOne);
	app.put("/:machine_id", controller.updateMachine);
	app.delete("/:machine_id", controller.deleteMachine);
};
