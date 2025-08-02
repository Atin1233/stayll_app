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

export interface STAYLLAnalysis {
  lease_summary: {
    property_address: string;
    tenant_name: string;
    lease_term: string;
    base_rent: string;
    total_value: string;
    legal_strength: 'weak' | 'neutral' | 'strong';
  };
  clause_analysis: ClauseAnalysis[];
  risk_analysis: RiskAnalysis;
  market_insights: {
    rent_trend: 'increasing' | 'stable' | 'decreasing';
    market_position: 'above' | 'at' | 'below';
    comparable_rents: string[];
  };
  action_items: {
    immediate: string[];
    upcoming: string[];
    long_term: string[];
  };
  confidence_score: number;
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

export async function analyzeLeaseWithSTAYLL(leaseText: string, propertyType: 'residential' | 'commercial' = 'residential'): Promise<STAYLLAnalysis> {
  console.log('🤖 STAYLL AI Engine: Starting comprehensive lease analysis...');
  
  try {
    // Step 1: Extract basic lease data
    const basicData = extractBasicLeaseData(leaseText);
    
    // Step 2: Perform clause-by-clause analysis
    const clauseAnalysis = await analyzeClauses(leaseText, propertyType);
    
    // Step 3: Calculate risk analysis
    const riskAnalysis = calculateRiskAnalysis(clauseAnalysis, basicData, propertyType);
    
    // Step 4: Generate market insights
    const marketInsights = generateMarketInsights(basicData, propertyType);
    
    // Step 5: Create action items
    const actionItems = generateActionItems(riskAnalysis, basicData);
    
    // Step 6: Calculate overall confidence
    const confidenceScore = calculateConfidenceScore(clauseAnalysis, basicData);
    
    // Step 7: Generate lease summary
    const leaseSummary = generateLeaseSummary(basicData, riskAnalysis);
    
    return {
      lease_summary: leaseSummary,
      clause_analysis: clauseAnalysis,
      risk_analysis: riskAnalysis,
      market_insights: marketInsights,
      action_items: actionItems,
      confidence_score: confidenceScore
    };
    
  } catch (error) {
    console.error('STAYLL AI analysis error:', error);
    throw new Error(`STAYLL AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function extractBasicLeaseData(text: string) {
  // This would use the existing patterns from leaseAnalysis.ts
  // For now, return a basic structure
  return {
    property_address: 'Extracted from text',
    tenant_name: 'Extracted from text',
    base_rent: 'Extracted from text',
    lease_start: 'Extracted from text',
    lease_end: 'Extracted from text'
  };
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

function generateMarketInsights(basicData: any, propertyType: 'residential' | 'commercial') {
  const marketData = MARKET_DATA[propertyType];
  
  return {
    rent_trend: marketData.market_trends['2024'] as any,
    market_position: 'at' as any, // This would be calculated based on actual rent
    comparable_rents: ['Market data unavailable']
  };
}

function generateActionItems(riskAnalysis: RiskAnalysis, basicData: any) {
  const immediate: string[] = [];
  const upcoming: string[] = [];
  const longTerm: string[] = [];
  
  if (riskAnalysis.risk_level === 'critical') {
    immediate.push('Review lease with legal counsel immediately');
  }
  
  if (riskAnalysis.missing_clauses.length > 0) {
    upcoming.push('Add missing clauses before lease execution');
  }
  
  if (riskAnalysis.overall_risk_score > 50) {
    longTerm.push('Consider lease renegotiation for better terms');
  }
  
  return { immediate, upcoming, longTerm };
}

function calculateConfidenceScore(clauses: ClauseAnalysis[], basicData: any): number {
  const totalConfidence = clauses.reduce((sum, clause) => sum + clause.confidence, 0);
  const averageConfidence = clauses.length > 0 ? totalConfidence / clauses.length : 0;
  
  // Boost confidence if we have good basic data
  const basicDataBonus = Object.values(basicData).filter(v => v && v !== 'Extracted from text').length * 10;
  
  return Math.min(averageConfidence + basicDataBonus, 100);
}

function generateLeaseSummary(basicData: any, riskAnalysis: RiskAnalysis) {
  return {
    property_address: basicData.property_address,
    tenant_name: basicData.tenant_name,
    lease_term: `${basicData.lease_start} to ${basicData.lease_end}`,
    base_rent: basicData.base_rent,
    total_value: 'Calculated from rent and term',
    legal_strength: riskAnalysis.risk_level === 'critical' ? 'weak' : 
                   riskAnalysis.risk_level === 'high' ? 'weak' : 
                   riskAnalysis.risk_level === 'medium' ? 'neutral' : 'strong'
  };
} 