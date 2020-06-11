from django.db import models
import uuid

from product.models import Product


class Basket(models.Model):
    # Models the basket.

    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    stripe_id = models.CharField(max_length=64, null=True)

    class Meta:
        db_table = 'baskets'


class BasketItem(models.Model):
    # Models the pivot table between the Basket and Product tables.

    basket = models.ForeignKey(Basket, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    items_quantity = models.IntegerField()

    class Meta:
        db_table = 'basket_items'
