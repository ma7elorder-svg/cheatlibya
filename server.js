const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('.'));

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Sender email
        pass: process.env.EMAIL_PASS  // App password
    }
});

// Route to handle order submissions
app.post('/api/send-order', async (req, res) => {
    try {
        const { name, phone, city, address, product, price } = req.body;

        // Email Content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'markomers910@gmail.com', // Recipient email (Admin)
            subject: `طلب جديد: ${name} - ${city}`,
            html: `
                <div style="font-family: Arial, sans-serif; direction: rtl; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #28a745; text-align: center;">طلب جديد من المتجر</h2>
                    <hr>
                    <p><strong>المنتج:</strong> ${product}</p>
                    <p><strong>السعر:</strong> ${price}</p>
                    <hr>
                    <h3>تفاضيل العميل:</h3>
                    <p><strong>الاسم:</strong> ${name}</p>
                    <p><strong>رقم الهاتف:</strong> ${phone}</p>
                    <p><strong>المدينة:</strong> ${city}</p>
                    <p><strong>العنوان التفصيلي:</strong> ${address}</p>
                    <hr>
                    <p style="font-size: 12px; color: #777;">تم إرسال هذا الطلب عبر خادم Cheat Libya المحلي.</p>
                </div>
            `
        };

        // Send Email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).json({ success: true, message: 'Order sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send order.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
