from django.contrib.auth.models import User
from django.db import models
from django.db.models import UniqueConstraint


class DeliveryAddress(models.Model):
    # Models the shipping information of an user
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    street = models.CharField(max_length=64)
    apt_nr = models.IntegerField()
    zip_code = models.IntegerField()
    city = models.CharField(max_length=64)
    country = models.CharField(max_length=64)

    class Meta:
        db_table = 'delivery_address'
        # ensure that the address is saved only once to the database.
        constraints = [
            UniqueConstraint(fields=['first_name', 'last_name', 'user', 'street', 'apt_nr',
                                     'zip_code', 'city', 'country'], name='unique_address')
        ]
