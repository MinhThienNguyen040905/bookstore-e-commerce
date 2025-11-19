import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { resetPassword } from '@/api/authApi';
import { showToast } from '@/lib/toast';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
    newPassword: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordCompleteForm({ email, otp }: { email: string; otp: string }) {
    const navigate = useNavigate();
    if (!email || !otp) {
        return <p className="text-destructive">Dữ liệu không hợp lệ. Vui lòng quay lại bước xác thực.</p>;
    }

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        const toastId = showToast.loading('Đang đổi mật khẩu...');
        try {
            await resetPassword({ email, otp, newPassword: data.newPassword });
            showToast.dismiss();
            showToast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err: any) {
            showToast.dismiss();
            showToast.error(err.response?.data?.message || 'Đổi mật khẩu thất bại');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <p className="text-sm text-center text-muted-foreground">
                Đặt mật khẩu mới cho <strong>{email}</strong>
            </p>
            <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input id="newPassword" type="password" placeholder="••••••••" {...register('newPassword')} />
                {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </Button>
        </form>
    );
}