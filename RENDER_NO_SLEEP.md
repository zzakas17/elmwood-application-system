# Prevent Render Auto-Sleep (15 Minute Issue)

## ⚠️ The Problem

Render's **free tier** automatically spins down your app after 15 minutes of inactivity. This means:
- First request after sleep takes ~30 seconds to wake up
- Applications submitted during sleep may be delayed
- Poor user experience

## ✅ Solutions

### Option 1: Upgrade to Starter Plan (Recommended - $7/month)

**This is the best solution** - Starter plan apps never sleep.

1. Go to your Render dashboard
2. Click on your service
3. Go to "Settings" → "Plan"
4. Upgrade to **Starter** plan ($7/month)
5. Your app will never sleep!

**Benefits:**
- ✅ No auto-sleep
- ✅ Always responsive
- ✅ Better for production
- ✅ Only $7/month

### Option 2: Use Railway Instead (Free Tier - No Sleep)

Railway's free tier doesn't have the 15-minute sleep issue:

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project from GitHub repo
4. Deploy - no sleep issues!

### Option 3: External Keep-Alive Service (Free)

Use a free service to ping your app every 10 minutes:

**Services:**
- [UptimeRobot](https://uptimerobot.com) - Free, monitors every 5 minutes
- [Cron-Job.org](https://cron-job.org) - Free cron jobs
- [EasyCron](https://www.easycron.com) - Free tier available

**Setup:**
1. Sign up for one of the services above
2. Create a monitor/cron job
3. Set it to ping: `https://your-app.onrender.com/api/health` every 10 minutes
4. This keeps your app awake

**Example UptimeRobot Setup:**
- URL: `https://your-app.onrender.com/api/health`
- Interval: 5 minutes
- Type: HTTP(s)

### Option 4: Update render.yaml (For Starter Plan)

I've already updated `render.yaml` to use the Starter plan. If you upgrade:

```yaml
plan: starter  # This prevents auto-sleep
healthCheckPath: /api/health
```

## 🎯 Recommended Approach

**For Production:**
1. Upgrade to Render Starter plan ($7/month) - **Best option**
2. OR switch to Railway (free tier, no sleep)

**For Testing/Development:**
- Use UptimeRobot or similar to ping every 10 minutes (free)

## 📊 Cost Comparison

| Service | Plan | Cost | Sleep? |
|---------|------|------|--------|
| Render | Free | $0 | ✅ Yes (15 min) |
| Render | Starter | $7/mo | ❌ No |
| Railway | Free | $0 | ❌ No |
| Railway | Hobby | $5/mo | ❌ No |

## 🚀 Quick Fix Right Now

**Immediate solution** - Set up UptimeRobot (5 minutes):

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Sign up (free)
3. Add New Monitor:
   - Type: HTTP(s)
   - URL: `https://your-app.onrender.com/api/health`
   - Interval: 5 minutes
4. Save

Your app will stay awake! ✅

## 🔍 Verify It's Working

Check if your app is staying awake:
```bash
# This should respond quickly (not 30 seconds)
curl https://your-app.onrender.com/api/health
```

If it responds instantly, you're good! If it takes 30 seconds, it's sleeping.

