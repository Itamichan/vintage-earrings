from django.db import models


class Product(models.Model):
    # Models the products' information.
    name = models.CharField(max_length=64)
    description = models.TextField()
    price = models.IntegerField()
    qty = models.IntegerField("quantity")

    class Meta:
        db_table = 'product'


class Photo(models.Model):
    # Models the photos used for the product's representation.
    photo_url = models.CharField(max_length=64)
    user_id = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        db_table = 'photo'
