from rest_framework import serializers
from .models import CustomUser, Project, Student, Department
from django.contrib.auth import get_user_model

# Department Serializer
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']

# User Serializer (Updated to include profile_photo)
class UserSerializer(serializers.ModelSerializer):
    profile_photo = serializers.ImageField(required=False)  # Added profile photo field

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'user_type', 'password', 'profile_photo']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            user_type=validated_data['user_type'],
            profile_photo=validated_data.get('profile_photo', None),  # Handle profile photo upload
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
#Student Serializer:
class StudentSerializer(serializers.ModelSerializer):
    year_display = serializers.SerializerMethodField()
    
    # Keep user as read-only for frontend display
    user = UserSerializer(read_only=True)  
    
    # Ensure user_id is correctly handled in requests
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), source='user', write_only=True
    )  
    
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='department', write_only=True
    )  

    # Explicitly validate year input
    year = serializers.ChoiceField(choices=[("1", "1st Year"), ("2", "2nd Year"), ("3", "3rd Year"), ("4", "Final Year")])

    # Ensure bookmarked_projects accepts multiple selections
    bookmarked_projects = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), many=True, required=False
    )  

    class Meta:
        model = Student
        fields = ['user', 'user_id', 'roll_number', 'department', 'department_id', 'contact_number', 'bookmarked_projects', 'full_name', 'year', 'year_display', 'interested_technologies', 'skills', 'resume', 'github', 'linkedin', 'portfolio']

    def get_year_display(self, obj):
        year_mapping = {
            "1": "1st Year",
            "2": "2nd Year",
            "3": "3rd Year",
            "4": "Final Year",
        }
        return year_mapping.get(obj.year, "Unknown")



# Project Serializer (Unchanged)
User = get_user_model()
class ProjectSerializer(serializers.ModelSerializer):
    screenshots = serializers.ImageField(required=False)  # Allow image uploads
    creators = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'technologies', 'repository_link', 
                  'how_to_run', 'creators', 'rating', 'screenshots', 'demo_link', 'department', 'year']
        extra_kwargs = {
            'title': {'required': True},
            'description': {'required': True},
            'technologies': {'required': True}, 
            'repository_link': {'required': True},
        }
    def get_creators(self, obj):
        return [creator.username for creator in obj.creators.all()]

    def get_screenshots(self, obj):
        request = self.context.get('request')
        if obj.screenshots:
            return request.build_absolute_uri(obj.screenshots.url)
        return None


    def validate_technologies(self, value):
        technologies = value.split(",")
        if len(technologies) > 5:
            raise serializers.ValidationError("You can add up to 5 technologies only.")
        return value
