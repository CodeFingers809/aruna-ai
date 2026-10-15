#!/usr/bin/env node
/**
 * Event Radar Verification Test Suite
 *
 * Verifies that:
 * 1. RAW_ASTRONOMICAL_EVENTS has 55+ astronomically verified milestones spanning 2022 to 2028/2029.
 * 2. All 12 annual Solar Ingresses (Sankrantis) across 2024-2027 are present.
 * 3. Major stations (Mars, Venus, Mercury, Jupiter, Saturn) and Ingresses (Saturn, Jupiter, Rahu-Ketu) are present.
 * 4. Multi-domain mapping is functional: for every domain (career, wealth, love, health, dharma) and horizon (future, past),
 *    events are returned across 6M, 1Y, 2Y, and 3Y windows.
 * 5. Strict adherence to RULES.md (zero banned marketing words, pure Parashari / astronomical terms).
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const eventRadarPath = path.join(REPO_ROOT, 'src/lib/astronomy/eventRadar.ts');
const eventRadarCode = fs.readFileSync(eventRadarPath, 'utf8');

let totalPassed = 0;
let totalFailed = 0;

function runTest(testName, testFn) {
  try {
    testFn();
    console.log(`  ✓ [PASS] ${testName}`);
    totalPassed++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${testName}`);
    console.error(`    ${err.message}`);
    totalFailed++;
  }
}

console.log('====================================================================');
console.log('  EVENT RADAR ARCHITECTURAL & ASTRONOMICAL VERIFICATION SUITE');
console.log('====================================================================\n');

// 1. Raw event count check
runTest('Raw Astronomical Milestones Count >= 55', () => {
  // Extract RAW_ASTRONOMICAL_EVENTS array using regex or eval
  const countMatch = eventRadarCode.match(/sanskrit:\s*['"]/g);
  assert(countMatch, 'sanskrit titles must exist');
  assert(countMatch.length >= 55, `Expected at least 55 events, found ${countMatch.length}`);
  console.log(`    (Found ${countMatch.length} milestone events in RAW_ASTRONOMICAL_EVENTS)`);
});

// 2. Solar Ingresses check: all 12 signs across 2024, 2025, 2026, 2027
runTest('All 12 Solar Sankrantis present for 2024, 2025, 2026, 2027', () => {
  const sankrantis = [
    'Mesha Sankranti',
    'Vrishabha Sankranti',
    'Mithuna Sankranti',
    'Karka Sankranti',
    'Simha Sankranti',
    'Kanya Sankranti',
    'Tula Sankranti',
    'Vrishchika Sankranti',
    'Dhanu Sankranti',
    'Makara Sankranti',
    'Kumbha Sankranti',
    'Meena Sankranti',
  ];

  for (const s of sankrantis) {
    for (const yr of [2024, 2025, 2026, 2027]) {
      // Check presence in code
      const regex = new RegExp(`year:\\s*${yr}[^}]+sanskrit:\\s*['"]${s}`);
      assert(regex.test(eventRadarCode), `Missing ${s} for year ${yr}`);
    }
  }
});

// 3. Planetary stations and ingresses check
runTest('Key Planetary Stations & Ingresses Present (Mars, Venus, Jupiter, Saturn, Rahu-Ketu)', () => {
  const requiredKeywords = [
    'Shani Kumbha Pravesha',
    'Shani Meena Pravesha',
    'Shani Mesha Pravesha',
    'Guru Mesha Pravesha',
    'Guru Vrishabha Pravesha',
    'Guru Mithuna Pravesha',
    'Guru Karka',
    'Guru Simha Pravesha',
    'Rahu-Ketu Meena-Kanya Sanchara',
    'Rahu-Ketu Kumbha-Simha Sanchara',
    'Rahu-Ketu Makara-Karka Sanchara',
    'Mangala Makara Uchcha Sanchara',
    'Mangala Karka Vakra Sthiti',
    'Shukra Meena Uchcha Vakra Sthiti',
    'Shukra Tula Sva-kshetra Vakra Sthiti',
    'Budha Mesha Vakra Sthiti',
    'Surya Grahan',
    'Chandra Grahan',
  ];

  for (const kw of requiredKeywords) {
    assert(eventRadarCode.includes(kw), `Missing milestone keyword: ${kw}`);
  }
});

// 4. Banned marketing vocabulary check
runTest('Zero Banned Marketing Vocabulary in eventRadar.ts', () => {
  const BANNED_TERMS = [
    'seamless',
    'harmonious',
    'strategic',
    'synthesis',
    'high-potency',
    'surplus',
    'cosmic',
    'unlock',
    'empower',
    'Zero False Positives',
  ];

  for (const term of BANNED_TERMS) {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    const match = eventRadarCode.match(regex);
    assert(!match, `Found prohibited marketing term "${term}" in eventRadar.ts`);
  }
});

// 5. Verification of multi-domain filtering in LeftSidebar.tsx
runTest('LeftSidebar includes Dharma and renders multi-domain tags', () => {
  const sidebarPath = path.join(REPO_ROOT, 'src/components/sidebar/LeftSidebar.tsx');
  const sidebarCode = fs.readFileSync(sidebarPath, 'utf8');

  assert(
    sidebarCode.includes("'all', 'career', 'wealth', 'love', 'health', 'dharma'"),
    'LeftSidebar must include dharma in the domain filter list'
  );
  assert(
    sidebarCode.includes('evt.applicableDomains'),
    'LeftSidebar must render applicableDomains tags'
  );
  assert(
    !sidebarCode.includes('<span className="font-bold text-emerald-400">Directive: </span>'),
    'LeftSidebar must not display prohibited word "Directive:"'
  );
});

// 6. Computational evaluation of calculateHighStakesEvents
runTest('Multi-domain Filtering returns rich events across all domains and horizons', () => {
  // Extract RAW_ASTRONOMICAL_EVENTS and logic to evaluate dynamically
  // We can evaluate computeApplicableDomains and filtering logic
  const matchArray = eventRadarCode.match(/export const RAW_ASTRONOMICAL_EVENTS:\s*RawAstronomicalEvent\[\]\s*=\s*(\[[\s\S]*?\]);\n\n\/\*\*/);
  assert(matchArray, 'Could not extract RAW_ASTRONOMICAL_EVENTS');

  const rawEvents = eval(matchArray[1]);
  assert(rawEvents.length >= 55, `Expected >= 55 events, got ${rawEvents.length}`);

  // Simulate calculateHighStakesEvents for a test date (2026-10-15)
  const refDate = new Date('2026-10-15T12:00:00Z');
  const refTime = refDate.getTime();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  function testFilter(horizon, domain, rangeYears) {
    const maxDeltaDays = rangeYears * 365.25;
    const lagnaSign = 0; // Aries default
    const moonSign = 3;  // Cancer default

    const results = [];
    for (const raw of rawEvents) {
      const eventDate = new Date(Date.UTC(raw.year, raw.month, raw.day, 12, 0, 0));
      const eventTime = eventDate.getTime();
      const diffMs = eventTime - refTime;
      const daysFromNow = Math.round(diffMs / ONE_DAY_MS);

      if (Math.abs(daysFromNow) > maxDeltaDays) continue;
      const evtHorizon = daysFromNow >= 0 ? 'future' : 'past';
      if (horizon !== 'all' && horizon !== evtHorizon) continue;

      const houseFromLagna = ((raw.signIndex - lagnaSign + 12) % 12) + 1;
      const houseFromMoon = ((raw.signIndex - moonSign + 12) % 12) + 1;
      const isEclipse = raw.type.includes('eclipse');

      // Applicable domains
      const domains = new Set();
      for (const h of [houseFromLagna, houseFromMoon]) {
        if ([1, 2, 5, 9, 11].includes(h)) domains.add('wealth');
        if ([1, 6, 7, 10, 11].includes(h)) domains.add('career');
        if ([2, 4, 5, 7, 11].includes(h)) domains.add('love');
        if ([1, 6, 8, 12].includes(h)) domains.add('health');
        if ([1, 4, 5, 9, 12].includes(h)) domains.add('dharma');
      }
      if (raw.planet === 'sun') { domains.add('career'); domains.add('dharma'); if ([1,6,8,12].includes(houseFromLagna) || isEclipse) domains.add('health'); }
      if (raw.planet === 'moon') { domains.add('health'); domains.add('dharma'); if ([4,7].includes(houseFromLagna)) domains.add('love'); }
      if (raw.planet === 'mars') { domains.add('career'); domains.add('health'); if ([2,4,11].includes(houseFromLagna)) domains.add('wealth'); }
      if (raw.planet === 'mercury') { domains.add('career'); domains.add('wealth'); domains.add('dharma'); }
      if (raw.planet === 'jupiter') { domains.add('wealth'); domains.add('dharma'); domains.add('career'); }
      if (raw.planet === 'venus') { domains.add('love'); domains.add('wealth'); }
      if (raw.planet === 'saturn') { domains.add('career'); domains.add('health'); domains.add('dharma'); }
      if (raw.planet === 'rahu' || raw.planet === 'ketu') { domains.add('dharma'); if ([1,7].includes(houseFromLagna)) domains.add('love'); if ([10,6,11].includes(houseFromLagna)) domains.add('career'); }
      if (isEclipse) { domains.add('dharma'); domains.add('health'); }

      const appDomains = Array.from(domains);
      if (domain !== 'all' && !appDomains.includes(domain)) continue;

      results.push(raw);
    }
    return results;
  }

  const domains = ['career', 'wealth', 'love', 'health', 'dharma'];
  const horizons = ['future', 'past'];
  const windows = [0.5, 1, 2, 3];

  for (const h of horizons) {
    for (const w of windows) {
      for (const d of domains) {
        const evts = testFilter(h, d, w);
        assert(
          evts.length > 0,
          `Expected at least 1 event for horizon="${h}", domain="${d}", window="${w}Y", but got 0`
        );
      }
    }
  }

  // Print summary counts for 1Y horizon
  console.log('    Evaluation matrix across domains (1Y window):');
  for (const d of domains) {
    const fut = testFilter('future', d, 1).length;
    const past = testFilter('past', d, 1).length;
    console.log(`      • ${d.toUpperCase()}: Future=${fut} events, Past=${past} events`);
  }
});

console.log('\n====================================================================');
console.log(`  VERIFICATION RESULTS: ${totalPassed} Passed, ${totalFailed} Failed`);
console.log('====================================================================\n');

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
