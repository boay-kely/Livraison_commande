from django.contrib.auth import get_user_model
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Order, Product
from .permissions import IsAdminDispatch, IsAdminOrLivreur, IsClient
from .serializers import (
    CustomTokenObtainPairSerializer,
    OrderCreateSerializer,
    OrderSerializer,
    OrderStatusUpdateSerializer,
    ProductSerializer,
    RegisterSerializer,
    UserSerializer,
)

User = get_user_model()


class LoginView(TokenObtainPairView):
    """POST /api/auth/login/ — username + password → access, refresh, user."""

    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [IsAuthenticated()]
        return [IsAdminDispatch()]


class OrderViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        qs = Order.objects.select_related('client', 'livreur').prefetch_related(
            'items__product'
        )
        if user.role == User.Role.ADMIN_DISPATCH:
            return qs.all()
        if user.role == User.Role.LIVREUR:
            return qs.filter(livreur=user)
        return qs.filter(client=user)

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsClient()]
        if self.action == 'update_status':
            return [IsAdminOrLivreur()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='update-status')
    def update_status(self, request, pk=None):
        order = self.get_object()
        serializer = OrderStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = request.user

        if user.role == User.Role.LIVREUR:
            if order.livreur_id != user.id:
                return Response(
                    {'detail': 'Cette commande ne vous est pas assignée.'},
                    status=status.HTTP_403_FORBIDDEN,
                )
            if 'livreur_id' in data:
                return Response(
                    {'detail': 'Un livreur ne peut pas réassigner une commande.'},
                    status=status.HTTP_403_FORBIDDEN,
                )
            allowed = {
                Order.Status.PREPARING,
                Order.Status.IN_DELIVERY,
                Order.Status.DELIVERED,
            }
            if 'statut' in data and data['statut'] not in allowed:
                return Response(
                    {'detail': 'Statut non autorisé pour un livreur.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if 'statut' in data:
            order.statut = data['statut']

        if 'livreur_id' in data and user.role == User.Role.ADMIN_DISPATCH:
            livreur_id = data['livreur_id']
            if livreur_id is None:
                order.livreur = None
            else:
                order.livreur = User.objects.get(pk=livreur_id)
                if order.statut == Order.Status.PENDING:
                    order.statut = Order.Status.PREPARING

        order.save()
        return Response(OrderSerializer(order).data)


@api_view(['GET'])
@permission_classes([IsAdminDispatch])
def list_livreurs(request):
    livreurs = User.objects.filter(role=User.Role.LIVREUR).order_by('username')
    return Response(UserSerializer(livreurs, many=True).data)
