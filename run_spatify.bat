@echo off
echo ===================================================
echo             SPATIFY LUXURY SALON SYSTEM
echo ===================================================
echo.
echo Cleaning up existing processes...
:: Kill any existing java or node processes that might be holding ports 5218 or 8126
taskkill /F /IM java.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
echo Processes cleaned up.
echo.
echo Starting Database, Backend, and Frontend...
echo.

:: Ensure PostgreSQL is running
echo Checking PostgreSQL status...
sc query postgresql-x64-17 >nul 2>&1
if %errorlevel% neq 0 (
    echo PostgreSQL service not found. Make sure PostgreSQL 17 is installed.
) else (
    echo Starting PostgreSQL service - requires admin rights if not already running...
    net start postgresql-x64-17 >nul 2>&1
)

:: Start the Backend in a new window
echo Launching Backend (Port 5218)...
start "Spatify Backend" cmd /k "cd /d %~dp0spatify-backend && title Spatify Backend Server && color 0B && echo Starting Spring Boot... && set PGPASSWORD=postgres && C:\tools\apache-maven-3.9.15\bin\mvn.cmd spring-boot:run"

:: Wait a few seconds before starting the frontend
timeout /t 5 /nobreak >nul

:: Start the Frontend in a new window
echo Launching Frontend (Port 8126)...
start "Spatify Frontend" cmd /k "cd /d %~dp0spatify-frontend && title Spatify Frontend Server && color 0A && echo Starting React Dev Server... && npm run dev"

echo.
echo ===================================================
echo All services launched!
echo Backend API running at: http://10.80.58.230:5218
echo Frontend running at:    http://10.80.58.230:8126
echo ===================================================
echo You can now close this window.
pause
