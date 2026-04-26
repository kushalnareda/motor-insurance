# Motor Insurance Quote Form — Product Requirement Document

**Version:** 1.0 | **Author:** Kushal | **Status:** Draft | **Date:** April 2026

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | April 2026 | Initial draft — assessment submission |

---

## 1. Problem Statement & Context

- Current form collects all 18 fields upfront — average time-to-quote on mobile exceeds 4 minutes
- No instrumentation on drop-off points — we do not know which fields cause abandonment
- A meaningful percentage of submitted leads are rejected by insurance carriers, wasting sales and API spend
- Form is not sequenced by user intent — contact details are asked before the user sees any value
- No fraud or quality layer exists — bots, lead farmers, and NCB inflators pass through undetected

Competitors like Acko and Digit have rebuilt quote flows with smart field sequencing and auto-fetch via Vahan API, achieving sub-60 second time-to-quote on mobile.

_Why now: mobile conversion is the primary growth lever; reducing time-to-quote directly impacts lead volume and carrier payout rates._

---

## 2. Product Objective

Rebuild the motor insurance quote capture form for a mobile-first Indian audience. The form must minimise time-to-quote by asking only what is needed at each step, leverage Vahan API to auto-populate vehicle data, show a quote range before collecting contact details, and silently score lead quality without adding friction for genuine users.

| Priority | Goal | Metric |
|----------|------|--------|
| P0 | Reduce time-to-quote on mobile | < 90 seconds median (down from 4+ min) |
| P0 | Improve lead quality | Carrier rejection rate < 15% (from current baseline) |
| P1 | Increase form completion rate | > 50% completion (typeform benchmark) |
| P1 | Auto-populate vehicle fields | > 80% of users complete step 1 via Vahan fetch |
| P2 | Reduce sales cost per lead | Low-quality leads deprioritised in CRM |

---

## 3. Scope Boundaries

### In Scope (v1)
- 4-step typeform-style quote flow with progress indicator
- Vahan API mock — auto-populates make, model, variant, year, fuel type on reg number entry
- Individual vs corporate ownership toggle
- Conditional CNG kit declaration field
- Break-in policy check — auto-resets NCB to 0% if expiry > 90 days ago
- Quote range calculation based on IDV preference and NCB discount
- Silent fraud scoring layer — honeypot, keystroke timing, mobile/email validation, velocity check
- Lead quality tagging (low/medium/high) passed to CRM — no blocking of users

### Out of Scope (v1)
- Real Vahan API integration — requires credentials and RTO coverage mapping
- IIB API for NCB cross-verification — future fraud layer enhancement
- RC / policy document photo upload via LLM extraction — future UX enhancement
- Propensity-to-purchase ML scoring — requires 10k+ labelled leads to train
- IP reputation and device fingerprinting — future digital footprint layer
- Nominee details, previous insurer name, date of birth — deferred to proposal stage

---

## 4. Target Users & Personas

### Primary: Individual Vehicle Owner (Retail)
- Age 25–45, mid-market, mobile-first
- Renewing an existing motor policy or buying for a newly purchased vehicle
- Pain: long forms, asked for information they don't have handy, no quote until the very end
- Context: filling the form on a phone, likely while commuting or during a short break

### Secondary: Corporate Fleet Manager
- Manages insurance for company-owned vehicles
- Needs corporate ownership flag to get accurate premium — individual quote will fail at checkout

---

## 5. Jobs to Be Done

| # | When I'm... | I want to... | So I can... |
|---|-------------|--------------|-------------|
| 1 | Renewing my car insurance | Get a quote range quickly | Compare prices without committing |
| 2 | On mobile with limited time | Fill as few fields as possible | Complete the form before I lose interest |
| 3 | Unsure of my NCB % | Get guidance on what it means | Not enter wrong data and get a bad quote |
| 4 | A corporate vehicle owner | Declare company ownership upfront | Avoid quote failure at checkout |
| 5 | Submitting my details | Know my data is used fairly | Trust the platform with my contact info |

---

## 6. User Flows

### 6.1 Happy Path — Quote Capture Flow

User enters reg number → Vahan auto-fetch → completes policy context → sees quote range → submits contact details.

| Step | Actor | Action | System Response |
|------|-------|--------|-----------------|
| 1 | User | Lands on form, selects Individual/Corporate | Progress bar shows Step 1 of 4 |
| 2 | User | Enters registration number (XX00XX0000) | 1.5s loading state — Vahan mock fires |
| 3 | System | Vahan returns vehicle data | Make, model, variant, year, fuel pre-filled (disabled) |
| 3a | User | Fuel = CNG | CNG kit toggle appears conditionally |
| 4 | User | Clicks Next → Step 2 | Policy context fields shown |
| 5 | User | Enters city, expiry date, NCB %, claims, IDV preference | Break-in check fires on expiry date |
| 5a | System | Expiry > 90 days ago | NCB auto-reset to 0%, soft warning shown |
| 5b | System | claims > 0 AND NCB > 0% | Contradiction logged silently, risk_score boosted, no UX change |
| 6 | User | Clicks Get Quote → Step 3 | Quote range calculated and displayed |
| 7 | User | Clicks Proceed → Step 4 | Contact details form shown |
| 8 | User | Enters mobile, email, name | Fraud scoring runs async in background |
| 9 | System | Fraud score assigned | Lead tagged in CRM, user sees confirmation |

### 6.2 Vahan Fetch Failure Flow

If Vahan mock returns no data (invalid reg number format or unknown reg), fields remain enabled and user fills manually. No error shown — form degrades gracefully.

### 6.3 High Fraud Score Flow

User completes form normally. Fraud score computed async. If score is high, a generic quote range is shown (not personalised), lead is tagged Low Quality in CRM, and is not passed to insurer API. User sees no difference.

---

## 7. Functional Requirements

### FR-01: Form Structure & Navigation

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01.1 | Form MUST render as a 4-step sequential flow, one step visible at a time | P0 |
| FR-01.2 | Form MUST display a progress indicator showing current step out of 4 | P0 |
| FR-01.3 | User MUST be able to navigate back to a previous step without losing data | P1 |
| FR-01.4 | Form MUST be fully functional on mobile viewport (320px and above) | P0 |

### FR-02: Vehicle Identity (Step 1)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-02.1 | Form MUST accept registration number in XX00XX0000 format and validate on blur | P0 |
| FR-02.2 | On valid reg number entry, system MUST trigger Vahan fetch and show a loading state for 1.5s | P0 |
| FR-02.3 | Vahan response MUST auto-populate: make, model, variant, manufacture year, fuel type as disabled fields | P0 |
| FR-02.4 | If Vahan fetch fails or reg number is invalid, fields MUST become editable for manual entry | P0 |
| FR-02.5 | Form MUST include an Individual / Corporate ownership toggle, defaulting to Individual | P0 |
| FR-02.6 | If fuel_type = CNG, a CNG kit declaration toggle MUST appear conditionally | P1 |

### FR-03: Policy Context (Step 2)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-03.1 | Form MUST collect city_of_registration as a text input with Indian city suggestions | P0 |
| FR-03.2 | Form MUST collect previous_policy_expiry_date in DD/MM/YYYY format | P0 |
| FR-03.3 | If expiry date is more than 90 days in the past, NCB MUST auto-reset to 0% and a soft warning displayed | P0 |
| FR-03.4 | ncb_percentage MUST be a dropdown with values: 0%, 20%, 25%, 35%, 45%, 50% | P0 |
| FR-03.5 | claims_in_last_3_years MUST be collected as a 4-option selector: 0 / 1 / 2 / 3+ | P0 |
| FR-03.6 | If claims_in_last_3_years > 0 AND ncb_percentage > 0%, system MUST flag a contradiction (NCB resets on any claim) and silently boost risk_score | P0 |
| FR-03.7 | idv_preference MUST be a 3-option selector: Low / Market / High with brief tooltip explanations | P1 |

### FR-04: Quote Display (Step 3)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-04.1 | System MUST calculate and display a premium range before contact details are requested | P0 |
| FR-04.2 | Quote range MUST be derived from IDV preference (base) with NCB discount applied | P0 |
| FR-04.3 | Quote MUST display as a range (±10% of calculated value) with 2–3 insurer name placeholders | P1 |
| FR-04.4 | Quote page MUST include a clear CTA: Proceed to Get Full Quote | P0 |

### FR-05: Contact Capture & Fraud Scoring (Step 4)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-05.1 | Form MUST collect mobile_number (10-digit Indian), email_address, full_name | P0 |
| FR-05.2 | Mobile MUST be validated: 10 digits, starts with 6–9, not a repeating pattern (e.g. 9999999999) | P0 |
| FR-05.3 | Email MUST be validated against a blocklist of known throwaway domains (mailinator, tempmail, etc.) | P0 |
| FR-05.4 | A honeypot hidden field MUST be present in the DOM; if filled, fraud_score MUST increase by 100 | P0 |
| FR-05.5 | Time-on-form MUST be tracked from page load; completion under 8 seconds MUST add 80 to fraud_score | P0 |
| FR-05.6 | Fraud score MUST be computed async — user MUST NOT experience any delay or visible change | P0 |
| FR-05.7 | Lead MUST be tagged: Low Quality (score > 100), Medium (50–100), High (< 50) | P0 |
| FR-05.8 | High fraud score leads MUST receive a generic quote range; personalised quote MUST NOT be shown | P1 |

---

## 8. UX Specifications & State Machine

### 8.1 Form State Machine

| From State | Trigger | To State |
|------------|---------|----------|
| Step1_Vehicle | Valid reg + Vahan response | Step1_Vehicle (fields populated) |
| Step1_Vehicle | Vahan failure | Step1_Vehicle (manual mode) |
| Step1_Vehicle | Next clicked (all required filled) | Step2_Policy |
| Step2_Policy | Expiry > 90 days | Step2_Policy (NCB reset, warning shown) |
| Step2_Policy | claims > 0 AND NCB > 0% | Step2_Policy (risk_score += 60, silent — no UX change) |
| Step2_Policy | Get Quote clicked | Step3_Quote (quote calculated, claims-loading applied) |
| Step3_Quote | Proceed clicked | Step4_Contact |
| Step4_Contact | Submit clicked + valid inputs | Confirmation (fraud score async) |
| Step4_Contact | Honeypot filled | Confirmation (fraud_score += 100, silent) |
| Any step | Back clicked | Previous step (data retained) |

### 8.2 Screen Wireframes

**Step 1 — Vehicle Identity:**
```
┌─────────────────────────────────────┐
│  Step 1 of 4          ████░░░░░░░░  │
│─────────────────────────────────────│
│  [ Individual ]  [ Corporate ]       │
│                                     │
│  Registration Number                │
│  [ DL09CA1234              ]        │
│  ✓ Fetching vehicle details...      │
│                                     │
│  Make: Maruti  (auto-filled)        │
│  Model: Swift  (auto-filled)        │
│  Variant: VXi  (auto-filled)        │
│  Year: 2019    (auto-filled)        │
│  Fuel: Petrol  (auto-filled)        │
│                                     │
│  [ Next → ]                         │
└─────────────────────────────────────┘
```

**Step 3 — Quote Display:**
```
┌─────────────────────────────────────┐
│  Step 3 of 4          ████████░░░░  │
│─────────────────────────────────────│
│  Your Quote Range                   │
│                                     │
│  ₹ 8,200 — ₹ 10,500 / year         │
│                                     │
│  Acko          ₹ 8,200              │
│  Digit         ₹ 9,100              │
│  HDFC Ergo     ₹ 10,200             │
│                                     │
│  NCB discount applied: 25%          │
│                                     │
│  [ Proceed to Get Full Quote → ]    │
└─────────────────────────────────────┘
```

---

## 9. API Contracts

### 9.1 Vahan Vehicle Lookup (Mocked in v1)

```
Purpose:        Fetch vehicle details from registration number to auto-populate form fields
Method:         GET
Endpoint:       https://api.vahan.gov.in/v1/vehicle/{reg_number}  [MOCKED in v1]
Authentication: API Key (TBD — Engineering to confirm for production)
Success:        HTTP 200
Error:          HTTP 404 (reg not found), HTTP 503 (RTO unavailable)
```

| Field | Type | Description | Example Value |
|-------|------|-------------|---------------|
| reg_number | String | Vehicle registration number | DL09CA1234 |
| make | String | Vehicle manufacturer | Maruti Suzuki |
| model | String | Vehicle model | Swift |
| variant | String | Variant name (maps to engine CC) | VXi (1197cc) |
| manufacture_year | Integer | Year of manufacture | 2019 |
| fuel_type | String | Petrol / Diesel / CNG / EV | Petrol |

### 9.2 Quote Calculation (Client-side in v1)

```
Purpose: Compute a premium range from policy context inputs
Method:  Client-side function (no API call in v1)
```

| Input | Type | Description | Example |
|-------|------|-------------|---------|
| idv_preference | Enum | Low / Market / High → maps to IDV multiplier | Market → 1.0x |
| ncb_percentage | Integer | Discount on OD premium: 0/20/25/35/45/50 | 25 |
| fuel_type | String | Diesel loading: +10% on base premium | Diesel |
| manufacture_year | Integer | Depreciation: older vehicle = lower IDV base | 2019 |
| ownership | Enum | Corporate adds 15% loading on base premium | Individual |
| claims_in_last_3_years | Integer | Each claim adds 10% loading on OD premium (capped at 30%) | 0 |

**Quote range formula (v1 simplified):**
- Base IDV: manufacture_year mapped to depreciation bracket × IDV multiplier
- OD premium: Base IDV × 0.027 (standard IRDAI rate)
- Apply NCB discount on OD premium
- Add TP premium: fixed by fuel_type and variant CC bracket (IRDAI table)
- Apply fuel/ownership loading
- Quote range: calculated_premium × 0.90 to calculated_premium × 1.10

---

## 10. Edge Cases & Error States

| # | Scenario | Expected Behavior |
|---|----------|-------------------|
| E-01 | Vahan API times out or returns 503 | Fields unlock for manual entry. No error shown. Silently logs failure. |
| E-02 | Registration number format is invalid (not XX00XX0000) | Inline validation error shown. Vahan fetch not triggered. |
| E-03 | Previous policy expiry > 90 days ago (break-in) | NCB auto-resets to 0%. Soft warning: "Your NCB may have lapsed — final discount subject to verification." |
| E-04 | User claims 50% NCB but expiry is recent (IIB check — future) | Flag lead as Medium quality. Show quote with disclaimer. Do not block. |
| E-04a | User reports claims > 0 AND NCB > 0% (NCB resets on any claim — contradiction) | Silent: risk_score += 60, lead tagged Medium/Low quality, quote still shown. No user-facing message. |
| E-05 | Honeypot field is filled | fraud_score += 100. User sees normal confirmation. Lead tagged Low Quality. |
| E-06 | Form completed in under 8 seconds | fraud_score += 80. Async. No UX change. |
| E-07 | Mobile number is a repeating pattern (e.g. 9999999999) | Inline validation error: "Please enter a valid mobile number." |
| E-08 | Email domain is on throwaway blocklist | Inline validation error: "Please use a valid email address." |
| E-09 | User navigates back from Step 3 to Step 2 | All previously entered data retained. Quote not recalculated until Next is clicked again. |
| E-10 | CNG fuel type selected — user does not declare kit | CNG kit defaults to "No". Quote generated without CNG loading. |
| E-11 | Corporate ownership selected | 15% premium loading applied in quote calculation. No UX change beyond toggle state. |
| E-12 | User submits with high fraud score | Generic quote range shown (not personalised). Lead not passed to insurer API. Tagged Low Quality in CRM. |

---

## 11. Top Assumptions

| # | Assumption | Risk if Wrong |
|---|------------|---------------|
| A1 | Vahan API can return variant-level data including engine CC mapping — mocked in v1 with hardcoded responses for common reg numbers | If variant→CC mapping is incomplete, TP premium calculation will be inaccurate |
| A2 | City of registration is sufficient as a proxy for RTO zone (A/B) in v1 — backend maps city string to zone | If RTO zone mapping is wrong, OD premium loading will be inaccurate for some cities |
| A3 | A simplified client-side premium formula (IRDAI base rates + NCB + loading) is sufficient for showing a quote range — not a legally binding premium | If formula deviates significantly from insurer APIs, user expectation mismatch at checkout |
| A4 | Fraud scoring runs async with a 3-second buffer on the quote calculation screen — no added latency for user | If scoring takes > 3 seconds, user may proceed before score is assigned |
| A5 | Date of birth is not required for base quote in India — IRDAI prices on vehicle, not driver age — DOB deferred to proposal stage | Some digital-first insurers (Acko, Digit) may require DOB for PA cover pricing |

---

## 12. Future Scope (Post v1)

| Item | Description | Metric it Moves |
|------|-------------|-----------------|
| RC Photo Upload | User uploads RC or previous policy image → Gemini Vision API extracts all fields → time-to-quote drops to ~30 seconds | Time-to-quote |
| IIB API Integration | Cross-check claimed NCB % against Insurance Information Bureau claims history — catches soft fraud (NCB inflation) | Carrier rejection rate |
| Propensity Scoring (ML) | XGBoost model trained on historical leads → scores purchase intent → high-intent users get priority callback or instant discount nudge. Kicks in at 10k labelled leads. | CPA / sales efficiency |
| IP + Device Fingerprinting | Flag data centre IPs, headless browsers, and high-velocity device IDs silently | Fraud score accuracy |
| Real Vahan API | Replace mock with live Vahan integration — requires MoRTH credentials and RTO coverage validation | Auto-fill success rate |