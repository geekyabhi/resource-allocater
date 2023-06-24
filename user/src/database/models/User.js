class UserModel {
	constructor(db, name) {
		this.db = db;
		this.tableName = name;
	}

	createUserTable = async () => {
		return new Promise(async (resolve, reject) => {
			try {
				await this.db.schema.createTable(this.tableName, (table) => {
					table.uuid("id").primary();
					table.string("first_name");
					table.string("last_name");
					table.string("email").unique();
					table.string("password", 355);
					table.string("phone_number", 355);
					table.string("gender", 255);
					table.string("salt", 255);
					table.boolean("verified").defaultTo(false);
					table.boolean("email_notification").defaultTo(true);
					table.boolean("sms_notification").defaultTo(true);
					table.timestamp("created_at").defaultTo(this.db.fn.now());
				});
				resolve("User table created");
			} catch (e) {
				reject(`Error while creating user table :${e}`);
			}
		});
	};
}

module.exports = UserModel;
