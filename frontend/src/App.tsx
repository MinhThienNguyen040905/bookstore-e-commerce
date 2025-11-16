import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import BookDetailPage from './pages/BookDetailPage';
import LoginPage from './pages/LoginPage';

import ResetPasswordCompletePage from './pages/ResetPasswordCompletePage';
import RegisterVerifyOTPPage from './pages/RegisterVerifyOTPPage';
import ResetPasswordVerifyPage from './pages/ResetPasswordVerifyPage';
import RegisterOTPPage from './pages/RegisterOTPPage';

import CompleteRegisterPage from './pages/CompleteRegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
function App() {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  })


  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/register-otp" element={<RegisterOTPPage />} />

          <Route path="/complete-register" element={<CompleteRegisterPage />} />

          <Route path="/reset-password-complete" element={<ResetPasswordCompletePage />} />

          <Route path="/register-otp" element={<RegisterOTPPage />} />
          <Route path="/register-verify-otp" element={<RegisterVerifyOTPPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/reset-password-verify" element={<ResetPasswordVerifyPage />} />
          {/* Thêm routes khác */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
