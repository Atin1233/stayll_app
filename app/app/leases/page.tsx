"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/hooks/useUser'
import UploadDropzone from '@/components/dashboard/UploadDropzone'
import { DocumentTextIcon, EyeIcon, TrashIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface Lease {
  id: string;
  tenant_name: string;
  property_address: string;
  monthly_rent: string;
  lease_start: string;
  lease_end: string;
  due_date: string;
  late_fee: string;
  security_deposit?: string;
  utilities?: string;
  parking?: string;
  pets?: string;
  smoking?: string;
  confidence_score?: number;
  created_at: string;
}

export default function LeasesPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')
  const [leases, setLeases] = useState<Lease[]>([])
  const { user } = useUser()

  // Load existing leases
  useEffect(() => {
    loadLeases()
  }, [])

  const loadLeases = async () => {
    if (!supabase || !user) return

    try {
      const { data, error } = await supabase
        .from('leases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeases(data || [])
    } catch (error) {
      console.error('Error loading leases:', error)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!user) {
      setMessage('Please sign in to upload leases')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')
    setMessageType('info')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)

      const response = await fetch('/api/analyze-lease', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze lease')
      }

      setMessage(`Lease analyzed successfully! Confidence: ${result.analysis.confidence}%`)
      setMessageType('success')
      
      // Reload leases to show the new one
      await loadLeases()
      
    } catch (error: any) {
      setMessage(error.message || 'Error analyzing lease. Please try again.')
      setMessageType('error')
      console.error('Analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Leases</h1>
        <p className="mt-2 text-sm text-gray-600">
          Upload and manage your lease documents with AI-powered analysis.
        </p>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upload New Lease</h2>
        <UploadDropzone onFileUpload={handleFileUpload} loading={loading} />
        {message && (
          <div className={`mt-4 p-4 rounded-md ${
            messageType === 'error' ? 'bg-red-50 text-red-700' : 
            messageType === 'success' ? 'bg-green-50 text-green-700' : 
            'bg-blue-50 text-blue-700'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Leases List */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Leases ({leases.length})</h2>
        {leases.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No leases yet</h3>
            <p className="mt-1 text-sm text-gray-500">Upload your first lease document to get started.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {leases.map((lease) => (
                <li key={lease.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {lease.tenant_name}
                            </p>
                            {lease.confidence_score && (
                              <div className="ml-2 flex items-center">
                                {lease.confidence_score >= 70 ? (
                                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                ) : (
                                  <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                                )}
                                <span className="ml-1 text-xs text-gray-500">
                                  {lease.confidence_score}% confidence
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <p>{lease.property_address}</p>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <p className="mr-4">Rent: {lease.monthly_rent}</p>
                            <p className="mr-4">Due: {lease.due_date}</p>
                            <p>Late Fee: {lease.late_fee}</p>
                          </div>
                          {lease.security_deposit && (
                            <div className="mt-1 text-sm text-gray-500">
                              <p>Security Deposit: {lease.security_deposit}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Lease: {lease.lease_start} to {lease.lease_end}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>Uploaded: {new Date(lease.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
} 