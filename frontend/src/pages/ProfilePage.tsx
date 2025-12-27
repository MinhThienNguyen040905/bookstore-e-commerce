// src/pages/ProfilePage.tsx
import { useState } from 'react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { Button } from '@/components/ui/button';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { ProfileTab } from '@/components/profile/tabs/ProfileTab';
import { OrdersTab } from '@/components/profile/tabs/OrdersTab';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'address' | 'payment'>('profile');

    return (
        <div className="flex flex-col min-h-screen bg-[#f5f8f8]">
            <Header />

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* SIDEBAR Component */}
                    <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                    {/* MAIN CONTENT AREA */}
                    <div className="w-full lg:w-3/4 xl:w-4/5">
                        <div className="flex flex-col gap-6">

                            {/* Heading */}
                            <div>
                                <h1 className="text-stone-900 text-4xl font-black font-display leading-tight tracking-tight">
                                    {activeTab === 'orders' ? 'My Orders' :
                                        activeTab === 'profile' ? 'My Profile' :
                                            activeTab === 'wishlist' ? 'My Wishlist' :
                                                activeTab === 'address' ? 'Addresses' : 'Payment Methods'}
                                </h1>
                                <p className="text-stone-500 mt-1">
                                    {activeTab === 'orders' ? 'Review your past orders and their status.' :
                                        activeTab === 'profile' ? 'Manage your personal information.' : 'Manage your account settings.'}
                                </p>
                            </div>

                            {/* RENDER CONTENT BASED ON TAB */}
                            {activeTab === 'profile' && <ProfileTab />}

                            {activeTab === 'orders' && <OrdersTab />}

                            {/* Placeholder for other tabs */}
                            {['wishlist', 'address', 'payment'].includes(activeTab) && (
                                <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-12 text-center animate-in fade-in zoom-in-95 duration-300">
                                    <p className="text-stone-500">Content for <strong>{activeTab}</strong> is coming soon!</p>
                                    <Button onClick={() => setActiveTab('profile')} className="mt-4 bg-[#0df2d7] text-stone-900 font-bold hover:bg-[#00dcc3]">
                                        Back to Profile
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