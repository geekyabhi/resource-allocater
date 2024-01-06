from rest_framework import viewsets, status
from rest_framework.response import Response
import json
from .service import CommentService
from middlewere.auth_layer import auth_layer
from middlewere.verified_layer import verify_user
from middlewere.admin_layer import admin_layer
from middlewere.machine_exist import machine_exists
from django.utils.decorators import method_decorator
from utils.exceptions import CustomException


class CommentViewSet(viewsets.ModelViewSet):
    service = CommentService()

    @method_decorator(auth_layer)
    @method_decorator(verify_user)
    @method_decorator(machine_exists)
    def add_comment(self, request):
        try:
            raw_data = request.body
            data = raw_data.decode("utf-8")
            data_json = json.loads(data)

            machine_id = data_json.get("machine_id")
            comment_text = data_json.get("comment_text")
            user = request.user
            uid = user.get("id")
            name = user.get("first_name") + " " + user.get("last_name")
            data_json["uid"] = uid
            data_json["name"] = name

            comment_data = self.service.add_comment(
                {
                    "machine_id": machine_id,
                    "comment_text": comment_text,
                    "uid": uid,
                    "name": name,
                }
            )
            return Response(
                {"data": comment_data, "success": True}, status=status.HTTP_201_CREATED
            )
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    def get_comments(self, request, machine_id):
        try:
            comments = self.service.get_comments({"machine_id": machine_id})
            return Response(
                {"success": True, "data": comments}, status=status.HTTP_200_OK
            )
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)

    @method_decorator(auth_layer)
    @method_decorator(admin_layer)
    def remove_comment(self, request):
        try:
            raw_data = request.body
            data = raw_data.decode("utf-8")
            data_json = json.loads(data)

            self.service.remove_comment(data_json)
            return Response({"success": True}, status=status.HTTP_200_OK)
        except CustomException as e:
            raise CustomException(e, status_code=e.status_code)
