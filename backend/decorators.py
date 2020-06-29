import json
import os
import jwt
from django.conf import settings
from django.contrib.auth.models import User

from errors import JsonResponse400, JsonResponse500, JsonResponse401


# Creates a decorator which we will use on all endpoints which should be accessed only if the user is logged in.


def validate_token(f):
    def _wrapper(*args, **kwargs):
        """
        The function gets the HTTP_AUTHORIZATION from the headers and extracts the user id from the provided token.
        It tries to get a user with the extracted user_id and sets it to the request object which is passed to the
        function that is called by this wrapping function.
        """
        try:
            auth_header = args[1].META.get('HTTP_AUTHORIZATION')
            auth_token = auth_header.split()[1]
            auth_token_decoded = jwt.decode(auth_token, settings.SECRET_KEY, verify=True)
            user_id = auth_token_decoded['id']

            user = User.objects.get(pk=user_id)

            setattr(args[1], 'user', user)

            return f(*args, **kwargs)

        except Exception as e:
            print(e)
            return JsonResponse401('InvalidToken').json_response()

    return _wrapper
