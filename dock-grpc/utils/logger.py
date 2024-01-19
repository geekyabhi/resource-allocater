import logging
from logging.handlers import RotatingFileHandler


class CustomerLogger:
    def __init__(
        self, logger_name=__name__, log_level=logging.ERROR, log_file="error_log.txt"
    ):
        self.log_file = log_file
        self.log_formatter = logging.Formatter(
            "%(asctime)s [%(levelname)s] [%(pathname)s:%(lineno)d]: %(message)s"
        )
        self.logger_name = logger_name
        self.log_level = log_level

    def setup_logger(self):
        logger = logging.getLogger(self.logger_name)
        logger.setLevel(self.log_level)
        log_handler = RotatingFileHandler(self.log_file, maxBytes=1e6, backupCount=3)
        log_handler.setFormatter(self.log_formatter)
        logger.addHandler(log_handler)
        return logger
