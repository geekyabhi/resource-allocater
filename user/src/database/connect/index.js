const { Sequelize } = require("sequelize");

const {
	DB_NAME,
	DB_PASSWORD,
	DB_HOST,
	DB_USERNAME,
	DB_PORT,
} = require("../../config/index");

let DB = {};

const connectDB = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const sequelize = new Sequelize({
				dialect: "mysql", // Change the dialect to MySQL
				logging: true,
				host: DB_HOST,
				port: DB_PORT, // Default MySQL port
				username: DB_USERNAME,
				password: DB_PASSWORD,
				database: DB_NAME,
			});
			await sequelize.authenticate();
			console.log("Database connected".cyan);
			DB["connection"] = sequelize;
			resolve(sequelize);
		} catch (e) {
			console.log(e);
			reject(`Error while connecting db ${e}`);
		}
	});
};

module.exports = { connectDB, DB };
