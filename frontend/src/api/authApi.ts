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

export const login = async (email: string, password: string) => {
    const { data } = await api.post('/users/login', { email, password });
    return data.data; // { accessToken, user }
};

export const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/users/register', { name, email, password });
    return data; // backend thường trả { message: "..." } hoặc { data: ..., message: ... }
};

export const logout = async () => {
    const { data } = await api.post('/users/logout');
    return data; // { message: "Đăng xuất thành công" }
};