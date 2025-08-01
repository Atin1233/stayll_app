'use client';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function EmailDebug() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');

  const testEmail = async () => {
    if (!email) {
      setResult('Please enter an email address');
      return;
    }

    try {
      setResult('Testing email configuration...');

      if (!supabase) {
        setResult('Supabase client not available');
        return;
      }

      // Test email configuration
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: 'testpassword123',
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setResult(`Error: ${error.message}`);
        return;
      }

      if (data.user && !data.session) {
        setResult(`✅ Email sent successfully! Check your inbox at ${email}`);
      } else if (data.session) {
        setResult(`✅ User auto-confirmed (no email needed)`);
      } else {
        setResult('❌ Unexpected response from Supabase');
      }

    } catch (error) {
      setResult(`❌ Error: ${error}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Email Debug Tool</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Test Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            placeholder="Enter email to test"
          />
        </div>

        <button
          onClick={testEmail}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Test Email Configuration
        </button>

        {result && (
          <div className="p-3 bg-gray-700 rounded-md">
            <p className="text-sm text-gray-300">{result}</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-400">
        <p><strong>Environment Check:</strong></p>
        <p>NEXT_PUBLIC_SITE_URL: {process.env.NEXT_PUBLIC_SITE_URL || 'Not set'}</p>
        <p>Current Origin: {typeof window !== 'undefined' ? window.location.origin : 'Server side'}</p>
      </div>
    </div>
  );
} 