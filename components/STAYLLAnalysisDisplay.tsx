import React from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon, ChartBarIcon, ShieldCheckIcon, ClockIcon, CurrencyDollarIcon, DocumentTextIcon, CogIcon, BuildingOfficeIcon, ScaleIcon, LightBulbIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface STAYLLAnalysisDisplayProps {
  analysis: any;
}

export default function STAYLLAnalysisDisplay({ analysis }: STAYLLAnalysisDisplayProps) {
  // Validate the analysis structure
  if (!analysis || !analysis.analysis) {
    return (
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Analysis Data Unavailable</h3>
          <p className="mt-1 text-sm text-gray-500">
            The analysis data is not in the expected format. Please try analyzing the lease again.
          </p>
        </div>
      </div>
    );
  }

  const data = analysis.analysis;

  // Safe rendering function to handle objects and null values
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    return String(value);
  };

  // Safe number formatting function
  const formatNumber = (value: any): string => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0';
    }
    const num = typeof value === 'string' ? parseFloat(value.replace(/[$,]/g, '')) : value;
    if (isNaN(num)) {
      return '0';
    }
    return num.toLocaleString();
  };

  // Safe currency formatting function
  const formatCurrency = (value: any): string => {
    const formatted = formatNumber(value);
    return `$${formatted}`;
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'medium': return <InformationCircleIcon className="h-5 w-5 text-yellow-500" />;
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
          <p className="text-gray-700 leading-relaxed">{safeRender(data.lease_summary)}</p>
        </div>
      </div>

      {/* Portfolio Impact Analysis */}
      {data.portfolio_impact && (
        <div className="bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 text-indigo-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Portfolio Impact Analysis</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Revenue Impact */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center mb-3">
                  <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-800">Revenue Impact</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Annual Revenue:</span>
                    <span className="font-medium">{formatCurrency(data.portfolio_impact?.revenue_impact?.annual_revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Total Lease Value:</span>
                    <span className="font-medium">{formatCurrency(data.portfolio_impact?.revenue_impact?.total_lease_value)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Monthly Cash Flow:</span>
                    <span className="font-medium">{formatCurrency(data.portfolio_impact?.revenue_impact?.monthly_cash_flow)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">ROI Estimate:</span>
                    <span className="font-medium">{data.portfolio_impact?.revenue_impact?.roi_estimate || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Risk Exposure */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                <div className="flex items-center mb-3">
                  <ShieldCheckIcon className="h-5 w-5 text-red-600 mr-2" />
                  <h4 className="font-semibold text-red-800">Risk Exposure</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-700">Total Risk Value:</span>
                    <span className="font-medium">{formatCurrency(data.portfolio_impact?.risk_exposure?.total_risk_value)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Portfolio Risk:</span>
                    <span className="font-medium">{data.portfolio_impact?.risk_exposure?.portfolio_risk_contribution || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Diversification:</span>
                    <span className="font-medium">{data.portfolio_impact?.risk_exposure?.diversification_impact || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Market Positioning */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center mb-3">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-800">Market Positioning</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Rent Tier:</span>
                    <span className="font-medium">{data.portfolio_impact?.market_positioning?.rent_per_sqft || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Competitive Position:</span>
                    <span className="font-medium">{data.portfolio_impact?.market_positioning?.competitive_position || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Growth Potential:</span>
                    <span className="font-medium">{data.portfolio_impact?.market_positioning?.growth_potential || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Assessment */}
      {data.compliance_assessment && (
        <div className="bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ScaleIcon className="h-5 w-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Compliance Assessment</h3>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
                (data.compliance_assessment?.compliance_score || 0) >= 90 ? 'text-green-600 bg-green-50 border-green-200' :
                (data.compliance_assessment?.compliance_score || 0) >= 70 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                'text-red-600 bg-red-50 border-red-200'
              }`}>
                Score: {data.compliance_assessment?.compliance_score || 0}/100
              </div>
            </div>
          </div>
          <div className="p-6">
            {data.compliance_assessment?.compliance_issues?.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Compliance Issues:</h4>
                <div className="space-y-2">
                  {data.compliance_assessment.compliance_issues.map((issue: string, index: number) => (
                    <div key={index} className="flex items-start text-sm text-red-700">
                      <XCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      {issue}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Recommended Actions:</h4>
                  <div className="space-y-1">
                    {data.compliance_assessment?.recommended_actions?.map((action: string, index: number) => (
                      <div key={index} className="flex items-start text-sm text-gray-700">
                        <CheckCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-green-700 font-medium">All compliance requirements met</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Strategic Recommendations */}
      {data.strategic_recommendations && (
        <div className="bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <LightBulbIcon className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Strategic Recommendations</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Immediate Actions */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2 text-red-500" />
                  Immediate Actions (0-30 days)
                </h4>
                <div className="space-y-2">
                  {data.strategic_recommendations?.immediate_actions?.map((action: string, index: number) => (
                    <div key={index} className="flex items-start text-sm text-gray-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {action}
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500">No immediate actions required</p>
                  )}
                </div>
              </div>

              {/* Strategic Planning */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <ChartBarIcon className="h-4 w-4 mr-2 text-blue-500" />
                  Strategic Planning (30-90 days)
                </h4>
                <div className="space-y-2">
                  {data.strategic_recommendations?.strategic_planning?.map((action: string, index: number) => (
                    <div key={index} className="flex items-start text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {action}
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500">No strategic planning required</p>
                  )}
                </div>
              </div>
            </div>

            {/* Portfolio Optimization */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <BuildingOfficeIcon className="h-4 w-4 mr-2 text-indigo-500" />
                Portfolio Optimization Strategies
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.strategic_recommendations?.portfolio_optimization?.map((strategy: string, index: number) => (
                  <div key={index} className="flex items-start text-sm text-gray-700">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {strategy}
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">No portfolio optimization strategies available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Assessment */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(data.risk_analysis?.risk_level)}`}>
              {data.risk_analysis?.risk_level || 'Unknown'} Risk
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700">{data.risk_analysis?.risk_summary || 'Risk analysis not available'}</p>
          </div>
          {data.risk_analysis?.risk_factors && data.risk_analysis.risk_factors.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Key Risk Factors:</h4>
              <div className="space-y-2">
                {data.risk_analysis.risk_factors.map((factor: any, index: number) => (
                  <div key={index} className="flex items-start text-sm">
                    {getRiskIcon(factor.severity)}
                    <div className="ml-2">
                      <span className="font-medium text-gray-900">{factor.category}:</span>
                      <span className="text-gray-700 ml-1">{factor.description}</span>
                    </div>
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
          <h3 className="text-lg font-semibold text-gray-900">Action Items</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.action_items?.immediate && data.action_items.immediate.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2 text-red-500" />
                  Immediate (0-7 days)
                </h4>
                <div className="space-y-2">
                  {data.action_items.immediate.map((item: string, index: number) => (
                    <div key={index} className="flex items-start text-sm text-gray-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.action_items?.upcoming && data.action_items.upcoming.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2 text-yellow-500" />
                  Upcoming (7-30 days)
                </h4>
                <div className="space-y-2">
                  {data.action_items.upcoming.map((item: string, index: number) => (
                    <div key={index} className="flex items-start text-sm text-gray-700">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.action_items?.long_term && data.action_items.long_term.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                  Long-term (30+ days)
                </h4>
                <div className="space-y-2">
                  {data.action_items.long_term.map((item: string, index: number) => (
                    <div key={index} className="flex items-start text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Market Insights</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.market_insights?.rental_trends && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Rental Market Trends</h4>
                <p className="text-gray-700 text-sm">{data.market_insights.rental_trends}</p>
              </div>
            )}
            {data.market_insights?.competitive_analysis && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Competitive Analysis</h4>
                <p className="text-gray-700 text-sm">{data.market_insights.competitive_analysis}</p>
              </div>
            )}
            {data.market_insights?.market_opportunities && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Market Opportunities</h4>
                <p className="text-gray-700 text-sm">{data.market_insights.market_opportunities}</p>
              </div>
            )}
            {data.market_insights?.risk_factors && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Market Risk Factors</h4>
                <p className="text-gray-700 text-sm">{data.market_insights.risk_factors}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Quality Assessment */}
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
                    Document Quality Score: {data.format_analysis?.overall_score || 0}/100
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  (data.format_analysis?.overall_score || 0) >= 85 ? 'text-green-600 bg-green-50 border-green-200' :
                  (data.format_analysis?.overall_score || 0) >= 70 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                  (data.format_analysis?.overall_score || 0) >= 50 ? 'text-orange-600 bg-orange-50 border-orange-200' :
                  'text-red-600 bg-red-50 border-red-200'
                }`}>
                  {(data.format_analysis?.overall_score || 0) >= 85 ? 'ACCEPTABLE' :
                   (data.format_analysis?.overall_score || 0) >= 70 ? 'NEEDS IMPROVEMENT' :
                   (data.format_analysis?.overall_score || 0) >= 50 ? 'POOR QUALITY' :
                   'CRITICALLY DEFICIENT'}
                </div>
              </div>
              
              {/* Readability Score */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Readability Score: {data.format_analysis?.readability_score || 0}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${data.format_analysis?.readability_score || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Critical Issues */}
            {data.format_analysis?.critical_issues && data.format_analysis.critical_issues.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-red-500" />
                  Critical Issues
                </h4>
                <div className="space-y-2">
                  {data.format_analysis.critical_issues.map((issue: string, index: number) => (
                    <div key={index} className="flex items-start text-sm text-red-700">
                      <XCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      {issue}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formatting Problems */}
            {data.format_analysis?.formatting_problems && data.format_analysis.formatting_problems.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-2 text-yellow-500" />
                  Formatting Problems
                </h4>
                <div className="space-y-2">
                  {data.format_analysis.formatting_problems.map((problem: string, index: number) => (
                    <div key={index} className="flex items-start text-sm text-yellow-700">
                      <InformationCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      {problem}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Sections */}
            {data.format_analysis?.missing_sections && data.format_analysis.missing_sections.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <CogIcon className="h-4 w-4 mr-2 text-blue-500" />
                  Missing Sections
                </h4>
                <div className="space-y-2">
                  {data.format_analysis.missing_sections.map((section: string, index: number) => (
                    <div key={index} className="flex items-start text-sm text-blue-700">
                      <InformationCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      {section}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Standards */}
            {data.format_analysis?.professional_standards && data.format_analysis.professional_standards.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <ScaleIcon className="h-4 w-4 mr-2 text-purple-500" />
                  Professional Standards
                </h4>
                <div className="space-y-2">
                  {data.format_analysis.professional_standards.map((standard: string, index: number) => (
                    <div key={index} className="flex items-start text-sm text-purple-700">
                      <InformationCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      {standard}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Red Flags */}
            {data.format_analysis?.red_flags && data.format_analysis.red_flags.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-red-500" />
                  Red Flags
                </h4>
                <div className="space-y-2">
                  {data.format_analysis.red_flags.map((flag: string, index: number) => (
                    <div key={index} className="flex items-start text-sm text-red-700">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      {flag}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expert Recommendations */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                <LightBulbIcon className="h-4 w-4 mr-1" />
                Expert Recommendations
              </h4>
              <div className="space-y-2">
                {data.format_analysis?.recommendations?.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start text-sm text-gray-200">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {recommendation}
                  </div>
                )) || (<p className="text-sm text-gray-400">No specific recommendations available</p>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Details */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Technical Analysis</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Analysis Confidence</h4>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${data.confidence_score || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">{data.confidence_score || 0}%</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Analysis Details</h4>
              <div className="text-sm text-gray-600">
                <p>AI Model: {data.model_used || 'STAYLL Advanced Lease Intelligence'}</p>
                <p>Analysis Type: Comprehensive Multi-Dimensional</p>
                <p>Processing Time: Real-time</p>
                {data.tokens_used && (
                  <p>Tokens Used: {data.tokens_used.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 