# ⚡ Quick Start Checklist

Use this to get from zero to live in 30 minutes.

## 🟢 Phase 1: Local Testing (5 minutes)

- [ ] Install Node.js from https://nodejs.org
- [ ] Run `npm install` in project folder
- [ ] Run `npm start`
- [ ] Open http://localhost:3000 in browser
- [ ] See "Server is running" message ✓

## 🟡 Phase 2: Test the System (5 minutes)

- [ ] Fill out test application on form
- [ ] Upload test video (optional, can be any short video)
- [ ] Submit application
- [ ] See success message
- [ ] Visit http://localhost:3000/admin.html
- [ ] See your test application in dashboard ✓

## 🔵 Phase 3: Deploy to Live (10 minutes)

### Option A: Easiest (Railway)
- [ ] Create GitHub account (if needed)
- [ ] Push project to GitHub
- [ ] Go to https://railway.app
- [ ] Click "Deploy from GitHub"
- [ ] Select your repository
- [ ] Get live URL
- [ ] Share form URL with candidates ✓

### Option B: Alternative (Render)
- [ ] Create account at https://render.com
- [ ] New Web Service
- [ ] Connect GitHub
- [ ] Deploy ✓

## 🔴 Phase 3b: Secure Admin (5 minutes)

- [ ] Add `ADMIN_PASSWORD` environment variable
- [ ] Update admin authentication in server.js
- [ ] Redeploy
- [ ] Test that /admin.html is protected ✓

## 📋 After Launch

- [ ] Share application URL with candidates
- [ ] Check admin dashboard daily
- [ ] Review applications as they arrive
- [ ] Watch videos and make hiring decisions
- [ ] Export to CSV when needed

---

## 🆘 Common Issues

**Port 3000 in use?**
```bash
kill -9 $(lsof -ti:3000)
npm start
```

**Can't push to GitHub?**
```bash
git config --global user.email "your@email.com"
git config --global user.name "Your Name"
git push
```

**Videos too large?**
- Max 100MB per video
- Compress videos before uploading: https://cloudconvert.com

**Admin dashboard blank?**
- Refresh the page
- Check browser console: F12 → Console tab
- Make sure server is running

---

## 📞 Key Files to Know

| File | What It Does | When to Edit |
|------|-------------|-------------|
| `server.js` | Backend API | Add security, routes |
| `public/index.html` | Application form | Change questions, email |
| `public/admin.html` | Admin dashboard | Styling, add features |
| `package.json` | Dependencies | Add new packages |
| `README.md` | Full documentation | Reference guide |

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✓ Form submits without errors
2. ✓ Admin dashboard shows the submission
3. ✓ Videos upload and play
4. ✓ Live URL works in browser
5. ✓ Can search and filter applications
6. ✓ Can export to CSV

---

**That's it! You're ready to start recruiting.** 🚀
