const express = require("express");
const { PORT } = require("./config");
const expressApp = require("./express-engine");

const StartServer = async () => {
	try {
		const app = express();

		await expressApp(app);

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
