from django.db import models
import uuid
import datetime
class MachineAllocation(models.Model):
    machine_id = models.CharField(max_length=100)
    container_id = models.CharField(max_length=100)
    starting_date = models.DateField()
    end_date = models.DateField(default=None ,null=True)
    is_active = models.BooleanField(default=True)
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('killed', 'Killed'),
        ('stopped', 'Stopped'),
    )
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=None,null=True)
    machine_name = models.CharField(max_length=100, null=False)
    container_name = models.CharField(max_length=100)
    port_used = models.IntegerField(null=False,default=None)
    uid = models.CharField(max_length=255,null=False)
    create_date = models.DateTimeField(auto_now_add=True )  # Automatically set on creation
    update_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'machineallocation'

    def __str__(self):
        return f"Machine: {self.machine_name}, Container: {self.container_name}"
