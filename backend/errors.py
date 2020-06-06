from django.http import JsonResponse


class JsonResponseError(Exception):

    def __init__(self, status, error, description):
        Exception.__init__(self, description)
        self.status = status
        self.error = error
        self.description = description

    def json_response(self):
        response = {'error': self.error, 'description': self.description}

        return JsonResponse(response, status=self.status)

class JsonResponse500(JsonResponseError):

    def __init__(self, error_text=None):
        if not error_text:
            error_text = "Something went wrong processing this request."
        JsonResponseError.__init__(self, 500, "InternalServerError", error_text)


class JsonResponse400(JsonResponseError):

    def __init__(self, error, description):
        JsonResponseError.__init__(self, 400, error, description)


class JsonResponse403(JsonResponseError):

    def __init__(self, permission_text):
        JsonResponseError.__init__(self, 403, "PermissionDenied", str(permission_text))


class JsonResponse401(JsonResponseError):

    def __init__(self, unauthorized_text):
        JsonResponseError.__init__(self, 401, "Unauthorized", str(unauthorized_text))


class JsonResponse412(JsonResponseError):

    def __init__(self, error, description):
        JsonResponseError.__init__(self, 412, error, description)


class JsonResponse404(JsonResponseError):

    def __init__(self, error, description):
        JsonResponseError.__init__(self, 404, error, description)




