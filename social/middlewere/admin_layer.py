from utils.exceptions import CustomException


def admin_layer(view_func):
    def _wrapped_view(request, *args, **kwargs):
        user = request.user
        if user and user.get("admin", False):
            return view_func(request, *args, **kwargs)
        else:
            raise CustomException("User is not admin", status_code=401)

    return _wrapped_view
