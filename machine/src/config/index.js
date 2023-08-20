const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const config = {
	PORT: process.env.PORT,
	DB_URL: process.env.DB_URL,
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
};

module.exports = config;
