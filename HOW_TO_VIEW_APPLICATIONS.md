# 📧 How to Receive & View Applications

## Current System

### 1. **Admin Dashboard (Primary Method)**

After deployment, access your admin dashboard at:

**`https://your-app.onrender.com/admin.html`**

**Features:**
- ✅ View all applications in a table
- ✅ Search by name or email
- ✅ Click any application to see full details
- ✅ View uploaded videos, resumes, cover letters, portfolios
- ✅ Export all applications to CSV
- ✅ Auto-refreshes every 30 seconds
- ✅ Statistics dashboard (total apps, this week, etc.)

**What you'll see:**
- Applicant name, email, location
- Experience level
- Whether they uploaded a video
- Commercial real estate experience
- Full application details when you click

---

### 2. **Direct File Access (Backup Method)**

Applications are stored in: `data/applications.json` on the server

You can:
- Download this file from Render's dashboard
- Access via SSH (if you upgrade to paid plan)
- Export via admin dashboard CSV feature

---

## 📧 Email Notifications (Recommended Addition)

Currently, you need to check the admin dashboard manually. 

**Would you like me to add email notifications?** I can set it up so you get an email every time someone submits an application with:
- Applicant name
- Email
- Link to view full application

This would require:
- Email service (SendGrid, Mailgun, or Gmail SMTP)
- Adding email notification code to server.js

---

## 🔔 Best Practices

1. **Bookmark the admin dashboard:** `https://your-app.onrender.com/admin.html`
2. **Check regularly** or set up email notifications
3. **Export to CSV weekly** for backup
4. **Download important files** (videos, resumes) from the dashboard

---

## 🚀 Quick Access

Once deployed, your admin dashboard URL will be:
```
https://your-app-name.onrender.com/admin.html
```

**No password required** (consider adding one for security - I can help with that too!)

