'use client';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SignUpFormProps {
  className?: string;
}

export default function SignUpForm({ className = '' }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      setSuccess('');

      // Validation
      if (!formData.name || !formData.company || !formData.email || !formData.password) {
        setError('All fields are required');
        return;
      }

      if (formData.password.length < 10) {
        setError('Password must be at least 10 characters long');
        return;
      }

      if (!supabase) {
        setError('Authentication service not available');
        return;
      }

      // Get the correct site URL for email redirect
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const emailRedirectUrl = `${siteUrl}/auth/callback`;

      console.log('Signing up with email redirect to:', emailRedirectUrl);

      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            company_name: formData.company,
          },
          emailRedirectTo: emailRedirectUrl
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        setError(signUpError.message || 'Failed to create account');
        return;
      }

      if (data.user && !data.session) {
        // Email confirmation required
        setSuccess('Account created successfully! Please check your email for a confirmation link.');
        setFormData({ name: '', company: '', email: '', password: '' });
      } else if (data.session) {
        // Auto-confirmed, redirect to dashboard
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }

    } catch (error) {
      console.error('Sign up error:', error);
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
            htmlFor="name"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input w-full"
            placeholder="Your full name"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium text-indigo-200/65"
            htmlFor="company"
          >
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleInputChange}
            className="form-input w-full"
            placeholder="Your company name"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium text-indigo-200/65"
            htmlFor="email"
          >
            Work Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input w-full"
            placeholder="Your work email"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-indigo-200/65"
            htmlFor="password"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input w-full"
            placeholder="Password (at least 10 characters)"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-green-400 text-sm">{success}</p>
        </div>
      )}

      <div className="mt-6 space-y-5">
        <button 
          type="submit"
          disabled={isLoading}
          className="btn w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </div>
    </form>
  );
} 