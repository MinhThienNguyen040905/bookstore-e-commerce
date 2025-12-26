// src/components/book/BookCard.tsx
import { useAddToCart } from '@/hooks/useAddToCart';
import { Link } from 'react-router-dom';
import type { CardBook } from '@/types/book';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react'; // Dùng Lucide thay cho Material Symbols

interface BookCardProps {
    book: CardBook;
    className?: string;
}

export function BookCard({ book, className }: BookCardProps) {
    const addMutation = useAddToCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addMutation.mutate({ book, quantity: 1 });
    };

    // Giả lập rating (vì API CardBook hiện tại chưa có field rating, bạn có thể bổ sung sau)
    const rating = 4.5;

    return (
        <Link to={`/book/${book.book_id}`} className="block h-full">
            <div className={cn(
                "flex flex-col gap-3 bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 h-full",
                className
            )}>
                <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full aspect-[3/4] object-cover rounded-lg"
                />
                <div className="flex-1 flex flex-col">
                    <h3 className="text-gray-900 font-bold text-base truncate font-display">
                        {book.title}
                    </h3>
                    <p className="text-gray-500 text-sm truncate">{book.authors}</p>

                    {/* Rating Stars */}
                    <div className="flex items-center my-1 text-yellow-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={cn("w-4 h-4", star <= rating ? "fill-current" : "text-gray-300")}
                                strokeWidth={0} // Fill style style giống mẫu
                                fill={star <= rating ? "currentColor" : "none"}
                            />
                        ))}
                    </div>

                    <p className="text-gray-900 font-semibold text-lg mt-auto">
                        ${book.price.toFixed(2)}
                    </p>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#00796B]/10 text-[#00796B] hover:bg-[#00796B] hover:text-white text-sm font-bold transition-colors"
                >
                    Add to Cart
                </button>
            </div>
        </Link>
    );
}