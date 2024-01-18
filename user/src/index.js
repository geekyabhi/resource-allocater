const express = require("express");
const {
	PORT
} = require("./config");
require("colors");
const { connectDB } = require("./database/connect");
const expressApp = require("./express-engine");

const { Models } = require("./database/models");


const StartServer = async () => {
	try {
		const app = express();
		const dbConnection = await connectDB();
		const models = new Models(dbConnection);

		await models.migrate(false);

		await expressApp(app);

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
