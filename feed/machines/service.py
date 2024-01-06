from utils.mongodb_helper import MongoDBClient
from utils.exceptions import CustomException


class MachineService:
    def __init__(self) -> None:
        self.mongo_client = MongoDBClient("machines")

    def find(self, **filters):
        try:
            data = self.mongo_client.read(filters)
            return data
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)
