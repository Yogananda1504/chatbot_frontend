import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { signUpSchema } from '../lib/validation';
import { apiService } from '../api/apiService';

export function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const validated = signUpSchema.parse(data);
      setIsLoading(true);
      
      const response = await apiService.post('/signup', validated);
      toast.success('Account created successfully!');
      navigate('/signin');
    } catch (error: any) {
      if (error.errors) {
        // Handle zod validation errors
        const formErrors: Record<string, string> = {};
        console.log(error.errors);
        error.errors.forEach((err: any) => {
          if (err.path) {
            formErrors[err.path[0]] = err.message;
          }
        });
        setErrors(formErrors);
      } else if (axios.isAxiosError(error)) {
        // Handle axios errors
        toast.error(error.response?.data?.message || 'Something went wrong');
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
      title="Create an account"
      subtitle="Sign up to get started with our platform"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          name="name"
          type="text"
          required
          error={errors.name}
        />
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
        <Button type="submit" isLoading={isLoading}>
          Sign Up
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}