// src/pages/OrderFailurePage.tsx
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { Button } from '@/components/ui/button';
import { XCircle, Home, ShoppingCart } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function OrderFailurePage() {
    const [searchParams] = useSearchParams();
    const responseCode = searchParams.get('code');
    const orderId = searchParams.get('orderId');
    const message = searchParams.get('message');

    const getErrorMessage = (code: string | null) => {
        switch (code) {
            case '07':
                return 'Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).';
            case '09':
                return 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking tại ngân hàng.';
            case '10':
                return 'Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.';
            case '11':
                return 'Đã hết hạn chờ thanh toán. Vui lòng thực hiện lại giao dịch.';
            case '12':
                return 'Thẻ/Tài khoản của bạn bị khóa.';
            case '13':
                return 'Bạn đã nhập sai mật khẩu xác thực giao dịch (OTP).';
            case '24':
                return 'Bạn đã hủy giao dịch.';
            case '51':
                return 'Tài khoản không đủ số dư để thực hiện giao dịch.';
            case '65':
                return 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày.';
            case '75':
                return 'Ngân hàng thanh toán đang bảo trì.';
            case '79':
                return 'Bạn đã nhập sai mật khẩu thanh toán quá số lần quy định.';
            case '97':
                return 'Chữ ký không hợp lệ (Invalid signature).';
            case '01':
                return 'Không tìm thấy đơn hàng.';
            case '99':
                return message || 'Lỗi hệ thống. Vui lòng thử lại sau.';
            default:
                return 'Giao dịch không thành công. Vui lòng thử lại.';
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-2xl">
                    {/* Error Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
                            <XCircle className="w-12 h-12 text-red-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            Thanh toán thất bại!
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Rất tiếc, giao dịch của bạn không thành công
                        </p>
                    </div>

                    {/* Error Details */}
                    <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                        <div className="space-y-4">
                            {orderId && (
                                <div className="flex justify-between items-center border-b pb-3">
                                    <span className="text-muted-foreground">Mã đơn hàng:</span>
                                    <span className="font-semibold text-purple-600">#{orderId}</span>
                                </div>
                            )}
                            
                            {responseCode && (
                                <div className="flex justify-between items-center border-b pb-3">
                                    <span className="text-muted-foreground">Mã lỗi:</span>
                                    <span className="font-semibold text-red-600">{responseCode}</span>
                                </div>
                            )}

                            <div className="pt-2">
                                <p className="text-sm text-muted-foreground mb-2">Lý do:</p>
                                <p className="font-medium text-gray-900">
                                    {getErrorMessage(responseCode)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Bạn có thể:</h2>
                        <div className="space-y-3">
                            <Button asChild size="lg" className="w-full">
                                <Link to="/cart">
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Quay lại giỏ hàng
                                </Link>
                            </Button>

                            <Button asChild variant="outline" size="lg" className="w-full">
                                <Link to="/">
                                    <Home className="w-4 h-4 mr-2" />
                                    Về trang chủ
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">
                                💡 <strong>Gợi ý:</strong> Nếu bạn gặp vấn đề khi thanh toán, vui lòng kiểm tra lại thông tin thẻ hoặc liên hệ ngân hàng của bạn để được hỗ trợ.
                            </p>
                        </div>
                    </div>

                    {/* Support Info */}
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>Cần hỗ trợ? Liên hệ với chúng tôi:</p>
                        <p className="font-medium text-purple-600 mt-1">
                            Email: support@b-world.com | Hotline: 1900-xxxx
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

