from .models import Likes
from datetime import datetime
import uuid

class LikeService:
    def __init__(self) -> None:
        self.like_model = Likes()

    def add_like(self,data):
        try:
            like_id = str(uuid.uuid4()).replace("-","")
            created_at = datetime.now()
            data['like_id'] = like_id
            data['created_at'] = created_at
            like_data = self.like_model.add_like(**data)
            return like_data
        except Exception as e:
            raise Exception(e)
        
    def get_count(self,data):
        try:
            cnt = self.like_model.get_count(**data)
            return cnt
        except Exception as e:
            raise Exception(e)
