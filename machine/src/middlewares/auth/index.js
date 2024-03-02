const { ValidateSignature } = require("../../utils/functions");
const { AuthorizationError } = require("../../utils/error/app-errors");

const {UserService} = require('../../microservice_comm/grpc_comm/verifire/user/index')
const userService = new UserService()
// us.getUser("573951bd46a743ae93831d01c8e5450f").then((data)=>{
// 	console.log(data)
// })

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
