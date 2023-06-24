const db = require("../database/connect/index");

const {
	APIError,
	BadRequestError,
	STATUS_CODES,
} = require("../utils/error/app-errors");

class UserRepository {
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

			await db("users").insert(user);
			return user;
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
			let query = db("users").select("*");

			if (filters.first_name)
				query = query.where(
					"first_name",
					"like",
					`%${filters.first_name}%`
				);

			if (filters.first_name)
				query = query.where(
					"first_name",
					"like",
					`%${filters.first_name}%`
				);

			if (filters.age) query = query.where("age", filters.age);
			if (filters.verified)
				query = query.where("verified", Number(filters.verified));

			if (filters.id) query = query.where("id", filters.id);
			if (filters.email) query = query.where("email", filters.email);
			if (filters.password)
				query = query.where("password", filters.password);
			if (filters.phone_number)
				query = query.where("phone_number", filters.phone_number);
			if (filters.created_at)
				query = query.where("created_at", filters.created_at);

			const users = await query;
			return users;
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
			let query = db("users").count("id as count");

			if (filters.first_name)
				query = query.where(
					"first_name",
					"like",
					`%${filters.first_name}%`
				);

			if (filters.first_name)
				query = query.where(
					"first_name",
					"like",
					`%${filters.first_name}%`
				);

			if (filters.age) query = query.where("age", filters.age);

			if (filters.id) query = query.where("id", filters.id);
			if (filters.email) query = query.where("email", filters.email);
			if (filters.password)
				query = query.where("password", filters.password);
			if (filters.phone_number)
				query = query.where("phone_number", filters.phone_number);
			if (filters.created_at)
				query = query.where("created_at", filters.created_at);

			const users_count = await query;
			return users_count[0].count;
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
			let query = db("users").select("*");

			if (filters.first_name)
				query = query.where(
					"first_name",
					"like",
					`%${filters.first_name}%`
				);

			if (filters.first_name)
				query = query.where(
					"first_name",
					"like",
					`%${filters.first_name}%`
				);

			if (filters.age) query = query.where("age", filters.age);
			if (filters.verified)
				query = query.where("verified", Number(filters.verified));

			if (filters.id) query = query.where("id", filters.id);
			if (filters.email) query = query.where("email", filters.email);
			if (filters.password)
				query = query.where("password", filters.password);
			if (filters.phone_number)
				query = query.where("phone_number", filters.phone_number);
			if (filters.created_at)
				query = query.where("created_at", filters.created_at);

			const users = await query;
			return users[0];
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error while fetching user ${e}`
			);
		}
	}

	async UpdateUser(id, updated_user) {
		try {
			const user = await db("users").where("id", id).update(updated_user);
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
