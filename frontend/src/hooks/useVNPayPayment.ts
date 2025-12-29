// src/hooks/useVNPayPayment.ts
import { useMutation } from '@tanstack/react-query';
import { createVNPayPaymentUrl, type CreatePaymentUrlBody } from '@/api/paymentApi';
import { toast } from 'sonner';

/**
 * Hook để tạo URL thanh toán VNPay và redirect
 */
export const useVNPayPayment = () => {
    return useMutation({
        mutationFn: (body: CreatePaymentUrlBody) => createVNPayPaymentUrl(body),
        onSuccess: (data) => {
            // Redirect đến VNPay payment page
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                toast.error('Không nhận được URL thanh toán');
            }
        },
        onError: (error: any) => {
            console.error('Lỗi tạo URL thanh toán VNPay:', error);
            toast.error(error?.response?.data?.message || 'Không thể tạo URL thanh toán');
        }
    });
};

