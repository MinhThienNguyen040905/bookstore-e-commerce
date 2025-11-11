// src/pages/BookDetailPage.tsx
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { BookDetailCard } from '@/components/book/BookDetailCard';
import { BookReviews } from '@/components/book/BookReviews';
import { useParams, Link } from 'react-router-dom';
import { useBookDetail } from '@/hooks/useBooks';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BookDetailPage() {
    const { id } = useParams<{ id: string }>();
    const bookId = Number(id);
    const { data: book, isLoading, error } = useBookDetail(bookId);

    if (isLoading) return <LoadingSpinner />;
    if (error || !book) return <p className="text-center py-10">Không tìm thấy sách!</p>;

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-6">
                    <Link to="/">
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại
                        </Button>
                    </Link>

                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <BookDetailCard book={book} />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <BookReviews reviews={book.reviews} />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}