from django.urls import path

from user.views import UserContactView

app_name = 'user'

urlpatterns = [
    path('contact/', UserContactView.as_view(), name='contact'),

]
