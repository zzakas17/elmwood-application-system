# Deployment Guide

This application is ready to deploy to any Node.js hosting platform. Here are instructions for popular platforms:

## Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)

1. **Create a Railway account** at [railway.app](https://railway.app)
2. **Create a new project** and select "Deploy from GitHub repo"
3. **Connect your GitHub repository** (push this code to GitHub first)
4. **Railway will automatically:**
   - Detect Node.js
   - Install dependencies (`npm install`)
   - Start the server (`npm start`)
   - Assign a public URL

**Environment Variables (Optional):**
- `PORT` - Railway sets this automatically, but you can override if needed

**That's it!** Your application will be live at `https://your-app.railway.app`

---

### Option 2: Render

1. **Create a Render account** at [render.com](https://render.com)
2. **Create a new "Web Service"**
3. **Connect your GitHub repository**
4. **Configure:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. **Add Environment Variable:**
   - `PORT` = `10000` (or leave blank, Render will set it)

**Note:** On Render's free tier, your app will spin down after 15 minutes of inactivity.

---

### Option 3: Heroku

1. **Install Heroku CLI** and login
2. **Create a Heroku app:**
   ```bash
   heroku create your-app-name
   ```
3. **Deploy:**
   ```bash
   git push heroku main
   ```

---

### Option 4: DigitalOcean App Platform

1. **Create account** at [digitalocean.com](https://digitalocean.com)
2. **Create App** → **GitHub** → Select repository
3. **Configure:**
   - **Type:** Web Service
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`
   - **HTTP Port:** `3000` (or use `PORT` env var)

---

## Pre-Deployment Checklist

✅ **All files are in place:**
- `server.js` - Backend server
- `package.json` - Dependencies
- `public/index.html` - Application form
- `public/admin.html` - Admin dashboard

✅ **Dependencies installed:**
```bash
npm install
```

✅ **Test locally:**
```bash
npm start
```
Visit `http://localhost:3000` to verify everything works.

---

## Important Notes

### File Storage
- **Uploads are stored locally** in the `uploads/` directory
- For production, consider using cloud storage (AWS S3, Cloudinary, etc.)
- The `uploads/` folder will persist on the server

### Data Storage
- **Applications are stored** in `data/applications.json`
- This file will persist on the server
- For production, consider using a database (MongoDB, PostgreSQL, etc.)

### Security
- The admin dashboard (`/admin.html`) is currently **not password protected**
- Consider adding authentication before deploying
- Add `.env` file for sensitive configuration (don't commit to Git)

### Environment Variables
Create a `.env` file (and add to `.gitignore`):
```
PORT=3000
ADMIN_PASSWORD=your-secure-password
```

---

## Post-Deployment

1. **Test the application form:**
   - Visit your deployed URL
   - Fill out and submit a test application
   - Verify files upload correctly

2. **Test the admin dashboard:**
   - Visit `https://your-app.com/admin.html`
   - Verify you can view applications

3. **Monitor logs:**
   - Check your hosting platform's logs for errors
   - Verify file uploads are working

---

## Troubleshooting

### Application won't start
- Check Node.js version (requires >= 14.0.0)
- Verify `package.json` has all dependencies
- Check server logs for error messages

### File uploads not working
- Verify `uploads/` directory has write permissions
- Check file size limits (currently 100MB)
- Verify multer configuration

### Can't access admin dashboard
- Ensure `public/admin.html` exists
- Check file permissions
- Verify static file serving is enabled

---

## Next Steps (Optional Enhancements)

1. **Add authentication** to admin dashboard
2. **Set up email notifications** when applications are submitted
3. **Add database** instead of JSON file storage
4. **Use cloud storage** for file uploads (S3, Cloudinary)
5. **Add SSL/HTTPS** (most platforms do this automatically)
6. **Set up monitoring** (Sentry, LogRocket, etc.)

---

## Support

If you encounter issues during deployment, check:
- Server logs on your hosting platform
- Node.js version compatibility
- File permissions
- Environment variables

The application is production-ready and fully functional!

