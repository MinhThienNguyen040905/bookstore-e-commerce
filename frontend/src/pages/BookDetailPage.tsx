import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { BookDetailCard } from '@/components/book/BookDetailCard';
import { BookReviews } from '@/components/book/BookReviews';
import { useParams } from 'react-router-dom';
import { useBookDetail } from '@/hooks/useBooks';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Book } from 'lucide-react';

export default function BookDetailPage() {
    const { id } = useParams<{ id: string }>();
    const bookId = Number(id);
    const { data: book, isLoading, error } = useBookDetail(bookId);

    if (isLoading) return <LoadingSpinner />;
    if (error || !book) return <p className="text-center py-10">Không tìm thấy sách!</p>;
    return (
        <>
            <Header />
            <BookDetailCard book={book} />
            <BookReviews reviews={book.reviews} className="mt-10" />

            <Footer />


        </>
    );
}