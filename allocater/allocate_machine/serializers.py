from rest_framework import serializers
from .models import MachineAllocation

class MachineAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineAllocation
        fields = '__all__'
