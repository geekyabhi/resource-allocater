import jwt
from django.http import JsonResponse
from utils.exceptions import CustomException
from jwt.exceptions import ExpiredSignatureError, DecodeError, InvalidTokenError
from allocater.env_config import ConfigUtil
from users.service import UserService

configuration = ConfigUtil().get_config_data()
APP_SECRET = configuration.get("APP_SECRET")


def auth_layer(view_func):
    def _wrapped_view(request, *args, **kwargs):
        auth_header = request.META.get("HTTP_AUTHORIZATION")

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

            try:
                decoded_payload = jwt.decode(token, APP_SECRET, algorithms=["HS256"])
                email = decoded_payload.get("email", None)

                if not email:
                    raise CustomException("Email not present.", status_code=404)

                user_detail = UserService().find(email=email)
                if not user_detail:
                    raise CustomException("No such user in database", status_code=404)

                request.user = user_detail  # Set the user in the request object
            except jwt.ExpiredSignatureError:
                raise CustomException("Token Expired", status_code=401)
            except jwt.DecodeError:
                raise CustomException("Token is Invalid", status_code=401)
            except jwt.InvalidTokenError:
                raise CustomException("Token is Invalid", status_code=401)
        else:
            return JsonResponse({"error": "Authorization details missing."}, status=403)

        return view_func(request, *args, **kwargs)

    return _wrapped_view
