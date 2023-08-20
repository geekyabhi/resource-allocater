const Redis = require("ioredis");
const {
	REDIS_URL,
	REDIS_PASSWORD,
	REDIS_HOST,
	REDIS_PORT,
} = require("../../config");

class RedisUtil {
	constructor() {
		this.redis = this.ConnectRedis();
	}

	ConnectRedis() {
		const redisClient = new Redis({
			host: REDIS_HOST,
			port: REDIS_PORT,
			password: REDIS_PASSWORD,
			showFriendlyErrorStack: true,
			retryStrategy: (times) => {
				if (times <= 3) {
					console.log("Retrying connection...");
					return 1000; // Retry after 1 second
				}
				return null; // Do not retry after 3 attempts
			},
		});
		console.log(`Redis connected`.magenta);
		return redisClient;
	}

	RedisGET(key) {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.redis.get(key);
				resolve(data);
			} catch (e) {
				reject(e);
			}
		});
	}

	RedisSET(key, value, time = 30, nx = true) {
		return new Promise(async (resolve, reject) => {
			try {
				let data = null;
				if (nx) {
					data = await this.redis.set(key, value, "EX", time);
				} else {
					data = await this.redis.set(key, value);
				}
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
				const ttl = await this.redis.ttl(key);
				resolve(ttl);
			} catch (e) {
				reject(e);
			}
		});
	}
}

module.exports = { RedisUtil };
