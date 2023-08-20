const mongoose = require("mongoose");
require("colors");
const { DB_URL } = require("../../config");

const ConnectDB = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { connection } = await mongoose.connect(encodeURI(DB_URL), {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
			console.log(
				`Database connected on port ${connection.port} on host ${connection.host}`
					.cyan
			);
			resolve("Database connected");
		} catch (e) {
			console.log(e);
			reject("DB error while connecting");
		}
	});
};

module.exports = { ConnectDB };
