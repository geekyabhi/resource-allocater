const db = require("../connect/index");

const createUserTable = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			await db.schema.createTable("users", (table) => {
				table.uuid("id").primary().defaultTo(db.raw("uuid()"));
				table.string("first_name");
				table.string("last_name");
				table.string("email").unique();
				table.string("password", 355);
				table.string("gender", 255);
				table.string("salt", 255);
				table.boolean("verified").defaultTo(false);
				table.timestamp("created_at").defaultTo(db.fn.now());
			});
			resolve("User table created");
		} catch (e) {
			reject(`Error while creating user table :${e}`);
		}
	});
};

const createTables = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			await createUserTable();
			resolve("All tables created");
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = { createTables };
