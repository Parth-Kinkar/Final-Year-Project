from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import CustomUser, Project, Student, Department
from .serializers import UserSerializer, ProjectSerializer, StudentSerializer, DepartmentSerializer

# User Detail View (Updated to include profile_photo and full name)
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "full_name": user.get_full_name(),
            "email": user.email,
            "user_type": user.user_type,
            "profile_photo": request.build_absolute_uri(user.profile_photo.url) if user.profile_photo else None,
        })

# Register View (Unchanged)
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# Login View (Unchanged)
class LoginView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
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

# Student List View (Updated to use StudentSerializer)
class StudentListView(generics.ListAPIView):
    queryset = Student.objects.select_related('user', 'department').all()  # Optimize queries
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

# Department List View (New, if you need to fetch department options in frontend)
class DepartmentListView(generics.ListAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.AllowAny]

# Project Views (Unchanged)
class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}  # Pass request to serializer

class ProjectCreateView(APIView):
    permission_classes = [IsAuthenticated]  

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = ProjectSerializer(data=data)

        if serializer.is_valid():
            project = serializer.save()

            # Convert creator IDs to User objects
            creators_data = data.get('creators', [])
            students = CustomUser.objects.filter(id__in=creators_data, user_type='student')
            project.creators.set(students)  
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Teacher List View (Unchanged)
class TeacherListView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(user_type='teacher')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

# Fetch Students by Year and Department
class FilteredStudentListView(generics.ListAPIView):
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Student.objects.select_related("user", "department").all()
        year = self.request.query_params.get("year")
        department = self.request.query_params.get("department")

        if year:
            queryset = queryset.filter(year=year)
        if department:
            queryset = queryset.filter(department__name=department)

        return queryset