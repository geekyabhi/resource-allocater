const express = require("express");
const { PORT } = require("./config");
const { createTables } = require("./database/models");
const expressApp = require("./express-engine");
const { ConnectRedis } = require("./utils/cache/index");
const StartServer = async () => {
	try {
		const app = express();

		await createTables();
		const redisClient = await ConnectRedis();
		await expressApp(app, redisClient);

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
