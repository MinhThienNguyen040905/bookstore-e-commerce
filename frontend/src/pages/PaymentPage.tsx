// src/pages/PaymentPage.tsx
import { useState } from 'react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCartQuery } from '@/hooks/useCartQuery';
import { useCheckPromo } from '@/hooks/usePromo';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag } from 'lucide-react';
import { showToast } from '@/lib/toast';

export default function PaymentPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { data: cartData } = useCartQuery();
    const items = cartData?.items || [];
    const subtotal = cartData?.total_price || 0;

    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'paypal' | 'credit_card'>('cash_on_delivery');
    const [address, setAddress] = useState(user?.address || '');
    const [phone, setPhone] = useState(user?.phone || '');

    const checkPromo = useCheckPromo();
    const createOrder = useCreateOrder();

    if (!items.length) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
                        <Button asChild>
                            <Link to="/">Tiếp tục mua sắm</Link>
                        </Button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const finalPrice = appliedPromo ? appliedPromo.final_price : subtotal;

    const handleApplyPromo = () => {
        if (!promoCode.trim()) return showToast.error('Vui lòng nhập mã khuyến mãi');
        checkPromo.mutate(
            { code: promoCode, total_price: subtotal },
            {
                onSuccess: (data) => {
                    setAppliedPromo(data);
                },
            }
        );
    };

    const handlePlaceOrder = () => {
        if (!address.trim() || !phone.trim()) {
            return showToast.error('Vui lòng nhập địa chỉ và số điện thoại');
        }

        createOrder.mutate({
            promo_code: appliedPromo?.code,
            payment_method: paymentMethod,
            address,
            phone,
        });
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <Button variant="ghost" asChild className="mb-6">
                        <Link to="/cart">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại giỏ hàng
                        </Link>
                    </Button>

                    <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Danh sách sản phẩm */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-4">Sản phẩm</h2>
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.book_id} className="flex gap-4">
                                            <img src={item.cover_image} alt={item.title} className="w-20 h-28 object-cover rounded" />
                                            <div className="flex-1">
                                                <h3 className="font-medium">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground">{item.authors}</p>
                                                <p className="text-sm mt-2">
                                                    {item.quantity} x {Number(item.price).toLocaleString('vi-VN')}₫
                                                </p>
                                            </div>
                                            <div className="text-right font-medium">
                                                {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Thông tin giao hàng */}
                            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                                <h2 className="text-xl font-semibold">Thông tin giao hàng</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="address">Địa chỉ</Label>
                                        <Input
                                            id="address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Nhập địa chỉ giao hàng"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Số điện thoại</Label>
                                        <Input
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Phương thức thanh toán */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
                                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="cash_on_delivery" id="cod" />
                                        <Label htmlFor="cod" className="cursor-pointer">Thanh toán khi nhận hàng (COD)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="paypal" id="paypal" />
                                        <Label htmlFor="paypal" className="cursor-pointer">PayPal</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="credit_card" id="card" />
                                        <Label htmlFor="card" className="cursor-pointer">Thẻ tín dụng / Ghi nợ</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        {/* Tóm tắt đơn hàng */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>

                                {/* Mã khuyến mãi */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Nhập mã khuyến mãi"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                                        />
                                        <Button
                                            onClick={handleApplyPromo}
                                            disabled={checkPromo.isPending || !promoCode.trim()}
                                            variant="outline"
                                        >
                                            <Tag className="w-4 h-4 mr-2" />
                                            Áp dụng
                                        </Button>
                                    </div>
                                    {appliedPromo && (
                                        <p className="text-sm text-green-600 font-medium">
                                            Đã áp dụng: {appliedPromo.code} → Tiết kiệm {appliedPromo.discount_amount.toLocaleString()}₫
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3 text-lg border-t pt-4">
                                    <div className="flex justify-between">
                                        <span>Tạm tính</span>
                                        <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                    {appliedPromo && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Giảm giá</span>
                                            <span>-{appliedPromo.discount_amount.toLocaleString()}₫</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-xl pt-4 border-t">
                                        <span>Tổng cộng</span>
                                        <span className="text-purple-600">{finalPrice.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-lg py-6"
                                    onClick={handlePlaceOrder}
                                    disabled={createOrder.isPending || !address || !phone}
                                >
                                    {createOrder.isPending ? 'Đang xử lý...' : 'Đặt hàng ngay'}
                                </Button>

                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    Bằng việc đặt hàng, bạn đồng ý với điều khoản sử dụng
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}