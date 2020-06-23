import requests
from django.conf import settings
from django.http import HttpResponse

def frontend(request):
    content = requests.get(settings.VINTAGE_EARRINGS_INDEX_URL, verify=False)
    html = content.text.replace('<!DOCTYPE doctype html>', '<!DOCTYPE html>')

    response = HttpResponse(html)
    response['Cache-Control'] = "no-cache"
    return response
