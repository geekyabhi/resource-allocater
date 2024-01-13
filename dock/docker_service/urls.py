from django.urls import path
from .viewsets import DockerViewSet

run_container = DockerViewSet.as_view({"post": "run_container"})
stop_container = DockerViewSet.as_view({"post": "stop_container"})
start_container = DockerViewSet.as_view({"post": "start_container"})
inspect_container = DockerViewSet.as_view({"get": "inspect_container"})
remove_container = DockerViewSet.as_view({"delete": "remove_container"})

urlpatterns = [
    path("run-container/", run_container ,name="run-container"),
    path("stop-container/<str:container_id>", stop_container ,name ="stop-container"),
    path("start-container/<str:container_id>",start_container),
    path("inspect-container/<str:container_id>",inspect_container),
    path("remove-container/<str:container_id>", remove_container),
]
