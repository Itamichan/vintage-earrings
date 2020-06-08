from django.test import TestCase

from basket.models import Basket


class BasketCreationTest(TestCase):
    def test_basket_exists_in_the_database(self):
        response = self.client.get(path='/api/v1/baskets/')

        basket_id = Basket.objects.first().id

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['basket_id'], str(basket_id))
