
from django.contrib import admin
from .models import Movie, MovieCategory, MovieSession, Event, EventCategory, CartItem, Ticket



admin.site.register(Movie)
admin.site.register(MovieCategory)
admin.site.register(MovieSession)
admin.site.register(Event)
admin.site.register(EventCategory)
admin.site.register(CartItem)
admin.site.register(Ticket)