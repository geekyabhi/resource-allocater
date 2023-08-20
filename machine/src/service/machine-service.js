const { MachineRepository } = require("../repository");
const {
	GenerateSalt,
	GenerateUniqueString,
	GeneratePassword,
	FormateData,
	ValidatePassword,
	GenerateSignature,
	FilterValues,
	GenerateUUID,
} = require("../utils/functions");

const { APIError, BadRequestError } = require("../utils/error/app-errors");

class MachineService {
	constructor() {
		this.repository = new MachineRepository();
	}

	async CreateMachine(name, image, backGroundImage, props) {
		try {
			const machine_id = GenerateUUID();

			const machine = await this.repository.AddMachine(
				name,
				image,
				backGroundImage,
				true,
				machine_id,
				props
			);
			return FormateData({
				id: machine._id,
				name: machine.name,
				isactive: machine.isactive,
				props: machine.props,
				machine_id: machine.machine_id,
				createdAt: machine.createdAt,
				updatedAt: machine.updatedAt,
			});
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async FindOneMachine(filters) {
		try {
			const machine = await this.repository.FindOneMachine(filters);
			return FormateData({
				id: machine._id,
				name: machine.name,
				isactive: machine.isactive,
				props: machine.props,
				machine_id: machine.machine_id,
				createdAt: machine.createdAt,
				updatedAt: machine.updatedAt,
			});
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async FindAllMachines(filters) {
		try {
			const machines = await this.repository.FindAllMachine(filters);
			const formated_machines = machines.map((machine) =>
				FormateData({
					id: machine._id,
					name: machine.name,
					isactive: machine.isactive,
					props: machine.props,
					machine_id: machine.machine_id,
					createdAt: machine.createdAt,
					updatedAt: machine.updatedAt,
				})
			);

			return formated_machines;
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async UpdateMachine(id, updated_values) {
		try {
			const updated_machine = await this.repository.UpdateMachine(
				id,
				updated_values
			);
			return FormateData({
				id: updated_machine._id,
				name: updated_machine.name,
				isactive: updated_machine.isactive,
				props: updated_machine.props,
				machine_id: updated_machine.machine_id,
				createdAt: updated_machine.createdAt,
				updatedAt: updated_machine.updatedAt,
			});
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async DeleteMachine(id) {
		try {
			const filter = { machine_id: id };
			await this.repository.DeleteMachine(filter);
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}
}

module.exports = MachineService;
