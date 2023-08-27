import docker


class DockerManager:
    def __init__(self) -> None:
        self.client = docker.from_env()

    def start_container(
        self, image, container_name, ports=None, command=None, detach=True
    ):
        if ports is None:
            ports = {}

        container = self.client.containers.run(
            image=image,
            name=container_name,
            ports=ports,
            command=command,
            detach=detach,
        )

        container_details = {
            "container_id": container.short_id,
            "container_name": container.name,
            "image": container.image.tags[0],
            "ports": container.ports,
            "status": container.status,
        }

        return container_details

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
        return None

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
            return None

    def start_stopped_container(self, container_id):
        container = self.get_container_by_id(container_id)
        if container:
            if container.status == "exited":
                container.start()
                print(
                    f"Container started - ID: {container.short_id}, Name: {container.name}"
                )
            else:
                print("Container is not in a stopped state")
        else:
            print("Container not found")

    def stop_container_by_id(self, container_id):
        print("Hello")
        container = self.get_container_by_id(container_id)
        print(container)
        if container:
            container.stop()
            print(
                f"Container stopped - ID: {container.short_id}, Name: {container.name}"
            )
        else:
            print("Container not found")

    def remove_container_by_id(self, container_id):
        container = self.get_container_by_id(container_id)
        if container:
            container.stop()
            container.remove()
        else:
            print("Container not found")
