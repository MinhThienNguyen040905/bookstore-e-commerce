// src/components/auth/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { useAuthStore } from '@/store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from '@/lib/toast';

export function LoginForm() {
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // src/components/auth/LoginForm.tsx
    const onSubmit = async (data: LoginFormData) => {
        const toastId = showToast.loading('Đang đăng nhập...');
        try {
            await login(data.email, data.password);
            showToast.dismiss(toastId);
            showToast.success('Đăng nhập thành công!');
            navigate('/');
        } catch (err: unknown) {
            showToast.dismiss(toastId);
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                const msg = axiosError.response?.data?.message || 'Đăng nhập thất bại';
                showToast.error(msg);
            } else {
                showToast.error('Lỗi mạng hoặc server');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register('email')}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-purple-600 hover:underline">
                    Đăng ký ngay
                </Link>
            </p>
        </form>
    );
}