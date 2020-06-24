from django.urls import path, re_path

from authentication.views import RegistrationView, LoginView, VerifyTokenView

# app_name = 'authentication'

urlpatterns = [
    path('registration', RegistrationView.as_view(), name='registration'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/verify', VerifyTokenView.as_view(), name='verifyTokenView'),

]
