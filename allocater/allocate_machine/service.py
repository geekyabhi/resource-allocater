import json
from datetime import datetime

from utils.mongodb import MongoDBClient
from allocater.env_config import ConfigUtil
from .models import MachineAllocation
from utils.exceptions import CustomException
from utils.api_communication import send_request

configuration = ConfigUtil().get_config_data()
dock_host = configuration.get("DOCK_HOST")
dock_port = configuration.get("DOCK_PORT")

class MachineAllocationService:
    def __init__(self) -> None:
        self.model = MachineAllocation()
        self.mongo_client = MongoDBClient()
        self.dock_host = f"{dock_host}:{dock_port}"

    def create_machine(self, **data):
        try:
            machine_id = data.get('machine_id')
            image_detail = self.mongo_client.read({"machine_id": machine_id})
            props = image_detail.get('props')
            environment = dict()

            for properties in props :
                if props.get(properties,{}).get('required',False) and properties not in data :
                    raise CustomException(f"{properties} is a required property for this machine", status_code=400)
            for key in data :
                if key in [properties for properties in props ] :
                    environment[key] = data.get(key)
            
            container_config = {
                "image":image_detail.get('image_name'),
                "default_port":image_detail.get('default_port'),
            }
            if data.get('name') :
                container_config["container_name"] =  data.get('name')
            if environment :
                container_config['environment'] = environment

            response = send_request(f"{self.dock_host}/docker/run-container/" , "POST" , json.dumps(container_config))
            container_details = response.get('data')

            allocation_data = {
                "machine_id": machine_id,
                "container_id": container_details.get('id'),
                "is_active": container_details.get('status')=='created',
                "starting_date": datetime.now(),
                "status": "active",
                "machine_name": container_details.get('image'),
                "container_name": container_details.get('name'),
                "port_used": container_details.get('port_used'),
                "uid": data.get('uid'),
            }
            allocated_machine = self.model.add(allocation_data)
            return allocated_machine
        except CustomException as e:
            raise CustomException(e,status_code=e.status_code)

    def delete_machine(self, container_id):
        try:
            send_request(f"{self.dock_host}/docker/remove-container/{container_id}", "DELETE")
            self.model.delet(container_id)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def stop_machine(self, container_id):
        try:
            send_request(f"{self.dock_host}/docker/stop-container/{container_id}","POST")
            data = self.model.update(container_id, {"status": "stopped"})
            return data
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def start_machine(self, container_id):
        try:
            send_request(f"{self.dock_host}/docker/start-container/{container_id}","POST")
            data = self.model.update(container_id, {"status": "active"})
            return data
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def get_machine(self, container_id):
        try:
            data = self.model.get({"container_id": container_id})
            return data
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def get_all_machines(self, filters):
        try:
            data = self.model.get_many(filters)
            return data
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)
