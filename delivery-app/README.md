# Livraison Commande

Application locale — Django REST Framework + MySQL (XAMPP) + React (Vite) + Tailwind CSS.

## Prérequis

- Python 3.10+
- Node.js 18+ / npm
- **XAMPP** avec MySQL démarré (port 3306)

## 1. Backend (MySQL XAMPP)

1. Démarrez **MySQL** dans le panneau XAMPP.
2. Puis :

```powershell
cd F:\Livraison_commande\delivery-app\backend
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python seed.py
python manage.py migrate
python seed.py
python manage.py runserver
```

`seed.py` crée la base `livraison_db` si besoin, puis peuple les comptes/produits.

API : `http://127.0.0.1:8000/api/`

### Comptes de test

| Utilisateur | Mot de passe | Rôle |
|-------------|--------------|------|
| admin       | admin123     | ADMIN_DISPATCH |
| livreur1    | livreur123   | LIVREUR |
| client1     | client123    | CLIENT |

### Auth JWT

- `POST /api/auth/login/` → `{ access, refresh, user: { id, username, role, ... } }`
- Frontend stocke `access` dans `localStorage` sous la clé **`token`**
- `GET /api/auth/me/` avec header `Authorization: Bearer <token>`

## 2. Frontend — installation npm (fix EPERM sur F:\)

```powershell
cd F:\Livraison_commande\delivery-app\frontend
npm install --prefix . --cache ".\.npm-cache"
# ou :
.\install-npm.ps1

npm run dev
```

App : `http://127.0.0.1:5173`

## Design system

- Fond : `bg-stone-100` · Cartes : `bg-stone-50`
- Primaire : `bg-emerald-800` · Accent : `bg-amber-600` · Texte : `text-stone-900`
- Pas de bleu / blanc pur
