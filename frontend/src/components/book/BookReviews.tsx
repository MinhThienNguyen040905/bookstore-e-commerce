// src/components/book/BookReviews.tsx
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Review } from '@/types/Review';

interface BookReviewsProps {
    reviews: Review[];
    className?: string;
}

export function BookReviews({ reviews, className }: BookReviewsProps) {
    if (!reviews || reviews.length === 0) {
        return (
            <div className={cn("py-8 text-center text-muted-foreground", className)}>
                Chưa có đánh giá nào.
            </div>
        );
    }

    return (
        <section className={cn("space-y-6", className)}>
            <h2 className="text-2xl font-bold">Đánh giá từ khách hàng</h2>

            <div className="space-y-6">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <img
                                src={review.user.avatar}
                                alt={review.user.name}
                                className="w-12 h-12 rounded-full object-cover border border-gray-300"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{review.user.name}</h3>
                                <time className="text-sm text-muted-foreground">
                                    {format(new Date(review.date), 'dd/MM/yyyy')}
                                </time>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={cn(
                                            "w-4 h-4",
                                            star <= review.rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        )}
                                    />
                                ))}
                                <span className="ml-2 text-sm font-medium">{review.rating}.0</span>
                            </div>

                            {/* Comment */}
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}