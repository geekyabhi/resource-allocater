import redis
from allocater.env_config import ConfigUtil
from .exceptions import CustomException

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
        try:
            self.redis_client.set(key, value)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def get(self, key):
        try:
            return self.redis_client.get(key)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def hset(self, hash_name, key, value):
        try:
            self.redis_client.hset(hash_name, key, value)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def hget(self, hash_name, key):
        try:
            return self.redis_client.hget(hash_name, key)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def lpush(self, key, *values):
        try:
            self.redis_client.lpush(key, *values)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def lrange(self, key, start, end):
        try:
            return self.redis_client.lrange(key, start, end)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def sadd(self, key, *members):
        try:
            self.redis_client.sadd(key, *members)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def checksmembers(self, key, value):
        try:
            return self.redis_client.sismember(key, value)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def smembers(self, key):
        try:
            return self.redis_client.smembers(key)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def sdel(self, key, *values):
        try:
            self.redis_client.srem(key, *values)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def zadd(self, key, score, member):
        try:
            self.redis_client.zadd(key, {member: score})
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def zrange(self, key, start, end, with_scores=False):
        try:
            if with_scores:
                return self.redis_client.zrange(key, start, end, withscores=True)
            else:
                return self.redis_client.zrange(key, start, end)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def delete(self, *keys):
        try:
            self.redis_client.delete(*keys)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def get_ttl(self, key):
        try:
            return self.redis_client.ttl(key)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)
