# Generated by Django 5.0 on 2023-12-30 17:09

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0002_alter_usermodel_created_at_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="usermodel",
            name="email",
            field=models.EmailField(max_length=254, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name="usermodel",
            name="first_name",
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="usermodel",
            name="gender",
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="usermodel",
            name="last_name",
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="usermodel",
            name="password",
            field=models.CharField(max_length=355, null=True),
        ),
        migrations.AlterField(
            model_name="usermodel",
            name="phone_number",
            field=models.CharField(max_length=355, null=True),
        ),
        migrations.AlterField(
            model_name="usermodel",
            name="salt",
            field=models.CharField(max_length=255, null=True),
        ),
    ]