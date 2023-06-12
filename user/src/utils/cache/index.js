const redis = require("redis");
const { REDIS_URL } = require("../../config/");

const ConnectRedis = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			console.log(REDIS_URL);
			const redisClient = redis.createClient({
				url: REDIS_URL,
			});
			await redisClient.connect();
			console.log(`Redis connected on ${REDIS_URL}`);
			resolve(redisClient);
		} catch (e) {
			reject(e);
		}
	});
};

const RedisGET = (redisClient, key) => {
	return new Promise(async (resolve, reject) => {
		try {
			const data = await redisClient.get(key);
			resolve(data);
		} catch (e) {
			reject(e);
		}
	});
};

const RedisSET = (redisClient, key, value, time = 30, nx = true) => {
	return new Promise(async (resolve, reject) => {
		try {
			const data = await redisClient.set(key, value, {
				EX: time,
				NX: nx,
			});
			resolve(data);
		} catch (e) {
			reject(e);
		}
	});
};

const RedisDEL = (redisClient, key) => {
	return new Promise(async (resolve, reject) => {
		try {
			const data = await redisClient.del(key);
			resolve(data);
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = { ConnectRedis, RedisSET, RedisGET, RedisDEL };
