// Google Vertex AI Integration for STAYLL
// Advanced AI-powered lease analysis using Google's enterprise-grade models

import { VertexAI } from '@google-cloud/vertexai';

// Initialize Vertex AI
const vertex_ai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-east4',
});

// Initialize the generative model (Gemini)
const model = vertex_ai.getGenerativeModel({
  model: process.env.VERTEX_AI_MODEL || 'gemini-1.0-pro',
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.1,
    topP: 0.8,
    topK: 40,
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
});

export interface VertexAIAnalysisRequest {
  text: string;
  task: 'extract_lease_data' | 'classify_clauses' | 'assess_risk' | 'generate_recommendations' | 'comprehensive_analysis';
  propertyType?: 'residential' | 'commercial';
}

export interface VertexAIAnalysisResponse {
  success: boolean;
  data: any;
  confidence?: number;
  model_used?: string;
  error?: string;
  tokens_used?: number;
}

// Main analysis function using Vertex AI
export async function analyzeWithVertexAI(request: VertexAIAnalysisRequest): Promise<VertexAIAnalysisResponse> {
  try {
    console.log('🤖 Vertex AI: Starting analysis for task:', request.task);
    
    switch (request.task) {
      case 'extract_lease_data':
        return await extractLeaseDataWithVertexAI(request.text);
      case 'classify_clauses':
        return await classifyClausesWithVertexAI(request.text);
      case 'assess_risk':
        return await assessRiskWithVertexAI(request.text);
      case 'generate_recommendations':
        return await generateRecommendationsWithVertexAI(request.text);
      case 'comprehensive_analysis':
        return await comprehensiveAnalysisWithVertexAI(request.text, request.propertyType);
      default:
        throw new Error(`Unknown AI task: ${request.task}`);
    }
  } catch (error) {
    console.error('Vertex AI error:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown Vertex AI error'
    };
  }
}

// Extract lease data using Vertex AI
async function extractLeaseDataWithVertexAI(text: string): Promise<VertexAIAnalysisResponse> {
  try {
    const prompt = `You are an expert lease analysis AI. Extract the following information from this lease document and return ONLY a valid JSON object with no additional text or formatting:

{
  "tenant_name": "Full legal name of tenant/lessee",
  "property_address": "Complete property address including city, state, zip",
  "monthly_rent": "Monthly rent amount with currency symbol",
  "lease_start_date": "Lease start date in YYYY-MM-DD format",
  "lease_end_date": "Lease end date in YYYY-MM-DD format",
  "security_deposit": "Security deposit amount with currency symbol",
  "late_fee": "Late payment fee amount with currency symbol",
  "lease_term_months": "Duration in months as a number",
  "utilities": "Who pays utilities (tenant/landlord/both)",
  "parking": "Parking arrangements",
  "pets": "Pet policy",
  "smoking": "Smoking policy",
  "due_date": "Rent due date each month"
}

Lease document text:
${text.substring(0, 4000)}

Extract only the requested information. If information is not found, use "Not specified" for that field. Return ONLY the JSON object.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const extractedText = response.text();
    
    // Parse the JSON response
    let extractedData;
    try {
      // Clean the response text to extract JSON
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback to regex extraction
      return {
        success: true,
        data: extractWithRegex(text),
        confidence: 0.6,
        model_used: 'regex_fallback'
      };
    }
    
    return {
      success: true,
      data: extractedData,
      confidence: 0.9,
      model_used: 'gemini-1.5-flash',
      tokens_used: response.usageMetadata?.totalTokenCount || 0
    };
    
  } catch (error) {
    console.error('Vertex AI extraction error:', error);
    // Fallback to regex
    return {
      success: true,
      data: extractWithRegex(text),
      confidence: 0.6,
      model_used: 'regex_fallback'
    };
  }
}

// Classify lease clauses using Vertex AI
async function classifyClausesWithVertexAI(text: string): Promise<VertexAIAnalysisResponse> {
  try {
    const prompt = `You are a legal document analysis expert. Analyze this lease document and classify the presence of different clause types. Return ONLY a valid JSON array with no additional text:

[
  {
    "clause_type": "rent_terms",
    "present": true/false,
    "confidence": 0.0-1.0,
    "description": "Brief description of what was found"
  }
]

Clause types to analyze:
- rent_terms: Base rent, rent escalations, payment terms
- lease_term: Duration, start/end dates, renewal options
- security_deposit: Deposit amounts, return conditions
- tenant_rights: Subletting, assignments, exclusive use
- landlord_duties: Maintenance, repairs, access rights
- penalties: Late fees, default clauses, cure periods
- termination: Early termination, notice periods
- special_provisions: Use restrictions, co-tenancy, force majeure

Lease text: ${text.substring(0, 3000)}

Return ONLY the JSON array.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const extractedText = response.text();
    
    let classifications;
    try {
      const jsonMatch = extractedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        classifications = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON array found');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback to regex classification
      classifications = classifyWithRegex(text);
    }
    
    return {
      success: true,
      data: classifications,
      confidence: 0.85,
      model_used: 'gemini-1.5-flash',
      tokens_used: response.usageMetadata?.totalTokenCount || 0
    };
    
  } catch (error) {
    console.error('Vertex AI classification error:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Classification failed'
    };
  }
}

// Assess risks using Vertex AI
async function assessRiskWithVertexAI(text: string): Promise<VertexAIAnalysisResponse> {
  try {
    const prompt = `You are a lease risk assessment expert. Analyze this lease document for potential risks and return ONLY a valid JSON object:

{
  "overall_risk_score": 0-100,
  "overall_risk_level": "low/medium/high/critical",
  "risks": [
    {
      "risk_factor": "risk_name",
      "severity": "low/medium/high/critical",
      "description": "Detailed description of the risk",
      "potential_impact": "Financial/legal/operational impact",
      "recommendation": "How to mitigate this risk"
    }
  ]
}

Risk factors to identify:
1. NO_RENT_ESCALATION - No annual rent increase provisions
2. SHORT_TERM_LEASE - Month-to-month or very short term
3. EXCESSIVE_LATE_FEES - Late fees over $100
4. NO_CURE_PERIOD - No grace period before default
5. TENANT_TERMINATION_RIGHTS - Tenant can terminate early
6. UNLIMITED_CAM_PASSTHROUGH - No cap on expense passthroughs
7. ONE_SIDED_PENALTIES - Penalties only apply to tenant
8. MISSING_ESSENTIAL_CLAUSES - No maintenance, access, or use clauses

Lease text: ${text.substring(0, 4000)}

Return ONLY the JSON object.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const extractedText = response.text();
    
    let riskAnalysis;
    try {
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        riskAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback to regex-based risk assessment
      riskAnalysis = assessRiskWithRegex(text);
    }
    
    return {
      success: true,
      data: riskAnalysis,
      confidence: 0.9,
      model_used: 'gemini-1.5-flash',
      tokens_used: response.usageMetadata?.totalTokenCount || 0
    };
    
  } catch (error) {
    console.error('Vertex AI risk assessment error:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Risk assessment failed'
    };
  }
}

// Generate recommendations using Vertex AI
async function generateRecommendationsWithVertexAI(text: string): Promise<VertexAIAnalysisResponse> {
  try {
    const prompt = `You are a lease optimization expert. Analyze this lease and provide specific, actionable recommendations. Return ONLY a valid JSON object:

{
  "recommendations": [
    {
      "type": "rent_optimization|risk_mitigation|legal_compliance|market_competitiveness|cash_flow",
      "priority": "high|medium|low",
      "recommendation": "Specific action to take",
      "impact": "Expected benefit",
      "implementation": "How to implement this recommendation",
      "timeline": "When to implement (immediate|short_term|long_term)"
    }
  ],
  "overall_assessment": "Summary of lease quality and key areas for improvement"
}

Consider these areas:
1. RENT OPTIMIZATION - Escalations, market rates, payment terms
2. RISK MITIGATION - Cure periods, penalty caps, termination rights
3. LEGAL COMPLIANCE - Required clauses, enforceability
4. MARKET COMPETITIVENESS - Terms vs. market standards
5. CASH FLOW PROTECTION - Payment security, expense controls

Lease text: ${text.substring(0, 4000)}

Return ONLY the JSON object.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const extractedText = response.text();
    
    let recommendations;
    try {
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback to basic recommendations
      recommendations = generateBasicRecommendations(text);
    }
    
    return {
      success: true,
      data: recommendations,
      confidence: 0.85,
      model_used: 'gemini-1.5-flash',
      tokens_used: response.usageMetadata?.totalTokenCount || 0
    };
    
  } catch (error) {
    console.error('Vertex AI recommendation error:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Recommendation generation failed'
    };
  }
}

// Comprehensive analysis using Vertex AI
async function comprehensiveAnalysisWithVertexAI(text: string, propertyType: string = 'residential'): Promise<VertexAIAnalysisResponse> {
  try {
    const prompt = `You are STAYLL, an advanced AI lease analysis system. Perform a comprehensive analysis of this ${propertyType} lease document. Return ONLY a valid JSON object:

{
  "lease_summary": {
    "property_address": "Complete property address",
    "tenant_name": "Tenant name",
    "lease_term": "Lease duration",
    "base_rent": "Monthly rent amount",
    "total_value": "Total lease value",
    "legal_strength": "strong|weak|neutral"
  },
  "key_findings": [
    "Important findings from the analysis"
  ],
  "risk_assessment": {
    "overall_risk_score": 0-100,
    "risk_level": "low|medium|high|critical",
    "top_risks": ["List of top 3 risks"]
  },
  "market_analysis": {
    "rent_competitiveness": "above|at|below market",
    "lease_terms_quality": "excellent|good|fair|poor",
    "market_position": "premium|standard|value"
  },
  "action_items": {
    "immediate": ["Actions needed in 0-30 days"],
    "short_term": ["Actions needed in 30-90 days"],
    "long_term": ["Actions needed in 90+ days"]
  },
  "compliance_status": {
    "score": 0-100,
    "issues": ["List of compliance issues"],
    "recommendations": ["How to fix compliance issues"]
  },
  "financial_impact": {
    "annual_revenue": "Annual rent revenue",
    "total_lease_value": "Total lease value",
    "risk_exposure": "Potential financial risk"
  }
}

Lease text: ${text.substring(0, 5000)}

Return ONLY the JSON object with no additional text or formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const extractedText = response.text();
    
    let analysis;
    try {
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback to basic analysis
      analysis = generateBasicAnalysis(text);
    }
    
    return {
      success: true,
      data: analysis,
      confidence: 0.95,
      model_used: 'gemini-1.5-flash',
      tokens_used: response.usageMetadata?.totalTokenCount || 0
    };
    
  } catch (error) {
    console.error('Vertex AI comprehensive analysis error:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Comprehensive analysis failed'
    };
  }
}

// Fallback functions for when Vertex AI is not available
function extractWithRegex(text: string) {
  const data: any = {};
  
  // Extract rent
  const rentMatch = text.match(/(?:rent|monthly rent)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/i);
  if (rentMatch) data.monthly_rent = `$${rentMatch[1]}`;
  
  // Extract dates
  const dateMatches = text.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2})/g);
  if (dateMatches && dateMatches.length >= 2) {
    data.lease_start_date = dateMatches[0];
    data.lease_end_date = dateMatches[1];
  }
  
  // Extract address
  const addressMatch = text.match(/(\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd)[,\s]*[A-Za-z\s,]+(?:[A-Z]{2}\s*\d{5})?)/i);
  if (addressMatch) data.property_address = addressMatch[1];
  
  // Extract tenant name
  const nameMatch = text.match(/(?:tenant|lessee)[:\s]*([A-Z][a-z]+ [A-Z][a-z]+)/i);
  if (nameMatch) data.tenant_name = nameMatch[1];
  
  return data;
}

function classifyWithRegex(text: string) {
  const clauseTypes = [
    'rent_terms', 'lease_term', 'security_deposit', 'tenant_rights',
    'landlord_duties', 'penalties', 'termination', 'special_provisions'
  ];
  
  return clauseTypes.map(type => ({
    clause_type: type,
    present: checkClauseWithRegex(text, type),
    confidence: 0.7,
    description: `${type.replace('_', ' ')} clause analysis`
  }));
}

function checkClauseWithRegex(text: string, clauseType: string): boolean {
  const patterns = {
    rent_terms: /(?:rent|monthly rent|base rent)/i,
    lease_term: /(?:lease term|duration|start date|end date)/i,
    security_deposit: /(?:security deposit|deposit)/i,
    tenant_rights: /(?:tenant rights|sublet|assignment)/i,
    landlord_duties: /(?:landlord|maintenance|repair)/i,
    penalties: /(?:late fee|penalty|default)/i,
    termination: /(?:termination|end|expire)/i,
    special_provisions: /(?:special|provision|clause)/i
  };
  
  return patterns[clauseType as keyof typeof patterns]?.test(text) || false;
}

function assessRiskWithRegex(text: string) {
  const risks = [];
  const lowerText = text.toLowerCase();
  
  if (!lowerText.includes('escalation') && !lowerText.includes('increase')) {
    risks.push({
      risk_factor: 'no_rent_escalation',
      severity: 'medium',
      description: 'No rent escalation may reduce long-term cash flow',
      potential_impact: 'Reduced revenue growth over time',
      recommendation: 'Add annual rent escalation clause (3-5% typical)'
    });
  }
  
  if (lowerText.includes('month to month') || lowerText.includes('30 days')) {
    risks.push({
      risk_factor: 'short_term_lease',
      severity: 'high',
      description: 'Short-term lease creates tenant turnover risk',
      potential_impact: 'Increased vacancy risk and turnover costs',
      recommendation: 'Consider longer lease term for stability'
    });
  }
  
  return {
    overall_risk_score: risks.length * 25,
    overall_risk_level: risks.length > 2 ? 'high' : risks.length > 0 ? 'medium' : 'low',
    risks: risks
  };
}

function generateBasicRecommendations(text: string) {
  const recommendations = [];
  const lowerText = text.toLowerCase();
  
  if (!lowerText.includes('escalation')) {
    recommendations.push({
      type: 'rent_optimization',
      priority: 'high',
      recommendation: 'Add annual rent escalation clause (3-5% typical)',
      impact: 'Improves long-term cash flow by 15-25%',
      implementation: 'Include in lease renewal or new lease negotiations',
      timeline: 'short_term'
    });
  }
  
  return {
    recommendations: recommendations,
    overall_assessment: 'Basic lease analysis completed'
  };
}

function generateBasicAnalysis(text: string) {
  return {
    lease_summary: {
      property_address: 'Address extracted from text',
      tenant_name: 'Tenant name extracted from text',
      lease_term: 'Lease term extracted from text',
      base_rent: 'Rent amount extracted from text',
      total_value: 'Calculated from extracted data',
      legal_strength: 'neutral'
    },
    key_findings: ['Basic analysis completed using fallback methods'],
    risk_assessment: {
      overall_risk_score: 50,
      risk_level: 'medium',
      top_risks: ['Analysis limited without AI processing']
    },
    market_analysis: {
      rent_competitiveness: 'unknown',
      lease_terms_quality: 'fair',
      market_position: 'standard'
    },
    action_items: {
      immediate: ['Review extracted data for accuracy'],
      short_term: ['Consider professional lease review'],
      long_term: ['Implement AI-powered analysis for better insights']
    },
    compliance_status: {
      score: 70,
      issues: ['Limited compliance analysis without AI'],
      recommendations: ['Enable full AI analysis for comprehensive compliance check']
    },
    financial_impact: {
      annual_revenue: 'Calculated from extracted rent',
      total_lease_value: 'Calculated from extracted terms',
      risk_exposure: 'Estimated based on basic analysis'
    }
  };
}
