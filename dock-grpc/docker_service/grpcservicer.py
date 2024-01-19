import dock_pb2
import dock_pb2_grpc
import json
from .service import DockerService
from utils.exceptions import CustomException

class DockerServiceServicer(dock_pb2_grpc.DockerServiceServicer):
    def __init__(self) -> None:
        super().__init__()
        self.service = DockerService()

    def RunContainer(self,request,context) :
        response = dock_pb2.ContainerDataResponse()
        try:
            container_data = json.loads(request.data)
            container_response = self.service.run_container(**container_data)
            response.data = json.dumps(container_response)        
        except CustomException as e:
            error = {
                'error':str(e)
            }
            response.data = json.dumps(error)
        return response

    def StartContainer(self,request,context):
        response = dock_pb2.ContainerDataResponse()
        try:
            container_id = request.container_id
            done = self.service.start_container_by_id(container_id)
            container_response = {
                'done':done
            }
            response.data = json.dumps(container_response)
        except CustomException as e:
            error = {
                'error':str(e)
            }
            response.data = json.dumps(error)
        return response
    
    def StopContainer(self,request,context):
        response = dock_pb2.ContainerDataResponse()
        try:
            container_id = request.container_id
            done = self.service.stop_container_by_id(container_id)
            container_response = {
                'done':done
            }
            response.data = json.dumps(container_response)
        except CustomException as e:
            error = {
                'error':str(e)
            }
            response.data = json.dumps(error)
        return response

    def RemoveContainer(self,request,context):
        response = dock_pb2.ContainerDataResponse()
        try:
            container_id = request.container_id
            done = self.service.remove_container_by_id(container_id)
            container_response = {
                'done':done
            }
            response.data = json.dumps(container_response)
        except CustomException as e:
            error = {
                'error':str(e)
            }
            response.data = json.dumps(error)
        return response
    
    def InspectContainer(self,request,context):
        response = dock_pb2.ContainerDataResponse()
        try:
            container_id = request.container_id
            container_response = self.service.inspect_container_by_id(container_id)
            response.data = json.dumps(container_response)
        except CustomException as e:
            error = {
                'error':str(e)
            }
            response.data = json.dumps(error)
        return response

    def StreamContainerLogs(self,request,context):
        container_id = request.container_id
        for log_line in self.service.stream_container_logs_by_id(container_id):
            response = dock_pb2.Log(log_line=log_line)
            yield response
