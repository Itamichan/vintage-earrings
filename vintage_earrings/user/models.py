from django.db import models


class User(models.Model):
    # Models the user which has an account
    email = models.EmailField(max_length=64, unique=True)
    password = models.CharField(max_length=64)
    salt = models.CharField(max_length=64)

    class Meta:
        db_table = 'users'


class DeliveryAddress(models.Model):
    class Types(models.TextChoices):
        BOTH = 'both'
        BILLING = 'billing'
        SHIPPING = 'shipping'

    # Models the shipping and or billing information of an user
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    type = models.CharField(
        max_length=64,
        help_text='the type can be: both, billing or shipping',
        choices=Types.choices,
        default=Types.SHIPPING
    )

    street = models.CharField(max_length=64)
    str_nr = models.IntegerField('street number', max_length=64)
    apt_nr = models.IntegerField('apartment number', max_length=64)
    zip = models.IntegerField(max_length=64)
    city = models.CharField(max_length=64)
    country = models.CharField(max_length=64)

    class Meta:
        db_table = 'delivery_address'
