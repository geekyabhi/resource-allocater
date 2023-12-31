from .models import Comments
from datetime import datetime
import uuid

class CommentService:
    def __init__(self) -> None:
        self.comment_model = Comments()

    def add_comment(self,data):
        try:
            comment_id = str(uuid.uuid4()).replace("-","")
            created_at = datetime.now()
            data['comment_id'] = comment_id
            data['created_at'] = created_at
            comment_data = self.comment_model.add_comment(**data)
            return comment_data
        except Exception as e:
            raise Exception(e)
        
    def get_comments(self,data):
        try:
            comments = self.comment_model.get_comments_by_machine_id(**data)
            return comments
        except Exception as e:
            raise Exception(e)
        
    def remove_comment(self,data):
        try:
            comments = self.comment_model.remove_comment(**data)
            return comments
        except Exception as e:
            raise Exception(e)