// src/api/authApi.ts
import api from './axios';

export const requestOTP = async (email: string) => {
    const { data } = await api.post('/users/request-otp', { email });
    return data.data;
};

export const verifyOTP = async (email: string, otp: string) => {
    const { data } = await api.post('/users/verify-otp', { email, otp });
    return data.data;
};

export const completeRegister = async (data: {
    name: string;
    email: string;
    password: string;
}) => {
    const { data: response } = await api.post('/users/register', data);
    return response.data;
};

export const resetPassword = async (data: {
    email: string;
    otp: string;
    newPassword: string;
}) => {
    const { data: response } = await api.post('/users/reset-password', data);
    return response.data;
};