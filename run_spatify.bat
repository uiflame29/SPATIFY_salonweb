@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "ROOT=%~dp0"
set "BACKEND_DIR=%ROOT%spatify-backend"
set "FRONTEND_DIR=%ROOT%spatify-frontend"
set "SERVER_PORT=5218"
set "FRONTEND_PORT=8126"
set "MAVEN_CMD=C:\tools\apache-maven-3.9.15\bin\mvn.cmd"

echo ===================================================
echo             SPATIFY LUXURY SALON SYSTEM
echo ===================================================
echo.

if not exist "%BACKEND_DIR%\pom.xml" (
    echo Backend project folder not found: %BACKEND_DIR%
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%\package.json" (
    echo Frontend project folder not found: %FRONTEND_DIR%
    pause
    exit /b 1
)

echo Checking PostgreSQL...
sc query postgresql-x64-17 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo PostgreSQL 17 was not detected.
    echo Install PostgreSQL 17 and create the database: spatify_db
    pause
    exit /b 1
) else (
    echo Starting PostgreSQL service...
    net start postgresql-x64-17 >nul 2>&1
)

echo.
echo Cleaning stale app ports...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":5218 " /C:":8126 " /C:":8127 " 2^>nul') do (
    echo Stopping PID %%P on a busy app port
    taskkill /F /PID %%P >nul 2>&1
)

echo.
echo Launching backend...
start "" cmd /k "cd /d ""%BACKEND_DIR%"" && title Spatify Backend && color 0B && echo Starting Spring Boot... && set SERVER_PORT=%SERVER_PORT% && ""%MAVEN_CMD%"" spring-boot:run"

echo Waiting for backend startup...
timeout /t 8 /nobreak >nul

echo Launching frontend...
start "" cmd /k "cd /d ""%FRONTEND_DIR%"" && title Spatify Frontend && color 0A && echo Starting Vite... && npm install && set VITE_API_URL=http://localhost:%SERVER_PORT%/api && npm run dev -- --host 0.0.0.0 --port %FRONTEND_PORT%"

echo.
ping -n 6 127.0.0.1 >nul

powershell -NoProfile -ExecutionPolicy Bypass -Command "$urls = @('http://localhost:%FRONTEND_PORT%','http://localhost:8127'); foreach ($u in $urls) { try { $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 4; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { Start-Process $u; Write-Host 'Opening: ' $u; break } } catch {} }"

echo.
echo ===================================================
echo Backend API: http://localhost:%SERVER_PORT%
echo Frontend: http://localhost:%FRONTEND_PORT%
echo Fallback: http://localhost:8127
echo ===================================================
echo.
echo You can close this window after both apps open.
pause
