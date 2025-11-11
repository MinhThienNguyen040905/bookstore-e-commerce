// src/pages/LoginPage.tsx
import { LoginForm } from '@/components/auth/LoginForm';
import { Link } from 'react-router-dom';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}