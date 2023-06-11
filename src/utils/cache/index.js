const { redisClient: client } = require("../../middlewere/cache/index");

class Cache {
	async AddKeyVal({ key, value, time }) {
		try {
			value = JSON.stringify(value);
			client.set(key, value, (err, rep) => {
				if (err) throw new Error(err);
			});
		} catch (e) {
			throw new Error(`Unable to add data ${e}`);
		}
	}

	async GetKeyVal({ key }) {
		try {
			client.get(key, (err, data) => {
				if (err) throw new Error(err);
				return data;
			});
		} catch (e) {
			throw new Error(`Unable to get data ${e}`);
		}
	}
}

module.exports = Cache;
