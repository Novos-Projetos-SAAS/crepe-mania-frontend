@echo off
setlocal
cd /d "%~dp0"
echo Publicando Crepe Mania - frontend...
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0publicar-frontend.ps1"
set "status=%ERRORLEVEL%"
echo.
if not "%status%"=="0" (
    echo O processo terminou com erro. Leia a mensagem acima.
) else (
    echo Processo finalizado. Confira a mensagem PUBLICADO acima.
)
echo.
pause
exit /b %status%
