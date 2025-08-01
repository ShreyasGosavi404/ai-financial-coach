#!/usr/bin/env powershell
# AI Financial Coach - Complete System Startup Script

Write-Host "🎯 AI Financial Coach - Complete System Startup" -ForegroundColor Magenta
Write-Host "===============================================" -ForegroundColor Magenta
Write-Host ""

# Function to start backend in new terminal
function Start-Backend {
    Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-Command", "& '$(Get-Location)\start_backend.ps1'"
    Start-Sleep 3
}

# Function to start frontend in new terminal  
function Start-Frontend {
    Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-Command", "& '$(Get-Location)\start_frontend.ps1'"
}

# Check if required files exist
if (!(Test-Path "backend/main.py")) {
    Write-Host "❌ Error: backend/main.py not found. Please run from project root." -ForegroundColor Red
    exit 1
}

if (!(Test-Path "professional-frontend/package.json")) {
    Write-Host "❌ Error: professional-frontend/package.json not found. Please run from project root." -ForegroundColor Red
    exit 1
}

# Start both services
Write-Host "🔄 Starting both Backend and Frontend services..." -ForegroundColor Yellow
Write-Host ""

Start-Backend
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep 5

Start-Frontend

Write-Host ""
Write-Host "✅ Both services are starting up!" -ForegroundColor Green
Write-Host "📡 Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📋 API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Pro Tip: Wait for both servers to fully start before using the application" -ForegroundColor Yellow
Write-Host "🔧 If you encounter issues, run start_backend.ps1 and start_frontend.ps1 separately" -ForegroundColor Yellow
