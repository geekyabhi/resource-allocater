from .models import UserModel

class UserService:
    def find(self , **filters):
        try:
            data = UserModel().get(filters)
            return data
        except Exception as e:
            raise Exception(e)