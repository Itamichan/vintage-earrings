import datetime
import json

import jwt
from django.conf import settings
from django.test import TestCase
from django.urls import reverse

from django.contrib.auth.models import User


class RegistrationTest(TestCase):
    def test_valid_registration_data(self):
        """
        tests that on the correct provided data a 200 response is returned.
        """
        response = self.client.post(
            path='/api/v1/registration',
            data=json.dumps({
                "password": "private2487",
                "email": "cristinagarbuz@gmail.com",
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(email="cristinagarbuz@gmail.com").exists())

    def test_user_creation_existing_username(self):
        """
        tests that an error is raised if the username already exists in the database.
        """
        User.objects.create_user('cristinagarbuz@gmail.com', 'cristinagarbuz@gmail.com', 'private2487')

        response = self.client.post(
            path='/api/v1/registration',
            data=json.dumps({
                "password": "private5656",
                "email": "cristinagarbuz@gmail.com",
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 400)

    def test_numeric_password(self):
        """
        tests that an error is raised if a numeric password is provided
        """
        response = self.client.post(
            path='/api/v1/registration',
            data=json.dumps({
                "password": '148943486111',
                "email": "cristinagarbuz@gmail.com",
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 400)

    def test_common_password(self):
        """
        tests that an error is raised if a common password is provided
        """
        response = self.client.post(
            path='/api/v1/registration',
            data=json.dumps({
                "password": 'testtest',
                "email": "cristinagarbuz@gmail.com",
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 400)

    def test_short_password(self):
        """
        tests that an error is raised if a short password is provided
        """
        response = self.client.post(
            path='/api/v1/registration',
            data=json.dumps({
                "password": 'table',
                "email": "cristinagarbuz@gmail.com",
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 400)

    def test_password_validation(self):
        """
        tests that the provided password is valid.
        """
        response = self.client.post(
            path='/api/v1/registration',
            data=json.dumps({
                "password": 'sheepsy9465456',
                "email": "cristinagarbuz@gmail.com",
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 200)

    def test_email_validation(self):
        """
        tests that a valid email is passed in.
        """
        response = self.client.post(
            path='/api/v1/registration',
            data=json.dumps({
                "password": '111fdgfg1',
                "email": "1@gm.com",
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 200)

    def test_invalid_email(self):
        """
        tests that an error is raised if the provided email is not valid.
        """
        response = self.client.post(
            path='/api/v1/registration',
            data=json.dumps({
                "password": '111fdgfg1',
                "email": "myEmail",
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 400)


class LoginTest(TestCase):
    def test_token_creation(self):
        """
        tests that on user login a 200 status code is returned. As well checks that the response contains a token
        and that the user id from the token corresponds with the existing user id in the database.
        """
        user = User.objects.create_user(username='cristinagarbuz@gmail.com', email='cristinagarbuz@gmail.com',
                                        password="private2487")

        response = self.client.post(
            path='/api/v1/login',
            data=json.dumps({
                "password": "private2487",
                "username": "cristinagarbuz@gmail.com",
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 200)

        # we use .json() to get the json payload from the response
        self.assertIn('token', response.json())

        token = response.json()['token']

        jwt_payload = jwt.decode(token, settings.SECRET_KEY, verify=True)
        user_id_from_token = jwt_payload["id"]
        user_email_from_token = jwt_payload["email"]

        self.assertEqual(user_id_from_token, user.id)
        self.assertEqual(user_email_from_token, 'cristinagarbuz@gmail.com')

    def test_invalid_credentials_on_login(self):
        """
        tests that an error is raised if the user provided incorrect password or email.
        """
        User.objects.create_user(username='cristinagarbuz@gmail.com', email='cristinagarbuz@gmail.com',
                                 password="private2487")

        response = self.client.post(
            path='/api/v1/login',
            data=json.dumps({
                "password": "privat2487",
                "username": "cristinagarbuz@gmail.com",
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 401)

        response = self.client.post(
            path='/api/v1/login',
            data=json.dumps({
                "password": "private2487",
                "username": "cristinagarb@gmail.com",
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 401)


class TokenVerificationTest(TestCase):
    def test_verify_token(self):
        """
        tests that the provided token is valid.
        """

        User.objects.create_user(username='cristinagarbuz@gmail.com', email='cristinagarbuz@gmail.com',
                                 password="private2487")

        login_response = self.client.post(
            path='/api/v1/login',
            data=json.dumps({
                "password": "private2487",
                "username": "cristinagarbuz@gmail.com",
            }),
            content_type="application/json")

        token = login_response.json()['token']

        verify_response = self.client.post(
            path='/api/v1/token/verify',
            data=json.dumps({
                "token": token,
            }),
            content_type="application/json")

        self.assertEqual(verify_response.status_code, 200)

    def test_expired_token(self):
        """
        tests that an error is raised if the token is expired.
        """

        user = User.objects.create_user(
            username='cristinagarbuz@gmail.com',
            email='cristinagarbuz@gmail.com',
            password="private2487")

        token_payload = {
            'id': user.id,
            'email': user.email,
            'iat': datetime.datetime.now().astimezone(),
            'exp': datetime.datetime.now().astimezone() - datetime.timedelta(days=1)
        }

        token = jwt.encode(token_payload, settings.SECRET_KEY).decode('ascii')

        response = self.client.post(
            path='/api/v1/token/verify',
            data=json.dumps({
                "token": token,
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 401)
        self.assertDictEqual(response.json(), {'description': 'ExpiredToken', 'error': 'Unauthorized'})


class ValidateTokenTest(TestCase):
    def test_validate_token(self):
        """
        tests that the endpoint returns a 200 code when a valid token is passed to the decorator.
        """

        User.objects.create_user(
            username='cristinagarbuz@gmail.com',
            email='cristinagarbuz@gmail.com',
            password="private2487")

        login_response = self.client.post(
            path='/api/v1/login',
            data=json.dumps({
                "password": "private2487",
                "username": "cristinagarbuz@gmail.com",
            }),
            content_type="application/json")

        token = login_response.json()['token']

        response = self.client.get(
            path=reverse('user:account'),
            HTTP_AUTHORIZATION=f"JWT {token}")

        self.assertEqual(response.status_code, 200)
