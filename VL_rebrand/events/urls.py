from django.urls import path
from .views import get_film_by_name, get_films_for_day

urlpatterns = [
    path('getfilmbyname/', get_film_by_name, name='get_film_by_name'),
   path('getfilmsforday/', get_films_for_day, name='get_films_for_day'),
]
