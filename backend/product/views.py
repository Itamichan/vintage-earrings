from django.http import JsonResponse
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from errors import JsonResponse500
from product.models import Product


class ProductsView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(ProductsView, self).dispatch(request, *args, **kwargs)

    def get(self, request):
        """

        @api {GET} /api/v1/products Search Attractions
        @apiVersion 1.0.0

        @apiName SearchAttractions
        @apiGroup Attractions

        @apiDescription  The endpoint is responsible for getting all the existing products from the database.

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
            'products': [
                {
                    'id': 1,
                    'name': 'earings',
                    'description': 'very beautiful',
                    'price': 200,
                    'quantity': 20,
                    'photos': [
                        {
                            'id': 1,
                            'photo_url': 'photo a',
                            'product_id': 1
                        }
                    ]
                },
                {
                    'id': 2,
                    'name': 'earings2',
                    'description': 'very beautiful',
                    'price': 200,
                    'quantity': 20,
                    'photos': [
                        {
                            'id': 2,
                            'photo_url': 'photo b',
                            'product_id': 2
                        }
                    ]
                },
            ]
         }

        @apiError (InternalServerError 500) {Object} InternalServerError

        """
        try:

            # get a query set with all the products and prefetch the productphoto_set related to the products
            product_qs = Product.objects.prefetch_related('productphoto_set').all()

            product_list = []

            # adding to the product_list the dictionaries with the relevant roduct information.
            for product in product_qs:
                product_list.append({
                    'id': product.id,
                    'name': product.name,
                    'description': product.description,
                    'price': product.price,
                    'quantity': product.quantity,
                    'photos': list(product.productphoto_set.all().values())
                })

            return JsonResponse({
                "products": product_list
            })
        except Exception as e:
            print(e)
            return JsonResponse500().json_response()
