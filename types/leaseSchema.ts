/**
 * STAYLL AI - Comprehensive Lease Schema
 * Financial-grade data structure for lease abstraction
 */

// ============================================================================
// CORE LEASE SCHEMA
// ============================================================================

export interface LeaseSchema {
  // Metadata
  lease_id: string;
  property_id?: string;
  tenant_name?: string;
  landlord_name?: string;
  premises_description?: string;
  square_feet?: number;
  
  // Term
  term: LeaseTerm;
  
  // Economics
  economics: LeaseEconomics;
  
  // Obligations & Events
  obligations: LeaseObligations;
  
  // Flags & QA
  flags: LeaseFlags;
  
  // Source tracking
  source_clause_ids: string[];
  confidence_score: number;
  qa_status: 'auto' | 'flagged' | 'approved';
}

// ============================================================================
// TERM
// ============================================================================

export interface LeaseTerm {
  commencement_date?: string; // ISO date
  expiration_date?: string; // ISO date
  possession_date?: string; // ISO date
  free_rent_periods?: FreeRentPeriod[];
  renewal_options?: RenewalOption[];
  
  // Source tracking
  source_clause_ids?: string[];
  confidence_score?: number;
}

export interface FreeRentPeriod {
  start_date: string; // ISO date
  end_date: string; // ISO date
  description?: string;
  source_clause_ids?: string[];
}

export interface RenewalOption {
  option_number: number;
  term_years?: number;
  term_months?: number;
  notice_required_days?: number;
  notice_deadline?: string; // ISO date (calculated from expiration)
  rent_basis?: 'market' | 'fixed' | 'escalated' | 'formula';
  rent_amount?: number;
  rent_per_sf?: number;
  source_clause_ids?: string[];
}

// ============================================================================
// ECONOMICS
// ============================================================================

export interface LeaseEconomics {
  base_rent_schedule: RentScheduleEntry[];
  escalations: Escalation[];
  additional_rent: AdditionalRent;
  
  // Source tracking
  source_clause_ids?: string[];
  confidence_score?: number;
}

export interface RentScheduleEntry {
  start_date: string; // ISO date
  end_date: string; // ISO date
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annual';
  per_sf_or_total: 'per_sf' | 'total';
  per_sf_amount?: number; // If per_sf_or_total is 'per_sf'
  source_clause_ids?: string[];
}

export interface Escalation {
  type: 'fixed' | 'percent' | 'index';
  value: number; // Dollar amount for fixed, percentage for percent/index
  frequency: 'monthly' | 'quarterly' | 'annual' | 'one_time';
  effective_date?: string; // ISO date
  cap?: number; // Maximum escalation (for percent/index)
  floor?: number; // Minimum escalation (for percent/index)
  index_type?: 'cpi' | 'ppi' | 'custom'; // For index type
  source_clause_ids?: string[];
}

export interface AdditionalRent {
  cam?: CAMDetails;
  taxes?: TaxDetails;
  insurance?: InsuranceDetails;
  utilities?: UtilitiesDetails;
  other?: OtherAdditionalRent[];
  source_clause_ids?: string[];
}

export interface CAMDetails {
  billing_method: 'proportional' | 'fixed' | 'passthrough';
  amount?: number; // For fixed
  per_sf?: number; // For proportional
  estimated_annual?: number;
  reconciliation_frequency?: 'monthly' | 'quarterly' | 'annual';
  source_clause_ids?: string[];
}

export interface TaxDetails {
  billing_method: 'proportional' | 'fixed' | 'passthrough';
  amount?: number;
  per_sf?: number;
  estimated_annual?: number;
  reconciliation_frequency?: 'monthly' | 'quarterly' | 'annual';
  source_clause_ids?: string[];
}

export interface InsuranceDetails {
  billing_method: 'proportional' | 'fixed' | 'passthrough';
  amount?: number;
  per_sf?: number;
  estimated_annual?: number;
  source_clause_ids?: string[];
}

export interface UtilitiesDetails {
  responsibility: 'tenant' | 'landlord' | 'shared';
  billing_method?: 'metered' | 'fixed' | 'estimated';
  amount?: number;
  source_clause_ids?: string[];
}

export interface OtherAdditionalRent {
  name: string;
  billing_method: 'proportional' | 'fixed' | 'passthrough';
  amount?: number;
  per_sf?: number;
  frequency?: 'monthly' | 'quarterly' | 'annual';
  source_clause_ids?: string[];
}

// ============================================================================
// OBLIGATIONS & EVENTS
// ============================================================================

export interface LeaseObligations {
  notice_events: NoticeEvent[];
  termination_rights?: TerminationRight[];
  expansion_rights?: ExpansionRight[];
  rofr_rights?: ROFRRight[];
  co_tenancy?: CoTenancyClause[];
  source_clause_ids?: string[];
}

export interface NoticeEvent {
  event_type: 'renewal_notice' | 'termination_notice' | 'expansion_notice' | 'rent_escalation' | 'other';
  notice_date: string; // ISO date (deadline)
  related_clause_id?: string;
  description?: string;
  days_before_event?: number; // e.g., "90 days before expiration"
  source_clause_ids?: string[];
}

export interface TerminationRight {
  party: 'tenant' | 'landlord' | 'either';
  trigger_event?: string; // e.g., "co-tenancy failure", "sale of property"
  notice_required_days?: number;
  effective_date_calculation?: string; // Description of how date is calculated
  source_clause_ids?: string[];
}

export interface ExpansionRight {
  type: 'right_of_first_offer' | 'right_of_first_refusal' | 'expansion_option';
  space_description?: string;
  square_feet?: number;
  rent_basis?: 'market' | 'fixed' | 'formula';
  notice_required_days?: number;
  source_clause_ids?: string[];
}

export interface ROFRRight {
  type: 'right_of_first_refusal' | 'right_of_first_offer';
  space_description?: string;
  trigger_event?: string;
  source_clause_ids?: string[];
}

export interface CoTenancyClause {
  required_tenant?: string;
  required_tenant_type?: string; // e.g., "anchor tenant"
  square_feet_threshold?: number;
  sales_threshold?: number;
  remedies?: string[]; // e.g., "rent reduction", "termination right"
  source_clause_ids?: string[];
}

// ============================================================================
// FLAGS & QA
// ============================================================================

export interface LeaseFlags {
  validation_errors: ValidationError[];
  reconciliation_warnings: ReconciliationWarning[];
  relational_gaps: RelationalGap[];
  qa_status: 'auto' | 'flagged' | 'approved';
  qa_notes?: string;
}

export interface ValidationError {
  field_name: string;
  error_type: 'schema' | 'type' | 'logic' | 'financial';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ReconciliationWarning {
  field_name: string;
  expected_value?: any;
  actual_value?: any;
  variance_percent?: number;
  message: string;
}

export interface RelationalGap {
  detected_text: string;
  missing_field: string;
  message: string;
}

// ============================================================================
// TRANSFORM LOG
// ============================================================================

export interface TransformLogEntry {
  timestamp: string;
  transform_type: 'extracted_by_model' | 'normalized_by_rule' | 'overridden_by_user' | 'validated' | 'reconciled';
  transform_version?: string;
  user_id?: string;
  input_value?: any;
  output_value?: any;
  rule_name?: string;
}

// ============================================================================
// CLAUSE SEGMENTATION
// ============================================================================

export interface ClauseSegment {
  clause_id: string;
  type: 'term_section' | 'base_rent_section' | 'options_section' | 'cam_section' | 'escalation_section' | 'notice_section' | 'misc_section';
  title?: string;
  text: string;
  page_range: {
    start: number;
    end: number;
  };
  bounding_box?: [number, number, number, number]; // [x, y, width, height]
}

// ============================================================================
// OCR & EXTRACTION RESULTS
// ============================================================================

export interface OCRResult {
  lease_id: string;
  lease_raw_text: string;
  lease_pages: PageData[];
  rent_tables: RentTable[];
  document_index: DocumentIndex;
}

export interface PageData {
  page_number: number;
  text: string;
  layout_info?: {
    blocks: TextBlock[];
  };
}

export interface TextBlock {
  text: string;
  coordinates: [number, number, number, number]; // [x, y, width, height]
  block_type: 'paragraph' | 'heading' | 'table' | 'list';
}

export interface RentTable {
  page_number: number;
  cells: string[][]; // rows[columns]
  coordinates: [number, number, number, number];
  detected_structure?: {
    header_row?: number;
    date_columns?: number[];
    amount_columns?: number[];
  };
}

export interface DocumentIndex {
  clause_headings: Array<{
    heading: string;
    page_number: number;
    clause_id?: string;
  }>;
}

