import json

from django.test import TestCase

from basket.models import Basket, BasketWithItems
from product.models import Product, ProductPhoto


class BasketCreationTest(TestCase):
    def test_basket_exists_in_the_database(self):
        """
        tests that a new field is created in the Basket table.
        """
        response = self.client.get(path='/api/v1/baskets/')

        basket_id = Basket.objects.first().id

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['basket_id'], str(basket_id))


class BasketItemsTest(TestCase):
    def test_return_item_info(self):
        """
        tests that a
        """

        product = Product.objects.create(name='earings', description='very beautiful', price=200, quantity=20)
        photo = ProductPhoto.objects.create(photo_url='photo a', product=product)

        product_id = product.id
        basket_id = Basket.objects.create().id

        response = self.client.post(
            path='/api/v1/baskets/items/',
            data=json.dumps({
                "product_id": product_id,
                "basket_id": str(basket_id)
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 200)
        self.assertDictEqual(response.json(), {
            'item_info': {
                'id': 1,
                'items_quantity': 1,
                'product': {'description': product.description,
                            'id': product.id,
                            'name': product.name,
                            'photos': [{'id': photo.id,
                                        'photo_url': photo.photo_url,
                                        'product_id': product.id}],
                            'price': product.price,
                            'quantity': product.quantity}}
        })
