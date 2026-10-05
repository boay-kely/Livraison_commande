# Installation npm — evite EPERM sur F:\
Set-Location $PSScriptRoot
$cache = Join-Path $PSScriptRoot '.npm-cache'
$env:npm_config_cache = $cache
Write-Host "Cache npm: $cache"
npm install --prefix .
if ($LASTEXITCODE -ne 0) {
  $fallback = Join-Path $env:USERPROFILE '.npm-cache-livraison'
  Write-Host "Retry avec cache: $fallback"
  npm install --prefix . --cache $fallback
}
Write-Host "OK — lancez: npm run dev"
