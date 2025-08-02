"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/hooks/useUser'
import { DocumentTextIcon, EyeIcon, TrashIcon, CheckCircleIcon, ExclamationTriangleIcon, SparklesIcon, CogIcon } from '@heroicons/react/24/outline'

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
      setMessage('')
      setAnalysisResult(null)
    } else {
      setMessage('Please select a valid PDF file')
      setMessageType('error')
      setSelectedFile(null)
    }
  }

  const analyzeWithAI = async () => {
    if (!selectedFile || !user) return

    setLoading(true)
    setMessage('🤖 Starting AI analysis...')
    setMessageType('info')
    setAnalysisResult(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('userId', user.id)

      console.log('Starting AI analysis for:', selectedFile.name)

      const response = await fetch('/api/analyze-lease', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      console.log('AI Analysis result:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze lease')
      }

      setAnalysisResult(result)
      setMessage(`✅ AI Analysis Complete! Confidence: ${result.analysis?.confidence || result.confidence || 0}%`)
      setMessageType('success')
      
      // Reload leases to show the new one
      await loadLeases()
      
    } catch (error: any) {
      console.error('AI Analysis error:', error)
      setMessage(`❌ AI Analysis failed: ${error.message}`)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const testBasicAnalysis = async () => {
    if (!selectedFile) return

    setLoading(true)
    setMessage('🔍 Testing basic analysis...')
    setMessageType('info')
    setAnalysisResult(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/test-pdf', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      console.log('Basic analysis result:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Basic analysis failed')
      }

      setAnalysisResult(result)
      setMessage(`✅ Basic Analysis Complete! Confidence: ${result.analysis?.confidence || 0}%`)
      setMessageType('success')
      
    } catch (error: any) {
      console.error('Basic analysis error:', error)
      setMessage(`❌ Basic analysis failed: ${error.message}`)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const testStorage = async () => {
    try {
      setMessage('🗄️ Testing storage...')
      setMessageType('info')
      
      const response = await fetch('/api/test-storage')
      const result = await response.json()
      
      if (response.ok) {
        setMessage(`✅ Storage OK: ${result.message}`)
        setMessageType('success')
      } else {
        setMessage(`❌ Storage Error: ${result.error}`)
        setMessageType('error')
      }
    } catch (error: any) {
      setMessage(`❌ Storage test failed: ${error.message}`)
      setMessageType('error')
    }
  }

  const setupStorage = async () => {
    try {
      setMessage('🔧 Setting up storage...')
      setMessageType('info')
      
      const response = await fetch('/api/setup-storage', { method: 'POST' })
      const result = await response.json()
      
      if (response.ok) {
        setMessage(`✅ Storage Setup: ${result.message}`)
        setMessageType('success')
      } else {
        setMessage(`❌ Storage Setup Error: ${result.error}`)
        setMessageType('error')
      }
    } catch (error: any) {
      setMessage(`❌ Storage setup failed: ${error.message}`)
      setMessageType('error')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">🤖 AI Lease Analysis</h1>
        <p className="mt-2 text-sm text-gray-600">
          Upload lease PDFs and get instant AI-powered analysis of key terms and conditions.
        </p>
      </div>

      {/* Upload & Analysis Section */}
      <div className="mb-8 bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Upload & Analyze Lease</h2>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <CogIcon className="h-4 w-4 mr-1" />
            {showDebug ? 'Hide' : 'Show'} Debug
          </button>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>

        {selectedFile && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <strong>Selected:</strong> {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </p>
          </div>
        )}

        {/* Analysis Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={analyzeWithAI}
            disabled={!selectedFile || loading}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SparklesIcon className="h-4 w-4 mr-2" />
            {loading ? '🤖 Analyzing...' : '🚀 Analyze with AI'}
          </button>

          <button
            onClick={testBasicAnalysis}
            disabled={!selectedFile || loading}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            {loading ? 'Testing...' : '🔍 Test Basic Analysis'}
          </button>

          <button
            onClick={testStorage}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <CogIcon className="h-4 w-4 mr-2" />
            🗄️ Test Storage
          </button>

          <button
            onClick={setupStorage}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <CogIcon className="h-4 w-4 mr-2" />
            🔧 Setup Storage
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`p-4 rounded-md ${
            messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
            messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {message}
          </div>
        )}

        {/* Debug Results */}
        {showDebug && analysisResult && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">🔍 Analysis Results:</h3>
            <div className="text-sm text-gray-700">
              <pre className="whitespace-pre-wrap overflow-auto max-h-64">
                {JSON.stringify(analysisResult, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Leases List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Analyzed Leases ({leases.length})</h2>
        </div>
        
        {leases.length === 0 ? (
          <div className="p-8 text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No leases analyzed yet</h3>
            <p className="mt-1 text-sm text-gray-500">Upload your first lease PDF above to get AI-powered analysis.</p>
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