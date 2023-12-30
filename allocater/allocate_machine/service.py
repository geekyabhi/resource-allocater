from docker_service.helpers import DockerManager
from utils.mongodb import MongoDBClient
from utils.ports_helpers import PortUtil
from .models import MachineAllocation

class MachineAllocationService:
    def __init__(self) -> None:
        self.model = MachineAllocation()
        self.docker = DockerManager()
        self.mongo_client = MongoDBClient()
        self.ports_util = PortUtil()

    def create_machine(
        self, machine_id, starting_date, ending_date, container_name, uid
    ):
        try:
            data = self.mongo_client.read({"machine_id": machine_id})
            image = data.get("image_name")
            default_port = data.get("default_port")
            container , mapping_port = self.docker.start_container(
                image, container_name, default_port
            )
            allocation_data = {
                "machine_id" : machine_id , 
                "container_id" : str(container.short_id) , 
                "starting_date" : starting_date ,
                "end_date" : ending_date ,
                "is_active" : True ,
                "status" : "active" ,
                "machine_name" : image ,
                "container_name" : container.name , 
                "port_used" : mapping_port ,
                "uid" : uid
            }
            allocated_machine = self.model.add(allocation_data)
            return allocated_machine
        except Exception as e:
            raise Exception(e)

    def delete_machine(self, container_id):
        try:
            container_data = self.model.get({"container_id":container_id})
            self.docker.remove_container_by_id(container_id)
            self.ports_util.remove_port(int(container_data.get("port_used")))
            self.model.delet(container_id)
        except Exception as e:
            raise Exception(e)

    def stop_machine(self, container_id):
        try:
            self.docker.stop_container_by_id(container_id)
            data = self.model.update(container_id,{"status":"stopped"})
            return data
        except Exception as e:
            raise Exception(e)

    def start_machine(self, container_id):
        try:
            self.docker.start_stopped_container(container_id)
            data=self.model.update(container_id,{"status":"active"})
            return data
        except Exception as e:
            raise Exception(e)

    def get_machine(self ,container_id):
        try:
            data = self.model.get({"container_id":container_id})
            return data
        except Exception as e:
            raise Exception(e)
        
    def get_all_machines(self,filters):
        try:
            data = self.model.get_many(filters)
            return data
        except Exception as e:
            raise Exception(e)