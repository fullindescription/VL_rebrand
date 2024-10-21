from .services import MovieService, EventService, CartService
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

@api_view(['GET'])
def get_film_by_name(request):
    title = request.GET.get('title', None)
    if not title:
        return Response({"error": "Please provide a movie title"}, status=status.HTTP_400_BAD_REQUEST)

    response_data = MovieService.get_film_by_name(title)
    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_films_for_day(request):
    date = request.GET.get('date', None)
    time = request.GET.get('time', None)
    if not date:
        return Response({"error": "Please provide a date in the format YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

    response_data = MovieService.get_films_for_day(date, time)
    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_event_by_name(request):
    title = request.GET.get('title', None)
    if not title:
        return Response({"error": "Please provide an event name"}, status=status.HTTP_400_BAD_REQUEST)

    response_data = EventService.get_event_by_name(title)
    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_events_for_day(request):
    date = request.GET.get('date', None)
    time = request.GET.get('time', None)
    if not date:
        return Response({"error": "Please provide a date in the format YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

    response_data = EventService.get_events_for_day(date, time)
    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_or_update_cart_item(request):
    response_data = CartService.add_or_update_cart_item(request.user, request.data)
    if isinstance(response_data, dict) and "error" in response_data:
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
    return Response(response_data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart_items = CartService.get_cart(request.user)
    return Response(cart_items, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, item_id):
    response_data = CartService.remove_cart_item(request.user, item_id)
    return Response(response_data, status=status.HTTP_204_NO_CONTENT)
