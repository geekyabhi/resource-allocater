from pymongo import MongoClient
from allocater.env_config import ConfigUtil
from .exceptions import CustomException

configuration = ConfigUtil().get_config_data()


class MongoDBClient:
    def __init__(self) -> None:
        self.DB_URI = configuration.get("MONGODB_URI")
        self.client = self.get_db_connection()
        self.db_name = configuration.get("MONGODB_NAME")
        self.db = self.client[self.db_name]
        self.collection = self.db["machines"]

    def __del__(self) -> None:
        self.close_db_connection()

    def get_db_connection(self):
        client = MongoClient(self.DB_URI)
        return client

    def close_db_connection(self):
        self.client.close()

    def read(self, filter):
        try:
            result = self.collection.find_one(filter)
            return result
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def write(self, data):
        try:
            inserted_data = self.collection.insert_one(data)
            return inserted_data
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def update(self, filter_data, update_data):
        try:
            updated_result = self.collection.update_one(filter_data, update_data)
            return updated_result
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def delete(self, filter_data):
        try:
            deleted_result = self.collection.delete_one(filter_data)
            return deleted_result
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def read_many(self, filter):
        try:
            result = self.collection.find(filter)
            result_list = list(result)
            return result_list
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def write_many(self, data):
        try:
            inserted_data = self.collection.insert_many(data)
            return inserted_data
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def update_many(self, filter_data, update_data):
        try:
            updated_result = self.collection.update_many(filter_data, update_data)
            return updated_result
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def delete_many(self, filter_data):
        try:
            deleted_result = self.collection.delete_many(filter_data)
            return deleted_result
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)