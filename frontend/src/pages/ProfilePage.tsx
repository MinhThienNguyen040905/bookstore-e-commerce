// src/pages/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
    User, Package, Heart, MapPin, CreditCard, LogOut,
    ChevronLeft, ChevronRight, MoreHorizontal, Camera,
    Lock, Edit2, Check, X, Mail, Phone as PhoneIcon
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showToast } from '@/lib/toast';

// --- MOCK DATA FOR ORDERS ---
const MOCK_ORDERS = [
    { id: '#BK1204', date: 'June 1, 2024', status: 'Delivered', total: 45.50 },
    { id: '#BK1198', date: 'May 22, 2024', status: 'Shipped', total: 28.00 },
    { id: '#BK1152', date: 'April 15, 2024', status: 'Delivered', total: 72.10 },
    { id: '#BK1101', date: 'March 5, 2024', status: 'Cancelled', total: 19.99 },
];

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'address' | 'payment'>('profile');

    // Helper render status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Delivered': return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>;
            case 'Shipped': return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Shipped</span>;
            case 'Cancelled': return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>;
            default: return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
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
                                {/* User Info Sidebar */}
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

                                {/* Menu */}
                                <nav className="flex flex-col gap-2">
                                    <SidebarItem icon={<User className="w-5 h-5" />} label="Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                                    <SidebarItem icon={<Package className="w-5 h-5" />} label="Orders" isActive={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                                    <SidebarItem icon={<Heart className="w-5 h-5" />} label="Wishlist" isActive={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')} />
                                    <SidebarItem icon={<MapPin className="w-5 h-5" />} label="Addresses" isActive={activeTab === 'address'} onClick={() => setActiveTab('address')} />
                                    <SidebarItem icon={<CreditCard className="w-5 h-5" />} label="Payment Methods" isActive={activeTab === 'payment'} onClick={() => setActiveTab('payment')} />
                                </nav>
                            </div>

                            <div className="border-t border-stone-200 mt-4 pt-4">
                                <button onClick={() => logout()} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-stone-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                    <p className="text-sm font-medium leading-normal">Logout</p>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
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
                                    {activeTab === 'orders' ? 'Review your past orders and their status.' :
                                        activeTab === 'profile' ? 'Manage your personal information.' : 'Manage your account settings.'}
                                </p>
                            </div>

                            {/* === CONTENT: PROFILE TAB === */}
                            {activeTab === 'profile' && (
                                <div className="flex flex-col gap-6">
                                    {/* 1. Avatar Section */}
                                    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 flex flex-col sm:flex-row items-center gap-6">
                                        <div className="relative">
                                            <Avatar className="h-24 w-24 border-4 border-stone-100">
                                                <AvatarImage src={user?.avatar || ''} className="object-cover" />
                                                <AvatarFallback className="text-2xl bg-stone-200 text-stone-500 font-bold">
                                                    {user?.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <button className="absolute bottom-0 right-0 p-2 bg-[#0df2d7] text-stone-900 rounded-full hover:bg-[#00dcc3] shadow-sm transition-colors" title="Change Avatar">
                                                <Camera className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-center sm:text-left flex-1">
                                            <h2 className="text-xl font-bold font-display text-stone-900">{user?.name}</h2>
                                            <p className="text-stone-500 text-sm mb-4">{user?.role === 'admin' ? 'Administrator' : 'Member'}</p>
                                            <div className="flex gap-3 justify-center sm:justify-start">
                                                <Button variant="outline" className="border-stone-200 text-stone-600 hover:bg-stone-50 h-9 text-sm">
                                                    Change Avatar
                                                </Button>
                                                <Button variant="outline" className="border-stone-200 text-stone-600 hover:bg-stone-50 h-9 text-sm">
                                                    Delete Avatar
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Personal Information Section */}
                                    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-bold font-display text-stone-900">Personal Information</h3>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Email (Read Only) */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-center border-b border-stone-100 pb-6">
                                                <Label className="text-stone-500 font-medium">Email Address</Label>
                                                <div className="md:col-span-2 flex items-center justify-between">
                                                    <div className="flex items-center gap-3 text-stone-900 font-medium">
                                                        <Mail className="w-4 h-4 text-[#00bbb6]" />
                                                        {user?.email}
                                                    </div>
                                                    <span className="text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded">Read-only</span>
                                                </div>
                                            </div>

                                            {/* Editable Fields */}
                                            <ProfileField
                                                label="Full Name"
                                                value={user?.name || ''}
                                                icon={<User className="w-4 h-4 text-[#00bbb6]" />}
                                                fieldKey="name"
                                            />

                                            <ProfileField
                                                label="Phone Number"
                                                value={user?.phone || ''}
                                                icon={<PhoneIcon className="w-4 h-4 text-[#00bbb6]" />}
                                                fieldKey="phone"
                                                inputType="tel"
                                            />

                                            <ProfileField
                                                label="Address"
                                                value={user?.address || ''}
                                                icon={<MapPin className="w-4 h-4 text-[#00bbb6]" />}
                                                fieldKey="address"
                                            />
                                        </div>
                                    </div>

                                    {/* 3. Security Section */}
                                    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold font-display text-stone-900 flex items-center gap-2">
                                                <Lock className="w-5 h-5 text-[#00bbb6]" /> Security
                                            </h3>
                                            <p className="text-stone-500 text-sm mt-1">Manage your password and account security.</p>
                                        </div>
                                        <Button className="bg-[#0df2d7] text-stone-900 hover:bg-[#00dcc3] font-bold">
                                            Change Password
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* === CONTENT: ORDERS TAB === */}
                            {activeTab === 'orders' && (
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
                                                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
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
                                    <div className="flex items-center justify-center pt-4">
                                        <nav className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-stone-500"><ChevronLeft className="w-4 h-4" /></Button>
                                            <Button className="h-9 w-9 bg-[#0df2d7]/20 text-stone-900 font-bold hover:bg-[#0df2d7]/30 shadow-none">1</Button>
                                            <Button variant="ghost" className="h-9 w-9 text-stone-600 font-normal">2</Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-stone-500"><ChevronRight className="w-4 h-4" /></Button>
                                        </nav>
                                    </div>
                                </>
                            )}

                            {/* Placeholder for other tabs */}
                            {['wishlist', 'address', 'payment'].includes(activeTab) && (
                                <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-12 text-center">
                                    <p className="text-stone-500">Content for <strong>{activeTab}</strong> is coming soon!</p>
                                    <Button onClick={() => setActiveTab('profile')} className="mt-4 bg-[#0df2d7] text-stone-900 font-bold">Back to Profile</Button>
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

// --- SUB-COMPONENTS ---

// 1. Sidebar Item
function SidebarItem({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full",
                isActive ? "bg-[#0df2d7]/20 text-stone-900" : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            )}
        >
            <span className={cn(isActive ? "text-stone-900" : "text-stone-400")}>{icon}</span>
            <p className="text-sm font-bold leading-normal">{label}</p>
        </button>
    );
}

// 2. ProfileField (Reusability Logic for Edit/Save/Cancel)
interface ProfileFieldProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    fieldKey: string;
    inputType?: string;
}

function ProfileField({ label, value, icon, fieldKey, inputType = "text" }: ProfileFieldProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    // Sync state khi props thay đổi (ví dụ khi load user từ API)
    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const handleSave = () => {
        // TODO: Gọi API cập nhật thông tin user ở đây
        console.log(`Saving ${fieldKey}: ${tempValue}`);
        showToast.success(`${label} updated successfully!`);
        setIsEditing(false);
        // Lưu ý: Trong thực tế, bạn cần update state global (Zustand) sau khi API thành công
    };

    const handleCancel = () => {
        setTempValue(value); // Revert về giá trị cũ
        setIsEditing(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-center border-b border-stone-100 pb-6 last:border-0 last:pb-0">
            <Label className="text-stone-500 font-medium">{label}</Label>
            <div className="md:col-span-2 flex items-center justify-between gap-4">
                {isEditing ? (
                    <div className="flex items-center gap-2 w-full animate-in fade-in zoom-in-95 duration-200">
                        <Input
                            type={inputType}
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="h-10 border-[#0df2d7] ring-2 ring-[#0df2d7]/20 bg-white"
                            autoFocus
                        />
                        <Button size="icon" onClick={handleSave} className="h-10 w-10 bg-[#0df2d7] hover:bg-[#00dcc3] text-stone-900 shrink-0">
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={handleCancel} className="h-10 w-10 border-stone-200 text-stone-500 hover:text-red-500 hover:bg-red-50 shrink-0">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 text-stone-900 font-medium truncate">
                            {icon}
                            {value || <span className="text-stone-400 italic">Not set</span>}
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-stone-400 hover:text-[#00bbb6] hover:bg-[#0df2d7]/10 rounded-full transition-all"
                            title="Edit"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}