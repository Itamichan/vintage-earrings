import json
import os
import jwt
from django.conf import settings
from user.models import User

from errors import JsonResponse400, JsonResponse500, JsonResponse401


# Creates a decorator which we will use on all endpoints which should be accessed only if the user is logged in.


def validate_token(f):
    def _wrapper(*args, **kwargs):

        try:
            auth = json.loads(args[1].headers.decode('UTF-8')).get('Authorization')
            auth_token = auth.split()[1]
            auth_token_decoded = jwt.decode(auth_token, settings.SECRET_KEY, verify=True)
            user_id = auth_token_decoded['id']

            user = User.objects.get(pk=user_id)

            setattr(args[1], 'user', user)

            return f(*args, **kwargs)

        except Exception as e:
            print(e)
            return JsonResponse401('InvalidToken').json_response()

    return _wrapper
