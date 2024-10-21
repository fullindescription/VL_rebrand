from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken


class UserAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testpassword",
            first_name="Test",
            last_name="User"
        )
        self.registration_url = reverse('user_registration')
        self.me_url = reverse('user_detail')
        self.login_url = reverse('token_obtain_pair')

    def test_user_registration(self):

        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "first_name": "New",
            "last_name": "User",
            "password": "newpassword"
        }
        response = self.client.post(self.registration_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "User registered successfully")
        self.assertEqual(response.data["user"]["username"], "newuser")
        self.assertEqual(User.objects.filter(username="newuser").count(), 1)

    def test_user_login(self):

        data = {
            "username": "testuser",
            "password": "testpassword"
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_get_user_detail(self):

        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], self.user.username)
        self.assertEqual(response.data["email"], self.user.email)
        self.assertEqual(response.data["first_name"], self.user.first_name)
        self.assertEqual(response.data["last_name"], self.user.last_name)

    def test_get_user_detail_unauthenticated(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
