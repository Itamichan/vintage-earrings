from django.db import models
import uuid


class Basket(models.Model):
    # Models the basket.

    id = models.UUIDField(default=uuid.uuid4, primary_key=True,  editable=False)

    class Meta:
        db_table = 'baskets'
