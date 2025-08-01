"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import UploadDropzone from '@/components/dashboard/UploadDropzone'
import { DocumentTextIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline'

// Mock lease data for now
const mockLeases = [
  {
    id: '1',
    tenant_name: 'John Doe',
    property_address: '123 Main St, Apt 4B',
    monthly_rent: '$2,100',
    lease_start: '2025-01-01',
    lease_end: '2025-12-31',
    due_date: '1st of each month',
    late_fee: '$50 after 5 days',
    created_at: '2024-12-15'
  },
  {
    id: '2',
    tenant_name: 'Sarah Wilson',
    property_address: '456 Oak Ave, Unit 12',
    monthly_rent: '$1,800',
    lease_start: '2024-11-01',
    lease_end: '2025-10-31',
    due_date: '1st of each month',
    late_fee: '$75 after 3 days',
    created_at: '2024-11-01'
  }
]

export default function LeasesPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileUpload = async (file: File) => {
    setLoading(true)
    setMessage('')

    try {
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('leases')
        .upload(fileName, file)

      if (error) throw error

      // For now, just show success message
      // Later we'll add AI parsing and database storage
      setMessage('Lease uploaded successfully! AI analysis will be available soon.')
      
      // Mock: Add to leases list
      const newLease = {
        id: Date.now().toString(),
        tenant_name: 'New Tenant',
        property_address: 'New Property',
        monthly_rent: '$0',
        lease_start: new Date().toISOString().split('T')[0],
        lease_end: '2025-12-31',
        due_date: '1st of each month',
        late_fee: '$50 after 5 days',
        created_at: new Date().toISOString().split('T')[0]
      }
      
      mockLeases.unshift(newLease)
    } catch (error) {
      setMessage('Error uploading file. Please try again.')
      console.error('Upload error:', error)
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
            message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Leases List */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Leases</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {mockLeases.map((lease) => (
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
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <p>{lease.property_address}</p>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <p className="mr-4">Rent: {lease.monthly_rent}</p>
                          <p className="mr-4">Due: {lease.due_date}</p>
                          <p>Late Fee: {lease.late_fee}</p>
                        </div>
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
                      <p>Uploaded: {lease.created_at}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 