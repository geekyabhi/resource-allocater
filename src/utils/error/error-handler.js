const { AppError } = require("./app-errors");
const { logger: LogErrors } = require("../winston-logger/index");

class ErrorLogger {
	constructor() {}
	async logError(err) {
		LogErrors.log({
			private: true,
			level: "error",
			message: `Name : ${err.name} | Descriptiion : ${err.description} | Status Code : ${err.statusCode} | IsOperational : ${err.isOperational}`,
		});
		return false;
	}

	isTrustError(error) {
		if (error instanceof AppError) {
			return error.isOperational;
		} else {
			return false;
		}
	}
}

const ErrorHandler = async (err, req, res, next) => {
	const errorLogger = new ErrorLogger();
	// process.on("uncaughtException", (reason, promise) => {
	// 	console.log(reason, "UNHANDLED");
	// 	throw reason;
	// });

	// process.on("uncaughtException", (error) => {
	// 	errorLogger.logError(error);
	// 	if (errorLogger.isTrustError(err)) {
	// 		process.exit(1);
	// 	}
	// });

	if (err) {
		console.log(err);
		let arr = String(err).split(":");
		arr = arr.map((st) => st.trim());
		err.name = arr[1];
		err.description = arr[2];

		const error = {
			name: err.name,
			description: err.description,
			statusCode: err.statusCode,
			isOperational: err.isOperational,
			errorStack: err.errorStack,
			logError: err.logError,
		};

		await errorLogger.logError(error);
		if (errorLogger.isTrustError(err)) {
			const message = err.errorStack || error.name;
			return res.status(error.statusCode).json({
				error: message,
				description: error.description,
			});
		} else {
			console.log(`Something went wrong with flow`.red);
			process.exit(1);
		}
	}
	next();
};

module.exports = ErrorHandler;
