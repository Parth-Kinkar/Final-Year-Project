# authentication/serializers.py

from rest_framework import serializers
from .models import CustomUser
from .models import Project
from django.contrib.auth import get_user_model
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'user_type', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            user_type=validated_data['user_type'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

User = get_user_model()
class ProjectSerializer(serializers.ModelSerializer):
    creators = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.filter(user_type='student'))

    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'technologies', 'repository_link', 'how_to_run', 'creators']
        extra_kwargs = {
            'title': {'required': True},
            'description': {'required': True},
            'technologies': {'required': True}, 
            'repository_link': {'required': True},
            'student': {'required': False},
        }

    def validate_technologies(self, value):
        technologies = value.split(",")
        if len(technologies) > 5:
            raise serializers.ValidationError("You can add up to 5 technologies only.")
        return value