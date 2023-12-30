const { UserService } = require("../../service");
const { AuthorizationError } = require("../../utils/error/app-errors");

const Admin = async (req, res, next) => {
	try {
        const user = await new UserService().FindOneUser({id:req.user.id})
        if(user?.admin!=true){
            throw new Error("Not a admin")
        }
		next();
	} catch (e) {
		const err = new AuthorizationError(e);
		next(err);
	}
};

module.exports = Admin;
