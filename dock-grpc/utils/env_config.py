import os
from dotenv import load_dotenv

load_dotenv()


class ConfigUtil:
    def __init__(self) -> None:
        self.config_keys = [
            "PORT"
        ]

    def get_config_data(self):
        config_dict = {key: os.getenv(key) for key in self.config_keys}
        return config_dict

