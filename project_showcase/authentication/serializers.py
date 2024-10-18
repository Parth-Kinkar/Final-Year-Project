# authentication/serializers.py

from rest_framework import serializers
from .models import CustomUser

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
