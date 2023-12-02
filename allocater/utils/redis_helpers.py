import redis
from allocater.env_config import ConfigUtil


configuration = ConfigUtil().get_config_data()

REDIS_URL = configuration.get("REDIS_URL")
REDIS_PASSWORD = configuration.get("REDIS_PASSWORD")
redis_client = redis.from_url(
            REDIS_URL, password=REDIS_PASSWORD, decode_responses=True, db=0
        )

class RedisUtils:
    def __init__(self):
        self.redis_client = redis_client

    def set(self, key, value):
        self.redis_client.set(key, value)

    def get(self, key):
        return self.redis_client.get(key)

    def hset(self, hash_name, key, value):
        self.redis_client.hset(hash_name, key, value)

    def hget(self, hash_name, key):
        return self.redis_client.hget(hash_name, key)

    def lpush(self, key, *values):
        self.redis_client.lpush(key, *values)

    def lrange(self, key, start, end):
        return self.redis_client.lrange(key, start, end)

    def sadd(self, key, *members):
        self.redis_client.sadd(key, *members)

    def checksmembers(self, key, value):
        return self.redis_client.sismember(key, value)

    def smembers(self, key):
        return self.redis_client.smembers(key)
    
    def sdel(self, key, *values):
        self.redis_client.srem(key, *values)

    def zadd(self, key, score, member):
        self.redis_client.zadd(key, {member: score})

    def zrange(self, key, start, end, with_scores=False):
        if with_scores:
            return self.redis_client.zrange(key, start, end, withscores=True)
        else:
            return self.redis_client.zrange(key, start, end)

    def delete(self, *keys):
        self.redis_client.delete(*keys)

    def get_ttl(self, key):
        return self.redis_client.ttl(key)
