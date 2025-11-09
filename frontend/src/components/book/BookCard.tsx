// src/components/book/BookCard.tsx
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/features/cart/useCartStore';
import type { CardBook } from '@/types/book';
import { cn } from '@/lib/utils';

interface BookCardProps {
    book: CardBook;
    className?: string;
}

export function BookCard({ book, className }: BookCardProps) {
    const addToCart = useCartStore((state) => state.addToCart);

    return (
        <div className={cn("group relative flex flex-col", className)}>
            <div className="relative overflow-hidden rounded-lg bg-gray-100">
                <img
                    src={book.cover}
                    alt={book.title}
                    className="aspect-[3/4] w-full object-cover transition-transform group-hover:scale-105"
                />
                {/* {book.discount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{book.discount}%
                    </span>
                )} */}
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-4 h-4" />
                </button>
            </div>

            <div className="mt-3 flex flex-col gap-1">
                <h3 className="font-medium text-sm line-clamp-2">{book.title}</h3>
                <p className="text-xs text-muted-foreground">{book.author}</p>
                <p className="font-semibold">${book.price.toFixed(2)}</p>
            </div>

            <Button
                onClick={() => addToCart(book)}
                className="mt-3 w-full bg-purple-600 hover:bg-purple-700"
            >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to cart
            </Button>
        </div>
    );
}