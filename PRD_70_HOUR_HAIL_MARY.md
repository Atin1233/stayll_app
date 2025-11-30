# STAYLL AI — "The 70-Hour Hail Mary" PRD

**Revised for November 30, 2025 → June 1, 2026 Launch**

---

## 1. Executive Summary (Brutal Reality)

**Goal:** Hit **$50K revenue** by June 2026 by selling **2 CRE portfolios** a **$25K "lease data cleanup" service** you fulfill **yourself** using **Google Sheets + manual extraction**. **No code beyond a client upload page. No contractors. Just you.**

**You will not have a SaaS.** You will have a **cash-generating service** that funds real software in H2 2026. **But you're doing all the work yourself.**

---

## 2. The 70-Hour Budget (Solo Founder)

| Phase | Hours | Activity |
|-------|-------|----------|
| **Dec 2025** | 10 | Set up Airtable, Stripe, upload portal |
| **Jan 2026** | 10 | Sales: Build list, send emails, close 1 deal |
| **Feb–Mar 2026** | 30 | **Fulfillment:** Process 500 leases yourself (15 min/lease) |
| **Apr 2026** | 10 | Sales: Close deal #2 |
| **May–Jun 2026** | 10 | **Fulfillment:** Process 500 more leases |

**Total: 70 hours.** But you're doing **ALL the abstraction work yourself.** This is brutal but doable.

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

## 4. Fulfillment Process (You Do Everything)

**Per Lease (15 minutes, ALL your time):**

1. Download PDF from Supabase storage
2. Run through Google Document AI API (you have API key)
3. Copy OCR text → Paste into GPT-4 (you have template)
4. Copy 20 extracted fields → Paste into Google Sheets
5. Quick QA check (rent sums, dates make sense)
6. Mark as "Complete" in Airtable

**Your time per portfolio (500 leases):** **125 hours** (500 × 15 min = 125 hrs)

**But you're doing this over 2 months, so:** 125 hrs / 8 weeks = **~15 hrs/week of abstraction work**

**This is your life for 4 months.**

---

## 5. Sales Plan: 2 Deals in 6 Months (Solo Founder Reality)

**You must close 2 deals total. But you can only fulfill 1 at a time.**

### **Sales Activity (20 Hours Total):**

| Week | Action | Hours | Output |
|------|--------|-------|--------|
| **Dec W4** | Build target list of 15 asset managers | 2 | 15 names |
| **Jan W1–2** | Send 3 cold emails/day (M–F) | 4 | 30 touches |
| **Jan W3–4** | Follow up, 3 discovery calls | 3 | 1 qualified |
| **Jan W4** | Send proposal, close deal #1 | 3 | **1 deal closed** |
| **Apr W1** | While fulfilling, send 5 follow-ups | 2 | 2 qualified |
| **Apr W2** | Discovery calls, close deal #2 | 3 | **1 deal closed** |
| **Buffer** | Follow-ups, negotiations | 3 | Backup deals |

**Close rate needed:** 2 deals / 15 targets = **13%** (much more achievable).

**Key:** You can't sell while fulfilling. You do one deal at a time.

---

## 6. Financial Model (Solo Founder - No Contractors)

| Item | Amount |
|------|--------|
| **Revenue** (2 deals × $25K) | **$50K** |
| **COGS** (contractors) | **$0** (you do it all) |
| **Your time cost** (250 hrs × $0/hr) | **$0** (sweat equity) |
| **Stripe/Vercel/APIs** | -$1,000 |
| **Net Profit** | **$49K** |

**Cash in bank by June 2026: ~$25K** (after deposits + progress payments)

**But you worked 250 hours for $49K = $196/hour effective rate.** Still good, but you're exhausted.

---

## 7. The June 2026 Launch (Solo Founder Version)

**What you "launch":**

- A **Vercel site** with a file upload button
- **Google Sheets** showing 2 happy customers with 1,000 leases abstracted
- **$25K cash** to hire your first contractor (or keep going solo)

**What you say to investors:**  

*"I validated demand: 2 CRE portfolios paid me $50K for lease abstraction. I processed 1,000 leases myself, proving the market. Now I'm building the SaaS product to automate it at $10K/year ARR."*

**This is still a credible seed story.** You have revenue, customers, and you've proven you can deliver. **The fact that you did it yourself shows grit.**

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

- [ ] **Monday:** Create Google Sheets template (20 fields: tenant, property, rent, dates, etc.)
- [ ] **Tuesday:** Set up Supabase project (free tier) - already done!
- [ ] **Wednesday:** Get Google Document AI API key (free tier: 1,000 pages/month)
- [ ] **Thursday:** Get GPT-4 API key (pay per use, ~$0.03 per lease)
- [ ] **Friday:** Create extraction prompt template (copy-paste workflow)

**Time spent: 10 hours. You have 240 hours left (but 250 hours of actual work to do).**

---

## 10. The Final Math: Why This Is Your Only Option (Solo)

**You have 70 hours for setup/sales, but 250 hours of actual work.** Let's see what's possible:

| Model | Hours Needed | Revenue Possible | Viable? |
|-------|--------------|------------------|---------|
| **Full SaaS PRD #1** | 300+ hrs | $0 | **No** |
| **MVP PRD #2** | 200+ hrs | $5K pilot | **No** |
| **Hire Contractors** | 70 hrs | $200K | **No (no money)** |
| **Solo Service (This PRD)** | 320 hrs total | $50K | **YES (only option)** |

**$50K in 7 months with 320 hours is $156/hour effective rate.** Not amazing, but it's cash in the bank and proof of concept.

**The brutal truth:** You're working a part-time job for 4 months to make $50K. But it funds the next phase.

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

1. **CSV Export** (2 hrs) - Simple download button that generates CSV from Google Sheets
2. **Status Updates** (1 hr) - Mark leases as "In Progress / Complete" (just for you)
3. **Stripe Payment Link Integration** (1 hr) - Generate payment links per project

**Total remaining dev: ~4 hours. Perfect.**

**But the real work is the 250 hours of manual abstraction. That's what you're signing up for.**

---

## 12. The Brutal Choice (Solo Founder Edition)

**You have no money. You have 320 hours total (70 setup + 250 work).** You can either:

1. **Build a fake SaaS** that makes $0 and dies, or
2. **Do the work yourself** and make $50K to fund the next phase.

**Launching June 2026 is possible. But you'll be processing leases 15 hours/week for 4 months straight.**

**This is not glamorous. This is survival mode. But $50K in the bank beats $0.**

---

## 13. Next Steps (This Week - Solo Founder)

1. **Stop building features** - The upload portal is done
2. **Set up Google Sheets** - Create your extraction template (20 fields)
3. **Get API keys** - Google Document AI + GPT-4 (free/low cost tiers)
4. **Create extraction workflow** - Document your 15-min process
5. **Start sales** - Build target list of 15 CRE asset managers
6. **Prepare for grind** - You're about to process 1,000 leases yourself

**The code is ready. Now go sell. Then prepare to work 15 hrs/week for 4 months doing manual abstraction.**

**This is the path when you have no money. It's hard. But it's possible.**

