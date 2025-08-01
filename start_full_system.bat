@echo off
echo Starting AI Financial Coach Application...
echo.

echo [1/3] Starting Backend Server...
cd /d "C:\Users\ShreyasGosavi\Documents\AI_Project\awesome-llm-apps\advanced_ai_agents\multi_agent_apps\ai_financial_coach_agent\backend"
start "Backend" cmd /k "python main_with_auth.py"

echo [2/3] Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo [3/3] Starting Frontend...
cd /d "C:\Users\ShreyasGosavi\Documents\AI_Project\awesome-llm-apps\advanced_ai_agents\multi_agent_apps\ai_financial_coach_agent\professional-frontend"
start "Frontend" cmd /k "npm start"

echo.
echo ✅ Application is starting up!
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Demo Login Credentials:
echo Email: demo@aifinance.com
echo Password: demo123
echo.
pause
