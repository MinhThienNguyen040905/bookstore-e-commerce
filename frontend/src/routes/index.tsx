import type { RouteObject } from 'react-router-dom';
import Home from '@/pages/Home';
import BookDetailPage from '@/pages/BookDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ResetPasswordFlow from '@/pages/ResetPasswordFlow';

export const routes: RouteObject[] = [
    { path: '/', element: <Home/> },
    { path: '/book/:id', element: <BookDetailPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/reset-password', element: <ResetPasswordFlow /> },
];