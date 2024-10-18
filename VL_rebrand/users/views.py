from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from rest_framework import status
from .serializers import UserDetailSerializer
from .services import get_user_detail, register_user

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_detail(request):
    user = get_user_detail(request.user)
    serializer = UserDetailSerializer(user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def user_registration(request):
    serializer = UserDetailSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = register_user(serializer.validated_data, request.data['password'])
            return Response(
                {"message": "User registered successfully", "user": UserDetailSerializer(user).data},
                status=status.HTTP_201_CREATED
            )
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
