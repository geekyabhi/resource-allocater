from django.urls import path
from .viewsets import MachineAllocationViewSet

create_machine = MachineAllocationViewSet.as_view({"post": "create_allocation"})
get_allocation = MachineAllocationViewSet.as_view({"get": "get_allocation"})
remove_allocation = MachineAllocationViewSet.as_view({"delete": "remove_allocation"})
stop_allocation = MachineAllocationViewSet.as_view({"put": "stop_allocation"})
restart_allocation = MachineAllocationViewSet.as_view({"put": "restart_allocation"})
inspect_allocation = MachineAllocationViewSet.as_view({"get": "inspect_allocation"})

urlpatterns = [
    path("create-allocation/", create_machine, name="create-allocation"),
    path("get-allocation/", get_allocation, name="get-allocation"),
    path(
        "remove-allocation/<str:container_id>",
        remove_allocation,
        name="remove-allocation",
    ),
    path(
        "restart-allocation/<str:container_id>",
        restart_allocation,
        name="restart-allocation",
    ),
    path("stop-allocation/<str:container_id>", stop_allocation, name="stop-allocation"),
    path("inspect-allocation/<str:container_id>", inspect_allocation, name="inspect-allocation"),
]
