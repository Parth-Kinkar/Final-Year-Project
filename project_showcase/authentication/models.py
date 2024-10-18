# authentication/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('recruiter', 'Recruiter'),
        ('admin', 'College Admin'),
        ('teacher', 'Teacher'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)

    def __str__(self):
        return self.username
