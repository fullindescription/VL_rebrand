from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import Movie, MovieCategory, Cart, MovieSession, Event, EventCategory, EventSession

User = get_user_model()

class MovieAPITestCase(APITestCase):

    def setUp(self):
        self.category = MovieCategory.objects.create(name="Action", description="Action movies")
        self.movie = Movie.objects.create(
            title="Test Movie",
            description="Test movie description",
            duration=120,
            category=self.category,
            age_restriction="12+"
        )
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.force_authenticate(user=self.user)

    def test_get_film_by_name(self):
        url = reverse('get_film_by_name')
        response = self.client.get(url, {'title': 'Test Movie'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['movie']['title'], 'Test Movie')

    def test_get_films_for_day(self):
        movie_session = MovieSession.objects.create(
            movie=self.movie,
            date="2024-10-22",
            time="14:30",
            price=100.0,
            available_tickets=50
        )
        url = reverse('get_films_for_day')
        response = self.client.get(url, {'date': '2024-10-22'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['movie']['title'], 'Test Movie')


class EventAPITestCase(APITestCase):

    def setUp(self):
        self.category = EventCategory.objects.create(name="Concert", description="Music events")
        self.event = Event.objects.create(
            title="Test Event",
            description="Test event description",
            duration=180,
            category=self.category,
            age_restriction="16+"
        )
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.force_authenticate(user=self.user)

    def test_get_event_by_name(self):
        url = reverse('get_event_by_name')
        response = self.client.get(url, {'title': 'Test Event'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['event']['title'], 'Test Event')

    def test_get_events_for_day(self):
        event_session = EventSession.objects.create(
            event=self.event,
            date="2024-10-22",
            time="18:00",
            price=150.0,
            available_tickets=100
        )
        url = reverse('get_events_for_day')
        response = self.client.get(url, {'date': '2024-10-22'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['event']['title'], 'Test Event')


class CartAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.force_authenticate(user=self.user)
        self.cart_url = reverse('get-cart')

    def test_add_cart_item(self):
        # Create movie and session
        category = MovieCategory.objects.create(name="Action", description="Action movies")
        movie = Movie.objects.create(title="Test Movie", description="Test description", duration=120, category=category, age_restriction="12+")
        movie_session = MovieSession.objects.create(movie=movie, date="2024-10-22", time="14:30", price=100.0, available_tickets=50)

        url = reverse('add_or_update_cart_item')
        data = {
            'movie_session_id': movie_session.id,
            'quantity': 2
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'Item added/updated in cart')

    def test_get_cart(self):
        response = self.client.get(self.cart_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


