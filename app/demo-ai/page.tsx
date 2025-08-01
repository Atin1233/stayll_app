'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';

export default function DemoAIPage() {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      setResult(null);
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const analyzeFile = async () => {
    if (!file || !user) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);

      console.log('Starting analysis for file:', file.name, 'Size:', file.size);

      const response = await fetch('/api/analyze-lease', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Analysis response:', data);

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze file. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const testBasicAnalysis = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Testing basic PDF analysis...');

      const response = await fetch('/api/test-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Basic analysis response:', data);

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Basic analysis failed');
      }
    } catch (err) {
      console.error('Basic analysis error:', err);
      setError('Failed to test basic analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const testStorage = async () => {
    try {
      const response = await fetch('/api/test-storage');
      const data = await response.json();
      console.log('Storage test response:', data);
      alert(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Storage test error:', err);
      alert('Storage test failed');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-200 mb-4">Please sign in to test AI analysis</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🤖 AI Lease Analysis Demo</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">📄 Upload Lease PDF</h2>
            
            <div className="mb-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              />
            </div>

            {file && (
              <div className="mb-4 p-3 bg-gray-700 rounded">
                <p className="text-sm">
                  <strong>Selected:</strong> {file.name} ({Math.round(file.size / 1024)} KB)
                </p>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={analyzeFile}
                disabled={!file || isAnalyzing}
                className="w-full btn bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] disabled:opacity-50"
              >
                {isAnalyzing ? '🤖 Analyzing with AI...' : '🚀 Analyze with AI'}
              </button>

              <button
                onClick={testBasicAnalysis}
                disabled={!file || isAnalyzing}
                className="w-full btn bg-linear-to-t from-gray-600 to-gray-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] disabled:opacity-50"
              >
                {isAnalyzing ? 'Testing...' : '🔍 Test Basic Analysis'}
              </button>

              <button
                onClick={testStorage}
                className="w-full btn bg-linear-to-t from-green-600 to-green-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]"
              >
                🗄️ Test Storage
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">📊 Analysis Results</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded">
                <h3 className="font-semibold text-red-300 mb-2">❌ Error</h3>
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="p-4 bg-green-900 border border-green-700 rounded">
                  <h3 className="font-semibold text-green-300 mb-2">✅ Analysis Complete</h3>
                  <p className="text-green-200">
                    Confidence: <strong>{result.analysis?.confidence || result.confidence || 0}%</strong>
                  </p>
                </div>

                {result.analysis?.data || result.lease ? (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-300">📋 Extracted Data:</h4>
                    <div className="bg-gray-700 p-4 rounded text-sm">
                      <pre className="whitespace-pre-wrap text-gray-200">
                        {JSON.stringify(result.analysis?.data || result.lease, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : null}

                {result.analysis?.raw_text && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-300">📝 Raw Text (first 500 chars):</h4>
                    <div className="bg-gray-700 p-4 rounded text-sm">
                      <p className="text-gray-200">
                        {result.analysis.raw_text.substring(0, 500)}...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!result && !error && (
              <div className="text-center text-gray-400 py-8">
                <p>Upload a PDF lease to see AI analysis results</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">ℹ️ About AI Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-indigo-300 mb-2">🤖 AI Features:</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Uses Hugging Face's free AI models</li>
                <li>• Intelligent text classification</li>
                <li>• Fallback to improved regex patterns</li>
                <li>• Confidence scoring</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-300 mb-2">💰 Cost:</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Completely free to use</li>
                <li>• No API costs</li>
                <li>• No subscription required</li>
                <li>• Bootstrap-friendly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 