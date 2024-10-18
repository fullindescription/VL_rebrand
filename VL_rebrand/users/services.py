from .models import User
from events.models import Cart
from rest_framework.exceptions import ValidationError

def get_user_detail(user):

    return user

def register_user(validated_data, password):

    try:
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=password
        )
        Cart.objects.create(user=user)
        return user
    except Exception as e:
        raise ValidationError({"error": str(e)})
