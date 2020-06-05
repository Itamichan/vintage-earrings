from django.db import models


class Product(models.Model):
    # Models the products' information.
    name = models.CharField(max_length=64, unique=True)
    description = models.TextField()
    price = models.IntegerField()
    quantity = models.IntegerField()

    class Meta:
        db_table = 'products'

    def __str__(self):
        return self.name


class ProductPhoto(models.Model):
    # Models the photos used for the product's representation.
    photo_url = models.URLField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        db_table = 'product_photos'
