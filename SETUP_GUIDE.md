# 🚀 Quick Setup Guide - Email Notifications

## Step 1: Install Dependencies (Already Done ✅)

```bash
npm install pdfkit qrcode nodemailer @types/pdfkit @types/qrcode @types/nodemailer
```

## Step 2: Configure Environment Variables

### Create or Update `.env` file:

```env
# Application URLs
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=ParcelTrack
```

### For Gmail Setup:

1. **Enable 2-Factor Authentication:**

   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
   - Use this as `EMAIL_PASSWORD`

## Step 3: Build and Run

```bash
# Build the project
npm run build

# Run in development
npm run dev

# Or run in production
npm start
```

## Step 4: Test the Feature

### Using API:

**POST** `/api/parcels`

```json
{
  "receiverEmail": "receiver@example.com",
  "parcelDetails": {
    "type": "fragile",
    "weight": 50,
    "dimensions": {
      "length": 43,
      "width": 43,
      "height": 43
    },
    "description": "Fragile items - handle with care"
  },
  "deliveryInfo": {
    "isUrgent": false
  }
}
```

**Expected Result:**

- ✅ Parcel created in database
- ✅ Sender receives email with PDF attachment
- ✅ Receiver receives email with PDF attachment
- ✅ PDF contains all parcel details + QR code
- ✅ QR code links to tracking page

## Step 5: Verify Email Delivery

### Check Console Logs:

```
✅ Email service is ready to send emails
✅ PDF generated successfully
✅ Sender email sent: <message-id>
✅ Receiver email sent: <message-id>
```

### Check Email Inbox:

- Look for emails in sender's and receiver's inbox
- Open PDF attachment
- Scan QR code to verify tracking link

## 🔍 Troubleshooting

### Email Not Sending?

1. **Check .env file exists and has correct values**
2. **Verify email credentials are correct**
3. **Check console for error messages**
4. **Test SMTP connection manually**

### PDF Not Generated?

1. **Check if pdfkit and qrcode are installed**
2. **Verify parcel data is complete**
3. **Check console for PDF generation errors**

## 📧 Email Service Status

### Service Configured ✅

```
✅ Email service is ready to send emails
```

### Service Not Configured ⚠️

```
⚠️  Email service not configured
📧 Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD to enable email notifications.
```

**Note:** Parcel creation will still work even if email service is not configured. Emails just won't be sent.

## 🎯 What's Included

### Features Implemented:

- ✅ Automatic email sending on parcel creation
- ✅ PDF generation with QR code
- ✅ Beautiful HTML email templates
- ✅ Sender email with tracking details
- ✅ Receiver email with tracking details
- ✅ Error handling and logging
- ✅ Non-blocking background processing
- ✅ Graceful degradation

### Files Created/Modified:

1. **src/config/env.ts** - Added email configuration
2. **src/templates/emailTemplates.ts** - NEW - Email HTML templates
3. **src/services/pdfService.ts** - NEW - PDF generation service
4. **src/services/emailService.ts** - Updated with PDF attachment
5. **src/modules/parcel/parcel.service.ts** - Added email sending
6. **.env.example** - Added APP_URL and email config

## 📝 Next Steps

1. ✅ Configure your email credentials in `.env`
2. ✅ Test parcel creation
3. ✅ Verify emails are received
4. ✅ Check PDF attachments
5. ✅ Test QR code scanning

## 🎉 Ready to Use!

The email notification feature is now fully implemented and ready to use. Just configure your email settings and start creating parcels!

---

**Need Help?** Check `EMAIL_NOTIFICATION_IMPLEMENTATION.md` for detailed documentation.
