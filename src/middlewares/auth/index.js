const { ValidateSignature } = require("../../utils");
const { AuthorizationError } = require("../../utils/error/app-errors");

const Auth = async (req, res, next) => {
	try {
		const signature = req.get("Authorization");
		if (!signature) throw new AuthorizationError("No token found");
		const payload = await ValidateSignature(signature);
		if (!payload) throw new AuthorizationError("In valid Payload");
		req.user = payload;
		next();
	} catch (e) {
		const err = new AuthorizationError(e);
		next(err);
	}
};

module.exports = Auth;
