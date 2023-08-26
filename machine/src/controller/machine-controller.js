const { MachineService } = require("../service");

class MachineController {
	constructor() {
		this.service = new MachineService();
	}

	createMachine = async (req, res, next) => {
		try {
			const {
				name,
				image,
				backGroundImage,
				props,
				image_name,
				default_port,
			} = req.body;
			const machine = await this.service.CreateMachine(
				name,
				image,
				backGroundImage,
				props,
				image_name,
				default_port
			);
			return res.json({ success: true, data: machine });
		} catch (e) {
			next(e);
		}
	};

	findOne = async (req, res, next) => {
		try {
			const filters = req.query;
			const machine = await this.service.FindOneMachine(filters);
			return res.json({ success: true, data: machine });
		} catch (e) {
			next(e);
		}
	};

	findAll = async (req, res, next) => {
		try {
			const filters = req.query;
			const machine = await this.service.FindAllMachines(filters);
			return res.json({ success: true, data: machine });
		} catch (e) {
			next(e);
		}
	};

	updateMachine = async (req, res, next) => {
		try {
			const updated_values = req.body;
			const machine_id = req.params.machine_id;
			const machine = await this.service.UpdateMachine(
				machine_id,
				updated_values
			);
			return res.json({ success: true, data: machine });
		} catch (e) {
			next(e);
		}
	};

	deleteMachine = async (req, res, next) => {
		try {
			const { machine_id } = req.params;
			await this.service.DeleteMachine(machine_id);
			return res.json({ success: true });
		} catch (e) {
			next(e);
		}
	};
}

module.exports = MachineController;
