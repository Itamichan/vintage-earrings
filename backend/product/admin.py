from django.contrib import admin

from product.models import Product, ProductPhoto


class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'quantity']


class ProductPhotoAdmin(admin.ModelAdmin):
    list_display = ['photo_url']


admin.site.register(Product, ProductAdmin)
admin.site.register(ProductPhoto, ProductPhotoAdmin)
