
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { completeRegisterSchema, type CompleteRegisterData } from '@/schemas/otp.schema';
import { completeRegister } from '@/api/authApi';
import { showToast } from '@/lib/toast';
import { useLocation, useNavigate } from 'react-router-dom';

export function CompleteRegisterForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = (location.state as { email: string })?.email || '';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CompleteRegisterData>({
        resolver: zodResolver(completeRegisterSchema),
    });

    const onSubmit = async (data: CompleteRegisterData) => {
        const toastId = showToast.loading('Đang hoàn tất...');
        try {
            await completeRegister({ ...data, email });
            showToast.dismiss(toastId);
            showToast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err: any) {
            showToast.dismiss(toastId);
            showToast.error(err.response?.data?.message || 'Đăng ký thất bại');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <p className="text-sm text-center text-muted-foreground">
                Hoàn tất đăng ký cho <strong>{email}</strong>
            </p>

            <div className="space-y-2">
                <Label htmlFor="name">Họ tên</Label>
                <Input id="name" type="text" placeholder="Nguyễn Văn A" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
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
                {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
            </Button>
        </form>
    );
}