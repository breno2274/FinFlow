@echo off
title Finflow - Servidor de Desenvolvimento
echo ===================================================
echo   Iniciando Finflow (React, TypeScript e Vite)
echo ===================================================
echo.

if not exist node_modules (
  echo Baixando dependzencias necessarias...
  call npm install
  if errorlevel 1 (
    echo Erro ao instalar dependencias.
    pause
    exit /b %errorlevel%
  )
)

echo.
echo Iniciando servidor Vite e abrindo navegador...
start http://localhost:5173/
call npm run dev
pause

