// src/api/paymentApi.ts
import api from './axios';

export interface CreatePaymentUrlBody {
    orderId: number;
    amount: number;
}

export interface CreatePaymentUrlResponse {
    paymentUrl: string;
}

/**
 * Tạo URL thanh toán VNPay
 * @param body - Object chứa orderId và amount
 * @returns Object chứa paymentUrl để redirect
 */
export const createVNPayPaymentUrl = async (body: CreatePaymentUrlBody) => {
    const { data } = await api.post<{ success: boolean; data: CreatePaymentUrlResponse }>('/payment/create_payment_url', body);
    return data.data; // Trả về { paymentUrl: "..." }
};

