import os

import requests
from django.conf import settings
from django.http import JsonResponse, HttpResponse


def frontend(request):
    # TODO - Cache this call
    index_url = os.environ.get('VINTAGE_EARRINGS_INDEX_URL', '')

    content = requests.get(index_url, verify=False)
    html = content.text.replace('<!DOCTYPE doctype html>', '<!DOCTYPE html>')

    response = HttpResponse(html)
    response['Cache-Control'] = "no-cache"
    return response
