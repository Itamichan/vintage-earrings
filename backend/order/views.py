from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from django.conf import settings
from django.http import JsonResponse


class OrderView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(OrderView, self).dispatch(request, *args, **kwargs)

    def get(self, request):

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



            return JsonResponse({

            })
        except Exception as e:
            print(e)
            return JsonResponse500().json_response()
