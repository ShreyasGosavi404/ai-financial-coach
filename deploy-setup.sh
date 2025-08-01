#!/bin/bash

# 🚀 AI Financial Coach Deployment Script

echo "🎯 Preparing AI Financial Coach for Deployment"

# Clean up any existing git issues
echo "📝 Cleaning Git cache..."
cd "$(dirname "$0")"

# Remove node_modules from git if tracked
git rm -r --cached professional-frontend/node_modules/ 2>/dev/null || echo "node_modules not in git"

# Configure git for Windows long paths
git config core.longpaths true
git config core.autocrlf true

# Add all files except node_modules
echo "📦 Adding files to git..."
git add .gitignore
git add backend/
git add professional-frontend/ --ignore-errors
git add *.md
git add *.yml
git add *.json
git add *.toml
git add *.yaml
git add *.bat
git add *.sh

# Commit changes
echo "💾 Committing changes..."
git commit -m "🚀 Prepare for deployment - Full-stack AI Financial Coach

✨ Features:
- FastAPI backend with JWT authentication
- React frontend with Material-UI and 3D animations
- AI-powered financial analysis with Gemini
- Production-ready with Docker and deployment configs

🎯 Ready for:
- Backend: Railway deployment
- Frontend: Vercel deployment
- Database: PostgreSQL (future)

🔧 Technologies: FastAPI, React, Material-UI, Framer Motion, JWT, Docker"

echo "🌟 Ready for deployment!"
echo ""
echo "🔗 Next steps:"
echo "1. Push to GitHub: git remote add origin <your-repo-url> && git push -u origin main"
echo "2. Deploy backend to Railway.app"
echo "3. Deploy frontend to Vercel.com"
echo "4. Update environment variables"
echo ""
echo "📋 See DEPLOYMENT_GUIDE.md for detailed instructions"
