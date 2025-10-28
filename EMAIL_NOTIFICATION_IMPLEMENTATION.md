# Email Notification Feature with PDF Attachments - Implementation Guide

## Overview

Automatic email notification system that sends emails to both sender and receiver when a parcel is created. Each email includes a PDF attachment with complete parcel details and a QR code for tracking.

---

## ✅ Implementation Completed

### 1. **Dependencies Installed**

```bash
npm install pdfkit qrcode nodemailer @types/pdfkit @types/qrcode @types/nodemailer
```

**Packages:**

- `pdfkit` - PDF generation library
- `qrcode` - QR code generation
- `nodemailer` - Email sending
- TypeScript type definitions for all packages

---

### 2. **Environment Configuration**

**File:** `src/config/env.ts`

**Added Variables:**

- `APP_URL` - Base URL for tracking links and QR codes
- `EMAIL_HOST` - SMTP server host (e.g., smtp.gmail.com)
- `EMAIL_PORT` - SMTP port (587 for TLS, 465 for SSL)
- `EMAIL_SECURE` - Whether to use SSL (true/false)
- `EMAIL_USER` - Email account username
- `EMAIL_PASSWORD` - Email account password (App Password for Gmail)
- `EMAIL_FROM` - Sender email address
- `EMAIL_FROM_NAME` - Sender display name

**Updated .env.example:**

```env
APP_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_FROM=notifications@yourdomain.com
EMAIL_FROM_NAME=ParcelTrack
```

---

### 3. **Email Templates**

**File:** `src/templates/emailTemplates.ts`

**Features:**

- ✅ Beautiful HTML email templates
- ✅ Separate templates for sender and receiver
- ✅ Responsive design with gradient colors
- ✅ Professional layout with company branding
- ✅ All parcel information displayed clearly
- ✅ Call-to-action button for tracking
- ✅ Attachment notification section

**Sender Email:**

- Subject: "Parcel Created Successfully - Tracking ID: {trackingId}"
- Theme: Red gradient (#EF4444)
- Includes: Receiver info, delivery address, parcel details

**Receiver Email:**

- Subject: "You have a new parcel - Tracking ID: {trackingId}"
- Theme: Purple gradient (#8B5CF6)
- Includes: Sender info, delivery address, parcel details

---

### 4. **PDF Generation Service**

**File:** `src/services/pdfService.ts`

**Features:**

- ✅ Professional PDF document generation
- ✅ Color-coded sections for better readability
- ✅ QR code embedded in PDF (bottom right)
- ✅ Complete parcel information
- ✅ Tracking URL in footer
- ✅ Company branding and styling

**PDF Structure:**

1. **Header** - ParcelTrack logo and date
2. **Tracking ID Box** - Large, prominent tracking number (Blue theme)
3. **Sender Information** - Name, email, phone (Purple theme)
4. **Receiver Information** - Name, email, phone (Pink theme)
5. **Delivery Address** - Complete formatted address (Amber theme)
6. **Parcel Details** - Type, weight, dimensions, description (Gray theme)
7. **QR Code** - Scannable QR code linking to tracking page
8. **Footer** - Generated timestamp, copyright, tracking link

**Color Scheme:**

- Primary: #EF4444 (Red)
- Blue: #3B82F6
- Purple: #8B5CF6
- Pink: #EC4899
- Amber: #F59E0B
- Gray: #6B7280

---

### 5. **Email Service**

**File:** `src/services/emailService.ts`

**Features:**

- ✅ Nodemailer configuration with Gmail support
- ✅ PDF attachment generation and inclusion
- ✅ Sends emails to both sender and receiver
- ✅ Error handling (continues even if PDF generation fails)
- ✅ Graceful degradation (sends without PDF if generation fails)
- ✅ Email service status logging
- ✅ Configuration validation

**Key Function:**

```typescript
sendParcelNotificationEmails(parcelData: ParcelNotificationData): Promise<SendResult>
```

**Process:**

1. Validate email configuration
2. Generate PDF with parcel details and QR code
3. Prepare email templates with tracking URLs
4. Send email to sender with PDF attachment
5. Send email to receiver with PDF attachment
6. Return results with success/error status

---

### 6. **Parcel Service Integration**

**File:** `src/modules/parcel/parcel.service.ts`

**Changes:**

- ✅ Import `sendParcelNotificationEmails` function
- ✅ Send emails immediately after parcel creation
- ✅ Background email sending using `setImmediate()`
- ✅ Non-blocking email operations
- ✅ Error handling (doesn't fail parcel creation if email fails)

**Implementation:**

```typescript
// After successful parcel creation and transaction commit
setImmediate(async () => {
  try {
    await sendParcelNotificationEmails({
      trackingId: parcelResponse.trackingId,
      senderName: parcelResponse.senderInfo.name,
      senderEmail: parcelResponse.senderInfo.email,
      // ... other data
    });
  } catch (emailError) {
    console.error("Email error:", emailError);
  }
});
```

---

## 🔧 Configuration Guide

### For Gmail (Recommended):

1. **Enable 2-Factor Authentication:**

   - Go to Google Account → Security
   - Enable 2-Step Verification

2. **Create App Password:**

   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update .env file:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # 16-char app password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=ParcelTrack
   APP_URL=http://localhost:3000
   ```

### For Other Email Providers:

**Outlook/Hotmail:**

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

**Yahoo:**

```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=465
EMAIL_SECURE=true
```

---

## 📧 Email Flow

### When a Parcel is Created:

1. **User creates parcel** → POST /api/parcels
2. **Parcel saved to database** → Transaction committed
3. **Email service triggered** → Background process
4. **PDF generated** → With QR code and all details
5. **Two emails sent:**
   - To sender's email
   - To receiver's email
6. **Response returned** → Success message to frontend

### Error Handling:

- ✅ **Email service not configured** → Warning logged, parcel still created
- ✅ **PDF generation fails** → Email sent without attachment
- ✅ **Email sending fails** → Error logged, parcel still created
- ✅ **Network issues** → Graceful degradation

---

## 🎯 API Response

### Success Response:

```json
{
  "success": true,
  "message": "Parcel created successfully",
  "data": {
    "trackingId": "TRK-20251029-XXXXX",
    "senderInfo": { ... },
    "receiverInfo": { ... },
    "parcelDetails": { ... },
    "currentStatus": "requested",
    "createdAt": "2025-10-29T..."
  }
}
```

**Note:** Emails are sent in the background, so the API response is immediate. Email sending status is logged but doesn't affect the response.

---

## 📝 Testing Checklist

### ✅ Email Configuration:

- [ ] Set up email credentials in .env
- [ ] Test email service connection
- [ ] Verify email delivery

### ✅ PDF Generation:

- [ ] PDF contains all parcel information
- [ ] QR code is scannable
- [ ] Tracking link works
- [ ] PDF attachment in email

### ✅ Functionality:

- [ ] Parcel created successfully
- [ ] Sender receives email with PDF
- [ ] Receiver receives email with PDF
- [ ] Tracking link in email works
- [ ] QR code scans correctly
- [ ] Emails sent within seconds

### ✅ Error Handling:

- [ ] Parcel creation succeeds even if email fails
- [ ] Email sent without PDF if generation fails
- [ ] Proper error logging

---

## 🚀 Production Deployment

### Environment Variables:

```env
NODE_ENV=production
APP_URL=https://your-frontend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=notifications@yourdomain.com
EMAIL_FROM_NAME=ParcelTrack
```

### Best Practices:

1. **Use environment-specific credentials** (different for dev/prod)
2. **Monitor email logs** for delivery issues
3. **Set up email rate limiting** if needed
4. **Use a dedicated email service** (SendGrid, AWS SES) for production
5. **Enable SSL/TLS** for secure email transmission

---

## 🔍 Monitoring & Logging

### Console Logs:

- ✅ Email service initialization status
- ✅ PDF generation success/failure
- ✅ Email sending success/failure
- ✅ Detailed error messages

### Log Examples:

```
✅ Email service is ready to send emails
✅ PDF generated successfully
✅ Sender email sent: <message-id>
✅ Receiver email sent: <message-id>
❌ Email not sent - service not configured
❌ PDF generation error: [error details]
```

---

## 📚 File Structure

```
src/
├── config/
│   └── env.ts                    # ✅ Updated with email & APP_URL config
├── services/
│   ├── emailService.ts           # ✅ Updated with PDF attachment support
│   └── pdfService.ts             # ✅ NEW - PDF generation service
├── templates/
│   └── emailTemplates.ts         # ✅ NEW - HTML email templates
└── modules/
    └── parcel/
        └── parcel.service.ts     # ✅ Updated to send emails
```

---

## 💡 Additional Features (Optional Enhancements)

### Future Improvements:

1. **Email Templates in Multiple Languages** - Localization support
2. **Background Job Queue** - Use Bull/Agenda for reliable email sending
3. **Email Delivery Tracking** - Track open/click rates
4. **Retry Mechanism** - Auto-retry failed email sends
5. **Email Templates Editor** - Admin panel to edit templates
6. **SMS Notifications** - Add SMS support alongside emails
7. **Push Notifications** - Mobile app notifications
8. **Email Preferences** - Let users opt-in/opt-out

---

## 🛠️ Troubleshooting

### Email Not Sending:

1. **Check email configuration:**

   ```bash
   # Verify .env variables are set
   echo $EMAIL_HOST
   echo $EMAIL_USER
   ```

2. **Test SMTP connection:**

   - Check firewall/network settings
   - Verify SMTP credentials
   - Enable "Less secure app access" if using Gmail without App Password

3. **Check logs:**
   - Look for email service warnings
   - Check for authentication errors

### PDF Not Generated:

1. **Check dependencies:**

   ```bash
   npm list pdfkit qrcode
   ```

2. **Verify data structure:**

   - Ensure all required fields are present
   - Check for null/undefined values

3. **Check console logs:**
   - Look for PDF generation errors

---

## 📄 License & Credits

**Implementation:** Parcel Delivery API - Email Notification Feature
**Date:** October 29, 2025
**Version:** 1.0.0

---

## ✨ Summary

This implementation provides a complete, production-ready email notification system with:

- ✅ Automatic email sending on parcel creation
- ✅ Professional PDF attachments with QR codes
- ✅ Beautiful HTML email templates
- ✅ Robust error handling
- ✅ Non-blocking background processing
- ✅ Comprehensive logging
- ✅ Easy configuration
- ✅ Scalable architecture

The system is designed to fail gracefully - if emails fail, parcel creation still succeeds, ensuring core functionality is never blocked by email issues.
