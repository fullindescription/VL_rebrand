from .models import Event, Movie, MovieSession
from django.core.exceptions import ObjectDoesNotExist

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

class MovieSessionRepository:
    @staticmethod
    def get_sessions_for_movie(movie_id):
        return MovieSession.objects.filter(movie_id=movie_id)

    @staticmethod
    def get_sessions_for_day(date, time=None):
        if time:
            return MovieSession.objects.filter(date=date, time__gt=time)
        return MovieSession.objects.filter(date=date)
