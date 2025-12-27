import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const MOCK_ORDERS = [
    { id: '#BK1204', date: 'June 1, 2024', status: 'Delivered', total: 45.50 },
    { id: '#BK1198', date: 'May 22, 2024', status: 'Shipped', total: 28.00 },
    { id: '#BK1152', date: 'April 15, 2024', status: 'Delivered', total: 72.10 },
    { id: '#BK1101', date: 'March 5, 2024', status: 'Cancelled', total: 19.99 },
];

export function OrdersTab() {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Delivered': return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>;
            case 'Shipped': return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Shipped</span>;
            case 'Cancelled': return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>;
            default: return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        </div>
    );
}