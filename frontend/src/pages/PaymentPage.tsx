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
import { ArrowLeft, Tag, Truck, CreditCard } from 'lucide-react';
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
            <div className="flex flex-col min-h-screen bg-[#f5f8f8]">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold font-display text-stone-900 mb-4">Giỏ hàng trống</h2>
                        <Link to="/">
                            <Button className="bg-[#0df2d7] text-stone-900 font-bold">Tiếp tục mua sắm</Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const finalPrice = appliedPromo ? appliedPromo.final_price : subtotal;

    const handleApplyPromo = () => {
        if (!promoCode.trim()) return showToast.error('Vui lòng nhập mã khuyến mãi');
        checkPromo.mutate(
            { code: promoCode, total_price: subtotal },
            { onSuccess: (data) => setAppliedPromo(data) }
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
        <div className="flex flex-col min-h-screen bg-[#f5f8f8]">
            <Header />
            <main className="container mx-auto px-4 py-8 sm:py-12 flex-1">

                <div className="flex flex-col gap-6">
                    {/* Breadcrumbs */}
                    <div className="flex flex-wrap gap-2 text-sm mb-2">
                        <Link to="/cart" className="text-stone-500 hover:text-[#0df2d7] font-medium flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> Back to Cart
                        </Link>
                        <span className="text-stone-400">/</span>
                        <span className="text-stone-900 font-medium">Checkout</span>
                    </div>

                    <h1 className="font-display text-4xl font-black tracking-tighter text-stone-900">Checkout</h1>

                    <div className="grid lg:grid-cols-3 gap-8 xl:gap-12 items-start">
                        {/* LEFT COLUMN: Inputs */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Shipping Info */}
                            <div className="bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-sm">
                                <h2 className="text-xl font-bold font-display text-stone-900 mb-6 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-[#00bbb6]" /> Shipping Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-stone-600 font-medium">Full Name</Label>
                                        <Input id="name" value={user?.name} disabled className="bg-stone-50 border-stone-200 text-stone-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-stone-600 font-medium">Email</Label>
                                        <Input id="email" value={user?.email} disabled className="bg-stone-50 border-stone-200 text-stone-500" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="address" className="text-stone-900 font-medium">Address <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Enter your shipping address"
                                            className="h-11 border-stone-200 focus:border-[#0df2d7] focus:ring-[#0df2d7]"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="phone" className="text-stone-900 font-medium">Phone Number <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter your phone number"
                                            className="h-11 border-stone-200 focus:border-[#0df2d7] focus:ring-[#0df2d7]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-sm">
                                <h2 className="text-xl font-bold font-display text-stone-900 mb-6 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-[#00bbb6]" /> Payment Method
                                </h2>
                                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="space-y-4">

                                    <div className={`flex items-center space-x-4 border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'cash_on_delivery' ? 'border-[#0df2d7] bg-[#f0fdfd]' : 'border-stone-200 hover:bg-stone-50'}`}>
                                        <RadioGroupItem value="cash_on_delivery" id="cod" className="text-[#0df2d7] border-stone-400" />
                                        <Label htmlFor="cod" className="flex-1 cursor-pointer font-medium text-stone-900">Cash on Delivery (COD)</Label>
                                    </div>

                                    <div className={`flex items-center space-x-4 border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'paypal' ? 'border-[#0df2d7] bg-[#f0fdfd]' : 'border-stone-200 hover:bg-stone-50'}`}>
                                        <RadioGroupItem value="paypal" id="paypal" className="text-[#0df2d7] border-stone-400" />
                                        <Label htmlFor="paypal" className="flex-1 cursor-pointer font-medium text-stone-900">PayPal</Label>
                                    </div>

                                    <div className={`flex items-center space-x-4 border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'credit_card' ? 'border-[#0df2d7] bg-[#f0fdfd]' : 'border-stone-200 hover:bg-stone-50'}`}>
                                        <RadioGroupItem value="credit_card" id="card" className="text-[#0df2d7] border-stone-400" />
                                        <Label htmlFor="card" className="flex-1 cursor-pointer font-medium text-stone-900">Credit Card / Debit Card</Label>
                                    </div>

                                </RadioGroup>
                            </div>

                            {/* Order Review (Items) */}
                            <div className="bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-sm">
                                <h2 className="text-xl font-bold font-display text-stone-900 mb-6">Review Items</h2>
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.book_id} className="flex gap-4 border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                                            <img src={item.cover_image} alt={item.title} className="w-16 h-20 object-cover rounded bg-stone-100" />
                                            <div className="flex-1">
                                                <h4 className="font-bold text-stone-900 font-display">{item.title}</h4>
                                                <p className="text-sm text-stone-500">{item.authors}</p>
                                                <p className="text-sm text-stone-600 mt-1">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Summary */}
                        <div className="lg:col-span-1 w-full">
                            <div className="bg-white rounded-lg border border-stone-200 p-6 flex flex-col gap-6 sticky top-24 shadow-sm">
                                <h3 className="font-display text-xl font-bold text-stone-900">Order Summary</h3>

                                {/* Promo Code Input */}
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium text-stone-600">Promo Code</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter code"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            className="bg-[#f5f8f8] border-stone-200 focus:ring-[#0df2d7] focus:border-[#0df2d7]"
                                        />
                                        <Button
                                            onClick={handleApplyPromo}
                                            disabled={checkPromo.isPending || !promoCode.trim()}
                                            className="bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 font-bold"
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                    {appliedPromo && (
                                        <div className="text-sm text-green-600 bg-green-50 p-2 rounded flex items-center gap-1 mt-1 border border-green-100">
                                            <Tag className="w-3 h-3" /> Code <strong>{appliedPromo.code}</strong> applied: -${appliedPromo.discount_amount}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col border-b border-stone-200 pb-4 border-t border-stone-100 pt-4">
                                    <div className="flex justify-between gap-x-6 py-2">
                                        <p className="text-stone-600 text-sm">Subtotal</p>
                                        <p className="text-stone-900 text-sm font-medium text-right">${subtotal.toLocaleString()}</p>
                                    </div>
                                    {appliedPromo && (
                                        <div className="flex justify-between gap-x-6 py-2 text-green-600">
                                            <p className="text-sm">Discount</p>
                                            <p className="text-sm font-medium text-right">-${appliedPromo.discount_amount.toLocaleString()}</p>
                                        </div>
                                    )}
                                    <div className="flex justify-between gap-x-6 py-2">
                                        <p className="text-stone-600 text-sm">Shipping</p>
                                        <p className="text-stone-900 text-sm font-medium text-right">Free</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center gap-x-6">
                                    <p className="font-display font-bold text-lg text-stone-900">Total</p>
                                    <p className="font-display text-2xl font-bold text-right text-[#00bbb6]">
                                        ${finalPrice.toLocaleString()}
                                    </p>
                                </div>

                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={createOrder.isPending}
                                    className="w-full h-12 bg-[#0df2d7] hover:bg-[#00dcc3] text-stone-900 font-bold text-base tracking-wide rounded-lg shadow-sm"
                                >
                                    {createOrder.isPending ? 'Processing...' : 'Place Order'}
                                </Button>

                                <p className="text-xs text-center text-stone-500">
                                    By placing your order, you agree to our Terms of Service.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}