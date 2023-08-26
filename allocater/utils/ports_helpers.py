from .redis_helpers import RedisUtils


class PortUtil:
    def __init__(self) -> None:
        self.redis = RedisUtils()

    def add_port_with_base(self, base_port):
        new_port = None

        unused_ports = self.redis.smembers("unused_port")
        for port in unused_ports:
            if port > base_port and port < base_port + 1000:
                new_port = port
                break

        if new_port is not None:
            self.redis.sdel("unused_port", new_port)
            self.redis.sadd("used_port", new_port)
            return new_port

        for i in range(1,1001):
            temp_new_port = base_port + i
            if not self.redis.checksmembers("used_port", temp_new_port):
                new_port = temp_new_port
                break

        if new_port is not None:
            self.redis.sadd("used_port", new_port)
            return new_port

        return new_port

    def remove_port(self,port):
        self.redis.sdel("used_port", port)
        self.redis.sadd("unused_port", port)
