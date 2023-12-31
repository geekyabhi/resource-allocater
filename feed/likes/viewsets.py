from rest_framework import viewsets, status
from rest_framework.response import Response
import json
from .service import LikeService
from middlewere.auth_layer import auth_layer
from middlewere.verified_layer import verify_user
from middlewere.machine_exist import machine_exists
from django.utils.decorators import method_decorator
class LikeViewSet(viewsets.ModelViewSet):
    service = LikeService()

    @method_decorator(auth_layer)
    @method_decorator(verify_user)
    @method_decorator(machine_exists)
    def add_like(self, request):
        try:
            raw_data = request.body
            data = raw_data.decode("utf-8")
            data_json = json.loads(data)
            machine_id = data_json.get("machine_id")
            like_status = data_json.get("status")
            user = request.user
            uid = user.get('id')
            name = user.get('first_name') + " "+user.get('last_name')
            data_json['uid'] = uid
            data_json['name'] = name

            like_data = self.service.add_like({"machine_id":machine_id,"status":like_status,"uid":uid,"name":name})
            return Response({'data':like_data,'success':True}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error":f"{e}"},status=status.HTTP_400_BAD_REQUEST)


    def get_likes(self, request ,machine_id):
        try:
            likes = self.service.get_count({"machine_id":machine_id,"status":True})
            dislikes = self.service.get_count({"machine_id":machine_id,"status":False})
            return Response({'success':True,'data':{"likes":likes,"dislikes":dislikes}}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":f"{e}"},status=status.HTTP_400_BAD_REQUEST)