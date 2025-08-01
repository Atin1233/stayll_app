'use client';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SignInFormProps {
  className?: string;
}

export default function SignInForm({ className = '' }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');

      // Validation
      if (!formData.email || !formData.password) {
        setError('Email and password are required');
        return;
      }

      if (!supabase) {
        setError('Authentication service not available');
        return;
      }

      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        setError(signInError.message || 'Failed to sign in');
        return;
      }

      if (data.user) {
        // Successfully signed in, redirect to dashboard
        router.push('/');
      }

    } catch (error) {
      console.error('Sign in error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`mx-auto max-w-[400px] ${className}`}>
      <div className="space-y-5">
        <div>
          <label
            className="mb-1 block text-sm font-medium text-indigo-200/65"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input w-full"
            placeholder="Your email"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-indigo-200/65"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input w-full"
            placeholder="Your password"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="mt-6 space-y-5">
        <button 
          type="submit"
          disabled={isLoading}
          className="btn w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing In...' : 'Sign in'}
        </button>
      </div>
    </form>
  );
} 