from django.test import TestCase

from basket.models import Basket, BasketItem
from order.management.commands.consume_order import Command
from order.models import Order, OrderItem
from product.models import Product, ProductPhoto


class OrderCreationTest(TestCase):
    """
    Tests that a Order is created based on the existing Basket. After Order creation the Basket is destroyed
    """
    def test_order_creation(self):
        basket = Basket.objects.create(stripe_id='some-random-stripe-id')

        product1 = Product.objects.create(name='earings1', description='very beautiful', price=200, quantity=20)
        ProductPhoto.objects.create(photo_url='photo a', product=product1)

        product2 = Product.objects.create(name='earings2', description='very beautiful', price=200, quantity=20)
        ProductPhoto.objects.create(photo_url='photo b', product=product2)

        BasketItem.objects.create(basket=basket, product=product1, items_quantity=1)
        BasketItem.objects.create(basket=basket, product=product2, items_quantity=1)

        # todo see what i wanted to do here
        # create instance of Command class
        create_basket_test = Command()
        create_basket_test.create_basket(basket.id)

        # check that a Order was created
        self.assertTrue(Order.objects.count(), 1)

        order = Order.objects.get(stripe_id=basket.stripe_id)

        order_items = list(OrderItem.objects.select_related('product').filter(order=order))

        # check that the Order contains the products from the Basket
        self.assertEqual(order_items[0].product, product1)
        self.assertEqual(order_items[1].product, product2)

        # check that the Basket is destroyed
        self.assertFalse(Basket.objects.filter(pk=basket.id).exists())
