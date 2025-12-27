import { useMutation } from '@tanstack/react-query';
import { login, logout, updateProfile } from '@/api/authApi';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { showToast } from '@/lib/toast';

export const useAuth = () => {
    const { setAccessToken, setUser, updateUser, clearAuth, user } = useAuthStore(); // Lấy updateUser

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

    // Mutation cập nhật thông tin
    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onMutate: () => {
            // Return toastId để có thể dismiss hoặc update sau này
            return { toastId: showToast.loading('Đang cập nhật...') };
        },
        onSuccess: (data, variables, context) => {
            // Backend trả về data.data là object user mới (tùy cấu trúc res.success của bạn)
            // Giả sử backend trả về: { success: true, data: { ...user info } }
            const updatedUser = data.data || data;

            updateUser(updatedUser); // Cập nhật Store

            showToast.dismiss(context?.toastId);
            showToast.success('Cập nhật hồ sơ thành công!');
        },
        onError: (err: any, variables, context) => {
            showToast.dismiss(context?.toastId);
            showToast.error(err.response?.data?.message || 'Cập nhật thất bại');
        },
    });

    return {
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
        user, // Trả về user từ store
        updateProfile: updateProfileMutation.mutate,
        isUpdating: updateProfileMutation.isPending,
    };
};