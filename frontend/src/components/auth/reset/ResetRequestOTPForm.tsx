import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { requestOTPSchema, type RequestOTPData } from '@/schemas/otp.schema';
import { useOTP } from '@/hooks/useOTP';
import { useNavigate } from 'react-router-dom';

export function ResetRequestOTPForm() {
    const { request } = useOTP();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<RequestOTPData>({
        resolver: zodResolver(requestOTPSchema),
    });

    const onSubmit = (data: RequestOTPData) => {
        request.mutate(data.email, {
            onSuccess: () => navigate('/reset-password-verify', { state: { email: data.email } }),
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={request.isPending}>
                {request.isPending ? 'Đang gửi...' : 'Gửi OTP'}
            </Button>
        </form>
    );
}