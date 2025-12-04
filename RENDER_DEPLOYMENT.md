# Render Deployment Guide

## ✅ Issues Fixed

1. **Case-sensitive imports** - Changed `../models/user` to `../models/User` (Linux is case-sensitive!)
2. **CORS configuration** - Added Vercel URL to allowed origins
3. **Environment variables** - Proper validation in server.js

## 🚀 Deploy to Render

### Step 1: Push Changes to Git

```bash
git add .
git commit -m "Fix case-sensitive imports and CORS for production"
git push origin main
```

### Step 2: Render Configuration

In your Render dashboard (https://dashboard.render.com):

1. **Build Command:**
   ```
   cd backend && npm install
   ```

2. **Start Command:**
   ```
   cd backend && npm start
   ```

3. **Root Directory:** Leave empty (or set to `backend` if option available)

4. **Environment Variables:** Make sure these are set:
   - `MONGODB_URI` = `mongodb+srv://pranjalmodi:IYSBCFxbQOi64Www@pranjalapi.0i3x2rm.mongodb.net/FreshBasket?appName=PranjalApi`
   - `JWT_SECRET` = `fresh_basket_secret_key_2024`
   - `PORT` = `10000` (or leave empty, Render sets this automatically)
   - `NODE_ENV` = `production`

### Step 3: Manual Redeploy

If auto-deploy doesn't trigger:
1. Go to your service in Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

### Step 4: Check Logs

After deployment:
1. Click on "Logs" in Render dashboard
2. Look for:
   - ✅ `Connected to MongoDB - Fresh Basket Database`
   - ✅ `Fresh Basket Server running on port XXXX`
   - ❌ Any error messages

### Step 5: Test the API

Open in browser: `https://fresh-basket-sno7.onrender.com`

You should see:
```json
{
  "message": "Welcome to Fresh Basket API!",
  "status": "Server is running"
}
```

## 🔍 Common Issues

### Issue: "Cannot find module '../models/user'"
**Solution:** Fixed! We changed lowercase `user` to uppercase `User`

### Issue: "CORS error from Vercel"
**Solution:** Fixed! Added `https://fresh-basket-tan.vercel.app` to CORS origins

### Issue: "MongoDB connection failed"
**Solution:** Check environment variables in Render dashboard

### Issue: "Module not found"
**Solution:** Make sure build command includes `cd backend && npm install`

## 📝 Render Service Settings

**Service Type:** Web Service
**Environment:** Node
**Region:** Oregon (or closest to you)
**Branch:** main
**Build Command:** `cd backend && npm install`
**Start Command:** `cd backend && npm start`

## ✨ After Successful Deployment

Your backend will be live at: `https://fresh-basket-sno7.onrender.com`

Test these endpoints:
- `GET /` - Health check
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get all products

Your Vercel frontend will automatically connect to this backend!
