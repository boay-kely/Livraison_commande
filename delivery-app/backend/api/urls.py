from django.urls import include, path
from rest_framework.permissions import AllowAny
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginView, MeView, OrderViewSet, ProductViewSet, RegisterView, list_livreurs

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path(
        'auth/refresh/',
        TokenRefreshView.as_view(permission_classes=[AllowAny], authentication_classes=[]),
        name='token_refresh',
    ),
    path('auth/me/', MeView.as_view(), name='me'),
    path('livreurs/', list_livreurs, name='livreurs'),
    path('', include(router.urls)),
]
