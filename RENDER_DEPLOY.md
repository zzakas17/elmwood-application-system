# Deploy to Render (Free Tier)

Railway requires a paid plan. Here's how to deploy to Render (FREE):

## Quick Steps:

1. **Go to [render.com](https://render.com)** and sign up/login (free account)

2. **Click "New +" → "Web Service"**

3. **Connect GitHub:**
   - Click "Connect GitHub" 
   - Authorize Render
   - Select your repository (or create one first)

4. **Configure:**
   - **Name:** `elmwood-application-system` (or any name)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or Starter if you want)

5. **Click "Create Web Service"**

6. **Wait 2-3 minutes** - Render will build and deploy

7. **Your app will be live at:** `https://your-app-name.onrender.com`

---

## If you don't have GitHub:

1. **Create a GitHub repo first:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Then follow steps above**

---

## Note:
- Free tier apps spin down after 15 min of inactivity (first request takes ~30 seconds)
- Upgrade to Starter ($7/month) for always-on
- File uploads will work (stored on Render's disk)

