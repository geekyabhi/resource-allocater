from docker_service.helpers import DockerManager
from utils.mongodb import MongoDBClient
from utils.ports_helpers import PortUtil

class MachineAllocationService:
    def __init__(self) -> None:
        self.docker = DockerManager()
        self.mongo_client = MongoDBClient()
        self.ports_util = PortUtil()


    def create_machine(self , machine_id , starting_date , ending_date , container_name):
        try:
            data = self.mongo_client.read({'machine_id':machine_id})
            image = data.get('image_name')
            default_port = data.get('default_port')
            mapping_port = self.ports_util.add_port_with_base(default_port)
            print(mapping_port)
            container_data = self.docker.start_container(image,container_name,{f'{default_port}':f'{mapping_port}'})
            container_data['starting_date'] = starting_date
            container_data['ending_date'] = ending_date
            container_data['is_active'] = True
            container_data['machine_id'] =machine_id
            container_data['machine_name'] = image
            container_data['port_used'] = mapping_port
            container_data['status'] = 'active'
            return container_data
        except Exception as e:
            print(e)
            # raise Exception(e)
    
    def delete_machine(self, instance_data) :
        try:
            container_id = instance_data.get('container_id')
            port_used = instance_data.get('port_used')
            self.docker.remove_container_by_id(container_id)
            self.ports_util.remove_port(int(port_used))
        except Exception as e:
            print(e)