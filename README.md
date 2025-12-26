# Elmwood & Co. - Operations Coordinator Application System

A professional, full-stack application system for hiring an Operations & Transaction Coordinator. Built with Express.js, featuring video uploads, real-time admin dashboard, and secure data management.

## 🎯 What You Have

✅ **Production-ready Node.js backend** with Express  
✅ **Professional application form** with Elmwood branding  
✅ **Admin dashboard** to manage all applications  
✅ **Video upload capability** (up to 2 videos per applicant)  
✅ **Responsive design** (mobile, tablet, desktop)  
✅ **Auto-saving applications** with organized file management  
✅ **CSV export** for easy candidate evaluation  

## 🚀 Quick Start (Local Testing)

### 1. Install Node.js
If you don't have it: https://nodejs.org (download LTS version)

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
npm start
```

### 4. Access Your Application
- **Application Form**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin.html

You should see:
```
✓ Server is running on http://localhost:3000
✓ Application form available at http://localhost:3000
✓ Admin dashboard available at http://localhost:3000/admin.html
```

## 📋 File Structure

```
elmwood-application-system/
├── server.js                 # Express backend
├── package.json              # Dependencies
├── public/
│   ├── index.html           # Application form
│   └── admin.html           # Admin dashboard
├── data/
│   └── applications.json    # Stored applications
├── uploads/
│   └── videos/              # Uploaded video files
└── README.md                # This file
```

## 🎨 What's Included

### Application Form (index.html)
- Elmwood & Co. navy blue branding (#1a3d5c)
- Professional, clean design
- 20+ screening questions covering:
  - Personal information
  - Professional background
  - CRE experience
  - Technical capabilities
  - Availability & compensation
  - 2 video uploads
- Form validation and file size checking
- Success/error messages

### Admin Dashboard (admin.html)
- View all applications with sorting
- Search by name or email
- Statistics (total, this week, with videos, CRE experience)
- Click to view full application details
- Watch submitted videos inline
- Export to CSV with one click
- Auto-refreshes every 30 seconds
- Responsive on all devices

### Backend (server.js)
- Express.js REST API
- Video upload handling (100MB limit)
- JSON file storage (easy to migrate)
- Proper error handling
- CORS enabled
- Ready for production deployment

## 🔧 Customization

### Update Company Email
Edit `public/index.html`, find and update:
```html
careers@elmwoodco.com  <!-- Change to your email -->
```

### Change Position Details
In `public/index.html`, update the Position Overview section:
```html
<div class="position-highlight">
    <h2>Position Overview</h2>
    <ul>
        <li>Compensation: $8-12 USD/hour</li>  <!-- Update salary -->
        <li>Schedule: Full-time, 100% remote</li>
        <li>Benefits: Weekly pay, weekends off</li>
        <li>Responsibilities: ...</li>  <!-- Update roles -->
    </ul>
</div>
```

### Add More Questions
1. Add a new form field in `public/index.html`:
```html
<div class="form-group">
    <label for="newField">Your Question <span class="required">*</span></label>
    <input type="text" id="newField" name="newField" required>
</div>
```

2. Update `server.js` to capture the field in the API handler

## 🌐 Deployment Options

### Option 1: Railway (Recommended - Easiest)

**Why Railway?** Free tier, automatic deploys, instant HTTPS, simple setup

1. Go to https://railway.app and sign up (free)
2. Create new project → Deploy from GitHub
3. Connect your repository
4. Railway auto-detects Node.js and deploys
5. Get your live URL: `your-project-url.railway.app`
6. Share that URL with candidates

**After Deploy:**
- Your form: `your-project-url.railway.app`
- Your admin: `your-project-url.railway.app/admin.html`

### Option 2: Render (Also Free & Easy)

1. Go to https://render.com and sign up
2. Click "New Web Service"
3. Connect your GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Deploy
7. Get your URL: `your-project-url.onrender.com`

### Option 3: DigitalOcean ($5-12/month)

For more control and faster performance:

```bash
# 1. Create Ubuntu droplet on DigitalOcean
# 2. SSH into your server
# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Clone your repository
git clone [your-repo-url]
cd elmwood-application-system

# 5. Install dependencies
npm install

# 6. Install PM2 (keeps app running)
npm install -g pm2

# 7. Start your app
pm2 start server.js
pm2 startup
pm2 save

# 8. Setup domain and SSL (Let's Encrypt)
# Use Nginx as reverse proxy pointing to localhost:3000
```

### Option 4: Vercel, Fly.io, or AWS

These also support Node.js. Follow their documentation to connect your GitHub repository.

## 🔐 Security Recommendations

Before going live with real applicants:

### 1. Add Admin Password Protection
Currently anyone with the URL can access `/admin.html`. Add authentication:

```javascript
// Add to server.js before the admin endpoint
const adminPassword = process.env.ADMIN_PASSWORD || 'your-secure-password';

app.get('/admin.html', (req, res) => {
    const auth = req.get('Authorization');
    if (!auth || !auth.includes(adminPassword)) {
        return res.status(401).send('Unauthorized');
    }
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
```

### 2. Set Environment Variables
Create a `.env` file (not committed to git):
```
ADMIN_PASSWORD=your-super-secure-password
PORT=3000
```

### 3. Add Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10 // limit each IP to 10 requests per windowMs
});

app.post('/api/submit-application', limiter, upload.fields(...), ...);
```

### 4. Use HTTPS in Production
All deployed platforms provide free HTTPS. Never deploy with plain HTTP.

### 5. Backup Your Data
Periodically download and backup your `data/applications.json` file.

## 📊 Using the Admin Dashboard

### Access Dashboard
```
http://localhost:3000/admin.html
```

### Features
- **Search**: Find applicants by name or email
- **Stats**: See total applications, this week, videos, CRE experience
- **Click to View**: Click any applicant to see full details
- **Watch Videos**: View submitted videos directly in the dashboard
- **Export CSV**: Download applicant data for spreadsheets/email

### Data Location
Applications are stored in `data/applications.json` (plain text, easy to backup)

## 🎬 Testing Before Launch

1. **Test locally:**
```bash
npm start
# Visit http://localhost:3000
# Fill out a test application
# Check http://localhost:3000/admin.html
```

2. **Test video uploads:**
- Try uploading actual video files
- Check file sizes (max 100MB per video)
- Verify videos play in admin dashboard

3. **Test with mobile:**
- Use mobile browser to verify form works on phone
- Check responsiveness of dashboard

4. **Test deployment:**
- Deploy to Railway/Render first
- Test the live URL
- Verify videos upload properly
- Test admin dashboard

## 🛠️ Troubleshooting

**Port 3000 already in use:**
```bash
# Find what's using the port
lsof -i :3000

# Kill it
kill -9 [PID]

# Or use a different port
PORT=3001 npm start
```

**Videos not uploading:**
- Check file format (MP4, MOV, AVI, WMV, WEBM)
- Check file size (max 100MB)
- Check disk space on server
- Check folder permissions

**Applications not saving:**
- Check write permissions on `data/` folder
- Look at console error messages
- Verify `data/` directory exists

**Admin dashboard blank:**
- Check browser console for errors (F12)
- Verify server is running
- Check that applications.json exists
- Verify the API endpoint: http://localhost:3000/api/applications

## 📈 Scaling Up

When ready to scale:

1. **Move to a real database:**
   - MongoDB (free tier on MongoDB Atlas)
   - PostgreSQL (free on Railway)
   - Replace JSON file storage

2. **Use cloud storage for videos:**
   - AWS S3 ($0.023 per GB)
   - Google Cloud Storage
   - Cloudinary (free tier)

3. **Add email notifications:**
   - SendGrid (free tier: 100 emails/day)
   - Mailgun
   - AWS SES

4. **Add authentication:**
   - Auth0 (free tier available)
   - Passport.js
   - Firebase Auth

## 📝 API Endpoints

If you want to build additional tools:

### Get All Applications
```
GET /api/applications
Returns: [{ id, submittedAt, personalInfo, experience, ... }]
```

### Get Specific Application
```
GET /api/applications/:id
Returns: Single application object
```

### Submit Application
```
POST /api/submit-application
Body: FormData with form fields + video files
Returns: { success: true, applicationId: "..." }
```

### Get Video File
```
GET /api/videos/:filename
Returns: Video file (stream)
```

## 🤝 Support & Next Steps

### Immediate Next Steps
1. ✅ Test locally with `npm start`
2. ✅ Deploy to Railway or Render (takes 5 minutes)
3. ✅ Share the live URL with candidates
4. ✅ Monitor applications via admin dashboard

### When Ready to Scale
- Add authentication to admin dashboard
- Move to database instead of JSON files
- Set up email notifications
- Add more advanced features

## 📞 Questions?

This system is designed to be simple yet professional. If you encounter issues:

1. Check the console error messages
2. Verify Node.js is installed correctly
3. Make sure port 3000 is available
4. Check that all files are in the right folders

## 📄 License

This application system is provided for Elmwood & Co.'s hiring needs.

---

**Ready to hire your perfect Operations Coordinator!** 🎉
