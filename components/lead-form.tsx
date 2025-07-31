'use client';

import { useState } from 'react';

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    unitsManaged: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Integrate with ConvertKit or Supabase
    // For now, just simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', unitsManaged: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="text-lg font-semibold text-green-300 mb-2">You're on the list!</h3>
        <p className="text-indigo-200/65">We'll notify you when Stayll launches. Thanks for your interest!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter your full name"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter your email address"
        />
      </div>
      
      <div>
        <label htmlFor="unitsManaged" className="block text-sm font-medium text-gray-200 mb-2">
          Units Managed
        </label>
        <select
          id="unitsManaged"
          name="unitsManaged"
          value={formData.unitsManaged}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Select number of units</option>
          <option value="1-5">1-5 units</option>
          <option value="6-10">6-10 units</option>
          <option value="11-20">11-20 units</option>
          <option value="21-50">21-50 units</option>
          <option value="50+">50+ units</option>
        </select>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn group bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative inline-flex items-center">
          {isSubmitting ? 'Joining...' : 'Join Beta Waitlist'}
          {!isSubmitting && (
            <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
              -&gt;
            </span>
          )}
        </span>
      </button>
      
      <p className="text-xs text-indigo-200/50 text-center">
        We'll never spam you. Unsubscribe at any time.
      </p>
    </form>
  );
} 