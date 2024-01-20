const Redis = require("ioredis");
const {
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
			// password: REDIS_PASSWORD,
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
				if(!data){
					resolve(null)
				}else{
					resolve(JSON.parse(data));
				}
			} catch (e) {
				reject(e);
			}
		});
	}

	RedisSET(key, value, time = 30, nx = true) {
		return new Promise(async (resolve, reject) => {
			try {
				let val = JSON.stringify(value)
				let data = null;
				if (nx) {
					data = await this.redis.set(key, val, "EX", time);
				} else {
					data = await this.redis.set(key, val);
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
				const data = await this.redis.del(key);
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
