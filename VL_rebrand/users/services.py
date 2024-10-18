from .models import User
from .repositories import UserRepository, CartRepository

from rest_framework.exceptions import ValidationError

def get_user_detail(user):

    return user

def register_user(validated_data, password):
    try:
        user = UserRepository.create_user(validated_data, password)
        CartRepository.create_cart_for_user(user)
        return user
    except Exception as e:
        raise ValidationError({"error": str(e)})
