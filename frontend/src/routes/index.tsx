import type { RouteObject } from 'react-router-dom';
import Home from '@/pages/Home';
import BookDetailPage from '@/pages/BookDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ResetPasswordFlow from '@/pages/ResetPasswordFlow';
import CartPage from '@/pages/CartPage';
import PaymentPage from '@/pages/PaymentPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';
import OrderFailurePage from '@/pages/OrderFailurePage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPage from '@/pages/AdminPage'; // Import trang admin
import ShopPage from '@/pages/ShopPage';

export const routes: RouteObject[] = [
    { path: '/', element: <Home /> },
    { path: '/book/:id', element: <BookDetailPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/reset-password', element: <ResetPasswordFlow /> },
    { path: '/cart', element: <CartPage /> },
    { path: '/checkout', element: <PaymentPage /> },
    { path: '/order-success', element: <OrderSuccessPage /> },
    { path: '/order-failure', element: <OrderFailurePage /> },
    { path: '/profile', element: <ProfilePage /> },
    { path: '/admin', element: <AdminPage /> }, // Thêm route admin
    { path: '/shop', element: <ShopPage /> }
];