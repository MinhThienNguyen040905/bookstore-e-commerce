// src/pages/CartPage.tsx
import { useState } from 'react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCartQuery } from '@/hooks/useCartQuery';
import { useRemoveFromCart, useUpdateCart } from '@/hooks/useCartActions';
import { useCartStore } from '@/features/cart/useCartStore';
import { Link } from 'react-router-dom';
import { showToast } from '@/lib/toast';

export default function CartPage() {
    const { data: cartData, isLoading } = useCartQuery();
    const items = cartData?.items || [];
    const totalPrice = cartData?.total_price || 0;

    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

    const updateMutation = useUpdateCart();
    const removeMutation = useRemoveFromCart();

    const handleQuantityChange = (bookId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        updateMutation.mutate({ book_id: bookId, quantity: newQuantity });
    };

    const handleRemoveSelected = () => {
        if (selectedItems.size === 0) {
            showToast.error('Vui lòng chọn ít nhất 1 sản phẩm');
            return;
        }

        // Xóa từng cái
        selectedItems.forEach((bookId) => {
            removeMutation.mutate(bookId);
        });

        setSelectedItems(new Set());
        showToast.success('Đã xóa các sản phẩm đã chọn');
    };

    const toggleSelect = (bookId: number) => {
        const newSet = new Set(selectedItems);
        if (newSet.has(bookId)) {
            newSet.delete(bookId);
        } else {
            newSet.add(bookId);
        }
        setSelectedItems(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedItems.size === items.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(items.map(i => i.book_id)));
        }
    };

    const selectedTotal = items
        .filter(i => selectedItems.has(i.id))
        .reduce((sum, i) => sum + i.price * i.quantity, 0);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Đang tải giỏ hàng...</div>;

    if (!items.length) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
                        <Link to="/">
                            <Button className="bg-purple-600 hover:bg-purple-700">Tiếp tục mua sắm</Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Danh sách sản phẩm */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <Checkbox
                                        checked={selectedItems.size === items.length && items.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                    <span className="font-medium">Chọn tất cả ({items.length} sản phẩm)</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveSelected}
                                        className="ml-auto text-destructive hover:text-destructive"
                                        disabled={selectedItems.size === 0}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Xóa đã chọn
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.book_id} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50">
                                            <Checkbox
                                                checked={selectedItems.has(item.book_id)}
                                                onCheckedChange={() => toggleSelect(item.book_id)}
                                            />

                                            <img
                                                src={item.cover}
                                                alt={item.title}
                                                className="w-20 h-28 object-cover rounded"
                                            />

                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg line-clamp-2">{item.title}</h3>
                                                <p className="text-muted-foreground text-sm">{item.authors}</p>
                                                <p className="text-lg font-bold text-purple-600 mt-2">
                                                    {item.price.toLocaleString('vi-VN')}₫
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => handleQuantityChange(item.book_id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.book_id, Number(e.target.value))}
                                                    className="w-16 text-center"
                                                    min="1"
                                                />
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => handleQuantityChange(item.book_id, item.quantity + 1)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-bold text-lg">
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tổng tiền & Thanh toán */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                                <h2 className="text-xl font-bold mb-4">Tổng thanh toán</h2>

                                <div className="space-y-3 text-lg">
                                    <div className="flex justify-between">
                                        <span>Số loại sách:</span>
                                        <span>{items.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Đã chọn:</span>
                                        <span>{selectedItems.size} loại</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-xl pt-4 border-t">
                                        <span>Tổng tiền:</span>
                                        <span className="text-purple-600">
                                            {selectedTotal.toLocaleString('vi-VN')}₫
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    asChild
                                    size="lg"
                                    className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-lg py-6"
                                    disabled={selectedItems.size === 0}
                                >
                                    <Link to="/checkout">Tiến hành thanh toán</Link>
                                </Button>

                                <Link to="/" className="block text-center mt-4 text-purple-600 hover:underline">
                                    ← Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}