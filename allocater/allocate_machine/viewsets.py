from rest_framework import viewsets, status
from rest_framework.response import Response
from datetime import datetime
from .serializers import MachineAllocationSerializer
from .models import MachineAllocation

class MachineAllocationViewSet(viewsets.ModelViewSet):
    serializer_class = MachineAllocationSerializer

    # Custom function to create a new machine allocation entry
    def create_allocation(self, request):
        data = {
            'machine_id': '123',
            'container_id': '456',
            'starting_date': '2023-08-25',
            'end_date': '2023-08-30',
            'is_active': True,
            'machine_name': 'Machine A',
            'container_name': 'Container X',
        }   

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_allocation(self,request) :
        machine_allocation = MachineAllocation.objects.filter()

        if not machine_allocation :
            return Response({'message': 'Machine allocation not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.serializer_class(machine_allocation,many=True)
        print(serializer)
        return Response(serializer.data)