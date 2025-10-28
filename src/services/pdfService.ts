import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { envVars } from '../config/env';

interface ParcelPDFData {
    trackingId: string;
    senderInfo: {
        name: string;
        email: string;
        phone: string;
    };
    receiverInfo: {
        name: string;
        email: string;
        phone: string;
        address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
        };
    };
    parcelDetails: {
        type: string;
        weight: number;
        dimensions?: {
            length: number;
            width: number;
            height: number;
        };
        description: string;
    };
}

export const generateParcelPDF = async (parcelData: ParcelPDFData): Promise<Buffer> => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const chunks: Buffer[] = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', (error) => reject(error));

            // Generate QR Code
            const trackingUrl = `${envVars.APP_URL || envVars.FRONTEND_URL || 'http://localhost:5173'}/track?id=${parcelData.trackingId}`;
            const qrCodeDataURL = await QRCode.toDataURL(trackingUrl, { width: 150 });

            // Colors
            const primaryColor = '#EF4444'; // Red
            const blueColor = '#3B82F6';
            const purpleColor = '#8B5CF6';
            const pinkColor = '#EC4899';
            const amberColor = '#F59E0B';
            const grayColor = '#6B7280';
            const darkGray = '#1F2937';

            // Helper function to draw a colored box
            const drawColoredBox = (x: number, y: number, width: number, height: number, color: string) => {
                doc.rect(x, y, width, height).fill(color);
            };

            // Helper function to draw section header
            const drawSectionHeader = (y: number, title: string, color: string) => {
                drawColoredBox(50, y, 495, 30, color);
                doc.fillColor('#FFFFFF')
                    .fontSize(14)
                    .font('Helvetica-Bold')
                    .text(title, 60, y + 8, { width: 475 });
                return y + 30;
            };

            // Header with Logo/Name
            doc.fillColor(primaryColor)
                .fontSize(32)
                .font('Helvetica-Bold')
                .text('ParcelTrack', 50, 50);

            doc.fillColor(grayColor)
                .fontSize(12)
                .font('Helvetica')
                .text('Professional Delivery Service', 50, 90);

            // Current Date
            const currentDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            doc.fillColor(grayColor)
                .fontSize(10)
                .text(currentDate, 50, 110);

            // Tracking ID Box (Blue Theme)
            let yPos = 150;
            drawColoredBox(50, yPos, 495, 60, blueColor);
            doc.fillColor('#FFFFFF')
                .fontSize(10)
                .font('Helvetica')
                .text('TRACKING ID', 60, yPos + 10);
            doc.fillColor('#FFFFFF')
                .fontSize(24)
                .font('Helvetica-Bold')
                .text(parcelData.trackingId, 60, yPos + 28);

            // Sender Information (Purple Theme)
            yPos = 230;
            yPos = drawSectionHeader(yPos, '👤 SENDER INFORMATION', purpleColor);

            doc.fillColor(darkGray)
                .fontSize(11)
                .font('Helvetica-Bold')
                .text('Name:', 60, yPos + 10)
                .font('Helvetica')
                .text(parcelData.senderInfo.name, 150, yPos + 10);

            doc.font('Helvetica-Bold')
                .text('Email:', 60, yPos + 28)
                .font('Helvetica')
                .text(parcelData.senderInfo.email, 150, yPos + 28);

            doc.font('Helvetica-Bold')
                .text('Phone:', 60, yPos + 46)
                .font('Helvetica')
                .text(parcelData.senderInfo.phone, 150, yPos + 46);

            // Receiver Information (Pink Theme)
            yPos += 80;
            yPos = drawSectionHeader(yPos, '📍 RECEIVER INFORMATION', pinkColor);

            doc.fillColor(darkGray)
                .fontSize(11)
                .font('Helvetica-Bold')
                .text('Name:', 60, yPos + 10)
                .font('Helvetica')
                .text(parcelData.receiverInfo.name, 150, yPos + 10);

            doc.font('Helvetica-Bold')
                .text('Email:', 60, yPos + 28)
                .font('Helvetica')
                .text(parcelData.receiverInfo.email, 150, yPos + 28);

            doc.font('Helvetica-Bold')
                .text('Phone:', 60, yPos + 46)
                .font('Helvetica')
                .text(parcelData.receiverInfo.phone, 150, yPos + 46);

            // Delivery Address (Amber Theme)
            yPos += 80;
            yPos = drawSectionHeader(yPos, '🏠 DELIVERY ADDRESS', amberColor);

            const fullAddress = `${parcelData.receiverInfo.address.street}\n${parcelData.receiverInfo.address.city}, ${parcelData.receiverInfo.address.state} ${parcelData.receiverInfo.address.zipCode}\n${parcelData.receiverInfo.address.country}`;

            doc.fillColor(darkGray)
                .fontSize(11)
                .font('Helvetica')
                .text(fullAddress, 60, yPos + 10, { width: 475 });

            // Parcel Details (Gray Theme)
            yPos += 70;
            yPos = drawSectionHeader(yPos, '📦 PARCEL DETAILS', grayColor);

            doc.fillColor(darkGray)
                .fontSize(11)
                .font('Helvetica-Bold')
                .text('Type:', 60, yPos + 10)
                .font('Helvetica')
                .text(parcelData.parcelDetails.type.toUpperCase(), 150, yPos + 10);

            doc.font('Helvetica-Bold')
                .text('Weight:', 60, yPos + 28)
                .font('Helvetica')
                .text(`${parcelData.parcelDetails.weight} kg`, 150, yPos + 28);

            if (parcelData.parcelDetails.dimensions) {
                const dimensions = `${parcelData.parcelDetails.dimensions.length} × ${parcelData.parcelDetails.dimensions.width} × ${parcelData.parcelDetails.dimensions.height} cm`;
                doc.font('Helvetica-Bold')
                    .text('Dimensions:', 60, yPos + 46)
                    .font('Helvetica')
                    .text(dimensions, 150, yPos + 46);
                yPos += 18;
            }

            doc.font('Helvetica-Bold')
                .text('Description:', 60, yPos + 46)
                .font('Helvetica')
                .text(parcelData.parcelDetails.description, 150, yPos + 46, { width: 385 });

            // QR Code (Bottom Right)
            const qrCodeX = 420;
            const qrCodeY = 650;

            // Remove 'data:image/png;base64,' prefix
            const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
            const qrCodeBuffer = Buffer.from(base64Data, 'base64');

            doc.image(qrCodeBuffer, qrCodeX, qrCodeY, { width: 120 });

            doc.fillColor(grayColor)
                .fontSize(9)
                .font('Helvetica-Bold')
                .text('Scan to Track', qrCodeX + 20, qrCodeY + 125);

            // Footer
            const footerY = 750;
            doc.fontSize(8)
                .fillColor(grayColor)
                .font('Helvetica')
                .text(`Generated on: ${new Date().toLocaleString('en-US')}`, 50, footerY, {
                    align: 'left',
                });

            doc.fontSize(9)
                .fillColor(darkGray)
                .font('Helvetica-Bold')
                .text('ParcelTrack © 2025 - Professional Delivery Services', 50, footerY + 15, {
                    align: 'center',
                    width: 495,
                });

            doc.fontSize(8)
                .fillColor(primaryColor)
                .font('Helvetica')
                .text(trackingUrl, 50, footerY + 30, {
                    align: 'center',
                    width: 495,
                    link: trackingUrl,
                    underline: true,
                });

            doc.end();
        } catch (error) {
            console.error('❌ PDF generation error:', error);
            reject(error);
        }
    });
};

export default { generateParcelPDF };
