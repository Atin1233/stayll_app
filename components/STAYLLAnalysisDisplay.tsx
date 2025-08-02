import React from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon, ChartBarIcon, ShieldCheckIcon, ClockIcon, CurrencyDollarIcon, DocumentTextIcon, CogIcon } from '@heroicons/react/24/outline';

interface STAYLLAnalysisDisplayProps {
  analysis: any;
}

export default function STAYLLAnalysisDisplay({ analysis }: STAYLLAnalysisDisplayProps) {
  const data = analysis.analysis;
  
  if (!data) {
    return (
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
          <span className="text-sm font-medium text-gray-900">Analysis data not available</span>
        </div>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'critical': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'high': return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case 'medium': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'low': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default: return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Executive Summary</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Base Rent</p>
                  <p className="text-lg font-semibold text-gray-900">{data.lease_summary?.base_rent || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Lease Term</p>
                  <p className="text-lg font-semibold text-gray-900">{data.lease_summary?.lease_term || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Legal Strength</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{data.lease_summary?.legal_strength || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Value</p>
                  <p className="text-lg font-semibold text-gray-900">{data.lease_summary?.total_value || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {getRiskIcon(data.risk_analysis?.risk_level)}
                <span className="ml-2 text-lg font-semibold text-gray-900">
                  Overall Risk Level: {data.risk_analysis?.risk_level || 'Unknown'}
                </span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(data.risk_analysis?.risk_level)}`}>
                Score: {data.risk_analysis?.overall_risk_score || 0}/100
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Risk Factors Identified</h4>
              <div className="space-y-2">
                {data.risk_analysis?.risk_factors?.map((factor: string, index: number) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                    {factor}
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">No significant risk factors identified</p>
                )}
              </div>
            </div>
          </div>

          {data.risk_analysis?.missing_clauses && data.risk_analysis.missing_clauses.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Missing Critical Clauses</h4>
              <div className="space-y-1">
                {data.risk_analysis.missing_clauses.map((clause: string, index: number) => (
                  <div key={index} className="flex items-center text-sm text-yellow-700">
                    <XCircleIcon className="h-4 w-4 text-yellow-600 mr-2 flex-shrink-0" />
                    {clause}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recommended Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                Immediate Actions
              </h4>
              <div className="space-y-2">
                {data.action_items?.immediate?.map((action: string, index: number) => (
                  <div key={index} className="flex items-start text-sm text-gray-700">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {action}
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">No immediate actions required</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-orange-700 mb-3 flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                Upcoming Actions
              </h4>
              <div className="space-y-2">
                {data.action_items?.upcoming?.map((action: string, index: number) => (
                  <div key={index} className="flex items-start text-sm text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {action}
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">No upcoming actions required</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-blue-700 mb-3 flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                Long-term Strategy
              </h4>
              <div className="space-y-2">
                {data.action_items?.long_term?.map((action: string, index: number) => (
                  <div key={index} className="flex items-start text-sm text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {action}
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">No long-term actions required</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Insights */}
      {data.market_insights && (
        <div className="bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Market Intelligence</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Market Comparison</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Your Rent</span>
                    <span className="text-sm font-medium text-gray-900">{data.market_insights?.your_rent || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Market Average</span>
                    <span className="text-sm font-medium text-gray-900">{data.market_insights?.market_average || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Market Position</span>
                    <span className="text-sm font-medium text-gray-900">{data.market_insights?.market_position || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Trend Analysis</h4>
                <div className="space-y-2">
                  {data.market_insights?.trends?.map((trend: string, index: number) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <ChartBarIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {trend}
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500">No trend data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Format Analysis - BRUTAL CRITIQUE */}
      {data.format_analysis && (
        <div className="bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Document Quality Assessment</h3>
          </div>
          <div className="p-6">
            {/* Overall Score */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-lg font-semibold text-gray-900">
                    Document Quality Score: {data.format_analysis.overall_score}/100
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  data.format_analysis.overall_score >= 85 ? 'text-green-600 bg-green-50 border-green-200' :
                  data.format_analysis.overall_score >= 70 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                  data.format_analysis.overall_score >= 50 ? 'text-orange-600 bg-orange-50 border-orange-200' :
                  'text-red-600 bg-red-50 border-red-200'
                }`}>
                  {data.format_analysis.overall_score >= 85 ? 'ACCEPTABLE' :
                   data.format_analysis.overall_score >= 70 ? 'NEEDS IMPROVEMENT' :
                   data.format_analysis.overall_score >= 50 ? 'POOR QUALITY' :
                   'CRITICALLY DEFICIENT'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Readability Score</p>
                      <p className="text-lg font-semibold text-gray-900">{data.format_analysis.readability_score}/100</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Critical Issues</p>
                      <p className="text-lg font-semibold text-gray-900">{data.format_analysis.critical_issues?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Issues */}
            {data.format_analysis.critical_issues && data.format_analysis.critical_issues.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center">
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Critical Issues
                </h4>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="space-y-2">
                    {data.format_analysis.critical_issues.map((issue: string, index: number) => (
                      <div key={index} className="flex items-start text-sm text-red-700">
                        <XCircleIcon className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        {issue}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Red Flags */}
            {data.format_analysis.red_flags && data.format_analysis.red_flags.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-orange-700 mb-3 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  Legal Red Flags
                </h4>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="space-y-2">
                    {data.format_analysis.red_flags.map((flag: string, index: number) => (
                      <div key={index} className="flex items-start text-sm text-orange-700">
                        <ExclamationTriangleIcon className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        {flag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Missing Sections */}
            {data.format_analysis.missing_sections && data.format_analysis.missing_sections.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-yellow-700 mb-3 flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  Missing Critical Sections
                </h4>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="space-y-2">
                    {data.format_analysis.missing_sections.map((section: string, index: number) => (
                      <div key={index} className="flex items-start text-sm text-yellow-700">
                        <DocumentTextIcon className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                        {section}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Formatting Problems */}
            {data.format_analysis.formatting_problems && data.format_analysis.formatting_problems.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-blue-700 mb-3 flex items-center">
                  <CogIcon className="h-4 w-4 mr-1" />
                  Formatting Issues
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="space-y-2">
                    {data.format_analysis.formatting_problems.map((problem: string, index: number) => (
                      <div key={index} className="flex items-start text-sm text-blue-700">
                        <CogIcon className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        {problem}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Professional Standards */}
            {data.format_analysis.professional_standards && data.format_analysis.professional_standards.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-purple-700 mb-3 flex items-center">
                  <ShieldCheckIcon className="h-4 w-4 mr-1" />
                  Professional Standards Violations
                </h4>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="space-y-2">
                    {data.format_analysis.professional_standards.map((standard: string, index: number) => (
                      <div key={index} className="flex items-start text-sm text-purple-700">
                        <ShieldCheckIcon className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        {standard}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BRUTAL RECOMMENDATIONS */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                Expert Recommendations
              </h4>
              <div className="space-y-2">
                {data.format_analysis.recommendations?.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start text-sm text-gray-200">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {recommendation}
                  </div>
                )) || (
                  <p className="text-sm text-gray-400">No specific recommendations available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Details */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <InformationCircleIcon className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">Analysis Confidence</span>
          </div>
          <span className="text-sm text-gray-500">
            {data.confidence_score || 0}% | Generated by STAYLL AI Engine
          </span>
        </div>
      </div>
    </div>
  );
} 