import datetime
import json
import os
import jwt
from django.conf import settings

from django.contrib.auth.password_validation import password_validators_help_texts
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.generic import View
from django.contrib.auth import password_validation, authenticate
from django.core.validators import validate_email
from errors import JsonResponse400, JsonResponse500, JsonResponse412, JsonResponse401

from user.models import User


class RegistrationView(View):

    def post(self, request):
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
            user = User.objects.create_user(username=email.lower(), email=email.lower(), password=password)
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


class LoginView(View):

    def post(self, request):
        """

        @api {POST} api/v1/login User login
        @apiVersion 1.0.0

        @apiName    UserLogin
        @apiGroup   Authentication

        @apiDescription  The endpoint is responsible for the login of the user and creation of the jwt token.

        @apiParam   {String}    username                Username provided by the user.
        @apiParam   {String}    password                Password provided by the user.

        @apiSuccess {String}    token                   User's jwt.

        @apiSuccessExample {json} Success-Response:
        HTTP/1.1 200 OK
        {
            "token": "eyJ0eXA...",
        }

        @apiError  (Unauthorized 401)           {Object} InvalidLogin           Username or password is incorrect.
        @apiError  (InternalServerError 500)    {Object} InternalServerError.

        """

        try:
            payload = json.loads(request.body.decode('UTF-8'))

            # tries to get the value if none provided returns an emtpy string
            password = payload.get('password', '')
            username = payload.get('username', '')

            user = authenticate(username=username.lower(), password=password)

            if not user:
                return JsonResponse401('email or password is incorrect').json_response()

            token = self.create_token(user)

            return JsonResponse({
                'token': token
            })

        except Exception as e:
            print(e)
            return JsonResponse500().json_response()

    def create_token(self, user: User):
        """
        token payload will contain the user's id and email and will have an expiration time of 30 days from the date
        of creation
        :param user: the existing user in the database
        :return: token represents the encoded jwt token in ascii format
        """
        token_payload = {
            'id': user.id,
            'email': user.email,
            'iat': datetime.datetime.now().astimezone(),
            'exp': datetime.datetime.now().astimezone() + datetime.timedelta(days=30)
        }
        token = jwt.encode(token_payload, settings.SECRET_KEY).decode('ascii')
        return token


class VerifyTokenView(View):

    def post(self, request):
        """

        @api {POST} api/v1/token/verify Token Verification
        @apiVersion 1.0.0

        @apiName VerifyToken
        @apiGroup Authentication

        @apiDescription  The endpoint is responsible for verification of the token provided by the user.

        @apiParam   {String}    token   User's token.

        @apiSuccess {String}    token   User's jwt token.

        @apiSuccessExample {json} Success-Response:
        HTTP/1.1 200 OK
        {}

       @apiError (Unauthorized 401 ) {Object} InvalidToken
       @apiError (Unauthorized 401 ) {Object} ExpiredToken
       @apiError (InternalServerError 500) {Object} InternalServerError

        """

        try:

            # tries to get the value if none provided returns an emtpy string
            token = json.loads(request.body.decode('UTF-8')).get('token', '')

            token_payload = jwt.decode(token, settings.SECRET_KEY, verify=True)
            user_id = token_payload["id"]

            user = User.objects.get(pk=user_id)

            if not user:
                return JsonResponse401('Please provide a valid token').json_response()

            return JsonResponse({}, status=200)

        except jwt.ExpiredSignatureError:
            return JsonResponse401('ExpiredToken').json_response()

        except Exception as e:
            print(e)
            return JsonResponse500().json_response()
