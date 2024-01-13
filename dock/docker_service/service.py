import docker
import random 
import json
from utils.exceptions import CustomException

class DockerService:
    def __init__(self) -> None:
        self.client = docker.from_env()
    
    def run_container(self , **data):
        try:
            default_port = data.get('default_port')
            random_port = self.__get_random_port()
            config = {
                'image':data.get('image'),
                'ports' : {f"{default_port}/tcp": f"{random_port}"},
                'detach':True
            }
            if data.get('container_name'):
                config['name'] = data.get('container_name')
            if data.get('environment'):
                config['environment'] = data.get('environment')
            if data.get('command'):
                config['command'] =data.get('command')
            
            container = self.client.containers.run(**config)
            container_info = container.attrs

            container_data = {
                'id': container_info['Id'][:12],
                'name': container_info['Name'],
                'image': container_info['Config']['Image'],
                'ports': container_info['NetworkSettings']['Ports'],
                'status': container_info['State']['Status'],
                'port_used': random_port
            }
            return container_data

        except CustomException as e:
            raise CustomException(f"Container cannot be started {str(e)}")
    
    def start_container_by_id(self, container_id):
        try:
            container = self.client.containers.get(container_id)
            container.start()
            return True
        except docker.errors.NotFound as e:
            raise CustomException(f"Container '{container_id}' not found: {str(e)}")
        except docker.errors.APIError as e:
            raise CustomException(f"Error starting container '{container_id}': {str(e)}")
        except CustomException as e:
            raise CustomException(f"Error starting container '{container_id}': {str(e)}")

    def stop_container_by_id(self, container_id):
        try:
            container = self.client.containers.get(container_id)
            container.stop()
            return True
        except docker.errors.NotFound as e:
            raise CustomException(f"Container '{container_id}' not found: {str(e)}")
        except CustomException as e:
            raise CustomException(f"Error stopping container '{container_id}': {str(e)}")

    def inspect_container_by_id(self, container_id):
        try:
            container = self.client.containers.get(container_id)
            return container.attrs
        except docker.errors.NotFound as e:
            raise CustomException(f"Container '{container_id}' not found: {str(e)}")
        except CustomException as e:
            raise CustomException(f"Error inspecting container '{container_id}': {str(e)}")

    def remove_container_by_id(self, container_id):
        try:
            container = self.client.containers.get(container_id)
            container.remove()
            return True
        except docker.errors.NotFound as e:
            raise CustomException(f"Container '{container_id}' not found: {str(e)}")
        except CustomException as e:
            raise CustomException(f"Error removing container '{container_id}': {str(e)}")

    def stream_container_logs_by_id(self, container_id):
        try:
            container = self.client.containers.get(container_id)
            logs = container.logs(stream=True, follow=True, timestamps=True, tail='all')
            for log_line in logs:
                print(log_line.decode('utf-8'), end='')

        except docker.errors.NotFound as e:
            raise CustomException(f"Container '{container_id}' not found: {str(e)}")
        except docker.errors.APIError as e:
            raise CustomException(f"Error streaming logs for container '{container_id}': {str(e)}")
        except CustomException as e:
            raise CustomException(f"Error streaming logs for container '{container_id}': {str(e)}")


    def __get_occupied_ports(self):
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



    def __get_random_port(self):
        available_ports = set(range(49152, 65536)) - set(self.__get_occupied_ports())
        if not available_ports:
            raise CustomException(f"Ports not found")
        random_port = random.choice(list(available_ports))
        return random_port
