import datetime
import json
import jwt
from django.conf import settings
from django.contrib.auth import password_validation, authenticate
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import IntegrityError
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from decorators import validate_token
from errors import JsonResponse400, JsonResponse500, JsonResponse401
from user.models import User

class UserAccountView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(UserAccountView, self).dispatch(request, *args, **kwargs)

    @validate_token
    def get(self, request):
        """

        @api {POST} api/v1/registration User registration
        @apiVersion 1.0.0

        @apiName    UserRegistration
        @apiGroup   Authentication

        @apiDescription  The endpoint is responsible for the registration of a new user.

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

            # tries to get the value. If no value is provided returns an emtpy string
            password = payload.get('password', '')
            email = payload.get('email', '')

            # checks if the password and email passes the default django validations
            password_validation.validate_password(password)
            validate_email(email)

            # create new user in the databse
            User.objects.create_user(username=email.lower(), email=email.lower(), password=password)
            return JsonResponse({}, status=200)

        # todo add a different exception for email error?
        except ValidationError as ve:
            print('error message:', ','.join(ve.messages))
            return JsonResponse400('InvalidPassword', ','.join(ve.messages)).json_response()

        except IntegrityError:
            return JsonResponse400('UnavailableUsername', 'Please provide a different email').json_response()

        except Exception as e:
            print(e)
            return JsonResponse500().json_response()