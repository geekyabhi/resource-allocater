const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const config = {
	PORT: process.env.PORT,
	DB_HOST: process.env.DBHOST,
	DB_USERNAME: process.env.DBUSERNAME,
	DB_PASSWORD: process.env.DBPASSWORD,
	DB_NAME: process.env.DBNAME,
	APP_SECRET: process.env.APP_SECRET,
	REDIS_URL: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
};

module.exports = config;
