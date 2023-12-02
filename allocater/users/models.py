import uuid
from django.db import models

class UserModel(models.Model):
    id = models.CharField(max_length=255, primary_key=True,null=False)
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

    @staticmethod
    def create_user(**kwargs):
        # Extract relevant fields from kwargs
        id = kwargs.get('id')
        first_name = kwargs.get('first_name')
        last_name = kwargs.get('last_name')
        email = kwargs.get('email')
        password = kwargs.get('password')
        phone_number = kwargs.get('phone_number')
        gender = kwargs.get('gender')
        salt = kwargs.get('salt')
        verified = kwargs.get('verified', False)
        email_notification = kwargs.get('email_notification', True)
        sms_notification = kwargs.get('sms_notification', True)

        new_user = UserModel(
            id=id,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
            phone_number=phone_number,
            gender=gender,
            salt=salt,
            verified=verified,
            email_notification=email_notification,
            sms_notification=sms_notification,
        )

        # Save the new user to the database
        new_user.save()

        # Return the newly created user instance
        return new_user