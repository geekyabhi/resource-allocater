const redis = require("redis");
const { REDIS_URL } = require("../../config");

class RedisUtil {
	constructor(REDIS_URL) {
		this.REDIS_URL = REDIS_URL;
	}

	ConnectRedis() {
		return new Promise(async (resolve, reject) => {
			try {
				console.log(REDIS_URL);
				const redisClient = redis.createClient({
					url: REDIS_URL,
				});
				await redisClient.connect();
				console.log(`Redis connected on ${REDIS_URL}`);
				this.redisClient = redisClient;
				resolve(redisClient);
			} catch (e) {
				reject(e);
			}
		});
	}

	RedisGET(key) {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.redisClient.get(key);
				resolve(data);
			} catch (e) {
				reject(e);
			}
		});
	}

	RedisSET(key, value, time = 30, nx = true) {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.redisClient.set(key, value, {
					EX: time,
					NX: nx,
				});
				resolve(data);
			} catch (e) {
				reject(e);
			}
		});
	}

	RedisDEL(key) {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.redisClient.del(key);
				resolve(data);
			} catch (e) {
				reject(e);
			}
		});
	}

	RedisTTL(key) {
		return new Promise(async (resolve, reject) => {
			try {
				const ttl = await this.redisClient.ttl(key);
				resolve(ttl);
			} catch (e) {
				reject(1);
			}
		});
	}
}

module.exports = { RedisUtil };
