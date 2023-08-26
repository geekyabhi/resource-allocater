from docker_service.helpers import DockerManager
from utils.mongodb import MongoDBClient

class MachineAllocationService:
    def __init__(self) -> None:
        self.docker = DockerManager()
        self.mongo_client = MongoDBClient()


    def create_machine(self , machine_id , starting_date , ending_date , container_name):
        try:
            data = self.mongo_client.read({'machine_id':machine_id})
            image = data.get('image_name')
            default_port = data.get('default_port')
            mapping_port = 27017
            container_data = self.docker.start_container(image,container_name,{f'{mapping_port}':f'{default_port}'})
            container_data['starting_date'] = starting_date
            container_data['ending_date'] = ending_date
            container_data['is_active'] = True
            container_data['machine_id'] =machine_id
            container_data['machine_name'] = image
            return container_data
        except Exception as e:
            print(e)
            # raise Exception(e)
