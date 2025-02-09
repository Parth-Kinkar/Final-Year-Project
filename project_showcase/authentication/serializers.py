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

# Student Serializer (New)
class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested user serializer
    department = DepartmentSerializer(read_only=True)  # Read department as a name
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='department', write_only=True
    )  # Allow writing department via ID

    class Meta:
        model = Student
        fields = ['user', 'roll_number', 'department', 'department_id']

# Project Serializer (Unchanged)
User = get_user_model()
class ProjectSerializer(serializers.ModelSerializer):
    screenshots = serializers.ImageField(required=False)  # Allow image uploads
    creators = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(user_type='student'), many=True
    )

    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'technologies', 'repository_link', 
                  'how_to_run', 'creators', 'rating', 'screenshots', 'demo_link']
        extra_kwargs = {
            'title': {'required': True},
            'description': {'required': True},
            'technologies': {'required': True}, 
            'repository_link': {'required': True},
        }

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
