import { useAddToCart } from '@/hooks/useAddToCart';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import type { CardBook } from '@/types/book';
import { cn } from '@/lib/utils';

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

    return (
        <Link to={`/book/${book.book_id}`} className="block group">
            <div className={cn("flex flex-col", className)}>
                <div className="relative overflow-hidden rounded-lg bg-gray-100">
                    <img
                        src={book.cover_image}
                        alt={book.title}
                        className="aspect-[3/4] w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Heart className="w-4 h-4" />
                    </button>
                </div>

                <div className="mt-3 flex flex-col gap-1">
                    <h3 className="font-medium text-sm line-clamp-2">{book.title}</h3>
                    <p className="text-xs text-muted-foreground">{book.authors}</p>
                    <p className="font-semibold">${book.price.toFixed(2)}</p>
                </div>

                <Button
                    onClick={handleAddToCart}
                    className="mt-3 w-full bg-purple-600 hover:bg-purple-700"
                >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to cart
                </Button>
            </div>
        </Link>
    );
}