# STAYLL AI — "The 70-Hour Hail Mary" PRD

**Revised for November 30, 2025 → June 1, 2026 Launch**

---

## 1. Executive Summary (Brutal Reality)

**Goal:** Hit **$200K revenue** by June 2026 by selling **8 CRE portfolios** a **$25K "lease data cleanup" service** you fulfill with **contractors + Google Sheets**. **No code beyond a client upload page.**

**You will not have a SaaS.** You will have a **cash-generating service** that funds real software in H2 2026.

---

## 2. The 70-Hour Budget

| Phase | Hours | Activity |
|-------|-------|----------|
| **Dec 2025** | 10 | Hire 2 contractors, set up Airtable, Stripe |
| **Jan–Feb 2026** | 20 | Build upload portal (Next.js + Supabase) |
| **Mar–May 2026** | 35 | Sales: 8 deals × 4.4 hrs/deal |
| **Jun 2026** | 5 | Deliver final pilots, prep for SaaS |

**Total: 70 hours.** Every hour over this means you miss June.

---

## 3. The "No-Code Service" Stack (Because You Have No Time)

| Component | What It Is | Setup Time |
|-----------|------------|------------|
| **Portal** | Next.js (Cursor template) + Supabase auth + upload | 8 hrs |
| **Project Mgmt** | **Airtable** (free) with 3 views: New / In Progress / Done | 1 hr |
| **OCR** | **Google Document AI API** (you paste PDFs manually) | 2 hrs |
| **Extraction** | **GPT-4** (you paste OCR text, copy fields manually) | 3 hrs |
| **QA** | **Airtable formula** that flags if rent ≠ sum | 1 hr |
| **Billing** | **Stripe Payment Link** (send via email) | 1 hr |
| **Delivery** | **Google Drive folder** (you share link) | 0 hrs |

**You are the API.** You manually move data between tools. **This is not scalable, but it ships.**

---

## 4. Fulfillment Process (You Are the Orchestration Layer)

**Per Lease (15 contractor minutes, 0 founder minutes):**

1. Contractor downloads PDF from Airtable
2. Runs through Google Doc AI (you gave them API key)
3. Pastes OCR text into GPT-4 prompt (you gave them template)
4. Copies 20 fields into Airtable
5. QA checker flags errors → contractor fixes
6. You **only check** 5 random leases per portfolio

**Your time per portfolio:** **45 minutes** (setup + spot check + send invoice).

---

## 5. Sales Plan: 8 Deals in 5 Months

**You must close 1.6 deals/month. This is the critical path.**

### **Sales Activity (35 Hours Total):**

| Week | Action | Hours | Output |
|------|--------|-------|--------|
| **Jan W1** | Build target list of 25 asset managers | 3 | 25 names |
| **Jan W2–4** | Send 5 cold emails/day (M–F) | 5 | 60 touches |
| **Feb W1–2** | Follow up, 5 discovery calls | 4 | 2–3 qualified |
| **Feb W3–4** | Send 3 proposals | 3 | 2 deals closed |
| **Mar–May** | Repeat at 1.5× intensity | 20 | 6 more deals |

**Close rate needed:** 8 deals / 25 targets = **32%** (achievable with founder hustle).

---

## 6. Financial Model (70-Hour Version)

| Item | Amount |
|------|--------|
| **Revenue** (8 deals × $25K) | **$200K** |
| **COGS** (contractors: 2 × $15/hr × 20 hrs/week × 6 mo) | **-$36K** |
| **Gross Profit** | **$164K** |
| **Stripe/Vercel** | -$500 |
| **Net Profit** | **$163K** |

**Cash in bank by June 2026: ~$90K** (deposits + progress payments)

---

## 7. The June 2026 Launch

**What you "launch":**

- A **Vercel site** with a file upload button
- **Airtable backend** showing 8 happy customers
- **$90K cash** to hire a real engineer

**What you say to investors:**  

*"We validated demand: 8 CRE portfolios paid us $200K for lease abstraction. Now we're building the SaaS product to automate it at $10K/year ARR."*

**This is a credible seed story.** You have revenue, customers, and a playbook.

---

## 8. What You Must Sacrifice

- ❌ **No human QA UI** (contractor uses forms)
- ❌ **No API** (CSV only)
- ❌ **No SOC2** (do it later)
- ❌ **No integrations** (customer does CSV → Yardi)
- ❌ **No 97% accuracy** (you manually spot-check, but **guarantee** 95%)

**You are selling trust + speed, not software.** The tech is duct tape.

---

## 9. The "Fuck It, Ship It" Checklist (Start December 2)

### **December 2025 (Week 1):**

- [ ] **Monday:** Post job on OnlineJobs.ph → "Finance grad for lease abstraction, $15/hr, 20 hrs/week"
- [ ] **Tuesday:** Create Airtable base (free plan)
- [ ] **Wednesday:** Set up Supabase project (free tier)
- [ ] **Thursday:** Use Cursor to scaffold Next.js with drag-and-drop upload
- [ ] **Friday:** Connect Supabase auth + storage

**Time spent: 10 hours. You have 60 left.**

---

## 10. The Final Math: Why This Is Your Only Option

**You have 70 hours.** Let's see what's possible:

| Model | Hours Needed | Revenue Possible | Viable? |
|-------|--------------|------------------|---------|
| **Full SaaS PRD #1** | 300+ hrs | $0 | **No** |
| **MVP PRD #2** | 200+ hrs | $5K pilot | **No** |
| **Pure Service (No Tech)** | 0 hrs | $150K (you do all work) | **No (time)** |
| **Productized Service (This PRD)** | 70 hrs | $200K | **YES** |

**$200K in 7 months with 70 hours is $2,857/hour effective rate.** This is the highest ROI path.

---

## 11. Current Codebase Status (November 2025)

### ✅ **Already Built (Aligned with 70-Hour Plan):**

- ✅ Next.js upload portal with drag-and-drop
- ✅ Supabase auth + storage configured
- ✅ Basic file upload functionality
- ✅ Optional property/tenant fields (extraction will handle)
- ✅ Simple dashboard showing status
- ✅ Contracts list view

### ❌ **NOT Needed (Remove/Don't Build):**

- ❌ Complex extraction pipeline (manual process)
- ❌ QA UI in app (contractors use Airtable)
- ❌ Analytics dashboard (not needed)
- ❌ API endpoints (CSV export only)
- ❌ Advanced OCR integration (manual Google Doc AI)
- ❌ LLM extraction code (manual GPT-4 prompts)

### 🎯 **What's Left to Build:**

1. **CSV Export** (2 hrs) - Simple download button that generates CSV from database
2. **Status Updates** (1 hr) - Let contractors mark leases as "In Progress / Review Ready / Complete"
3. **Stripe Payment Link Integration** (1 hr) - Generate payment links per project

**Total remaining dev: ~4 hours. Perfect.**

---

## 12. The Brutal Choice

**You have 70 hours.** You can either:

1. **Build a fake SaaS** that makes $0 and dies, or
2. **Build a real service** that makes $200K and funds the SaaS.

**Launching June 2026 is possible. But only if you start December 2, 2025, and treat every hour like it's worth $3,000.**

---

## 13. Next Steps (This Week)

1. **Stop building features** - The upload portal is done
2. **Set up Airtable** - Create the contractor queue
3. **Hire contractors** - Post on OnlineJobs.ph
4. **Start sales** - Build target list of 25 CRE asset managers
5. **Ship the service** - Not the software

**The code is ready. Now go sell.**

