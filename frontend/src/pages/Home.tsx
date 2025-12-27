// src/pages/Home.tsx
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { BookCard } from '@/components/book/BookCard';
import { useNewReleasesBooks, useTopRatedBooks } from '@/hooks/useBooks';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function Home() {
    // Chúng ta sử dụng Top Rated làm Bestsellers
    const { data: topRatedBooks, isLoading, error } = useTopRatedBooks();

    if (isLoading) return <LoadingSpinner />;
    if (error) return <p className="text-center py-10">Error loading books</p>;

    return (
        <>
            <Header />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="w-full">
                    <div className="relative w-full">
                        <div
                            className="flex min-h-[60vh] max-h-[720px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-4 text-center"
                            style={{
                                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://images.unsplash.com/photo-1507842217121-9e93ca041ecc?q=80&w=2070&auto=format&fit=crop")`
                            }}
                        >
                            <div className="flex flex-col gap-4 max-w-4xl">
                                <h1 className="text-white text-5xl font-display font-bold leading-tight md:text-7xl">
                                    Discover Your Next Adventure
                                </h1>
                                <p className="text-white/90 text-lg font-normal leading-normal md:text-xl">
                                    Thousands of books at your fingertips
                                </p>
                            </div>
                            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-[#00796B] text-white text-base font-bold tracking-wide hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg border-none">
                                Shop Now
                            </button>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

                    {/* Featured Categories */}
                    <section className="mb-12 sm:mb-20">
                        <h2 className="text-[#2F4F4F] text-3xl font-bold font-display mb-8 px-2">
                            Featured Categories
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                            {/* Hardcode Category Data cho giống mẫu */}
                            {[
                                { name: "Fiction", img: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&q=80&w=800" },
                                { name: "Non-Fiction", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800" },
                                { name: "Children's", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800" },
                                { name: "Sci-Fi", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800" }
                            ].map((cat, idx) => (
                                <div key={idx} className="flex flex-col gap-3 group cursor-pointer">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl overflow-hidden transform group-hover:scale-105 transition-transform duration-300 shadow-md"
                                        style={{ backgroundImage: `url("${cat.img}")` }}
                                    ></div>
                                    <div className="text-center">
                                        <p className="text-[#2F4F4F] text-lg font-medium leading-normal font-display">{cat.name}</p>
                                        <p className="text-[#00796B] text-sm font-semibold">Explore</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Bestsellers (Using Top Rated Books) */}
                    <section className="mb-12 sm:mb-20">
                        <h2 className="text-[#2F4F4F] text-3xl font-bold font-display mb-8 px-2">
                            Bestsellers
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                            {topRatedBooks?.slice(0, 10).map((book) => (
                                <BookCard key={book.book_id} book={book} />
                            ))}
                        </div>
                    </section>

                    {/* Testimonials */}
                    <section className="bg-white rounded-xl p-8 sm:p-12 mb-12 sm:mb-20 shadow-sm border border-gray-100">
                        <h2 className="text-[#2F4F4F] text-3xl font-bold font-display mb-8 text-center">
                            What Our Readers Say
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: "Sarah L.", text: "An amazing selection and fast delivery! I found exactly what I was looking for.", img: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
                                { name: "Mark T.", text: "The website is so easy to navigate. Found my new favorite author in the Bestsellers section!", img: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
                                { name: "Jessica P.", text: "Excellent customer service. I had a query about my order and they responded within hours.", img: "https://i.pravatar.cc/150?u=a04258114e29026302d" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg bg-[#E0F7FA]/30">
                                    <img src={item.img} alt={item.name} className="w-20 h-20 rounded-full mb-4 border-2 border-[#00796B]" />
                                    <p className="text-gray-600 italic mb-4">"{item.text}"</p>
                                    <p className="font-bold text-[#2F4F4F] font-display">{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Newsletter Signup */}
                    <section className="text-center bg-[#E0F7FA] p-8 sm:p-12 rounded-xl">
                        <h2 className="text-[#2F4F4F] text-3xl font-bold font-display mb-2">Join Our Newsletter</h2>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Subscribe for the latest updates, new arrivals, and exclusive offers delivered straight to your inbox.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input
                                className="w-full flex-grow rounded-full h-12 px-5 border border-gray-300 bg-white focus:ring-2 focus:ring-[#00796B] focus:outline-none"
                                placeholder="Enter your email address"
                                type="email"
                            />
                            <button
                                className="flex items-center justify-center rounded-full h-12 px-8 bg-[#00796B] text-white font-bold hover:bg-opacity-90 transition-colors shadow-md"
                                type="submit"
                            >
                                Subscribe
                            </button>
                        </form>
                    </section>

                </div>
            </main>
            <Footer />
        </>
    );
}