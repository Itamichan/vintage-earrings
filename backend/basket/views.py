import json

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from basket.models import Basket, BasketItem
from errors import JsonResponse500, JsonResponse400
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
        # todo add proper url examples
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
