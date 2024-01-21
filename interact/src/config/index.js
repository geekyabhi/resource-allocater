const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const config = {
	PORT: process.env.PORT,
	DOCK_GRPC_HOST: process.env.DOCK_GRPC_HOST,
	DOCK_GRPC_PORT: process.env.DOCK_GRPC_PORT,
};

module.exports = config;
