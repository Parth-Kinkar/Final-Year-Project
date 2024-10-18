# authentication/views.py

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import UserSerializer
from django.contrib.auth import authenticate
from rest_framework import status


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        print("Username: ", username)
        print("Password: ", password)
        user = authenticate(username=username, password=password)
        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=400)

        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_type': user.user_type
            })
        return Response({'error': 'Invalid credentials'}, status=400)
        # if user:
        #     refresh = RefreshToken.for_user(user)
        #     return Response({
        #         'refresh': str(refresh),
        #         'access': str(refresh.access_token),
        #         'user_type': user.user_type
        #     })
        # return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)