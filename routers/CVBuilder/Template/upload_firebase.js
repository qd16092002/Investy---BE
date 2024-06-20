import express from 'express';
import pdf from 'html-pdf';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Thiết lập __dirname và __filename cho ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Đọc tệp JSON đồng bộ và phân tích cú pháp
const serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, './serviceAccountKey.json'), 'utf8'));

const router = express.Router();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'investy-b17a1.appspot.com' // Đảm bảo bạn thay thế đúng tên bucket
});

const bucket = admin.storage().bucket();

router.post('/generate-pdf', (req, res) => {
    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CV</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap">
        <style>
            body {
                font-family: Inter, sans-serif;
                background-color: #f6f6f6;
                padding: 15mm;
            }
    
            .cvuser {
                background-color: #f6f6f6;
                min-height: 260mm;
                width: 210mm;
                padding: 15mm;
            }
    
            .cvuser_header {
                padding: 0mm 5mm 5mm 5mm;
            }
    
            .cvuser_header_line {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
    
            .cvuser_header_fullName {
                font-family: Inter;
                font-size: 40px;
                font-weight: 400;
                line-height: 48.41px;
                text-align: left;
            }
    
            .cvuser_header_position {
                font-family: Inter;
                font-size: 24px;
                font-weight: 600;
                line-height: 29.05px;
                text-align: right;
            }
    
            .cvuser_header_address {
                font-family: Inter;
                font-size: 14px;
                font-weight: 500;
                line-height: 16.94px;
                text-align: left;
                color: #595959;
            }
    
            .cvuser_line {
                border: 0.5px solid #8C8C8C;
                width: 100%;
                height: 0px;
            }
    
            .cvuser_aboutme {
                padding: 5mm;
            }
    
            .cvuser_aboutme_title {
                font-family: Inter;
                font-size: 16px;
                font-weight: 600;
                line-height: 19.36px;
                text-align: left;
            }
    
            .cvuser_aboutme_content {
                margin-top: 2mm;
                font-family: Inter;
                font-size: 14px;
                font-weight: 400;
                line-height: 16.94px;
                text-align: left;
                color: #595959;
            }
        </style>
    </head>
    <body>
        <div class="cvuser">
            <div class="cvuser_header">
                <div class="cvuser_header_line">
                    <div class="cvuser_header_fullName">
                        Tran Quang Dao
                    </div>
                    <div class="cvuser_header_position">
                        IT Developer
                    </div>
                </div>
                <div class="cvuser_header_line" style="margin-top: 2mm;">
                    <div class="cvuser_header_address">
                        Thanh Xuân district
                    </div>
                </div>
                <div class="cvuser_header_line" style="margin-top: 6mm; display: flex; justify-content: normal; gap: 20mm; padding-left: 10mm;">
                    <div class="cvuser_header_address">
                        tranquangdao16092002@gmail.com
                    </div>
                    <div class="cvuser_header_address">
                        Profile
                    </div>
                </div>
            </div>
            <div class="cvuser_line"></div>
            <div class="cvuser_aboutme">
                <div class="cvuser_aboutme_title">About me</div>
                <div class="cvuser_aboutme_content">
                    For more than 2 years, I've gone through technology startup companies that nurtured my passion for becoming a future entrepreneur. With the ability to adapt quickly, work independently as well as analyze & solve problems. I'm interested in empowering startups and innovators and seeking opportunities to explore my abilities in those fields.
                </div>
            </div>
        </div>
    </body>
    </html>`;

    if (!htmlContent) {
        return res.status(400).send({ message: 'HTML content is required' });
    }

    const pdfFileName = `pdf.pdf`;
    const pdfFilePath = path.join('/tmp', pdfFileName);

    pdf.create(htmlContent).toFile(pdfFilePath, async (err, result) => {
        if (err) {
            console.error('Error generating PDF:', err);
            return res.status(500).send({ message: 'Internal server error' });
        }

        try {
            // Tải lên Firebase với đường dẫn đích cụ thể
            const destinationPath = `host/cvbuild/test/${pdfFileName}`;
            await bucket.upload(pdfFilePath, {
                destination: destinationPath,
                metadata: {
                    contentType: 'application/pdf'
                }
            });

            const file = bucket.file(destinationPath);
            const [url] = await file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491' // Thời gian hết hạn cho URL
            });

            // Xóa tệp tạm
            fs.unlinkSync(pdfFilePath);

            res.status(200).send({ message: 'PDF created and uploaded successfully', url });
        } catch (error) {
            console.error('Error uploading PDF to Firebase:', error);
            res.status(500).send({ message: 'Internal server error' });
        }
    });
});

export default router;
