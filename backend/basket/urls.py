from django.urls import path, re_path

from basket.views import BasketsView

app_name = 'baskets'

urlpatterns = [
    path('', BasketsView.as_view(), name='registration'),


]
