from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError


# Function to validate technologies (max 5)
def validate_technologies(value):
    technologies = [tech.strip() for tech in value.split(",")]
    if len(technologies) > 5:
        raise ValidationError("You can add up to 5 technologies only.")
    return value


def validate_rating(value):
    if value < 0 or value > 5:
        raise ValidationError('Rating must be between 1 and 5.')


# Custom Department Model
class Department(models.Model):
    DEPARTMENT_CHOICES = [
    ('CSE', 'Computer Science and Engineering'),
    ('EE', 'Electrical Engineering'),
    ('ME', 'Mechanical Engineering'),
    ('CE', 'Civil Engineering'),
    ('ETC', 'Electronics and Telecommunications Engineering'),
    # General Science and Technology
    ('PHY', 'Physics'),
    ('CHE', 'Chemistry'),
    ('MAT', 'Mathematics'),
    ('BIO', 'Biology'),
    ('ENV', 'Environmental Science'),
    # General Arts and Humanities
    ('ENG', 'English'),
    ('HIS', 'History'),
    ('GEO', 'Geography'),
    ('PHI', 'Philosophy'),
    ('POL', 'Political Science'),
    # Business and Economics
    ('ECO', 'Economics'),
    ('BBA', 'Business Administration'),
    ('ACC', 'Accounting'),
    ('MGT', 'Management'),
    ('FIN', 'Finance'),
    # Medical and Health Sciences
    ('MED', 'Medicine'),
    ('DEN', 'Dentistry'),
    ('NUR', 'Nursing'),
    ('PHR', 'Pharmacy'),
    ('PSY', 'Psychology'),
    # Miscellaneous
    ('LAW', 'Law'),
    ('SOC', 'Sociology'),
    ('EDU', 'Education'),
    ('ART', 'Fine Arts'),
    ('MUS', 'Music'),
    ('ARC', 'Architecture'),
    ('AGRI', 'Agricultural Science'),
    ('AVI', 'Aviation Engineering'),
]
    name = models.CharField(max_length=100, choices=DEPARTMENT_CHOICES, unique=True)
    def __str__(self):
        return self.get_name_display()


# Custom User Model
class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('recruiter', 'Recruiter'),
        ('admin', 'College Admin'),
        ('teacher', 'Teacher'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    email = models.EmailField(unique=True)  # Added email field


    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"


# Student Model
class Student(models.Model):
    YEAR_CHOICES = [
        ('1', 'First Year'),
        ('2', 'Second Year'),
        ('3', 'Third Year'),
        ('4', 'Final Year'),
    ]

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True, limit_choices_to={'user_type': 'student'})
    roll_number = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=100, blank=True, null=True)  # Added full_name field
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    year = models.CharField(max_length=1, choices=YEAR_CHOICES, default='1')
    interested_technologies = models.CharField(max_length=255, blank=True, null=True, validators=[validate_technologies])
    skills = models.CharField(max_length=255, blank=True, null=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)  # Added phone number field
    bookmarked_projects = models.ManyToManyField('Project', related_name='bookmarked_by', blank=True)  # Added bookmarking feature
    github = models.URLField(blank=True, null=True)       # GitHub profile link
    linkedin = models.URLField(blank=True, null=True)     # LinkedIn profile link
    portfolio = models.URLField(blank=True, null=True)    # Personal portfolio link

    def __str__(self):
        return self.user.username


# Other Models (Unchanged)
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
    position = models.CharField(max_length=100, default="Administrator")

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
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    year = models.CharField(max_length=1, choices=Student.YEAR_CHOICES)

    def __str__(self):
        return self.title