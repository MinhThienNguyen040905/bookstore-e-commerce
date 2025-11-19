import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verifyOTPSchema, type VerifyOTPData } from '@/schemas/otp.schema';
import { useOTP } from '@/hooks/useOTP';
// import { useNavigate } from 'react-router-dom'; // Xóa nếu không dùng

export default function ResetVerifyOTPForm({
    email,
    onSuccess,
}: {
    email: string;
    onSuccess?: (otp: string) => void;
}) {
    const { verify } = useOTP();
    // const navigate = useNavigate(); // Xóa dòng này
    const { register, handleSubmit, formState: { errors } } = useForm<VerifyOTPData>({
        resolver: zodResolver(verifyOTPSchema),
        defaultValues: { email },
    });
    const onSubmit = (data: VerifyOTPData) => {
        verify.mutate(data, {
            onSuccess: () => {
                onSuccess?.(data.otp);
                // Xóa dòng sau: navigate('/reset-password-complete', { state: { email: data.email, otp: data.otp } });
            },
        });
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <p className="text-sm text-center text-muted-foreground">
                Mã OTP đã được gửi đến <strong>{email}</strong>
            </p>
            <div className="space-y-2">
                <Label htmlFor="otp">Nhập mã OTP</Label>
                <Input id="otp" type="text" placeholder="123456" maxLength={6} {...register('otp')} />
                {errors.otp && <p className="text-sm text-destructive">{errors.otp.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={verify.isPending}>
                {verify.isPending ? 'Đang xác thực ...' : 'Xác thực'}
            </Button>
        </form>
    );
}