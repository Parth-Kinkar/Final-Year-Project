import site
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Student, Teacher, Recruiter, CollegeAdmin, Project, Department

# Custom User Admin
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('id', 'username', 'email', 'user_type', 'is_staff', 'is_active')

# Project Admin with Many-to-Many field filter
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'repository_link')
    filter_horizontal = ('creators',)

# Department Admin
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')  # Show department ID and name

# Register Models
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Student)
admin.site.register(Teacher)
admin.site.register(Recruiter)
admin.site.register(CollegeAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Department, DepartmentAdmin)  # Register Department model


from django.utils.html import format_html