// src/pages/Home.tsx
import { BookSlider } from '@/components/book/BookSlider';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Truck, Star, BookOpen } from 'lucide-react';
import { useNewReleasesBooks, useTopRatedBooks } from '@/hooks/useBooks';
import { LoadingSpinner } from '@/components/common/LoadingsSpinner';

const featuredAuthor = {
    name: "Eric-Emmanuel Schmitt",
    bio: "Eric-Emmanuel Schmitt has been awarded more than 20 literary prizes and distinctions, and in 2001 he received the title of Chevalier des Arts et des Lettres. His books have been translated into over 40 languages.",
    image: "/author.jpg",
    books: 30,
};

// const books = [
//     { id: 1, title: "Financial Feminist", author: "Tori Dunlap", price: 20.46, cover: "/HowToWinFriends&InfluencePeople.jpg" },
//     { id: 2, title: "No More Police", author: "Andrea Ritchie", price: 17.66, cover: "/HowToWinFriends&InfluencePeople.jpg" },
//     { id: 1, title: "Financial Feminist", author: "Tori Dunlap", price: 20.46, cover: "/HowToWinFriends&InfluencePeople.jpg" },
//     { id: 2, title: "No More Police", author: "Andrea Ritchie", price: 17.66, cover: "/HowToWinFriends&InfluencePeople.jpg" },
//     { id: 1, title: "Financial Feminist", author: "Tori Dunlap", price: 20.46, cover: "/HowToWinFriends&InfluencePeople.jpg" },
//     { id: 2, title: "No More Police", author: "Andrea Ritchie", price: 17.66, cover: "/HowToWinFriends&InfluencePeople.jpg" },
//     { id: 1, title: "Financial Feminist", author: "Tori Dunlap", price: 20.46, cover: "/HowToWinFriends&InfluencePeople.jpg" },
//     { id: 2, title: "No More Police", author: "Andrea Ritchie", price: 17.66, cover: "/HowToWinFriends&InfluencePeople.jpg" },
//     { id: 1, title: "Financial Feminist", author: "Tori Dunlap", price: 20.46, cover: "/HowToWinFriends&InfluencePeople.jpg" },
//     { id: 2, title: "No More Police", author: "Andrea Ritchie", price: 17.66, cover: "/HowToWinFriends&InfluencePeople.jpg" }
//     // ... thêm 10+ sách
// ];

export default function Home() {

    const { data: newReleasesBooks, isLoading: loadingNewRelease, error: errorNewReleases } = useNewReleasesBooks();
    const { data: topRatedBooks, isLoading: loadingTopRated, error: errorTopRated } = useTopRatedBooks();

    if (loadingNewRelease || loadingTopRated) return <LoadingSpinner />;  // Hoặc full page loader
    if (errorNewReleases || errorTopRated) return <p>Error loading books: {(errorNewReleases || errorTopRated)?.message}</p>;
    return (
        <>
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Author Section */}
                <section className="mb-16">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Author of august</span>
                            <h1 className="text-4xl font-bold mt-2">{featuredAuthor.name}</h1>
                            <p className="text-muted-foreground mt-4">{featuredAuthor.bio}</p>
                            <Button className="mt-6 bg-purple-600 hover:bg-purple-700">
                                View his books
                            </Button>
                        </div>
                        <div className="relative">
                            <img src="/How-to-Win-Friends-Influence-People-Book-summary.png" alt="Book" className="rounded-lg shadow-xlcd" />
                            <div className="absolute -top-4 -right-4 bg-purple-600 text-white p-4 rounded-lg">
                                <p className="text-sm">AUTOGRAPHED BOOKS + 30% DISCOUNT</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="flex items-center gap-3">
                        <Truck className="w-8 h-8 text-purple-600" />
                        <div>
                            <h3 className="font-semibold">Free shipping over 50$</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Star className="w-8 h-8 text-purple-600" />
                        <div>
                            <h3 className="font-semibold">Save with loyalty points</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-purple-600" />
                        <div>
                            <h3 className="font-semibold">Read a few pages</h3>
                        </div>
                    </div>
                </section>

                {/* Book Sliders */}
                <BookSlider title="Selected for you" books={newReleasesBooks || []} />
                <div className='h-20'></div>
                <BookSlider title="You must buy it now" books={topRatedBooks || []} />

                {/* Newsletter */}
                <section className="my-16 bg-gray-50 rounded-2xl p-8 flex gap-8">
                    <div className="grid md:grid-rows-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Did you know us?</h2>
                            <p className="text-muted-foreground">
                                We are about books and our purpose is to show you the book who can change your life
                                or distract you from the real world in a better one.
                                If you are about books, you must subscribe to our newsletter.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Input placeholder="Your name" />
                            <Input placeholder="Your e-mail" type="email" />
                            <Button className="bg-purple-600 hover:bg-purple-700">Subscribe</Button>
                        </div>
                    </div>
                    <div className="mt-8">
                        <img src="/The-map-of-Ho-chi-Minh-Citys-District-1.jpg" alt="Map" className="max-w-150 max-h-150  rounded-lg" />
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}