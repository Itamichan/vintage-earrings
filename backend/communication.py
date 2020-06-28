import os

from django.conf import settings
from django.template.response import SimpleTemplateResponse
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
    content = load_template('contact_email.html', {'text': text, 'name': name})
    message = Mail(
        from_email='support@vintage-earrings.store',
        to_emails='cristinagarbuz@gmail.com',
        subject='User message',
        html_content=content.decode('UTF-8'),
    )
    message.reply_to = from_email

    _send_email(message)


def load_template(template, parameters):
    template_response = SimpleTemplateResponse(template, parameters)
    template_response.render()
    return template_response.content
