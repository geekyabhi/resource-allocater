const connectDB = require("../database/connect");
const { UserModel } = require("../database/models");
const {RedisUtil} = require("../utils/cache")
const {
	APIError,
	STATUS_CODES,
} = require("../utils/error/app-errors");

class UserRepository {
	constructor() {
		this.User = new UserModel().schema;
		this.rds = new RedisUtil()
	}

	async AddUser({
		id,
		email,
		password,
		first_name,
		last_name,
		phone_number,
		created_at,
		gender,
		salt,
		admin
	}) {
		try {
			const user = {
				id,
				email,
				password,
				first_name,
				last_name,
				phone_number,
				created_at,
				gender,
				salt,
				admin
			};

			const created_user = await this.User.create(user);
			return created_user.dataValues;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error while adding user ${e}`
			);
		}
	}

	async FindUsers(filters) {
		try {
			const users = await this.User.findAll({ where: filters });
			return users.map((us) => {
				return us.dataValues;
			})
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error while fetching users ${e}`
			);
		}
	}

	async FindUsersCount(filters) {
		try {
			const count = await this.User.count({ where: filters });
			return count;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error while fetching users count ${e}`
			);
		}
	}

	async FindOneUserById({ id }) {
		try {
			const user = await db("users").select().where("id", id).first();
			return user;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error while fetching user ${e}`
			);
		}
	}

	async FindOneUser(filters) {
		try {
			const user = await this.User.findOne({ where: filters });
			if (!user) {
				return null
			}
			return user.dataValues;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error while fetching user ${e}`
			);
		}
	}

	async UpdateUser(id, updated_user, return_updated_data = true) {
		try {
			const updatedUser = await this.User.update(updated_user, {
				where: { id: String(id) },
				returning: true,
			});
			const user = this.FindOneUser({ id });
			return user;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error while updating user ${e}`
			);
		}
	}

	async DeleteUser(id) {
		try {
			const delete_user = await this.User.destroy({ where: { id } });
			if (delete_user.length == 0) {
				return {
					success: false,
				};
			}
			return {
				success: true,
			};
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error while updating user ${e}`
			);
		}
	}
}

module.exports = UserRepository;
