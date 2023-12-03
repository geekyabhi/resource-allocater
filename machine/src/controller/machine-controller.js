const { MachineService } = require("../service");
const KafkaProducerHandler = require("../utils/message-broker/kafka-message-broker");
const kafkaProducer = new KafkaProducerHandler();
const MACHINE_DATA_TOPIC = "machine-data";
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
			const machine = await this.service.CreateMachine({
				name,
				image,
				backGroundImage,
				props,
				image_name,
				default_port,
			});
			const publishData = {
				event: "ADD_MACHINE",
				data: machine,
			};
			await kafkaProducer.Produce(
				MACHINE_DATA_TOPIC,
				JSON.stringify(publishData)
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
			const publishData = {
				event: "UPDATE_MACHINE",
				data: machine,
			};
			await kafkaProducer.Produce(
				MACHINE_DATA_TOPIC,
				JSON.stringify(publishData)
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
			const publishData = {
				event: "DELETE_MACHINE",
				data: {
					machine_id,
				},
			};

			await kafkaProducer.Produce(
				MACHINE_DATA_TOPIC,
				JSON.stringify(publishData)
			);
			return res.json({ success: true });
		} catch (e) {
			next(e);
		}
	};
}

module.exports = MachineController;
