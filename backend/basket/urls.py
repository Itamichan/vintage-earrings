from django.urls import path, re_path

from basket.views import BasketsView, BasketItemsView

app_name = 'baskets'

urlpatterns = [
    path('', BasketsView.as_view(), name='basket'),
    path('items/', BasketItemsView.as_view(), name='basketItems'),


]
