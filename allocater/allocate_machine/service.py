import json
from datetime import datetime

from utils.mongodb import MongoDBClient
from .models import MachineAllocation
from utils.exceptions import CustomException
from utils.kafka_helpers import KafkaProducerHandler
from docker_service_communication.grpc_communication import DockerService
from microservice_comm.grpc_comm.verifire.machine.service import MachineService
class MachineAllocationService:
    def __init__(self) -> None:
        self.model = MachineAllocation()
        self.machine_service = MachineService()
        self.mongo_client = MongoDBClient()
        self.docker_service = DockerService()
        self.kafka = KafkaProducerHandler()

    def create_machine(self, **data):
        try:
            machine_id = data.get('machine_id')
            image_detail = self.machine_service.get_machine(machine_data=machine_id)
            if not image_detail:
                raise CustomException("No such machine ",status_code=400)
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
            container_details = self.docker_service.run_container(container_config)

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
            allocation_data['starting_date'] = allocation_data.get('starting_date',datetime.now()).strftime("%Y-%m-%d %H:%M:%S")
            kafka_obj = {
                'event':"ADD_DATA",
                'data': allocation_data
            }
            self.kafka.produce_message("allocation-data",json.dumps(kafka_obj))
            return allocated_machine
        except CustomException as e:
            raise CustomException(e,status_code=e.status_code)

    def delete_machine(self, container_id):
        try:
            res = self.docker_service.remove_container(container_id)
            if not res.get('error'):
                self.model.delet(container_id)
            kafka_obj = {
                'event':"DELETE_DATA",
                'data' : {
                    'container_id':container_id
                }
            }
            self.kafka.produce_message("allocation-data",json.dumps(kafka_obj))
            return res
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def stop_machine(self, container_id):
        try:
            res = self.docker_service.stop_container(container_id)
            if not res.get('error'):
                data = self.model.update(container_id, {"status": "stopped"})
                data['starting_date'] = datetime.strftime(data.get('starting_date',datetime.now()),"%m/%d/%Y, %H:%M:%S")
                kafka_obj = {
                    'event':"UPDATE_DATA",
                    'data' : data
                }
                self.kafka.produce_message("allocation-data",json.dumps(kafka_obj))
                return data
            return res
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def start_machine(self, container_id):
        try:
            res = self.docker_service.start_container(container_id)
            if not res.get('error'):
                data = self.model.update(container_id, {"status": "active"})
                data['starting_date'] = datetime.strftime(data.get('starting_date',datetime.now()),"%m/%d/%Y, %H:%M:%S")
                kafka_obj = {
                    'event':"UPDATE_DATA",
                    'data' : data
                }
                self.kafka.produce_message("allocation-data",json.dumps(kafka_obj))
                return data
            return res
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

    def inspect_machine(self , container_id):
        try:
            res = self.docker_service.inspect_container(container_id)
            return res
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)