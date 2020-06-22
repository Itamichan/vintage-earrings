from django.test import TransactionTestCase
from product.models import Product, ProductPhoto


class ProductsListTest(TransactionTestCase):
    def test_get_all_products(self):
        """
        tests that all products are retrieved from the database and returned into a list.
        """
        self.maxDiff = None
        product1 = Product.objects.create(name='earings', description='very beautiful', price=200, quantity=20)
        product2 = Product.objects.create(name='earings2', description='very beautiful', price=200, quantity=20)
        product3 = Product.objects.create(name='earings3', description='very beautiful', price=200, quantity=20)

        ProductPhoto.objects.create(photo_url='photo a', product=product1)
        ProductPhoto.objects.create(photo_url='photo b', product=product2)
        ProductPhoto.objects.create(photo_url='photo c', product=product3)

        response = self.client.get(
            path='/api/v1/products/')

        self.assertEqual(response.status_code, 200)
        self.assertDictEqual(response.json(), {
            'products': [
                {
                    'id': 1,
                    'name': 'earings',
                    'description': 'very beautiful',
                    'price': 200,
                    'quantity': 20,
                    'photos': [
                        {
                            'id': 1,
                            'photo_url': 'photo a',
                            'product_id': 1
                        }
                    ]
                },
                {
                    'id': 2,
                    'name': 'earings2',
                    'description': 'very beautiful',
                    'price': 200,
                    'quantity': 20,
                    'photos': [
                        {
                            'id': 2,
                            'photo_url': 'photo b',
                            'product_id': 2
                        }
                    ]
                },
                {
                    'id': 3,
                    'name': 'earings3',
                    'description': 'very beautiful',
                    'price': 200,
                    'quantity': 20,
                    'photos': [
                        {
                            'id': 3,
                            'photo_url': 'photo c',
                            'product_id': 3
                        }
                    ]
                }
            ]
        })


class LatestProductsListTest(TransactionTestCase):
    def test_get_latest_6_products(self):
        """
        tests that the latest 6 products are retrieved from the database and returned into a list.
        """
        self.maxDiff = None
        Product.objects.create(name='earings', description='very beautiful', price=200, quantity=20)
        Product.objects.create(name='earings2', description='very beautiful', price=200, quantity=20)
        Product.objects.create(name='earings3', description='very beautiful', price=200, quantity=20)
        Product.objects.create(name='earings4', description='very beautiful', price=200, quantity=20)
        Product.objects.create(name='earings5', description='very beautiful', price=200, quantity=20)
        Product.objects.create(name='earings6', description='very beautiful', price=200, quantity=20)
        Product.objects.create(name='earing7', description='very beautiful', price=200, quantity=20)
        Product.objects.create(name='earings8', description='very beautiful', price=200, quantity=20)
        Product.objects.create(name='earings9', description='very beautiful', price=200, quantity=20)

        response = self.client.get(
            path='/api/v1/products/latest/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['latestProducts']), 6)
