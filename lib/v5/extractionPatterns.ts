/**
 * STAYLL v5.0 - Enhanced Extraction Patterns
 * Comprehensive regex patterns for all 20 core financial fields
 */

export interface ExtractionPattern {
  field_name: string;
  patterns: RegExp[];
  format_validator?: (value: string) => boolean;
  normalizer?: (value: string) => any;
  field_type: 'text' | 'date' | 'currency' | 'percentage' | 'structured';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * All 20 Core Financial Fields per PRD v8.0
 */
export const EXTRACTION_PATTERNS: ExtractionPattern[] = [
  // 1. Lease ID & Property ID
  {
    field_name: 'lease_id',
    patterns: [
      /(?:lease|agreement|contract)\s*(?:id|no|number|#)[\s:]*([A-Z0-9-]+)/i,
      /lease\s*(?:agreement|contract)?\s*#?\s*([A-Z0-9-]{5,20})/i,
    ],
    field_type: 'text',
    priority: 'critical',
    format_validator: (v) => v.length >= 3 && v.length <= 50,
  },
  
  {
    field_name: 'property_id',
    patterns: [
      /(?:property|premises|unit)\s*(?:id|no|number|#)[\s:]*([A-Z0-9-]+)/i,
      /property\s*#?\s*([A-Z0-9-]{3,20})/i,
    ],
    field_type: 'text',
    priority: 'critical',
    format_validator: (v) => v.length >= 2 && v.length <= 50,
  },

  // 2. Tenant & Landlord Entity
  {
    field_name: 'tenant_name',
    patterns: [
      /(?:tenant|lessee)[\s:]+([A-Z][a-zA-Z\s&.,'-]{2,100}(?:LLC|Inc|Corp|Ltd)?)/,
      /(?:between|by and between)[\s\S]{0,100}?(?:landlord|lessor)[\s\S]{0,50}?and\s+([A-Z][a-zA-Z\s&.,'-]{2,100})/i,
      /lessee:\s*([A-Z][a-zA-Z\s&.,'-]{2,100})/i,
    ],
    field_type: 'text',
    priority: 'critical',
    format_validator: (v) => v.length >= 2 && /[A-Z]/.test(v),
  },

  {
    field_name: 'landlord_name',
    patterns: [
      /(?:landlord|lessor)[\s:]+([A-Z][a-zA-Z\s&.,'-]{2,100}(?:LLC|Inc|Corp|Ltd)?)/,
      /(?:between|by and between)\s+([A-Z][a-zA-Z\s&.,'-]{2,100})(?:,|\s+and)/i,
      /lessor:\s*([A-Z][a-zA-Z\s&.,'-]{2,100})/i,
    ],
    field_type: 'text',
    priority: 'high',
    format_validator: (v) => v.length >= 2 && /[A-Z]/.test(v),
  },

  // 3. Property Address
  {
    field_name: 'property_address',
    patterns: [
      /(?:property|premises|located at|demised premises)[\s:]+([0-9]+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Place|Pl|Parkway|Pkwy)[^\n]{0,80})/i,
      /address:\s*([0-9]+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd)[^\n]{0,80})/i,
    ],
    field_type: 'text',
    priority: 'critical',
    format_validator: (v) => /\d/.test(v) && v.length >= 10,
  },

  // 4. Lease Start/End Dates
  {
    field_name: 'lease_start',
    patterns: [
      /(?:commencement date|start date|effective date|lease begins?)[\s:]+([0-9]{1,2}[-\/][0-9]{1,2}[-\/][0-9]{2,4})/i,
      /(?:beginning|commencing|effective)\s+(?:on\s+)?([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/i,
      /(?:term|lease)\s+(?:shall\s+)?(?:commence|begin)\s+(?:on\s+)?([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/i,
    ],
    field_type: 'date',
    priority: 'critical',
    format_validator: (v) => !isNaN(Date.parse(v)),
    normalizer: (v) => new Date(v).toISOString().split('T')[0],
  },

  {
    field_name: 'lease_end',
    patterns: [
      /(?:expiration date|end date|termination date|lease ends?)[\s:]+([0-9]{1,2}[-\/][0-9]{1,2}[-\/][0-9]{2,4})/i,
      /(?:ending|expiring|terminating)\s+(?:on\s+)?([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/i,
      /(?:term|lease)\s+(?:shall\s+)?(?:expire|end|terminate)\s+(?:on\s+)?([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/i,
    ],
    field_type: 'date',
    priority: 'critical',
    format_validator: (v) => !isNaN(Date.parse(v)),
    normalizer: (v) => new Date(v).toISOString().split('T')[0],
  },

  // 5. Term Length
  {
    field_name: 'term_length',
    patterns: [
      /(?:term|lease term|duration)[\s:]+(\d+)\s*(?:months?|years?)/i,
      /(?:period|term)\s+of\s+(\d+)\s*(?:months?|years?)/i,
    ],
    field_type: 'text',
    priority: 'high',
    format_validator: (v) => /\d+/.test(v),
  },

  // 6. Base Rent
  {
    field_name: 'base_rent',
    patterns: [
      /(?:base rent|monthly rent|rent amount)[\s:]+\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i,
      /\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:per month|monthly|\/month)/i,
      /rent(?:al)?(?:\s+of)?\s+\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i,
    ],
    field_type: 'currency',
    priority: 'critical',
    format_validator: (v) => /^\d{1,3}(?:,\d{3})*(?:\.\d{2})?$/.test(v.replace('$', '')),
    normalizer: (v) => parseFloat(v.replace(/[$,]/g, '')),
  },

  // 7. Rent Schedule (step rent table)
  {
    field_name: 'rent_schedule',
    patterns: [
      /rent\s+schedule[\s\S]{0,500}?((?:year\s+\d+[\s:]+\$\d+[^\n]*\n?)+)/i,
      /(?:annual|monthly)\s+rent[\s\S]{0,200}?((?:\d{4}[-\/]\d{2}[-\/]\d{2}[\s:]+\$\d+[^\n]*\n?){2,})/i,
    ],
    field_type: 'structured',
    priority: 'critical',
    format_validator: (v) => v.includes('$') && /\d/.test(v),
  },

  // 8. Rent Escalation Clauses
  {
    field_name: 'escalation_clause',
    patterns: [
      /(?:rent|annual)\s+(?:escalation|increase|adjustment)[\s:]+(\d+(?:\.\d+)?%?|\$\d+|CPI[^\n]{0,100})/i,
      /(?:rent|base rent)\s+shall\s+(?:increase|be adjusted)\s+(?:by\s+)?([^\n]{10,150})/i,
      /CPI\s*(?:\+|\s+plus)\s*(\d+(?:\.\d+)?%)/i,
    ],
    field_type: 'text',
    priority: 'critical',
    format_validator: (v) => v.length >= 3,
  },

  // 9. Rent Commencement Date
  {
    field_name: 'rent_commencement',
    patterns: [
      /(?:rent|payment)\s+commencement(?:\s+date)?[\s:]+([0-9]{1,2}[-\/][0-9]{1,2}[-\/][0-9]{2,4})/i,
      /rent\s+(?:shall\s+)?(?:commence|begin)\s+(?:on\s+)?([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/i,
    ],
    field_type: 'date',
    priority: 'high',
    format_validator: (v) => !isNaN(Date.parse(v)),
    normalizer: (v) => new Date(v).toISOString().split('T')[0],
  },

  // 10. Renewal Options
  {
    field_name: 'renewal_options',
    patterns: [
      /(?:renewal|extension)\s+option[s]?[\s\S]{0,300}?(\d+\s+(?:months?|years?)[^\n.]{0,100})/i,
      /option\s+to\s+(?:renew|extend)[\s\S]{0,200}?([^\n.]{20,200})/i,
      /notice\s+of\s+(?:intent to\s+)?(?:renew|renewal)[\s:]+([^\n.]{10,150})/i,
    ],
    field_type: 'text',
    priority: 'high',
    format_validator: (v) => v.length >= 10,
  },

  // 11. Termination Rights
  {
    field_name: 'termination_rights',
    patterns: [
      /(?:early\s+)?termination[^\n.]{0,200}?((?:notice|penalty|fee|payment)[^\n.]{10,150})/i,
      /break\s+(?:clause|option|right)[\s\S]{0,150}?([^\n.]{10,150})/i,
      /right\s+to\s+terminate[\s\S]{0,150}?([^\n.]{10,150})/i,
    ],
    field_type: 'text',
    priority: 'medium',
    format_validator: (v) => v.length >= 5,
  },

  // 12. Operating Expense Allocation
  {
    field_name: 'operating_expenses',
    patterns: [
      /operating\s+expense[s]?[\s\S]{0,200}?((?:gross[- ]up|base year|tenant['\s]+share)[^\n.]{10,150})/i,
      /(?:CAM|common area maintenance)\s+(?:charges?|expenses?)[\s\S]{0,150}?([^\n.]{10,150})/i,
      /additional\s+rent[\s\S]{0,150}?(operating[^\n.]{10,150})/i,
    ],
    field_type: 'text',
    priority: 'high',
    format_validator: (v) => v.length >= 5,
  },

  // 13. Lease Type (Gross vs Net)
  {
    field_name: 'lease_type',
    patterns: [
      /((?:triple|double|modified)\s+net|gross|full[- ]service|NNN)/i,
      /lease\s+type[\s:]+([^\n]{5,50})/i,
    ],
    field_type: 'text',
    priority: 'high',
    format_validator: (v) => v.length >= 3,
  },

  // 14. CAM Details
  {
    field_name: 'cam_details',
    patterns: [
      /CAM[\s\S]{0,150}?(pro[- ]?rata\s+share[^\n.]{0,100}|proportionate\s+share[^\n.]{0,100})/i,
      /common\s+area\s+maintenance[\s\S]{0,200}?(\$\d+[^\n.]{0,100})/i,
    ],
    field_type: 'text',
    priority: 'medium',
    format_validator: (v) => v.length >= 3,
  },

  // 15. Tax Details
  {
    field_name: 'tax_details',
    patterns: [
      /(?:real estate|property)\s+tax(?:es)?[\s\S]{0,200}?(tenant[^\n.]{0,150}|\$\d+[^\n.]{0,100})/i,
      /tax(?:es)?\s+(?:obligation|responsibility)[\s:]+([^\n.]{10,150})/i,
    ],
    field_type: 'text',
    priority: 'medium',
    format_validator: (v) => v.length >= 5,
  },

  // 16. Insurance Details
  {
    field_name: 'insurance_details',
    patterns: [
      /insurance[\s\S]{0,200}?((?:general liability|property|casualty)[^\n.]{10,150})/i,
      /(?:coverage|policy)\s+amount[\s:]+\$(\d{1,3}(?:,\d{3})*)/i,
    ],
    field_type: 'text',
    priority: 'medium',
    format_validator: (v) => v.length >= 5,
  },

  // 17. Late Fee Terms
  {
    field_name: 'late_fee',
    patterns: [
      /late\s+(?:fee|charge|payment)[\s:]+(\d+%?|\$\d+[^\n]{0,50})/i,
      /(?:if|when)\s+rent\s+(?:is\s+)?not\s+paid[\s\S]{0,100}?(\d+%|\$\d+)[^\n.]{0,50}/i,
    ],
    field_type: 'text',
    priority: 'medium',
    format_validator: (v) => /\d/.test(v),
  },

  // 18. Payment Frequency & Due Date
  {
    field_name: 'payment_frequency',
    patterns: [
      /(?:rent|payment)\s+(?:is\s+)?(?:due|payable)\s+(monthly|quarterly|annually)/i,
      /payments?\s+of\s+\$\d+\s+(monthly|quarterly|annually)/i,
    ],
    field_type: 'text',
    priority: 'high',
    format_validator: (v) => /(monthly|quarterly|annual)/i.test(v),
  },

  {
    field_name: 'payment_due_date',
    patterns: [
      /(?:rent|payment)\s+due\s+(?:on\s+)?(?:the\s+)?(\d{1,2}(?:st|nd|rd|th)?(?:\s+day)?)/i,
      /payable\s+on\s+(?:or before\s+)?(?:the\s+)?(\d{1,2}(?:st|nd|rd|th)?)/i,
      /due\s+(?:date|on)[\s:]+(\d{1,2})/i,
    ],
    field_type: 'text',
    priority: 'high',
    format_validator: (v) => /\d/.test(v),
  },

  // 19. Notice Addresses
  {
    field_name: 'notice_address_landlord',
    patterns: [
      /notice(?:s)?\s+to\s+(?:landlord|lessor)[\s:]+([^\n]{20,200})/i,
      /landlord(?:'s)?\s+address[\s:]+([^\n]{20,150})/i,
    ],
    field_type: 'text',
    priority: 'low',
    format_validator: (v) => v.length >= 10,
  },

  {
    field_name: 'notice_address_tenant',
    patterns: [
      /notice(?:s)?\s+to\s+(?:tenant|lessee)[\s:]+([^\n]{20,200})/i,
      /tenant(?:'s)?\s+address[\s:]+([^\n]{20,150})/i,
    ],
    field_type: 'text',
    priority: 'low',
    format_validator: (v) => v.length >= 10,
  },

  // 20. Security Deposit
  {
    field_name: 'security_deposit',
    patterns: [
      /security\s+deposit[\s:]+\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i,
      /deposit[\s:]+\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i,
    ],
    field_type: 'currency',
    priority: 'high',
    format_validator: (v) => /^\d{1,3}(?:,\d{3})*(?:\.\d{2})?$/.test(v.replace('$', '')),
    normalizer: (v) => parseFloat(v.replace(/[$,]/g, '')),
  },

  // 21. Guarantor Information
  {
    field_name: 'guarantor',
    patterns: [
      /guarantor[\s:]+([A-Z][a-zA-Z\s&.,'-]{2,100})/i,
      /guarantee[d]?\s+by\s+([A-Z][a-zA-Z\s&.,'-]{2,100})/i,
    ],
    field_type: 'text',
    priority: 'low',
    format_validator: (v) => v.length >= 2,
  },
];

/**
 * Get extraction patterns for a specific field
 */
export function getFieldPatterns(fieldName: string): ExtractionPattern | undefined {
  return EXTRACTION_PATTERNS.find(p => p.field_name === fieldName);
}

/**
 * Get all critical fields
 */
export function getCriticalFields(): string[] {
  return EXTRACTION_PATTERNS
    .filter(p => p.priority === 'critical')
    .map(p => p.field_name);
}

/**
 * Validate extracted value against field pattern
 */
export function validateExtractedValue(
  fieldName: string,
  value: string
): { valid: boolean; normalized?: any } {
  const pattern = getFieldPatterns(fieldName);
  if (!pattern) {
    return { valid: false };
  }

  const valid = pattern.format_validator ? pattern.format_validator(value) : true;
  const normalized = pattern.normalizer ? pattern.normalizer(value) : value;

  return { valid, normalized };
}
