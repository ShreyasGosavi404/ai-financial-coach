# Manual Railway-Vercel Integration Guide

## 🚀 Web Dashboard Method (Recommended)

### Railway Setup:
1. Visit: https://railway.app/dashboard
2. Login with GitHub
3. Find project: ai-financial-coach-backend-production
4. Copy URL: https://ai-financial-coach-backend-production.up.railway.app
5. Check Variables tab for any needed environment vars

### Vercel Setup:
1. Visit: https://vercel.com/dashboard
2. Login with GitHub
3. Find project: professional-frontend
4. Go to: Settings → Environment Variables
5. Add: REACT_APP_API_URL = https://ai-financial-coach-backend-production.up.railway.app
6. Apply to: Production, Preview, Development
7. Redeploy from Deployments tab

## 🔗 Direct URLs for Quick Access:

**Railway Dashboard**: https://railway.app/project/[your-project-id]
**Vercel Dashboard**: https://vercel.com/[your-username]/professional-frontend

## ✅ Verification Steps:

1. Check Railway deployment status
2. Verify Vercel environment variables
3. Test frontend → backend connection
4. Monitor deployment logs

## 🛠️ Troubleshooting:

- Railway not starting: Check railway.toml and requirements.txt
- Vercel env vars not working: Redeploy after adding variables
- CORS issues: Check backend CORS configuration
- 404 errors: Verify deployment URLs are correct

## 📱 Mobile-Friendly Testing:

Your app URLs:
- Frontend: https://professional-frontend-g8g7xi585-shreyasgosavi404s-projects.vercel.app
- Backend: https://ai-financial-coach-backend-production.up.railway.app/health
