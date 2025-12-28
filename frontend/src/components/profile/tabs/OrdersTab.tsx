// src/components/profile/tabs/OrdersTab.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Eye, PackageOpen } from 'lucide-react';
import { useMyOrders } from '@/hooks/useOrders'; // Import Hook mới
import { OrderDetail } from '../OrderDetail'; // Import Component chi tiết mới
import type { Order } from '@/types/order';
import { cn } from '@/lib/utils';

export function OrdersTab() {
    const { data: orders, isLoading, isError } = useMyOrders();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Helper render status badge cho danh sách
    const getStatusBadge = (status: string) => {
        const styles = {
            processing: "bg-blue-100 text-blue-800",
            shipped: "bg-yellow-100 text-yellow-800",
            delivered: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800"
        };
        const style = styles[status as keyof typeof styles] || "bg-stone-100 text-stone-800";

        return (
            <span className={cn("px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize", style)}>
                {status}
            </span>
        );
    };

    // --- RENDER LOGIC ---

    // 1. Loading State
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg p-12 flex flex-col items-center justify-center text-stone-400">
                <PackageOpen className="w-12 h-12 mb-4 animate-bounce" />
                <p>Loading your orders...</p>
            </div>
        );
    }

    // 2. Error State
    if (isError) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                Failed to load orders. Please try again later.
            </div>
        );
    }

    // 3. Detail View (Khi user đã chọn 1 đơn hàng)
    if (selectedOrder) {
        return (
            <OrderDetail
                order={selectedOrder}
                onBack={() => setSelectedOrder(null)}
            />
        );
    }

    // 4. Empty State
    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
                <div className="inline-flex p-4 rounded-full bg-stone-100 mb-4">
                    <PackageOpen className="w-8 h-8 text-stone-400" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">No orders yet</h3>
                <p className="text-stone-500 mb-4">Go explore our books and make your first purchase!</p>
                <Button className="bg-[#0df2d7] text-stone-900 font-bold">Start Shopping</Button>
            </div>
        );
    }

    // 5. List View (Mặc định)
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {orders.map((order) => (
                                <tr key={order.order_id} className="hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-stone-900">#{order.order_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                                        {new Date(order.order_date).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                                        {order.order_items.length} items
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-stone-900">
                                        ${Number(order.total_price).toLocaleString('en-US')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-[#00bbb6] hover:text-[#0df2d7] hover:bg-[#0df2d7]/10"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Tránh kích hoạt click row
                                                setSelectedOrder(order);
                                            }}
                                        >
                                            <Eye className="w-4 h-4 mr-1" /> View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination (Giả lập, có thể thêm logic sau) */}
            <div className="flex items-center justify-center pt-6">
                <nav className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-stone-500 disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></Button>
                    <Button className="h-9 w-9 bg-[#0df2d7]/20 text-stone-900 font-bold hover:bg-[#0df2d7]/30 shadow-none">1</Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-stone-500 disabled:opacity-50" disabled><ChevronRight className="w-4 h-4" /></Button>
                </nav>
            </div>
        </div>
    );
}