# Generated by Django 3.2.23 on 2023-12-04 18:42

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0005_auto_20231204_0817'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='user_id',
            field=models.CharField(default=uuid.UUID('9ece4d66-082e-4735-8988-1a5711b1fbc8'), max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='game',
            name='join_string',
            field=models.CharField(default=uuid.UUID('ddb4e8e4-447e-4ee8-855d-6817bab6f09d'), max_length=50, unique=True),
        ),
    ]
