@echo off
REM Installation npm sans ecrire le cache a la racine F:\
cd /d "%~dp0"
set "npm_config_cache=%~dp0.npm-cache"
echo Cache npm: %npm_config_cache%
npm install --prefix .
if errorlevel 1 (
  echo Echec. Essayez: npm install --prefix . --cache "%USERPROFILE%\.npm-cache-livraison"
  exit /b 1
)
echo Installation OK. Lancez: npm run dev
