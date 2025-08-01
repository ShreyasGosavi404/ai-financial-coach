#!/usr/bin/env powershell
# AI Financial Coach - Backend Startup Script

Write-Host "🚀 Starting AI Financial Coach Backend..." -ForegroundColor Green
Write-Host "📍 Current Directory: $(Get-Location)" -ForegroundColor Yellow

# Check if in correct directory
if (!(Test-Path "backend/main.py")) {
    Write-Host "❌ Error: backend/main.py not found. Please run from project root." -ForegroundColor Red
    exit 1
}

# Create virtual environment if it doesn't exist
if (!(Test-Path "venv")) {
    Write-Host "🔧 Creating virtual environment..." -ForegroundColor Blue
    python -m venv venv
}

# Activate virtual environment
Write-Host "🔄 Activating virtual environment..." -ForegroundColor Blue
.\venv\Scripts\Activate.ps1

# Install/Update dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Blue
pip install -r backend\requirements.txt

# Start backend server
Write-Host "🚀 Starting FastAPI backend server..." -ForegroundColor Green
Write-Host "📡 Backend will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📋 API docs available at: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

cd backend
python main.py
