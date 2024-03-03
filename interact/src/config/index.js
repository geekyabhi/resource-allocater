const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const config = {
	PORT: process.env.PORT,
	DOCK_GRPC_HOST: process.env.DOCK_GRPC_HOST,
	DOCK_GRPC_PORT: process.env.DOCK_GRPC_PORT,
	VERIFIRE_GRPC_HOST :process.env.VERIFIRE_GRPC_HOST,
	VERIFIRE_GRPC_PORT :process.env.VERIFIRE_GRPC_PORT
};

module.exports = config;
