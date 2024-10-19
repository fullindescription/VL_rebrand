from django.shortcuts import get_object_or_404
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
    timestamp = serializers.SerializerMethodField()

    class Meta:
        model = MovieSession
        fields = ['id', 'movie_id', 'date', 'time', 'price', 'available_tickets', 'timestamp']

    def get_timestamp(self, obj):
        # Преобразуем дату и время в timestamp
        date_time_obj = datetime.combine(obj.date, obj.time)
        return int(date_time_obj.timestamp())


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
    event_id = serializers.IntegerField(write_only=True, required=False)
    movie_session_id = serializers.IntegerField(write_only=True, required=False)

    event = EventSerializer(read_only=True)
    movie_session = MovieSessionSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'event', 'event_id', 'movie_session', 'movie_session_id', 'quantity']

    def validate(self, data):

        event_id = data.get('event_id')
        movie_session_id = data.get('movie_session_id')

        if not event_id and not movie_session_id:
            raise serializers.ValidationError("Either event_id or movie_session_id is required.")
        if event_id and movie_session_id:
            raise serializers.ValidationError("Only one of event_id or movie_session_id should be provided.")

        return data

    def create(self, validated_data):
        event_id = validated_data.pop('event_id', None)
        movie_session_id = validated_data.pop('movie_session_id', None)
        cart = self.context['cart']
        if event_id:
            event = get_object_or_404(Event, id=event_id)
            cart_item, created = CartItem.objects.get_or_create(cart=cart, event=event)
        elif movie_session_id:
            movie_session = get_object_or_404(MovieSession, id=movie_session_id)
            cart_item, created = CartItem.objects.get_or_create(cart=cart, movie_session=movie_session)

        cart_item.quantity = validated_data.get('quantity', 1)
        cart_item.save()

        return cart_item

    def update(self, instance, validated_data):
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.save()
        return instance


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
