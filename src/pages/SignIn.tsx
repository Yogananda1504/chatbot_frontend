import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { signInSchema } from '../lib/validation';
import { apiService } from '../api/apiService';

export function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const validated = signInSchema.parse(data);
      setIsLoading(true);
      
      const response = await apiService.post('/signin', validated);

      if (response.data) {
      toast.success('Signed in successfully!');
      navigate('/chat');
      }
    } catch (error: any) {
      if (error.response) {
      toast.error(error.response.data.message || 'Invalid credentials');
      } else if (error.errors) {
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          name="email"
          type="email"
          required
          error={errors.email}
        />
        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          required
          error={errors.password}
        />
        <button type="button" onClick={togglePasswordVisibility} className="text-sm text-blue-600">
          {showPassword ? 'Hide Password' : 'Show Password'}
        </button>
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </Link>
        </div>
        <Button type="submit" isLoading={isLoading}>
          Sign In
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}