const knex = require("knex");

const {
	DB_NAME,
	DB_PASSWORD,
	DB_HOST,
	DB_USERNAME,
} = require("../../config/index");

const db_config = {
	client: "mysql2",
	connection: {
		host: DB_HOST,
		user: DB_USERNAME,
		password: DB_PASSWORD,
		database: DB_NAME,
	},
};

const db = knex(db_config);
module.exports = db;
