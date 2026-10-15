# Epistemic & Architectural Rules for Aruna AI

## 1. Prohibited Marketing and Hype Vocabulary (Anti-Marketing)

The following vocabulary is strictly prohibited across all code, documentation, comments, API responses, and user interface strings:

### Banned Terms
- `seamless`
- `harmonious`
- `strategic`
- `synthesis`
- `directive`
- `high-potency`
- `surplus`
- `cosmic`
- `unlock`
- `empower`
- `Zero False Positives`
- `Confidence` (when used as a decorative or uncalculated percentage/badge)

### Prohibited Style Patterns
1. **Marketing Fluff**: No promotional prose, sales copy, or self-aggrandizing claims about system capability.
2. **Pseudo-Spiritual & New-Age Hyperbole**: No vague mysticism, "vibrational resonance", "manifestation channels", or decorative astrological jargon.
3. **Prescriptive Patronization**: No unsolicited life advice, moralizing instructions, or imperative "directives" instructing users how to live or trade.

### Permitted Technical & Classical Vocabulary
- Use precise astronomical terms: *ingress*, *egress*, *sidereal longitude*, *true anomaly*, *apparent geocentric coordinates*, *station retrograde*, *station direct*, *conjunction*, *opposition*, *declination*, *hourly motion*.
- Use classical Sanskrit terms per Brihat Parashara Hora Shastra (BPHS): *Graha*, *Rashi*, *Bhava*, *Nakshatra*, *Pada*, *Drishti*, *Dignity* (*Uchcha*, *Neecha*, *Swakshetra*, *Moolatrikona*), *Shadbala*, *Sthana Bala*, *Dig Bala*, *Kala Bala*, *Chesta Bala*, *Naisargika Bala*, *Drik Bala*, *Virupas*, *Rupas*, *Balavan*, *Alpabala*.

---

## 2. Computational Integrity & Zero Hardcoding

1. **Explicit Mathematical Derivation**: Every number, ratio, score, rank, and percentage rendered in the user interface or returned by an API must be computed by an explicit mathematical function located in `src/lib/astronomy/`.
2. **No Hardcoded Metrics**:
   - Hardcoded percentages (e.g. `98%`, `75%`, `100%`) are strictly forbidden.
   - Decorative or mock progress meters, static vitality bars, and fake confidence scores are strictly forbidden.
3. **Traceability**: Every quantity must resolve to verifiable physical or classical units (e.g., arcdegrees `°`, arcminutes `'`, arcseconds `"`, Virupas `V`, Rupas `R`, Julian Ephemeris Days, SI seconds).
4. **Rounding Discipline**: Raw calculations must preserve double-precision floating-point arithmetic. Display rounding occurs strictly at the presentation layer (e.g., `.toFixed(2)` or `.toFixed(1)`).

---

## 3. Parashari Scope Rule (Shadbala & Planetary Strengths)

1. **Exclusive Seven-Graha Domain**:
   - Classical Shadbala (Six-fold Strength) per BPHS Chapters 27–29 is defined **strictly and exclusively** for the 7 classical physical grahas:
     - Surya (Sun)
     - Chandra (Moon)
     - Mangala (Mars)
     - Budha (Mercury)
     - Guru (Jupiter)
     - Shukra (Venus)
     - Shani (Saturn)
2. **Absolute Prohibition on Shadow & Outer Planets**:
   - Never compute Shadbala, assign required Virupas, calculate Shadbala ratios, or assign Shadbala ranks to Rahu, Ketu, Uranus, Neptune, or Pluto.
   - Shadow points (Chhaya Grahas) and trans-Saturnian bodies do not possess physical discs, helical stations, or classical Parashari sub-balas (such as Chesta Bala, Ayana Bala, or Naisargika Bala).
3. **Classical Required Virupa Baselines (BPHS Ch. 27)**:
   - Surya (Sun): **390 Virupas** (6.5 Rupas)
   - Chandra (Moon): **360 Virupas** (6.0 Rupas)
   - Mangala (Mars): **300 Virupas** (5.0 Rupas)
   - Budha (Mercury): **420 Virupas** (7.0 Rupas)
   - Guru (Jupiter): **390 Virupas** (6.5 Rupas)
   - Shukra (Venus): **330 Virupas** (5.5 Rupas)
   - Shani (Saturn): **300 Virupas** (5.0 Rupas)
4. **Classical Rankings**:
   - Shadbala rankings must strictly range from 1 to 7 among the 7 classical grahas, ordered by total Virupas.

---

## 4. Ephemeris & Astronomy Numerical Engine Rule

1. **Numerical Scanning and Root-Finding**:
   - Sign ingress, sign egress, and planetary station (retrograde/direct) dates must be calculated via forward/backward numerical scanning combined with bisection root-finding on true ephemeris positions (`astronomy-engine` high-precision geocentric coordinates with Lahiri / Chitrapaksha ayanamsha).
2. **Linear Speed Division Strictly Banned**:
   - Calculating transit dates using linear division (e.g. `(targetLon - currentLon) / speed` or `daysRemaining = deg / speed`) is **strictly prohibited**.
   - Planetary angular speeds accelerate, decelerate, station, and reverse non-linearly. Linear division introduces severe errors (often weeks or months) near stations and sign boundaries.
3. **Bisection Convergence**:
   - Root-finding must perform at least 16 bisection iterations to guarantee sub-minute temporal convergence on exact sign boundaries (multiples of 30° sidereal longitude).
4. **Ayanamsha Standard**:
   - High-precision Lahiri (Chitrapaksha) Ayanamsha must be computed using IAU precession models referenced to Spica (Chitra) at 180°00'00".

---

## 5. Tone & Register

1. **Terse Reference-Manual Style**: Content must read like an astronomical handbook, nautical almanac, or mathematical treatise.
2. **Descriptive, Not Prescriptive or Evaluative**:
   - Describe what the astronomical and classical configuration *is*, not what the user *must do*.
   - Avoid normative judgments ("good transit", "bad aspect", "favorable vibe").
   - Report astronomical coordinates, Dignities, Vargas, and Parashari mathematical balances factually.
3. **Brevity**: Eliminate unnecessary adjectives, introductory pleasantries, and concluding homilies. State facts directly.

---

## 6. Verification Oracle Enforcement

All astronomical and algorithmic modifications must pass the automated verification oracle suite:
```bash
node tests/test-astronomy-oracle.mjs
```
The suite verifies calculations against Swiss Ephemeris and Jagannatha Hora benchmarks, enforces the banned vocabulary filter, and guarantees computational compliance.
