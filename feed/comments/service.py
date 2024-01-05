from .models import Comments
from datetime import datetime
import uuid
from utils.exceptions import CustomException

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
        except CustomException as e:
            raise CustomException(e,status_code=e.status_code)
        
    def get_comments(self,data):
        try:
            comments = self.comment_model.get_comments_by_machine_id(**data)
            return comments
        except CustomException as e:
            raise CustomException(e,status_code=e.status_code)
        
    def remove_comment(self,data):
        try:
            comments = self.comment_model.remove_comment(**data)
            return comments
        except CustomException as e:
            raise CustomException(e,status_code=e.status_code)