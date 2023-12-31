from django.http import JsonResponse

def admin_layer(view_func):
    def _wrapped_view(request, *args, **kwargs):
        user = request.user
        if user and user.get('admin',False):
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse({"error": "User is not admin."}, status=401)

    return _wrapped_view