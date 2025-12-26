# 🚀 Deploy to Render - Quick Guide

I've prepared everything. You just need to authenticate once, then I can deploy for you.

## Option 1: Using Render CLI (Automated)

1. **Install Render CLI** (if not already installed):
   ```bash
   npm install -g render-cli
   ```

2. **Login to Render**:
   ```bash
   render login
   ```
   This will open your browser to authenticate.

3. **Deploy**:
   ```bash
   render deploy
   ```

## Option 2: Using Render Dashboard (Easiest - 3 minutes)

Since I can't access your Render account directly, here's the fastest way:

1. **Go to:** https://render.com
2. **Sign in** (or create account - free)
3. **Click:** "New +" → "Web Service"
4. **Connect GitHub:**
   - Click "Connect GitHub"
   - Authorize Render
   - Search for: `elmwood-application-system`
   - Select it
5. **Render will auto-detect** the `render.yaml` file and configure everything!
6. **Click:** "Create Web Service"
7. **Wait 2-3 minutes** for deployment

## ✅ Your URLs Will Be:

- **Application Form:** `https://elmwood-application-system.onrender.com`
- **Admin Dashboard:** `https://elmwood-application-system.onrender.com/admin.html`

---

## After Deployment:

1. Test the form at your URL
2. Submit a test application
3. Check admin dashboard at `/admin.html`
4. Share the form URL with candidates!

---

**Note:** The `render.yaml` file is already configured, so Render will automatically set everything up correctly!

