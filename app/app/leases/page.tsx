"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/hooks/useUser'
import { DocumentTextIcon, EyeIcon, TrashIcon, CheckCircleIcon, ExclamationTriangleIcon, SparklesIcon, CogIcon, ChartBarIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline'
import STAYLLAnalysisDisplay from '@/components/STAYLLAnalysisDisplay'

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
  const [activeTab, setActiveTab] = useState<'analysis' | 'portfolio' | 'reports' | 'settings'>('analysis')
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

  const analyzeWithSTAYLL = async () => {
    if (!selectedFile || !user) return

    setLoading(true)
    setMessage('Initializing STAYLL AI analysis engine...')
    setMessageType('info')
    setAnalysisResult(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('propertyType', 'residential')

      console.log('Starting STAYLL AI analysis for:', selectedFile.name)

      const response = await fetch('/api/stayll-analyze', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      console.log('STAYLL AI Analysis result:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze lease with STAYLL AI')
      }

      setAnalysisResult(result)
      setMessage(`Analysis complete. Risk level: ${result.analysis?.risk_analysis?.risk_level || 'unknown'}`)
      setMessageType('success')
      
    } catch (error: any) {
      console.error('STAYLL AI Analysis error:', error)
      setMessage(`Analysis failed: ${error.message}`)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const testBasicAnalysis = async () => {
    if (!selectedFile) return

    setLoading(true)
    setMessage('Executing PDF parsing validation...')
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
      setMessage(`PDF parsing validation complete. Confidence: ${result.analysis?.confidence || 0}%`)
      setMessageType('success')
      
    } catch (error: any) {
      console.error('Basic analysis error:', error)
      setMessage(`PDF parsing failed: ${error.message}`)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const testStorage = async () => {
    try {
      setMessage('Validating storage infrastructure...')
      setMessageType('info')
      
      const response = await fetch('/api/test-storage')
      const result = await response.json()
      
      if (response.ok) {
        setMessage(`Storage validation successful: ${result.message}`)
        setMessageType('success')
      } else {
        setMessage(`Storage validation failed: ${result.error}`)
        setMessageType('error')
      }
    } catch (error: any) {
      setMessage(`Storage validation error: ${error.message}`)
      setMessageType('error')
    }
  }

  const setupStorage = async () => {
    try {
      setMessage('Initializing storage infrastructure...')
      setMessageType('info')
      
      const response = await fetch('/api/setup-storage', { method: 'POST' })
      const result = await response.json()
      
      if (response.ok) {
        setMessage(`Storage initialization: ${result.message}`)
        setMessageType('success')
      } else {
        setMessage(`Storage initialization failed: ${result.error}`)
        setMessageType('error')
      }
    } catch (error: any) {
      setMessage(`Storage initialization error: ${error.message}`)
      setMessageType('error')
    }
  }

  const checkStoragePolicies = async () => {
    try {
      setMessage('Analyzing storage security policies...')
      setMessageType('info')
      
      const response = await fetch('/api/check-storage-policies')
      const result = await response.json()
      
      if (response.ok && result.success) {
        setMessage(`Security policy validation: ${result.uploadTest.success ? 'All policies compliant' : 'Policy violations detected'}`)
        setMessageType('success')
      } else {
        setMessage(`Security policy analysis failed: ${result.uploadTest?.error || result.error}`)
        setMessageType('error')
        
        if (result.suggestions) {
          console.log('Policy recommendations:', result.suggestions)
        }
      }
    } catch (error: any) {
      setMessage(`Policy analysis error: ${error.message}`)
      setMessageType('error')
    }
  }

  const diagnoseStorage = async () => {
    try {
      setMessage('Executing comprehensive infrastructure diagnostics...')
      setMessageType('info')
      
      const response = await fetch('/api/diagnose-storage')
      const result = await response.json()
      
      if (response.ok && result.success) {
        setMessage(`Infrastructure diagnostics: All systems operational`)
        setMessageType('success')
        console.log('Full diagnosis:', result.diagnosis)
      } else {
        const summary = result.summary || {}
        const issues = []
        if (!summary.bucket_listing_works) issues.push('Bucket enumeration failure')
        if (!summary.leases_bucket_exists) issues.push('Storage container missing')
        if (!summary.uploads_work) issues.push('Write permissions blocked')
        
        setMessage(`Infrastructure issues detected: ${issues.join(', ')}`)
        setMessageType('error')
        
        if (result.diagnosis?.recommendations) {
          console.log('Infrastructure recommendations:', result.diagnosis.recommendations)
        }
        
        console.log('Full infrastructure diagnosis:', result)
      }
    } catch (error: any) {
      setMessage(`Diagnostic execution error: ${error.message}`)
      setMessageType('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enterprise Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">STAYLL Enterprise Lease Intelligence Platform</h1>
              <p className="mt-1 text-sm text-gray-500">
                Advanced AI-powered lease analysis and portfolio management
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <ChartBarIcon className="h-4 w-4 mr-1" />
                {leases.length} Active Leases
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                Enterprise Security
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'analysis', name: 'Lease Analysis', icon: DocumentTextIcon },
              { id: 'portfolio', name: 'Portfolio Overview', icon: ChartBarIcon },
              { id: 'reports', name: 'Risk Reports', icon: ShieldCheckIcon },
              { id: 'settings', name: 'System Configuration', icon: CogIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'analysis' && (
          <div className="space-y-8">
            {/* Analysis Engine Section */}
            <div className="bg-white shadow-lg rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Advanced Lease Analysis Engine</h2>
                  <button
                    onClick={() => setShowDebug(!showDebug)}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <CogIcon className="h-4 w-4 mr-1" />
                    {showDebug ? 'Hide' : 'Show'} System Diagnostics
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* File Upload Interface */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Upload
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>

                {selectedFile && (
                  <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Selected Document: {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Size: {Math.round(selectedFile.size / 1024)} KB | Type: PDF
                        </p>
                      </div>
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                )}

                {/* Analysis Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={analyzeWithSTAYLL}
                    disabled={!selectedFile || loading}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-md hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    {loading ? 'Executing Analysis...' : 'Execute STAYLL AI Analysis'}
                  </button>

                  <button
                    onClick={testBasicAnalysis}
                    disabled={!selectedFile || loading}
                    className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    {loading ? 'Validating...' : 'Validate PDF Parsing'}
                  </button>
                </div>

                {/* System Diagnostics */}
                {showDebug && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">System Infrastructure Diagnostics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={testStorage}
                        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                      >
                        <CogIcon className="h-4 w-4 mr-1" />
                        Validate Storage
                      </button>

                      <button
                        onClick={setupStorage}
                        className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
                      >
                        <CogIcon className="h-4 w-4 mr-1" />
                        Initialize Storage
                      </button>

                      <button
                        onClick={checkStoragePolicies}
                        className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
                      >
                        <ShieldCheckIcon className="h-4 w-4 mr-1" />
                        Security Policies
                      </button>

                      <button
                        onClick={diagnoseStorage}
                        className="flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                      >
                        <CogIcon className="h-4 w-4 mr-1" />
                        Full Diagnostics
                      </button>
                    </div>
                  </div>
                )}

                {/* Status Messages */}
                {message && (
                  <div className={`mt-4 p-4 rounded-md border ${
                    messageType === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 
                    messageType === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    <div className="flex items-center">
                      {messageType === 'error' ? (
                        <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                      ) : messageType === 'success' ? (
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                      ) : (
                        <ClockIcon className="h-4 w-4 mr-2" />
                      )}
                      <span className="text-sm font-medium">{message}</span>
                    </div>
                  </div>
                )}

                {/* Analysis Results */}
                {analysisResult && analysisResult.analysis && (
                  <div className="mt-6">
                    <STAYLLAnalysisDisplay analysis={analysisResult} />
                  </div>
                )}

                {/* Debug Results */}
                {showDebug && analysisResult && (
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <h3 className="font-medium text-gray-900 mb-2">System Response Data:</h3>
                    <div className="text-sm text-gray-700">
                      <pre className="whitespace-pre-wrap overflow-auto max-h-64">
                        {JSON.stringify(analysisResult, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Portfolio Overview */}
            <div className="bg-white shadow-lg rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Lease Portfolio Management</h2>
              </div>
              
              <div className="p-6">
                {leases.length === 0 ? (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No analyzed leases</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload your first lease document to begin portfolio analysis.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tenant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monthly Rent
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lease Term
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {leases.map((lease) => (
                          <tr key={lease.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {lease.tenant_name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{lease.property_address}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{lease.monthly_rent}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {lease.lease_start} - {lease.lease_end}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {lease.confidence_score && lease.confidence_score >= 70 ? (
                                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                                ) : (
                                  <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 mr-1" />
                                )}
                                <span className="text-xs text-gray-500">
                                  {lease.confidence_score || 0}% confidence
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Overview</h2>
            <p className="text-gray-500">Advanced portfolio analytics and risk assessment dashboard coming soon.</p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Reports</h2>
            <p className="text-gray-500">Comprehensive risk analysis and compliance reporting system coming soon.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Configuration</h2>
            <p className="text-gray-500">Advanced system settings and integration management coming soon.</p>
          </div>
        )}
      </div>
    </div>
  )
} 