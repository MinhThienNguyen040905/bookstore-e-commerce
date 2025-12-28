// src/pages/AdminPage.tsx
import { useState } from 'react';
import { Header } from '@/layouts/Header'; // Sử dụng Header CŨ
import { Footer } from '@/layouts/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Import các components con
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { DashboardTab } from '@/components/admin/tabs/DashboardTab';
import { UsersTab } from '@/components/admin/tabs/UsersTab';
import { BooksTab } from '@/components/admin/tabs/BooksTab';
import { OrdersTab } from '@/components/admin/tabs/OrdersTab';

export default function AdminPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');

    // Bảo vệ Client-side (Nếu không phải admin thì chặn)
    if (!user || user.role !== 'admin') {
        return (
            <div className="flex flex-col min-h-screen bg-[#f5f8f8]">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-3xl font-bold font-display text-stone-900 mb-2">Access Denied</h1>
                    <p className="text-stone-500 mb-6">You do not have permission to view the Admin Dashboard.</p>
                    <Link to="/">
                        <Button className="bg-[#0df2d7] text-stone-900 font-bold">Go Back Home</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Hàm render nội dung dựa trên tab
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardTab />;
            case 'users': return <UsersTab />;
            case 'books': return <BooksTab />;
            case 'orders': return <OrdersTab />;
            default: return <div className="text-stone-500">Feature coming soon...</div>;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f5f8f8]">
            {/* 1. GIỮ LẠI HEADER CŨ */}
            <Header />

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* 2. ADMIN SIDEBAR */}
                    <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                    {/* 3. MAIN CONTENT AREA */}
                    <div className="flex-1 w-full min-w-0">
                        {renderContent()}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}