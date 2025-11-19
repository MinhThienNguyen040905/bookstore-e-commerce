import { useState } from 'react';
import ResetRequestOTPForm from '@/components/auth/reset/ResetRequestOTPForm';
import ResetVerifyOTPForm from '@/components/auth/reset/ResetVerifyOTPForm';
import ResetPasswordCompleteForm from '@/components/auth/reset/ResetPasswordCompleteForm';

export default function ResetPasswordFlow() {
    const [step, setStep] = useState<'request' | 'verify' | 'complete'>('request');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    const handleRequestSuccess = (email: string) => {
        setEmail(email);
        setStep('verify');
    };

    const handleVerifySuccess = (otp: string) => {
        setOtp(otp);
        setStep('complete');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <h2 className="text-3xl font-bold text-center">Đặt lại mật khẩu</h2>
                <div className="bg-white p-8 rounded-xl shadow-sm border">
                    {step === 'request' && <ResetRequestOTPForm onSuccess={handleRequestSuccess} />}
                    {step === 'verify' && <ResetVerifyOTPForm email={email} onSuccess={handleVerifySuccess} />}
                    {step === 'complete' && <ResetPasswordCompleteForm email={email} otp={otp} />}
                </div>
            </div>
        </div>
    );
}