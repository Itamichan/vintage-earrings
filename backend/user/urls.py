from django.urls import path, re_path

from user.views import UserContactView, UserAddressView

app_name = 'user'

urlpatterns = [
    path('contact/', UserContactView.as_view(), name='contact'),
    re_path(r'^(?P<user_id>[\S]+)/address/$', UserAddressView.as_view(), name='userAddress'),
]
