import jwt
from django.conf import settings
from django.http import JsonResponse

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
                email = decoded_payload.email
                if not email:
                    return JsonResponse({"error": "Email not present."}, status=401)

                user_detail = UserService().find_one_user(email=email)
                if not user_detail:
                    return JsonResponse(
                        {"error": "No such user in database."}, status=401
                    )
                request.user = user_detail  # Set the user in the request object
            except jwt.ExpiredSignatureError:
                return JsonResponse({"error": "Token has expired."}, status=401)
            except jwt.DecodeError:
                return JsonResponse({"error": "Token is invalid."}, status=401)
        else:
            return JsonResponse(
                {"error": "Authorization header missing or invalid."}, status=401
            )

        return view_func(request, *args, **kwargs)

    return _wrapped_view
