from django.shortcuts import get_object_or_404
from .models import Movie, MovieSession, Event, Cart, CartItem
from .serializers import MovieSerializer, MovieSessionSerializer, EventSerializer, CartItemSerializer
from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Event
from .serializers import EventSerializer
from datetime import datetime, timedelta
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Movie, MovieSession
from .serializers import MovieSerializer, MovieSessionSerializer

@api_view(['GET'])
def get_film_by_name(request):
    title = request.GET.get('title', None)

    if not title:
        return Response({"error": "Please provide a movie title"}, status=status.HTTP_400_BAD_REQUEST)

    cache_key = f"film_by_name_{title}"

    cached_response = cache.get(cache_key)
    if cached_response:
        cached_response_with_message = {
            "message": "Data retrieved from cache.",
            "data": cached_response
        }
        return Response(cached_response_with_message, status=status.HTTP_200_OK)

    try:
        movie = Movie.objects.get(title__iexact=title)
    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)

    movie_serializer = MovieSerializer(movie)
    sessions = MovieSession.objects.filter(movie_id=movie.id)
    session_serializer = MovieSessionSerializer(sessions, many=True)

    response_data = {
        "movie": movie_serializer.data,
        "sessions": session_serializer.data
    }

    cache.set(cache_key, response_data, 60 * 15)

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_films_for_day(request):
    date = request.GET.get('date', None)
    time = request.GET.get('time', None)

    if not date:
        return Response({"error": "Please provide a date in the format YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
    except ValueError:
        return Response({"error": "Invalid date format. Please use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

    cache_key = f"films_for_day_{date}"
    if time:
        cache_key += f"_{time}"

    cached_response = cache.get(cache_key)
    if cached_response:
        cached_response_with_message = {
            "message": "Data retrieved from cache.",
            "data": cached_response
        }
        return Response(cached_response_with_message, status=status.HTTP_200_OK)

    if time:
        try:
            time_obj = datetime.strptime(time, '%H:%M').time()
        except ValueError:
            return Response({"error": "Invalid time format. Please use HH:MM."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        time_obj = None

    if time_obj:
        sessions = MovieSession.objects.filter(date=date_obj, time__gt=time_obj)
    else:
        sessions = MovieSession.objects.filter(date=date_obj)

    if not sessions.exists():
        return Response({"message": "No sessions found for this date and time."}, status=status.HTTP_404_NOT_FOUND)

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

    cache.set(cache_key, response_data, 60 * 15)

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_or_update_cart_item(request):
    try:
        user = request.user
        cart, _ = Cart.objects.get_or_create(user=user)

        data = request.data.copy()
        data['cart'] = cart.id

        serializer = CartItemSerializer(data=data, context={'cart': cart})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": "An unexpected error occurred: " + str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    try:
        user = request.user
        cart = Cart.objects.filter(user=user).first()

        if not cart:
            return Response({"message": "Cart is empty."}, status=status.HTTP_200_OK)

        cart_items = CartItem.objects.filter(cart=cart)
        serializer = CartItemSerializer(cart_items, many=True)

        return Response({"cart_items": serializer.data}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": "An unexpected error occurred: " + str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, item_id):
    try:
        user = request.user
        cart = Cart.objects.filter(user=user).first()

        if not cart:
            return Response({"error": "Cart not found."}, status=status.HTTP_404_NOT_FOUND)

        cart_item = get_object_or_404(CartItem, cart=cart, id=item_id)
        cart_item.delete()

        return Response({"message": "Item removed from cart."}, status=status.HTTP_204_NO_CONTENT)

    except Exception as e:
        return Response({"error": "An unexpected error occurred: " + str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_event_by_name(request):
    name = request.GET.get('name', None)

    if not name:
        return Response({"error": "Please provide an event name"}, status=status.HTTP_400_BAD_REQUEST)

    cache_key = f"event_by_name_{name}"

    cached_response = cache.get(cache_key)
    if cached_response:
        cached_response_with_message = {
            "message": "Data retrieved from cache.",
            "data": cached_response
        }
        return Response(cached_response_with_message, status=status.HTTP_200_OK)

    try:
        event = Event.objects.get(name__iexact=name)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

    event_serializer = EventSerializer(event)
    response_data = {"event": event_serializer.data}

    cache.set(cache_key, response_data, 60 * 15)

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_events_for_day(request):
    date = request.GET.get('date', None)

    if not date:
        return Response({"error": "Please provide a date in the format YYYY-MM-DD"},
                        status=status.HTTP_400_BAD_REQUEST)

    cache_key = f"events_for_day_{date}"

    cached_response = cache.get(cache_key)
    if cached_response:
        cached_response_with_message = {
            "message": "Data retrieved from cache.",
            "data": cached_response
        }
        return Response(cached_response_with_message, status=status.HTTP_200_OK)

    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d')
    except ValueError:
        return Response({"error": "Invalid date format. Please use YYYY-MM-DD."},
                        status=status.HTTP_400_BAD_REQUEST)

    start_of_day = date_obj
    end_of_day = date_obj + timedelta(days=1)

    events = Event.objects.filter(date__gte=start_of_day, date__lt=end_of_day)

    if not events.exists():
        return Response({"message": "No events found for this date."},
                        status=status.HTTP_404_NOT_FOUND)

    event_serializer = EventSerializer(events, many=True)
    response_data = event_serializer.data

    cache.set(cache_key, response_data, 60 * 15)

    return Response(response_data, status=status.HTTP_200_OK)
