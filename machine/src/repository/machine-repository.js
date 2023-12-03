const { Machine } = require("../database/models");

const {
	APIError,
	BadRequestError,
	STATUS_CODES,
} = require("../utils/error/app-errors");

class MachineRepository {
	constructor() {}

	async AddMachine({
		name,
		image,
		image_name,
		backGroundImage,
		isactive,
		machine_id,
		props,
		default_port,
	}) {
		try {
			const machine = new Machine({
				name,
				image,
				backGroundImage,
				isactive,
				machine_id,
				image_name,
				props,
				default_port,
			});
			const saved_machine = await machine.save();
			return saved_machine;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error while creating machine ${e}`
			);
		}
	}

	async FindAllMachine(filters) {
		try {
			const machine = await Machine.find(filters);
			return machine;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error while find machine ${e}`
			);
		}
	}

	async FindOneMachine(filters) {
		try {
			if (filters["id"] != null) {
				filters["_id"] = filters["id"];
				delete filters.id;
			}
			const machine = await Machine.findOne(filters);
			return machine;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error while find machine ${e}`
			);
		}
	}

	async UpdateMachine(machine_id, updated_values) {
		try {
			const machine = await Machine.findOne({ machine_id });
			if (!machine) {
				return {};
			}
			for (let key in machine) {
				if (updated_values[key] != null)
					machine[key] = updated_values[key];
			}
			const saved_machine = await machine.save();
			return saved_machine;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error while updating machine ${e}`
			);
		}
	}

	async DeleteMachine(filters) {
		try {
			await Machine.deleteMany(filters);
			return true;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error while deleting machine ${e}`
			);
		}
	}
}

module.exports = MachineRepository;
