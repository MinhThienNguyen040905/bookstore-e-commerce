// src/pages/ShopPage.tsx
import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { ShopSidebar } from '@/components/shop/ShopSidebar';
import { useShopBooks } from '@/hooks/useShop';
import { Button } from '@/components/ui/button';
import { Filter, ShoppingCart, Heart, ChevronLeft, ChevronRight, Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';


export default function ShopPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Parse params từ URL
    const params = {
        page: Number(searchParams.get('page')) || 1,
        limit: 12,
        keyword: searchParams.get('keyword') || '',
        sort: searchParams.get('sort') || '',
        min_price: Number(searchParams.get('min_price')) || undefined,
        max_price: Number(searchParams.get('max_price')) || undefined,
        genre: searchParams.get('genre') || '',
        author: searchParams.get('author') || '',
        rating: Number(searchParams.get('rating')) || undefined,
    };

    const { data, isLoading } = useShopBooks(params);
    const { books = [], pagination } = data || {};

    const handlePageChange = (newPage: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', newPage.toString());
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="font-display bg-[#F8F9FA] text-[#333333] min-h-screen flex flex-col">
            <Header />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* SIDEBAR - DESKTOP */}
                    <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
                        <div className="sticky top-24">
                            <ShopSidebar />
                        </div>
                    </aside>

                    {/* MOBILE FILTER DRAWER OVERLAY */}
                    {isMobileFilterOpen && (
                        <div className="fixed inset-0 z-50 flex lg:hidden">
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)}></div>
                            <div className="relative bg-white w-80 h-full p-6 overflow-y-auto animate-in slide-in-from-left duration-300">
                                <ShopSidebar onClose={() => setIsMobileFilterOpen(false)} />
                            </div>
                        </div>
                    )}

                    {/* MAIN CONTENT */}
                    <div className="flex-1">

                        {/* Breadcrumbs & Mobile Filter Toggle */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex flex-wrap gap-2 text-sm text-stone-500">
                                <Link to="/" className="hover:text-[#008080]">Home</Link>
                                <span>/</span>
                                <span className="text-stone-900 font-medium">Shop</span>
                            </div>

                            <Button
                                variant="outline"
                                className="lg:hidden gap-2 border-stone-300 text-stone-700"
                                onClick={() => setIsMobileFilterOpen(true)}
                            >
                                <Filter className="w-4 h-4" /> Filters
                            </Button>
                        </div>

                        {/* Headline */}
                        <div className="mb-6">
                            <h2 className="text-4xl font-bold font-heading text-stone-900 tracking-tight">Explore Books</h2>
                            <p className="text-stone-500 text-sm mt-2">
                                Showing {books.length} of {pagination?.total || 0} results
                            </p>
                        </div>

                        {/* LOADING STATE */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-96 bg-stone-200 animate-pulse rounded-lg"></div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* PRODUCT GRID */}
                                {books.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {books.map((book: any) => (
                                            <div key={book.book_id} className="flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-stone-200 group hover:shadow-md transition-shadow">
                                                <div className="relative overflow-hidden aspect-[2/3]">
                                                    <img
                                                        src={book.cover_image}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <button className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-white/80 text-stone-600 hover:text-[#D9534F] transition-colors">
                                                        <Heart className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <div className="p-4 flex flex-col flex-grow">
                                                    <Link to={`/book/${book.book_id}`}>
                                                        <h3 className="text-lg font-bold font-heading leading-tight mb-1 line-clamp-2 hover:text-[#008080] transition-colors">
                                                            {book.title}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-sm text-stone-500 mb-2">{book.authors}</p>

                                                    {/* Rating Star */}
                                                    <div className="flex items-center text-yellow-500 mb-3">
                                                        <Star className="w-4 h-4 fill-current" />
                                                        <span className="text-sm text-stone-500 ml-1 font-medium">{book.avg_rating}</span>
                                                    </div>

                                                    <div className="flex items-baseline gap-2 mt-auto">
                                                        <span className="text-xl font-bold text-[#D9534F]">
                                                            ${book.price.toLocaleString('en-US')}
                                                        </span>
                                                    </div>

                                                    <Button className="mt-4 w-full bg-[#008080] text-white font-bold hover:bg-[#006666]">
                                                        <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-xl border border-stone-200">
                                        <p className="text-stone-500 text-lg">No books found matching your filters.</p>
                                        <Button
                                            variant="link"
                                            onClick={() => setSearchParams({})}
                                            className="text-[#008080] mt-2"
                                        >
                                            Clear all filters
                                        </Button>
                                    </div>
                                )}

                                {/* PAGINATION */}
                                {pagination && pagination.totalPages > 1 && (
                                    <nav className="flex items-center justify-center pt-10 mt-6 border-t border-stone-200">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Button
                                                variant="outline" size="icon"
                                                onClick={() => handlePageChange(params.page - 1)}
                                                disabled={params.page === 1}
                                                className="h-9 w-9 border-stone-300"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>

                                            {/* Simple Page Indicator */}
                                            <span className="px-4 font-medium text-stone-700">
                                                Page {params.page} of {pagination.totalPages}
                                            </span>

                                            <Button
                                                variant="outline" size="icon"
                                                onClick={() => handlePageChange(params.page + 1)}
                                                disabled={params.page === pagination.totalPages}
                                                className="h-9 w-9 border-stone-300"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </nav>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}