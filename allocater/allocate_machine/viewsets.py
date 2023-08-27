from rest_framework import viewsets, status
from rest_framework.response import Response
from datetime import datetime
import json
from .serializers import MachineAllocationSerializer
from .models import MachineAllocation
from .service import MachineAllocationService
from middlewere.auth_layer import jwt_auth_required
from django.utils.decorators import method_decorator


class MachineAllocationViewSet(viewsets.ModelViewSet):
    serializer_class = MachineAllocationSerializer
    service = MachineAllocationService()

    @method_decorator(jwt_auth_required)
    def create_allocation(self, request):
        raw_data = request.body
        data = raw_data.decode("utf-8")
        data_json = json.loads(data)

        machine_id = data_json.get("machine_id")
        starting_date = data_json.get("starting_date")
        ending_date = data_json.get("ending_date")
        container_name = data_json.get("container_name")
        uid = request.user.get("id")
        machine_data = self.service.create_machine(
            machine_id, starting_date, ending_date, container_name, uid
        )
        serializer = self.serializer_class(data=machine_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @method_decorator(jwt_auth_required)
    def remove_allocation(self, request):
        query_data = request.query_params

        container_id = query_data.get("container_id")
        machine_allocations = MachineAllocation.objects.filter(
            container_id=container_id
        ).first()
        ser_machine_allocations = self.serializer_class(machine_allocations)
        self.service.delete_machine(ser_machine_allocations.data)
        serializer = self.serializer_class(
            machine_allocations,
            data={"status": "killed", "is_active": False},
            partial=True,
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @method_decorator(jwt_auth_required)
    def get_allocation(self, request):
        query_data = request.query_params.dict()
        uid = request.user.get("id")
        query_data["uid"] = uid
        print(query_data)
        machine_allocation = MachineAllocation.objects.filter(**query_data)
        serializer = self.serializer_class(machine_allocation, many=True)
        return Response(serializer.data)

    @method_decorator(jwt_auth_required)
    def stop_allocation(self, request):
        query_data = request.query_params.dict()
        container_id = query_data.get("container_id")
        machine_allocations = MachineAllocation.objects.filter(
            container_id=container_id
        ).first()
        ser_machine_allocations = self.serializer_class(machine_allocations)
        self.service.stop_machine(ser_machine_allocations.data)
        serializer = self.serializer_class(
            machine_allocations,
            data={"status": "stopped", "is_active": False},
            partial=True,
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @method_decorator(jwt_auth_required)
    def restart_allocation(self, request):
        query_data = request.query_params.dict()
        container_id = query_data.get("container_id")
        machine_allocations = MachineAllocation.objects.filter(
            container_id=container_id
        ).first()
        ser_machine_allocations = self.serializer_class(machine_allocations)
        self.service.start_machine(ser_machine_allocations.data)
        serializer = self.serializer_class(
            machine_allocations,
            data={"status": "active", "is_active": True},
            partial=True,
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
