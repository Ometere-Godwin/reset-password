"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TextField, Button, Typography, Alert, Card, InputAdornment } from '@mui/material';
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
    if (!token) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authApi.passwordResetConfirm(token, password);
      setSuccess(response.message || 'Your password has been successfully reset.');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        router.replace('/login');
      }, 3000);
    } catch (error: unknown) {
      const apiError = error instanceof Error ? error : new Error('Unknown error');
      console.error('Password reset error:', apiError);
      setError(
        'message' in apiError ? apiError.message : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#00694B',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card sx={{
        maxWidth: 400,
        width: '100%',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <Typography variant="h4" component="h1" sx={{ color: '#00694B', fontWeight: 'bold' }}>
          FinArchitect
        </Typography>
        
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Set your new password
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#00694B' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#00694B' }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !token}
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: '#E0E0E0',
              color: '#000',
              '&:hover': {
                bgcolor: '#D0D0D0',
              }
            }}
          >
            {loading ? 'RESETTING PASSWORD...' : 'RESET PASSWORD'}
          </Button>
        </form>

        <style jsx>{`
          .login-link {
            color: #00694B;
            text-decoration: none;
          }
          .login-link:hover {
            text-decoration: underline;
          }
        `}</style>

        <Link href="/login" className="login-link">
          Back to Login
        </Link>
      </Card>
    </div>
  );
}
