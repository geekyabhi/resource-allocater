from django.urls import path
from .viewsets import MachineAllocationViewSet

create_machine = MachineAllocationViewSet.as_view({'post':'create_allocation'})
get_allocation = MachineAllocationViewSet.as_view({'get':'get_allocation'})

urlpatterns = [
    path('create-allocation/', create_machine , name='create-allocation'),
    path('get-allocation/', get_allocation , name='get-allocation')
]
