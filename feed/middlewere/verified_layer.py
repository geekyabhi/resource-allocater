from utils.exceptions import CustomException


def verify_user(view_func):
    def _wrapped_view(request, *args, **kwargs):
        user = request.user
        if user and user.get("verified", False):
            return view_func(request, *args, **kwargs)
        else:
            raise CustomException("User is not verified.", status_code=e.status_code)

    return _wrapped_view
