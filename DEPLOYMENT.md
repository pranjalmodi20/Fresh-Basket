# Deployment Guide

## Backend (Render)

Your backend is already deployed at: `https://fresh-basket-sno7.onrender.com`

**Important:** After pushing the CORS changes, Render will automatically redeploy. Make sure these environment variables are set in Render:
- `MONGODB_URI`
- `JWT_SECRET`
- `PORT` (optional, defaults to 5001)

## Frontend (Vercel)

Your frontend is deployed at: `https://fresh-basket-tan.vercel.app`

### Steps to Deploy Updated Frontend:

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Fix API URLs for production deployment"
   git push origin main
   ```

2. **Vercel will automatically redeploy** (if connected to your Git repo)

3. **Or manually deploy:**
   ```bash
   cd frontend
   npm run build
   # Then upload the build folder to Vercel
   ```

## Local Development

To run locally with local backend:

1. Create `frontend/.env.local`:
   ```
   REACT_APP_API_URL=http://localhost:5001
   ```

2. Start backend:
   ```bash
   cd backend
   npm run dev
   ```

3. Start frontend:
   ```bash
   cd frontend
   npm start
   ```

## What Was Fixed

1. ✅ Updated all API URLs to use production backend URL by default
2. ✅ Added environment variable support for flexible configuration
3. ✅ Fixed CORS to allow requests from Vercel domain
4. ✅ Created .env files for local development

## Testing

After deployment, test these features:
- [ ] Login/Signup
- [ ] View products
- [ ] Add to cart
- [ ] Add to wishlist
- [ ] Admin panel (if admin user)
