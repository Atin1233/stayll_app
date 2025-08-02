import React from 'react';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  InformationCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShieldExclamationIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface STAYLLAnalysisDisplayProps {
  analysis: any;
}

export default function STAYLLAnalysisDisplay({ analysis }: STAYLLAnalysisDisplayProps) {
  if (!analysis || !analysis.analysis) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-500 text-center">No STAYLL AI analysis results to display</p>
      </div>
    );
  }

  const stayllData = analysis.analysis;
  const riskLevel = stayllData.risk_analysis?.risk_level || 'unknown';
  const confidenceScore = stayllData.confidence_score || 0;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical': return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'high': return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'medium': return <InformationCircleIcon className="h-5 w-5" />;
      case 'low': return <CheckCircleIcon className="h-5 w-5" />;
      default: return <InformationCircleIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Risk Level */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">🚀 STAYLL AI Analysis Results</h3>
          <div className={`flex items-center px-3 py-1 rounded-full border ${getRiskColor(riskLevel)}`}>
            {getRiskIcon(riskLevel)}
            <span className="ml-2 font-medium capitalize">{riskLevel} Risk</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-blue-600">Confidence Score</p>
              <p className="font-semibold text-blue-900">{confidenceScore}%</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <DocumentTextIcon className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-green-600">Clauses Analyzed</p>
              <p className="font-semibold text-green-900">{stayllData.clause_analysis?.length || 0}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-purple-50 rounded-lg">
            <ShieldExclamationIcon className="h-5 w-5 text-purple-600 mr-2" />
            <div>
              <p className="text-sm text-purple-600">Risk Score</p>
              <p className="font-semibold text-purple-900">{stayllData.risk_analysis?.overall_risk_score || 0}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lease Summary */}
      {stayllData.lease_summary && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Lease Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Property Address</p>
              <p className="font-medium">{stayllData.lease_summary.property_address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tenant Name</p>
              <p className="font-medium">{stayllData.lease_summary.tenant_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lease Term</p>
              <p className="font-medium">{stayllData.lease_summary.lease_term}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Base Rent</p>
              <p className="font-medium">{stayllData.lease_summary.base_rent}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Legal Strength</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stayllData.lease_summary.legal_strength === 'strong' ? 'bg-green-100 text-green-800' :
                stayllData.lease_summary.legal_strength === 'neutral' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {stayllData.lease_summary.legal_strength}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Analysis */}
      {stayllData.risk_analysis && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ShieldExclamationIcon className="h-5 w-5 mr-2" />
            Risk Analysis
          </h4>
          
          {/* Risk Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {stayllData.risk_analysis.cash_flow_risks?.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h5 className="font-medium text-red-900 mb-2 flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                  Cash Flow Risks
                </h5>
                <ul className="text-sm text-red-700 space-y-1">
                  {stayllData.risk_analysis.cash_flow_risks.slice(0, 3).map((risk: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-1">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {stayllData.risk_analysis.legal_risks?.length > 0 && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h5 className="font-medium text-orange-900 mb-2 flex items-center">
                  <ShieldExclamationIcon className="h-4 w-4 mr-1" />
                  Legal Risks
                </h5>
                <ul className="text-sm text-orange-700 space-y-1">
                  {stayllData.risk_analysis.legal_risks.slice(0, 3).map((risk: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-500 mr-1">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {stayllData.risk_analysis.market_risks?.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h5 className="font-medium text-yellow-900 mb-2 flex items-center">
                  <ChartBarIcon className="h-4 w-4 mr-1" />
                  Market Risks
                </h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {stayllData.risk_analysis.market_risks.slice(0, 3).map((risk: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-1">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Missing Clauses */}
          {stayllData.risk_analysis.missing_clauses?.length > 0 && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Missing Clauses</h5>
              <div className="flex flex-wrap gap-2">
                {stayllData.risk_analysis.missing_clauses.map((clause: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {clause.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Items */}
      {stayllData.action_items && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2" />
            Action Items
          </h4>
          
          <div className="space-y-4">
            {stayllData.action_items.immediate?.length > 0 && (
              <div>
                <h5 className="font-medium text-red-900 mb-2 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  Immediate Actions
                </h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  {stayllData.action_items.immediate.map((action: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {stayllData.action_items.upcoming?.length > 0 && (
              <div>
                <h5 className="font-medium text-orange-900 mb-2 flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Upcoming Actions
                </h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  {stayllData.action_items.upcoming.map((action: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {stayllData.action_items.long_term?.length > 0 && (
              <div>
                <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                  <InformationCircleIcon className="h-4 w-4 mr-1" />
                  Long-term Considerations
                </h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  {stayllData.action_items.long_term.map((action: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Market Insights */}
      {stayllData.market_insights && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Market Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Rent Trend</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stayllData.market_insights.rent_trend === 'increasing' ? 'bg-green-100 text-green-800' :
                stayllData.market_insights.rent_trend === 'stable' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {stayllData.market_insights.rent_trend}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Market Position</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stayllData.market_insights.market_position === 'above' ? 'bg-green-100 text-green-800' :
                stayllData.market_insights.market_position === 'at' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {stayllData.market_insights.market_position} market
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 