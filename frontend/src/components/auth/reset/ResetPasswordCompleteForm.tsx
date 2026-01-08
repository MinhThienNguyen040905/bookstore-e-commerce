import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPasswordSchema, type ResetPasswordData } from '@/schemas/otp.schema';
import { resetPassword } from '@/api/authApi';
import { showToast } from '@/lib/toast';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordCompleteForm({ email, otp }: { email: string; otp: string }) {
    const navigate = useNavigate();

    // 1. SỬA LỖI HOOK: Gọi useForm TRƯỚC khi return
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
        // Thêm defaultValues để form nhận diện được email và otp ngay từ đầu
        defaultValues: {
            email: email,
            otp: otp,
            newPassword: '',
            confirmPassword: ''
        }
    });

    // 2. Di chuyển đoạn kiểm tra điều kiện xuống dưới Hook
    if (!email || !otp) {
        return <p className="text-red-500 text-center">Invalid Data. Please restart the process.</p>;
    }

    const onSubmit = async (data: ResetPasswordData) => {
        const toastId = showToast.loading('Updating password...');
        try {
            await resetPassword({
                email, // Lấy từ props hoặc data.email
                otp,   // Lấy từ props hoặc data.otp
                newPassword: data.newPassword,
            });
            showToast.dismiss(toastId);
            showToast.success('Password updated successfully! Please login.');
            navigate('/login');
        } catch (err: any) {
            showToast.dismiss(toastId);
            const errorMessage = err.response?.data?.message || 'Failed to update password';
            showToast.error(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Đăng ký các trường ẩn để Zod validation hoạt động đúng */}
            <input type="hidden" {...register('email')} />
            <input type="hidden" {...register('otp')} />

            <div className="space-y-2">
                {/* 3. SỬA LỖI TYPO: classname -> className */}
                <Label htmlFor="newPassword" className="text-stone-600 font-medium">New Password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    {...register('newPassword')}
                    className="h-12 border-stone-300 focus:border-[#0df2d7] focus:ring-[#0df2d7] bg-white rounded-lg"
                />
                {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
            </div>
            <div className="space-y-2">
                {/* 3. SỬA LỖI TYPO: classname -> className */}
                <Label htmlFor="confirmPassword" className="text-stone-600 font-medium">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    {...register('confirmPassword')}
                    className="h-12 border-stone-300 focus:border-[#0df2d7] focus:ring-[#0df2d7] bg-white rounded-lg"
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            <Button
                type="submit"
                className="w-full h-12 bg-[#0df2d7] hover:bg-[#00dcc3] text-stone-900 font-bold text-base tracking-wide rounded-lg shadow-sm"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Updating...' : 'Reset Password'}
            </Button>
        </form>
    );
}