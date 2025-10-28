interface EmailTemplateData {
    trackingId: string;
    senderName: string;
    senderEmail: string;
    receiverName: string;
    receiverEmail: string;
    receiverAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    parcelDetails: {
        type: string;
        weight: number;
        description: string;
    };
    trackingUrl: string;
}

export const senderEmailTemplate = (data: EmailTemplateData): string => {
    const fullAddress = `${data.receiverAddress.street}, ${data.receiverAddress.city}, ${data.receiverAddress.state} ${data.receiverAddress.zipCode}, ${data.receiverAddress.country}`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parcel Created Successfully</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 5px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 30px 20px;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        .success-message {
            background-color: #DCFCE7;
            border-left: 4px solid #16A34A;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .success-message h3 {
            color: #16A34A;
            margin: 0 0 5px 0;
            font-size: 16px;
        }
        .success-message p {
            color: #166534;
            margin: 0;
            font-size: 14px;
        }
        .tracking-box {
            background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 20px;
        }
        .tracking-box .label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.9;
            margin-bottom: 5px;
        }
        .tracking-box .tracking-id {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
            margin: 0;
        }
        .info-section {
            background-color: #F9FAFB;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #E5E7EB;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #6B7280;
            font-size: 14px;
        }
        .info-value {
            color: #1F2937;
            font-size: 14px;
            text-align: right;
            max-width: 65%;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
            color: white;
            padding: 14px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .attachment-note {
            background-color: #FEF3C7;
            border-left: 4px solid #F59E0B;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .attachment-note p {
            margin: 0;
            color: #92400E;
            font-size: 14px;
        }
        .footer {
            background-color: #F9FAFB;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6B7280;
        }
        .footer a {
            color: #EF4444;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 ParcelTrack</h1>
            <p>Professional Delivery Service</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Dear <strong>${data.senderName}</strong>,
            </div>
            
            <div class="success-message">
                <h3>✅ Success!</h3>
                <p>Your parcel has been created successfully and is ready for delivery.</p>
            </div>
            
            <div class="tracking-box">
                <div class="label">Tracking ID</div>
                <div class="tracking-id">${data.trackingId}</div>
            </div>
            
            <div class="info-section">
                <div class="info-row">
                    <span class="info-label">📍 Receiver</span>
                    <span class="info-value">${data.receiverName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">📧 Email</span>
                    <span class="info-value">${data.receiverEmail}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">🏠 Delivery Address</span>
                    <span class="info-value">${fullAddress}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">📦 Type</span>
                    <span class="info-value">${data.parcelDetails.type}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">⚖️ Weight</span>
                    <span class="info-value">${data.parcelDetails.weight} kg</span>
                </div>
            </div>
            
            <div class="attachment-note">
                <p>📎 <strong>PDF Attachment:</strong> Please find the attached PDF document with complete parcel details and QR code for easy tracking.</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${data.trackingUrl}" class="cta-button">Track Your Parcel</a>
            </div>
            
            <p style="color: #6B7280; font-size: 14px; margin-top: 20px;">
                You can track your parcel anytime by clicking the button above or scanning the QR code in the attached PDF.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>ParcelTrack © 2025</strong> - Professional Delivery Services</p>
            <p>Track your parcel: <a href="${data.trackingUrl}">${data.trackingUrl}</a></p>
            <p style="margin-top: 10px;">This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>
    `;
};

export const receiverEmailTemplate = (data: EmailTemplateData): string => {
    const fullAddress = `${data.receiverAddress.street}, ${data.receiverAddress.city}, ${data.receiverAddress.state} ${data.receiverAddress.zipCode}, ${data.receiverAddress.country}`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You Have a New Parcel</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 5px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 30px 20px;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        .new-parcel-message {
            background-color: #DBEAFE;
            border-left: 4px solid #3B82F6;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .new-parcel-message h3 {
            color: #1E40AF;
            margin: 0 0 5px 0;
            font-size: 16px;
        }
        .new-parcel-message p {
            color: #1E3A8A;
            margin: 0;
            font-size: 14px;
        }
        .tracking-box {
            background: linear-gradient(135deg, #EC4899 0%, #DB2777 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 20px;
        }
        .tracking-box .label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.9;
            margin-bottom: 5px;
        }
        .tracking-box .tracking-id {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
            margin: 0;
        }
        .info-section {
            background-color: #F9FAFB;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #E5E7EB;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #6B7280;
            font-size: 14px;
        }
        .info-value {
            color: #1F2937;
            font-size: 14px;
            text-align: right;
            max-width: 65%;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            color: white;
            padding: 14px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .attachment-note {
            background-color: #FEF3C7;
            border-left: 4px solid #F59E0B;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .attachment-note p {
            margin: 0;
            color: #92400E;
            font-size: 14px;
        }
        .footer {
            background-color: #F9FAFB;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6B7280;
        }
        .footer a {
            color: #8B5CF6;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 ParcelTrack</h1>
            <p>Professional Delivery Service</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Dear <strong>${data.receiverName}</strong>,
            </div>
            
            <div class="new-parcel-message">
                <h3>📬 New Parcel Incoming!</h3>
                <p>You have a new parcel on its way to you.</p>
            </div>
            
            <div class="tracking-box">
                <div class="label">Tracking ID</div>
                <div class="tracking-id">${data.trackingId}</div>
            </div>
            
            <div class="info-section">
                <div class="info-row">
                    <span class="info-label">👤 Sender</span>
                    <span class="info-value">${data.senderName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">📧 Sender Email</span>
                    <span class="info-value">${data.senderEmail}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">🏠 Delivery Address</span>
                    <span class="info-value">${fullAddress}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">📦 Type</span>
                    <span class="info-value">${data.parcelDetails.type}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">⚖️ Weight</span>
                    <span class="info-value">${data.parcelDetails.weight} kg</span>
                </div>
            </div>
            
            <div class="attachment-note">
                <p>📎 <strong>PDF Attachment:</strong> Please find the attached PDF document with complete parcel details and QR code for easy tracking.</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${data.trackingUrl}" class="cta-button">Track Your Parcel</a>
            </div>
            
            <p style="color: #6B7280; font-size: 14px; margin-top: 20px;">
                You can track the parcel status anytime by clicking the button above or scanning the QR code in the attached PDF.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>ParcelTrack © 2025</strong> - Professional Delivery Services</p>
            <p>Track your parcel: <a href="${data.trackingUrl}">${data.trackingUrl}</a></p>
            <p style="margin-top: 10px;">This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>
    `;
};
