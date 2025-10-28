interface ParcelEmailData {
    trackingId: string;
    senderName: string;
    senderEmail: string;
    receiverName: string;
    receiverEmail: string;
    receiverAddress?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    parcelDetails?: {
        type?: string;
        weight?: number;
        description?: string;
    };
    trackingUrl: string;
}

// Base email styles
const emailStyles = `
    body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f4;
    }
    .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
    }
    .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 30px 20px;
        text-align: center;
    }
    .logo {
        font-size: 32px;
        font-weight: bold;
        color: #ffffff;
        margin: 0;
    }
    .logo-icon {
        font-size: 40px;
        margin-bottom: 10px;
    }
    .content {
        padding: 40px 30px;
    }
    .greeting {
        font-size: 24px;
        color: #333333;
        margin-bottom: 20px;
    }
    .message {
        font-size: 16px;
        color: #666666;
        line-height: 1.6;
        margin-bottom: 30px;
    }
    .tracking-box {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border-radius: 10px;
        padding: 25px;
        margin: 30px 0;
        text-align: center;
    }
    .tracking-label {
        font-size: 14px;
        color: #666666;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .tracking-id {
        font-size: 28px;
        font-weight: bold;
        color: #667eea;
        margin: 10px 0;
        font-family: 'Courier New', monospace;
    }
    .track-button {
        display: inline-block;
        margin-top: 20px;
        padding: 15px 40px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 50px;
        font-weight: bold;
        font-size: 16px;
        transition: transform 0.2s;
    }
    .track-button:hover {
        transform: scale(1.05);
    }
    .parcel-details {
        background-color: #f9fafb;
        border-left: 4px solid #667eea;
        padding: 20px;
        margin: 20px 0;
        border-radius: 5px;
    }
    .parcel-details h3 {
        margin-top: 0;
        color: #333333;
        font-size: 18px;
    }
    .detail-row {
        display: flex;
        margin: 10px 0;
        font-size: 14px;
    }
    .detail-label {
        font-weight: bold;
        color: #667eea;
        min-width: 120px;
    }
    .detail-value {
        color: #666666;
    }
    .footer {
        background-color: #2d3748;
        padding: 30px 20px;
        text-align: center;
        color: #a0aec0;
    }
    .footer-logo {
        font-size: 20px;
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 15px;
    }
    .footer-text {
        font-size: 14px;
        margin: 10px 0;
    }
    .footer-links {
        margin: 20px 0;
    }
    .footer-link {
        color: #667eea;
        text-decoration: none;
        margin: 0 10px;
    }
    .divider {
        height: 1px;
        background-color: #e2e8f0;
        margin: 30px 0;
    }
    @media only screen and (max-width: 600px) {
        .content {
            padding: 30px 20px;
        }
        .tracking-id {
            font-size: 22px;
        }
        .track-button {
            padding: 12px 30px;
            font-size: 14px;
        }
    }
`;

/**
 * Sender email template - sent when parcel is created
 */
export const senderEmailTemplate = (data: ParcelEmailData): string => {
    const { trackingId, senderName, receiverName, receiverEmail, parcelDetails, trackingUrl } = data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parcel Created Successfully</title>
    <style>${emailStyles}</style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo-icon">📦</div>
            <h1 class="logo">Parcel Delivery</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <h2 class="greeting">আপনার পার্সেল সফলভাবে পাঠানো হয়েছে! 🎉</h2>
            
            <p class="message">
                প্রিয় ${senderName || 'গ্রাহক'},<br><br>
                আপনার পার্সেলটি সফলভাবে আমাদের সিস্টেমে যুক্ত হয়েছে এবং শীঘ্রই প্রক্রিয়া শুরু হবে।
                নিচে আপনার Tracking ID এবং পার্সেলের বিস্তারিত তথ্য দেওয়া হলো।
            </p>

            <!-- Tracking Box -->
            <div class="tracking-box">
                <div class="tracking-label">🔍 Tracking ID</div>
                <div class="tracking-id">${trackingId}</div>
                <a href="${trackingUrl}" class="track-button">
                    🚚 Track Your Parcel
                </a>
            </div>

            <!-- Parcel Details -->
            <div class="parcel-details">
                <h3>📋 পার্সেলের বিস্তারিত তথ্য</h3>
                <div class="detail-row">
                    <span class="detail-label">প্রাপক:</span>
                    <span class="detail-value">${receiverName || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">প্রাপকের ইমেইল:</span>
                    <span class="detail-value">${receiverEmail || 'N/A'}</span>
                </div>
                ${parcelDetails?.type ? `
                <div class="detail-row">
                    <span class="detail-label">পার্সেলের ধরন:</span>
                    <span class="detail-value">${parcelDetails.type}</span>
                </div>` : ''}
                ${parcelDetails?.weight ? `
                <div class="detail-row">
                    <span class="detail-label">ওজন:</span>
                    <span class="detail-value">${parcelDetails.weight} kg</span>
                </div>` : ''}
                ${parcelDetails?.description ? `
                <div class="detail-row">
                    <span class="detail-label">বিবরণ:</span>
                    <span class="detail-value">${parcelDetails.description}</span>
                </div>` : ''}
            </div>

            <div class="divider"></div>

            <p class="message" style="font-size: 14px; color: #888;">
                💡 <strong>পরামর্শ:</strong> আপনার Tracking ID টি সংরক্ষণ করুন এবং যেকোনো সময় পার্সেলের অবস্থান জানতে উপরের বাটনে ক্লিক করুন।
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-logo">📦 Parcel Delivery</div>
            <p class="footer-text">Fast, Secure & Reliable Delivery Service</p>
            <div class="footer-links">
                <a href="${trackingUrl}" class="footer-link">Track Parcel</a> |
                <a href="#" class="footer-link">Help Center</a> |
                <a href="#" class="footer-link">Contact Us</a>
            </div>
            <p class="footer-text" style="font-size: 12px; margin-top: 20px;">
                © ${new Date().getFullYear()} Parcel Delivery System. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
    `;
};

/**
 * Receiver email template - sent when parcel is created
 */
export const receiverEmailTemplate = (data: ParcelEmailData): string => {
    const { trackingId, senderName, receiverName, receiverAddress, parcelDetails, trackingUrl } = data;

    // Format address
    const fullAddress = receiverAddress
        ? `${receiverAddress.street || ''}, ${receiverAddress.city || ''}, ${receiverAddress.state || ''} ${receiverAddress.zipCode || ''}, ${receiverAddress.country || 'Bangladesh'}`
        : 'N/A';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You Have a Parcel Coming</title>
    <style>${emailStyles}</style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo-icon">📬</div>
            <h1 class="logo">Parcel Delivery</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <h2 class="greeting">আপনার জন্য একটি পার্সেল আসছে! 🎁</h2>
            
            <p class="message">
                প্রিয় ${receiverName || 'গ্রাহক'},<br><br>
                <strong>${senderName || 'কেউ একজন'}</strong> আপনার জন্য একটি পার্সেল পাঠিয়েছেন।
                আপনি নিচের Tracking ID বা Tracking Link ব্যবহার করে পার্সেলটি ট্র্যাক করতে পারবেন।
            </p>

            <!-- Tracking Box -->
            <div class="tracking-box">
                <div class="tracking-label">🔍 Tracking ID</div>
                <div class="tracking-id">${trackingId}</div>
                <a href="${trackingUrl}" class="track-button">
                    🚚 Track Your Parcel
                </a>
            </div>

            <!-- Parcel Details -->
            <div class="parcel-details">
                <h3>📦 পার্সেলের বিস্তারিত তথ্য</h3>
                <div class="detail-row">
                    <span class="detail-label">প্রেরক:</span>
                    <span class="detail-value">${senderName || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">ডেলিভারির ঠিকানা:</span>
                    <span class="detail-value">${fullAddress}</span>
                </div>
                ${parcelDetails?.type ? `
                <div class="detail-row">
                    <span class="detail-label">পার্সেলের ধরন:</span>
                    <span class="detail-value">${parcelDetails.type}</span>
                </div>` : ''}
                ${parcelDetails?.weight ? `
                <div class="detail-row">
                    <span class="detail-label">আনুমানিক ওজন:</span>
                    <span class="detail-value">${parcelDetails.weight} kg</span>
                </div>` : ''}
                ${parcelDetails?.description ? `
                <div class="detail-row">
                    <span class="detail-label">বিবরণ:</span>
                    <span class="detail-value">${parcelDetails.description}</span>
                </div>` : ''}
            </div>

            <div class="divider"></div>

            <p class="message" style="font-size: 14px; color: #888;">
                📍 <strong>পরবর্তী পদক্ষেপ:</strong> আপনার পার্সেল শীঘ্রই আপনার ঠিকানায় পৌঁছানো হবে। 
                Tracking Link থেকে রিয়েল-টাইম অবস্থান জানতে পারবেন।
            </p>

            <p class="message" style="font-size: 14px; color: #888;">
                ⚠️ ডেলিভারির সময় অনুগ্রহ করে আপনার ফোন সাথে রাখুন যাতে ডেলিভারি এজেন্ট আপনার সাথে যোগাযোগ করতে পারেন।
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-logo">📦 Parcel Delivery</div>
            <p class="footer-text">Fast, Secure & Reliable Delivery Service</p>
            <div class="footer-links">
                <a href="${trackingUrl}" class="footer-link">Track Parcel</a> |
                <a href="#" class="footer-link">Help Center</a> |
                <a href="#" class="footer-link">Contact Us</a>
            </div>
            <p class="footer-text" style="font-size: 12px; margin-top: 20px;">
                © ${new Date().getFullYear()} Parcel Delivery System. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
    `;
};
