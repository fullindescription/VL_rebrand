
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import UserDetailSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Защищаем маршрут
def user_detail(request):
    user = request.user  # Получаем текущего аутентифицированного пользователя
    serializer = UserDetailSerializer(user)  # Сериализуем данные пользователя
    return Response(serializer.data)  # Возвращаем данные пользователя

