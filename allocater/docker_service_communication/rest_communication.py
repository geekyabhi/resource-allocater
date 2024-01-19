import json
from allocater.env_config import ConfigUtil
from utils.api_communication import send_request

configuration = ConfigUtil().get_config_data()
dock_host = configuration.get("DOCK_HOST")
dock_port = configuration.get("DOCK_PORT")

class DockerService:
    def __init__(self) -> None:
        self.channel_host = f"{dock_host}:{dock_port}"
    
    def run_container(self,container_data):
        response = send_request(f"{self.dock_host}/docker/run-container/" , "POST" , json.dumps(container_data))
        container_details = response.get('data')
        return container_details
    
    def start_container(self,container_id):
        response = send_request(f"{self.dock_host}/docker/start-container/{container_id}","POST")
        return response.get('data')
    
    def stop_container(self,container_id):
        response = send_request(f"{self.dock_host}/docker/stop-container/{container_id}","POST")
        return response.get('data')
    
    def remove_container(self,container_id):
        response = send_request(f"{self.dock_host}/docker/remove-container/{container_id}", "DELETE")
        return response.get('data')
    
    # def inspect_container(self,container_id):
    #     request = dock_pb2.ContainerIDRequest()
    #     request.container_id = container_id
    #     response = self.stub.InspectContainer(request)
    #     return json.loads(response.data)
