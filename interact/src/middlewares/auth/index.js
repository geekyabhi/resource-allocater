const { ValidateSignature } = require("../../utils/functions");
const { AuthorizationError } = require("../../utils/error/app-errors");

const {UserService} = require('../../microservice_comm/grpc_comm/verifire/user/index')
const userService = new UserService()

const Auth = async (req, res, next) => {
	try {
		const payload = await ValidateSignature(req);
		req.payload = payload
		const userData = await userService.getUser(payload.id)
		req.user = userData
		next();
	} catch (e) {
		const err = new AuthorizationError(e);
		next(err);
	}
};

module.exports = Auth;
