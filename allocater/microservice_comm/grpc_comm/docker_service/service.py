import grpc
from proto import dock_pb2
from proto import dock_pb2_grpc
import json
from allocater.env_config import ConfigUtil

configuration = ConfigUtil().get_config_data()
dock_grpc_host = configuration.get("DOCK_GRPC_HOST")
dock_grpc_port = configuration.get("DOCK_GRPC_PORT")

class DockerService:
    def __init__(self) -> None:
        self.channel_host = f"{dock_grpc_host}:{dock_grpc_port}"
        self.channel =  grpc.insecure_channel(self.channel_host)
        self.stub = dock_pb2_grpc.DockerServiceStub(self.channel)
    
    def run_container(self,container_data):
        request = dock_pb2.ContainerDataRequest()
        request.data = json.dumps(container_data)
        response = self.stub.RunContainer(request)
        return json.loads(response.data)
    
    def start_container(self,container_id):
        request = dock_pb2.ContainerIDRequest()
        request.container_id = container_id
        response = self.stub.StartContainer(request)
        return json.loads(response.data)
    
    def stop_container(self,container_id):
        request = dock_pb2.ContainerIDRequest()
        request.container_id = container_id
        response = self.stub.StopContainer(request)
        return json.loads(response.data)
    
    def remove_container(self,container_id):
        request = dock_pb2.ContainerIDRequest()
        request.container_id = container_id
        response = self.stub.RemoveContainer(request)
        return json.loads(response.data)
    
    def inspect_container(self,container_id):
        request = dock_pb2.ContainerIDRequest()
        request.container_id = container_id
        response = self.stub.InspectContainer(request)
        return json.loads(response.data)