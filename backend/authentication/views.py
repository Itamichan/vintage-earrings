import json
import os

from django.contrib.auth.password_validation import password_validators_help_texts
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.generic import View
from django.contrib.auth import password_validation, authenticate
from django.core.validators import validate_email
from errors import JsonResponse400, JsonResponse500, JsonResponse412, JsonResponse401
from jwt import jwt

from user.models import User

# gets the value for our secret key which we will use for jwt
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev')


class RegistrationView(View):

    def post(self, request):
        """

        @api {POST} /api/v1/registration User registration
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
            user = User.objects.create_user(username=email.lower(), email=email.lower(), password=password)
            return JsonResponse({}, status=200)

        # todo add a different exception for email error?
        except ValidationError as ve:
            print('error message:', ','.join(ve.messages))
            return JsonResponse400('InvalidPassword', ','.join(ve.messages)).json_response()

        except IntegrityError:
            return JsonResponse400('UsernameAlreadyTaken', 'Please provide a different email').json_response()

        except Exception as e:
            print(e)
            return JsonResponse500().json_response()


class LoginView(View):

    def post():
        """

        @api {POST} /api/v1/token User login
        @apiVersion 1.0.0

        @apiName    UserLogin
        @apiGroup   Authentication

        @apiDescription  The endpoint is responsible for the login of the user and creation of the jwt token.

        @apiParam   {String}    email                   Email provided by the user.
        @apiParam   {String}    password                Password provided by the user.

        @apiSuccess {String}    token                   User's jwt.

        @apiSuccess {Object}    user_info               User's information.
        @apiSuccess {String}    user_info.username      User's username.
        @apiSuccess {String}    user_info.email         User's email.

        @apiSuccessExample {json} Success-Response:
        HTTP/1.1 200 OK
        {
            "token": "eyJ0eXA...",
            "user_info": {
                "username": "cristina23",
                "email": "cristina23@gmail.com"
            }
        }

        @apiError  (Unauthorized 401)           {Object} InvalidLogin           Username or password is incorrect.
        @apiError  (InternalServerError 500)    {Object} InternalServerError.

        """

        try:
            payload = json.loads(request.body.decode('UTF-8'))

            # tries to get the value if none provided returns an emtpy string
            password = payload.get('password', '')
            email = payload.get('email', '')

            user = authenticate(username=email, password=password)

            if not user:
                return JsonResponse401('email or password is incorrect').json_response()

            token_payload = {
                'id': user.id,
                'iat': datetime.datetime.now().astimezone(),
                'exp': datetime.datetime.now().astimezone() + datetime.timedelta(days=30)
            }
            token = jwt.encode(token_payload, SECRET_KEY, algorithm='HS256')

            return JsonResponse({
                'token': token.decode('ascii'),
                'user_info': user.user_info()
            })

        except Exception as e:
            print(e)
            return JsonResponse500().json_response()
