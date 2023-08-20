from django.db import models
import uuid

class MachineAllocation(models.Model):
    machine_id = models.CharField(max_length=100)
    container_id = models.CharField(max_length=100)
    starting_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    machine_name = models.CharField(max_length=100)
    container_name = models.CharField(max_length=100)
    instance_id = models.UUIDField(default=uuid.uuid4, editable=False)
    create_date = models.DateTimeField(auto_now_add=True)  # Automatically set on creation
    update_date = models.DateTimeField(auto_now=True) 

    class Meta:
        db_table = 'machine-allocation'

    def __str__(self):
        return f"Machine: {self.machine_name}, Container: {self.container_name}"
