// utils/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOTP = async (email, otp) => {
    await transporter.sendMail({
        from: '"Bookstore" <no-reply@bookstore.com>',
        to: email,
        subject: 'Mã OTP xác thực',
        html: `<h3>Mã OTP của bạn: <strong>${otp}</strong></h3><p>Hết hạn sau 5 phút.</p>`
    });
};