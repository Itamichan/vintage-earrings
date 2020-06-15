
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/', include('authentication.urls')),
    path('api/v1/user/', include('user.urls')),
    path('api/v1/products/', include('product.urls')),
    path('api/v1/baskets/', include('basket.urls')),
    path('api/v1/order/', include('order.urls')),
]
