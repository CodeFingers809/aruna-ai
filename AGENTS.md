<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Prohibitive Guidelines for AGY CLI / Gemini Agents

Refer to [RULES.md](file:///Users/ayush/dev/aruna-ai/RULES.md) for the complete canonical specification. All agents operating in this repository must strictly adhere to the following negative and positive constraints:

## 1. Prohibited Marketing and Hype Vocabulary
- **Banned List**: `seamless`, `harmonious`, `strategic`, `synthesis`, `directive`, `high-potency`, `surplus`, `cosmic`, `unlock`, `empower`, `Zero False Positives`, `Confidence` (when used decoratively or without mathematical computation).
- **Prohibited Style**: No marketing puffery, sales hype, promotional claims, or pseudo-spiritual buzzwords.
- **Allowed Terms**: Technical astronomical terms (*ingress*, *egress*, *sidereal longitude*, *station retrograde*, *station direct*) and classical Parashari Sanskrit terms (*Graha*, *Bhava*, *Nakshatra*, *Shadbala*, *Virupas*, *Rupas*, *Balavan*, *Alpabala*).

## 2. Mandatory Computational Integrity (Zero Hardcoding)
- All numbers, ratios, scores, and percentages presented in UI or returned by APIs must be computed directly by an explicit mathematical function in `src/lib/astronomy/`.
- Hardcoded percentages, synthetic scores, mocked vitality meters, and decorative metrics are strictly forbidden.
- Displayed values must trace to verifiable physical or classical units (degrees, Virupas, Rupas, days).

## 3. Parashari Scope Rule (Shadbala Planetary Strengths)
- Classical Shadbala is strictly for the 7 classical physical grahas: Sun (Surya), Moon (Chandra), Mars (Mangala), Mercury (Budha), Jupiter (Guru), Venus (Shukra), and Saturn (Shani).
- Never compute Shadbala, assign required Virupas, calculate Shadbala ratios, or assign rankings to Rahu, Ketu, Uranus, Neptune, or Pluto.
- Required Virupa baselines (BPHS Ch. 27): Sun: 390, Moon: 360, Mars: 300, Mercury: 420, Jupiter: 390, Venus: 330, Saturn: 300.
- Planetary rankings for Shadbala must strictly run from 1 to 7 among the 7 classical grahas.

## 4. Astronomy & Ephemeris Numerical Method Rule
- Ingress, egress, and retrograde station dates must be determined via numerical forward/backward scanning combined with bisection root-finding on true ephemeris positions (`astronomy-engine` high-precision geocentric coordinates with Lahiri ayanamsha).
- Linear speed division (e.g. `(targetLon - currentLon) / speed` or `days = deg / speed`) is strictly banned.

## 5. Tone & Style Instruction
- Terse, reference-manual style.
- Purely descriptive rather than evaluative or prescriptive. State astronomical positions, Dignities, and Parashari values factually without giving life advice, normative recommendations, or unsolicited directives.

## 6. Verification Oracle Suite
- Run `node tests/test-astronomy-oracle.mjs` before committing changes to verify against Swiss Ephemeris and Jagannatha Hora benchmarks.
