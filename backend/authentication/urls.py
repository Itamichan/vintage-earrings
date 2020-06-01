from django.urls import path

from authentication.views import RegistrationView

# app_name = 'authentication'

urlpatterns = [
    path('registration', RegistrationView.as_view(), name='registration'),
]