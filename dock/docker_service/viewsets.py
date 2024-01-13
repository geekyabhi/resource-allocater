from rest_framework import viewsets, status
from rest_framework.response import Response
import json
from .service import DockerService
from utils.exceptions import CustomException


class DockerViewSet(viewsets.ModelViewSet):
    service = DockerService()

    def run_container(self, request):
        try:
            raw_data = request.body
            data = raw_data.decode("utf-8")
            data_json = json.loads(data)

            container_data = self.service.run_container(**data_json)
            return Response(
                {"data": container_data, "success": True},
                status=status.HTTP_201_CREATED,
            )
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def stop_container(self, request, container_id):
        try:
            data = self.service.stop_container_by_id(container_id)
            return Response({"data":data,"success": True}, status=status.HTTP_200_OK)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def start_container(self, request , container_id):
        try:
            data = self.service.start_container_by_id(container_id)
            return Response({"data":data,"success": True}, status=status.HTTP_200_OK)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def inspect_container(self, request , container_id):
        try:
            data = self.service.inspect_container_by_id(container_id)
            return Response({"data":data,"success": True}, status=status.HTTP_200_OK)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)
    
    def remove_container(self, request , container_id):
        try:
            data = self.service.remove_container_by_id(container_id)
            return Response({"data":data,"success": True}, status=status.HTTP_200_OK)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)