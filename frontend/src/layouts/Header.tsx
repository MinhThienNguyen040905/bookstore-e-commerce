// src/components/layout/Header.tsx
import { Search, ShoppingCart, Menu, Phone, LogOut, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/features/cart/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
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
    const itemCount = useCartStore((state) => state.getTotalItems());
    const { user, logout } = useAuthStore();

    return (
        <header className="border-b bg-white">
            <div className="container mx-auto px-4">
                {/* Top bar */}
                <div className="flex items-center justify-between py-2 text-sm">
                    <div className="flex items-center gap-4">
                        <span className="font-semibold">B-World</span>
                        <span className="hidden sm:inline text-muted-foreground">We love books</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/privacy" className="hidden sm:inline text-muted-foreground hover:text-foreground">Privacy</Link>
                        <Link to="/shipping" className="hidden sm:inline text-muted-foreground hover:text-foreground">Shipping</Link>
                        <div className="flex items-center gap-1">
                            <ShoppingCart className="w-4 h-4" />
                            <span className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                                {itemCount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main nav */}
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-8 flex-1">
                        <Link to="/" className="text-2xl font-bold text-purple-600">B-World</Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/must-read" className="hover:text-purple-600 transition">Must Read</Link>
                            <Link to="/promotion" className="hover:text-purple-600 transition">Promotion</Link>
                            <Link to="/newsletter" className="hover:text-purple-600 transition">Newsletter</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Tìm sách..."
                                className="pl-10 w-64"
                            />
                        </div>

                        {/* Auth */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to="/profile" className="flex items-center">
                                            <User className="mr-2 h-4 w-4" />
                                            Hồ sơ
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logout} className="text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button asChild>
                                <Link to="/login">Đăng nhập</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}