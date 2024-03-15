from django.urls import path
from .viewsets import CommentViewSet

create_comments = CommentViewSet.as_view({"post": "add_comment"})
get_comments = CommentViewSet.as_view({"get": "get_comments"})
remove_comments = CommentViewSet.as_view({"delete": "remove_comment"})

urlpatterns = [
    path("create-comment/", create_comments, name="create-allocation"),
    path("get-comments/<str:machine_id>/", get_comments, name="get-allocation"),
    path("remove-comments/", remove_comments, name="remove-allocation"),
]
