from rest_framework import viewsets, status
from rest_framework.response import Response
from datetime import datetime
import json
from .serializers import MachineAllocationSerializer
from .models import MachineAllocation
from .service import MachineAllocationService

class MachineAllocationViewSet(viewsets.ModelViewSet):
    serializer_class = MachineAllocationSerializer
    service = MachineAllocationService()

    # Custom function to create a new machine allocation entry
    def create_allocation(self, request):

        raw_data  = request.body
        data = raw_data.decode('utf-8')
        data_json = json.loads(data)

        machine_id = data_json.get('machine_id')
        starting_date = data_json.get('starting_date')
        ending_date = data_json.get('ending_date')
        container_name = data_json.get('container_name')
        machine_data = self.service.create_machine(machine_id , starting_date , ending_date , container_name)
        print(machine_data)
        serializer = self.serializer_class(data = machine_data)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_allocation(self,request) :
        machine_allocation = MachineAllocation.objects.filter()

        if not machine_allocation :
            return Response({'message': 'Machine allocation not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.serializer_class(machine_allocation,many=True)
        print(serializer)
        return Response(serializer.data)