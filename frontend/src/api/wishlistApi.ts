// src/api/wishlistApi.ts
import api from './axios';

export const toggleWishlistApi = async (book_id: number) => {
    const { data } = await api.post('/wishlist/toggle', { book_id });
    return data;
};