const UserModel = require("./User");

class Models {
	constructor(db) {
		this.db = db;
		this.user = new UserModel();
	}

	async migrate(force) {
		return new Promise(async (resolve, reject) => {
			try {
				// console.log(this.db);
				await this.db.sync({ force: true, logging: console.log });
				resolve("Migration done successfully");
			} catch (e) {
				reject(`Error while making migrations ${e}`);
			}
		});
	}
}

module.exports = { Models, UserModel };
