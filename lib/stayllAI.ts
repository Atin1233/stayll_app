// STAYLL AI Engine - Core Intelligence Layer
// This is the brain of the STAYLL platform

export interface ClauseAnalysis {
  type: 'rent' | 'term' | 'cam_opex' | 'security' | 'tenant_rights' | 'landlord_duties' | 'penalties' | 'termination' | 'special';
  confidence: number;
  extracted_data: any;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: string[];
  recommendations: string[];
  market_comparison?: {
    is_competitive: boolean;
    market_average?: string;
    deviation?: string;
  };
}

export interface RiskAnalysis {
  overall_risk_score: number; // 0-100
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  missing_clauses: string[];
  problematic_clauses: ClauseAnalysis[];
  cash_flow_risks: string[];
  legal_risks: string[];
  market_risks: string[];
  recommendations: string[];
}

interface FormatAnalysis {
  overall_score: number;
  critical_issues: string[];
  formatting_problems: string[];
  missing_sections: string[];
  readability_score: number;
  professional_standards: string[];
  red_flags: string[];
  recommendations: string[];
}

export interface STAYLLAnalysis {
  lease_summary: {
    property_address: string;
    tenant_name: string;
    lease_term: string;
    base_rent: string;
    total_value: string;
    legal_strength: "strong" | "weak" | "neutral";
  };
  clause_analysis: ClauseAnalysis[];
  risk_analysis: RiskAnalysis;
  action_items: {
    immediate: string[];
    upcoming: string[];
    long_term: string[];
  };
  market_insights: {
    your_rent: string;
    market_average: string;
    market_position: string;
    trends: string[];
  };
  format_analysis: FormatAnalysis;
  confidence_score: number;
  portfolio_impact: {
    revenue_impact: {
      annual_revenue: number;
      total_lease_value: number;
      monthly_cash_flow: number;
      roi_estimate: string;
    };
    risk_exposure: {
      total_risk_value: number;
      portfolio_risk_contribution: string;
      diversification_impact: string;
    };
    market_positioning: {
      rent_per_sqft: string;
      competitive_position: string;
      growth_potential: string;
    };
  };
  compliance_assessment: {
    compliance_score: number;
    compliance_issues: string[];
    regulatory_requirements: string[];
    recommended_actions: string[];
  };
  strategic_recommendations: {
    immediate_actions: string[];
    strategic_planning: string[];
    long_term_vision: string[];
    portfolio_optimization: string[];
  };
}

// AI Clause Classification Patterns
const CLAUSE_PATTERNS = {
  rent_terms: {
    patterns: [
      /(?:base rent|monthly rent|rent amount)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi,
      /(?:rent escalation|rent increase|annual increase)[:\s]*(\d+(?:\.\d+)?%)/gi,
      /(?:cpi adjustment|consumer price index)[:\s]*(\d+(?:\.\d+)?%)/gi,
      /(?:fixed increase|step up)[:\s]*(\d+(?:\.\d+)?%)/gi
    ],
    risk_factors: [
      'no_rent_escalation',
      'below_market_rent',
      'excessive_escalation',
      'no_cpi_protection'
    ]
  },
  
  lease_term: {
    patterns: [
      /(?:lease term|term of lease|duration)[:\s]*(\d+\s+(?:year|month|day)s?)/gi,
      /(?:start date|commencement)[:\s]*(\d{1,2}\/\d{1,2}\/\d{2,4})/gi,
      /(?:end date|expiration|termination)[:\s]*(\d{1,2}\/\d{1,2}\/\d{2,4})/gi,
      /(?:renewal option|extension)[:\s]*(yes|no|automatic)/gi
    ],
    risk_factors: [
      'short_term_lease',
      'no_renewal_option',
      'automatic_renewal',
      'early_termination_rights'
    ]
  },
  
  cam_opex: {
    patterns: [
      /(?:cam|common area maintenance)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi,
      /(?:operating expenses|opex)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi,
      /(?:triple net|nnn)[:\s]*(yes|no)/gi,
      /(?:expense passthrough|expense recovery)[:\s]*(yes|no)/gi
    ],
    risk_factors: [
      'unlimited_cam_passthrough',
      'no_cam_cap',
      'tenant_pays_all_expenses',
      'no_expense_audit_rights'
    ]
  },
  
  security_deposit: {
    patterns: [
      /(?:security deposit|deposit)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi,
      /(?:damage deposit|cleaning deposit)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi,
      /(?:deposit return|refund)[:\s]*(\d+\s+days?)/gi
    ],
    risk_factors: [
      'insufficient_deposit',
      'no_deposit_return_timeline',
      'excessive_deposit',
      'no_deposit_interest'
    ]
  },
  
  tenant_rights: {
    patterns: [
      /(?:right of first refusal|rofr)[:\s]*(yes|no)/gi,
      /(?:exclusive use|exclusivity)[:\s]*(yes|no)/gi,
      /(?:sublet|sublease)[:\s]*(yes|no|with consent)/gi,
      /(?:assignment|transfer)[:\s]*(yes|no|with consent)/gi
    ],
    risk_factors: [
      'no_sublet_rights',
      'no_assignment_rights',
      'no_exclusive_use',
      'unlimited_sublet_rights'
    ]
  },
  
  landlord_duties: {
    patterns: [
      /(?:maintenance|repair)[:\s]*(landlord|tenant|both)/gi,
      /(?:roof|hvac|plumbing)[:\s]*(landlord|tenant|both)/gi,
      /(?:access|entry)[:\s]*(\d+\s+hours? notice)/gi
    ],
    risk_factors: [
      'tenant_pays_all_maintenance',
      'no_landlord_maintenance',
      'unlimited_access_rights',
      'no_access_notice'
    ]
  },
  
  penalties: {
    patterns: [
      /(?:late fee|late charge)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi,
      /(?:default|breach)[:\s]*(\d+\s+days?)/gi,
      /(?:cure period|grace period)[:\s]*(\d+\s+days?)/gi
    ],
    risk_factors: [
      'excessive_late_fees',
      'no_cure_period',
      'immediate_default',
      'one_sided_penalties'
    ]
  },
  
  termination: {
    patterns: [
      /(?:early termination|break clause)[:\s]*(yes|no)/gi,
      /(?:termination notice|notice period)[:\s]*(\d+\s+(?:days?|months?))/gi,
      /(?:termination fee|break fee)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi
    ],
    risk_factors: [
      'tenant_termination_rights',
      'no_termination_fee',
      'short_termination_notice',
      'unilateral_termination'
    ]
  },
  
  special_provisions: {
    patterns: [
      /(?:pandemic|force majeure|emergency)[:\s]*(yes|no)/gi,
      /(?:co-tenancy|cotenancy)[:\s]*(yes|no)/gi,
      /(?:use restrictions|permitted use)[:\s]*(.+)/gi,
      /(?:hours of operation|operating hours)[:\s]*(.+)/gi
    ],
    risk_factors: [
      'no_force_majeure',
      'restrictive_use_clause',
      'no_co_tenancy_protection',
      'unlimited_use_restrictions'
    ]
  }
};

// Market Data (in real implementation, this would come from external APIs)
const MARKET_DATA = {
  'residential': {
    average_rent_per_sqft: 2.50,
    average_lease_term: 12,
    typical_security_deposit: 1.5, // months of rent
    typical_late_fee: 50,
    market_trends: {
      '2024': 'increasing',
      '2023': 'stable',
      '2022': 'increasing'
    }
  },
  'commercial': {
    average_rent_per_sqft: 25.00,
    average_lease_term: 60,
    typical_security_deposit: 3, // months of rent
    typical_late_fee: 250,
    market_trends: {
      '2024': 'stable',
      '2023': 'decreasing',
      '2022': 'stable'
    }
  }
};

export async function analyzeLeaseWithSTAYLL(leaseText: string): Promise<STAYLLAnalysis> {
  console.log('STAYLL AI: Starting comprehensive lease analysis...');
  
  // Extract basic lease data
  const basicData = extractBasicLeaseData(leaseText);
  console.log('STAYLL AI: Basic data extracted:', basicData);
  
  // Analyze clauses with AI
  const { analyzeWithAI } = await import('./aiModel');
  const clauseResults = await analyzeWithAI({ text: leaseText, task: 'classify_clauses' });
  const clauses = convertAIClauseResults(clauseResults.success ? clauseResults.data : []);
  console.log('STAYLL AI: Clauses analyzed:', clauses.length);
  
  // Assess risks with AI
  const riskResults = await analyzeWithAI({ text: leaseText, task: 'assess_risk' });
  const riskAnalysis = convertAIRiskResults(riskResults.success ? riskResults.data : {});
  console.log('STAYLL AI: Risk assessment complete');
  
  // Generate recommendations with AI
  const recommendationResults = await analyzeWithAI({ text: leaseText, task: 'generate_recommendations' });
  const actionItems = generateActionItems(riskAnalysis, basicData);
  console.log('STAYLL AI: Action items generated');
  
  // Analyze lease format and completeness
  const formatAnalysis = analyzeLeaseFormatBrutally(leaseText, basicData);
  console.log('STAYLL AI: Format analysis complete - Score:', formatAnalysis.overall_score);
  
  // Generate market insights with portfolio context
  const marketInsights = generateMarketInsights(basicData);
  console.log('STAYLL AI: Market insights generated');
  
  // Generate comprehensive lease summary
  const leaseSummary = generateLeaseSummary(basicData, formatAnalysis);
  console.log('STAYLL AI: Lease summary generated');
  
  // Calculate confidence score
  const confidenceScore = calculateConfidenceScore(clauses, basicData);
  console.log('STAYLL AI: Confidence score calculated:', confidenceScore);
  
  // Generate portfolio impact analysis
  const portfolioImpact = generatePortfolioImpact(basicData, riskAnalysis);
  console.log('STAYLL AI: Portfolio impact analysis complete');
  
  // Generate compliance assessment
  const complianceAssessment = generateComplianceAssessment(leaseText, basicData);
  console.log('STAYLL AI: Compliance assessment complete');
  
  // Generate strategic recommendations
  const strategicRecommendations = generateStrategicRecommendations(basicData, marketInsights, riskAnalysis);
  console.log('STAYLL AI: Strategic recommendations generated');
  
  return {
    lease_summary: leaseSummary,
    clause_analysis: clauses,
    risk_analysis: riskAnalysis,
    action_items: actionItems,
    market_insights: marketInsights,
    format_analysis: formatAnalysis,
    confidence_score: confidenceScore,
    portfolio_impact: portfolioImpact,
    compliance_assessment: complianceAssessment,
    strategic_recommendations: strategicRecommendations
  };
}

function convertAIClauseResults(aiResults: any[]): ClauseAnalysis[] {
  return aiResults.map(result => ({
    type: result.clause_type as any,
    confidence: result.confidence * 100,
    extracted_data: { present: result.present },
    risk_level: 'low' as any,
    risk_factors: [],
    recommendations: []
  }));
}

function convertAIRiskResults(aiResults: any): RiskAnalysis {
  return {
    overall_risk_score: aiResults.overall_risk_score || 0,
    risk_level: aiResults.overall_risk_level as any,
    missing_clauses: [],
    problematic_clauses: [],
    cash_flow_risks: aiResults.risks?.filter((r: any) => r.risk_factor === 'no_rent_escalation').map((r: any) => r.description) || [],
    legal_risks: aiResults.risks?.filter((r: any) => r.risk_factor === 'no_cure_period').map((r: any) => r.description) || [],
    market_risks: [],
    recommendations: aiResults.risks?.map((r: any) => r.description) || []
  };
}

function extractBasicLeaseData(text: string) {
  // Use the same patterns from leaseAnalysis.ts to extract real data
  const data: any = {};
  
  // Extract rent amount
  const rentPattern = /(?:rent|monthly rent|monthly payment|base rent|amount)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi;
  const rentMatches = text.match(rentPattern);
  if (rentMatches && rentMatches.length > 0) {
    const rentValue = rentMatches[0].replace(/[^\d.]/g, '');
    data.base_rent = `$${rentValue}`;
  }
  
  // Extract dates
  const datePattern = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}|\w+ \d{1,2},? \d{4}|\d{1,2}\/\d{1,2}\/\d{2})/gi;
  const dateMatches = text.match(datePattern);
  if (dateMatches && dateMatches.length >= 2) {
    data.lease_start = formatDate(dateMatches[0]);
    data.lease_end = formatDate(dateMatches[1]);
  } else if (dateMatches && dateMatches.length === 1) {
    data.lease_start = formatDate(dateMatches[0]);
  }
  
  // Extract address
  const addressPattern = /(\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Place|Pl|Court|Ct|Way|Circle|Cir|Terrace|Ter|Highway|Hwy|Parkway|Pkwy)[,\s]*[A-Za-z\s,]+(?:[A-Z]{2}\s*\d{5}(?:-\d{4})?|\d{5}(?:-\d{4})?))/gi;
  const addressMatches = text.match(addressPattern);
  if (addressMatches && addressMatches.length > 0) {
    data.property_address = addressMatches[0].trim();
  }
  
  // Extract tenant name
  const namePattern = /(?:tenant|lessee|resident|occupant|tenant name)[:\s]*([A-Z][a-z]+ [A-Z][a-z]+)/gi;
  const nameMatches = text.match(namePattern);
  if (nameMatches && nameMatches.length > 0) {
    data.tenant_name = nameMatches[0].trim();
  }
  
  return {
    property_address: data.property_address || 'Address not found',
    tenant_name: data.tenant_name || 'Tenant name not found',
    base_rent: data.base_rent || 'Rent amount not found',
    lease_start: data.lease_start || 'Start date not found',
    lease_end: data.lease_end || 'End date not found'
  };
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return dateString;
  }
}

async function analyzeClauses(text: string, propertyType: 'residential' | 'commercial'): Promise<ClauseAnalysis[]> {
  const clauses: ClauseAnalysis[] = [];
  
  // Analyze each clause type
  for (const [clauseType, patterns] of Object.entries(CLAUSE_PATTERNS)) {
    const analysis = await analyzeSingleClause(text, clauseType as any, patterns, propertyType);
    if (analysis) {
      clauses.push(analysis);
    }
  }
  
  return clauses;
}

async function analyzeSingleClause(
  text: string, 
  clauseType: string, 
  patterns: any, 
  propertyType: 'residential' | 'commercial'
): Promise<ClauseAnalysis | null> {
  
  const extractedData: any = {};
  let confidence = 0;
  const riskFactors: string[] = [];
  const recommendations: string[] = [];
  
  // Extract data using patterns
  for (const pattern of patterns.patterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      extractedData[pattern.toString()] = matches[0];
      confidence += 25; // Increase confidence for each pattern match
    }
  }
  
  // Analyze risk factors
  for (const riskFactor of patterns.risk_factors) {
    if (isRiskFactorPresent(text, riskFactor)) {
      riskFactors.push(riskFactor);
    }
  }
  
  // Generate recommendations based on risk factors
  recommendations.push(...generateRecommendations(clauseType, riskFactors, propertyType));
  
  // Calculate risk level
  const riskLevel = calculateRiskLevel(riskFactors, confidence);
  
  // Market comparison
  const marketComparison = await compareToMarket(clauseType, extractedData, propertyType);
  
  return {
    type: clauseType as any,
    confidence: Math.min(confidence, 100),
    extracted_data: extractedData,
    risk_level: riskLevel,
    risk_factors: riskFactors,
    recommendations: recommendations,
    market_comparison: marketComparison
  };
}

function isRiskFactorPresent(text: string, riskFactor: string): boolean {
  const lowerText = text.toLowerCase();
  
  switch (riskFactor) {
    case 'no_rent_escalation':
      return !lowerText.includes('escalation') && !lowerText.includes('increase');
    case 'below_market_rent':
      // This would need market data comparison
      return false;
    case 'short_term_lease':
      return lowerText.includes('month to month') || lowerText.includes('30 days');
    case 'no_renewal_option':
      return !lowerText.includes('renewal') && !lowerText.includes('extension');
    case 'excessive_late_fees':
      return lowerText.includes('$100') || lowerText.includes('$200') || lowerText.includes('$500');
    default:
      return false;
  }
}

function calculateRiskLevel(riskFactors: string[], confidence: number): 'low' | 'medium' | 'high' | 'critical' {
  const riskScore = riskFactors.length * 25 + (100 - confidence) * 0.5;
  
  if (riskScore >= 75) return 'critical';
  if (riskScore >= 50) return 'high';
  if (riskScore >= 25) return 'medium';
  return 'low';
}

function generateRecommendations(clauseType: string, riskFactors: string[], propertyType: 'residential' | 'commercial'): string[] {
  const recommendations: string[] = [];
  
  for (const riskFactor of riskFactors) {
    switch (riskFactor) {
      case 'no_rent_escalation':
        recommendations.push('Consider adding annual rent escalation clause (3-5% typical)');
        break;
      case 'short_term_lease':
        recommendations.push('Consider longer lease term for stability (12+ months)');
        break;
      case 'no_renewal_option':
        recommendations.push('Add renewal option with predetermined terms');
        break;
      case 'excessive_late_fees':
        recommendations.push('Review late fee amount - consider market standard');
        break;
      case 'no_cure_period':
        recommendations.push('Add reasonable cure period before default (5-10 days)');
        break;
    }
  }
  
  return recommendations;
}

async function compareToMarket(clauseType: string, data: any, propertyType: 'residential' | 'commercial') {
  // This would integrate with real market data APIs
  // For now, return mock comparison
  return {
    is_competitive: true,
    market_average: 'Market data unavailable',
    deviation: '0%'
  };
}

function calculateRiskAnalysis(clauses: ClauseAnalysis[], basicData: any, propertyType: 'residential' | 'commercial'): RiskAnalysis {
  const riskScore = clauses.reduce((score, clause) => {
    switch (clause.risk_level) {
      case 'critical': return score + 25;
      case 'high': return score + 15;
      case 'medium': return score + 10;
      case 'low': return score + 5;
      default: return score;
    }
  }, 0);
  
  const overallRiskScore = Math.min(riskScore, 100);
  const riskLevel = overallRiskScore >= 75 ? 'critical' : 
                   overallRiskScore >= 50 ? 'high' : 
                   overallRiskScore >= 25 ? 'medium' : 'low';
  
  const problematicClauses = clauses.filter(c => c.risk_level === 'high' || c.risk_level === 'critical');
  const missingClauses = identifyMissingClauses(clauses);
  
  return {
    overall_risk_score: overallRiskScore,
    risk_level: riskLevel,
    missing_clauses: missingClauses,
    problematic_clauses: problematicClauses,
    cash_flow_risks: identifyCashFlowRisks(clauses),
    legal_risks: identifyLegalRisks(clauses),
    market_risks: identifyMarketRisks(clauses, propertyType),
    recommendations: generateOverallRecommendations(clauses, missingClauses)
  };
}

function identifyMissingClauses(clauses: ClauseAnalysis[]): string[] {
  const foundTypes = clauses.map(c => c.type);
  const allTypes = Object.keys(CLAUSE_PATTERNS);
  
  return allTypes.filter(type => !foundTypes.includes(type as any));
}

function identifyCashFlowRisks(clauses: ClauseAnalysis[]): string[] {
  const risks: string[] = [];
  
  for (const clause of clauses) {
    if (clause.risk_factors.includes('no_rent_escalation')) {
      risks.push('No rent escalation may reduce long-term cash flow');
    }
    if (clause.risk_factors.includes('tenant_termination_rights')) {
      risks.push('Early termination rights may create cash flow uncertainty');
    }
  }
  
  return risks;
}

function identifyLegalRisks(clauses: ClauseAnalysis[]): string[] {
  const risks: string[] = [];
  
  for (const clause of clauses) {
    if (clause.risk_factors.includes('no_cure_period')) {
      risks.push('No cure period may lead to hasty eviction proceedings');
    }
    if (clause.risk_factors.includes('one_sided_penalties')) {
      risks.push('One-sided penalty clauses may be unenforceable');
    }
  }
  
  return risks;
}

function identifyMarketRisks(clauses: ClauseAnalysis[], propertyType: 'residential' | 'commercial'): string[] {
  const risks: string[] = [];
  
  if (propertyType === 'commercial') {
    risks.push('Commercial market volatility may affect tenant stability');
  }
  
  return risks;
}

function generateOverallRecommendations(clauses: ClauseAnalysis[], missingClauses: string[]): string[] {
  const recommendations: string[] = [];
  
  // Add recommendations for missing clauses
  for (const missing of missingClauses) {
    recommendations.push(`Consider adding ${missing.replace('_', ' ')} clause`);
  }
  
  // Add recommendations for high-risk clauses
  const highRiskClauses = clauses.filter(c => c.risk_level === 'high' || c.risk_level === 'critical');
  for (const clause of highRiskClauses) {
    recommendations.push(`Review ${clause.type.replace('_', ' ')} clause for potential improvements`);
  }
  
  return recommendations;
}

function generateMarketInsights(basicData: any) {
  const marketData = MARKET_DATA['residential']; // Default to residential for now
  
  return {
    your_rent: basicData.base_rent || 'Rent amount not specified',
    market_average: 'Market data unavailable',
    market_position: 'at' as any, // This would be calculated based on actual rent
    trends: ['Market data unavailable']
  };
}

function generateActionItems(riskAnalysis: RiskAnalysis, basicData: any) {
  const immediate: string[] = [];
  const upcoming: string[] = [];
  const long_term: string[] = [];
  
  if (riskAnalysis.risk_level === 'critical') {
    immediate.push('Review lease with legal counsel immediately');
  }
  
  if (riskAnalysis.missing_clauses.length > 0) {
    upcoming.push('Add missing clauses before lease execution');
  }
  
  if (riskAnalysis.overall_risk_score > 50) {
    long_term.push('Consider lease renegotiation for better terms');
  }
  
  return { immediate, upcoming, long_term };
}

function calculateConfidenceScore(clauses: ClauseAnalysis[], basicData: any): number {
  const totalConfidence = clauses.reduce((sum, clause) => sum + clause.confidence, 0);
  const averageConfidence = clauses.length > 0 ? totalConfidence / clauses.length : 0;
  
  // Boost confidence if we have good basic data
  const basicDataBonus = Object.values(basicData).filter(v => v && v !== 'Extracted from text').length * 10;
  
  return Math.min(averageConfidence + basicDataBonus, 100);
}

function generateLeaseSummary(basicData: any, formatAnalysis: FormatAnalysis) {
  // Determine legal strength based on format analysis
  let legalStrength: "strong" | "weak" | "neutral" = "neutral";
  
  if (formatAnalysis.overall_score >= 85 && formatAnalysis.red_flags.length === 0) {
    legalStrength = "strong";
  } else if (formatAnalysis.overall_score < 50 || formatAnalysis.red_flags.length > 2) {
    legalStrength = "weak";
  }
  
  return {
    property_address: basicData.property_address || 'Address not clearly specified',
    tenant_name: basicData.tenant_name || 'Tenant not clearly identified',
    lease_term: basicData.lease_term || 'Term not clearly defined',
    base_rent: basicData.base_rent || 'Rent amount not specified',
    total_value: basicData.total_value || 'Total value cannot be calculated',
    legal_strength: legalStrength
  };
}

function analyzeLeaseFormatBrutally(leaseText: string, basicData: any): FormatAnalysis {
  const issues: string[] = [];
  const formattingProblems: string[] = [];
  const missingSections: string[] = [];
  const redFlags: string[] = [];
  const professionalStandards: string[] = [];
  const recommendations: string[] = [];
  
  let overallScore = 100;
  let readabilityScore = 100;
  
  // INTELLIGENT FORMAT ANALYSIS - More nuanced and accurate
  
  // Check document length with better context
  const wordCount = leaseText.split(/\s+/).length;
  const hasSubstantialContent = wordCount > 500; // More reasonable threshold
  
  if (wordCount < 300) {
    issues.push(`Document contains only ${wordCount} words - insufficient for a comprehensive lease agreement`);
    overallScore -= 25;
    readabilityScore -= 15;
  } else if (wordCount < 800) {
    formattingProblems.push(`Document contains ${wordCount} words - shorter than typical lease agreements (800-2000 words expected)`);
    overallScore -= 10;
  }
  
  // Check for essential sections with better detection
  const essentialSections = [
    { key: 'rent', terms: ['rent', 'monthly rent', 'base rent', 'payment'], required: true, examples: ['$2,500 monthly rent', 'rent amount: $3,000', 'monthly payment of $2,000'] },
    { key: 'term', terms: ['term', 'duration', 'start', 'end', 'lease period'], required: true, examples: ['lease term: 12 months', 'duration: January 1 to December 31', 'start date: 01/01/2024'] },
    { key: 'tenant', terms: ['tenant', 'lessee', 'resident', 'occupant'], required: true, examples: ['tenant: John Smith', 'lessee: ABC Corporation', 'resident: Jane Doe'] },
    { key: 'property', terms: ['property', 'premises', 'address', 'location'], required: true, examples: ['property: 123 Main St', 'premises: 456 Oak Ave', 'address: 789 Business Blvd'] },
    { key: 'security_deposit', terms: ['security deposit', 'deposit', 'security'], required: false, examples: ['security deposit: $2,500', 'deposit amount: $3,000'] },
    { key: 'utilities', terms: ['utilities', 'electric', 'water', 'gas', 'heat'], required: false, examples: ['utilities included', 'tenant pays electric', 'water included'] },
    { key: 'maintenance', terms: ['maintenance', 'repairs', 'upkeep'], required: false, examples: ['landlord responsible for maintenance', 'tenant handles minor repairs'] },
    { key: 'termination', terms: ['termination', 'eviction', 'end of lease'], required: false, examples: ['30-day notice required', 'eviction procedures', 'early termination'] },
    { key: 'late_fees', terms: ['late fee', 'late payment', 'penalty'], required: false, examples: ['late fee: $100', 'penalty for late payment'] },
    { key: 'pets', terms: ['pets', 'animals', 'dog', 'cat'], required: false, examples: ['no pets allowed', 'pets permitted with deposit', 'pet policy'] },
    { key: 'smoking', terms: ['smoking', 'tobacco', 'cigarette'], required: false, examples: ['no smoking', 'smoking prohibited', 'tobacco use policy'] }
  ];
  
  const missingEssential = essentialSections.filter(section => {
    if (!section.required) return false; // Only check required sections
    return !section.terms.some(term => leaseText.toLowerCase().includes(term));
  });
  
  const missingOptional = essentialSections.filter(section => {
    if (section.required) return false; // Only check optional sections
    return !section.terms.some(term => leaseText.toLowerCase().includes(term));
  });
  
  if (missingEssential.length > 0) {
    missingSections.push(...missingEssential.map(section => 
      `MISSING REQUIRED: ${section.key.replace('_', ' ').toUpperCase()} - Document does not specify ${section.key.replace('_', ' ')}. Examples: ${section.examples.join(', ')}`
    ));
    overallScore -= missingEssential.length * 8;
  }
  
  if (missingOptional.length > 3) {
    const missingList = missingOptional.map(section => section.key.replace('_', ' ')).join(', ');
    formattingProblems.push(`MISSING OPTIONAL SECTIONS: ${missingList} - Consider adding these common lease provisions for better protection`);
    overallScore -= 5;
  }
  
  // Check for legal language quality with better detection
  const legalTerms = [
    'whereas', 'hereby', 'hereinafter', 'party', 'parties', 'agreement', 'covenant',
    'warrant', 'represent', 'acknowledge', 'binding', 'enforceable', 'jurisdiction',
    'lease', 'landlord', 'tenant', 'premises', 'term', 'rent', 'deposit'
  ];
  
  const legalTermCount = legalTerms.filter(term => 
    leaseText.toLowerCase().includes(term)
  ).length;
  
  const legalTermPercentage = (legalTermCount / legalTerms.length) * 100;
  const missingLegalTerms = legalTerms.filter(term => !leaseText.toLowerCase().includes(term));
  
  if (legalTermPercentage < 30) {
    issues.push(`INSUFFICIENT LEGAL TERMINOLOGY: Document contains only ${legalTermCount}/${legalTerms.length} legal terms (${legalTermPercentage.toFixed(1)}%). Missing: ${missingLegalTerms.slice(0, 5).join(', ')}${missingLegalTerms.length > 5 ? ' and others' : ''}`);
    professionalStandards.push(`ADD LEGAL LANGUAGE: Include terms like ${missingLegalTerms.slice(0, 3).join(', ')} for formal lease structure`);
    overallScore -= 15;
  } else if (legalTermPercentage < 50) {
    formattingProblems.push(`LEGAL LANGUAGE: Document contains ${legalTermCount}/${legalTerms.length} legal terms (${legalTermPercentage.toFixed(1)}%) - could benefit from more formal language like ${missingLegalTerms.slice(0, 3).join(', ')}`);
    overallScore -= 5;
  }
  
  // Check for specific formatting issues with better detection
  const hasSectionNumbering = leaseText.includes('§') || leaseText.includes('Section') || 
                             /\d+\.\s/.test(leaseText) || /[A-Z]\.\s/.test(leaseText);
  
  if (!hasSectionNumbering) {
    formattingProblems.push('DOCUMENT STRUCTURE: No section numbering found (e.g., "1.", "2.", "Section 1", "§1") - document lacks clear organization');
    readabilityScore -= 10;
  }
  
  // Check for specific data completeness with better extraction
  const hasTenantName = basicData.tenant_name && 
                       basicData.tenant_name !== 'Extracted from text' && 
                       basicData.tenant_name !== 'Tenant name not found';
  
  const hasPropertyAddress = basicData.property_address && 
                            basicData.property_address !== 'Extracted from text' && 
                            basicData.property_address !== 'Address not found';
  
  const hasRentAmount = basicData.base_rent && 
                       basicData.base_rent !== 'Extracted from text' && 
                       basicData.base_rent !== 'Rent amount not found';
  
  if (!hasTenantName) {
    issues.push('TENANT IDENTIFICATION: Tenant name not clearly identified - document should specify "Tenant: [Full Name]" or "Lessee: [Full Name]"');
    overallScore -= 15;
  }
  
  if (!hasPropertyAddress) {
    issues.push('PROPERTY IDENTIFICATION: Property address not clearly specified - document should include complete address (street, city, state, zip)');
    overallScore -= 15;
  }
  
  if (!hasRentAmount) {
    issues.push('RENT SPECIFICATION: Rent amount not clearly stated - document should specify exact amount (e.g., "Monthly Rent: $2,500" or "Base Rent: $3,000")');
    overallScore -= 15;
  }
  
  // Check for date formatting with better patterns
  const datePatterns = [
    /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/,
    /\b\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/,
    /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/i
  ];
  
  const hasDates = datePatterns.some(pattern => pattern.test(leaseText));
  if (!hasDates) {
    formattingProblems.push('DATE FORMATTING: No clear date formatting found - document should include dates in formats like "01/01/2024", "2024-01-01", or "January 1, 2024"');
    readabilityScore -= 8;
  }
  
  // Check for signature blocks with better detection
  const signatureTerms = ['signature', 'signed', 'execute', 'execution', 'witness', 'notary'];
  const hasSignatureBlock = signatureTerms.some(term => leaseText.toLowerCase().includes(term));
  
  if (!hasSignatureBlock) {
    formattingProblems.push('EXECUTION PROVISIONS: No signature blocks or execution provisions found - document should include signature lines, execution date, or notary provisions');
    overallScore -= 10;
  }
  
  // Check for boilerplate language with better context
  const boilerplateTerms = [
    { term: 'entire agreement', description: 'merger clause' },
    { term: 'governing law', description: 'jurisdiction clause' },
    { term: 'severability', description: 'severability clause' },
    { term: 'waiver', description: 'waiver provisions' },
    { term: 'notice', description: 'notice requirements' },
    { term: 'force majeure', description: 'force majeure clause' },
    { term: 'assignment', description: 'assignment restrictions' },
    { term: 'amendment', description: 'amendment procedures' },
    { term: 'modification', description: 'modification terms' }
  ];
  
  const missingBoilerplate = boilerplateTerms.filter(item => 
    !leaseText.toLowerCase().includes(item.term)
  );
  
  if (missingBoilerplate.length > 5) {
    const missingList = missingBoilerplate.map(item => `${item.term} (${item.description})`).join(', ');
    professionalStandards.push(`MISSING STANDARD PROVISIONS: ${missingList} - These clauses provide important legal protections`);
    overallScore -= missingBoilerplate.length * 2;
  }
  
  // Check for specific lease provisions
  const specificProvisions = [
    { term: 'quiet enjoyment', description: 'tenant right to peaceful possession' },
    { term: 'habitability', description: 'property condition standards' },
    { term: 'entry', description: 'landlord access rights' },
    { term: 'subletting', description: 'sublease restrictions' },
    { term: 'alterations', description: 'modification restrictions' },
    { term: 'insurance', description: 'insurance requirements' },
    { term: 'indemnification', description: 'liability protection' },
    { term: 'default', description: 'breach procedures' }
  ];
  
  const missingProvisions = specificProvisions.filter(item => 
    !leaseText.toLowerCase().includes(item.term)
  );
  
  if (missingProvisions.length > 4) {
    const missingList = missingProvisions.map(item => `${item.term} (${item.description})`).join(', ');
    formattingProblems.push(`MISSING LEASE PROVISIONS: ${missingList} - These provisions clarify rights and responsibilities`);
  }
  
  // INTELLIGENT RECOMMENDATIONS based on actual issues
  if (overallScore < 40) {
    recommendations.push('CRITICAL: Document requires significant improvement before execution');
    recommendations.push('LEGAL COUNSEL: Consult with attorney for proper lease drafting');
    recommendations.push('MISSING ESSENTIALS: Add tenant name, property address, rent amount, and lease term');
  } else if (overallScore < 60) {
    recommendations.push('SUBSTANTIAL IMPROVEMENTS: Document needs major revisions for legal adequacy');
    recommendations.push('REQUIRED SECTIONS: Add missing required sections and clarify key terms');
    recommendations.push('ORGANIZATION: Improve document structure with numbered sections');
  } else if (overallScore < 80) {
    recommendations.push('MODERATE IMPROVEMENTS: Document is generally adequate but could be enhanced');
    recommendations.push('OPTIONAL SECTIONS: Add missing optional sections for better protection');
    recommendations.push('CLARITY: Enhance readability and organization of terms');
  } else {
    recommendations.push('MINOR REFINEMENTS: Document is well-structured and legally adequate');
    recommendations.push('REVIEW: Ensure all terms are clearly defined and complete');
  }
  
  // Additional intelligent critiques based on actual content
  if (readabilityScore < 70) {
    issues.push('READABILITY: Document organization could be improved for better understanding - consider adding section headers and numbered paragraphs');
  }
  
  if (missingSections.length > 3) {
    issues.push('COMPLETENESS: Document is missing several important lease sections - consider adding missing required sections');
  }
  
  // Only add red flags for truly critical issues
  if (overallScore < 50) {
    redFlags.push('LEGAL PROTECTION: Document may not provide adequate legal protection for landlord or tenant');
  }
  
  if (!hasTenantName || !hasPropertyAddress || !hasRentAmount) {
    redFlags.push('CRITICAL TERMS: Essential lease terms (tenant, property, rent) are unclear or missing - document may be unenforceable');
  }
  
  // Ensure scores don't go below 0
  overallScore = Math.max(0, overallScore);
  readabilityScore = Math.max(0, readabilityScore);
  
  return {
    overall_score: overallScore,
    critical_issues: issues,
    formatting_problems: formattingProblems,
    missing_sections: missingSections,
    readability_score: readabilityScore,
    professional_standards: professionalStandards,
    red_flags: redFlags,
    recommendations: recommendations
  };
} 

function generatePortfolioImpact(basicData: any, riskAnalysis: any) {
  const rentAmount = parseFloat(basicData.base_rent?.replace(/[$,]/g, '') || '0');
  const leaseTerm = parseInt(basicData.lease_term?.replace(/\D/g, '') || '12');
  
  return {
    revenue_impact: {
      annual_revenue: rentAmount * 12,
      total_lease_value: rentAmount * leaseTerm,
      monthly_cash_flow: rentAmount,
      roi_estimate: rentAmount > 2000 ? 'High' : rentAmount > 1500 ? 'Medium' : 'Low'
    },
    risk_exposure: {
      total_risk_value: rentAmount * leaseTerm * (riskAnalysis.risk_level === 'High' ? 0.3 : riskAnalysis.risk_level === 'Medium' ? 0.15 : 0.05),
      portfolio_risk_contribution: riskAnalysis.risk_level === 'High' ? 'Significant' : riskAnalysis.risk_level === 'Medium' ? 'Moderate' : 'Minimal',
      diversification_impact: rentAmount > 3000 ? 'High-value property - consider portfolio balance' : 'Standard portfolio addition'
    },
    market_positioning: {
      rent_per_sqft: rentAmount > 2000 ? 'Premium' : rentAmount > 1500 ? 'Market Rate' : 'Below Market',
      competitive_position: rentAmount > 2500 ? 'High-end market' : rentAmount > 1800 ? 'Mid-market' : 'Value segment',
      growth_potential: rentAmount < 2000 ? 'High - below market rates' : rentAmount < 2500 ? 'Moderate' : 'Limited - already premium'
    }
  };
}

function generateComplianceAssessment(leaseText: string, basicData: any) {
  const complianceIssues: string[] = [];
  const complianceScore = 100;
  
  // Check for essential compliance elements
  const complianceChecks = [
    {
      category: 'Fair Housing',
      terms: ['discrimination', 'fair housing', 'equal opportunity', 'protected class'],
      required: true,
      description: 'Fair Housing Act compliance'
    },
    {
      category: 'Security Deposit',
      terms: ['security deposit', 'deposit', 'escrow'],
      required: false,
      description: 'Security deposit handling requirements'
    },
    {
      category: 'Lead Paint',
      terms: ['lead paint', 'lead-based paint', 'lead disclosure'],
      required: false,
      description: 'Lead paint disclosure for older properties'
    },
    {
      category: 'Mold Disclosure',
      terms: ['mold', 'mildew', 'moisture', 'water damage'],
      required: false,
      description: 'Mold and moisture disclosure'
    },
    {
      category: 'Bed Bug',
      terms: ['bed bug', 'bedbug', 'pest control'],
      required: false,
      description: 'Bed bug disclosure and policies'
    },
    {
      category: 'Smoke Detector',
      terms: ['smoke detector', 'fire alarm', 'safety equipment'],
      required: false,
      description: 'Safety equipment requirements'
    },
    {
      category: 'Carbon Monoxide',
      terms: ['carbon monoxide', 'co detector'],
      required: false,
      description: 'Carbon monoxide detector requirements'
    }
  ];
  
  const missingCompliance = complianceChecks.filter(check => {
    if (!check.required) return false;
    return !check.terms.some(term => leaseText.toLowerCase().includes(term));
  });
  
  if (missingCompliance.length > 0) {
    complianceIssues.push(...missingCompliance.map(check => 
      `MISSING COMPLIANCE: ${check.category} - ${check.description}`
    ));
  }
  
  return {
    compliance_score: complianceScore - (missingCompliance.length * 10),
    compliance_issues: complianceIssues,
    regulatory_requirements: missingCompliance.map(check => check.category),
    recommended_actions: missingCompliance.map(check => 
      `Add ${check.category.toLowerCase()} disclosure and compliance language`
    )
  };
}

function generateStrategicRecommendations(basicData: any, marketInsights: any, riskAnalysis: any) {
  const rentAmount = parseFloat(basicData.base_rent?.replace(/[$,]/g, '') || '0');
  const recommendations: string[] = [];
  
  // Revenue optimization
  if (rentAmount < 2000) {
    recommendations.push('REVENUE OPPORTUNITY: Consider rent increase to market rates - current rent appears below market');
  }
  
  if (rentAmount > 3000) {
    recommendations.push('PREMIUM POSITIONING: High-value property - focus on tenant quality and retention strategies');
  }
  
  // Risk mitigation
  if (riskAnalysis.risk_level === 'High') {
    recommendations.push('RISK MITIGATION: High-risk lease - implement additional monitoring and contingency planning');
  }
  
  // Market positioning
  if (rentAmount < 1800) {
    recommendations.push('MARKET POSITIONING: Below-market rates suggest opportunity for value-add improvements or rent increases');
  }
  
  // Portfolio strategy
  if (rentAmount > 2500) {
    recommendations.push('PORTFOLIO STRATEGY: Premium property - consider as anchor asset in portfolio diversification');
  }
  
  // Operational efficiency
  recommendations.push('OPERATIONAL EFFICIENCY: Implement automated rent collection and maintenance request systems');
  
  // Technology integration
  recommendations.push('TECHNOLOGY INTEGRATION: Consider smart building features for premium positioning and operational efficiency');
  
  return {
    immediate_actions: recommendations.slice(0, 3),
    strategic_planning: recommendations.slice(3, 6),
    long_term_vision: recommendations.slice(6),
    portfolio_optimization: [
      'Diversify property types and locations',
      'Implement automated property management systems',
      'Develop tenant retention and satisfaction programs',
      'Consider value-add improvements for underperforming properties'
    ]
  };
} 