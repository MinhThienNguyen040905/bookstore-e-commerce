import { useMutation } from '@tanstack/react-query';
import { login, logout } from '@/api/authApi';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { showToast } from '@/lib/toast';

export const useAuth = () => {
    const { setAccessToken, setUser, clearAuth, user } = useAuthStore(); // Thêm user

    const loginMutation = useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            login(email, password),
        onMutate: () => {
            const toastId = showToast.loading('Đang đăng nhập...');
            return { toastId };
        },
        onSuccess: (data) => {
            console.log('Login mutation success:', data);
            const { accessToken, user } = data;
            setAccessToken(accessToken);
            setUser(user);
            showToast.success('Đăng nhập thành công!');
        },
        onError: (_err, _vars, context) => {
            showToast.dismiss(context?.toastId);
            showToast.error('Đăng nhập thất bại');
        },
    });

    const logoutMutation = useMutation({
        mutationFn: logout,
        onMutate: () => {
            const toastId = showToast.loading('Đang đăng xuất...');
            return { toastId };
        },
        onSuccess: () => {
            clearAuth();
            showToast.success('Đăng xuất thành công');
        },
        onError: (_err, _vars, context) => {
            showToast.dismiss(context?.toastId);
            showToast.error('Lỗi đăng xuất');
            clearAuth();
        },
    });

    return {
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
        user, // Trả về user từ store
    };
};