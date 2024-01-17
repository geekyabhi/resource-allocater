import os
from dotenv import load_dotenv

load_dotenv()


class ConfigUtil:
    def __init__(self) -> None:
        self.config_keys = [
            "MONGODB_URI",
            "MONGODB_NAME",
            "APP_SECRET",
            "CASSANDRA_HOST",
            "CASSANDRA_KEY_SPACE",
            "CASSANDRA_TEST_KEY_SPACE",
        ]

    def get_config_data(self):
        config_dict = {key: os.getenv(key) for key in self.config_keys}
        return config_dict
