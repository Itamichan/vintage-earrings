import json

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

        @api {GET} /api/v1/products Search Products
        @apiVersion 1.0.0

        @apiName SearchProducts
        @apiGroup Products

        @apiDescription  The endpoint is responsible for getting all the existing products from the database.

        @apiParam   {String}   product_name             User input which will be checked against the product's name.


        @apiSuccess {Object[]}  products                List with products.
        @apiSuccess {Integer}   product.id              Product's id.
        @apiSuccess {String}    product.name            Product's name.
        @apiSuccess {Text}      product.description     Product's description.
        @apiSuccess {Integer}   product.price           Product's price per item.
        @apiSuccess {Integer}   product.quantity        Total available products.
        @apiSuccess {Object[]}  product.photo           Product's photo dictionary.
        @apiSuccess {Integer}   photo.id                Photo's id.
        @apiSuccess {URL}       photo.photo_url         Photo's url.

        @apiSuccessExample {json} Success-Response:

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
                            'photo_url': 'https://vintage-earrings.s3.eu-north-1.amazonaws.com/static/media/earrings/1.1.jpg',
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
                            'photo_url': 'https://vintage-earrings.s3.eu-north-1.amazonaws.com/static/media/earrings/1.1.jpg',
                            'product_id': 2
                        }
                    ]
                },
            ]
         }

        @apiError (InternalServerError 500) {Object} InternalServerError

        """
        try:

            product_name = request.GET.get('product_name', None)
            product_id = request.GET.get('product_id', None)

            # get a query set with all the products and prefetch the productphoto_set related to the products
            product_qs = Product.objects.prefetch_related('productphoto_set').all()

            if product_name is not None:
                product_qs = product_qs.filter(name__icontains=product_name.lower())

            if product_id is not None:
                product_qs = product_qs.filter(pk=product_id)

            product_list = []

            # adding to the product_list the dictionaries with the relevant product information.
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


class LatestProductsView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(LatestProductsView, self).dispatch(request, *args, **kwargs)

    def get(self, request):
        """

        @api {GET} /api/v1/products/latest Latest Products
        @apiVersion 1.0.0

        @apiName LatestProducts
        @apiGroup Products

        @apiDescription  The endpoint is responsible for getting the latest 6 products added to the database.

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
                            'photo_url': 'https://vintage-earrings.s3.eu-north-1.amazonaws.com/static/media/earrings/1.1.jpg',
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
                            'photo_url': 'https://vintage-earrings.s3.eu-north-1.amazonaws.com/static/media/earrings/1.1.jpg',
                            'product_id': 2
                        }
                    ]
                },
                ...
            ]
         }

        @apiError (InternalServerError 500) {Object} InternalServerError

        """
        try:

            # get a query set with the latest 6 added products and prefetch the productphoto_set related to the products
            product_qs = Product.objects.prefetch_related('productphoto_set').order_by('-id')[:4]

            latestProducts_list = []

            # adding to the product_list the dictionaries with the relevant product information.
            for product in product_qs:
                latestProducts_list.append({
                    'id': product.id,
                    'name': product.name,
                    'description': product.description,
                    'price': product.price,
                    'quantity': product.quantity,
                    'photos': list(product.productphoto_set.all().values())
                })

            return JsonResponse({
                "latestProducts": latestProducts_list
            })
        except Exception as e:
            print(e)
            return JsonResponse500().json_response()
