# Motor Insurance Quick Quote - End-to-End User Flow

## Overview

This document details all user journeys through the Motor Insurance Quick Quote application. It covers happy paths, error conditions, edge cases, and fallback scenarios.

---

## Quick Summary

| Step | Screen | Key Inputs | Outcomes |
|------|--------|-----------|----------|
| 1 | Vehicle Details | Reg number, Make, Model, Variant, Year, Fuel Type | Auto-fetch via VAHAN API or manual entry |
| 2 | Policy Details | City, Expiry Date, NCB, Claims, IDV Pref | Quote generation |
| 3 | Quote Display | — | Premium range, insurer options |
| 4 | Contact Info | Name, Mobile, Email | Lead capture, final submission |
| 5 | Completion | — | Success message, quote sent |

---

## Step 1: Vehicle Details

### 1.1 Ownership Type Selection

**User Action:** Select "Individual" or "Corporate"

**Flow:**
- Toggle between two options
- State updates immediately
- No validation required

**Edge Cases:**
- Default: "Individual"
- Selection persists if user navigates back/forward

---

### 1.2 Registration Number Entry - Auto-Fetch

**User Action:** Enter registration number (e.g., `DL09CA1234`) and blur/leave field

**Happy Path:**
1. User enters valid format (`RE_REG` = `/^[A-Z]{2}\d{2}[A-Z]{0,2}\d{4}$/`)
2. Spinner appears in field
3. API call to `/api/vahan/${reg}` succeeds
4. Green checkmark appears
5. Message shows: "✓ Found: {Make} {Model}"
6. Vehicle fields auto-populate: Make, Model, Variant, Year, Fuel Type
7. Fields become read-only (locked)

**Error Conditions:**

| Scenario | Trigger | Result |
|----------|---------|--------|
| Invalid format | `DL09` (too short) | Error: "Format: DL09CA1234" |
| Empty input | Blur with empty field | Nothing happens |
| API timeout | No response > 10s | Message: "Couldn't auto-fetch - fill manually." |
| API 404 | Vehicle not found | Message: "Couldn't auto-fetch - fill manually." |
| Network error | Fetch throws | Message: "Couldn't auto-fetch - fill manually." |

**Fallback:**
- "Retry auto-fetch" button appears on failure
- User can manually fill all vehicle fields

---

### 1.3 Manual Vehicle Entry

**User Action:** Fill Make, Model, Variant, Year, Fuel Type manually

**Fields:**
- **Make** (text, required)
- **Model** (text, required)
- **Variant** (text, required)
- **Year** (4-digit number, required)
- **Fuel Type** (dropdown: Petrol, Diesel, CNG, EV)

**Validation Rules:**
- All fields required before proceeding
- Year accepts only digits, max 4 characters
- Empty or invalid blocks Continue button

---

### 1.4 CNG Kit Question

**Trigger:** Fuel Type = "CNG"

**User Action:** Select "Yes" or "No" for external CNG kit

**Flow:**
- Additional field appears with animation
- If "Yes", risk scoring may adjust (future use)

---

### 1.5 Continue to Step 2

**Validation:**
- Must have valid registration number
- Must have all vehicle details filled
- If fails: error message appears, form does not advance

**Honeypot Field:**
- Hidden field (`honeypot`) catches bots
- If filled, submission is silently ignored (future implementation)

---

## Step 2: Policy Details

### 2.1 City of Registration

**User Action:** Type city name, select from dropdown

**Dropdown Behavior:**
- Filters cities as user types
- Keyboard navigation (Arrow Up/Down, Enter, Tab)
- Click to select
- Maximum 10 results shown

**Known Cities:**
- Uses `INDIAN_CITIES` list (major RTOs)
- If city not in list: warning "Not in our RTO list — premium may need manual review."

**Edge Cases:**
- Empty input: dropdown does not open
- No matching cities: shows "No cities found"
- Case-insensitive search

---

### 2.2 Previous Policy Expiry Date

**User Action:** Enter date in DD/MM/YYYY format

**Input Handling:**
- Auto-formats: adds `/` after DD and MM
- Max 10 characters
- Numeric input only (slashes allowed)

**Validation (`validateExpiry`):**

| Input | Result |
|-------|--------|
| Empty | Allowed (new policy) |
| Invalid format | Error: "Invalid date format" |
| Past date | Error: "Policy has already expired" |
| > 1 year in future | Error: "Date too far in future" |
| Valid future/current | OK |
| Valid past (expired) | Sets `break_in = true`, shows warning |

**Break-in Detection:**
- If expiry date is in the past: `break_in` flag set to `true`
- NCB automatically reset to "0%"
- Warning displayed: "Your NCB may have lapsed - final discount subject to verification"

---

### 2.3 No Claim Bonus (NCB)

**User Action:** Select NCB percentage from dropdown

**Options:**
- (empty/default)
- 0%
- 20%
- 25%
- 35%
- 45%
- 50%

**Rules:**
- Required before proceeding
- If `break_in = true`, NCB is forced to "0%" (read-only)

---

### 2.4 Claims History

**User Action:** Select number of claims in last 3 years

**Options:**
- 0
- 1
- 2
- 3+

**Impact:**
- Directly affects premium calculation
- 3+ claims penalizes heavily

---

### 2.5 IDV Preference

**User Action:** Select IDV tier

**Options:**

| Value | Title | Description |
|-------|-------|-------------|
| Low | Cheaper, lower payout | Lower IDV = cheaper premium |
| Market | Balanced | Standard IDV |
| High | Max payout, costlier | Higher IDV = higher premium |

**Flow:**
- Segmented button control
- Affects quote calculation

---

### 2.6 Submit to Get Quote

**User Action:** Click "Get Quote"

**Validation Before Submit:**
1. City must not be empty
2. Expiry date must be valid (or empty for new policy)
3. NCB must be selected
4. If fails: error message shown, stays on step

**API Call:**
- POST to `/api/quote`
- Body: entire form state
- Loading state: "Matching you with insurers"

**Loading State:**
- Full form replaced with loading card
- Shows quote variant ("quote")
- Message: "Matching you with insurers"

**Response Handling:**

| Scenario | Result |
|----------|--------|
| Success (200) | Advance to Step 3 with quote data |
| API Error | Error message, return to form |
| Network Failure | Error message, return to form |

---

## Step 3: Quote Display

### 3.1 Quote Card

**Display Elements:**
- **Estimated Premium Range:** Lower - Higher (e.g., "₹12,345 - ₹15,678")
- **IDV:** Insured Declared Value
- **OD:** Own Damage premium component
- **TP:** Third Party premium component
- **NCB Applied:** Percentage discount applied
- **Period:** "/ year"

**Quote Calculation:**
- Uses `calcQuote(state)` function
- Falls back to calculation if quote missing from API

---

### 3.2 Insurer Options

**Display:**
- Up to 3 insurers shown
- Each card shows: Name (first letter bold), Price
- Hover state: subtle highlight

**Insurers returned from API:**
- Sorted by price (lowest first)
- Includes premium from each insurer

---

### 3.3 Proceed or Go Back

**Back Button:**
- Returns to Step 2
- Preserves all entered data

**Proceed Button:**
- Advances to Step 4 (Contact)
- Quote is "locked" (pending final submission)

---

## Step 4: Contact Information

### 4.1 Full Name

**Validation:**
- Required, minimum 2 characters
- Spaces allowed
- Error: "Enter your full name"

---

### 4.2 Mobile Number

**Validation Rules:**
- Required, exactly 10 digits
- Pattern: `/^[6-9]\d{9}$/` (Indian mobile)
- Must start with 6-9
- Error: "Enter a valid 10-digit mobile number"

**Repeating Digit Check:**
- `isRepeatingMobile`: detects `7777777777`, `1111111111`
- Error: "Please enter a valid mobile number"

---

### 4.3 Email Address

**Validation Rules:**
- Required, valid email format
- Pattern: standard email regex

**Domain Check:**
- `emailDomainBad`: blocks suspicious domains
- Error: "Please use a valid email domain"

---

### 4.4 Risk Scoring (Backend)

**Trigger:** On submit

**Process:**
1. Compute risk score using `computeRisk(state)`
2. Generate risk signals
3. Assign risk tier: "Standard", "Medium Risk", "Low Quality"

**Risk Tier Impact:**

| Tier | Action |
|------|--------|
| Standard | Proceed normally |
| Medium Risk | Flag for review |
| Low Quality | Adjust quote -15% to +30%, mark as generic |

---

### 4.5 Lead Submission

**API Call:**
- POST to `/api/lead`
- Body: state + risk updates
- Minimum delay: 1.5 seconds (UX)

**Error Handling:**
- Silent catch - never show error to user
- Always advance to completion
- Preserves trust

---

### 4.6 Loading State

**Display:**
- Button shows spinner
- Text: "Submitting..."
- Form disabled

---

## Step 5: Completion

### 5.1 Success Display

**Elements:**
- Success icon/animation
- "Your Quote is Ready!"
- Summary of vehicle and quote
- "We'll send the detailed quote to your email and WhatsApp"

### 5.2 Reset/Start Over

**Action:** Click "Get Another Quote"

**Effect:**
- Clears localStorage
- Resets form to Step 1
- Fresh state with new timestamp

---

## Edge Cases & Error Handling

### Network Errors

| Step | Error | User Message | Recovery |
|------|-------|--------------|----------|
| VAHAN lookup | Timeout/Network | "Couldn't auto-fetch - fill manually." | Manual entry possible |
| Quote API | Failure | "Couldn't fetch quote. Try again." | Stay on Step 2, retry |
| Lead API | Failure | Silent | Always advance to Step 5 |

### Data Persistence

- State saved to localStorage on every change
- On page reload/return: state restored
- `start_ts` regenerated on fresh start

### Browser Navigation

- Back button: returns to previous step
- Refresh: preserves state (from localStorage)
- Direct URL access: starts fresh

### Validation Flow

All validation happens on submit attempt, not on input change (except expiry date which validates on blur).

### Session Timeout

- No explicit timeout
- State persists until cleared or new session

---

## State Machine

```
[Step 1] --(valid)--> [Step 2] --(valid)--> [Step 3] --(proceed)--> [Step 4] --(submit)--> [Step 5]
   ^                      ^                      ^                      ^                      ^
   |                      |                      |                      |                      |
   +-----------(back)-----+-----------(back)-----+-----------(back)-----+----------------------+
```

---

## API Endpoints

### GET /api/vahan/[reg]

**Purpose:** Fetch vehicle details from VAHAN

**Response (success):**
```json
{
  "reg_number": "DL09CA1234",
  "make": "Maruti",
  "model": "Swift",
  "variant": "LXI",
  "manufacture_year": 2022,
  "fuel_type": "Petrol"
}
```

**Response (not found/error):** 404 or 500

---

### POST /api/quote

**Purpose:** Generate quote

**Request Body:** Full FormState

**Response:**
```json
{
  "quote": {
    "lo": 12345,
    "hi": 15678,
    "idv": 500000,
    "od": 8000,
    "tp": 4345,
    "ncb_applied": 20,
    "insurers": [
      { "name": "HDFC Ergo", "price": 12345 },
      { "name": "ICICI Lombard", "price": 13456 },
      { "name": "Bajaj Allianz", "price": 15678 }
    ]
  }
}
```

---

### POST /api/lead

**Purpose:** Capture lead

**Request Body:** FormState + risk data

**Response:** 200 OK (silent)

---

## Risk Scoring Signals

**Factors:**
- New vehicle vs. old
- High-risk city
- NCB percentage (low = higher risk)
- Claims history
- Fuel type (CNG, EV adjustments)
- Email domain quality
- Mobile number patterns

**Tiers:**
- Standard: Normal processing
- Medium Risk: Flag for review
- Low Quality: Quote adjustment applied

---

## Complete Field List

| Field | Type | Validation | Step |
|-------|------|-----------|------|
| ownership | "Individual" \| "Corporate" | Required | 1 |
| reg_number | string | Required, format | 1 |
| make | string | Required | 1 |
| model | string | Required | 1 |
| variant | string | Required | 1 |
| manufacture_year | string | Required, 4 digits | 1 |
| fuel_type | FuelType | Required | 1 |
| cng_kit | "No" \| "Yes" | If fuel_type=CNG | 1 |
| city_of_registration | string | Required | 2 |
| previous_policy_expiry_date | string | Valid date | 2 |
| break_in | boolean | Auto-set | 2 |
| ncb_percentage | string | Required | 2 |
| claims_in_last_3_years | "0" \| "1" \| "2" \| "3+" | Required | 2 |
| idv_preference | IDVPref | Required | 2 |
| full_name | string | Required, min 2 | 4 |
| mobile_number | string | Required, 10 digits | 4 |
| email_address | string | Required, valid email | 4 |
| risk_score | number | Computed | 4 |
| risk_signals | string[] | Computed | 4 |
| risk_tier | string | Computed | 4 |

---

## Testing Checklist

- [ ] Valid registration auto-fetch succeeds
- [ ] Invalid registration shows format error
- [ ] VAHAN failure falls back to manual
- [ ] All vehicle fields required validation
- [ ] City dropdown filtering works
- [ ] Expiry date auto-formatting works
- [ ] Past expiry shows break-in warning
- [ ] Break-in forces NCB to 0%
- [ ] Quote API error handled
- [ ] Contact validation all cases
- [ ] Risk scoring applied
- [ ] Lead submission silent on error
- [ ] State persistence on reload
- [ ] Reset clears all data