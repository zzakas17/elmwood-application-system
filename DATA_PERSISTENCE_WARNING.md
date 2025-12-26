# ⚠️ Important: Data Persistence on Render Free Tier

## The Problem

**Render's free tier uses an ephemeral filesystem.** This means:

- ❌ Data files (`data/applications.json`) are **NOT persisted** between deployments
- ❌ Files are **lost when the app spins down** (after 15 min inactivity)
- ❌ Files are **lost on every deployment**
- ❌ Files are **lost if Render restarts the service**

## What This Means

**Applications submitted to your portal will disappear** if:
1. The app spins down (15 min of inactivity)
2. You redeploy the app
3. Render restarts the service
4. The app crashes and restarts

## Solutions

### Option 1: Upgrade to Render Starter ($7/month)
- Provides persistent disk storage
- Data survives restarts and deployments
- Files are permanently stored

### Option 2: Use a Database (Recommended - FREE)
- **MongoDB Atlas** (free tier available)
- **PostgreSQL** (free on Render)
- **Supabase** (free tier)
- Data persists permanently
- Better for production

### Option 3: Use Cloud Storage for Files
- **AWS S3** (free tier)
- **Cloudinary** (free tier)
- **Google Cloud Storage**
- Files stored in cloud, not on server

## Quick Fix: Add Database

I can help you add MongoDB Atlas (free) or PostgreSQL to persist your data. This is the best long-term solution.

**Would you like me to:**
1. Set up MongoDB Atlas integration? (Free, easy)
2. Set up PostgreSQL on Render? (Free tier available)
3. Upgrade to Render Starter? ($7/month)

---

**Current Status:** Your applications are being saved, but will be lost on the next restart/deployment unless you implement one of the solutions above.

