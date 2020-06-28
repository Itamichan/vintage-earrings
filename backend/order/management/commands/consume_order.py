import json

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
import pika
from basket.models import Basket, BasketItem
from communication import order_confirmation_email
from order.models import Order, OrderItem


class Command(BaseCommand):
    help = 'Creates the Order and destroys the Basket'

    def create_order(self, basket_id, customer_email):
        basket = Basket.objects.get(pk=basket_id)

        items_qs = BasketItem.objects.select_related('product').filter(basket=basket)

        order = Order.objects.create(stripe_id=basket.stripe_id)

        for item in items_qs:
            OrderItem.objects.create(order=order, product=item.product, items_quantity=item.items_quantity)

        print('message consumed')
        # destroy the basket after the order is created
        basket.delete()

        orded_products_qs = OrderItem.objects.select_related('product').filter(order=order)

        items_list = []

        # adding to the product_list the dictionaries with the relevant product information.
        for item in orded_products_qs:
            items_list.append(
                {
                    'items_quantity': item.items_quantity,
                    'product': {
                        'name': item.product.name,
                        'price': item.product.price,
                    }
                }
            )

        # sends the order confirmation email to the customer.
        order_confirmation_email(customer_email, items_list)

    def callback(self, ch, method, properties, body):
        customer_info = json.loads(body)
        print('customer_info:', customer_info)

        self.create_order(customer_info[0], customer_info[1])
        ch.basic_ack(delivery_tag=method.delivery_tag)

    def handle(self, *args, **options):
        params = pika.URLParameters(settings.CLOUDAMQP_URL)
        connection = pika.BlockingConnection(params)
        channel = connection.channel()

        channel.queue_declare(queue='order', durable=True)

        # Tells RabbitMQ not to give more than one message to a worker at a time.
        channel.basic_qos(prefetch_count=1)

        channel.basic_consume(
            queue='order', on_message_callback=self.callback)

        print(' [*] Waiting for messages. To exit press CTRL+C')
        channel.start_consuming()
