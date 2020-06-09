import json

from django.test import TestCase

from basket.models import Basket, BasketItem
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
        tests that the endpoint returns a dictionary with all the relevant information for the item.
        """

        product = Product.objects.create(name='earings', description='very beautiful', price=200, quantity=20)
        photo = ProductPhoto.objects.create(photo_url='photo a', product=product)

        product_id = product.id
        basket_id = Basket.objects.create().id

        response = self.client.post(
            path=f'/api/v1/baskets/{basket_id}/items/',
            data=json.dumps({
                "product_id": product_id,
                "basket_id": str(basket_id)
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 200)
        self.assertDictEqual(response.json(), {
            'id': 1,
            'items_quantity': 1,
            'product': {
                'description': product.description,
                'id': product.id,
                'name': product.name,
                'photos': [
                    {
                        'id': photo.id,
                        'photo_url': photo.photo_url,
                        'product_id': product.id
                    }
                ],
                'price': product.price,
                'quantity': product.quantity
            }
        }
                             )

    def test_item_can_be_added_only_once(self):
        """
        tests that the endpoint adds the item to the basket only one time.
        """

        self.maxDiff = None

        product = Product.objects.create(name='earings', description='very beautiful', price=200, quantity=20)
        ProductPhoto.objects.create(photo_url='photo a', product=product)

        product_id = product.id
        basket_id = Basket.objects.create().id

        self.client.post(
            path=f'/api/v1/baskets/{basket_id}/items/',
            data=json.dumps({
                "product_id": product_id,
                "basket_id": str(basket_id)
            }),
            content_type="application/json")

        response = self.client.post(
            path=f'/api/v1/baskets/{basket_id}/items/',
            data=json.dumps({
                "product_id": product_id,
                "basket_id": str(basket_id)
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'DuplicateItem')

    def test_update_item_quantity(self):
        """
        tests that the endpoint updates the quantity of the Item in the Basket.
        """

        self.maxDiff = None

        product = Product.objects.create(name='earings', description='very beautiful', price=200, quantity=20)
        ProductPhoto.objects.create(photo_url='photo a', product=product)
        product_id = product.id

        basket = Basket.objects.create()
        basket_id = basket.id

        BasketItem.objects.create(basket=basket, product=product, items_quantity=1)

        response = self.client.patch(
            path=f'/api/v1/baskets/{basket_id}/items/',
            data=json.dumps({
                "product_id": product_id,
                "basket_id": str(basket_id)
            }),
            content_type="application/json")

        updated_basket_item = BasketItem.objects.get(basket=basket, product=product)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(updated_basket_item.items_quantity, 2)

        self.client.patch(
            path=f'/api/v1/baskets/{basket_id}/items/',
            data=json.dumps({
                "product_id": product_id,
                "basket_id": str(basket_id)
            }),
            content_type="application/json")

        updated_again_basket_item = BasketItem.objects.get(basket=basket, product=product)
        self.assertEqual(updated_again_basket_item.items_quantity, 3)

    def test_get_items_info(self):
        """
        tests that the endpoint returns a list with all the items and their relevant information.
        """

        self.maxDiff = None

        product1 = Product.objects.create(name='earings1', description='very beautiful', price=200, quantity=20)
        photo1 = ProductPhoto.objects.create(photo_url='photo a', product=product1)

        product2 = Product.objects.create(name='earings2', description='very beautiful', price=200, quantity=20)
        photo2 = ProductPhoto.objects.create(photo_url='photo a', product=product2)

        basket = Basket.objects.create()
        basket_id = basket.id

        BasketItem.objects.create(basket=basket, product=product1, items_quantity=1)
        BasketItem.objects.create(basket=basket, product=product2, items_quantity=1)

        response = self.client.get(
            path=f'/api/v1/baskets/{basket_id}/items/')

        self.assertEqual(response.status_code, 200)
        self.assertDictEqual(response.json(), {
            'items': [
                {
                    'id': 1,
                    'items_quantity': 1,
                    'product': {
                        'description': product1.description,
                        'id': product1.id,
                        'name': product1.name,
                        'photos': [
                            {
                                'id': photo1.id,
                                'photo_url': photo1.photo_url,
                                'product_id': product1.id
                            }
                        ],
                        'price': product1.price,
                        'quantity': product1.quantity
                    }
                },
                {
                    'id': 2,
                    'items_quantity': 1,
                    'product': {
                        'description': product2.description,
                        'id': product2.id,
                        'name': product2.name,
                        'photos': [
                            {
                                'id': photo2.id,
                                'photo_url': photo2.photo_url,
                                'product_id': product2.id
                            }
                        ],
                        'price': product2.price,
                        'quantity': product2.quantity
                    }
                }
            ]
        }
                             )
