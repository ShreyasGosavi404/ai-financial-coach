@echo off
echo 🚀 Starting AI Financial Coach Application

REM Start Backend
echo 📡 Starting FastAPI Backend...
cd backend
start "Backend" cmd /k "python main.py"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend
echo 🌐 Starting React Frontend...
cd ..\finwiseai-frontend
start "Frontend" cmd /k "npm start"

echo ✅ Application startup initiated!
echo Backend API: http://localhost:8000
echo Frontend UI: http://localhost:3000
echo.
echo Both services are starting in separate windows...
pause
