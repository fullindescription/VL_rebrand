from django.urls import path
from .views import get_film_by_name, get_films_for_day, add_or_update_cart_item, get_cart, remove_cart_item

urlpatterns = [
    path('getfilmbyname/', get_film_by_name, name='get_film_by_name'),
   path('getfilmsforday/', get_films_for_day, name='get_films_for_day'),
    path('add_or_update_cartitem/', add_or_update_cart_item, name='add_or_update_cart_item'),
    path('cart/', get_cart, name='get-cart'),
    path('cart/item_remove/<int:item_id>/', remove_cart_item, name='remove-cart-item'),
]
