const { Sequelize } = require("sequelize");

const {
	DB_NAME,
	DB_PASSWORD,
	DB_HOST,
	DB_USERNAME,
} = require("../../config/index");

let DB = {};

const connectDB = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
				host: DB_HOST,
				dialect: "postgres",
				logging: false,
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
