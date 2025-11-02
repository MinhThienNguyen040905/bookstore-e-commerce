// src/components/layout/Header.tsx
import { Search, ShoppingCart, Menu, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { Link } from 'react-router-dom';

export function Header() {
    const itemCount = useCartStore((state) => state.getTotalItems());

    return (
        <header className="border-b">
            <div className="container mx-auto px-4">
                {/* Top bar */}
                <div className="flex items-center justify-between py-2 text-sm">
                    <div className="flex items-center gap-4">
                        <span>B-World</span>
                        <span className="hidden sm:inline">We love books</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/privacy" className="hidden sm:inline">Privacy policy</Link>
                        <Link to="/warranty" className="hidden sm:inline">Warranty</Link>
                        <Link to="/shipping" className="hidden sm:inline">Shipping</Link>
                        <Link to="/returns" className="hidden sm:inline">Returns</Link>
                        <div className="flex items-center gap-1">
                            <ShoppingCart className="w-4 h-4" />
                            <span className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs">
                                {itemCount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main nav */}
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-8 flex-1">
                        <Link to="/" className="text-2xl font-bold">B-World</Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/must-read">The must read</Link>
                            <Link to="/news">News</Link>
                            <Link to="/promotion">Promotion of the mount</Link>
                            <Link to="/publishers">Publishers</Link>
                            <Link to="/newsletter">Subscribe to the newsletter</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Type any book here"
                                className="pl-10 w-64"
                            />
                        </div>
                        <Button >
                            <Phone className="w-4 h-4" />
                            +445 87 999 000
                        </Button>
                        <Button>Request a call</Button>
                    </div>
                </div>
            </div>
        </header>
    );
}