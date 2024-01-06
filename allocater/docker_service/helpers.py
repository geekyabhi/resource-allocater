import docker
import random
from utils.exceptions import CustomException


class DockerManager:
    def __init__(self) -> None:
        self.client = docker.from_env()

    def start_container(
        self, image, container_name, default_port, command=None, detach=True
    ):
        try:
            random_port = self.get_random_port()
            ports = {f"{default_port}": f"{random_port}"}
            if ports is None:
                ports = {}

            container = self.client.containers.run(
                image=image,
                name=container_name,
                ports=ports,
                command=command,
                detach=detach,
            )

            return container, random_port

        except CustomException as e:
            raise CustomException(f"Container cannot be started {str(e)}")

    def stop_container(self, container):
        container.stop()

    def remove_container(self, container):
        container.remove()

    def list_containers(self):
        return self.client.containers.list()

    def get_container_by_name(self, container_name):
        containers = self.client.containers.list(filters={"name": container_name})
        if containers:
            return containers[0]
        else:
            raise CustomException(f"Container {container_name} not found")

    def stream_container_logs(self, container_id):
        container = self.client.containers.get(container_id)
        logs = container.logs(stream=True, follow=True)
        for line in logs:
            print(line.decode().strip())

    def get_container_by_id(self, container_id):
        try:
            container = self.client.containers.get(container_id)
            return container
        except docker.errors.NotFound:
            raise CustomException(f"Conatiner {container_id} not found")

    def start_stopped_container(self, container_id):
        container = self.get_container_by_id(container_id)
        if container:
            container.start()
        else:
            raise CustomException(f"Conatiner {container_id} not found")

    def stop_container_by_id(self, container_id):
        container = self.get_container_by_id(container_id)
        if container:
            container.stop()
        else:
            raise CustomException(f"Conatiner {container_id} not found")

    def remove_container_by_id(self, container_id):
        container = self.get_container_by_id(container_id)
        if container:
            container.stop()
            container.remove()
        else:
            raise CustomException(f"Conatiner {container_id} not found")

    def get_occupied_ports(self):
        occupied_ports = set()

        containers = self.client.containers.list()

        for container in containers:
            container_info = container.attrs

            network_settings = container_info.get("NetworkSettings", {})
            ports = network_settings.get("Ports", {})

            for port_info in ports.values():
                if port_info is not None:
                    for host_port_info in port_info:
                        host_port = host_port_info.get("HostPort")
                        if host_port:
                            occupied_ports.add(int(host_port))

        return list(occupied_ports)

    def get_random_port(self):
        available_ports = set(range(49152, 65536)) - set(self.get_occupied_ports())
        if not available_ports:
            raise CustomException(f"Ports not found")
        random_port = random.choice(list(available_ports))
        return random_port
