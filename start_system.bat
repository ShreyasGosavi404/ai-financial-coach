@echo off
echo 🚀 Starting AI Financial Coach System...
echo.

echo 📂 Current directory:
cd

echo.
echo 🔧 Starting Backend Server...
start "AI Financial Coach Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo 🌐 Opening Login Page...
timeout /t 2 /nobreak > nul
start "" "login.html"

echo.
echo ✅ AI Financial Coach System Started!
echo.
echo 📋 Access Points:
echo    🔐 Login Page: login.html (opened automatically)
echo    🤖 Backend API: http://localhost:8000
echo    📊 Dashboard: Will open after login
echo    📈 Service Status: http://localhost:8000/service-status
echo.
echo 🎯 Demo Credentials:
echo    Email: demo@aifinance.com
echo    Password: demo123
echo.
echo Press any key to exit...
pause > nul
