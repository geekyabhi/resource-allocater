from utils.mongodb_helper import MongoDBClient
class MachineService:
    def __init__(self) -> None:
        self.mongo_client = MongoDBClient('machines')

    def find(self,**filters):
        try:
            data = self.mongo_client.read(filters)
            return data
        except Exception as e:
            raise Exception(e)