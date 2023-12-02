const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const config = {
	PORT: process.env.PORT,
	DB_HOST: process.env.DBHOST,
	DB_USERNAME: process.env.DBUSERNAME,
	DB_PASSWORD: process.env.DBPASSWORD,
	DB_NAME: process.env.DBNAME,
	DB_PORT: process.env.DBPORT,
	APP_SECRET: process.env.APP_SECRET,
	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: process.env.REDIS_PORT,
	REDIS_URL: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD,
	EXCHANGE_NAME: "ECOMMERCE",
	MESSAGE_QUEUE_URL: process.env.RABBIT_MQ_URL,
	SHOPPING_BINDING_KEY: "SHOPPING_SERVICE",
	CUSTOMER_BINDING_KEY: "CUSTOMER_SERVICE",
	PAYMENT_BINDING_KEY: "PAYMENT_SERVICE",
	PRODUCT_BINDING_KEY: "PRODUCT_SERVICE",
	MAIL_BINDING_KEY: "MAIL_SERVICE",
	QUEUE_NAME: "ECOMMERCE_QUEUE",
	KAFKA_BROKER_URI: process.env.KAFKA_BROKER_URI,
	KAFKA_USER_NAME: process.env.KAFKA_USER_NAME,
	KAFKA_PASSWORD: process.env.KAFKA_PASSWORD,
};

module.exports = config;
