'use client';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';

interface GoogleSignInProps {
  mode: 'signin' | 'signup';
  className?: string;
}

export default function GoogleSignIn({ mode, className = '' }: GoogleSignInProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      if (!supabase) {
        alert('Authentication service not available. Please try again.');
        return;
      }

      // Get the correct site URL for redirect
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const redirectUrl = `${siteUrl}/auth/callback`;

      console.log('Redirecting to:', redirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('Google sign in error:', error);
        alert('Failed to sign in with Google. Please try again.');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      alert('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`btn relative w-full bg-linear-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%] ${className}`}
    >
      {isLoading ? (
        <span>Signing in...</span>
      ) : (
        <span>Sign {mode === 'signin' ? 'In' : 'Up'} with Google</span>
      )}
    </button>
  );
} 