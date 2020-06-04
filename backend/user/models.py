from django.contrib.auth.models import User
from django.db import models

class DeliveryAddress(models.Model):

    # defines the enumerations that are given as choices to the type field.
    class Types(models.TextChoices):
        BOTH = 'both'
        BILLING = 'billing'
        SHIPPING = 'shipping'

    # Models the shipping information of an user
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    type = models.CharField(
        max_length=20,
        help_text='the type can be: both, billing or shipping',
        choices=Types.choices,
        default=Types.SHIPPING
    )

    street = models.CharField(max_length=64)
    str_nr = models.IntegerField('street number')
    apt_nr = models.IntegerField('apartment number')
    zip = models.IntegerField()
    city = models.CharField(max_length=64)
    country = models.CharField(max_length=64)

    class Meta:
        db_table = 'delivery_address'
