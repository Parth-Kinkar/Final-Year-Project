# authentication/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

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

User = settings.AUTH_USER_MODEL

def validate_technologies(value):
    technologies = [tech.strip() for tech in value.split(",")]
    if len(technologies) > 5:
        raise ValidationError("You can add up to 5 technologies only.")
    return value

from django.db import models
from django.conf import settings

class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    technologies = models.CharField(max_length=255)  # Comma-separated list
    repository_link = models.URLField()
    how_to_run = models.TextField(blank=True, null=True)  # Not compulsory
    creators = models.ManyToManyField(settings.AUTH_USER_MODEL, limit_choices_to={'user_type': 'student'})  # Many-to-many field for students
    screenshots = models.ImageField(upload_to='screenshots/', blank=True, null=True)  # Optional, max 10 screenshots

    def __str__(self):
        return self.title