"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from '@mui/icons-material';
import { authApi } from '../../services/api';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await authApi.passwordResetConfirm(token, password);
      setSuccess(response.message);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while resetting your password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-[#00694B] flex items-center justify-center">
      <div className="w-full max-w-[400px] bg-white p-8 rounded-lg shadow-lg mx-4">
        <div className="text-center mb-6">
          <h1 className="text-[#00694B] text-2xl font-medium mb-2">
            FinArchitect
          </h1>
          <p className="text-gray-600 text-base">
            Set your new password
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-[#FFEBEE] text-[#D32F2F] rounded-md flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-md flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-[#00694B]" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="New Password *"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00694B] focus:border-[#00694B] placeholder-gray-500"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-[#00694B]" />
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm New Password *"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00694B] focus:border-[#00694B] placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full py-3 bg-[#E0E0E0] text-gray-600 rounded-md hover:bg-[#D0D0D0] disabled:bg-[#E0E0E0] disabled:text-gray-600 uppercase"
          >
            Reset Password
          </button>

          <div className="text-center">
            <a
              href="/login"
              className="text-[#00694B] text-sm no-underline hover:underline"
            >
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
