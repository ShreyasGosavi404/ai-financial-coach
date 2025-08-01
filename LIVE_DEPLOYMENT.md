# 🚀 AI Financial Coach - Live Application URLs

## **Production Deployment (LIVE & WORKING)**

### **Frontend (Vercel)**
- **Main URL**: https://professional-frontend-iiop2zwb6-shreyasgosavi404s-projects.vercel.app
- **Alias URL**: https://ai-financial-coach-frontend.vercel.app (if alias was set successfully)

### **Backend (Railway)**
- **API URL**: https://ai-financial-coach-backend-production.up.railway.app
- **Health Check**: https://ai-financial-coach-backend-production.up.railway.app/health
- **API Docs**: https://ai-financial-coach-backend-production.up.railway.app/docs

## **Test Credentials**
- **Email**: demo@aifinance.com
- **Password**: demo123

## **Features Available**
✅ User Authentication (JWT-based)
✅ Financial Analysis (Rule-based + AI fallback)
✅ Interactive Chat Assistant
✅ CSV Transaction Upload
✅ Budget Analysis & Recommendations
✅ Savings Strategy Planning
✅ Debt Reduction Analysis

## **Integration Status**
✅ Frontend → Backend connection working
✅ CORS configured for Vercel domains
✅ Environment variables set correctly
✅ Authentication flow operational
✅ API endpoints responding

## **Technical Stack**
- **Frontend**: React + Material-UI (Vercel)
- **Backend**: FastAPI + Python (Railway)
- **Database**: In-memory (demo users)
- **Authentication**: JWT tokens
- **Analysis**: Rule-based financial logic

## **Deployment Commands**
```bash
# Update Frontend
cd professional-frontend
npx vercel --prod

# Update Backend (auto-deploys on git push)
git add .
git commit -m "Your changes"
git push
```

## **Support & Troubleshooting**
- Check backend health: Visit the health check URL above
- Check logs: Railway dashboard for backend, Vercel dashboard for frontend
- Environment variables: Verified and set correctly

---
**Last Updated**: August 1, 2025
**Status**: ✅ LIVE AND OPERATIONAL
