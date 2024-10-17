from django.shortcuts import get_object_or_404
from .models import Movie, MovieSession
from .serializers import MovieSerializer, MovieSessionSerializer
from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, CartItem
from .serializers import CartItemSerializer

@api_view(['GET'])
def get_film_by_name(request):
    title = request.GET.get('title', None)

    if not title:
        return Response({"error": "Please provide a movie title"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        movie = Movie.objects.get(title__iexact=title)
    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)

    movie_serializer = MovieSerializer(movie)

    movie_id = movie.id

    sessions = MovieSession.objects.filter(movie_id=movie_id)

    session_serializer = MovieSessionSerializer(sessions, many=True)

    return Response({
        "movie": movie_serializer.data,
        "sessions": session_serializer.data
    }, status=status.HTTP_200_OK)


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

    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_or_update_cart_item(request):
    try:
        user = request.user
        cart, _ = Cart.objects.get_or_create(user=user)

        # Создаем изменяемую копию request.data
        data = request.data.copy()
        # Добавляем cart в данные запроса
        data['cart'] = cart.id

        # Передаем измененные данные в сериализатор
        serializer = CartItemSerializer(data=data, context={'cart': cart})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    try:
        user = request.user
        cart = Cart.objects.filter(user=user).first()

        if not cart:
            return Response({"message": "Cart is empty."}, status=status.HTTP_200_OK)

        # Получаем все элементы корзины для текущего пользователя
        cart_items = CartItem.objects.filter(cart=cart)
        serializer = CartItemSerializer(cart_items, many=True)

        return Response({"cart_items": serializer.data}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, item_id):
    try:
        user = request.user
        cart = Cart.objects.filter(user=user).first()

        if not cart:
            return Response({"error": "Cart not found."}, status=status.HTTP_404_NOT_FOUND)

        # Проверяем, что элемент корзины принадлежит этому пользователю
        cart_item = get_object_or_404(CartItem, cart=cart, id=item_id)
        cart_item.delete()

        return Response({"message": "Item removed from cart."}, status=status.HTTP_204_NO_CONTENT)

    except Exception as e:
        return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)