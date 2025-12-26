// src/layouts/Header.tsx
import { Search, ShoppingCart, User, BookOpen } from 'lucide-react';
import { useCartQuery } from '@/hooks/useCartQuery';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
    useCartQuery();
    const { data: cartData } = useCartQuery();
    const itemCount = cartData?.total_items ?? 0;
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between">

                    {/* Logo Section */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <BookOpen className="w-8 h-8 text-[#00796B]" />
                            <h2 className="text-xl font-bold font-display tracking-tight text-[#2F4F4F] group-hover:text-[#00796B] transition-colors">
                                BookStore
                            </h2>
                        </Link>

                        {/* Nav Links - Hidden on Mobile */}
                        <nav className="hidden md:flex items-center gap-6">
                            {['Home', 'Categories', 'Bestsellers', 'Blog', 'About'].map((item) => (
                                <Link
                                    key={item}
                                    to="/"
                                    className="text-sm font-medium text-gray-700 hover:text-[#00796B] transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Right Section: Search & Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="hidden sm:flex relative w-full max-w-xs">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search books..."
                                    className="w-64 pl-10 rounded-full border-gray-300 focus-visible:ring-[#00796B]"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {/* User Menu */}
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatar || ''} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link to="/login">
                                    <Button variant="ghost" size="icon" className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">
                                        <User className="w-5 h-5" />
                                    </Button>
                                </Link>
                            )}

                            {/* Cart */}
                            <Link to="/cart">
                                <Button variant="ghost" size="icon" className="relative rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">
                                    <ShoppingCart className="w-5 h-5" />
                                    {itemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#00796B] text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
                                            {itemCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}