const { UserRespository } = require("../repository");

const { APIError } = require("../utils/error/app-errors");

class UserService {
	constructor() {
		this.repository = new UserRespository();
	}

	async FindOneUser(filters) {
		try {
            const user = await this.repository.FindOne(filters)
			return user
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	
}

module.exports = UserService;
