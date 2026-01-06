// src/api/reviewApi.ts
import api from './axios';

export interface CreateReviewBody {
    book_id: number;
    rating: number;
    comment: string;
}

export const createReview = async (body: CreateReviewBody) => {
    const { data } = await api.post('/reviews', body);
    return data;
};

export const getBookReviews = async (book_id: number) => {
    const { data } = await api.get(`/reviews/book/${book_id}`);
    return data;
};

