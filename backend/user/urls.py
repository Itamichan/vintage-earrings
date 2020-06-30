from django.urls import path, re_path

from user.views import UserContactView, UserAddressView, UserAllAddressesView

app_name = 'user'

urlpatterns = [
    path('contact/', UserContactView.as_view(), name='contact'),
    re_path(r'^(?P<user_id>[0-9]+)/all_addresses/$', UserAllAddressesView.as_view(), name='userAddresses'),
    re_path(r'^(?P<user_id>[0-9]+)/address/$', UserAddressView.as_view(), name='userAddress'),
    re_path(r'^(?P<user_id>[0-9]+)/address/(?P<address_id>[0-9]+)/$', UserAddressView.as_view(), name='userAddress'),
]
