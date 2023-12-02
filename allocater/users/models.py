import uuid
from django.db import models

class UserModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=355)
    phone_number = models.CharField(max_length=355)
    gender = models.CharField(max_length=255)
    salt = models.CharField(max_length=255)
    verified = models.BooleanField(default=False)
    email_notification = models.BooleanField(default=True)
    sms_notification = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["email"]),
        ]
        app_label = 'users'
        db_table = 'user'

    @staticmethod
    def find_all_users(**filters):
        return UserModel.objects.filter(**filters)

    @staticmethod
    def find_one_user(**filters):
        filters = filters.get('filter',{})
        return UserModel.objects.filter(**filters).first()
