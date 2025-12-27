import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { completeRegisterSchema, type CompleteRegisterData } from '@/schemas/otp.schema';
import { completeRegister } from '@/api/authApi';
import { showToast } from '@/lib/toast';
import { useNavigate } from 'react-router-dom';

export default function CompleteRegisterForm({ email }: { email: string }) {
    const navigate = useNavigate();
    if (!email) {
        return <p className="text-destructive">Email không hợp lệ. Vui lòng quay lại bước đăng ký.</p>;
    }

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
            // Chỉ gửi các field cần thiết, bỏ confirmPassword
            await completeRegister({
                name: data.name,
                email,
                password: data.password,
            });
            showToast.dismiss(toastId);
            showToast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err: any) {
            showToast.dismiss(toastId);
            showToast.error(err.response?.data?.message || 'Đăng ký thất bại');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-stone-600 font-medium">Full Name</Label>
                <Input id="name" {...register('name')} className="h-12 border-stone-300 focus:border-[#0df2d7] focus:ring-[#0df2d7] rounded-lg" placeholder="Jane Doe" />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="password" classname="text-stone-600 font-medium">Password</Label>
                <Input id="password" type="password" {...register('password')} className="h-12 border-stone-300 focus:border-[#0df2d7] focus:ring-[#0df2d7] rounded-lg" placeholder="Create a password" />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword" classname="text-stone-600 font-medium">Confirm Password</Label>
                <Input id="confirmPassword" type="password" {...register('confirmPassword')} className="h-12 border-stone-300 focus:border-[#0df2d7] focus:ring-[#0df2d7] rounded-lg" placeholder="Confirm password" />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full h-12 bg-[#0df2d7] hover:bg-[#00dcc3] text-stone-900 font-bold text-base rounded-lg" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Complete Registration'}
            </Button>
        </form>
    );
}