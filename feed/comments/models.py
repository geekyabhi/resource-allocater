from django_cassandra_engine.models import DjangoCassandraModel
from cassandra.cqlengine import columns
from cassandra.cqlengine.query import DoesNotExist

class Comments(DjangoCassandraModel):
    __keyspace__ = "user_feed"
    machine_id = columns.Text(primary_key=True)
    uid = columns.Text()
    comment_id = columns.Text(primary_key=True)
    comment_text = columns.Text()
    name = columns.Text()
    created_at = columns.DateTime()

    class Meta:
        get_pk_field = 'machine_id'

    @classmethod
    def add_comment(cls, machine_id, uid, comment_id, comment_text, name, created_at):
        try:
            comment = cls.create(
                machine_id=machine_id,
                uid=uid,
                comment_id=comment_id,
                comment_text=comment_text,
                name=name,
                created_at=created_at
            )
            return cls.comment_to_dict(comment)
        except Exception as e:
            raise Exception(e)
        
    
    @classmethod
    def get_comments_by_machine_id(cls, machine_id , limit=-1):
        try:
            if limit == -1 :
                comments = cls.objects.filter(machine_id=machine_id)
            else :
                comments = cls.objects.filter(machine_id=machine_id).limit(100) 
            return [cls.comment_to_dict(comment) for comment in comments]
        except Exception as e:
            raise Exception(e)

    @classmethod
    def remove_comment(cls, machine_id, comment_id):
        try:
            comment = cls.objects.get(machine_id=machine_id, comment_id=comment_id)
            comment.delete()
            return cls.comment_to_dict(comment)
        except DoesNotExist as e:
            raise Exception(e)

    @staticmethod
    def comment_to_dict(comment):
        return {
            'machine_id': comment.machine_id,
            'uid': comment.uid,
            'comment_id': comment.comment_id,
            'comment_text': comment.comment_text,
            'name': comment.name,
            'created_at': comment.created_at
        }