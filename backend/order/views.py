import json

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from django.conf import settings
from django.http import JsonResponse

from basket.models import Basket, BasketItem
from errors import JsonResponse500, JsonResponse400
from order.models import Order, OrderItem


class OrderItemsView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(OrderItemsView, self).dispatch(request, *args, **kwargs)

    def post(self, request):
        # todo the proper documentation
        """

        @api {POST} /api/v1/orders/order/items Order Items
        @apiVersion 1.0.0

        @apiName OrderItems
        @apiGroup Orders

        @apiDescription  The endpoint is responsible for creation of the Order and Order Items based on the successful payment of the Basket Items.


         @apiSuccessExample {json} Success-Response:

        HTTP/1.1 200 OK

            {

            }


        @apiError (InternalServerError 500) {Object}    InternalServerError

        """
        # try:
        #     payload = json.loads(request.body.decode('UTF-8'))
        #
        #     basket_id = payload.get('basket_id', '')
        #
        #     if not basket_id:
        #         return JsonResponse400('InvalidBasketId', 'Please provide a valid basket id.').json_response()
        #
        #     basket = Basket.objects.get(pk=basket_id)
        #
        #     items_qs = BasketItem.objects.select_related('product').filter(basket=basket)
        #
        #     order = Order.objects.create(stripe_id=basket.stripe_id)
        #
        #     for item in items_qs:
        #         OrderItem.objects.create(order=order, product=item.product, items_quantity=item.items_quantity)
        #
        #     # destroy the basket after the order is created
        #     basket.delete()
        #
        #     return JsonResponse({
        #
        #     })
        #
        # except Basket.DoesNotExist:
        #     return JsonResponse400('BasketNotFound', 'Such basket id does not exist').json_response()
        # except Exception as e:
        #     print(e)
        #     return JsonResponse500().json_response()
