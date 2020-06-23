import os

from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from vintage_earrings.settings import SENDGRID_API_KEY


def _send_email(message):
    try:
        if not SENDGRID_API_KEY:
            raise EnvironmentError("SENDGRID_API_KEY is not defined")

        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)

        if response.status_code != 202:
            print(response.status_code)
            print(response.body)
        print('email is sent')
    except Exception as e:
        print('sendgrid_error:', e)


def contact_support_email(from_email, text, name):
    message = Mail(
        from_email='contact@japanwanderlust.com',
        to_emails='cristinagarbuz@gmail.com',
        subject='User contact form',
        html_content=f' "{text}" from {name}',
    )
    message.reply_to = from_email

    _send_email(message)
