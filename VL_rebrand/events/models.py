from django.db import models
from users.models import User
class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    duration = models.PositiveIntegerField()
    category = models.ForeignKey('MovieCategory', on_delete=models.SET_NULL, null=True, blank=True)
    age_restriction = models.CharField(max_length=5, default="6+")
    image_url = models.TextField(blank=True, null=True)
    video_url = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.title

class MovieCategory(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class MovieSession(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available_tickets = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.movie.title} - {self.date} {self.time}"


class EventCategory(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Event(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    age_restriction = models.CharField(max_length=5, default="6+")
    available_tickets = models.PositiveIntegerField()
    category = models.ForeignKey(EventCategory, on_delete=models.SET_NULL, null=True, blank=True)
    image_url = models.TextField(blank=True, null=True)
    video_url = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

class CartItem(models.Model):
    cart = models.ForeignKey('Cart', on_delete=models.CASCADE)
    event = models.ForeignKey('Event', on_delete=models.CASCADE, null=True, blank=True)
    movie_session = models.ForeignKey(MovieSession, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        if self.event:
            return f"Cart Item for {self.event.name}"
        elif self.movie_session:
            return f"Cart Item for {self.movie_session.movie.title}"
        return "Cart Item"
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cart = models.OneToOneField(Cart, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20)


class Ticket(models.Model):
    event = models.ForeignKey('Event', on_delete=models.CASCADE, null=True, blank=True)
    movie_session = models.ForeignKey(MovieSession, on_delete=models.CASCADE, null=True, blank=True)
    order = models.ForeignKey('Order', on_delete=models.CASCADE)
    ticket_number = models.CharField(max_length=20)
    issue_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.event:
            return f"Ticket for {self.event.name}"
        elif self.movie_session:
            return f"Ticket for {self.movie_session.movie.title}"
        return "Ticket"