# Generated by Django 4.0 on 2023-08-26 14:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('allocate_machine', '0005_machineallocation_port_used'),
    ]

    operations = [
        migrations.AlterField(
            model_name='machineallocation',
            name='end_date',
            field=models.DateField(default=None, null=True),
        ),
    ]