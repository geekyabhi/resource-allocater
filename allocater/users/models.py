import uuid
from django.db import models
from django.forms.models import model_to_dict

class UserModel(models.Model):
    id = models.CharField(max_length=255, primary_key=True, null=False)
    first_name = models.CharField(max_length=255, null=True)
    last_name = models.CharField(max_length=255, null=True)
    email = models.EmailField(unique=True, null=True)
    password = models.CharField(max_length=355, null=True)
    phone_number = models.CharField(max_length=355, null=True)
    gender = models.CharField(max_length=255, null=True)
    salt = models.CharField(max_length=255, null=True)
    verified = models.BooleanField(default=False)
    admin = models.BooleanField(default=False)
    email_notification = models.BooleanField(default=True)
    sms_notification = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=["email"]),
        ]
        app_label = 'users'
        db_table = 'user'

    def to_dict(self):
        return model_to_dict(self)
    
    @classmethod
    def return_meta_fields(cls):
        fields = [key.name for key in cls._meta.get_fields()]
        return fields

    @classmethod
    def get(cls , filters):
        try:
            meta_fields = cls.return_meta_fields()
            filters = {key:filters[key] for key in filters if key in meta_fields}
            user_query_set = cls.objects.filter(**filters)
            if user_query_set.exists() and user_query_set.count()>0:
                return user_query_set.first().to_dict()
            return dict()
        except Exception as e:
            raise Exception(e)

