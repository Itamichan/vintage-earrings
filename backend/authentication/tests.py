import json

import jwt
from django.conf import settings
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.hashers import make_password
from user.models import User


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
        user = User.objects.create_user(username='cristinagarbuz@gmail.com', password="private2487")

        response = self.client.post(
            path='/api/v1/login',
            data=json.dumps({
                "password": "private2487",
                "email": "cristinagarbuz@gmail.com",
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 200)

        # we use .json() to get the json payload from the response
        self.assertIn('token', response.json())

        token = response.json()['token']

        jwt_payload = jwt.decode(token, settings.SECRET_KEY, verify=True)
        user_id_from_token = jwt_payload["id"]

        self.assertEqual(user_id_from_token, user.id)

    def test_invalid_credentials_on_login(self):
        """
        tests that an error is raised if the user provided incorrect password or email.
        """
        user = User.objects.create_user(username='cristinagarbuz@gmail.com', password="private2487")

        response = self.client.post(
            path='/api/v1/login',
            data=json.dumps({
                "password": "privat2487",
                "email": "cristinagarbuz@gmail.com",
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 401)

        response = self.client.post(
            path='/api/v1/login',
            data=json.dumps({
                "password": "private2487",
                "email": "cristinagarb@gmail.com",
            }),
            content_type="application/json")

        self.assertEqual(response.status_code, 401)