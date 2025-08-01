@echo off
REM Quick Start Script for AI Financial Coach (Windows)

echo 🚀 Starting AI Financial Coach Development Environment

REM Check if we're in the project root
if not exist "DEPLOYMENT_GUIDE.md" (
    echo ❌ Please run this script from the project root directory
    exit /b 1
)

REM Start backend
echo 📡 Starting backend server...
cd backend
start "Backend Server" python main.py
cd ..

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend
echo 🎨 Starting frontend development server...
cd professional-frontend
start "Frontend Server" npm start
cd ..

echo ✅ Both servers are starting up!
echo 📡 Backend: http://localhost:8000
echo 🎨 Frontend: http://localhost:3000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo Press any key to continue...
pause >nul
