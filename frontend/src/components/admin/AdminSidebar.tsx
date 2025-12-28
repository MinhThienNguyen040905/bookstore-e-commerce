// src/components/admin/AdminSidebar.tsx
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, BookOpen, ShoppingCart, List, Tag } from 'lucide-react';

interface AdminSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
    return (
        <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 sticky top-24">
                <div className="mb-4 px-4">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Management</span>
                </div>

                <nav className="flex flex-col gap-1">
                    <NavItem
                        icon={<LayoutDashboard className="w-5 h-5" />}
                        label="Dashboard"
                        id="dashboard"
                        isActive={activeTab === 'dashboard'}
                        onClick={() => setActiveTab('dashboard')}
                    />
                    <NavItem
                        icon={<Users className="w-5 h-5" />}
                        label="Users"
                        id="users"
                        isActive={activeTab === 'users'}
                        onClick={() => setActiveTab('users')}
                    />
                    <NavItem
                        icon={<BookOpen className="w-5 h-5" />}
                        label="Books"
                        id="books"
                        isActive={activeTab === 'books'}
                        onClick={() => setActiveTab('books')}
                    />
                    <NavItem
                        icon={<ShoppingCart className="w-5 h-5" />}
                        label="Orders"
                        id="orders"
                        isActive={activeTab === 'orders'}
                        onClick={() => setActiveTab('orders')}
                    />
                    <NavItem
                        icon={<List className="w-5 h-5" />}
                        label="Categories"
                        id="categories"
                        isActive={activeTab === 'categories'}
                        onClick={() => setActiveTab('categories')}
                    />
                    <NavItem
                        icon={<Tag className="w-5 h-5" />}
                        label="Discounts"
                        id="discounts"
                        isActive={activeTab === 'discounts'}
                        onClick={() => setActiveTab('discounts')}
                    />
                </nav>
            </div>
        </aside>
    );
}

function NavItem({ icon, label, id, isActive, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-sm font-medium",
                isActive
                    ? "bg-[#0df2d7]/10 text-[#009b8f] font-bold"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
            )}
        >
            <span className={cn(isActive ? "text-[#009b8f]" : "text-stone-400")}>
                {icon}
            </span>
            {label}
        </button>
    );
}