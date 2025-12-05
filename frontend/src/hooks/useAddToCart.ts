// src/hooks/useAddToCart.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { addToCartApi } from '@/api/cartApi';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { useCartStore } from '@/features/cart/useCartStore';
import { showToast } from '@/lib/toast';
import type { CardBook } from '@/types/book';

export const useAddToCart = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const addToCartLocal = useCartStore((state) => state.addToCart);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (book: CardBook) => {
            if (!user) {
                navigate('/login', { state: { from: location.pathname } });
                return Promise.reject(new Error('Chưa đăng nhập'));
            }
            return addToCartApi({ book_id: book.book_id, quantity: 1 });
        },

        // Dùng onMutate để lấy được book
        onMutate: async (book) => {
            // Optimistic update: tăng ngay lập tức
            addToCartLocal(book);
            return { book };
        },

        onSuccess: () => {
            // Refetch để đồng bộ chính xác với backend
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            showToast.success('Đã thêm vào giỏ hàng');
        },

        onError: (err: any, book, context) => {
            // Nếu lỗi → rollback lại store
            showToast.error(err.message || 'Thêm vào giỏ thất bại');

            // Optional: rollback optimistic update
            // queryClient.setQueryData(['cart'], oldData);
        },
    });
};