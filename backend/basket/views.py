import json

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from basket.models import Basket, BasketWithItems
from errors import JsonResponse500, JsonResponse400
from product.models import Product


class BasketsView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(BasketsView, self).dispatch(request, *args, **kwargs)

    def get(self, request):
        """

        @api {GET} /api/v1/baskets Create a Basket
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

    def post(self, request):
        """

        @api {POST} /api/v1/baskets/items Manage items in the Basket
        @apiVersion 1.0.0

        @apiName BasketManagement
        @apiGroup Baskets

        @apiDescription  The endpoint is responsible for adding or removing items to/from the basket.

        @apiSuccess {String}   basket.id       Basket's id.

        @apiSuccess {Object[]}  products                List with products.
        @apiSuccess {Integer}   products.id             Product's id.
        @apiSuccess {String}    products.name           Product's name.
        @apiSuccess {String}    products.description    Product's description.
        @apiSuccess {Integer}   products.price          Product's price per item.
        @apiSuccess {Integer}   products.quantity       Total available products.
        @apiSuccess {Object}    products.photo          Product's photo dictionary.
        @apiSuccess {Integer}   photo.id                Photo's id.
        @apiSuccess {String}    photo.photo_url         Photo's url.

         @apiSuccessExample {json} Success-Response:
        # todo add proper url examples
        HTTP/1.1 200 OK
        {
            'item_info':
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
        }


        @apiError (InternalServerError 500) {Object} InternalServerError

        """
        try:
            payload = json.loads(request.body.decode('UTF-8'))

            product_id = payload.get('product_id', '')
            basket_id = payload.get('basket_id', '')

            new_item = BasketWithItems.objects.create(basket=Basket.objects.get(pk=basket_id),
                                                      product=Product.objects.get(pk=product_id), items_quantity=1)
            if not new_item:
                return JsonResponse400('InvalidId', 'Provided product id or basket id does not exist').json_response()

            # query set returns the item from the BasketWithItems joined with the Product table on product Foreign Key.
            item = BasketWithItems.objects.select_related('product').get(pk=new_item.id)

            item_info = {
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

            return JsonResponse({
                "item_info": item_info
            })
        except Exception as e:
            print(e)
            return JsonResponse500().json_response()
