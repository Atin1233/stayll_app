# STAYLL AI — Product Requirements Document (PRD v8.0)

**The Financial Data Layer for Commercial Real Estate Leases**

**Document Owner:** CEO, Stayll AI  
**Version:** 8.0 (Formal Release)  
**Last Updated:** November 30, 2025  
**Classification:** Confidential — External Distribution

---

## 1. Product Overview

### 1.1 Mission

Stayll AI transforms commercial real estate leases into verified, auditable financial datasets. We extract rent schedules, escalation clauses, renewal options, and compliance obligations with audit-grade accuracy, enabling asset managers to eliminate financial leakage and automate portfolio analytics.

### 1.2 Core Value Proposition

For CRE asset managers managing 500–5,000 leases, Stayll delivers a single source of truth for lease financials—extracted directly from contract language, reconciled against financial logic, and backed by clause-level evidence.

---

## 2. Problem Statement

### 2.1 Market Pain

Commercial real estate portfolios lose 1–3% of lease value annually due to:

- Missed renewal notice windows
- Incorrect CPI escalations
- Unpaid tenant reimbursements
- Manual data entry errors

**Current solutions:**

- **Offshore abstraction:** $150–300/lease, 30–90 day turnaround, zero accuracy SLA
- **CLMs (Ironclad, Evisort):** Built for legal workflows, not financial reconciliation
- **Generic AI tools:** 80–85% recall, no audit trail, unacceptable for CFO sign-off

### 2.2 Our Solution

Stayll provides financial-grade lease data with:

- ≥95% recall on 20 core financial fields
- Clause-level audit trail (every field linked to source text)
- Deterministic reconciliation (rent schedules must sum ±$1)
- Yardi/MRI native integration (push data directly to GL)
- Accuracy guarantee (<2% error rate or free re-abstraction)

---

## 3. Core Product Features

### 3.1 Document Ingestion

- **Supported Formats:** PDF, scanned images, email attachments
- **Batch Upload:** Up to 500 documents per job
- **Auto-Classification:** Distinguishes leases from amendments, estoppels, LOIs
- **Quality Preflight:** Flags low-resolution scans before processing

### 3.2 Financial Data Extraction

**20 Core Fields (Mandated):**

1. Lease ID & Property ID
2. Tenant & Landlord Entity
3. Lease Start/End Dates
4. Term Length
5. Base Rent Schedule (step rent table)
6. Rent Escalation Clauses (CPI, %, fixed increases)
7. Security Deposit Amount
8. Rent Commencement Date
9. Renewal Options (notice periods, term length, rent bumps)
10. Termination Rights (break dates, penalties)
11. Operating Expense Allocation (gross-up, base year)
12. Gross vs. Net Lease Type
13. CAM/Tax/Insurance Details
14. Late Fee Terms
15. Payment Frequency & Due Date
16. Notice Addresses
17. Guarantor Information
18. [Additional field 18]
19. [Additional field 19]
20. [Additional field 20]

### 3.3 Reconciliation & Financial Engine

- **Rent Roll Generation:** Constructs monthly rent schedules from step rent tables
- **Escalation Projection:** Calculates 5-year cashflow impact of CPI/% increases
- **Discrepancy Detection:** Flags when extracted rent ≠ clause-calculated amount
- **Policy Validation:** Prevents impossible values (negative rent, overlapping dates)

### 3.4 Audit Trail & Evidence

- **Clause Linkage:** Every field hyperlinked to source PDF page/region
- **Edit Log:** Immutable record of all human corrections (user, timestamp, before/after)
- **Confidence Scoring:** Per-field confidence + reason for flagging (uncertainty/conflict)
- **Third-Party Audit:** Quarterly sampling by external CPA (SOC2 Type II roadmap)

### 3.5 Exports & Integrations

**Phase 1 (Service):**

- CSV rent roll (monthly/quarterly)
- iCal compliance calendar (renewals, expirations, notice dates)
- PDF audit package (highlighted leases + edit log)

**Phase 2 (SaaS):**

- Yardi Voyager API (push directly to GL module)
- MRI Software API
- NetSuite (for asset managers with corporate finance)
- Webhook events (renewal 90 days out, rent escalation triggered)

### 3.6 User Roles & Permissions

- **Admin:** Full access, billing, user management
- **Verifier:** Can edit extracted fields, approve batches
- **Viewer:** Read-only access (CFO, auditor)

---

## 4. Technical Architecture

### 4.1 Core Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind UI
- **Backend:** Node.js/Express microservices (OCR, extraction, reconciliation)
- **Database:** PostgreSQL (single-tenant schemas)
- **Storage:** AWS S3 (PDFs + rendered page images)
- **Queue:** Redis (BullMQ for async jobs)
- **Hosting:** Vercel (frontend) / AWS ECS (backend)
- **Observability:** Datadog (metrics) + Sentry (errors)

### 4.2 Extraction Pipeline

1. **OCR Layer:** Google Document AI (table-aware)
2. **Deterministic Parser:** Regex + rule engine for rent tables, dates
3. **LLM Extractor:** GPT-4 Turbo with 10-shot prompt (contextual clauses)
4. **Merge Engine:** Confidence-weighted selection (deterministic wins if high confidence)
5. **Reconciliation Layer:** Python service validates financial logic
6. **Human QA Queue:** Retool UI for contractor review

### 4.3 Performance Targets

- **Processing Time:** <3 min/contract (automated)
- **Recall:** ≥95% on 20 core fields (contractor-verified)
- **Uptime:** 99.5% (SLO: <2h downtime/quarter)
- **Latency:** <500ms for dashboard interactions

---

## 5. Accuracy & Verification Model

Accuracy is a financial SLA, not a marketing claim.

**Verification Workflow:**

1. Model Extraction → GPT-4 + deterministic parser
2. Rule Validation → Reconciliation engine flags discrepancies
3. Human QA → 100% review for pilots, 20% for Professional tier, 5% for Enterprise
4. Audit Sampling → External CPA reviews 5% quarterly
5. Error Escalation → >2% error rate triggers free re-abstraction

**Scaling Threshold:** If automated accuracy <90% on 500-sample set, halt SaaS launch.

---

## 6. User Experience

### 6.1 Workflow

1. **Upload:** Drag-and-drop batch PDFs → automatic preflight
2. **Review:** Side-by-side PDF viewer + extracted fields (with clause highlights)
3. **Approve:** One-click "Verify All" for high-confidence fields
4. **Export:** CSV, API, or direct Yardi push
5. **Monitor:** Dashboard shows portfolio exposure, upcoming renewals, escalation alerts

### 6.2 UX Priorities

- **Transparency:** Show the math behind escalations (CPI formula + base year)
- **Audit Comfort:** Every field shows who approved and when
- **CFO Speed:** "Export to Yardi" is one click

---

## 7. Pricing & Packaging

| Tier | Portfolio Size | Annual Price | QA Coverage | Integration | Target Customer |
|------|----------------|--------------|-------------|-------------|-----------------|
| **Pilot** | 500 leases | $25K (one-time) | 100% manual | CSV/SFTP | First-time validation |
| **Professional** | 1,500 leases | $60K/year | 20% manual | CSV + API | Mid-size asset mgr |
| **Enterprise** | 5,000 leases | $120K/year | 5% manual | Yardi/MRI native | Large REIT/family office |
| **Enterprise Plus** | 5,000+ | Custom | Custom QA | Custom | Top 10 CRE firms |

**Annual Uplift:** $0.10/lease overage

**Guarantee:** <2% error rate or free re-abstraction + 10% credit

---

## 8. Go-To-Market Strategy

### 8.1 Target ICP

- **Title:** Asset Manager, Portfolio Accountant, CFO
- **Firm Size:** 500–5,000 leases (non-traded REITs, family offices, mid-size asset managers)
- **Pain:** Offshore abstraction is slow, inaccurate, unauditable
- **Budget:** $60K–120K/year for data cleanup + compliance

### 8.2 Sales Motion (Year 1)

- **Founder-led sales only** (no AE until $1M ARR)
- **No PLG:** Finance buyers require demos + security review
- **Channel:** Direct outreach via LinkedIn, Crexi, CoStar
- **Sales Cycle:** 4–6 weeks pilot → 90% close rate
- **CAC:** $0 (founder time)

### 8.3 Partnerships (Year 2)

- CRE accounting firms (CBIZ, RSM, BDO): 20% rev share
- Valuation firms (CBRE, JLL): Data partnership
- Bank loan servicing: Compliance monitoring

---

## 9. Competitive Landscape

### 9.1 Direct Competitors

| Player | Strength | Weakness | Threat Level |
|--------|----------|----------|--------------|
| **VTS** | Market leader, owns leasing workflow | No financial reconciliation, not audit-grade | Medium |
| **MRI Software** | Native CRE accounting | Building extraction in-house (slow) | Medium |
| **Yardi** | Dominant property mgmt | No lease abstraction, partners for data | Low |
| **Offshore abstractors (India)** | Cheap ($200/lease) | Zero accuracy SLA, 60-day turnaround | High (status quo) |

### 9.2 Differentiation

- **Accuracy SLA:** Only player with <2% error guarantee
- **Financial Reconciliation:** Deterministic validation of rent schedules
- **Yardi Native:** Direct API push (not CSV)
- **Audit Trail:** Clause-level evidence for auditors

---

## 10. Roadmap: 24-Month Plan

### Q1 2026 (Pre-Seed)

- **Goal:** $35K pre-sales (7 pilots)
- **Build:** Upload portal + CSV export
- **Team:** Solo founder + 2 contractors

### Q2 2026 (Raise)

- **Goal:** Close $250K pre-seed
- **Build:** Reconciliation engine + Retool QA UI
- **Hire:** 1 full-stack engineer

### Q3–Q4 2026 (Scale Service)

- **Goal:** $300K revenue, 10 pilots
- **Build:** Deterministic rule library (200 patterns)
- **Accuracy:** 87% → 92% (automated)

### Q1–Q2 2027 (SaaS Launch)

- **Goal:** Yardi API live, 5 self-serve customers
- **Launch:** $99/mo tier (500 leases)
- **AR:** $600K ARR

### Q3–Q4 2027 (Scale SaaS)

- **Goal:** 20 customers, $1.2M ARR
- **Hire:** 1 salesperson
- **Expansion:** Vendor agreements module

---

## 11. Success Metrics

### Business Metrics

- **Revenue:** $335K (Year 1) → $1.2M ARR (Year 2)
- **Gross Margin:** 80% → 87%
- **NRR:** 130% (Professional → Enterprise upsell)
- **Churn:** <10% annually
- **CAC Payback:** 0 months (founder-led) → 3 months (sales team)

### Product Metrics

- **Recall:** 87% (pilot) → 92% (Year 1) → 95% (Year 2)
- **Processing Time:** <5 min/contract
- **Manual QA Rate:** 100% → 20% → 5% (automated)
- **Error Rate:** <2% on audited sample
- **Integration Time:** <2 hours (CSV) → <1 hour (Yardi API)

---

## 12. Risk & Mitigation

| Risk | Likelihood | Mitigation | Plan B |
|------|------------|------------|--------|
| **Yardi bundles extraction** | 70% | Speed: Launch Yardi API by Month 12 | Pivot to MRI/partners |
| **Accuracy <90%** | 30% | Manual QA guarantee (100% → 5%) | Stay in service mode |
| **Slow sales** | 40% | Target non-traded REITs (fast decisions) | Lower ACV to $30K |
| **Contractor churn** | 20% | Retool UI lowers skill requirement | Hire US-based QA ($30/hr) |
| **Can't raise $250K** | 30% | $35K pre-sales + 10 LOIs | Bootstrap to $100K revenue |

---

## 13. Appendix: Sample Export

```csv
lease_id,property_id,tenant,rent_commencement,base_rent_2025,escalation_type,escalation_rate,renewal_notice_date,termination_option
LA-12345,PROP-NYC-01,Acme Corp,2025-01-01,15000.00,CPI,CPI+2%,2026-10-01,2027-01-01 (penalty $50K)
LA-12346,PROP-NYC-02,Beta LLC,2025-02-15,22000.00,Fixed,3% annually,2026-11-15,NULL
```

Each field includes: `source_clause_pdf_page`, `confidence_score`, `verified_by`, `verified_timestamp`

---

## 14. Contact

**CEO, Stayll AI**  
your.email@stayll.ai  
www.stayll.ai (placeholder until launch)

