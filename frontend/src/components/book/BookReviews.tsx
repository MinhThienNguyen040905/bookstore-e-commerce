// src/components/book/BookReviews.tsx
import { useState } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Review } from '@/types/Review';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview } from '@/api/reviewApi';
import { showToast } from '@/lib/toast';

interface BookReviewsProps {
    bookId: number;
    reviews: Review[];
    className?: string;
}

export function BookReviews({ bookId, reviews, className }: BookReviewsProps) {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // State cho form review
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);

    // Mutation gửi đánh giá
    const reviewMutation = useMutation({
        mutationFn: createReview,
        onSuccess: () => {
            showToast.success('Đánh giá của bạn đã được gửi thành công!');
            setComment('');
            setRating(5);
            // Refresh lại dữ liệu sách để hiện review mới
            queryClient.invalidateQueries({ queryKey: ['book', bookId] });
        },
        onError: (error: any) => {
            // Xử lý lỗi từ backend (đặc biệt là lỗi 403 chưa mua hàng)
            const msg = error.response?.data?.msg || error.response?.data?.message || 'Gửi đánh giá thất bại';
            showToast.error(msg);
        }
    });

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        if (!comment.trim()) {
            showToast.error('Vui lòng nhập nội dung đánh giá');
            return;
        }

        reviewMutation.mutate({
            book_id: bookId,
            rating,
            comment: comment.trim()
        });
    };

    return (
        <section className={cn("space-y-10", className)}>

            {/* --- PHẦN NHẬP ĐÁNH GIÁ (REVIEW FORM) --- */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <h3 className="text-xl font-bold text-stone-900 mb-4">Viết đánh giá của bạn</h3>

                {!user ? (
                    <div className="text-center py-6 bg-stone-50 rounded-lg">
                        <p className="text-stone-600 mb-3">Vui lòng đăng nhập để viết đánh giá cho sản phẩm này.</p>
                        <Button onClick={() => navigate('/login', { state: { from: location.pathname } })} variant="outline">
                            Đăng nhập ngay
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        {/* Star Rating Input */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-stone-700">Đánh giá:</span>
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={cn(
                                                "w-6 h-6 transition-colors",
                                                star <= (hoveredRating || rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-stone-300"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                            <span className="text-sm text-stone-500 ml-2">
                                {rating === 5 ? 'Tuyệt vời' : rating === 4 ? 'Tốt' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Tệ' : 'Rất tệ'}
                            </span>
                        </div>

                        {/* Comment Input */}
                        <Textarea
                            placeholder="Chia sẻ cảm nghĩ của bạn về cuốn sách này..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[100px] bg-stone-50 border-stone-200 focus:bg-white transition-colors"
                        />

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="bg-[#00796B] hover:bg-[#00695C] text-white font-bold"
                                disabled={reviewMutation.isPending}
                            >
                                {reviewMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" /> Gửi đánh giá
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </div>

            {/* --- DANH SÁCH ĐÁNH GIÁ --- */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#2F4F4F]">
                    Đánh giá từ khách hàng ({reviews.length})
                </h2>

                {reviews.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground italic bg-stone-50 rounded-lg">
                        Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {reviews.map((review) => (
                            <div
                                key={review.review_id}
                                className="flex gap-4 p-5 bg-white rounded-xl border border-stone-100 shadow-sm transition-shadow hover:shadow-md"
                            >
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <img
                                        src={review.user?.avatar || `https://ui-avatars.com/api/?name=${review.user?.name || 'User'}&background=random`}
                                        alt={review.user?.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-stone-100"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-stone-900">{review.user?.name || 'Người dùng ẩn danh'}</h3>
                                        <time className="text-xs text-stone-400">
                                            {format(new Date(review.review_date), 'dd/MM/yyyy HH:mm')}
                                        </time>
                                    </div>

                                    {/* Rating Display */}
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={cn(
                                                    "w-4 h-4",
                                                    star <= review.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-200"
                                                )}
                                            />
                                        ))}
                                    </div>

                                    {/* Comment */}
                                    <p className="text-stone-600 leading-relaxed text-sm">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}