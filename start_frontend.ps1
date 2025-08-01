#!/usr/bin/env powershell
# AI Financial Coach - Frontend Startup Script

Write-Host "🚀 Starting AI Financial Coach Professional Frontend..." -ForegroundColor Green
Write-Host "📍 Current Directory: $(Get-Location)" -ForegroundColor Yellow

# Check if in correct directory
if (!(Test-Path "professional-frontend/package.json")) {
    Write-Host "❌ Error: professional-frontend/package.json not found. Please run from project root." -ForegroundColor Red
    exit 1
}

# Navigate to frontend directory
Set-Location professional-frontend

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
    npm install
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Start development server
Write-Host "🚀 Starting React development server..." -ForegroundColor Green
Write-Host "🌐 Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔗 Make sure backend is running at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

npm start
