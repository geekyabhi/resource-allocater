import grpc
import user_pb2
import user_pb2_grpc
from social.env_config import ConfigUtil
import json

configuration = ConfigUtil().get_config_data()
verifire_grpc_host = configuration.get("VERIFIRE_GRPC_HOST")
verifire_grpc_port = configuration.get("VERIFIRE_GRPC_PORT")

class UserService:
    def __init__(self) -> None:
        self.channel_host = f"{verifire_grpc_host}:{verifire_grpc_port}"
        self.channel = grpc.insecure_channel(self.channel_host)
        self.stub = user_pb2_grpc.UserServiceStub(self.channel)

    def get_user(self, user_data):
        request = user_pb2.UserRequestData()
        if isinstance(user_data, dict):
            user_data = json.dumps(user_data)
        request.data = user_data
        response = self.stub.GetUserData(request)
        response = json.loads(response.data)
        return {
            "admin": response["Admin"],
            "email": response["Email"],
            "email_notification": response["EmailNotification"],
            "first_name": response["FirstName"],
            "gender": response["Gender"],
            "id": response["Id"],
            "last_name": response["LastName"],
            "password": response["Password"],
            "phone_number": response["PhoneNumber"],
            "salt": response["Salt"],
            "sms_notification": response["SmsNotification"],
            "verified": response["Verified"],
        }
