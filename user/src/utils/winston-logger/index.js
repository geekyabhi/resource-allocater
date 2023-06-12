const winston = require("winston");
const winstonTimestampColorize = require("winston-timestamp-colorize");

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

const level = () => {
	const env = process.env.NODE_ENV || "development";
	const isDevelopment = env === "development";
	return isDevelopment ? "debug" : "warn";
};

const colors = {
	error: "red",
	warn: "yellow",
	info: "green",
	http: "magenta",
	debug: "white",
	timestamp: "cyan",
};

winston.addColors(colors);

const format = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
	winston.format.colorize({ all: true }),
	winstonTimestampColorize({ color: "cyan" }),
	winston.format.printf((info) => `[ ${info.timestamp} ]  ${info.message}`)
);

const transports = [
	new winston.transports.Console(),
	new winston.transports.File({ filename: "app_error.log" }),
];

const logger = winston.createLogger({
	level: level(),
	levels,
	format,
	transports,
});

module.exports = { logger };
