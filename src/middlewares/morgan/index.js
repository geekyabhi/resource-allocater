const morgan = require("morgan");
const { logger } = require("../../utils/winston-logger/index");

const stream = {
	write: (message) => logger.http(message),
};

const skip = () => {
	const env = process.env.NODE_ENV || "dev";
	return env !== "dev";
};

const format = (tokens, req, res) => {
	return [
		tokens["method"](req, res),
		tokens["url"](req, res),
		tokens["status"](req, res),
		tokens["res"](req, res, "content-length"),
		"-",
		tokens["response-time"](req, res),
		"ms",
	].join(" ");
};

const morganMiddleware = morgan(format, { stream, skip });

module.exports = morganMiddleware;
