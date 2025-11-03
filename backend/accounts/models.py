# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    # Add extra fields if you want
    bio = models.TextField(blank=True, null=True)
    # profile_pic = models.ImageField(upload_to="profiles/", blank=True, null=True)

    def __str__(self):
        return self.username
