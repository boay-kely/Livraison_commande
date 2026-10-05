from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Order, OrderItem, Product

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role')
        read_only_fields = ('id', 'role')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(
        choices=[User.Role.CLIENT, User.Role.LIVREUR],
        default=User.Role.CLIENT,
        required=False,
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'role')

    def create(self, validated_data):
        role = validated_data.pop('role', User.Role.CLIENT)
        if role == User.Role.ADMIN_DISPATCH:
            role = User.Role.CLIENT
        user = User.objects.create_user(role=role, **validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Login JWT : retourne access, refresh + infos utilisateur."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'role': self.user.role,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        return data


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'price', 'stock', 'created_at')
        read_only_fields = ('id', 'created_at')


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'quantity', 'unit_price', 'line_total')
        read_only_fields = ('id', 'unit_price', 'product_name', 'line_total')

    def get_line_total(self, obj):
        return obj.line_total


class OrderItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    client_username = serializers.CharField(source='client.username', read_only=True)
    livreur_username = serializers.CharField(
        source='livreur.username', read_only=True, allow_null=True
    )

    class Meta:
        model = Order
        fields = (
            'id',
            'client',
            'client_username',
            'livreur',
            'livreur_username',
            'adresse_texte',
            'telephone',
            'montant_total',
            'statut',
            'date_creation',
            'updated_at',
            'items',
        )
        read_only_fields = (
            'id',
            'client',
            'montant_total',
            'statut',
            'date_creation',
            'updated_at',
            'livreur',
        )


class OrderCreateSerializer(serializers.Serializer):
    adresse_texte = serializers.CharField()
    telephone = serializers.CharField(max_length=30)
    items = OrderItemCreateSerializer(many=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError('Au moins un article est requis.')
        return value

    @transaction.atomic
    def create(self, validated_data):
        user = self.context['request'].user
        items_data = validated_data.pop('items')
        total = Decimal('0.00')
        prepared_items = []

        for item in items_data:
            try:
                product = Product.objects.select_for_update().get(pk=item['product_id'])
            except Product.DoesNotExist:
                raise serializers.ValidationError(
                    {'items': f"Produit {item['product_id']} introuvable."}
                )
            qty = item['quantity']
            if product.stock < qty:
                raise serializers.ValidationError(
                    {'items': f'Stock insuffisant pour « {product.name} ».'}
                )
            line = qty * product.price
            total += line
            prepared_items.append((product, qty, product.price))

        order = Order.objects.create(
            client=user,
            adresse_texte=validated_data['adresse_texte'],
            telephone=validated_data['telephone'],
            montant_total=total,
            statut=Order.Status.PENDING,
        )

        for product, qty, unit_price in prepared_items:
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=qty,
                unit_price=unit_price,
            )
            product.stock -= qty
            product.save(update_fields=['stock'])

        return order


class OrderStatusUpdateSerializer(serializers.Serializer):
    statut = serializers.ChoiceField(choices=Order.Status.choices, required=False)
    livreur_id = serializers.IntegerField(required=False, allow_null=True)

    def validate(self, attrs):
        if 'statut' not in attrs and 'livreur_id' not in attrs:
            raise serializers.ValidationError(
                'Fournissez au moins un statut ou un livreur_id.'
            )
        return attrs

    def validate_livreur_id(self, value):
        if value is None:
            return value
        try:
            User.objects.get(pk=value, role=User.Role.LIVREUR)
        except User.DoesNotExist:
            raise serializers.ValidationError('Livreur introuvable.')
        return value
