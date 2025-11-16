// src/pages/ResetPasswordPage.tsx
import { useState } from 'react';
import { RequestOTPForm } from '@/components/auth/RequestOTPForm';
import { VerifyOTPForm } from '@/components/auth/VerifyOTPForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
    const [step, setStep] = useState<'request' | 'verify'>('request');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Quên mật khẩu</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {step === 'request' ? 'Nhập email để nhận OTP' : 'Nhập OTP để đặt lại mật khẩu'}
                    </p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border">
                    {step === 'request' ? (
                        <RequestOTPForm />
                    ) : (
                        <VerifyOTPForm />
                    )}
                    <div className="mt-4 text-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setStep(step === 'request' ? 'verify' : 'request')}
                        >
                            {step === 'request' ? 'Đã có OTP?' : (
                                <>
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Quay lại
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}