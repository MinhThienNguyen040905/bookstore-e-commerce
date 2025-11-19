import api from './axios';

export const requestOTP = async (email: string) => {
    const { data } = await api.post('/users/request-otp', { email });
    return data;
};

export const verifyOTP = async (email: string, otp: string) => {
    const { data } = await api.post('/users/verify-otp', { email, otp });
    return data;
};

export const completeRegister = async (data: {
    name: string;
    email: string;
    password: string;
}) => {
    const { data: response } = await api.post('/users/register', data);
    return response;
};

export const resetPassword = async (data: {
    email: string;
    otp: string;
    newPassword: string;
}) => {
    const { data: response } = await api.post('/users/reset-password', data);
    return response;
};

export const login = async (email: string, password: string) => {
    const { data } = await api.post('/users/login', { email, password });
    console.log('Login response:', data); // Debug
    return data; // { accessToken, user }
};

export const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/users/register', { name, email, password });
    return data;
};

export const logout = async () => {
    const { data } = await api.post('/users/logout');
    return data;
};