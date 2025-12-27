# 📧 Email Notification Setup

The application portal now includes professional email notifications! Here's how to set it up:

## Quick Setup (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Create an App Password**:
   - Go to Google Account Settings → Security
   - Under "2-Step Verification", click "App passwords"
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Set Environment Variables** (on your hosting platform):

```bash
EMAIL_ENABLED=true
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=careers@elmwood.co
EMAIL_TO=careers@elmwood.co
APP_URL=https://your-domain.com
```

## What Emails Are Sent?

### 1. **To Hiring Manager** (when application is submitted)
- Subject: "New Application: [Applicant Name]"
- Includes: Name, email, phone, location, experience, application ID
- Link to admin dashboard

### 2. **To Candidate** (confirmation email)
- Subject: "Application Received - Elmwood & Company"
- Professional confirmation with application ID
- Next steps information
- Contact information

## Email Services

### Option 1: Gmail (Free)
- Use your Gmail account with App Password
- Free, easy setup
- 500 emails/day limit

### Option 2: SendGrid (Recommended)
- Free tier: 100 emails/day
- More reliable for production
- Better deliverability

### Option 3: Mailgun
- Free tier: 5,000 emails/month
- Great for high volume

## Testing

Emails are sent asynchronously and won't block the application submission. If email fails, the application still saves successfully.

To test locally, set `EMAIL_ENABLED=true` and configure your credentials.

## Disable Emails

Set `EMAIL_ENABLED=false` or don't set the email environment variables. The system will log that emails are skipped but continue working normally.

