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

        # sends the order confirmation email to the customer.
        order_confirmation_email(customer_email, 'test text')

    def callback(self, ch, method, properties, body):

        customer_info = json.loads(body)

        self.create_order(customer_info['basket_id'], customer_info['customer_email'])
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
