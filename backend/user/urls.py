from django.urls import path

from user.views import UserAccountView

app_name = 'user'

urlpatterns = [
    path('account', UserAccountView.as_view(), name='account'),

]
