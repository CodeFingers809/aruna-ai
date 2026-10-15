import * as Astronomy from 'astronomy-engine';
import { BodyKey, CelestialBody, TransitEvent } from '@/types/astronomy';
import { ZODIAC_SIGNS } from './constants';
import { getSiderealLongitude, getTropicalCoordinates } from './ephemeris';

function generateTransitInsights(
  key: BodyKey,
  currentSignIndex: number,
  nextSignIndex: number,
  isRetrograde: boolean
): {
  shiftDescription: string;
  meaning: string;
  mandate: string;
  restraints: string;
} {
  const fromSign = ZODIAC_SIGNS[currentSignIndex];
  const toSign = ZODIAC_SIGNS[nextSignIndex];
  const motionPrefix = isRetrograde ? 'Retrograde transit' : 'Transit';

  switch (key) {
    case 'mars':
      return {
        shiftDescription: `${motionPrefix}: Mars traversing ${fromSign.name} (${fromSign.sanskritName}) toward ${toSign.name} (${toSign.sanskritName})`,
        meaning: `Mars shifts from ${fromSign.element} to ${toSign.element} element. Evaluated relative to natal lagna and houses owned. ${
          fromSign.name === 'Cancer' ? 'Exiting debilitation sign (Cancer) restores directional vitality.' : ''
        }`,
        mandate: `Focus energy on completing pending technical and operational tasks. Verify all specifications before execution.`,
        restraints: `Avoid impulsive confrontations, physical recklessness, or haste under fatigue.`,
      };

    case 'sun':
      return {
        shiftDescription: `${motionPrefix}: Sun traversing ${fromSign.name} (${fromSign.sanskritName}) toward ${toSign.name} (${toSign.sanskritName})`,
        meaning: `Solar ingress from ${fromSign.name} into ${toSign.name}. Changes the transit house of the natural significator of vitality and authority.`,
        mandate: `Align daily duties with institutional and professional responsibilities. Maintain clarity in communication.`,
        restraints: `Guard against ego-driven conflict, seeking unearned external validation, or impatience with peers.`,
      };

    case 'jupiter':
      return {
        shiftDescription: `${motionPrefix}: Jupiter traversing ${fromSign.name} (${fromSign.sanskritName}) toward ${toSign.name} (${toSign.sanskritName})`,
        meaning: `Major benefic shift altering the houses receiving Jupiter's 5th, 7th, and 9th drishti (aspects). Effects depend on houses owned from natal lagna.`,
        mandate: `Support long-term planning, ethical standards, education, and consultation with experienced advisors.`,
        restraints: `Do not overextend resources based on speculative projections. Avoid self-righteous or dogmatic speech.`,
      };

    case 'saturn':
      return {
        shiftDescription: `${motionPrefix}: Saturn traversing ${fromSign.name} (${fromSign.sanskritName}) toward ${toSign.name} (${toSign.sanskritName})`,
        meaning: `Multi-year structural transit through ${fromSign.name}. Enforces discipline in houses aspected by its 3rd, 7th, and 10th drishti.`,
        mandate: `Build systematic habits, attend to delayed maintenance, and honor institutional duties methodically.`,
        restraints: `Avoid chronic procrastination, despair under delays, or cutting corners in regulatory compliance.`,
      };

    case 'mercury':
      return {
        shiftDescription: `${motionPrefix}: Mercury traversing ${fromSign.name} (${fromSign.sanskritName}) toward ${toSign.name} (${toSign.sanskritName})`,
        meaning: `Rapid cognitive and communicative transit. Influences analytical documentation, trade, and commercial interactions.`,
        mandate: `Verify written agreements, maintain clear documentation, and cross-check calculations carefully.`,
        restraints: `Avoid superficial multitasking, hurried contractual signatures, and propagating unverified claims.`,
      };

    case 'venus':
      return {
        shiftDescription: `${motionPrefix}: Venus traversing ${fromSign.name} (${fromSign.sanskritName}) toward ${toSign.name} (${toSign.sanskritName})`,
        meaning: `Significator of harmony, partnerships, and resources transitions into ${toSign.name}. Influences bilateral relationships and agreement terms.`,
        mandate: `Maintain equitable terms in contracts and partnerships. Uphold quality and mutual respect in collaborations.`,
        restraints: `Avoid conflict-avoidant compromises that compromise technical integrity. Guard against impulsive expenditures.`,
      };

    case 'moon':
      return {
        shiftDescription: `${motionPrefix}: Moon traversing ${fromSign.name} (${fromSign.sanskritName}) toward ${toSign.name} (${toSign.sanskritName})`,
        meaning: `2.25-day lunar transit shifting mental focus and emotional pacing through ${fromSign.element} modality.`,
        mandate: `Observe daily cognitive rhythm and maintain consistent rest and dietary discipline.`,
        restraints: `Avoid making irreversible long-term commitments during late-night mental fatigue.`,
      };

    case 'rahu':
      return {
        shiftDescription: `Retrograde motion: Mean Rahu traversing ${fromSign.name} (${fromSign.sanskritName}) backward toward ${toSign.name} (${toSign.sanskritName})`,
        meaning: `Nodal retrograde transit. Highlights areas of intense focus, ambition, and unfamiliar territory in the transit house.`,
        mandate: `Approach novel tools and domains with thorough verification and clear risk boundaries.`,
        restraints: `Do not chase speculative bubbles, unproven shortcuts, or obscure commitments.`,
      };

    case 'ketu':
      return {
        shiftDescription: `Retrograde motion: Mean Ketu traversing ${fromSign.name} (${fromSign.sanskritName}) backward toward ${toSign.name} (${toSign.sanskritName})`,
        meaning: `Nodal retrograde transit. Indicates streamlining, detachment, and resolving accumulated obligations in the transit house.`,
        mandate: `Streamline workflows, eliminate redundant processes, and prioritize focused, substantive work.`,
        restraints: `Avoid abrupt neglect of necessary responsibilities out of detachment or apathy.`,
      };

    default:
      return {
        shiftDescription: `${motionPrefix}: ${fromSign.name} toward ${toSign.name}`,
        meaning: `Astronomical sign transit. Effects are evaluated based on house position relative to natal lagna.`,
        mandate: `Observe systemic trends and maintain disciplined operational procedures.`,
        restraints: `Avoid short-sighted reactions; maintain a multi-cycle horizon.`,
      };
  }
}

/**
 * Calculates current transit ingress and exit dates for each planet.
 * Uses numerical forward and backward scanning with bisection root-finding
 * to locate exact sign boundary crossings, accurately accounting for retrograde
 * reversals, nodal backward progression, and planetary stations.
 */
export function calculateTransits(
  targetDate: Date,
  currentBodies: CelestialBody[]
): TransitEvent[] {
  const t0 = new Astronomy.AstroTime(targetDate);
  const events: TransitEvent[] = [];

  for (const body of currentBodies) {
    const currentSign = body.signIndex;

    // Fast-moving Moon uses 6-hour step; inner planets use 1-day step; slow planets use 2-day step
    const stepDays =
      body.key === 'moon' ? 0.25 : ['sun', 'mercury', 'venus'].includes(body.key) ? 1.0 : 2.0;
    const maxScanDays =
      body.key === 'moon'
        ? 5
        : body.key === 'sun'
        ? 35
        : ['mercury', 'venus', 'mars'].includes(body.key)
        ? 150
        : 1100;

    // 1. Scan forward to find the next sign boundary crossing (exit date and destination sign)
    let exitDateStr = '';
    let nextSign = (currentSign + 1) % 12;
    let daysRemaining = 30;

    for (let d = stepDays; d <= maxScanDays; d += stepDays) {
      const tCheck = t0.AddDays(d);
      const lonCheck = getSiderealLongitude(body.key, tCheck);
      const signCheck = Math.floor(lonCheck / 30);

      if (signCheck !== currentSign) {
        // Bisection root-finding between d - stepDays and d
        let low = d - stepDays;
        let high = d;
        for (let iter = 0; iter < 16; iter++) {
          const mid = (low + high) / 2;
          const sMid = Math.floor(getSiderealLongitude(body.key, t0.AddDays(mid)) / 30);
          if (sMid === currentSign) {
            low = mid;
          } else {
            high = mid;
          }
        }
        const exactExitTime = t0.AddDays((low + high) / 2);
        exitDateStr = exactExitTime.date.toISOString().split('T')[0];
        nextSign = signCheck;
        daysRemaining = Math.max(1, Math.round((exactExitTime.date.getTime() - targetDate.getTime()) / 86400000));
        break;
      }
    }

    // 2. Scan backward to find previous sign boundary crossing (entry date)
    let entryDateStr = '';
    for (let d = stepDays; d <= maxScanDays; d += stepDays) {
      const tCheck = t0.AddDays(-d);
      const lonCheck = getSiderealLongitude(body.key, tCheck);
      const signCheck = Math.floor(lonCheck / 30);

      if (signCheck !== currentSign) {
        let low = -d;
        let high = -(d - stepDays);
        for (let iter = 0; iter < 16; iter++) {
          const mid = (low + high) / 2;
          const sMid = Math.floor(getSiderealLongitude(body.key, t0.AddDays(mid)) / 30);
          if (sMid !== currentSign) {
            low = mid;
          } else {
            high = mid;
          }
        }
        const exactEntryTime = t0.AddDays((low + high) / 2);
        entryDateStr = exactEntryTime.date.toISOString().split('T')[0];
        break;
      }
    }

    // 3. Exact retrograde station window (for planets currently in retrograde motion)
    let retrogradeWindow: { startDate: string; endDate: string } | undefined = undefined;
    if (body.isRetrograde && body.key !== 'rahu' && body.key !== 'ketu') {
      // Find previous station (where speed crossed from positive to negative)
      let stationStartStr = '';
      for (let d = 1; d <= 90; d++) {
        const tPrev = t0.AddDays(-d);
        const tPrevNext = tPrev.AddDays(1 / 24.0);
        const l1 = getSiderealLongitude(body.key, tPrev);
        const l2 = getSiderealLongitude(body.key, tPrevNext);
        let speed = (l2 - l1) * 24.0;
        if (speed > 180) speed -= 360 * 24;
        if (speed < -180) speed += 360 * 24;
        if (speed >= 0) {
          stationStartStr = tPrev.date.toISOString().split('T')[0];
          break;
        }
      }

      // Find next station (where speed crosses from negative to positive)
      let stationEndStr = '';
      for (let d = 1; d <= 90; d++) {
        const tFwd = t0.AddDays(d);
        const tFwdNext = tFwd.AddDays(1 / 24.0);
        const l1 = getSiderealLongitude(body.key, tFwd);
        const l2 = getSiderealLongitude(body.key, tFwdNext);
        let speed = (l2 - l1) * 24.0;
        if (speed > 180) speed -= 360 * 24;
        if (speed < -180) speed += 360 * 24;
        if (speed >= 0) {
          stationEndStr = tFwd.date.toISOString().split('T')[0];
          break;
        }
      }

      if (stationStartStr && stationEndStr) {
        retrogradeWindow = {
          startDate: stationStartStr,
          endDate: stationEndStr,
        };
      }
    }

    const insights = generateTransitInsights(body.key, currentSign, nextSign, body.isRetrograde);

    events.push({
      planet: body.key,
      currentSign,
      entryDate: entryDateStr || new Date(targetDate.getTime() - 15 * 86400000).toISOString().split('T')[0],
      exitDate: exitDateStr || new Date(targetDate.getTime() + 15 * 86400000).toISOString().split('T')[0],
      nextSign,
      daysRemaining,
      shiftDescription: insights.shiftDescription,
      meaning: insights.meaning,
      mandate: insights.mandate,
      restraints: insights.restraints,
      retrogradeWindow,
    });
  }

  return events;
}
