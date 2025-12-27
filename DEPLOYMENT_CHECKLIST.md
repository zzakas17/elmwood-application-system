# 🚀 Deployment Readiness Checklist

## ✅ Pre-Deployment Verification

### Core Files
- ✅ `server.js` - Backend server configured
- ✅ `package.json` - Dependencies defined
- ✅ `public/index.html` - Landing page
- ✅ `public/application.html` - Application form
- ✅ `render.yaml` - Render configuration
- ✅ `.gitignore` - Properly configured

### Backend Functionality
- ✅ Application saving to `data/applications.json`
- ✅ File uploads (videos, resumes, portfolio)
- ✅ Email notifications configured (needs env vars)
- ✅ Health check endpoint (`/api/health`)
- ✅ Keep-alive endpoint (`/ping`)

### Dependencies
- ✅ express
- ✅ multer (file uploads)
- ✅ nodemailer (email)
- ✅ cors
- ✅ dotenv (environment variables)

## 📋 Before Deploying

### 1. Environment Variables (Set in Render Dashboard)

**Required for Email:**
```
ADMIN_EMAIL=zac@elmwood.co
EMAIL_ENABLED=true
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
APP_URL=https://your-app.onrender.com
```

**Optional:**
```
NODE_ENV=production
PORT=3000
```

### 2. Gmail App Password Setup

1. Enable 2-Factor Authentication on Gmail
2. Go to Google Account → Security → App passwords
3. Generate password for "Mail"
4. Use 16-character password in `EMAIL_PASS`

### 3. Render Plan

- **Free tier**: Will sleep after 15 min (use keep-alive service)
- **Starter plan ($7/mo)**: No sleep (recommended for production)

## 🚀 Deploy to Render

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Select your repository: `elmwood-application-system`
5. Configure:
   - **Name**: `elmwood-app` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Starter ($7/mo) or Free (with keep-alive)
6. Add Environment Variables (see above)
7. Click "Create Web Service"

### Step 3: Wait for Deployment

- Build takes 2-3 minutes
- Watch logs for any errors
- Verify health check: `https://your-app.onrender.com/api/health`

## ✅ Post-Deployment Verification

### 1. Test Landing Page
```
https://your-app.onrender.com/
```
- Should show company info and position description
- "Start Application" button works

### 2. Test Application Form
```
https://your-app.onrender.com/application.html
```
- Form loads correctly
- Can fill out and submit

### 3. Test Submission
- Submit a test application
- Check `data/applications.json` (via admin or logs)
- Verify email received (if configured)

### 4. Test Health Endpoint
```bash
curl https://your-app.onrender.com/api/health
```
- Should return JSON with server status

## 🔧 Troubleshooting

### Application Not Saving?
- Check Render logs for errors
- Verify `data/` directory is writable
- Check file permissions

### Emails Not Sending?
- Verify environment variables are set
- Check Gmail app password is correct
- Check Render logs for email errors
- Verify `EMAIL_ENABLED=true`

### Files Not Uploading?
- Check `uploads/` directory exists
- Verify file size limits (100MB max)
- Check file types are allowed

### App Sleeping (Free Tier)?
- Set up UptimeRobot to ping `/api/health` every 5 min
- OR upgrade to Starter plan ($7/mo)

## 📊 Current Status

**✅ READY TO DEPLOY**

All core functionality is in place:
- ✅ Backend server configured
- ✅ Frontend pages complete
- ✅ File uploads working
- ✅ Application saving working
- ✅ Email configured (needs env vars)
- ✅ Health checks in place

**Next Steps:**
1. Set environment variables in Render
2. Deploy to Render
3. Test submission
4. Configure email credentials
5. Set up keep-alive (if using free tier)

## 🎯 Quick Deploy Command

Everything is ready! Just:
1. Push to GitHub (if not already)
2. Deploy on Render (follow steps above)
3. Add environment variables
4. Test!

