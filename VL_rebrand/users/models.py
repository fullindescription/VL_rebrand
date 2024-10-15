from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)

    # Добавьте related_name для полей groups и user_permissions
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # Уникальное имя обратной связи
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions_set',  # Уникальное имя обратной связи
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )
