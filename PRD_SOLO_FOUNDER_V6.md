# STAYLL AI — Solo Founder PRD v6.0 (The $500K Reality)

**Buildable in 150 Hours | Generates $500K Revenue (Not ARR) | Launches June 2026**

---

## 1. Executive Summary (One Sentence)

Sell 15–20 CRE portfolios a $25K "AI-assisted lease abstraction pilot" that you fulfill with 3 offshore contractors + a simple client portal, pocketing $400K gross profit to fund real SaaS in Year 2.

**This is a productized service, not SaaS. It is the only model that hits $500K with 2–3 hrs/week.**

---

## 2. Core Constraint & Strategic Choice

| Constraint | Impact | Forced Decision |
|------------|--------|-----------------|
| 150 total hours | Cannot build full SaaS | Sell high-touch pilots (6 hrs/deal) |
| No team | Cannot do human QA yourself | Contractors fulfill ($15/hr) |
| No funding | Cannot burn cash on infra | Use Vercel + Supabase + Stripe ($50/month) |
| $500K goal | SaaS ACV too low | $25K/project revenue |

**You are not building software. You are building a profitable service business that looks like AI to customers.**

---

## 3. Product Scope: The *System* You Build (Not the Service)

### **You Build Only These 4 Things (48 Hours Total):**

### **A. Client Portal (20 hrs)**

- **Upload:** Client drags 500 PDFs → you store in Supabase/S3
- **Status:** Shows "In Progress / Review Ready / Complete"
- **Download:** CSV rent roll + highlighted PDFs + audit log
- **Billing:** Stripe Payment Link (no checkout code)
- **Tech:** Next.js on Vercel, Supabase auth, React-PDF viewer

### **B. Contractor Queue (15 hrs)**

- **Airtable** (yes, Airtable) with 3 views: To Do, In Review, Done
- **Fields:** Lease ID, Contractor, Status, Accuracy Score (auto-calculated)
- **Automation:** Zapier moves row when contractor marks done
- **No custom code.** This is a spreadsheet with buttons.

### **C. Automated QA Checker (10 hrs)**

- **Single script** that validates:
  - Rent schedule sums are within ±$1 of extracted values
  - Lease end date > start date
  - No duplicate lease IDs
- **Flags** bad rows in Airtable for re-review
- **Tech:** Node.js script run via Vercel cron job

### **D. Founder Dashboard (3 hrs)**

- **KPIs:** $ Revenue, # Leases processed, Contractor hours, Accuracy rate
- **Tech:** Supabase → Chart.js on one page. **Done.**

### **You DO NOT Build:**

- ❌ Self-serve signup (you onboard each client manually)
- ❌ Human QA UI (contractor uses Airtable + PDF Viewer)
- ❌ Advanced OCR (use Google Document AI API, accept cost)
- ❌ Deterministic parsing beyond 10 regex rules
- ❌ Real-time anything (batch processing only)

**Every hour spent coding beyond these 48 hours is waste.**

---

## 4. Fulfillment Model: The *Service* You Sell

### **Target Customer:**

- **CRE asset managers** with **500–2,000 leases**
- **Pain:** Paying **$200/lease** to offshore abstractors
- **Budget:** $25K for faster, auditable abstraction

### **Pricing & Packaging:**

| Deal Type | Price | Timeline | What They Get | Target |
|-----------|-------|----------|---------------|--------|
| **Pilot** | $25K | 30 days | 500 lease abstracts + CSV + audit log | 5 deals |
| **Portfolio** | $50K | 60 days | 1,500 leases + quarterly updates | 10 deals |
| Custom | $100K | 90 days | 5,000 leases + API access | 2 deals |

**Year 1 Total: 17 deals × avg $30K = $510K revenue**

### **Fulfillment Process (Contractors Do Everything):**

1. Client uploads leases → Portal notifies you (email)
2. You run Google Doc AI on all PDFs (2 hrs, once/week)
3. Script auto-extracts 20 fields → dumps into Airtable
4. Contractor reviews/edits each lease (15 min/lease avg)
5. QA checker flags discrepancies → contractor fixes
6. **You click "Deliver"** → client gets CSV + highlighted PDFs

### **Contractor Economics:**

- **Hire:** 3 offshore contractors (Philippines, finance grads) at **$15/hr, 20 hrs/week each**
- **Cost:** $900/week = **$47K/year**
- **Capacity:** 3 contractors × 20 hrs/week × 4 leases/hr = **240 leases/week**
- **Throughput:** Can fulfill **12,000 leases/year** (more than enough for 17 deals)
- **Gross Margin:** $510K revenue - $47K COGS = **$463K profit** (91% margin)

---

## 5. Go-To-Market: Founder-Led Sales Only (102 Hours)

### **Your Time Allocation:**

| Activity | Hours | What You Do |
|----------|-------|-------------|
| **Build list** | 5 | Identify 50 CRE asset managers (LinkedIn, Crexi, costar) |
| **Cold outreach** | 30 | 5 personalized emails/day × 6 days/week × 10 weeks |
| **Discovery calls** | 20 | 15 calls × 45 min each (20 hrs) |
| **Proposal writing** | 15 | 10 proposals × 1.5 hrs each |
| **Negotiation & close** | 20 | 17 deals × 1.2 hrs avg |
| **Onboarding** | 12 | 17 deals × 0.7 hrs (manual setup) |
| **Total: 102 hours** | | (68% of your 150-hour budget) |

### **Sales Motion:**

- **No website** (waste of time)
- **No content marketing** (too slow)
- **No ads** (no budget)
- **Pure cold email** with one line: "I'll abstract 500 leases in 30 days for $25K, accuracy guaranteed."

**Conversion needed:** 17 deals / 50 targets = **34% close rate** (achievable with founder credibility)

---

## 6. Timeline: From Today to June 2026

### **Months 1–3 (Pre-Launch)**

- **Week 1–2:** Build portal (20 hrs)
- **Week 3–4:** Set up Airtable, hire contractors (5 hrs)
- **Month 2:** Run 3 test portfolios (your own leases, mock data)
- **Month 3:** Fine-tune QA script, prepare sales list

### **Months 4–8 (Sales Blitz)**

- **5 hours/week:** Cold email + calls
- **1 hour/week:** Review contractor work (spot-check)
- **Target:** Close 1 deal/month

### **Months 9–12 (Fulfillment Mode)**

- **2 hours/week:** Manage contractors via Airtable
- **1 hour/week:** 1–2 sales calls (referrals start flowing)
- **Target:** Deliver 4–5 portfolio deals

### **Launch (June 2026):**

You have: $400K+ in the bank, 17 customers, proven playbook

You are: Ready to hire 1 engineer to productize the service

---

## 7. Financial Model: SaaS in Year 2

### **Year 1 (2025–2026): Service Revenue**

| Item | Amount |
|------|--------|
| Revenue | $510K |
| COGS (contractors) | -$47K |
| Gross Profit | $463K |
| Stripe/Vercel | -$1K |
| Net Profit | $462K |

### **Year 2 (2026–2027): Transition to SaaS**

- **Use $462K to hire** 1 full-stack engineer ($120K) + 1 CRE paralegal ($60K)
- **Build:** Self-serve portal, deterministic rules engine, Yardi API
- **Convert:** Offer existing 17 customers **$10K/year SaaS** for ongoing monitoring
- **Assume:** 30% convert = **$51K ARR** base
- **Add:** 20 new SaaS customers at $10K = **$200K ARR**
- **Year 2 ARR:** **$251K** (credible for Series A)

---

## 8. Risk & Mitigation (Brutal Truth Edition)

| Risk | Probability | Why It's Fatal | Mitigation |
|------|------------|----------------|------------|
| Can't close deals | 40% | You hate sales or suck at it | Quit now. This model requires sales. |
| Contractor quality | 30% | They produce garbage | Hire 3, fire 1 each month. Keep the best. |
| Customer expects SaaS | 20% | They think they're buying software | Contract says "Managed Service." Be explicit. |
| Google Doc AI fails | 10% | OCR quality is 70% on scans | Use **Adobe Acrobat API** ($0.05/page) as fallback. |
| You run out of time | 50% | Life happens, you only work 100 hrs | Lower target to 10 deals = $300K. Still alive. |

---

## 9. The Hard Truth: Why This Is Your Only Path

You cannot escape this logic:

- $500K ARR SaaS requires 42 customers at $12K ACV
- CAC for enterprise: $30K–$50K (time + money)
- Your budget: $0 and 150 hours
- Max customers you can acquire: 3 (at 50 hrs/deal)
- Max ARR: $60K

**Therefore, $500K ARR is impossible.**

But **$500K revenue** is possible if you:

- **Sell $30K projects** (not subscriptions)
- **Fulfill with contractors** (not code)
- **Spend 70% of time selling** (not building)

**This PRD is the only one that mathematically closes.** Every other model is a fantasy.

---

## 10. The "Fuck It, Ship It" Checklist

### **Q1 2025: Build the System (48 hrs)**

- [ ] Day 1: Create Supabase project, auth, storage
- [ ] Day 2–3: Scaffold Next.js portal (upload, list, download)
- [ ] Day 4: Integrate Google Doc AI API
- [ ] Day 5: Write QA checker script (10 regex rules)
- [ ] Day 6–7: Set up Airtable, post job on OnlineJobs.ph for contractors

### **Q2–Q3 2025: Sell (80 hrs)**

- [ ] Week 1: Email 5 targets/day (25 total)
- [ ] Week 2: Follow up, 2 discovery calls
- [ ] Week 3: Send 2 proposals
- [ ] Repeat until you have $250K in signed contracts

### **Q4 2025: Fulfill & Profit (22 hrs)**

- [ ] 1 hr/week: Check Airtable, spot-check 5 leases
- [ ] 1 hr/week: Send invoices, pay contractors
- [ ] 1 hr/week: Forward client emails to contractors

---

## 11. Technical Stack (Minimal)

### **Infrastructure:**
- **Hosting:** Vercel (free tier)
- **Database:** Supabase (free tier)
- **Storage:** Supabase Storage (free tier)
- **Payments:** Stripe Payment Links (no code)
- **OCR:** Google Document AI API (pay per use)
- **Queue:** Airtable (free tier)

### **Tech Stack:**
- **Frontend:** Next.js 15, React, Tailwind CSS
- **Backend:** Next.js API routes
- **PDF Viewer:** react-pdf or PDF.js
- **Charts:** Chart.js
- **Auth:** Supabase Auth

### **Total Monthly Cost:** ~$50/month (until you hit scale)

---

## 12. What Success Looks Like

### **By June 2026:**

- ✅ $400K+ in bank account
- ✅ 17 paying customers
- ✅ 3 reliable contractors
- ✅ Proven fulfillment process
- ✅ Ready to hire engineer #1

### **By December 2026:**

- ✅ $250K ARR (SaaS)
- ✅ 30+ customers
- ✅ 2 full-time employees
- ✅ Series A conversations

---

## 13. The Brutal Reality Check

**If you cannot:**
- Send 5 cold emails per day for 10 weeks → **Quit now**
- Hire and manage 3 contractors → **Quit now**
- Close 1 deal per month for 8 months → **Quit now**

**Then this model will not work for you.**

**But if you can:**
- Sell (even if you hate it)
- Delegate (even if you're a perfectionist)
- Ship (even if it's not perfect)

**Then you will hit $500K in Year 1.**

---

## 14. Why This Works When SaaS Doesn't

| SaaS Model | Service Model |
|------------|---------------|
| $12K ACV | $30K project revenue |
| 42 customers needed | 17 customers needed |
| $30K CAC per customer | $6K CAC (your time) |
| 1,260 hours to acquire | 102 hours to acquire |
| Requires $1M+ funding | Requires $0 funding |
| 3+ years to $500K ARR | 1 year to $500K revenue |

**The math is inescapable. This is your only path.**

---

**This PRD is your operating manual. Follow it exactly. Don't add features. Don't optimize prematurely. Ship. Sell. Profit. Then build SaaS.**

