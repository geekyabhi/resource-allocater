from .models import UserModel
from utils.exceptions import CustomException


class UserService:
    def find(self, **filters):
        try:
            data = UserModel().get(filters)
            return data
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)
