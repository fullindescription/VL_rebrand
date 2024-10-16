from rest_framework import serializers
from .models import Movie, MovieCategory, MovieSession, Event, EventCategory, Cart, CartItem, Order, Ticket

class MovieCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieCategory
        fields = ['id', 'name', 'description']


class MovieSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = ['id', 'title', 'description', 'duration', 'category_name', 'age_restriction', 'image_url', 'video_url']  # Добавляем category_name в fields

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None


class MovieSessionSerializer(serializers.ModelSerializer):
    movie_id = serializers.IntegerField(source='movie.id', read_only=True)

    class Meta:
        model = MovieSession
        fields = ['id', 'movie_id', 'date', 'time', 'price', 'available_tickets']



class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = ['id', 'name', 'description']


class EventSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'date', 'price', 'age_restriction', 'available_tickets', 'category_name', 'image_url', 'video_url']  # Заменяем category на category_name

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['id', 'user']


class CartItemSerializer(serializers.ModelSerializer):
    event = EventSerializer(required=False, allow_null=True)
    movie_session = MovieSessionSerializer(required=False, allow_null=True)

    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'event', 'movie_session', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    cart = CartSerializer()

    class Meta:
        model = Order
        fields = ['id', 'user', 'cart', 'order_date', 'status']


class TicketSerializer(serializers.ModelSerializer):
    event = EventSerializer(required=False, allow_null=True)
    movie_session = MovieSessionSerializer(required=False, allow_null=True)

    class Meta:
        model = Ticket
        fields = ['id', 'event', 'movie_session', 'order', 'ticket_number', 'issue_date']
