const express = require("express");
const {
	PORT,
	MESSAGE_QUEUE_URL,
	EXCHANGE_NAME,
	REDIS_URL,
	MAIL_BINDING_KEY,
} = require("./config");

const db = require("./database/connect");
const expressApp = require("./express-engine");

const { Models } = require("./database/models");
const { RabbitMQ } = require("./utils/queue");
const { RedisUtil } = require("./utils/cache/");

const StartServer = async () => {
	try {
		const app = express();

		const models = new Models(db);
		const rmq = new RabbitMQ(
			MESSAGE_QUEUE_URL,
			EXCHANGE_NAME,
			MAIL_BINDING_KEY
		);
		const rds = new RedisUtil(REDIS_URL);

		await models.createTables();
		await rmq.CreateChannel();
		await rds.ConnectRedis();

		await expressApp(app, rds, rmq);

		app.listen(PORT, () => {
			console.log(`Customer server running to port ${PORT}`);
			console.log(`http://localhost:${PORT}`);
		}).on("error", (err) => {
			throw new Error(err);
		});
	} catch (e) {
		console.log(e);
		process.exit(0);
	}
};

StartServer();
