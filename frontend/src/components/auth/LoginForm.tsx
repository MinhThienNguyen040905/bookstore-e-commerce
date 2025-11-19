import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

export function LoginForm() {
    const { login, isLoggingIn } = useAuth();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login({ email: data.email, password: data.password }); // Dùng mutateAsync
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
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
            <div className="text-right">
                <Link
                    to="/reset-password"
                    className="text-sm text-purple-600 hover:underline font-medium"
                >
                    Quên mật khẩu?
                </Link>
            </div>
            <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoggingIn}
            >
                {isLoggingIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
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