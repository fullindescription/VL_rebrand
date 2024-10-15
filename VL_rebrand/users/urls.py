from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Эндпоинт для получения токенов (вход в систему)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Эндпоинт для обновления токенов (используется refresh токен)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
