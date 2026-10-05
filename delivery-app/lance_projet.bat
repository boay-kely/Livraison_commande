@echo off
:: 1. Démarrer MySQL / XAMPP
start "" "C:\xampp\xampp_start.exe"

:: 2. Démarrer le serveur Django (Backend)
cd /d "F:\Livraison_commande\delivery-app\backend"
start /b "" "venv\Scripts\python.exe" manage.py runserver

:: 3. Démarrer le serveur React (Frontend)
cd /d "F:\Livraison_commande\delivery-app\frontend"
start /b "" cmd /c "npm run dev"

:: 4. Attendre 5 secondes que React et Vite soient prêts
timeout /t 5 /nobreak >nul

:: 5. Demander explicitement à Windows d'ouvrir la page React dans le navigateur par défaut
explorer "http://localhost:5173"