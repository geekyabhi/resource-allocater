const { AuthorizationError } = require("../../utils/error/app-errors");
const {UserService} = require('../../microservice_comm/grpc_comm/verifire/user/index')
const userService = new UserService()

const Admin = async (req, res, next) => {
	try {
		if(!req.user){
			req.user = await userService.getUser(req.payload.id)
		}
        if(req?.user?.admin!=true){
            throw new Error("Not a admin")
        }
		next();
	} catch (e) {
		const err = new AuthorizationError(e);
		next(err);
	}
};

module.exports = Admin;
