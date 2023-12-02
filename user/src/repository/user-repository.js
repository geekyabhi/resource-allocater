const connectDB = require("../database/connect");
const { UserModel } = require("../database/models");

const {
	APIError,
	BadRequestError,
	STATUS_CODES,
} = require("../utils/error/app-errors");

class UserRepository {
	constructor() {
		this.User = new UserModel().schema;
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
			};

			const created_user = await this.User.create(user);
			return created_user;
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
			});
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
				return null;
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
			const [updatedCount, updatedUser] = await this.User.update(
				updated_user,
				{
					where: { id },
					returning: return_updated_data,
				}
			);
			const user = updatedUser[0].dataValues;
			return user;
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
