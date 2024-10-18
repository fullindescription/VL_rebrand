from django.shortcuts import get_object_or_404
from .models import Movie, MovieSession, Event, Cart, CartItem, Order, Ticket
from datetime import datetime, timedelta
from django.core.cache import cache
from .serializers import MovieSerializer, MovieSessionSerializer, EventSerializer, CartItemSerializer, OrderSerializer, TicketSerializer

class MovieService:
    @staticmethod
    def get_film_by_name(title):
        cache_key = f"film_by_name_{title}"

        cached_response = cache.get(cache_key)
        if cached_response:
            return {"message": "Data retrieved from cache.", "data": cached_response}

        # Получаем фильм и его сеансы
        movie = get_object_or_404(Movie, title__iexact=title)
        sessions = MovieSession.objects.filter(movie_id=movie.id)

        # Сериализуем данные
        movie_serializer = MovieSerializer(movie)
        session_serializer = MovieSessionSerializer(sessions, many=True)

        response_data = {
            "movie": movie_serializer.data,
            "sessions": session_serializer.data
        }

        # Кэшируем данные
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

        # Преобразуем строку даты
        try:
            date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        except ValueError:
            raise ValueError("Invalid date format. Please use YYYY-MM-DD.")

        # Фильтрация сеансов по дате и времени
        if time:
            try:
                time_obj = datetime.strptime(time, '%H:%M').time()
            except ValueError:
                raise ValueError("Invalid time format. Please use HH:MM.")
            sessions = MovieSession.objects.filter(date=date_obj, time__gt=time_obj)
        else:
            sessions = MovieSession.objects.filter(date=date_obj)

        # Сериализуем фильмы и сеансы
        movie_ids = sessions.values_list('movie_id', flat=True).distinct()
        movies = Movie.objects.filter(id__in=movie_ids)

        response_data = []
        for movie in movies:
            movie_sessions = sessions.filter(movie=movie)
            movie_serializer = MovieSerializer(movie)
            session_serializer = MovieSessionSerializer(movie_sessions, many=True)
            response_data.append({
                "movie": movie_serializer.data,
                "sessions": session_serializer.data
            })

        # Кэшируем результат
        cache.set(cache_key, response_data, 60 * 15)
        return response_data


class EventService:
    @staticmethod
    def get_event_by_name(name):
        cache_key = f"event_by_name_{name}"

        cached_response = cache.get(cache_key)
        if cached_response:
            return {"message": "Data retrieved from cache.", "data": cached_response}

        event = get_object_or_404(Event, name__iexact=name)

        # Сериализуем данные
        event_serializer = EventSerializer(event)

        # Кэшируем результат
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

        # Получаем события в пределах одного дня
        start_of_day = date_obj
        end_of_day = date_obj + timedelta(days=1)

        events = Event.objects.filter(date__gte=start_of_day, date__lt=end_of_day)

        if not events.exists():
            return {"message": "No events found for this date."}

        # Сериализуем данные
        event_serializer = EventSerializer(events, many=True)

        response_data = event_serializer.data

        # Кэшируем результат
        cache.set(cache_key, response_data, 60 * 15)
        return response_data


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
