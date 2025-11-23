import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { Toaster } from 'react-hot-toast';
import AuthCallbackPage from './pages/AuthCallbackPage';

function App() {
  return (
    <>
    <Toaster position='top-center' reverseOrder={false} />  
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AuthLayout>
              <AuthPage />
            </AuthLayout>
          } />
          <Route path="/auth/callback" element={
            <AuthCallbackPage />
          } />
          <Route path='/forgot-password' element={
            <AuthLayout>
              <ForgotPasswordPage />
            </AuthLayout>
          } />
          <Route path='/reset-password' element={
            <AuthLayout>
              <ResetPasswordPage />
            </AuthLayout>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AuthLayout>
                <DashboardPage />
              </AuthLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
