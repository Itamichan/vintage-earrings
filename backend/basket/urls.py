from django.urls import path, re_path

from basket.views import BasketsView, BasketItemsView, BasketCheckoutView, BasketPaymentVerifyView

app_name = 'baskets'

urlpatterns = [
    re_path(r'^(?P<basket_id>[a-f0-9\-]+)/items/$', BasketItemsView.as_view(), name='basketItems'),
    re_path(r'^(?P<basket_id>[a-f0-9\-]+)/items/(?P<item_id>[0-9]+)$', BasketItemsView.as_view(), name='basketItems'),
    re_path(r'^(?P<basket_id>[a-f0-9\-]+)/checkout$', BasketCheckoutView.as_view(), name='checkout'),
    re_path(r'^(?P<basket_id>[a-f0-9\-]+)/payment/verify$', BasketPaymentVerifyView.as_view(), name='paymentVerify'),

    path('', BasketsView.as_view(), name='basket'),

]
