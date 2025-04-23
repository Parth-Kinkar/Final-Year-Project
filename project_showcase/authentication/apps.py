from django.apps import AppConfig
from django.db.utils import IntegrityError

class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authentication'