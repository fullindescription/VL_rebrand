
from .models import Event, Movie, MovieSession, Cart, CartItem
from django.core.exceptions import ObjectDoesNotExist
from .models import Order, Ticket

class OrderRepository:
    @staticmethod
    def create_order(user, cart, status="pending"):
        return Order.objects.create(user=user, cart=cart, status=status)

    @staticmethod
    def get_orders_by_user(user):
        return Order.objects.filter(user=user)


class TicketRepository:
    @staticmethod
    def create_ticket(order, event=None, movie_session=None, ticket_number=None):
        return Ticket.objects.create(
            order=order,
            event=event,
            movie_session=movie_session,
            ticket_number=ticket_number
        )

class EventRepository:
    @staticmethod
    def get_event_by_name(name):
        try:
            return Event.objects.get(name__iexact=name)
        except ObjectDoesNotExist:
            return None

    @staticmethod
    def get_events_for_day(start_date, end_date):
        return Event.objects.filter(date__gte=start_date, date__lt=end_date)


class MovieRepository:
    @staticmethod
    def get_movie_by_title(title):
        try:
            return Movie.objects.get(title__iexact=title)
        except ObjectDoesNotExist:
            return None

    @staticmethod
    def get_movies_by_ids(movie_ids):
        return Movie.objects.filter(id__in=movie_ids)


class MovieSessionRepository:
    @staticmethod
    def get_sessions_for_movie(movie_id):
        return MovieSession.objects.filter(movie_id=movie_id)

    @staticmethod
    def get_sessions_for_day(date, time=None):
        if time:
            return MovieSession.objects.filter(date=date, time__gt=time)
        return MovieSession.objects.filter(date=date)


class CartRepository:
    @staticmethod
    def get_cart_by_user(user):
        return Cart.objects.filter(user=user).first()

    @staticmethod
    def create_cart_for_user(user):
        return Cart.objects.create(user=user)


class CartItemRepository:
    @staticmethod
    def get_cart_item(cart, event=None, movie_session=None):
        if event:
            return CartItem.objects.filter(cart=cart, event=event).first()
        elif movie_session:
            return CartItem.objects.filter(cart=cart, movie_session=movie_session).first()
        return None

    @staticmethod
    def create_cart_item(cart, event=None, movie_session=None, quantity=1):
        return CartItem.objects.create(
            cart=cart,
            event=event,
            movie_session=movie_session,
            quantity=quantity
        )

    @staticmethod
    def delete_cart_item(cart_item):
        cart_item.delete()
