from .repositories import EventRepository, MovieRepository, MovieSessionRepository
from django.core.cache import cache
from datetime import datetime, timedelta
from .serializers import MovieSerializer, MovieSessionSerializer, EventSerializer
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Order, Ticket
from .serializers import CartItemSerializer, OrderSerializer, TicketSerializer


class MovieService:
    @staticmethod
    def get_film_by_name(title):
        cache_key = f"film_by_name_{title}"

        cached_response = cache.get(cache_key)
        if cached_response:
            return {"message": "Data retrieved from cache.", "data": cached_response}

        movie = MovieRepository.get_movie_by_title(title)
        if not movie:
            raise ValueError("Movie not found")

        sessions = MovieSessionRepository.get_sessions_for_movie(movie.id)

        movie_serializer = MovieSerializer(movie)
        session_serializer = MovieSessionSerializer(sessions, many=True)

        response_data = {
            "movie": movie_serializer.data,
            "sessions": session_serializer.data
        }

        cache.set(cache_key, response_data, 60 * 15)
        return response_data

    @staticmethod
    def get_films_for_day(date, time=None):
        cache_key = f"films_for_day_{date}"
        if time:
            cache_key += f"_{time}"

        cached_response = cache.get(cache_key)
        if cached_response:
            return {"message": "Data retrieved from cache.", "data": cached_response}

        try:
            date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        except ValueError:
            raise ValueError("Invalid date format. Please use YYYY-MM-DD.")

        sessions = MovieSessionRepository.get_sessions_for_day(date_obj, time)

        movie_ids = sessions.values_list('movie_id', flat=True).distinct()
        movies = MovieRepository.get_movies_by_ids(movie_ids)

        response_data = []
        for movie in movies:
            movie_sessions = sessions.filter(movie=movie)
            movie_serializer = MovieSerializer(movie)
            session_serializer = MovieSessionSerializer(movie_sessions, many=True)
            response_data.append({
                "movie": movie_serializer.data,
                "sessions": session_serializer.data
            })

        cache.set(cache_key, response_data, 60 * 15)
        return response_data


class EventService:
    @staticmethod
    def get_event_by_name(name):
        cache_key = f"event_by_name_{name}"

        cached_response = cache.get(cache_key)
        if cached_response:
            return {"message": "Data retrieved from cache.", "data": cached_response}

        event = EventRepository.get_event_by_name(name)
        if not event:
            raise ValueError("Event not found")

        event_serializer = EventSerializer(event)
        response_data = {"event": event_serializer.data}

        cache.set(cache_key, response_data, 60 * 15)
        return response_data

    @staticmethod
    def get_events_for_day(date):
        cache_key = f"events_for_day_{date}"

        cached_response = cache.get(cache_key)
        if cached_response:
            return {"message": "Data retrieved from cache.", "data": cached_response}

        try:
            date_obj = datetime.strptime(date, '%Y-%m-%d')
        except ValueError:
            raise ValueError("Invalid date format. Please use YYYY-MM-DD.")

        start_of_day = date_obj
        end_of_day = date_obj + timedelta(days=1)

        events = EventRepository.get_events_for_day(start_of_day, end_of_day)

        if not events.exists():
            return {"message": "No events found for this date."}

        event_serializer = EventSerializer(events, many=True)

        cache.set(cache_key, event_serializer.data, 60 * 15)
        return event_serializer.data


class CartService:
    @staticmethod
    def add_or_update_cart_item(user, data):
        cart, _ = Cart.objects.get_or_create(user=user)
        data['cart'] = cart.id

        # Используем сериализатор для валидации и сохранения данных
        serializer = CartItemSerializer(data=data, context={'cart': cart})
        if serializer.is_valid():
            cart_item = serializer.save()
            return {"message": "Item added/updated in cart", "data": CartItemSerializer(cart_item).data}
        return {"error": serializer.errors}

    @staticmethod
    def get_cart(user):
        cart = Cart.objects.filter(user=user).first()
        if not cart:
            return {"message": "Cart is empty."}

        cart_items = CartItem.objects.filter(cart=cart)
        return CartItemSerializer(cart_items, many=True).data

    @staticmethod
    def remove_cart_item(user, item_id):
        cart = Cart.objects.filter(user=user).first()
        if not cart:
            raise Exception("Cart not found.")

        cart_item = get_object_or_404(CartItem, cart=cart, id=item_id)
        cart_item.delete()
        return {"message": "Item removed from cart."}


class OrderService:
    @staticmethod
    def create_order(user, cart):
        # Создаем заказ на основе корзины
        order = Order.objects.create(user=user, cart=cart, status="pending")
        return {"message": "Order created", "order": OrderSerializer(order).data}

    @staticmethod
    def get_order_by_user(user):
        orders = Order.objects.filter(user=user)
        return OrderSerializer(orders, many=True).data


class TicketService:
    @staticmethod
    def create_ticket(order, event=None, movie_session=None):
        ticket_number = f"TICKET-{datetime.now().timestamp()}"
        ticket = Ticket.objects.create(
            order=order,
            event=event,
            movie_session=movie_session,
            ticket_number=ticket_number
        )
        return {"message": "Ticket created", "ticket": TicketSerializer(ticket).data}
