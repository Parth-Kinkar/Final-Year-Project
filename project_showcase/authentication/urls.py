# authentication/urls.py

from django.urls import path
from .views import RegisterView, LoginView
from .views import ProjectCreateView, ProjectListView, ProjectDetailView
from .views import StudentListView, UserDetailView, DepartmentListView
from django.conf import settings
from django.conf.urls.static import static
from .views import FilteredStudentListView, BookmarkProjectView, EditUserProfileView, SearchView, DepartmentChoicesView,   DepartmentCreateView, DepartmentDeleteView, StudentSearchView, StudentUpdateView, StudentDeleteView, StudentCreateView, download_excel_template, UploadExcelView, ConfirmUploadView, TeacherListView, TeacherCreateView, TeacherUpdateView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('projects/create/', ProjectCreateView.as_view(), name='project-create'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'), 
    path('students/', StudentListView.as_view(), name='student-list'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('departments/', DepartmentListView.as_view(), name='department-list'),
    path('students/filter/', FilteredStudentListView.as_view(), name='filtered-student-list'),
    path('projects/<int:project_id>/bookmark/', BookmarkProjectView.as_view(), name='bookmark-project'),
    path('user/edit/', EditUserProfileView.as_view(), name='edit-profile'),  # New URL for editing user profile
    path('search/', SearchView.as_view(), name='search'),
    path('departments/choices/', DepartmentChoicesView.as_view(), name='department-choices'),
    path('departments/create/', DepartmentCreateView.as_view(), name='department-create'),
    path('departments/<int:pk>/delete/', DepartmentDeleteView.as_view(), name='department-delete'),
    path('students/search/', StudentSearchView.as_view(), name='student-search-list'),
    path('students/<int:user_id>/update/', StudentUpdateView.as_view(), name='student-update'),
    path('students/<int:user_id>/delete/', StudentDeleteView.as_view(), name='student-delete'),
    path('students/create/', StudentCreateView.as_view(), name='student-create'),
    path("download-excel/", download_excel_template, name="download_excel"),
    path("upload-excel/", UploadExcelView.as_view(), name="upload_excel"),
    path("confirm-upload/", ConfirmUploadView.as_view(), name="confirm_upload"),
    path("teachers/", TeacherListView.as_view(), name="list_teachers"),
    path("teachers/create/", TeacherCreateView.as_view(), name="create_teacher"),
    path("teachers/<int:user_id>/update/", TeacherUpdateView.as_view(), name="update_teacher"),
] 

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
