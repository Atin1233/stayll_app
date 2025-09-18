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
  
  // Perform comprehensive analysis with AI
  const { analyzeWithAI } = await import('./aiModel');
  const comprehensiveResults = await analyzeWithAI({ 
    text: leaseText, 
    task: 'comprehensive_analysis',
    propertyType: 'residential' // Default to residential, can be made configurable
  });
  
  let clauses: ClauseAnalysis[] = [];
  let riskAnalysis: RiskAnalysis;
  let actionItems: any;
  
  if (comprehensiveResults.success && comprehensiveResults.data) {
    // Use comprehensive analysis results
    const data = comprehensiveResults.data;
    clauses = convertComprehensiveClauseResults(data);
    riskAnalysis = convertComprehensiveRiskResults(data);
    actionItems = convertComprehensiveActionItems(data);
    console.log('STAYLL AI: Comprehensive analysis complete');
  } else {
    // Fallback to individual analysis methods
    const clauseResults = await analyzeWithAI({ text: leaseText, task: 'classify_clauses' });
    clauses = convertAIClauseResults(clauseResults.success ? clauseResults.data : []);
    console.log('STAYLL AI: Clauses analyzed:', clauses.length);
    
    const riskResults = await analyzeWithAI({ text: leaseText, task: 'assess_risk' });
    riskAnalysis = convertAIRiskResults(riskResults.success ? riskResults.data : {});
    console.log('STAYLL AI: Risk assessment complete');
    
    actionItems = generateActionItems(riskAnalysis, basicData);
    console.log('STAYLL AI: Action items generated');
  }
  
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

function convertComprehensiveClauseResults(data: any): ClauseAnalysis[] {
  // Convert comprehensive analysis data to clause analysis format
  const clauses: ClauseAnalysis[] = [];
  
  // Map key findings to clause analysis
  if (data.key_findings && Array.isArray(data.key_findings)) {
    data.key_findings.forEach((finding: string, index: number) => {
      clauses.push({
        type: 'special' as any,
        confidence: 85,
        extracted_data: { finding },
        risk_level: 'low' as any,
        risk_factors: [],
        recommendations: []
      });
    });
  }
  
  return clauses;
}

function convertComprehensiveRiskResults(data: any): RiskAnalysis {
  const riskData = data.risk_assessment || {};
  
  return {
    overall_risk_score: riskData.overall_risk_score || 0,
    risk_level: riskData.risk_level as any || 'low',
    missing_clauses: [],
    problematic_clauses: [],
    cash_flow_risks: riskData.top_risks || [],
    legal_risks: [],
    market_risks: [],
    recommendations: data.recommendations?.recommendations?.map((r: any) => r.recommendation) || []
  };
}

function convertComprehensiveActionItems(data: any): any {
  return {
    immediate: data.action_items?.immediate || [],
    upcoming: data.action_items?.short_term || [],
    long_term: data.action_items?.long_term || []
  };
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
  // CONTENT-AWARE DATA EXTRACTION - Extract actual data from lease content
  
  // Extract tenant name with better patterns
  const tenantPatterns = [
    /(?:tenant|lessee|resident|occupant)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/gi,
    /(?:tenant|lessee|resident|occupant)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/gi,
    /(?:between|by and between)[\s\w]+and\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/gi,
    /(?:hereinafter called|hereinafter referred to as)\s+["']?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})["']?/gi
  ];
  
  let tenantName = 'Tenant name not found';
  for (const pattern of tenantPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      tenantName = match[1].trim();
      break;
    }
  }
  
  // Extract property address with better patterns
  const addressPatterns = [
    /(?:property|premises|address|location)[:\s]+([0-9]+\s+[A-Z][a-z\s]+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Way|Circle|Cir)[,\s]+[A-Z][a-z\s]+(?:,?\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?)?)/gi,
    /(?:located at|situated at)[:\s]+([0-9]+\s+[A-Z][a-z\s]+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Way|Circle|Cir)[,\s]+[A-Z][a-z\s]+(?:,?\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?)?)/gi,
    /(?:premises|property)[:\s]+([0-9]+\s+[A-Z][a-z\s]+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Way|Circle|Cir)[,\s]+[A-Z][a-z\s]+(?:,?\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?)?)/gi
  ];
  
  let propertyAddress = 'Address not found';
  for (const pattern of addressPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      propertyAddress = match[1].trim();
      break;
    }
  }
  
  // Extract rent amount with better patterns
  const rentPatterns = [
    /(?:rent|monthly rent|base rent|payment)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi,
    /(?:amount of|sum of)\s*\$?([0-9,]+(?:\.[0-9]{2})?)\s*(?:dollars|per month|monthly)/gi,
    /(?:pay|payment of)\s*\$?([0-9,]+(?:\.[0-9]{2})?)\s*(?:dollars|per month|monthly)/gi,
    /\$([0-9,]+(?:\.[0-9]{2})?)\s*(?:per month|monthly|rent)/gi
  ];
  
  let baseRent = 'Rent amount not found';
  for (const pattern of rentPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (amount > 0 && amount < 50000) { // Reasonable rent range
        baseRent = `$${amount.toLocaleString()}`;
        break;
      }
    }
  }
  
  // Extract lease term with better patterns
  const termPatterns = [
    /(?:term|duration|period)[:\s]*(\d+)\s*(?:months?|years?)/gi,
    /(?:lease|agreement)\s*(?:for|of)\s*(\d+)\s*(?:months?|years?)/gi,
    /(?:commencing|beginning|starting)[\s\w]+(?:for|period of)\s*(\d+)\s*(?:months?|years?)/gi
  ];
  
  let leaseTerm = 'Lease term not found';
  for (const pattern of termPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const term = parseInt(match[1]);
      if (term > 0 && term <= 120) { // Reasonable term range (1-120 months)
        leaseTerm = `${term} months`;
        break;
      }
    }
  }
  
  // Extract security deposit with better patterns
  const depositPatterns = [
    /(?:security deposit|deposit)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi,
    /(?:deposit of|deposit amount)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi,
    /(?:pay|payment of)\s*\$?([0-9,]+(?:\.[0-9]{2})?)\s*(?:as|for)\s*(?:security|deposit)/gi
  ];
  
  let securityDeposit = 'Security deposit not found';
  for (const pattern of depositPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (amount > 0 && amount < 100000) { // Reasonable deposit range
        securityDeposit = `$${amount.toLocaleString()}`;
        break;
      }
    }
  }
  
  // Extract late fee with better patterns
  const lateFeePatterns = [
    /(?:late fee|late payment|penalty)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi,
    /(?:fee of|penalty of)\s*\$?([0-9,]+(?:\.[0-9]{2})?)\s*(?:for|if)\s*(?:late|delayed)/gi
  ];
  
  let lateFee = 'Late fee not found';
  for (const pattern of lateFeePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (amount > 0 && amount < 10000) { // Reasonable late fee range
        lateFee = `$${amount.toLocaleString()}`;
        break;
      }
    }
  }
  
  // Extract lease start date with better patterns
  const startDatePatterns = [
    /(?:commencing|beginning|starting|effective)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
    /(?:start date|commencement date)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
    /(?:lease|agreement)\s*(?:commencing|beginning|starting)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi
  ];
  
  let leaseStart = 'Start date not found';
  for (const pattern of startDatePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      leaseStart = match[1];
      break;
    }
  }
  
  // Extract lease end date with better patterns
  const endDatePatterns = [
    /(?:ending|expiring|terminating)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
    /(?:end date|expiration date|termination date)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
    /(?:until|through)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi
  ];
  
  let leaseEnd = 'End date not found';
  for (const pattern of endDatePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      leaseEnd = match[1];
      break;
    }
  }
  
  // Calculate total lease value
  let totalValue = 'Total value not calculated';
  if (baseRent !== 'Rent amount not found' && leaseTerm !== 'Lease term not found') {
    const rentAmount = parseFloat(baseRent.replace(/[$,]/g, ''));
    const termMonths = parseInt(leaseTerm.replace(/\D/g, ''));
    if (rentAmount > 0 && termMonths > 0) {
      totalValue = `$${(rentAmount * termMonths).toLocaleString()}`;
    }
  }
  
  // Determine legal strength based on actual content
  const legalTerms = ['whereas', 'hereby', 'hereinafter', 'party', 'parties', 'agreement', 'covenant', 'warrant', 'represent', 'acknowledge', 'binding', 'enforceable', 'jurisdiction'];
  const foundLegalTerms = legalTerms.filter(term => text.toLowerCase().includes(term));
  const legalStrength = foundLegalTerms.length >= 8 ? 'strong' : foundLegalTerms.length >= 4 ? 'neutral' : 'weak';
  
  return {
    tenant_name: tenantName,
    property_address: propertyAddress,
    base_rent: baseRent,
    lease_term: leaseTerm,
    security_deposit: securityDeposit,
    late_fee: lateFee,
    lease_start: leaseStart,
    lease_end: leaseEnd,
    total_value: totalValue,
    legal_strength: legalStrength
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
  
  // CONTENT-AWARE ANALYSIS - Based on actual lease content, not assumptions
  
  // Analyze actual extracted data quality
  const hasValidTenantName = basicData.tenant_name && 
                            basicData.tenant_name !== 'Extracted from text' && 
                            basicData.tenant_name !== 'Tenant name not found' &&
                            basicData.tenant_name.length > 2;
  
  const hasValidPropertyAddress = basicData.property_address && 
                                 basicData.property_address !== 'Extracted from text' && 
                                 basicData.property_address !== 'Address not found' &&
                                 basicData.property_address.length > 10;
  
  const hasValidRentAmount = basicData.base_rent && 
                            basicData.base_rent !== 'Extracted from text' && 
                            basicData.base_rent !== 'Rent amount not found' &&
                            parseFloat(basicData.base_rent.replace(/[$,]/g, '')) > 0;
  
  const hasValidLeaseTerm = basicData.lease_term && 
                           basicData.lease_term !== 'Extracted from text' && 
                           basicData.lease_term !== 'Lease term not found' &&
                           parseInt(basicData.lease_term.replace(/\D/g, '')) > 0;
  
  // Check for actual data completeness based on extracted information
  if (!hasValidTenantName) {
    issues.push('TENANT IDENTIFICATION: Tenant name could not be clearly identified from the lease document - review document for proper tenant identification');
    overallScore -= 15;
  }
  
  if (!hasValidPropertyAddress) {
    issues.push('PROPERTY IDENTIFICATION: Property address could not be clearly identified from the lease document - review document for complete property address');
    overallScore -= 15;
  }
  
  if (!hasValidRentAmount) {
    issues.push('RENT SPECIFICATION: Rent amount could not be clearly identified from the lease document - review document for explicit rent amount');
    overallScore -= 15;
  }
  
  if (!hasValidLeaseTerm) {
    issues.push('LEASE TERM: Lease duration could not be clearly identified from the lease document - review document for lease term specification');
    overallScore -= 10;
  }
  
  // Analyze actual lease structure based on content
  const hasSectionHeaders = /(section|clause|article|paragraph)\s*\d+/i.test(leaseText);
  const hasNumberedItems = /\d+\.\s/.test(leaseText) || /[A-Z]\.\s/.test(leaseText);
  const hasClearParagraphs = leaseText.split('\n\n').length > 5;
  
  if (!hasSectionHeaders && !hasNumberedItems) {
    formattingProblems.push('DOCUMENT STRUCTURE: Lease lacks clear section organization - consider adding numbered sections or clauses for better readability');
    readabilityScore -= 10;
  }
  
  if (!hasClearParagraphs) {
    formattingProblems.push('DOCUMENT FORMATTING: Lease appears to lack proper paragraph breaks - consider improving document formatting for better readability');
    readabilityScore -= 5;
  }
  
  // Check for actual dates in the document
  const datePatterns = [
    /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/,
    /\b\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/,
    /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/i
  ];
  
  const foundDates = datePatterns.some(pattern => pattern.test(leaseText));
  if (!foundDates) {
    formattingProblems.push('DATE SPECIFICATION: No clear dates found in the lease document - ensure lease includes start date, end date, and other relevant dates');
    readabilityScore -= 8;
  }
  
  // Check for actual signature/execution content
  const signatureTerms = ['signature', 'signed', 'execute', 'execution', 'witness', 'notary', 'date signed'];
  const hasSignatureContent = signatureTerms.some(term => leaseText.toLowerCase().includes(term));
  
  if (!hasSignatureContent) {
    formattingProblems.push('EXECUTION PROVISIONS: No signature or execution provisions found in the lease document - consider adding signature blocks and execution date');
    overallScore -= 10;
  }
  
  // Analyze actual legal language based on content
  const legalTerms = [
    'whereas', 'hereby', 'hereinafter', 'party', 'parties', 'agreement', 'covenant',
    'warrant', 'represent', 'acknowledge', 'binding', 'enforceable', 'jurisdiction',
    'lease', 'landlord', 'tenant', 'premises', 'term', 'rent', 'deposit'
  ];
  
  const foundLegalTerms = legalTerms.filter(term => leaseText.toLowerCase().includes(term));
  const legalTermPercentage = (foundLegalTerms.length / legalTerms.length) * 100;
  
  if (legalTermPercentage < 20) {
    issues.push(`LEGAL LANGUAGE: Document contains limited legal terminology (${foundLegalTerms.length}/${legalTerms.length} terms found) - consider adding more formal legal language for enforceability`);
    professionalStandards.push(`LEGAL ENHANCEMENT: Add formal legal terms like ${legalTerms.filter(term => !leaseText.toLowerCase().includes(term)).slice(0, 3).join(', ')} for better legal structure`);
    overallScore -= 15;
  } else if (legalTermPercentage < 40) {
    formattingProblems.push(`LEGAL LANGUAGE: Document contains moderate legal terminology (${foundLegalTerms.length}/${legalTerms.length} terms) - could benefit from additional formal language`);
    overallScore -= 5;
  }
  
  // Check for actual lease-specific provisions based on content
  const leaseProvisions = [
    { term: 'rent', description: 'rent payment terms' },
    { term: 'deposit', description: 'security deposit terms' },
    { term: 'utilities', description: 'utility payment responsibilities' },
    { term: 'maintenance', description: 'maintenance responsibilities' },
    { term: 'termination', description: 'lease termination procedures' },
    { term: 'late fee', description: 'late payment penalties' },
    { term: 'pets', description: 'pet policies' },
    { term: 'smoking', description: 'smoking policies' },
    { term: 'quiet enjoyment', description: 'tenant rights' },
    { term: 'entry', description: 'landlord access rights' }
  ];
  
  const foundProvisions = leaseProvisions.filter(provision => 
    leaseText.toLowerCase().includes(provision.term)
  );
  
  const missingProvisions = leaseProvisions.filter(provision => 
    !leaseText.toLowerCase().includes(provision.term)
  );
  
  if (foundProvisions.length < 5) {
    issues.push(`LEASE PROVISIONS: Document contains only ${foundProvisions.length}/10 common lease provisions - consider adding missing provisions for comprehensive coverage`);
    missingSections.push(...missingProvisions.slice(0, 5).map(provision => 
      `MISSING: ${provision.description} - document does not address ${provision.term}`
    ));
    overallScore -= foundProvisions.length * 2;
  }
  
  // Check for actual compliance language based on content
  const complianceTerms = [
    { term: 'discrimination', category: 'Fair Housing', required: true },
    { term: 'fair housing', category: 'Fair Housing', required: true },
    { term: 'lead paint', category: 'Lead Paint Disclosure', required: false },
    { term: 'mold', category: 'Mold Disclosure', required: false },
    { term: 'bed bug', category: 'Bed Bug Policy', required: false },
    { term: 'smoke detector', category: 'Safety Equipment', required: false }
  ];
  
  const missingCompliance = complianceTerms.filter(term => 
    term.required && !leaseText.toLowerCase().includes(term.term)
  );
  
  if (missingCompliance.length > 0) {
    issues.push(`COMPLIANCE: Missing required compliance language: ${missingCompliance.map(term => term.category).join(', ')}`);
    overallScore -= missingCompliance.length * 5;
  }
  
  // Analyze actual financial terms based on extracted data
  if (hasValidRentAmount) {
    const rentAmount = parseFloat(basicData.base_rent.replace(/[$,]/g, ''));
    if (rentAmount < 500) {
      formattingProblems.push('RENT AMOUNT: Extracted rent amount appears unusually low - verify rent amount is correct and complete');
    } else if (rentAmount > 10000) {
      formattingProblems.push('RENT AMOUNT: Extracted rent amount appears unusually high - verify rent amount is correct and complete');
    }
  }
  
  // Check for actual inconsistencies in the document
  const rentMentions = (leaseText.match(/rent/gi) || []).length;
  const depositMentions = (leaseText.match(/deposit/gi) || []).length;
  
  if (rentMentions === 0) {
    issues.push('RENT TERMS: No rent-related language found in the document - ensure rent terms are clearly specified');
    overallScore -= 20;
  }
  
  if (depositMentions === 0) {
    formattingProblems.push('DEPOSIT TERMS: No security deposit language found - consider adding security deposit terms');
  }
  
  // Generate content-specific recommendations
  if (overallScore < 40) {
    recommendations.push('CRITICAL: Document requires significant improvement based on actual content analysis');
    recommendations.push('DATA VERIFICATION: Verify and clarify tenant name, property address, and rent amount');
    recommendations.push('LEGAL REVIEW: Consult with attorney for proper lease structure and language');
  } else if (overallScore < 60) {
    recommendations.push('SUBSTANTIAL IMPROVEMENTS: Document needs major revisions based on content analysis');
    recommendations.push('MISSING PROVISIONS: Add missing lease provisions identified in analysis');
    recommendations.push('STRUCTURE IMPROVEMENT: Enhance document organization and formatting');
  } else if (overallScore < 80) {
    recommendations.push('MODERATE IMPROVEMENTS: Document is generally adequate but could be enhanced');
    recommendations.push('COMPLIANCE: Add missing compliance language identified');
    recommendations.push('CLARITY: Improve readability and organization of existing terms');
  } else {
    recommendations.push('MINOR REFINEMENTS: Document is well-structured and legally adequate');
    recommendations.push('REVIEW: Ensure all extracted data is accurate and complete');
  }
  
  // Add specific recommendations based on actual missing content
  if (!hasValidTenantName) {
    recommendations.push('TENANT: Clearly identify tenant name in the document');
  }
  
  if (!hasValidPropertyAddress) {
    recommendations.push('PROPERTY: Include complete property address in the document');
  }
  
  if (!hasValidRentAmount) {
    recommendations.push('RENT: Specify exact rent amount clearly in the document');
  }
  
  if (missingProvisions.length > 5) {
    recommendations.push(`PROVISIONS: Add missing lease provisions: ${missingProvisions.slice(0, 3).map(p => p.description).join(', ')}`);
  }
  
  // Only add red flags for truly critical content issues
  if (overallScore < 50) {
    redFlags.push('LEGAL PROTECTION: Document may not provide adequate legal protection based on content analysis');
  }
  
  if (!hasValidTenantName || !hasValidPropertyAddress || !hasValidRentAmount) {
    redFlags.push('CRITICAL TERMS: Essential lease terms could not be verified from document content - document may be unenforceable');
  }
  
  if (rentMentions === 0) {
    redFlags.push('RENT SPECIFICATION: No rent terms found in document - critical lease element missing');
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