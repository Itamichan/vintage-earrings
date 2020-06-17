import json
import uuid

import pika
import stripe
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from basket.models import Basket, BasketItem
from errors import JsonResponse500, JsonResponse400, JsonResponse402
from product.models import Product


class BasketsView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(BasketsView, self).dispatch(request, *args, **kwargs)

    def post(self, request):
        """

        @api {POST} /api/v1/baskets Create a Basket
        @apiVersion 1.0.0

        @apiName CreateBasket
        @apiGroup Baskets

        @apiDescription  The endpoint is responsible for creation of a new basket in the database.

        @apiSuccess {String}   basket.id       Basket's id.

        @apiSuccessExample {json} Success-Response:
        HTTP/1.1 200 OK
        {
           "basket_id": "5f841f73-6096-4b78-b660-a830ee6e59bf"
         }

        @apiError (InternalServerError 500) {Object} InternalServerError

        """
        try:

            basket = Basket.objects.create()

            return JsonResponse({
                "basket_id": basket.id
            })
        except Exception as e:
            print(e)
            return JsonResponse500().json_response()


class BasketItemsView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(BasketItemsView, self).dispatch(request, *args, **kwargs)

    def post(self, request, basket_id):
        """

        @api {POST} /api/v1/baskets/<basket_id>/items Add Item to the Basket
        @apiVersion 1.0.0

        @apiName AddItemToBasket
        @apiGroup Baskets

        @apiDescription  The endpoint is responsible for adding an item to the Basket.

        @apiParam   {Integer}   product_id              The product_id passed by the client side.

        @apiSuccess {Object}    item                    Represents the information about the item in the basket and the subsequent information about the product.
        @apiSuccess {Integer}   id                      Id of added item to the basket.
        @apiSuccess {String}    items_quantity          Represents the quantity of added item to the basket.
        @apiSuccess {Object[]}  products                List with products.
        @apiSuccess {Integer}   products.id             Product's id.
        @apiSuccess {String}    products.name           Product's name.
        @apiSuccess {Text}      products.description    Product's description.
        @apiSuccess {Integer}   products.price          Product's price per item.
        @apiSuccess {Integer}   products.quantity       Total available products.
        @apiSuccess {Object[]}  products.photo          Product's photo dictionary.
        @apiSuccess {Integer}   photo.id                Photo's id.
        @apiSuccess {URL}       photo.photo_url         Photo's url.

         @apiSuccessExample {json} Success-Response:
        # todo add proper url examples
        HTTP/1.1 200 OK

            {
                'id': 1,
                'items_quantity': 1,
                'product':
                {
                    'id': 1,
                    'name': 'earings',
                    'description': 'very beautiful',
                    'price': 200,
                    'quantity': 20,
                    'photos':
                    [
                        {
                            'id': 1,
                            'photo_url': 'photo a',
                            'product_id': 1
                        }
                    ]
                 }
            }

        @apiError (Bad Request 400)         {Object}    InvalidProductId        Please provide a valid product id.
        @apiError (Bad Request 400)         {Object}    InvalidBasketId         Please provide a valid basket id.
        @apiError (InternalServerError 500) {Object}    InternalServerError

        """
        try:
            payload = json.loads(request.body.decode('UTF-8'))

            product_id = payload.get('product_id', '')

            # raises an error if the basket id or product id is not provided.
            if not product_id:
                return JsonResponse400('InvalidProductId', 'Please provide a valid product id.').json_response()

            if not basket_id:
                return JsonResponse400('InvalidBasketId', 'Please provide a valid basket id.').json_response()

            basket = Basket.objects.get(pk=basket_id)
            product = Product.objects.get(pk=product_id)

            basket_item = BasketItem.objects.filter(basket=basket, product=product).exists()

            if basket_item:
                return JsonResponse400('DuplicateItem', 'This item already exists in the basket.').json_response()

            # Adding the new item to the Basket.
            new_item = BasketItem.objects.create(basket=basket, product=product, items_quantity=1)

            # query set returns the item from the BasketWithItems joined with the Product table on product Foreign Key.
            item = BasketItem.objects.select_related('product').get(pk=new_item.id)

            return JsonResponse({
                'id': item.id,
                'items_quantity': item.items_quantity,
                'product': {
                    'id': item.product.id,
                    'name': item.product.name,
                    'description': item.product.description,
                    'price': item.product.price,
                    'quantity': item.product.quantity,
                    'photos': list(item.product.productphoto_set.all().values())
                }
            })
        except Basket.DoesNotExist:
            return JsonResponse400('BasketNotFound', 'Such basket id does not exist').json_response()
        except Exception as e:
            print(e)
            return JsonResponse500().json_response()

    def patch(self, request, basket_id, item_id):
        """

        @api {PATCH} /api/v1/baskets/<basket_id>/items/<item_id> Update the items_quantity
        @apiVersion 1.0.0

        @apiName UpdateItemNumber
        @apiGroup Baskets

        @apiDescription  The endpoint is responsible for updating the number of items in the basket.

        @apiParam   {Integer}   quantity              The product_id passed by the client side.

        @apiSuccessExample {json} Success-Response:
        HTTP/1.1 200 OK
            { }

        @apiError (Bad Request 400)         {Object}    InvalidItemId        Please provide a valid item id.
        @apiError (Bad Request 400)         {Object}    InvalidBasketId         Please provide a valid basket id.
        @apiError (Bad Request 400)         {Object}    InvalidQuantity         Please provide a valid quantity value.
        @apiError (InternalServerError 500) {Object}    InternalServerError

        """
        try:
            payload = json.loads(request.body.decode('UTF-8'))

            item_quantity = payload.get('quantity', '')

            # raises an error if a value is not provided.
            if not item_id:
                return JsonResponse400('InvalidItemId', 'Please provide a valid item id.').json_response()

            if not basket_id:
                return JsonResponse400('InvalidBasketId', 'Please provide a valid basket id.').json_response()

            if not item_quantity:
                return JsonResponse400('InvalidQuantity', 'Please provide a valid quantity value.').json_response()

            basket = Basket.objects.get(pk=basket_id)

            basket_item = BasketItem.objects.get(basket=basket, pk=item_id)

            if not basket_item:
                return JsonResponse400('BasketItemNotFound',
                                       'This basked does not contain such an item').json_response()

            basket_item.items_quantity = item_quantity
            basket_item.save()

            # todo delete comment bellow

            # # query set returns the item from the BasketWithItems joined with the Product table on product Foreign Key.
            # item = BasketItem.objects.select_related('product').get(pk=new_item.id)
            #
            # return JsonResponse({
            #     'id': item.id,
            #     'items_quantity': item.items_quantity,
            #     'product': {
            #         'id': item.product.id,
            #         'name': item.product.name,
            #         'description': item.product.description,
            #         'price': item.product.price,
            #         'quantity': item.product.quantity,
            #         'photos': list(item.product.productphoto_set.all().values())
            #     }
            # })
            return JsonResponse({})
        except Exception as e:
            print(e)
            return JsonResponse500().json_response()

    def get(self, request, basket_id):
        """

        @api {GET} /api/v1/baskets/<basket_id>/items Get Items from the Basket
        @apiVersion 1.0.0

        @apiName GetItemsFromBasket
        @apiGroup Baskets

        @apiDescription  The endpoint is responsible for getting the Items from the Basket.

        @apiSuccess {Object[]}  items                   Represents all the existing items in the Basket.
        @apiSuccess {Integer}   id                      Id of added item to the basket.
        @apiSuccess {Integer}   items_quantity          Represents the quantity of added item to the basket.
        @apiSuccess {Object[]}  products                List with products.
        @apiSuccess {Integer}   products.id             Product's id.
        @apiSuccess {String}    products.name           Product's name.
        @apiSuccess {Text}      products.description    Product's description.
        @apiSuccess {Integer}   products.price          Product's price per item.
        @apiSuccess {Integer}   products.quantity       Total available products.
        @apiSuccess {Object[]}  products.photo          Product's photo dictionary.
        @apiSuccess {Integer}   photo.id                Photo's id.
        @apiSuccess {URL}       photo.photo_url         Photo's url.

         @apiSuccessExample {json} Success-Response:
        # todo add proper url examples and JsonResponse dict
        HTTP/1.1 200 OK

            {
             items: []
            }

        @apiError (Bad Request 400)         {Object}    InvalidBasketId         Please provide a valid basket id.
        @apiError (InternalServerError 500) {Object}    InternalServerError

        """
        try:

            # raises an error if no basked id is provided.
            if not basket_id:
                return JsonResponse400('InvalidBasketId', 'Please provide a valid basket id.').json_response()

            # get a query set that returns all the items from a specific basket joined with the Product table on
            # product's Foreign Key.

            basket = Basket.objects.get(pk=basket_id)
            items_qs = BasketItem.objects.select_related('product').filter(basket=basket)

            items_list = []

            # adding to the product_list the dictionaries with the relevant product information.
            for item in items_qs:
                items_list.append(
                    {
                        'id': item.id,
                        'items_quantity': item.items_quantity,
                        'product': {
                            'id': item.product.id,
                            'name': item.product.name,
                            'description': item.product.description,
                            'price': item.product.price,
                            'quantity': item.product.quantity,
                            'photos': list(item.product.productphoto_set.all().values())
                        }
                    }
                )

            return JsonResponse({
                "items": items_list
            })
        except Exception as e:
            print(e)
            return JsonResponse500().json_response()

    def delete(self, request, basket_id, item_id):
        """

        @api {DELETE} /api/v1/baskets/<basket_id>/items/<item_id> Delete Item
        @apiVersion 1.0.0

        @apiName DeleteItem
        @apiGroup Baskets

        @apiDescription  The endpoint is responsible for removal of the Item from the Basket.


        @apiSuccessExample {json} Success-Response:
        HTTP/1.1 200 OK
            { }

        @apiError (Bad Request 400)         {Object}    InvalidItemId           Please provide a valid item id.
        @apiError (Bad Request 400)         {Object}    InvalidBasketId         Please provide a valid basket id.
        @apiError (Bad Request 400)         {Object}    InvalidQuantity         Please provide a valid quantity value.
        @apiError (InternalServerError 500) {Object}    InternalServerError

        """
        try:

            # raises an error if a value is not provided.
            if not basket_id:
                return JsonResponse400('InvalidBasketId', 'Please provide a valid basket id.').json_response()

            if not item_id:
                return JsonResponse400('InvalidItemId', 'Please provide a valid item id.').json_response()

            basket = Basket.objects.get(pk=basket_id)

            basket_item = BasketItem.objects.get(basket=basket, pk=item_id)

            if not basket_item:
                return JsonResponse400('BasketItemNotFound',
                                       'This basket does not contain such an item').json_response()

            basket_item.delete()

            return JsonResponse({})
        except Exception as e:
            print(e)
            return JsonResponse500().json_response()


class BasketCheckoutView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(BasketCheckoutView, self).dispatch(request, *args, **kwargs)

    def post(self, request, basket_id):
        # todo the proper documentation
        """

        @api {POST} /api/v1/baskets/<basket_id>/checkout Checkout Basket
        @apiVersion 1.0.0

        @apiName CheckoutBasket
        @apiGroup Baskets

        @apiDescription  The endpoint is responsible for creating a stripe payment session and returning the stripe session id.

        @apiParam   {String}   email              The email passed by the client side.

        @apiSuccess {String}   sessionId          Represents the stripe session id.


         @apiSuccessExample {json} Success-Response:

        HTTP/1.1 200 OK

            {
                'sessionId': 329e-4913-ae15-e9242451f698
            }

        @apiError (Bad Request 400)         {Object}    InvalidBasketId         Please provide a valid basket id.
        @apiError (Bad Request 400)         {Object}    InvalidEmail            Please provide a valid email.
        @apiError (InternalServerError 500) {Object}    InternalServerError

        """
        try:

            payload = json.loads(request.body.decode('UTF-8'))

            email = payload.get('email', '')

            try:
                validate_email(email)
            except ValidationError as ve:
                print('error message:', ','.join(ve.messages))
                return JsonResponse400('InvalidEmail', ','.join(ve.messages)).json_response()

            if not basket_id:
                return JsonResponse400('InvalidBasketId', 'Please provide a valid basket id.').json_response()

            basket = Basket.objects.get(pk=basket_id)
            stripe_id = basket.stripe_id

            if not stripe_id or True:

                basket_items_list = BasketItem.objects.prefetch_related('product').filter(basket=basket)

                # creating the list with all the products' information to be passed to stripe
                line_items = []

                for item in basket_items_list:
                    line_items.append(
                        {
                            "name": item.product.name,
                            "currency": 'eur',
                            "amount": item.product.price * 100,
                            "quantity": item.items_quantity,
                            'images': [product_image.photo_url for product_image in item.product.productphoto_set.all()]
                        }
                    )

                # stripe payment

                stripe.api_key = settings.STRIPE_API_KEY

                stripe_response = stripe.checkout.Session.create(
                    success_url=f"{settings.HOST}/success/{basket_id}",
                    cancel_url=f"{settings.HOST}/cancel/{basket_id}",
                    customer_email=email,
                    payment_method_types=["card"],
                    line_items=line_items,
                    mode='payment'
                )

                # Getting the data from the stripe response that is important for the client
                stripe_id = stripe_response['id']

                # saving the stripe_id to the Basket
                basket.stripe_id = stripe_id
                basket.save()

            return JsonResponse({
                'sessionId': stripe_id
            })
        except Exception as e:
            print(e)
            return JsonResponse500().json_response()


class BasketPaymentVerifyView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(BasketPaymentVerifyView, self).dispatch(request, *args, **kwargs)

    def get(self, request, basket_id):
        # todo the proper documentation
        """

        @api {POST} /api/v1/baskets/${basketId}/payment/verify Verify Payment
        @apiVersion 1.0.0

        @apiName PaymentVerify
        @apiGroup Baskets

        @apiDescription  The endpoint is responsible for verifying that the stripe payment was successful.


         @apiSuccessExample {json} Success-Response:

        HTTP/1.1 200 OK

            {
                'payment_status': succeeded
            }


        @apiError (InternalServerError 500) {Object}    InternalServerError

        """
        try:

            basket = Basket.objects.get(pk=basket_id)
            stripe_id = basket.stripe_id

            # retrieve a stripe session
            session_response = stripe.checkout.Session.retrieve(stripe_id)
            payment_intent = session_response.payment_intent

            # retrieve stripe PaymentIntent
            payment_intent_response = stripe.PaymentIntent.retrieve(payment_intent)
            status = payment_intent_response.status

            if status != 'succeeded':
                return JsonResponse402('There was an error processing your payment.').json_response()

            # establish a connection with RabbitMQ server.

            credentials = pika.PlainCredentials(settings.MPQ_USERNAME, settings.MPQ_PASSWORD)

            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host='localhost', credentials=credentials))
            channel = connection.channel()

            # make sure the recipient queue exists.
            # The durability options let the tasks survive even if RabbitMQ is restarted.
            channel.queue_declare(queue='order', durable=True)

            """
            In RabbitMQ a message can never be sent directly to the queue, it always needs to go through an exchange. 
            A default exchange is identified by an empty string. This exchange is special ‒ it allows us to specify 
            exactly to which queue the message should go. The queue name needs to be specified in the routing_key parameter:
            """

            channel.basic_publish(exchange='',
                                  routing_key='order',
                                  body=basket_id,
                                  properties=pika.BasicProperties(
                                      delivery_mode=2,  # make message persistent
                                  )
                                  )
            print("Message sent")
            connection.close()

            return JsonResponse({
                'payment_status': status
            })
        except Exception as e:
            print(e)
            return JsonResponse500().json_response()
