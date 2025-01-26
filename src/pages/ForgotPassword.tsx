import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { forgotPasswordSchema, resetPasswordSchema } from '../lib/validation';
import { apiService } from '../api/apiService';

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');

  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    try {
      const validated = forgotPasswordSchema.parse({ email });
      setIsLoading(true);
      
      // TODO: Replace with your API endpoint
      const response = await apiService.post('/forgot', validated);

      if (response.status === 200) {
        toast.success('Reset instructions sent to your email');
        setStep('reset');
      } else {
        const error = response.data;
        toast.error(error.message || 'Something went wrong');
      }
    } catch (error: any) {
      if (error.errors) {
        const formErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            formErrors[err.path[0]] = err.message;
          }
        });
        setErrors(formErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const token = formData.get('token') as string;
    const data = {
      token: formData.get('token') as string,
      password: formData.get('password') as string,
    };

    try {
      const validated = resetPasswordSchema.parse(data);
      setIsLoading(true);
      
      // TODO: Replace with your API endpoint
      const response = await apiService.post(`/reset/`, validated);

      if (response.status === 200) {
      toast.success('Password reset successfully');
      // Redirect to sign in page
      window.location.href = '/signin';
      } else {
      const error = response.data;
      toast.error(error.message || 'Invalid token');
      }
    } catch (error: any) {
      if (error.errors) {
      const formErrors: Record<string, string> = {};
      error.errors.forEach((err: any) => {
        if (err.path) {
        formErrors[err.path[0]] = err.message;
        }
      });
      setErrors(formErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === 'request' ? "Forgot Password" : "Reset Password"}
      subtitle={step === 'request' 
        ? "Enter your email to receive reset instructions"
        : "Enter the token from your email and your new password"
      }
    >
      {step === 'request' ? (
        <form onSubmit={handleRequestReset} className="space-y-6">
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={errors.email}
          />
          <Button type="submit" isLoading={isLoading}>
            Send Reset Instructions
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <Input
            label="Reset Token"
            name="token"
            type="text"
            required
            error={errors.token}
          />
          <Input
            label="New Password"
            name="password"
            type="password"
            required
            error={errors.password}
          />
          <Button type="submit" isLoading={isLoading}>
            Reset Password
          </Button>
        </form>
      )}
      <p className="mt-4 text-center text-sm text-gray-600">
        Remember your password?{' '}
        <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}