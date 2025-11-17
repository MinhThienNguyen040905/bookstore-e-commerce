// src/pages/ResetPasswordCompletePage.tsx
import { ResetPasswordCompleteForm } from '@/components/auth/reset/ResetPasswordCompleteForm';

export default function ResetPasswordCompletePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border">
                    <ResetPasswordCompleteForm />
                </div>
            </div>
        </div>
    );
}