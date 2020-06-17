from django.contrib import admin
from django.urls import path, include, re_path

from frontend.views import frontend

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/', include('authentication.urls')),
    path('api/v1/user/', include('user.urls')),
    path('api/v1/products/', include('product.urls')),
    path('api/v1/baskets/', include('basket.urls')),
    path('api/v1/orders/', include('order.urls')),
]

# Route to the frontend if nothing else matches
urlpatterns += [
    path(r'', frontend, name="frontend"),
    re_path(r'^.*/$', frontend, name="frontend"),
]
