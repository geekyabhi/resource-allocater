from django_cassandra_engine.models import DjangoCassandraModel
from cassandra.cqlengine import columns 
from utils.exceptions import CustomException

class Likes(DjangoCassandraModel):
    __keyspace__ = "user_feed"
    machine_id = columns.Text(primary_key=True)
    uid = columns.Text(primary_key=True)
    like_id = columns.Text()
    status = columns.Boolean(index=True)
    name = columns.Text()
    created_at = columns.DateTime()

    class Meta:
        get_pk_field = 'machine_id'

    

    @classmethod
    def add_like(cls, machine_id, uid, like_id, status, name, created_at):
        try:
            like = cls.create(
                machine_id=machine_id,
                uid=uid,
                like_id=like_id,
                status=status,
                name=name,
                created_at=created_at
            )
            return cls.like_to_dict(like)
        except CustomException as e:
            raise CustomException(e,status_code=e.status_code)
        
    
    @classmethod
    def get_count(cls, machine_id ,status):
        try:
            count = cls.objects.filter(machine_id=machine_id,status=status).count()
            return count
        except CustomException as e:
            raise CustomException(e,status_code=e.status_code)

    @staticmethod
    def like_to_dict(like):
        return {
            'machine_id': like.machine_id,
            'uid': like.uid,
            'like_id': like.like_id,
            'status':like.status,
            'name': like.name,
            'created_at': like.created_at
        }