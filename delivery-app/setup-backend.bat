@echo off
cd /d "%~dp0backend"

where py >nul 2>&1
if %ERRORLEVEL%==0 (
  set PY=py -3
) else (
  set PY=python
)

echo === Backend setup (MySQL XAMPP) ===
echo Assurez-vous que MySQL est demarre dans XAMPP.
%PY% -m venv .venv
call .venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
python seed.py
python manage.py migrate
python seed.py
echo.
echo Backend pret. Lancez: python manage.py runserver
echo Puis dans frontend: install-npm.bat puis npm run dev
pause
