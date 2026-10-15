import { ActiveDashaChain, BodyKey, DashaNode } from '@/types/astronomy';
import { NAKSHATRAS } from './constants';

const DASHA_LORDS: { lord: BodyKey; years: number }[] = [
  { lord: 'ketu', years: 7 },
  { lord: 'venus', years: 20 },
  { lord: 'sun', years: 6 },
  { lord: 'moon', years: 10 },
  { lord: 'mars', years: 7 },
  { lord: 'rahu', years: 18 },
  { lord: 'jupiter', years: 16 },
  { lord: 'saturn', years: 19 },
  { lord: 'mercury', years: 17 },
];

const TOTAL_YEARS = 120;
const DAYS_PER_YEAR = 365.2425;
const MS_PER_DAY = 86400000;

function calculateProgress(currentTime: number, startTime: number, endTime: number): number {
  if (endTime <= startTime) return 0;
  const pct = ((currentTime - startTime) / (endTime - startTime)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct * 10) / 10));
}

/**
 * Calculates 4-tier Vimshottari Dasha hierarchy down to Sookshmadasha
 * for a specific query date, based on birth date and birth Moon sidereal longitude.
 */
export function calculateVimshottariDasha(
  birthDate: Date,
  moonSiderealLon: number,
  targetDate: Date
): ActiveDashaChain {
  const nakshatraSpan = 360 / 27; // 13°20'
  const nakshatraIndex = Math.floor(moonSiderealLon / nakshatraSpan);
  const degreeInNakshatra = moonSiderealLon % nakshatraSpan;
  const elapsedFraction = degreeInNakshatra / nakshatraSpan;

  // Initial lord at birth
  const initialNakshatra = NAKSHATRAS[nakshatraIndex];
  const initialLord = initialNakshatra.lord;
  const initialIndex = DASHA_LORDS.findIndex((d) => d.lord === initialLord);

  const initialYears = DASHA_LORDS[initialIndex].years;
  const initialMs = initialYears * DAYS_PER_YEAR * MS_PER_DAY;

  // True Mahadasha start and end at birth
  const firstMahaStartMs = birthDate.getTime() - elapsedFraction * initialMs;
  const firstMahaEndMs = firstMahaStartMs + initialMs;

  const targetTime = targetDate.getTime();

  // Find active Mahadasha
  let activeMahaIndex = initialIndex;
  let activeMahaStartMs = firstMahaStartMs;
  let activeMahaEndMs = firstMahaEndMs;

  if (targetTime < firstMahaStartMs) {
    activeMahaStartMs = firstMahaStartMs;
    activeMahaEndMs = firstMahaEndMs;
  } else {
    while (activeMahaEndMs < targetTime) {
      activeMahaIndex = (activeMahaIndex + 1) % 9;
      const durMs = DASHA_LORDS[activeMahaIndex].years * DAYS_PER_YEAR * MS_PER_DAY;
      activeMahaStartMs = activeMahaEndMs;
      activeMahaEndMs = activeMahaStartMs + durMs;
    }
  }

  const mahaLord = DASHA_LORDS[activeMahaIndex].lord;
  const mahaNode: DashaNode = {
    level: 'maha',
    lord: mahaLord,
    startDate: new Date(activeMahaStartMs).toISOString().split('T')[0],
    endDate: new Date(activeMahaEndMs).toISOString().split('T')[0],
    durationDays: Math.round((activeMahaEndMs - activeMahaStartMs) / MS_PER_DAY),
    progressPercentage: calculateProgress(targetTime, activeMahaStartMs, activeMahaEndMs),
    isActive: true,
  };

  // 2. Find Antardasha within Mahadasha
  const mahaDurationMs = activeMahaEndMs - activeMahaStartMs;
  let antarCursorMs = activeMahaStartMs;
  let activeAntarLord = mahaLord;
  let activeAntarStartMs = antarCursorMs;
  let activeAntarEndMs = antarCursorMs;
  let activeAntarIndex = activeMahaIndex;

  for (let a = 0; a < 9; a++) {
    const antarLordIndex = (activeMahaIndex + a) % 9;
    const antarYears = DASHA_LORDS[antarLordIndex].years;
    const antarMs = (mahaDurationMs * antarYears) / TOTAL_YEARS;
    const antarEndMs = antarCursorMs + antarMs;

    if (
      (targetTime >= antarCursorMs && targetTime < antarEndMs) ||
      (a === 8 && targetTime >= antarCursorMs)
    ) {
      activeAntarLord = DASHA_LORDS[antarLordIndex].lord;
      activeAntarIndex = antarLordIndex;
      activeAntarStartMs = antarCursorMs;
      activeAntarEndMs = antarEndMs;
      break;
    }
    antarCursorMs = antarEndMs;
  }

  const antarNode: DashaNode = {
    level: 'antar',
    lord: activeAntarLord,
    startDate: new Date(activeAntarStartMs).toISOString().split('T')[0],
    endDate: new Date(activeAntarEndMs).toISOString().split('T')[0],
    durationDays: Math.round((activeAntarEndMs - activeAntarStartMs) / MS_PER_DAY),
    progressPercentage: calculateProgress(targetTime, activeAntarStartMs, activeAntarEndMs),
    isActive: true,
  };

  // 3. Find Pratyantardasha within Antardasha
  const antarDurationMs = activeAntarEndMs - activeAntarStartMs;
  let pratyCursorMs = activeAntarStartMs;
  let activePratyLord = activeAntarLord;
  let activePratyStartMs = pratyCursorMs;
  let activePratyEndMs = pratyCursorMs;
  let activePratyIndex = activeAntarIndex;

  for (let p = 0; p < 9; p++) {
    const pratyLordIndex = (activeAntarIndex + p) % 9;
    const pratyYears = DASHA_LORDS[pratyLordIndex].years;
    const pratyMs = (antarDurationMs * pratyYears) / TOTAL_YEARS;
    const pratyEndMs = pratyCursorMs + pratyMs;

    if (
      (targetTime >= pratyCursorMs && targetTime < pratyEndMs) ||
      (p === 8 && targetTime >= pratyCursorMs)
    ) {
      activePratyLord = DASHA_LORDS[pratyLordIndex].lord;
      activePratyIndex = pratyLordIndex;
      activePratyStartMs = pratyCursorMs;
      activePratyEndMs = pratyEndMs;
      break;
    }
    pratyCursorMs = pratyEndMs;
  }

  const pratyNode: DashaNode = {
    level: 'pratyantar',
    lord: activePratyLord,
    startDate: new Date(activePratyStartMs).toISOString().split('T')[0],
    endDate: new Date(activePratyEndMs).toISOString().split('T')[0],
    durationDays: Math.round((activePratyEndMs - activePratyStartMs) / MS_PER_DAY),
    progressPercentage: calculateProgress(targetTime, activePratyStartMs, activePratyEndMs),
    isActive: true,
  };

  // 4. Find Sookshmadasha (Level 4) within Pratyantardasha
  const pratyDurationMs = activePratyEndMs - activePratyStartMs;
  let sookshmaCursorMs = activePratyStartMs;
  let activeSookshmaLord = activePratyLord;
  let activeSookshmaStartMs = sookshmaCursorMs;
  let activeSookshmaEndMs = sookshmaCursorMs;

  for (let s = 0; s < 9; s++) {
    const sookshmaLordIndex = (activePratyIndex + s) % 9;
    const sookshmaYears = DASHA_LORDS[sookshmaLordIndex].years;
    const sookshmaMs = (pratyDurationMs * sookshmaYears) / TOTAL_YEARS;
    const sookshmaEndMs = sookshmaCursorMs + sookshmaMs;

    if (
      (targetTime >= sookshmaCursorMs && targetTime < sookshmaEndMs) ||
      (s === 8 && targetTime >= sookshmaCursorMs)
    ) {
      activeSookshmaLord = DASHA_LORDS[sookshmaLordIndex].lord;
      activeSookshmaStartMs = sookshmaCursorMs;
      activeSookshmaEndMs = sookshmaEndMs;
      break;
    }
    sookshmaCursorMs = sookshmaEndMs;
  }

  const sookshmaNode: DashaNode = {
    level: 'sookshma',
    lord: activeSookshmaLord,
    startDate: new Date(activeSookshmaStartMs).toISOString().split('T')[0],
    endDate: new Date(activeSookshmaEndMs).toISOString().split('T')[0],
    durationDays: Math.max(1, Math.round((activeSookshmaEndMs - activeSookshmaStartMs) / MS_PER_DAY)),
    progressPercentage: calculateProgress(targetTime, activeSookshmaStartMs, activeSookshmaEndMs),
    isActive: true,
  };

  return {
    mahadasha: mahaNode,
    antardasha: antarNode,
    pratyantardasha: pratyNode,
    sookshmadasha: sookshmaNode,
  };
}

/**
 * Calculates all 9 Antardashas (sub-periods) within a Mahadasha
 */
export function calculateAllAntardashasForMaha(
  mahaNode: DashaNode,
  targetDate: Date
): DashaNode[] {
  const mahaLordIndex = DASHA_LORDS.findIndex((d) => d.lord === mahaNode.lord);
  if (mahaLordIndex === -1) return [];

  const startMs = new Date(mahaNode.startDate).getTime();
  const endMs = new Date(mahaNode.endDate).getTime();
  const totalMahaMs = endMs - startMs;
  const targetMs = targetDate.getTime();

  const results: DashaNode[] = [];
  let cursorMs = startMs;

  for (let a = 0; a < 9; a++) {
    const antarLordIndex = (mahaLordIndex + a) % 9;
    const antarYears = DASHA_LORDS[antarLordIndex].years;
    const antarMs = (totalMahaMs * antarYears) / TOTAL_YEARS;
    const itemEndMs = cursorMs + antarMs;
    const isActive = targetMs >= cursorMs && targetMs < itemEndMs;

    results.push({
      level: 'antar',
      lord: DASHA_LORDS[antarLordIndex].lord,
      startDate: new Date(cursorMs).toISOString().split('T')[0],
      endDate: new Date(itemEndMs).toISOString().split('T')[0],
      durationDays: Math.round((itemEndMs - cursorMs) / MS_PER_DAY),
      progressPercentage: calculateProgress(targetMs, cursorMs, itemEndMs),
      isActive,
    });

    cursorMs = itemEndMs;
  }

  return results;
}

/**
 * Calculates all 9 Pratyantardashas (micro-periods) within an Antardasha
 */
export function calculateAllPratyantardashasForAntar(
  antarNode: DashaNode,
  targetDate: Date
): DashaNode[] {
  const antarLordIndex = DASHA_LORDS.findIndex((d) => d.lord === antarNode.lord);
  if (antarLordIndex === -1) return [];

  const startMs = new Date(antarNode.startDate).getTime();
  const endMs = new Date(antarNode.endDate).getTime();
  const totalAntarMs = endMs - startMs;
  const targetMs = targetDate.getTime();

  const results: DashaNode[] = [];
  let cursorMs = startMs;

  for (let p = 0; p < 9; p++) {
    const pratyLordIndex = (antarLordIndex + p) % 9;
    const pratyYears = DASHA_LORDS[pratyLordIndex].years;
    const pratyMs = (totalAntarMs * pratyYears) / TOTAL_YEARS;
    const itemEndMs = cursorMs + pratyMs;
    const isActive = targetMs >= cursorMs && targetMs < itemEndMs;

    results.push({
      level: 'pratyantar',
      lord: DASHA_LORDS[pratyLordIndex].lord,
      startDate: new Date(cursorMs).toISOString().split('T')[0],
      endDate: new Date(itemEndMs).toISOString().split('T')[0],
      durationDays: Math.max(1, Math.round((itemEndMs - cursorMs) / MS_PER_DAY)),
      progressPercentage: calculateProgress(targetMs, cursorMs, itemEndMs),
      isActive,
    });

    cursorMs = itemEndMs;
  }

  return results;
}
