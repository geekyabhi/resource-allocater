from .models import UserModel
from .serializers import UserModelSerializer

class UserService:
    serializer_class = UserModelSerializer
    
    def find_one_user(self , **filter):
        qs = UserModel.find_one_user(filter=filter)
        serializer = self.serializer_class(qs, many=False)  
        return serializer.data

    def find_users(self , **filter):
        qs = UserModel.find_all_users(filter=filter)
        serializer = self.serializer_class(qs , many=True)
        return serializer.data     
