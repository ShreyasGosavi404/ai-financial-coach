#!/bin/bash
# AI Financial Coach - Startup Script for Railway

echo "🚀 Starting AI Financial Coach Backend API"
cd backend
python main.py

# Start Backend
echo "📡 Starting FastAPI Backend..."
cd backend
python main.py &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "🌐 Starting React Frontend..."
cd ../finwiseai-frontend
npm start &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

echo "✅ Application started successfully!"
echo "Backend API: http://localhost:8000"
echo "Frontend UI: http://localhost:3000"
echo ""
echo "To stop the application:"
echo "kill $BACKEND_PID $FRONTEND_PID"
