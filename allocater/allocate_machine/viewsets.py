from rest_framework import viewsets, status
from rest_framework.response import Response
import json
from .service import MachineAllocationService
from middlewere.auth_layer import auth_layer
from middlewere.verified_layer import verify_user
from django.utils.decorators import method_decorator
from utils.exceptions import CustomException


class MachineAllocationViewSet(viewsets.ModelViewSet):
    service = MachineAllocationService()

    @method_decorator(auth_layer)
    @method_decorator(verify_user)
    def create_allocation(self, request):
        try:
            raw_data = request.body
            data = raw_data.decode("utf-8")
            data_json = json.loads(data)

            machine_id = data_json.get("machine_id")
            starting_date = data_json.get("starting_date")
            ending_date = data_json.get("ending_date")
            container_name = data_json.get("container_name")
            uid = request.user.get("id")
            allocated_machine_data = self.service.create_machine(
                machine_id, starting_date, ending_date, container_name, uid
            )
            return Response(
                {"data": allocated_machine_data, "success": True},
                status=status.HTTP_201_CREATED,
            )
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    @method_decorator(auth_layer)
    @method_decorator(verify_user)
    def remove_allocation(self, request, container_id):
        try:
            self.service.delete_machine(container_id)
            return Response({"success": True}, status=status.HTTP_200_OK)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    @method_decorator(auth_layer)
    @method_decorator(verify_user)
    def get_allocation(self, request):
        try:
            query_data = request.query_params.dict()
            uid = request.user.get("id")
            query_data["uid"] = uid
            data = self.service.get_all_machines(query_data)
            return Response({"data": data, "success": True}, status=status.HTTP_200_OK)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    @method_decorator(auth_layer)
    @method_decorator(verify_user)
    def stop_allocation(self, request, container_id):
        try:
            data = self.service.stop_machine(container_id)
            return Response({"data": data, "success": True}, status=status.HTTP_200_OK)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    @method_decorator(auth_layer)
    @method_decorator(verify_user)
    def restart_allocation(self, request, container_id):
        try:
            data = self.service.start_machine(container_id)
            return Response({"data": data, "success": True}, status=status.HTTP_200_OK)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)
