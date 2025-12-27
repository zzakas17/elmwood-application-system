# Backend Setup & Verification

## ✅ What's Working

1. **Application Saving**: All applications are automatically saved to `data/applications.json`
2. **File Uploads**: Videos, resumes, and portfolio files are saved to `uploads/` directory
3. **Email Notifications**: Configured but requires email credentials

## 📧 Email Setup (Required for Notifications)

### Quick Setup with Gmail

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Create an App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/) → Security
   - Under "2-Step Verification", click "App passwords"
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Create `.env` file** in the project root:

```bash
# Copy the example file
cp .env.example .env

# Then edit .env with your credentials:
ADMIN_EMAIL=zac@elmwood.co
EMAIL_ENABLED=true
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
APP_URL=http://localhost:3000
```

### For Production (Railway/Render)

Set these as environment variables in your hosting platform dashboard.

## 🧪 Testing the Backend

### 1. Check if server is running:
```bash
curl http://localhost:3000/api/health
```

### 2. Verify applications are saving:
- Submit a test application
- Check `data/applications.json` file
- Applications are saved immediately upon submission

### 3. Test email (after configuring):
- Submit a test application
- Check your email inbox (and spam folder)
- You should receive:
  - **Notification email** to ADMIN_EMAIL
  - **Confirmation email** to the applicant

## 📁 File Locations

- **Applications**: `data/applications.json`
- **Videos**: `uploads/videos/`
- **Resumes**: `uploads/documents/`
- **Portfolio**: `uploads/portfolio/`

## 🔍 Verify Backend is Working

1. **Start the server**:
   ```bash
   npm start
   ```

2. **Check health endpoint**:
   ```bash
   curl http://localhost:3000/api/health
   ```

3. **Submit a test application** through the form

4. **Verify it saved**:
   ```bash
   cat data/applications.json
   ```

## ⚠️ Important Notes

- **Applications ALWAYS save** even if email fails
- Email is sent asynchronously (won't block submission)
- If email isn't configured, applications still save successfully
- Check server console logs for email status

## 🚨 Troubleshooting

### Applications not saving?
- Check `data/` directory exists and is writable
- Check server console for errors
- Verify form is submitting to `/api/submit-application`

### Emails not sending?
- Verify `.env` file exists and has correct credentials
- Check email service (Gmail) allows "less secure apps" or use App Password
- Check server console logs for email errors
- Verify EMAIL_ENABLED=true

### Files not uploading?
- Check `uploads/` directory exists and is writable
- Verify file size is under 100MB
- Check file types are allowed (see server.js)

