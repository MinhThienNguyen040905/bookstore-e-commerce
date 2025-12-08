
import { Button } from '@/components/ui/button';
import { Star, Plus, Minus } from 'lucide-react';

import type { Book } from '@/types/book';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAddToCart } from '@/hooks/useAddToCart';


export function BookDetailCard({ book }: { book: Book }) {
    const [quantity, setQuantity] = useState(1);

    const addMutation = useAddToCart();

    const handleAddToCart = () => {
        addMutation.mutate({ book, quantity });
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="grid md:grid-cols-2 gap-12">
                {/* LEFT: Cover */}
                <div className="relative">
                    <div className="sticky top-8">
                        <div className="relative group">
                            <img
                                src={book.cover_image}
                                alt={book.title}
                                className="w-full rounded-lg shadow-2xl object-cover border border-gray-200"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT: Info */}
                <div className="space-y-8">
                    {/* Title & Author */}
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                            {book.title}
                        </h1>
                        <p className="text-xl text-purple-700 mt-2 font-medium">
                            {book.authors}
                        </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-3">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "w-5 h-5",
                                        star <= Math.floor(book.avg_rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : star === Math.ceil(book.avg_rating) && book.avg_rating % 1 !== 0
                                                ? "fill-yellow-400/50 text-yellow-400"
                                                : "text-gray-300"
                                    )}
                                />
                            ))}
                        </div>
                        <span className="text-lg font-medium">{book.avg_rating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                            ({book.reviews.length} đánh giá)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="text-5xl font-bold text-purple-700">
                        ${book.price.toFixed(2)}
                    </div>

                    {/* Description */}
                    <div className="prose prose-purple max-w-none">
                        <p className="text-gray-700 leading-relaxed">{book.description}</p>
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="flex items-center gap-6 py-6">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-3 hover:bg-gray-100 transition"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-6 font-medium text-lg">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="p-3 hover:bg-gray-100 transition"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <Button
                            onClick={handleAddToCart}
                            size="lg"
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg py-7"
                        >
                            Add to cart
                        </Button>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Book Details */}
                    <div className="grid grid-cols-2 gap-6 text-sm">
                        <div>
                            <span className="text-purple-600 font-medium">Publisher:</span>
                            <span className="ml-2 text-gray-700">{book.publisher}</span>
                        </div>
                        <div>
                            <span className="text-purple-600 font-medium">Release date:</span>
                            <span className="ml-2 text-gray-700">
                                {new Date(book.release_date).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <div>
                            <span className="text-purple-600 font-medium">ISBN:</span>
                            <span className="ml-2 text-gray-700">{book.isbn}</span>
                        </div>
                        <div>
                            <span className="text-purple-600 font-medium">In stock:</span>
                            <span className="ml-2 text-gray-700">{book.stock} cuốn</span>
                        </div>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {book.genres.map((g) => (
                            <span
                                key={g.genre_id}
                                className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                            >
                                {g.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}