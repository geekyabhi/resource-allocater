const express = require("express");
const {
	PORT,
	MESSAGE_QUEUE_URL,
	EXCHANGE_NAME,
	REDIS_URL,
	MAIL_BINDING_KEY,
} = require("./config");
require("colors");

const { ConnectDB } = require("./database/connect");
const expressApp = require("./express-engine");

const { Models } = require("./database/models");
const { RabbitMQ } = require("./utils/queue");
const { RedisUtil } = require("./utils/cache/");

const StartServer = async () => {
	try {
		const app = express();
		const dbConnection = await ConnectDB();
		// const rds = new RedisUtil();
		const rmq = new RabbitMQ(
			MESSAGE_QUEUE_URL,
			EXCHANGE_NAME,
			MAIL_BINDING_KEY
		);

		// await rmq.CreateChannel();

		await expressApp(app, rmq);

		app.listen(PORT, () => {
			console.log(`Customer server running to port ${PORT}`.yellow);
			console.log(`http://localhost:${PORT}`.yellow);
		}).on("error", (err) => {
			throw new Error(err);
		});
	} catch (e) {
		console.log(e);
		process.exit(0);
	}
};

StartServer();
