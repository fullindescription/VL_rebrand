from .models import Event, Movie, MovieSession, Cart, CartItem, Order, Ticket, EventSession
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime

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
    def get_event_by_name(title):
        try:
            return Event.objects.get(title__iexact=title)
        except ObjectDoesNotExist:
            return None

    @staticmethod
    def get_event_by_ids(event_ids):
        return Event.objects.filter(id__in=event_ids)

class EventSessionRepository:
    @staticmethod
    def get_sessions_for_event(event_id):
        return EventSession.objects.filter(event_id=event_id)

    @staticmethod
    def get_sessions_for_day(date, time=None):
        today = datetime.now().date()

        if date == today:
            current_time = datetime.now().time()
            if time:
                return EventSession.objects.filter(date=date, time__gt=max(time, current_time))
            return EventSession.objects.filter(date=date, time__gt=current_time)
        else:
            if time:
                return EventSession.objects.filter(date=date)


class MovieRepository:
    @staticmethod
    def get_movie_by_name(title):
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
        today = datetime.now().date()

        # Преобразуем строку времени в объект time, если передан параметр time
        if time:
            try:
                time = datetime.strptime(time, '%H:%M').time()
            except ValueError:
                raise ValueError("Invalid time format. Please use HH:MM.")

        # Проверяем, является ли дата сегодняшней
        if date == today:
            current_time = datetime.now().time()  # Текущее время

            # Если передан параметр time, фильтруем по максимальному из переданного и текущего времени
            if time:
                return MovieSession.objects.filter(date=date, time__gt=max(time, current_time))

            # Если параметр time не передан, фильтруем по текущему времени
            return MovieSession.objects.filter(date=date, time__gt=current_time)

        else:
            # Для будущих дней игнорируем параметр времени и выводим все сеансы
            return MovieSession.objects.filter(date=date)

class MoviePremierSessionRepository:
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
