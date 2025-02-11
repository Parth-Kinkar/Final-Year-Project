# authentication/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

# Custom User Model with Roles
class Department(models.Model):
    DEPARTMENT_CHOICES = [
        ('CSE', 'Computer Science and Engineering'),
        ('EE', 'Electrical Engineering'),
        ('ME', 'Mechanical Engineering'),
        ('CE', 'Civil Engineering'),
        ('ETC', 'Electronics and Telecommunications Engineering'),
    ]
    name = models.CharField(max_length=100, choices=DEPARTMENT_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()
    
class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('recruiter', 'Recruiter'),
        ('admin', 'College Admin'),
        ('teacher', 'Teacher'), 
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True)  # Added Profile Photo Field

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"

# Function to validate technologies (max 5)
def validate_technologies(value):
    technologies = [tech.strip() for tech in value.split(",")]
    if len(technologies) > 5:
        raise ValidationError("You can add up to 5 technologies only.")
    return value

def validate_rating(value):
    if value < 0 or value > 5:
        raise ValidationError('Rating must be between 1 and 5.')

class Department(models.Model):
    DEPARTMENT_CHOICES = [
        ('CSE', 'Computer Science and Engineering'),
        ('EE', 'Electrical Engineering'),
        ('ME', 'Mechanical Engineering'),
        ('CE', 'Civil Engineering'),
        ('ETC', 'Electronics and Telecommunications Engineering'),
    ]
    name = models.CharField(max_length=100, choices=DEPARTMENT_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()

# Separate Models for Different Users
class Student(models.Model):
    YEAR_CHOICES = [
        ('1', 'First Year'),
        ('2', 'Second Year'),
        ('3', 'Third Year'),
        ('4', 'Final Year'),
    ]
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True, limit_choices_to={'user_type': 'student'})
    roll_number = models.CharField(max_length=20, unique=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)  # Linked to Department model
    year = models.CharField(max_length=1, choices=YEAR_CHOICES, default='1')  # New Year Field
    interested_technologies = models.CharField(max_length=255, blank=True, null=True, validators=[validate_technologies])  # New Field

    def __str__(self):
        return self.user.username

class Teacher(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True, limit_choices_to={'user_type': 'teacher'})
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username

class Recruiter(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True, limit_choices_to={'user_type': 'recruiter'})
    company_name = models.CharField(max_length=255)
    job_role = models.CharField(max_length=255)

    def __str__(self):
        return self.user.username

class CollegeAdmin(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True, limit_choices_to={'user_type': 'admin'})
    college_name = models.CharField(max_length=255)
    position = models.CharField(max_length=100, default="Administrator")  # Optional

    def __str__(self):
        return f"{self.user.username} - {self.college_name}"

# Project Model
class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    technologies = models.CharField(max_length=255, validators=[validate_technologies])  
    repository_link = models.URLField()
    how_to_run = models.TextField(blank=True, null=True)  
    creators = models.ManyToManyField(CustomUser, limit_choices_to={'user_type': 'student'})  
    screenshots = models.ImageField(upload_to='screenshots/', blank=True, null=True)  
    rating = models.PositiveIntegerField(validators=[validate_rating], default=3)  
    demo_link = models.URLField(blank=True, null=True)

    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)  # Linking Department model
    year = models.CharField(max_length=1, choices=Student.YEAR_CHOICES)  # Using the same year choices from Student

    def __str__(self):
        return self.title

