# authentication/views.py

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import UserSerializer
from django.contrib.auth import authenticate
from rest_framework import status
from .models import Project
from .serializers import ProjectSerializer
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated



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

# List all projects
class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

# View, update or delete a specific project
class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProjectCreateView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can create projects

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = ProjectSerializer(data=data)

        if serializer.is_valid():
            # First, save the project instance without the creators
            project = serializer.save()

            # Get the creators data from the request
            creators_data = data.get('creators', [])
            if creators_data:
                # Set the creators for the project after saving it
                project.creators.set(creators_data)
                project.save()  # Save the project again after setting creators

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentListView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(user_type='student')  # Filter by student type
    serializer_class = UserSerializer

class TeacherListView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(user_type='teacher')  # Filter by teacher type
    serializer_class = UserSerializer