from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Movie, MovieSession
from .serializers import MovieSerializer, MovieSessionSerializer
from datetime import datetime


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

    if not date:
        return Response({"error": "Please provide a date in the format YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
    except ValueError:
        return Response({"error": "Invalid date format. Please use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

    sessions = MovieSession.objects.filter(date=date_obj)

    if not sessions.exists():
        return Response({"message": "No sessions found for this date."}, status=status.HTTP_404_NOT_FOUND)

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