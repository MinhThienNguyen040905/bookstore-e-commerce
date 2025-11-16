// src/pages/RegisterOTPPage.tsx
import { RequestOTPForm } from '@/components/auth/RequestOTPForm';

export default function RegisterOTPPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Đăng ký</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Nhập email để nhận mã OTP</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border">
                    <RequestOTPForm />
                </div>
            </div>
        </div>
    );
}