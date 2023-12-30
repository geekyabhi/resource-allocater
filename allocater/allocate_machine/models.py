from django.db import models
from django.forms.models import model_to_dict


class MachineAllocation(models.Model):
    machine_id = models.CharField(max_length=100)
    container_id = models.CharField(max_length=100,unique=True, db_index=True)
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
    container_name = models.CharField(max_length=100,unique=True, db_index=True)
    port_used = models.IntegerField(null=False,default=None)
    uid = models.CharField(max_length=255,null=False)
    create_date = models.DateTimeField(auto_now_add=True )
    update_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'machineallocation'

    def __str__(self):
        return f"Machine: {self.machine_name}, Container: {self.container_name}"

    def to_dict(self):
        return model_to_dict(self)

    @classmethod
    def return_meta_fields(cls):
        fields = [key.name for key in cls._meta.get_fields()]
        return fields

    @classmethod
    def add(cls , data):
        try:
            allocation = cls(
                machine_id = data.get('machine_id'),
                container_id = data.get('container_id'),
                starting_date = data.get('starting_date'),
                end_date = data.get('end_date'),
                is_active = data.get('is_active'),
                status = data.get('status'),
                machine_name = data.get('machine_name'),
                container_name = data.get('container_name'),
                port_used = data.get('port_used'),
                uid = data.get('uid')
            )
            allocation.save()
            return allocation.to_dict()
        except Exception as e:
            raise Exception (e)

    @classmethod
    def get(cls,filters):
        try:
            meta_fields = cls.return_meta_fields()
            filters = {key:filters[key] for key in filters if key in meta_fields}
            allocation_query_set = cls.objects.filter(**filters)
            if allocation_query_set.exists() and allocation_query_set.count()>0:
                return allocation_query_set.first().to_dict()
            return dict()
        except Exception as e:
            raise Exception(e)
        
    @classmethod
    def get_many(cls,filters):
        try:
            meta_fields = cls.return_meta_fields()
            filters = {key:filters[key] for key in filters if key in meta_fields}
            allocation_query_set = cls.objects.filter(**filters)
            return allocation_query_set.values()
        except Exception as e:
            raise Exception(e)
        
    @classmethod
    def update(cls,container_id , updated_values):
        try:
            fields = cls.return_meta_fields() 
            allocation_obj = cls.objects.get(container_id=container_id)
            for key in updated_values:
                if key in fields:
                    setattr(allocation_obj,key,updated_values[key])
            allocation_obj.save()
            updated_allocation = cls.objects.get(container_id=container_id)
            return updated_allocation.to_dict()
        except Exception as e:
            raise Exception(e)
    
    @classmethod
    def delet(cls,container_id):
        try:
            allocation = cls.objects.get(container_id=container_id)
            allocation.delete()
        except Exception as e:
            raise Exception(e)
        
