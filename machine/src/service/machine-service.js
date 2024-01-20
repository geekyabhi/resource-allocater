const { MachineRepository } = require("../repository");
const {
	FormateData,
	GenerateUUID,
	CreateHashFromString,
	CreateHashFromFilters,
} = require("../utils/functions");

const { APIError } = require("../utils/error/app-errors");
const { RedisUtil } = require("../utils/cache");

class MachineService {
	constructor() {
		this.repository = new MachineRepository();
		this.redis = new RedisUtil()
	}

	async CreateMachine({
		name,
		image,
		backGroundImage,
		props,
		image_name,
		default_port,
		uid
	}) {
		try {
			const machine_id = GenerateUUID();
			const machine = await this.repository.AddMachine({
				name,
				image,
				backGroundImage,
				machine_id,
				props,
				image_name,
				default_port,
				uid
			});
			return FormateData({
				id: machine._id,
				name: machine.name,
				isactive: machine.isactive,
				props: machine.props,
				machine_id: machine.machine_id,
				image_name: machine.image_name,
				uid:machine.uid,
				image: machine.image,
				backGroundImage: machine.backGroundImage,
				default_port: machine.default_port,
				createdAt: machine.createdAt,
				updatedAt: machine.updatedAt,
			});
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async FindOneMachine(filters) {
		try {
			const id = filters.machine_id
			const hash = CreateHashFromString(id)
			const cache_machine = await this.redis.RedisGET(hash)
			if(cache_machine){
				return {
					data : cache_machine,
					from_cache:true
				}
			}
			const machine = await this.repository.FindOneMachine(filters);
			const format_data = FormateData({
				id: machine._id,
				name: machine.name,
				isactive: machine.isactive,
				props: machine.props,
				machine_id: machine.machine_id,
				createdAt: machine.createdAt,
				updatedAt: machine.updatedAt,
			})
			await this.redis.RedisSET(hash,format_data,100)
			return {
				data:format_data,
				from_cache:false
			}
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async FindAllMachines(filters) {
		try {
			const hash = CreateHashFromFilters(filters)
			const cache_machines = await this.redis.RedisGET(hash)
			if(cache_machines){
				return {
					data:cache_machines,
					from_cache:true
				}
			}
			const machines = await this.repository.FindAllMachine(filters);
			const formated_machines = machines.map((machine) =>
				FormateData({
					id: machine._id,
					name: machine.name,
					isactive: machine.isactive,
					props: machine.props,
					machine_id: machine.machine_id,
					image_name: machine.image_name,
					default_port: machine.default_port,
					createdAt: machine.createdAt,
					updatedAt: machine.updatedAt,
				})
			);
			await this.redis.RedisSET(hash,formated_machines,3)

			return {
				data:formated_machines,
				from_cache:false
			};
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async UpdateMachine(id, updated_values) {
		try {
			const hash = CreateHashFromString(id)
			const updated_machine = await this.repository.UpdateMachine(
				id,
				updated_values
			);
			await this.redis.RedisDEL(hash)
			return FormateData({
				id: updated_machine._id,
				name: updated_machine.name,
				isactive: updated_machine.isactive,
				props: updated_machine.props,
				machine_id: updated_machine.machine_id,
				image_name: updated_machine.image_name,
				image: updated_machine.image,
				backGroundImage: updated_machine.backGroundImage,
				default_port: updated_machine.default_port,
				createdAt: updated_machine.createdAt,
				updatedAt: updated_machine.updatedAt,
			});
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async DeleteMachine(id) {
		try {
			const hash = CreateHashFromString(id)
			const filter = { machine_id: id };
			await this.repository.DeleteMachine(filter);
			await this.redis.RedisDEL(hash)
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}
}

module.exports = MachineService;
