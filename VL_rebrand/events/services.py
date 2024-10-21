from .repositories import EventRepository, MovieRepository, MovieSessionRepository, CartRepository,\
    CartItemRepository, OrderRepository, TicketRepository
from .serializers import MovieSerializer, MovieSessionSerializer, EventSerializer, CartItemSerializer, \
    OrderSerializer, TicketSerializer
from .models import Cart, CartItem, Order, Ticket, MovieSession, Event
from django.core.cache import cache
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta

class OrderService:
    @staticmethod
    def create_order(user, cart):
        order = OrderRepository.create_order(user=user, cart=cart)
        return {"message": "Order created", "order": OrderSerializer(order).data}

    @staticmethod
    def get_order_by_user(user):
        orders = OrderRepository.get_orders_by_user(user)
        return OrderSerializer(orders, many=True).data


class TicketService:
    @staticmethod
    def create_ticket(order, event=None, movie_session=None):
        ticket_number = f"TICKET-{datetime.now().timestamp()}"
        ticket = TicketRepository.create_ticket(
            order=order,
            event=event,
            movie_session=movie_session,
            ticket_number=ticket_number
        )
        return {"message": "Ticket created", "ticket": TicketSerializer(ticket).data}

class MovieService:
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

        if time:
            time_obj = datetime.strptime(time, '%H:%M').time()
            datetime_obj = datetime.combine(date_obj, time_obj)
        else:
            datetime_obj = datetime(date_obj.year, date_obj.month, date_obj.day)

        timestamp = datetime_obj.timestamp()

        sessions = MovieSessionRepository.get_sessions_for_day(timestamp)

        movie_ids = list({session['movie_id'] if isinstance(session, dict) else session.movie_id for session in sessions})

        movies = MovieRepository.get_movies_by_ids(movie_ids)

        response_data = []
        for movie in movies:
            if isinstance(sessions[0], dict):
                movie_sessions = [session for session in sessions if session['movie_id'] == movie.id]
            else:
                movie_sessions = sessions.filter(movie=movie)

            movie_sessions_data = []
            for session in movie_sessions:
                if isinstance(session, dict):
                    session_data = session
                else:
                    session_data = MovieSessionSerializer(session).data
                # Убедимся, что поле 'date' присутствует, добавим его, если нет
                if 'date' not in session_data:
                    session_data['date'] = getattr(session, 'date', None)
                movie_sessions_data.append(session_data)

            movie_serializer = MovieSerializer(movie)
            response_data.append({
                "movie": movie_serializer.data,
                "sessions": movie_sessions_data
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
        data = data.copy()

        cart = CartRepository.get_cart_by_user(user)
        if not cart:
            cart = CartRepository.create_cart_for_user(user)

        data['cart'] = cart.id
        event_id = data.get('event_id')
        movie_session_id = data.get('movie_session_id')

        cart_item = None
        if event_id:
            event = get_object_or_404(Event, id=event_id)
            cart_item = CartItemRepository.get_cart_item(cart, event=event)
        elif movie_session_id:
            movie_session = get_object_or_404(MovieSession, id=movie_session_id)
            cart_item = CartItemRepository.get_cart_item(cart, movie_session=movie_session)

        if cart_item:
            cart_item.quantity = data.get('quantity', cart_item.quantity)
            cart_item.save()
        else:
            CartItemRepository.create_cart_item(
                cart,
                event=event if event_id else None,
                movie_session=movie_session if movie_session_id else None,
                quantity=data.get('quantity', 1)
            )

        return {"message": "Item added/updated in cart"}

class OrderService:
    @staticmethod
    def create_order(user, cart):
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
        return {"message": "Ticket  created", "ticket": TicketSerializer(ticket).data}