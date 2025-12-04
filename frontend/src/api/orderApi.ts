// src/api/orderApi.ts
import api from './axios';

export interface PromoCheckBody {
    code: string;
    total_price: number;
}

export interface PromoResponse {
    code: string;
    discount_percent: string;
    discount_amount: number;
    min_amount: string;
    expiry_date: string;
    final_price: number;
    message: string;
}

export interface CreateOrderBody {
    promo_code?: string;
    payment_method: 'paypal' | 'cash_on_delivery' | 'credit_card';
    address: string;
    phone: string;
}

export interface OrderResponse {
    order_id: number;
    total_price: string;
    status: string;
    payment_method: string;
    address: string;
    phone: string;
    PromoCode?: { code: string; discount_percent: string };
    OrderItems: Array<{
        book_id: number;
        quantity: number;
        price: string;
        Book: {
            title: string;
            cover_image: string;
        };
    }>;
}

export const checkPromoCode = async (body: PromoCheckBody) => {
    const { data } = await api.post('/promos/by-code', body);
    return data; // { success: true, data: PromoResponse }
};

export const createOrder = async (body: CreateOrderBody) => {
    const { data } = await api.post('/orders', body);
    return data;
};