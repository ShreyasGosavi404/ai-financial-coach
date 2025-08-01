#!/bin/bash

# Quick Start Script for AI Financial Coach

echo "🚀 Starting AI Financial Coach Development Environment"

# Check if we're in the project root
if [ ! -f "DEPLOYMENT_GUIDE.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Start backend
echo "📡 Starting backend server..."
cd backend
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 5

# Start frontend
echo "🎨 Starting frontend development server..."
cd professional-frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "✅ Both servers are starting up!"
echo "📡 Backend: http://localhost:8000"
echo "🎨 Frontend: http://localhost:3000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
