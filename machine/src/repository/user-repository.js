

const {User} = require("../database/models/");
const {
	APIError,
	BadRequestError,
	STATUS_CODES,
} = require("../utils/error/app-errors");

class UserRepository {
	constructor() {}

	async FindOne(filters) {
		try {
			const user = await User.findOne(filters)
			return user;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error while find machine ${e}`
			);
		}
	}

}

module.exports = UserRepository;
