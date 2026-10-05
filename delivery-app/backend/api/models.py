from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        CLIENT = 'CLIENT', 'Client'
        ADMIN_DISPATCH = 'ADMIN_DISPATCH', 'Admin Dispatch'
        LIVREUR = 'LIVREUR', 'Livreur'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CLIENT,
    )

    def __str__(self):
        return f'{self.username} ({self.role})'


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'En attente'
        PREPARING = 'PREPARING', 'En préparation'
        IN_DELIVERY = 'IN_DELIVERY', 'En livraison'
        DELIVERED = 'DELIVERED', 'Livrée'
        CANCELLED = 'CANCELLED', 'Annulée'

    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='orders_as_client',
    )
    livreur = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders_as_livreur',
        limit_choices_to={'role': User.Role.LIVREUR},
    )
    adresse_texte = models.TextField()
    telephone = models.CharField(max_length=30)
    montant_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    statut = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    date_creation = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_creation']

    def __str__(self):
        return f'Commande #{self.pk} — {self.client.username} ({self.statut})'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.quantity}x {self.product.name}'

    @property
    def line_total(self):
        return self.quantity * self.unit_price
