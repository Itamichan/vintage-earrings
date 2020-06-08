from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from basket.models import Basket
from errors import JsonResponse500
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

        @apiSuccess {Integer}   basket.id       Basket's id.

        @apiSuccessExample {json} Success-Response:
        HTTP/1.1 200 OK
        {
           "basket_id": 21415
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
