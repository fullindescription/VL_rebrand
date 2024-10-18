from .models import User
from events.models import Cart
from django.core.exceptions import ObjectDoesNotExist

class UserRepository:
    @staticmethod
    def get_user_by_username(username):
        try:
            return User.objects.get(username=username)
        except ObjectDoesNotExist:
            return None

    @staticmethod
    def create_user(validated_data, password):
        try:
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                password=password
            )
            return user
        except Exception as e:
            raise e

class CartRepository:
    @staticmethod
    def create_cart_for_user(user):
        return Cart.objects.create(user=user)
