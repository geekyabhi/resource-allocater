from django.http import JsonResponse

def verify_user(view_func):
    def _wrapped_view(request, *args, **kwargs):
        user = request.user
        if user and user.get('verified',False):
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse({"error": "User is not verified."}, status=401)

    return _wrapped_view