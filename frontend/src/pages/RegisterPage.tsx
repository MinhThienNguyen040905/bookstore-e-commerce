import { useState } from 'react';
import RegisterRequestOTPForm from '@/components/auth/register/RegisterRequestOTPForm';
import RegisterVerifyOTPForm from '@/components/auth/register/RegisterVerifyOTPForm';
import CompleteRegisterForm from '@/components/auth/register/CompleteRegisterForm';
export default function RegisterPage() {
    const [step, setStep] = useState<'request' | 'verify' | 'complete'>('request');
    const [email, setEmail] = useState('');
    const handleRequestSuccess = (email: string) => {
        setEmail(email);
        setStep('verify');
    };
    const handleVerifySuccess = () => {
        setStep('complete');
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <h2 className="text-3xl font-bold text-center">Đăng kí</h2>
                <div className="bg-white p-8 rounded-xl shadow-sm border">
                    {step === 'request' && <RegisterRequestOTPForm onSuccess={handleRequestSuccess} />}
                    {step === 'verify' && <RegisterVerifyOTPForm email={email} onSuccess={handleVerifySuccess} />}
                    {step === 'complete' && <CompleteRegisterForm email={email} />}
                </div>
            </div>
        </div>
    );
}
