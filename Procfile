web: gunicorn -w 2 --pythonpath backend vintage_earrings.wsgi

consumer: cd backend && python manage.py consume_order