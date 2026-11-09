# Script de inicializacao automatica do Finflow

Write-Host "Iniciando Finflow (React, TypeScript e Vite)..." -ForegroundColor Cyan

if (-not (Test-Path -Path "node_modules")) {
    Write-Host "Baixando dependencias necessarias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erro ao instalar dependencias do npm." -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

Write-Host "Iniciando servidor local e abrindo navegador..." -ForegroundColor Green
Start-Process "http://localhost:5173/"
npm run dev

