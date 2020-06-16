from django.urls import path

from order.views import OrderItemsView

app_name = 'orders'

urlpatterns = [
    path('order/items', OrderItemsView.as_view(), name='orderItems'),


]
