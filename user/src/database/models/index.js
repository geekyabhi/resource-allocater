const UserModel = require("./User");

class Models {
	constructor(db) {
		this.db = db;
		this.userModel = new UserModel(db, "users");
	}

	async ifTableExists(tableName) {
		try {
			const tableExists = await this.db.schema.hasTable(tableName);
			return tableExists;
		} catch (e) {
			return false;
		}
	}

	async createTables() {
		return new Promise(async (resolve, reject) => {
			try {
				if (!(await this.ifTableExists(this.userModel.tableName)))
					await this.userModel.createUserTable();
				resolve("All tables created");
			} catch (e) {
				reject(e);
			}
		});
	}
}

module.exports = { Models };
