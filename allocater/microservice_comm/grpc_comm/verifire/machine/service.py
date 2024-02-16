import grpc
import machine_pb2
import machine_pb2_grpc
from allocater.env_config import ConfigUtil
import json

configuration = ConfigUtil().get_config_data()
verifire_grpc_host = configuration.get("VERIFIRE_GRPC_HOST")
verifire_grpc_port = configuration.get("VERIFIRE_GRPC_PORT")


class MachineService:
    def __init__(self) -> None:
        self.channel_host = f"{verifire_grpc_host}:{verifire_grpc_port}"
        self.channel = grpc.insecure_channel(self.channel_host)
        self.stub = machine_pb2_grpc.MachineServiceStub(self.channel)

    def get_machine(self, machine_data):
        request = machine_pb2.MachineRequestData()
        if isinstance(machine_data, dict):
            machine_data = json.dumps(machine_data)
        request.data = machine_data
        response = self.stub.GetMachineData(request)
        if not response.data:
            return dict()
        response = json.loads(response.data)

        return {
            "background_image": response.get('BackGroundImage'),
            "created_at": response.get('CreatedAt'),
            "default_port": response.get('DefaultPort'),
            "image": response.get('Image'),
            "image_name": response.get('ImageName'),
            "is_active": response.get('IsActive'),
            "machine_id": response.get('MachineId'),
            "name": response.get('Name'),
            "props": response.get('Props'),
            "updated_at": response.get('UpdatedAt'),
        }
