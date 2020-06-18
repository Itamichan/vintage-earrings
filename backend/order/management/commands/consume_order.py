from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
import pika
from basket.models import Basket, BasketItem
from order.models import Order, OrderItem


class Command(BaseCommand):
    help = 'Creates the Order and destroys the Basket'

    def create_basket(self, basket_id):
        basket = Basket.objects.get(pk=basket_id)

        items_qs = BasketItem.objects.select_related('product').filter(basket=basket)

        order = Order.objects.create(stripe_id=basket.stripe_id)

        for item in items_qs:
            OrderItem.objects.create(order=order, product=item.product, items_quantity=item.items_quantity)

        # destroy the basket after the order is created
        basket.delete()

    def callback(self, ch, method, properties, body):
        self.create_basket(body.decode('ascii'))
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
