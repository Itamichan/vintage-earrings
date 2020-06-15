import uuid

from django.db import models

from product.models import Product


class Order(models.Model):
    # Models the order.

    # defines the enumerations that are given as choices for the status field.
    class Status(models.TextChoices):
        PROCESSING = 'processing'
        SHIPPED = 'shipped'
        DELIVERED = 'delivered'

    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    stripe_id = models.CharField(max_length=64)
    order_date = models.DateTimeField(auto_now=True)

    status = models.CharField(
        max_length=64,
        help_text='the status can be: processing, shipped or delivered',
        choices=Status.choices,
        default=Status.PROCESSING
    )

    class Meta:
        db_table = 'orders'


class OrderItem(models.Model):
    # Models the pivot table between the Basket and Product tables.

    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    items_quantity = models.IntegerField()

    class Meta:
        db_table = 'order_items'
