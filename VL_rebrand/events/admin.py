
from django.contrib import admin
from .models import Event, Cart, CartItem, Order, Ticket

admin.site.register(Event)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(Ticket)
