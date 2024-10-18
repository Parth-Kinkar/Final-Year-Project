import site
from django.contrib import admin
from .models import CustomUser
from .models import Project
from django.contrib.auth.admin import UserAdmin

# Register your models here.

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('id', 'username', 'email', 'user_type', 'is_staff', 'is_active')  # Add 'id' here

admin.site.register(CustomUser, CustomUserAdmin)

class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'repository_link')
    filter_horizontal = ('creators',)  # Use a filter widget for many-to-many field

admin.site.register(Project, ProjectAdmin)