const { ValidateSignature } = require("../../utils/functions");
const { AuthorizationError } = require("../../utils/error/app-errors");

const Auth = async (req, res, next) => {
	try {
		await ValidateSignature(req);
		next();
	} catch (e) {
		const err = new AuthorizationError(e);
		next(err);
	}
};

module.exports = Auth;
