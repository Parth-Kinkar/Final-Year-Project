# authentication/urls.py

from django.urls import path
from .views import RegisterView, LoginView
from .views import ProjectCreateView, ProjectListView, ProjectDetailView
from .views import StudentListView, TeacherListView, UserDetailView, DepartmentListView
from django.conf import settings
from django.conf.urls.static import static
from .views import FilteredStudentListView, BookmarkProjectView, EditUserProfileView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('projects/create/', ProjectCreateView.as_view(), name='project-create'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'), 
    path('students/', StudentListView.as_view(), name='student-list'),
    path('teachers/', TeacherListView.as_view(), name='teacher-list'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('departments/', DepartmentListView.as_view(), name='department-list'),
    path('students/filter/', FilteredStudentListView.as_view(), name='filtered-student-list'),
    path('projects/<int:project_id>/bookmark/', BookmarkProjectView.as_view(), name='bookmark-project'),
    path('user/edit/', EditUserProfileView.as_view(), name='edit-profile'),  # New URL for editing user profile
] 

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
