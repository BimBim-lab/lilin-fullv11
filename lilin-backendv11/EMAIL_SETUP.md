# Email Configuration for WeisCandle Contact Form

## 📧 Setup Email Service

### Gmail Configuration (Recommended)

1. **Enable 2-Factor Authentication on Gmail**
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Create App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" as app
   - Select "Other" as device, enter "WeisCandle Website"
   - Copy the 16-digit password

3. **Update .env File**
   ```bash
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=abcd-efgh-ijkl-mnop  # 16-digit app password
   EMAIL_FROM_NAME=WeisCandle
   EMAIL_FROM_ADDRESS=noreply@weiscandle.com
   ```

### Other Email Services

**Yahoo Mail:**
```bash
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

**Outlook/Hotmail:**
```bash
EMAIL_SERVICE=hotmail
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-app-password
```

## 🧪 Test Email Configuration

1. **Set Admin Email** in Dashboard → Contact Settings
2. **Configure Email** credentials in .env file
3. **Restart Backend Server**
4. **Send Test Email** via API:

```bash
POST /api/test-email
Authorization: Bearer your-admin-token
Content-Type: application/json

{
  "email": "admin@weiscandle.com"
}
```

## 🔍 Troubleshooting

### Common Issues:

1. **"Production email not configured"**
   - Make sure EMAIL_USER and EMAIL_PASS are set in .env
   - Restart backend server after changing .env

2. **"Authentication failed"**
   - For Gmail: Use App Password, not regular password
   - Check if 2FA is enabled

3. **"Test account" being used**
   - Email will go to Ethereal Email (test service)
   - Preview URLs will be shown in backend console
   - Configure production email to send real emails

### Email Flow:

1. User submits contact form
2. Backend saves message to database
3. Email notification sent to admin email
4. Auto-reply sent to user email
5. Success response returned to frontend

## ⚠️ Important Notes:

- Never commit real credentials to version control
- Use environment variables for all sensitive data
- Test email configuration before production deployment
- Check spam folder if emails don't arrive
