// src/components/book/BookDetailCard.tsx
import { Button } from '@/components/ui/button';
import { Star, Plus, Minus, ArrowRight, BookOpen } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import type { Book } from '@/types/book';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BookDetailCardProps {
    book: Book & {
        description: string;
        publisher: string;
        publishDate: string;
        language: string;
        readingAge: string;
        pages: number;
        dimensions: string;
        rating: number;
        bestseller?: boolean;
    };
}

export function BookDetailCard({ book }: BookDetailCardProps) {
    const [quantity, setQuantity] = useState(1);
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(book);
        }
        // Optional: Show toast
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="grid md:grid-cols-2 gap-12">
                {/* LEFT: Cover */}
                <div className="relative">
                    <div className="sticky top-8">
                        <div className="relative group">
                            <img
                                src={book.cover}
                                alt={book.title}
                                className="w-full rounded-lg shadow-2xl object-cover border border-gray-200"
                            />
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                <span className="bg-white text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    flips a few pages
                                </span>
                                {book.bestseller && (
                                    <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                        York Times Bestseller
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Bottom tagline */}
                        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                            <p className="text-sm italic text-purple-800 flex items-center gap-2">
                                <span className="font-medium">A Brand-New Series in the</span>
                                <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                                    SHADOWHUNTER WORLD
                                </span>
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </p>
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
                            {book.author}
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
                                        star <= Math.floor(book.rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : star === Math.ceil(book.rating) && book.rating % 1 !== 0
                                                ? "fill-yellow-400/50 text-yellow-400"
                                                : "text-gray-300"
                                    )}
                                />
                            ))}
                        </div>
                        <span className="text-lg font-medium">{book.rating.toFixed(1)}</span>
                    </div>

                    {/* Price */}
                    <div className="text-5xl font-bold text-purple-700">
                        ${book.price.toFixed(2)}
                    </div>

                    {/* Description */}
                    <div className="prose prose-purple max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                            {book.description}
                        </p>
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
                            <span className="text-purple-600 font-medium">Publication date:</span>
                            <span className="ml-2 text-gray-700">{book.publishDate}</span>
                        </div>
                        <div>
                            <span className="text-purple-600 font-medium">Language:</span>
                            <span className="ml-2 text-gray-700">{book.language}</span>
                        </div>
                        <div>
                            <span className="text-purple-600 font-medium">Reading age:</span>
                            <span className="ml-2 text-gray-700">{book.readingAge}</span>
                        </div>
                        <div>
                            <span className="text-purple-600 font-medium">Print length:</span>
                            <span className="ml-2 text-gray-700">{book.pages} pages</span>
                        </div>
                        <div>
                            <span className="text-purple-600 font-medium">Dimensions:</span>
                            <span className="ml-2 text-gray-700">{book.dimensions}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}