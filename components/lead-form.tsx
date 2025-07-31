'use client';

import { useState } from 'react';

export default function LeadForm() {
  const [formData, setFormData] = useState({
    email: '',
    company: '',
    role: '',
    leaseCount: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('company', formData.company);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('leaseCount', formData.leaseCount);
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setIsSubmitted(true);

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ email: '', company: '', role: '', leaseCount: '' });
        setSelectedFile(null);
      }, 5000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="text-lg font-semibold text-green-300 mb-2">You're on the list!</h3>
        <p className="text-blue-200/65">We'll notify you when Stayll launches. Thanks for your interest!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your email address"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-200 mb-2">
          Company
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Your company name"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-200 mb-2">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select your role</option>
          <option value="Property Manager">Property Manager</option>
          <option value="Multifamily Owner">Multifamily Owner</option>
          <option value="Commercial Landlord">Commercial Landlord</option>
          <option value="Legal Team">Legal Team</option>
          <option value="Due Diligence Analyst">Due Diligence Analyst</option>
          <option value="Investment Team">Investment Team</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="leaseCount" className="block text-sm font-medium text-gray-200 mb-2">
          Number of Leases You Manage
        </label>
        <select
          id="leaseCount"
          name="leaseCount"
          value={formData.leaseCount}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select range</option>
          <option value="1-10">1-10 leases</option>
          <option value="11-50">11-50 leases</option>
          <option value="51-200">51-200 leases</option>
          <option value="201-500">201-500 leases</option>
          <option value="500+">500+ leases</option>
        </select>
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-200 mb-2">
          Upload a Lease (Optional)
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30"
        />
        <p className="text-xs text-blue-200/50 mt-1">
          PDF, Word documents accepted. We'll analyze it for free!
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn group bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative inline-flex items-center">
          {isSubmitting ? 'Joining...' : 'Join Early Access'}
          {!isSubmitting && (
            <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
              -&gt;
            </span>
          )}
        </span>
      </button>

      <p className="text-xs text-blue-200/50 text-center">
        We'll never spam you. Unsubscribe at any time.
      </p>
    </form>
  );
} 