// src/components/book/BookDetailCard.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Minus, Plus, ShoppingCart, Heart } from 'lucide-react';
import type { Book } from '@/types/book';
import { useAddToCart } from '@/hooks/useAddToCart';
import { cn } from '@/lib/utils';

export function BookDetailCard({ book }: { book: Book }) {
    const [quantity, setQuantity] = useState(1);
    const addMutation = useAddToCart();

    // Giả lập ảnh gallery
    const images = [book.cover_image, book.cover_image, book.cover_image, book.cover_image];
    const [activeImage, setActiveImage] = useState(images[0]);

    const handleAddToCart = () => {
        addMutation.mutate({ book, quantity });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* LEFT: Image Gallery */}
            <div className="flex flex-col gap-4">
                {/* Main Image */}
                <div
                    className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl shadow-md transition-transform duration-300 hover:scale-105 border border-gray-100"
                    style={{ backgroundImage: `url("${activeImage}")` }}
                ></div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            onClick={() => setActiveImage(img)}
                            className={cn(
                                "w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg cursor-pointer transition-all",
                                activeImage === img
                                    ? "border-2 border-[#00796B] opacity-100" // Đổi sang màu Teal
                                    : "opacity-70 hover:opacity-100 border border-transparent"
                            )}
                            style={{ backgroundImage: `url("${img}")` }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* RIGHT: Product Details */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[#2F4F4F] text-4xl lg:text-5xl font-bold font-display leading-tight tracking-tight">
                        {book.title}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        by <span className="text-[#00796B] font-medium hover:underline cursor-pointer">{book.authors}</span>
                    </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={cn("w-5 h-5", star <= book.avg_rating ? "fill-current" : "text-gray-300")}
                                fill={star <= book.avg_rating ? "currentColor" : "none"}
                                strokeWidth={0}
                            />
                        ))}
                    </div>
                    <a href="#reviews" className="text-slate-500 text-sm hover:text-[#00796B] underline-offset-4 hover:underline">
                        ({book.reviews.length} reviews)
                    </a>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                    <span className="text-[#2F4F4F] text-4xl font-bold font-display">
                        ${book.price.toFixed(2)}
                    </span>
                    <span className="text-red-400 text-xl line-through">
                        ${(book.price * 1.2).toFixed(2)}
                    </span>
                </div>

                <p className="text-slate-600 leading-relaxed text-base">
                    {book.description}
                </p>

                {/* Metadata */}
                <ul className="text-slate-600 space-y-2 text-sm">
                    <li className="flex gap-2"><strong className="font-medium text-[#2F4F4F] w-32">ISBN:</strong> {book.isbn}</li>
                    <li className="flex gap-2"><strong className="font-medium text-[#2F4F4F] w-32">Stock:</strong> {book.stock} available</li>
                    <li className="flex gap-2"><strong className="font-medium text-[#2F4F4F] w-32">Publisher:</strong> {book.publisher}</li>
                    <li className="flex gap-2"><strong className="font-medium text-[#2F4F4F] w-32">Publication Date:</strong> {new Date(book.release_date).toLocaleDateString()}</li>
                </ul>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-200">
                    {/* Quantity */}
                    <div className="flex items-center border border-slate-300 rounded-lg h-12">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-4 text-slate-500 hover:text-[#00796B] h-full"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <input
                            className="w-12 text-center bg-transparent border-x border-slate-300 text-[#2F4F4F] font-medium h-full focus:outline-none"
                            type="text"
                            value={quantity}
                            readOnly
                        />
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-4 text-slate-500 hover:text-[#00796B] h-full"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Add to Cart */}
                    <Button
                        onClick={handleAddToCart}
                        className="w-full flex-1 flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-[#00796B] hover:bg-[#00695C] text-white font-bold text-base shadow-sm border-none"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                    </Button>

                    {/* Wishlist */}
                    <button className="w-full sm:w-auto flex items-center justify-center rounded-lg h-12 px-4 border border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-[#00796B] transition-colors">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>

                <Button className="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-[#00796B]/10 hover:bg-[#00796B]/20 text-[#00796B] font-bold border-none shadow-none">
                    Buy Now
                </Button>
            </div>
        </div>
    );
}