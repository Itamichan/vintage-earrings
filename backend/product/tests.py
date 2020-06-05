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

        # def test_show_case(self):
        #     product1 = Product.objects.create(name='earings1', description='very beautiful', price=200, quantity=20)
        #     photo_a = ProductPhoto.objects.create(photo_url='photo a', product=product1)
        #     photo_b = ProductPhoto.objects.create(photo_url='photo b', product=product1)
        #
        #     product2 = Product.objects.create(name='earings2', description='very beautiful', price=200, quantity=20)
        #     photo_c = ProductPhoto.objects.create(photo_url='photo a', product=product2)
        #     photo_d = ProductPhoto.objects.create(photo_url='photo b', product=product2)
        #
        #     with self.assertNumQueries(1):
        #         photo = ProductPhoto.objects.select_related('product').get(pk=photo_a.id)
        #         print(photo.photo_url)
        #         print(photo.product.name)
        #
        #     print(product1.productphoto_set.all().query)
        #     print(ProductPhoto.objects.filter(product_id=product1).query)
        #     print(ProductPhoto.objects.filter(product=product1).query)
        #
        #     with self.assertNumQueries(3):
        #         products = Product.objects.prefetch_related('productphoto_set').all()
        #         for product in products:
        #             print(product)
        #             print(product.productphoto_set.all())
