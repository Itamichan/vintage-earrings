from django.urls import path
from product.views import ProductsView, LatestProductsView

app_name = 'products'

urlpatterns = [
    path('latest/', LatestProductsView.as_view(), name='latestProducts'),
    path('', ProductsView.as_view(), name='products'),

]
