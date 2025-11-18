# Render Deployment Guide

## Prerequisites
- Render account (free tier available at render.com)
- GitHub repository with your code
- MongoDB Atlas account for database

## Backend Deployment (Node.js + Express)

### Step 1: Connect Repository to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repository and branch (main)

### Step 2: Configure Backend Service
- **Name**: edutech-backend
- **Environment**: Node
- **Region**: Oregon (free tier available)
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Plan**: Free (or Paid as needed)

### Step 3: Set Environment Variables
Add these in Render dashboard under "Environment":
```
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edutech?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_here
```

### Step 4: Deploy
Click "Create Web Service" - Render will automatically deploy

---

## Frontend Deployment (React + Vite)

### Option A: Deploy on Render (Static Site)
1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

### Option B: Deploy on Vercel (Recommended for Frontend)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `frontend/`
4. Add environment variable:
   ```
   VITE_API_URL=https://edutech-backend.onrender.com
   ```
5. Deploy

---

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user with username/password
4. Whitelist Render IP (allow from anywhere: 0.0.0.0/0)

### Step 2: Get Connection String
1. In MongoDB Atlas, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<username>`, `<password>`, and `<dbname>` with your values

### Step 3: Add to Render Environment
Paste the connection string into `MONGODB_URI` environment variable on Render

---

## Verification Checklist

- [ ] Backend service deployed and running
- [ ] Frontend built and deployed
- [ ] MongoDB Atlas cluster created and connected
- [ ] Environment variables set correctly on Render
- [ ] Backend API responding at `https://edutech-backend.onrender.com/api/health`
- [ ] Frontend loads and connects to backend
- [ ] Signup/Login flow works in production

---

## Troubleshooting

### Backend not starting
- Check logs in Render dashboard
- Verify `server.js` is in the root of `backend/` folder
- Ensure NODE_ENV is set to `production`

### Database connection fails
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas (should be 0.0.0.0/0)
- Ensure username/password are URL-encoded

### Frontend API calls fail
- Check that `VITE_API_URL` is set correctly
- Verify backend is responding to CORS requests
- Check browser console for CORS errors

### Cold start delays
- Render free tier services sleep after inactivity
- First request may take 30+ seconds
- Consider upgrading to paid tier for consistent performance

---

## Cost Estimates (as of 2024)

- **Render Backend (Free)**: $0/month (with limitations)
- **MongoDB Atlas (Free M0)**: $0/month
- **Vercel Frontend (Free)**: $0/month
- **Total**: $0/month for free tier

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
