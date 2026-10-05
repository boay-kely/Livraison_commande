"""
Initialisation MySQL (XAMPP) + données de test.
Prérequis : MySQL XAMPP démarré sur 127.0.0.1:3306

Usage (depuis backend/, venv activé) :
    pip install -r requirements.txt
    python seed.py
    python manage.py migrate
    python seed.py
"""
import os
import sys

import pymysql

DB_NAME = 'livraison_db'
DB_USER = 'root'
DB_PASSWORD = ''
DB_HOST = '127.0.0.1'
DB_PORT = 3306


def ensure_database():
    print(f'Connexion MySQL {DB_HOST}:{DB_PORT}…')
    connection = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT,
        charset='utf8mb4',
    )
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                f'CREATE DATABASE IF NOT EXISTS `{DB_NAME}` '
                'CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
            )
        connection.commit()
        print(f'Base `{DB_NAME}` prête.')
    finally:
        connection.close()


def run_seed():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

    import django

    django.setup()

    from django.contrib.auth import get_user_model
    from api.models import Product

    User = get_user_model()

    products = [
        {
            'name': 'Riz Basmati 5kg',
            'description': 'Riz basmati de qualité premium, paquet de 5 kg.',
            'price': '18500.00',
            'stock': 40,
        },
        {
            'name': 'Huile de tournesol 2L',
            'description': 'Huile végétale raffinée, bouteille 2 litres.',
            'price': '9800.00',
            'stock': 60,
        },
        {
            'name': 'Café torréfié 250g',
            'description': 'Café arabica torréfié artisanalement, 250 g.',
            'price': '12500.00',
            'stock': 25,
        },
    ]

    users = [
        {
            'username': 'admin',
            'email': 'admin@livraison.local',
            'password': 'admin123',
            'first_name': 'Admin',
            'last_name': 'Dispatch',
            'role': User.Role.ADMIN_DISPATCH,
            'is_staff': True,
            'is_superuser': True,
        },
        {
            'username': 'livreur1',
            'email': 'livreur1@livraison.local',
            'password': 'livreur123',
            'first_name': 'Jean',
            'last_name': 'Livreur',
            'role': User.Role.LIVREUR,
            'is_staff': False,
            'is_superuser': False,
        },
        {
            'username': 'client1',
            'email': 'client1@livraison.local',
            'password': 'client123',
            'first_name': 'Marie',
            'last_name': 'Client',
            'role': User.Role.CLIENT,
            'is_staff': False,
            'is_superuser': False,
        },
    ]

    print('Produits :')
    for data in products:
        product, created = Product.objects.update_or_create(
            name=data['name'],
            defaults={
                'description': data['description'],
                'price': data['price'],
                'stock': data['stock'],
            },
        )
        print(f'  {"créé" if created else "mis à jour"} : {product.name}')

    print('Comptes :')
    for data in users:
        password = data['password']
        defaults = {k: v for k, v in data.items() if k != 'password'}
        user, created = User.objects.update_or_create(
            username=data['username'],
            defaults=defaults,
        )
        user.set_password(password)
        user.save()
        print(
            f'  {"créé" if created else "mis à jour"} : '
            f'{user.username} / {password} ({user.role})'
        )


def main():
    print('=== Seed Livraison Commande (MySQL XAMPP) ===')
    try:
        ensure_database()
    except pymysql.err.OperationalError as exc:
        print(
            'Impossible de joindre MySQL XAMPP.\n'
            'Démarrez Apache/MySQL dans XAMPP puis réessayez.\n'
            f'Détail : {exc}'
        )
        sys.exit(1)

    try:
        run_seed()
    except Exception as exc:
        msg = str(exc).lower()
        if (
            'no such table' in msg
            or "doesn't exist" in msg
            or 'does not exist' in msg
            or 'table' in msg and 'exist' in msg
        ):
            print(
                'Tables absentes pour le moment.\n'
                'Exécutez : python manage.py migrate\n'
                'puis relancez : python seed.py'
            )
            sys.exit(0)
        raise

    print('Terminé.')


if __name__ == '__main__':
    main()
