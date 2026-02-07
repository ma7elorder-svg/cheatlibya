const nodemailer = require('nodemailer');

// Helper to handle CORS
const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    return await fn(req, res)
}

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, phone, city, address, product, price } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'cheatlibya@gmail.com',
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
                <p style="font-size: 12px; color: #777;">تم إرسال هذا الطلب عبر Vercel Serverless Function.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Order sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send order.', error: error.message });
    }
}

module.exports = allowCors(handler);
