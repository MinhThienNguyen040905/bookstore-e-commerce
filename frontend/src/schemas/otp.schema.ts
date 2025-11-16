// src/schemas/otp.schema.ts
import { z } from 'zod';

export const requestOTPSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
});

export const verifyOTPSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6, 'OTP phải 6 ký tự'),
});

export const completeRegisterSchema = z.object({
    name: z.string().min(2, 'Họ tên ít nhất 2 ký tự'),
    password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
});

export const resetPasswordSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
});

export type RequestOTPData = z.infer<typeof requestOTPSchema>;
export type VerifyOTPData = z.infer<typeof verifyOTPSchema>;
export type CompleteRegisterData = z.infer<typeof completeRegisterSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;