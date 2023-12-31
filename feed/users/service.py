from utils.mongodb_helper import MongoDBClient
class UserService:
    def __init__(self) -> None:
        self.mongo_client = MongoDBClient('users')

    def find(self,**filters):
        try:
            data = self.mongo_client.read(filters)
            return data
        except Exception as e:
            raise Exception(e)