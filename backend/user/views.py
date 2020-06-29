import json

from django.contrib.auth.models import User
from django.db import IntegrityError
from django.forms import model_to_dict
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from communication import contact_support_email
from errors import JsonResponse500, JsonResponse400
from user.models import DeliveryAddress


class UserContactView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(UserContactView, self).dispatch(request, *args, **kwargs)

    def post(self, request):
        # todo documentation
        """

        @api {POST} api/v1/user/contact User Communication
        @apiVersion 1.0.0

        @apiName    UserCommunication
        @apiGroup   Users

        @apiDescription  The endpoint is responsible for receiving the emails sent by the users sent by the contact form.

        @apiParam   {String{8..}}                password       The password provided by the user. Must be at least 8 characters long.
        @apiParam   {String}                     email          The provided email by the user. Used as username.
        @apiSuccessExample {json} Success-Response:
        HTTP/1.1 200 OK
        {}

        @apiError (Bad Request 400)             {Object}        InvalidPassword             The password should have at least 8 characters and can contain any char except white space.
        @apiError (Bad Request 400)             {Object}        UnavailableUsername         The email already exists in the database.
        @apiError (Bad Request 400)             {Object}        InvalidEmailFormat          The Email should have an "@" sign and a email domain name with a domain ending of at least 2 characters.
        @apiError (InternalServerError 500)     {Object}        InternalServerError

        """

        try:

            payload = json.loads(request.body.decode('UTF-8'))

            email = payload.get('email', '')
            name = payload.get('name', '')
            text = payload.get('message', '')

            contact_support_email(email, text, name)

            return JsonResponse({}, status=200)

        except Exception as e:
            print(e)
            return JsonResponse500().json_response()


class UserAddressView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(UserAddressView, self).dispatch(request, *args, **kwargs)

    def post(self, request, user_email):

        """

        @api {POST} api/v1/user/<user_email>/address/ Address Creation
        @apiVersion 1.0.0

        @apiName    AddressCreation
        @apiGroup   Users

        @apiDescription  The endpoint is responsible for saving to the database the address provided by the user.

        @apiParam   {String}      first_name          The provided first name by the user.
        @apiParam   {String}      last_name           The provided last name by the user.
        @apiParam   {String}      street_address      The provided street address by the user.
        @apiParam   {Number}      apt_nr              The provided apartment number by the user.
        @apiParam   {Number}      postal_code         The provided postal code by the user.
        @apiParam   {String}      city                The provided city by the user.
        @apiParam   {String}      country             The provided country by the user.

        @apiSuccessExample {json} Success-Response:
        HTTP/1.1 200 OK
        {}

        @apiError (Bad Request 400)             {Object}        AddressNotProvided      Please complete the fields for delivery address.
        @apiError (Bad Request 400)             {Object}        UserDoesNotExist        Please complete the fields for delivery address.
        @apiError (InternalServerError 500)     {Object}        InternalServerError

        """

        try:

            payload = json.loads(request.body.decode('UTF-8'))

            first_name = payload.get('first_name', '')
            last_name = payload.get('last_name', '')
            street_address = payload.get('street_address', '')
            apt_nr = int(payload.get('apt_nr', ''))
            postal_code = int(payload.get('postal_code', ''))
            city = payload.get('city', '')
            country = payload.get('country', '')

            provided_address = []

            for key in ["first_name", "last_name", "street_address", "apt_nr", "postal_code", "city", "country"]:
                value = payload.get(key, None)

                if value is not None:
                    provided_address.append(value)

            # if no values are provided the Bad Request is risen.
            if len(provided_address) == 0:
                return JsonResponse400('AddressNotProvided',
                                       'Please complete the fields for delivery address.').json_response()

            # Checks if such and address already exists in the database
            user = User.objects.get(email=user_email.lower())

            DeliveryAddress.objects.create(first_name=first_name, last_name=last_name, user=user,
                                           street=street_address, apt_nr=apt_nr, zip_code=postal_code,
                                           city=city, country=country)
            return JsonResponse({}, status=200)

        except User.DoesNotExist:
            return JsonResponse400('UserDoesNotExist', 'Such a user does not exist').json_response()
        except IntegrityError:
            return JsonResponse({}, status=200)
        except Exception as e:
            print(e)
            return JsonResponse500().json_response()

    def get(self, request, user_email):

        """
        @api {GET} api/v1/user/<user_email>/address/ Address Fetch
        @apiVersion 1.0.0

        @apiName    AddressFetch
        @apiGroup   Users

        @apiDescription  The endpoint is responsible for retrieving the user's address information.

        @apiSuccessExample {json} Success-Response:
        HTTP/1.1 200 OK
        {
            'address': {'apt_nr': 21,
                        'city': 'Stockholm',
                        'country': 'Sweden',
                        'first_name': 'cristina',
                        'id': 1,
                        'last_name': 'garbuz',
                        'street': 'street',
                        'user': 1,
                        'zip_code': 14}
        }

        @apiError (Bad Request 400)             {Object}        UserDoesNotExist        Please complete the fields for delivery address.
        @apiError (InternalServerError 500)     {Object}        InternalServerError

        """

        try:
            user = User.objects.get(email=user_email.lower())

            delivery_address = DeliveryAddress.objects.filter(user=user).last()
            address_dict = model_to_dict(delivery_address)

            return JsonResponse({
                'address': address_dict
            }, status=200)

        except User.DoesNotExist:
            return JsonResponse400('UserDoesNotExist', 'Such a user does not exist').json_response()
        except IntegrityError:
            return JsonResponse({}, status=200)
        except Exception as e:
            print(e)
            return JsonResponse500().json_response()
