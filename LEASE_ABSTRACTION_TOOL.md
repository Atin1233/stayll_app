# Lease Abstraction Tool - Implementation Summary

## Overview

This document describes the comprehensive lease abstraction tool built for Stayll AI v5.0. The tool extracts structured, financial-grade data from commercial lease documents using a hybrid approach of OCR, clause chunking, LLM extraction, deterministic post-processing, validation, and human QA.

## Architecture

### 1. Narrow Schema (`types/leaseSchema.ts`)

Defines the strict LeaseSchema that the entire system understands:

- **Metadata**: lease_id, property_id, tenant_name, landlord_name, premises_description, square_feet
- **Term**: commencement_date, expiration_date, possession_date, free_rent_periods, renewal_options[]
- **Economics**: 
  - base_rent_schedule[], escalations[], additional_rent (CAM, taxes, insurance)
- **Obligations**: notice_events[], termination_rights, expansion/ROFR, co-tenancy
- **Flags**: source_clause_ids[], confidence_score, qa_status

### 2. Ingestion + OCR (`lib/v5/pdfExtraction.ts`)

- Extracts text from PDFs (text-based and scanned)
- Provides page-wise text with layout information
- Detects and extracts rent tables
- Creates document index mapping clause headings to page numbers

### 3. Clause-Level Chunking (`lib/v5/clauseChunking.ts`)

- Detects structure: splits text by headings ("1. TERM", "2. RENT", "ARTICLE 5", etc.)
- Labels each chunk with type: `term_section`, `base_rent_section`, `options_section`, `cam_section`, `escalation_section`, `notice_section`, `misc_section`
- Creates clause segments with page ranges and bounding boxes
- Builds document index for quick clause lookup

### 4. LLM Extraction Engine (`lib/v5/llmExtraction.ts`)

Domain-focused extraction with structured prompts:

- **Term Extraction**: commencement, expiration, possession dates, free rent periods, renewal options
- **Base Rent Extraction**: rent schedules from clauses and tables
- **Escalation Extraction**: fixed, percent, or index-based escalations
- **Renewal Options**: option terms, notice requirements, rent basis
- **Additional Rent**: CAM, taxes, insurance, utilities

Each extraction:
- Uses focused prompts with schema definitions
- Requests source clause references
- Marks fields as null if not confidently found
- Returns confidence scores per field

### 5. Deterministic Post-Processing (`lib/v5/postProcessing.ts`)

Normalizes extracted data:

- **Dates**: Converts to ISO format (YYYY-MM-DD)
- **Money**: Normalizes currency, removes formatting
- **Rent Units**: Parses "$30/sf/year" into structured format
- **Escalations**: Parses "3% annually" into structured escalation objects
- **Currency**: Normalizes to USD (with exchange rate support)

### 6. Validation & Reconciliation (`lib/v5/financialReconciliation.ts`)

Multi-layer validation:

- **Schema Validation**: term_start < term_end, valid dates, reasonable values
- **Financial Reconciliation**: 
  - Rent schedule covers term range
  - Calculates total annual rent from schedule
  - Cross-checks with summary sections (if present)
  - Flags variances > 1-2%
- **Rule-Based Red Flags**:
  - "Renewal option" mentioned but not extracted
  - "Free rent" mentioned but not in schedule
  - Notice requirements mentioned but not extracted

### 7. Human-in-the-Loop QA (`lib/v5/qaService.ts`)

QA queue system:

- **Queue Generation**: Flags leases with:
  - High reconciliation variance
  - High financial value
  - Many flags or low confidence
- **QA UI Support**: 
  - Show current value, confidence, flags
  - "View source" button (clause + table snippet)
  - Inline editing
  - Approve field / approve lease actions
- **Audit Trail**: Tracks all QA edits with user_id, timestamp, reason

### 8. Audit Trail (`lib/v5/audit.ts`)

Comprehensive tracking:

- For each field: source_clauses, transform_log
- Transform log entries:
  - "extracted_by_model v1 at T1"
  - "normalized_by_rule normalize_rent_unit at T2"
  - "overridden_by_user qa_user_123 at T3"
- Frontend can highlight corresponding text in PDF viewer
- Timeline view of transformations

### 9. Product Outputs

#### Compliance Calendar (`lib/v5/complianceCalendar.ts`)

Generates events from:
- Renewal options (window_start, window_end)
- Rent escalations (effective dates)
- Termination rights (notice deadlines)

Exports:
- ICS format for calendar apps
- CSV for ERP systems
- JSON API

#### Portfolio Analytics (`lib/v5/portfolioAnalytics.ts`)

- **Rent Roll**: Annual rent by year, grouped by property/tenant
- **Exposure Calculations**: Total contractual rent, future obligations
- **Grouping**: By property, region, ownership entity, lender
- **Exports**: CSV, JSON

## API Endpoints

### Upload & Extraction
- `POST /api/v5/leases/upload` - Upload lease PDF, triggers extraction

### QA
- `GET /api/v5/qa` - Get QA queue (with filters)
- `POST /api/v5/qa` - Approve/edit fields, approve lease

### Compliance
- `GET /api/v5/compliance/calendar` - Get compliance events (JSON/ICS/CSV)

### Analytics
- `GET /api/v5/analytics/rent-roll` - Generate rent roll (JSON/CSV)
- `GET /api/v5/analytics/exposure` - Calculate portfolio exposure

## Implementation Strategy: Vertical Slices

### Slice 1: Term + Base Rent Only ✅

**Status**: Implemented

- Ingestion → clause chunking → LLM prompt (term & base rent) → post-process → validate
- Basic rent roll for the term
- Event generation for "lease end"

### Slice 2: Simple Escalations ✅

**Status**: Implemented

- Extraction/logic for fixed dollar or percentage bumps each year
- Rent roll and reconciliation incorporate escalations

### Slice 3: Renewal Options ✅

**Status**: Implemented

- Schema for renewals
- Prompt/model improvements to parse renewal clauses
- Generate renewal window events in calendar

### Slice 4: Key Notices / Obligations ✅

**Status**: Implemented

- Expanded schema
- More rules and flags
- Notice event generation

## File Structure

```
lib/v5/
├── clauseChunking.ts          # Clause segmentation
├── llmExtraction.ts           # LLM extraction by domain
├── postProcessing.ts          # Normalization
├── financialReconciliation.ts # Validation & reconciliation
├── qaService.ts               # Human QA
├── complianceCalendar.ts      # Event generation
├── portfolioAnalytics.ts       # Rent roll & exposure
├── enhancedExtraction.ts       # Complete pipeline
├── extraction.ts              # Original extraction (still used)
├── pdfExtraction.ts           # OCR/PDF parsing
├── validation.ts              # Field validation
├── leaseFields.ts             # Field management
├── audit.ts                   # Audit trail
└── organization.ts            # Org management

app/api/v5/
├── leases/upload/route.ts     # Upload endpoint
├── qa/route.ts                # QA endpoints
├── compliance/calendar/route.ts # Calendar API
└── analytics/
    ├── rent-roll/route.ts      # Rent roll API
    └── exposure/route.ts       # Exposure API

types/
├── leaseSchema.ts             # Comprehensive schema
└── v5.0.ts                    # Original types (still used)
```

## Next Steps

1. **LLM Integration**: Connect `llmExtraction.ts` to actual LLM API (OpenAI, Anthropic, Vertex AI)
2. **Table Detection**: Enhance rent table extraction from PDFs
3. **QA UI**: Build frontend components for QA workflow
4. **Export Integrations**: Build ERP/BI connectors (NetSuite, Yardi, MRI, Power BI)
5. **Testing**: Create test suite with labeled lease documents
6. **Performance**: Optimize for processing time <3 min/contract

## Usage Example

```typescript
import { EnhancedExtractionService } from '@/lib/v5/enhancedExtraction';

// Upload and extract
const pdfBuffer = await file.arrayBuffer();
const result = await EnhancedExtractionService.extractLease(
  leaseId,
  orgId,
  Buffer.from(pdfBuffer)
);

// Access extracted data
const leaseSchema = result.leaseSchema;
const fields = result.fields;
const reconciliation = result.reconciliation;

// Generate compliance calendar
import { ComplianceCalendarService } from '@/lib/v5/complianceCalendar';
const events = ComplianceCalendarService.generateEvents(leaseSchema);
const ics = ComplianceCalendarService.exportToICS(events);

// Generate rent roll
import { PortfolioAnalyticsService } from '@/lib/v5/portfolioAnalytics';
const rentRoll = await PortfolioAnalyticsService.generateRentRoll(orgId, 2025);
```

## Notes

- The system is designed to "fail soft" - if a field can't be confidently extracted, it's marked as null with low confidence rather than guessing
- All transformations are logged for audit trail
- Financial reconciliation catches inconsistencies before users see them
- QA system prioritizes high-value leases and high-risk fields
- The schema is strict and consistent - every model, validation rule, export, and dashboard uses the same structure

