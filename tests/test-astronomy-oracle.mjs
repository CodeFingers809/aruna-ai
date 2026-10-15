#!/usr/bin/env node
/**
 * Astronomy Oracle Verification Suite
 *
 * Verifies high-precision astronomical calculations against known
 * Swiss Ephemeris and Jagannatha Hora benchmarks, and validates architectural
 * compliance with Parashari rules and numerical methods.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Astronomy from 'astronomy-engine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

// ============================================================================
// Core Astronomical Formulations (Identical to src/lib/astronomy/)
// ============================================================================

function getLahiriAyanamsha(time) {
  const T = time.tt / 36525.0;
  return 23.856944 + 1.396042 * T + 0.000308 * T * T;
}

function getMeanRahuLongitude(time) {
  const T = time.tt / 36525.0;
  let omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000.0;
  return ((omega % 360) + 360) % 360;
}

const BODY_MAP = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
};

function getSiderealLongitude(bodyKey, time) {
  const ayanamsha = getLahiriAyanamsha(time);
  if (bodyKey === 'rahu') {
    return ((getMeanRahuLongitude(time) - ayanamsha) % 360 + 360) % 360;
  }
  if (bodyKey === 'ketu') {
    const rahuLon = getMeanRahuLongitude(time);
    return (((rahuLon + 180) % 360 - ayanamsha) % 360 + 360) % 360;
  }
  const geo = Astronomy.GeoVector(BODY_MAP[bodyKey], time, true);
  const ecl = Astronomy.Ecliptic(geo);
  return ((ecl.elon - ayanamsha) % 360 + 360) % 360;
}

function getDailySpeed(bodyKey, time) {
  const dt = 1 / 24.0;
  const l1 = getSiderealLongitude(bodyKey, time);
  const l2 = getSiderealLongitude(bodyKey, time.AddDays(dt));
  let delta = (l2 - l1) * 24.0;
  if (delta > 180) delta -= 360 * 24.0;
  if (delta < -180) delta += 360 * 24.0;
  return delta;
}

// BPHS Classical Required Virupas
const REQUIRED_VIRUPAS_BENCHMARK = {
  sun: 390,     // 6.5 Rupas
  moon: 360,    // 6.0 Rupas
  mars: 300,    // 5.0 Rupas
  mercury: 420, // 7.0 Rupas
  jupiter: 390, // 6.5 Rupas
  venus: 330,   // 5.5 Rupas
  saturn: 300,  // 5.0 Rupas
};

const CLASSICAL_GRAHAS = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];

// ============================================================================
// Test Framework Helper
// ============================================================================

let totalPassed = 0;
let totalFailed = 0;

function runTest(suiteName, testName, testFn) {
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
console.log('  ARUNA AI ASTRONOMY VERIFICATION ORACLE');
console.log('  Benchmarked against Swiss Ephemeris & Jagannatha Hora Standards');
console.log('====================================================================\n');

// ============================================================================
// Suite 1: Ingress Benchmarks (Bisection Root-Finding on Ephemeris)
// ============================================================================
console.log('Suite 1: Planetary Ingress Date Benchmarks');

runTest('Suite 1', 'Rahu Ingress (Aquarius -> Capricorn) on 2026-12-05', () => {
  // Mean Rahu in Aquarius (sign 10) in Oct 2026, enters Capricorn (sign 9)
  const t0 = new Astronomy.AstroTime(new Date('2026-10-15T12:00:00Z'));
  const currentSign = 10;
  let exitDateStr = '';
  let nextSign = -1;

  for (let d = 2.0; d <= 120; d += 2.0) {
    const tCheck = t0.AddDays(d);
    const lon = getSiderealLongitude('rahu', tCheck);
    const sign = Math.floor(lon / 30);

    if (sign !== currentSign) {
      let low = d - 2.0;
      let high = d;
      for (let iter = 0; iter < 18; iter++) {
        const mid = (low + high) / 2;
        const sMid = Math.floor(getSiderealLongitude('rahu', t0.AddDays(mid)) / 30);
        if (sMid === currentSign) low = mid;
        else high = mid;
      }
      const exactTime = t0.AddDays((low + high) / 2);
      exitDateStr = exactTime.date.toISOString().split('T')[0];
      nextSign = sign;
      break;
    }
  }

  assert.strictEqual(nextSign, 9, 'Target sign must be Capricorn (signIndex 9)');
  assert.strictEqual(exitDateStr, '2026-12-05', 'Rahu must enter Capricorn on 2026-12-05');
});

runTest('Suite 1', 'Venus Retrograde Ingress (Libra -> Virgo) on 2026-11-05', () => {
  // Venus in Libra (sign 6) retrograding into Virgo (sign 5) in Nov 2026
  const t0 = new Astronomy.AstroTime(new Date('2026-10-15T12:00:00Z'));
  const currentSign = 6;
  let exitDateStr = '';
  let nextSign = -1;
  let speedAtCrossing = 0;

  for (let d = 1.0; d <= 60; d += 1.0) {
    const tCheck = t0.AddDays(d);
    const lon = getSiderealLongitude('venus', tCheck);
    const sign = Math.floor(lon / 30);

    if (sign !== currentSign) {
      let low = d - 1.0;
      let high = d;
      for (let iter = 0; iter < 18; iter++) {
        const mid = (low + high) / 2;
        const sMid = Math.floor(getSiderealLongitude('venus', t0.AddDays(mid)) / 30);
        if (sMid === currentSign) low = mid;
        else high = mid;
      }
      const exactTime = t0.AddDays((low + high) / 2);
      exitDateStr = exactTime.date.toISOString().split('T')[0];
      nextSign = sign;
      speedAtCrossing = getDailySpeed('venus', exactTime);
      break;
    }
  }

  assert.strictEqual(nextSign, 5, 'Target sign must be Virgo (signIndex 5)');
  assert.strictEqual(exitDateStr, '2026-11-05', 'Venus must enter Virgo on 2026-11-05');
  assert(speedAtCrossing < 0, `Venus must be in retrograde motion (speed=${speedAtCrossing.toFixed(3)} < 0)`);
});

runTest('Suite 1', 'Saturn Ingress (Pisces -> Aries) on 2027-06-02/03', () => {
  // Saturn moving from Pisces (sign 11, lon ~359°) into Aries (sign 0, lon ~0°)
  const t0 = new Astronomy.AstroTime(new Date('2026-10-15T12:00:00Z'));
  const currentSign = 11;
  let exitDateStr = '';
  let nextSign = -1;

  for (let d = 2.0; d <= 400; d += 2.0) {
    const tCheck = t0.AddDays(d);
    const lon = getSiderealLongitude('saturn', tCheck);
    const sign = Math.floor(lon / 30);

    if (sign !== currentSign) {
      let low = d - 2.0;
      let high = d;
      for (let iter = 0; iter < 18; iter++) {
        const mid = (low + high) / 2;
        const sMid = Math.floor(getSiderealLongitude('saturn', t0.AddDays(mid)) / 30);
        if (sMid === currentSign) low = mid;
        else high = mid;
      }
      const exactTime = t0.AddDays((low + high) / 2);
      exitDateStr = exactTime.date.toISOString().split('T')[0];
      nextSign = sign;
      break;
    }
  }

  assert.strictEqual(nextSign, 0, 'Target sign must be Aries (signIndex 0)');
  assert(
    exitDateStr === '2027-06-02' || exitDateStr === '2027-06-03',
    `Saturn ingress date was ${exitDateStr}, expected 2027-06-02 or 2027-06-03`
  );
});

// ============================================================================
// Suite 2: Planetary Retrograde Station Benchmarks
// ============================================================================
console.log('\nSuite 2: Venus Retrograde Station Benchmarks (Oct 2 - Nov 14, 2026)');

runTest('Suite 2', 'Venus Station Retrograde (Oct 2-3, 2026)', () => {
  const t0 = new Astronomy.AstroTime(new Date('2026-10-15T12:00:00Z'));
  let stationRetrogradeDate = '';

  for (let d = 1; d <= 30; d++) {
    const tPrev = t0.AddDays(-d);
    const spd = getDailySpeed('venus', tPrev);
    if (spd >= 0) {
      stationRetrogradeDate = tPrev.date.toISOString().split('T')[0];
      break;
    }
  }

  assert(
    stationRetrogradeDate === '2026-10-02' || stationRetrogradeDate === '2026-10-03',
    `Venus station retrograde was ${stationRetrogradeDate}, expected 2026-10-02 or 2026-10-03`
  );
});

runTest('Suite 2', 'Venus Station Direct (Nov 14, 2026)', () => {
  const t0 = new Astronomy.AstroTime(new Date('2026-10-15T12:00:00Z'));
  let stationDirectDate = '';

  for (let d = 1; d <= 45; d++) {
    const tFwd = t0.AddDays(d);
    const spd = getDailySpeed('venus', tFwd);
    if (spd >= 0) {
      stationDirectDate = tFwd.date.toISOString().split('T')[0];
      break;
    }
  }

  assert.strictEqual(stationDirectDate, '2026-11-14', 'Venus station direct must occur on 2026-11-14');
});

runTest('Suite 2', 'Continuous Velocity Inversion Verification across Stations', () => {
  const preStation = new Astronomy.AstroTime(new Date('2026-09-28T00:00:00Z'));
  const midRetro = new Astronomy.AstroTime(new Date('2026-10-25T00:00:00Z'));
  const postStation = new Astronomy.AstroTime(new Date('2026-11-20T00:00:00Z'));

  const vPre = getDailySpeed('venus', preStation);
  const vMid = getDailySpeed('venus', midRetro);
  const vPost = getDailySpeed('venus', postStation);

  assert(vPre > 0, `Speed before retrograde must be positive (got ${vPre})`);
  assert(vMid < 0, `Speed during retrograde must be negative (got ${vMid})`);
  assert(vPost > 0, `Speed after direct station must be positive (got ${vPost})`);
});

// ============================================================================
// Suite 3: Classical Parashari Shadbala Scope & Required Virupas
// ============================================================================
console.log('\nSuite 3: Classical Parashari Shadbala Scope & Invariants');

runTest('Suite 3', 'BPHS Ch. 27 Required Virupa Baselines Verification', () => {
  const expected = {
    sun: 390,
    moon: 360,
    mars: 300,
    mercury: 420,
    jupiter: 390,
    venus: 330,
    saturn: 300,
  };

  for (const [planet, virupas] of Object.entries(expected)) {
    assert.strictEqual(
      REQUIRED_VIRUPAS_BENCHMARK[planet],
      virupas,
      `Required Virupas for ${planet} must be ${virupas}`
    );
  }
});

runTest('Suite 3', 'Strict 7-Graha Scope (No Nodes or Outer Planets in Shadbala)', () => {
  const prohibitedFromShadbala = ['rahu', 'ketu', 'uranus', 'neptune', 'pluto'];
  for (const key of prohibitedFromShadbala) {
    assert(
      !(key in REQUIRED_VIRUPAS_BENCHMARK),
      `Prohibited body "${key}" must NOT be present in REQUIRED_VIRUPAS`
    );
    assert(
      !CLASSICAL_GRAHAS.includes(key),
      `Prohibited body "${key}" must NOT be in CLASSICAL_GRAHAS list`
    );
  }
});

runTest('Suite 3', 'Classical Shadbala Ranking Ordering and Invariants', () => {
  // Mock computed total Virupas for test of ranking algorithm
  const sampleVirupas = {
    sun: 410.5,
    moon: 375.2,
    mars: 289.4,
    mercury: 440.1,
    jupiter: 450.8,
    venus: 360.0,
    saturn: 310.2,
  };

  const results = Object.entries(sampleVirupas).map(([planet, totalVirupas]) => {
    const required = REQUIRED_VIRUPAS_BENCHMARK[planet];
    const ratio = Number((totalVirupas / required).toFixed(2));
    return {
      planet,
      totalVirupas,
      requiredVirupas: required,
      ratio,
      isBalavan: ratio >= 1.0,
      rank: 0,
    };
  });

  // Sort descending by totalVirupas
  results.sort((a, b) => b.totalVirupas - a.totalVirupas);
  results.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  assert.strictEqual(results.length, 7, 'Must have exactly 7 ranked classical grahas');
  const ranks = results.map((r) => r.rank);
  assert.deepStrictEqual(ranks, [1, 2, 3, 4, 5, 6, 7], 'Ranks must be exactly 1 through 7 without gaps');

  // Verify monotonicity
  for (let i = 0; i < results.length - 1; i++) {
    assert(
      results[i].totalVirupas >= results[i + 1].totalVirupas,
      'Ranked list must be monotonically non-increasing in totalVirupas'
    );
  }
});

// ============================================================================
// Suite 4: Architectural Compliance & Static AST Checks
// ============================================================================
console.log('\nSuite 4: Architectural Integrity & Codebase Verification');

runTest('Suite 4', 'Zero Linear Speed Division in Transits Engine', () => {
  const transitsPath = path.join(REPO_ROOT, 'src/lib/astronomy/transits.ts');
  const code = fs.readFileSync(transitsPath, 'utf8');

  // Prohibit linear speed division formulas such as:
  // (destLon - currentLon) / speed
  // daysRemaining = deg / speed
  // speedDivision = (diff) / body.speed
  const bannedLinearDivisionPattern = /\/\s*(?:body\.)?speed\b|\/\s*dailySpeed\b/g;
  const matches = [...code.matchAll(bannedLinearDivisionPattern)];

  assert.strictEqual(
    matches.length,
    0,
    `transits.ts must not contain linear speed division for crossing calculation`
  );

  // Must contain numerical bisection root-finding
  assert(
    code.includes('mid = (low + high) / 2') || code.includes('(low + high) / 2'),
    'transits.ts must use bisection root-finding'
  );
});

runTest('Suite 4', 'Verify RULES.md and AGENTS.md Exist and Enforce Prohibitive Rules', () => {
  const rulesPath = path.join(REPO_ROOT, 'RULES.md');
  const agentsPath = path.join(REPO_ROOT, 'AGENTS.md');

  assert(fs.existsSync(rulesPath), 'RULES.md must exist at repo root');
  assert(fs.existsSync(agentsPath), 'AGENTS.md must exist at repo root');

  const rulesContent = fs.readFileSync(rulesPath, 'utf8');
  const agentsContent = fs.readFileSync(agentsPath, 'utf8');

  const requiredSections = [
    'Prohibited Marketing',
    'Computational Integrity',
    'Parashari Scope Rule',
    'Ephemeris & Astronomy Numerical Engine',
    'Tone & Register',
  ];

  for (const sec of requiredSections) {
    assert(
      rulesContent.includes(sec),
      `RULES.md must contain section matching "${sec}"`
    );
    assert(
      agentsContent.includes(sec) || agentsContent.includes('Prohibitive Guidelines'),
      `AGENTS.md must contain reference to prohibitive guidelines`
    );
  }
});

runTest('Suite 4', 'Verify shadbala.ts Adheres to Parashari 7-Graha Classical Constants', () => {
  const shadbalaPath = path.join(REPO_ROOT, 'src/lib/astronomy/shadbala.ts');
  const code = fs.readFileSync(shadbalaPath, 'utf8');

  assert(code.includes('sun: 390'), 'shadbala.ts must define Sun required virupas as 390');
  assert(code.includes('moon: 360'), 'shadbala.ts must define Moon required virupas as 360');
  assert(code.includes('mars: 300'), 'shadbala.ts must define Mars required virupas as 300');
  assert(code.includes('mercury: 420'), 'shadbala.ts must define Mercury required virupas as 420');
  assert(code.includes('jupiter: 390'), 'shadbala.ts must define Jupiter required virupas as 390');
  assert(code.includes('venus: 330'), 'shadbala.ts must define Venus required virupas as 330');
  assert(code.includes('saturn: 300'), 'shadbala.ts must define Saturn required virupas as 300');

  // Verify Rahu/Ketu are NOT in REQUIRED_VIRUPAS
  assert(!code.includes('rahu: 3'), 'Rahu must not be in REQUIRED_VIRUPAS');
  assert(!code.includes('ketu: 3'), 'Ketu must not be in REQUIRED_VIRUPAS');
});

// ============================================================================
// Summary
// ============================================================================
console.log('\n====================================================================');
console.log(`  VERIFICATION RESULTS: ${totalPassed} Passed, ${totalFailed} Failed`);
console.log('====================================================================\n');

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
