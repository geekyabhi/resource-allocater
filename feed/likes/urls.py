from django.urls import path
from .viewsets import LikeViewSet

urlpatterns = [
    path(
        "add-like/", LikeViewSet.as_view({"post": "add_like"}), name="create-allocation"
    ),
    path(
        "get-likes/<str:machine_id>/",
        LikeViewSet.as_view({"get": "get_likes"}),
        name="get-allocation",
    ),
]
