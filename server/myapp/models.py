from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    # Add custom fields here
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    # Add more fields as needed

    def __str__(self):
        return self.username