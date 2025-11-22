// utils/email.js
import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOTP = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: `"Bookstore" <${process.env.EMAIL_USER}>`,
            to: email, // ← THÊM DÒNG NÀY (QUAN TRỌNG NHẤT)
            subject: 'Mã OTP xác thực',
            html: `
        <h3>Mã OTP của bạn: <strong style="font-size: 1.5em;">${otp}</strong></h3>
        <p>Hết hạn sau <strong>5 phút</strong>.</p>
        <p>Không chia sẻ mã này với bất kỳ ai!</p>
      `
        });
        console.log(`OTP sent to ${email}`);
    } catch (err) {
        console.error('Lỗi gửi email:', err);
        throw err;
    }
};