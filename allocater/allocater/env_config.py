from decouple import config

ENV_FILE_NAME = ".env"


class ConfigUtil:
    def __init__(self) -> None:
        self.config_keys = [
            "DB_NAME",
            "DB_USER",
            "DB_PASSWORD",
            "DB_HOST",
            "DB_PORT",
            "MONGODB_URI",
            "MONGODB_NAME"
        ]
        config._load(".env")

    def get_config_data(self):
        config_dict = {}
        for key in self.config_keys:
            config_dict[key] = config(key)
        return config_dict
