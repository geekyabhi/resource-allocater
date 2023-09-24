from rest_framework import serializers
from .models import UserModel

class UserModelSerializer(serializers.ModelSerializer):

    def validate(self, data):
        return data
    
    def to_internal_value(self, data):
        try:
            return super().to_internal_value(data)
        except serializers.ValidationError as e:
            formatted_errors = {}  # Customize error format here
            for field, errors in e.detail.items():
                formatted_errors[field] = " ".join(errors)
            raise serializers.ValidationError(formatted_errors)

    class Meta:
        model = UserModel
        fields = '__all__'