import json
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from communication import contact_support_email
from errors import JsonResponse500


class UserContactView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(UserContactView, self).dispatch(request, *args, **kwargs)

    def post(self, request):
        # todo documentation
        """

        @api {POST} api/v1/user/contact User communication
        @apiVersion 1.0.0

        @apiName    UserCommunication
        @apiGroup   User

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
