import grpc
import dock_pb2_grpc
from concurrent import futures
from docker_service.grpcservicer import DockerServiceServicer
from utils.env_config import ConfigUtil

configuration = ConfigUtil().get_config_data()
port = configuration.get('PORT')

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    dock_pb2_grpc.add_DockerServiceServicer_to_server(DockerServiceServicer(), server)
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()