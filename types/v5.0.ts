/**
 * STAYLL AI v5.0 - TypeScript Type Definitions
 * Financial-Grade Contract Data Layer
 */

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Organization {
  id: string;
  name: string;
  billing_status: 'active' | 'suspended' | 'trial';
  created_at: string;
  updated_at: string;
}

export type UserRole = 'org_admin' | 'analyst' | 'reviewer' | 'auditor' | 'integration';

export interface UserProfile {
  id: string; // References auth.users(id)
  organization_id: string | null;
  role: UserRole;
  full_name?: string;
  company?: string;
  portfolio_size?: number;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type VerificationStatus = 'unverified' | 'in_review' | 'verified' | 'rejected';

export interface Lease {
  id: string;
  org_id: string;
  uploader_id: string;
  tenant_name?: string;
  property_address?: string;
  monthly_rent?: string;
  lease_start?: string;
  lease_end?: string;
  due_date?: string;
  late_fee?: string;
  security_deposit?: string;
  utilities?: string;
  parking?: string;
  pets?: string;
  smoking?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_key?: string; // S3 path
  base_rent?: number;
  rent_schedule?: RentScheduleEntry[];
  confidence_score?: number;
  verification_status: VerificationStatus;
  analysis_summary?: Record<string, any>;
  analysis_data?: Record<string, any>;
  portfolio_impact?: Record<string, any>;
  compliance_assessment?: Record<string, any>;
  strategic_recommendations?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RentScheduleEntry {
  period_start: string;
  period_end: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annual';
}

export type ValidationState = 
  | 'candidate' 
  | 'auto_pass' 
  | 'rule_fail' 
  | 'flagged' 
  | 'human_pass' 
  | 'human_edit';

export interface SourceClauseLocation {
  page: number;
  bounding_box: [number, number, number, number]; // [x, y, width, height]
  clause_id?: string;
  clause_text?: string;
}

export interface LeaseField {
  id: string;
  lease_id: string;
  field_name: string; // e.g., 'lease_start', 'base_rent', 'escalation_rate_yr1'
  value_text?: string;
  value_normalized?: {
    numeric?: number;
    date?: string;
    structured?: Record<string, any>;
  };
  source_clause_location?: SourceClauseLocation;
  extraction_confidence?: number; // 0-100
  validation_state: ValidationState;
  validation_notes?: string;
  value_hash?: string; // HMAC for immutability
  last_modified_by?: string;
  created_at: string;
  updated_at: string;
}

export type ObligationType = 
  | 'renewal_notice' 
  | 'escalation' 
  | 'payment_due' 
  | 'inspection' 
  | 'compliance_check';

export type ObligationStatus = 'pending' | 'completed' | 'overdue' | 'cancelled';

export interface Obligation {
  id: string;
  lease_id: string;
  org_id: string;
  obligation_type: ObligationType;
  date: string;
  due_window?: {
    start: string;
    end: string;
  };
  linked_field_id?: string;
  status: ObligationStatus;
  created_at: string;
  updated_at: string;
}

export type AuditEventType = 
  | 'UPLOAD'
  | 'OCR_COMPLETE'
  | 'FIELD_EXTRACTED'
  | 'FIELD_APPROVED'
  | 'FIELD_EDITED'
  | 'EXPORT_GENERATED'
  | 'LEASE_VERIFIED'
  | 'OBLIGATION_CREATED';

export interface AuditEvent {
  id: string;
  org_id?: string;
  lease_id?: string;
  user_id?: string;
  event_type: AuditEventType;
  payload?: Record<string, any>;
  timestamp: string;
}

export interface ApiKey {
  id: string;
  org_id: string;
  key_hash: string;
  name?: string;
  scopes: string[]; // e.g., ['read:leases', 'write:exports']
  last_used?: string;
  revoked: boolean;
  created_by?: string;
  created_at: string;
  expires_at?: string;
}

export interface LeaseAnalysis {
  id: string;
  lease_id: string;
  user_id: string;
  analyzer_version?: string;
  analysis_type: string;
  analysis_data: Record<string, any>;
  confidence_score?: number;
  processing_time_ms?: number;
  created_at: string;
}

// ============================================================================
// PROCESSING & JOBS
// ============================================================================

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface IngestJob {
  id: string;
  lease_id: string;
  org_id: string;
  status: JobStatus;
  stage?: 'ocr' | 'segmentation' | 'extraction' | 'validation' | 'qa' | 'finalization';
  error_message?: string;
  retry_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface LeaseUploadRequest {
  file: File;
  property_address?: string;
  tenant_name?: string;
  portfolio_tag?: string;
}

export interface LeaseUploadResponse {
  success: boolean;
  lease_id: string;
  job_id: string;
  message?: string;
}

export interface LeaseListResponse {
  success: boolean;
  leases: Lease[];
  count: number;
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface LeaseFieldsResponse {
  success: boolean;
  fields: LeaseField[];
  lease_id: string;
}

export interface QATask {
  id: string;
  lease_id: string;
  field_id: string;
  field_name: string;
  current_value: string;
  validation_state: ValidationState;
  confidence: number;
  source_clause?: SourceClauseLocation;
  created_at: string;
}

export interface QATasksResponse {
  success: boolean;
  tasks: QATask[];
  count: number;
}

export interface FieldUpdateRequest {
  value_text?: string;
  value_normalized?: LeaseField['value_normalized'];
  validation_state: ValidationState;
  validation_notes?: string;
}

export interface ExportRequest {
  lease_ids: string[];
  format: 'csv' | 'json' | 'evidence_pdf';
  include_evidence?: boolean;
}

export interface ExportResponse {
  success: boolean;
  export_id: string;
  download_url: string;
  expires_at: string;
}

// ============================================================================
// VALIDATION & RULES
// ============================================================================

export interface ValidationRule {
  rule_id: string;
  rule_name: string;
  passed: boolean;
  expected?: any;
  actual?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message?: string;
}

export interface ValidationResult {
  field_id: string;
  field_name: string;
  rules: ValidationRule[];
  overall_state: ValidationState;
  requires_qa: boolean;
}

// ============================================================================
// EVIDENCE PACKS
// ============================================================================

export interface EvidencePack {
  lease_id: string;
  verification_hash: string;
  summary: {
    lease_key_fields: Record<string, any>;
    verification_status: VerificationStatus;
    confidence_score: number;
    verified_at: string;
  };
  fields: Array<{
    field_name: string;
    value: any;
    extraction_confidence: number;
    validation_result: ValidationState;
    clause_text: string;
    clause_image_url?: string;
    rule_diagnostics?: ValidationRule[];
  }>;
  audit_timeline: AuditEvent[];
  generated_at: string;
}

// ============================================================================
// OCR & EXTRACTION
// ============================================================================

export interface OCRResult {
  lease_id: string;
  pages: Array<{
    page_number: number;
    text: string;
    blocks: Array<{
      block_type: 'LINE' | 'WORD' | 'TABLE' | 'CELL';
      text: string;
      bounding_box: [number, number, number, number];
      confidence?: number;
    }>;
  }>;
  tables?: Array<{
    page_number: number;
    table_id: string;
    rows: Array<Array<string>>;
    bounding_box: [number, number, number, number];
  }>;
  raw_json_url?: string;
}

export interface ClauseSegment {
  clause_id: string;
  page: number;
  text: string;
  bounding_box: [number, number, number, number];
  type_hint?: string; // e.g., 'rent_terms', 'lease_term', 'security_deposit'
}

// ============================================================================
// UI COMPONENT PROPS
// ============================================================================

export interface ReviewWorkareaProps {
  task: QATask;
  lease: Lease;
  field: LeaseField;
  onApprove: (fieldId: string) => void;
  onEdit: (fieldId: string, updates: FieldUpdateRequest) => void;
  onReject: (fieldId: string, reason: string) => void;
}

export interface LeaseDetailProps {
  lease: Lease;
  fields: LeaseField[];
  obligations: Obligation[];
  auditEvents: AuditEvent[];
}

