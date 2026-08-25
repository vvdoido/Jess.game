@echo off
title Cyber Slug: Neon Front
color 0A
echo.
echo  ========================================
echo   CYBER SLUG: NEON FRONT - LOADING...
echo  ========================================
echo.
echo  Abrindo o jogo no navegador...
echo.

cd /d "%~dp0"

REM Tenta abrir com o navegador padrão
start "" "index.html"

REM Se não funcionar, tenta abrir diretamente com o Chrome
if errorlevel 1 (
    start chrome "file:///%~dp0index.html"
)

REM Se ainda não funcionar, tenta com o Edge
if errorlevel 1 (
    start msedge "file:///%~dp0index.html"
)

echo.
echo  Jogo iniciado! Feche esta janela quando terminar.
echo.
timeout /t 3 >nul
exit
