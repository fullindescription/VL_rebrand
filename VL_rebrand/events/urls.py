from django.urls import path
from .views import get_film_by_name, get_films_for_day, add_or_update_cart_item, \
    get_cart, remove_cart_item, get_event_by_name, get_events_for_day, get_all_premier_movies

urlpatterns = [
    path('getfilmbyname/', get_film_by_name, name='get_film_by_name'),
    path('getfilmsforday/', get_films_for_day, name='get_films_for_day'),
    path('getpremiers/', get_all_premier_movies, name='get_all_premier_movies'),
    path('geteventbyname/', get_event_by_name, name='get_event_by_name'),
    path('geteventsforday/', get_events_for_day, name='get_events_for_day'),
    path('cart/add_or_update_cartitem/', add_or_update_cart_item, name='add_or_update_cart_item'),
    path('cart/', get_cart, name='get-cart'),
    path('cart/item_remove/<int:item_id>/', remove_cart_item, name='remove-cart-item'),
]
