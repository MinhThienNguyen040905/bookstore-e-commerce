// src/pages/ProfilePage.tsx
import { useState } from 'react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
    User,
    Package,
    Heart,
    MapPin,
    CreditCard,
    LogOut,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// --- MOCK DATA ---
const MOCK_ORDERS = [
    { id: '#BK1204', date: 'June 1, 2024', status: 'Delivered', total: 45.50 },
    { id: '#BK1198', date: 'May 22, 2024', status: 'Shipped', total: 28.00 },
    { id: '#BK1152', date: 'April 15, 2024', status: 'Delivered', total: 72.10 },
    { id: '#BK1101', date: 'March 5, 2024', status: 'Cancelled', total: 19.99 },
];

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'address' | 'payment'>('orders');

    // Helper để render màu badge trạng thái
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Delivered':
                return <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>;
            case 'Shipped':
                return <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Shipped</span>;
            case 'Cancelled':
                return <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>;
            default:
                return <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f5f8f8]">
            <Header />

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* SIDEBAR */}
                    <aside className="w-full lg:w-1/4 xl:w-1/5">
                        <div className="flex h-full flex-col justify-between bg-white rounded-lg shadow-sm p-4 border border-stone-200">
                            <div className="flex flex-col gap-4">
                                {/* User Info */}
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 border border-stone-100">
                                        <AvatarImage src={user?.avatar || ''} alt={user?.name} />
                                        <AvatarFallback className="bg-stone-100 text-stone-500 font-bold">
                                            {user?.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col overflow-hidden">
                                        <h1 className="text-stone-900 text-base font-bold leading-normal truncate font-display">
                                            {user?.name || 'Guest User'}
                                        </h1>
                                        <p className="text-stone-500 text-sm font-normal truncate">
                                            {user?.email || 'guest@example.com'}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-stone-200 my-2"></div>

                                {/* Navigation Menu */}
                                <nav className="flex flex-col gap-2">
                                    <SidebarItem
                                        icon={<User className="w-5 h-5" />}
                                        label="Profile"
                                        isActive={activeTab === 'profile'}
                                        onClick={() => setActiveTab('profile')}
                                    />
                                    <SidebarItem
                                        icon={<Package className="w-5 h-5" />}
                                        label="Orders"
                                        isActive={activeTab === 'orders'}
                                        onClick={() => setActiveTab('orders')}
                                    />
                                    <SidebarItem
                                        icon={<Heart className="w-5 h-5" />}
                                        label="Wishlist"
                                        isActive={activeTab === 'wishlist'}
                                        onClick={() => setActiveTab('wishlist')}
                                    />
                                    <SidebarItem
                                        icon={<MapPin className="w-5 h-5" />}
                                        label="Addresses"
                                        isActive={activeTab === 'address'}
                                        onClick={() => setActiveTab('address')}
                                    />
                                    <SidebarItem
                                        icon={<CreditCard className="w-5 h-5" />}
                                        label="Payment Methods"
                                        isActive={activeTab === 'payment'}
                                        onClick={() => setActiveTab('payment')}
                                    />
                                </nav>
                            </div>

                            {/* LOGOUT BUTTON */}
                            <div className="border-t border-stone-200 mt-4 pt-4">
                                <button
                                    onClick={() => logout()} // Gọi hàm logout từ useAuth
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-stone-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <p className="text-sm font-medium leading-normal">Logout</p>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <div className="w-full lg:w-3/4 xl:w-4/5">
                        <div className="flex flex-col gap-6">

                            {/* Heading */}
                            <div>
                                <h1 className="text-stone-900 text-4xl font-black font-display leading-tight tracking-tight">
                                    {activeTab === 'orders' ? 'My Orders' :
                                        activeTab === 'profile' ? 'My Profile' :
                                            activeTab === 'wishlist' ? 'My Wishlist' : 'Settings'}
                                </h1>
                                <p className="text-stone-500 mt-1">
                                    {activeTab === 'orders' ? 'Review your past orders and their status.' : 'Manage your account settings.'}
                                </p>
                            </div>

                            {/* CONTENT: ORDERS TABLE */}
                            {activeTab === 'orders' ? (
                                <>
                                    <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-stone-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Order ID</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Date</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Total</th>
                                                        <th className="px-6 py-3 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-stone-200">
                                                    {MOCK_ORDERS.map((order) => (
                                                        <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-stone-900">{order.id}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{order.date}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {getStatusBadge(order.status)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">${order.total.toFixed(2)}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <a href="#" className="text-[#00bbb6] hover:text-[#0df2d7] font-bold hover:underline">View Details</a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex items-center justify-center pt-4">
                                        <nav className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-stone-500"><ChevronLeft className="w-4 h-4" /></Button>
                                            <Button className="h-9 w-9 bg-[#0df2d7]/20 text-stone-900 font-bold hover:bg-[#0df2d7]/30 shadow-none">1</Button>
                                            <Button variant="ghost" className="h-9 w-9 text-stone-600 font-normal">2</Button>
                                            <Button variant="ghost" className="h-9 w-9 text-stone-600 font-normal">3</Button>
                                            <span className="flex items-center justify-center h-9 w-9 text-stone-400"><MoreHorizontal className="w-4 h-4" /></span>
                                            <Button variant="ghost" className="h-9 w-9 text-stone-600 font-normal">10</Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-stone-500"><ChevronRight className="w-4 h-4" /></Button>
                                        </nav>
                                    </div>
                                </>
                            ) : (
                                /* Placeholder cho các tab khác */
                                <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-12 text-center">
                                    <p className="text-stone-500">Content for <strong>{activeTab}</strong> is coming soon!</p>
                                    <Button onClick={() => setActiveTab('orders')} className="mt-4 bg-[#0df2d7] text-stone-900 font-bold">
                                        Go back to Orders
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Sub-component cho Sidebar Item để code gọn hơn
function SidebarItem({
    icon,
    label,
    isActive,
    onClick
}: {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full",
                isActive
                    ? "bg-[#0df2d7]/20 text-stone-900"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            )}
        >
            <span className={cn(isActive ? "text-stone-900" : "text-stone-400")}>
                {icon}
            </span>
            <p className="text-sm font-bold leading-normal">{label}</p>
        </button>
    );
}