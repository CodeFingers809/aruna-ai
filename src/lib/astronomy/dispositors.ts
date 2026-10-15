import { BodyKey, CelestialBody, ZodiacSign, Nakshatra, Aspect } from '@/types/astronomy';
import { ZODIAC_SIGNS, NAKSHATRAS, CELESTIAL_BODY_CONFIG } from './constants';

export interface SignDetail {
  sign: ZodiacSign;
  lord: CelestialBody;
  lordHouse: number;
  lordSign: ZodiacSign;
  lordDegree: number;
  dispositorMeaning: string;
  exaltedPlanet?: { name: string; degree: number };
  debilitatedPlanet?: { name: string; degree: number };
  friendlyPlanets: string[];
  enemyPlanets: string[];
  residentBodies: CelestialBody[];
}

export interface HouseDetail {
  houseNumber: number;
  domain: string;
  classification: string;
  cuspDegree: number;
  cuspSign: ZodiacSign;
  lord: CelestialBody;
  lordHouse: number;
  lordSign: ZodiacSign;
  lordDegree: number;
  placementMeaning: string;
  karaka: string;
  residentBodies: CelestialBody[];
}

export interface NakshatraDetail {
  nakshatra: Nakshatra;
  lord: CelestialBody;
  lordHouse: number;
  lordSign: ZodiacSign;
  lordDegree: number;
  placementMeaning: string;
  deity: string;
  symbol: string;
  residentBodies: CelestialBody[];
}

const HOUSE_DOMAINS: Record<number, { domain: string; classification: string; karaka: string }> = {
  1: { domain: 'Self, Executive Sovereignty, Physical Vitality, Identity', classification: 'Kendra & Trikona', karaka: 'Sun (Surya)' },
  2: { domain: 'Liquid Capital, Speech, Family Lineage, Value Reserves', classification: 'Maraka & Artha', karaka: 'Jupiter (Guru)' },
  3: { domain: 'Courage, Technical Skills, Peer Collaboration, Initiative', classification: 'Upachaya (Grows with Effort)', karaka: 'Mars (Mangala)' },
  4: { domain: 'Home, Emotional Sanctuary, Property, Internal Foundations', classification: 'Kendra', karaka: 'Moon & Venus' },
  5: { domain: 'Strategic Intellect, Creative Offspring, Ancient Merits, Speculation', classification: 'Trikona', karaka: 'Jupiter (Guru)' },
  6: { domain: 'Operational Problem-Solving, Health, Debt Liquidation, Defense', classification: 'Dusthana & Upachaya', karaka: 'Mars & Saturn' },
  7: { domain: 'Bilateral Partnerships, Contracts, Public Diplomacy, Alliances', classification: 'Kendra & Maraka', karaka: 'Venus (Shukra)' },
  8: { domain: 'Deep Transformations, Crisis Audits, Unearned Capital, Secrets', classification: 'Dusthana & Moksha', karaka: 'Saturn (Shani)' },
  9: { domain: 'Dharma, Higher Wisdom, Long-Range Strategy, Mentors, International Reach', classification: 'Trikona', karaka: 'Jupiter & Sun' },
  10: { domain: 'Career Authority, Institutional Leadership, Public Work, Relentless Duty', classification: 'Kendra & Upachaya', karaka: 'Sun, Saturn, Mercury' },
  11: { domain: 'Compound Gains, Expansive Networks, Strategic Alliances, Cash Flow', classification: 'Upachaya & Labha', karaka: 'Jupiter (Guru)' },
  12: { domain: 'Solitude, Radical Decluttering, Foreign Lands, Deep Subconscious Rest', classification: 'Dusthana & Moksha', karaka: 'Saturn & Ketu' },
};

const SIGN_DIGNITIES: Record<
  number,
  {
    exalted?: { name: string; degree: number };
    debilitated?: { name: string; degree: number };
    friends: string[];
    enemies: string[];
  }
> = {
  0: { exalted: { name: 'Sun', degree: 10 }, debilitated: { name: 'Saturn', degree: 20 }, friends: ['Jupiter', 'Sun', 'Moon'], enemies: ['Mercury', 'Venus'] }, // Aries
  1: { exalted: { name: 'Moon', degree: 3 }, debilitated: { name: 'Ketu', degree: 20 }, friends: ['Mercury', 'Saturn'], enemies: ['Sun', 'Moon', 'Jupiter'] }, // Taurus
  2: { friends: ['Venus', 'Saturn'], enemies: ['Sun', 'Mars'] }, // Gemini
  3: { exalted: { name: 'Jupiter', degree: 5 }, debilitated: { name: 'Mars', degree: 28 }, friends: ['Sun', 'Mars'], enemies: ['Venus', 'Mercury'] }, // Cancer
  4: { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Saturn', 'Venus'] }, // Leo
  5: { exalted: { name: 'Mercury', degree: 15 }, debilitated: { name: 'Venus', degree: 27 }, friends: ['Venus', 'Saturn'], enemies: ['Moon', 'Mars'] }, // Virgo
  6: { exalted: { name: 'Saturn', degree: 20 }, debilitated: { name: 'Sun', degree: 10 }, friends: ['Mercury', 'Saturn'], enemies: ['Sun', 'Moon'] }, // Libra
  7: { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury', 'Venus'] }, // Scorpio
  8: { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'] }, // Sagittarius
  9: { exalted: { name: 'Mars', degree: 28 }, debilitated: { name: 'Jupiter', degree: 5 }, friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon'] }, // Capricorn
  10: { friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'] }, // Aquarius
  11: { exalted: { name: 'Venus', degree: 27 }, debilitated: { name: 'Mercury', degree: 15 }, friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'] }, // Pisces
};

export function getSignDetail(
  signIndex: number,
  allBodies: CelestialBody[]
): SignDetail {
  const sign = ZODIAC_SIGNS[signIndex];
  const lordKey = sign.ruler;
  const lord = allBodies.find((b) => b.key === lordKey) || allBodies[0];
  const lordSign = ZODIAC_SIGNS[lord.signIndex];
  const dignities = SIGN_DIGNITIES[signIndex] || { friends: [], enemies: [] };
  const residentBodies = allBodies.filter((b) => b.signIndex === signIndex);
  const houseDomain = HOUSE_DOMAINS[lord.house]?.domain || 'Life Arena';

  const dispositorMeaning = `The ruler of ${sign.name} (${lord.name}) resides in House ${lord.house} (${lordSign.name} at ${lord.signDegree.toFixed(1)}°). The foundational drive of ${sign.name} (${sign.element} / ${sign.modality}) is actively focused into ${houseDomain}. Operational output in this realm directly shapes the integrity of ${sign.name}.`;

  return {
    sign,
    lord,
    lordHouse: lord.house,
    lordSign,
    lordDegree: lord.signDegree,
    dispositorMeaning,
    exaltedPlanet: dignities.exalted,
    debilitatedPlanet: dignities.debilitated,
    friendlyPlanets: dignities.friends,
    enemyPlanets: dignities.enemies,
    residentBodies,
  };
}

export function getHouseDetail(
  houseNumber: number,
  ascendantDegree: number,
  allBodies: CelestialBody[]
): HouseDetail {
  const cuspDeg = (ascendantDegree + (houseNumber - 1) * 30 + 360) % 360;
  const cuspSignIndex = Math.floor(cuspDeg / 30);
  const cuspSign = ZODIAC_SIGNS[cuspSignIndex];
  const meta = HOUSE_DOMAINS[houseNumber] || {
    domain: 'General Domain',
    classification: 'Neutral',
    karaka: 'Sun',
  };

  const lordKey = cuspSign.ruler;
  const lord = allBodies.find((b) => b.key === lordKey) || allBodies[0];
  const lordSign = ZODIAC_SIGNS[lord.signIndex];
  const targetHouseMeta = HOUSE_DOMAINS[lord.house]?.domain || 'Life Arena';
  const residentBodies = allBodies.filter((b) => b.house === houseNumber);

  const placementMeaning = `Lord of House ${houseNumber} (${lord.name}) is transiting House ${lord.house} (${lordSign.name}). This directly bridges ${meta.domain} with ${targetHouseMeta}. Initiatives launched in House ${houseNumber} will bear fruit through the discipline and operational systems of House ${lord.house}.`;

  return {
    houseNumber,
    domain: meta.domain,
    classification: meta.classification,
    cuspDegree: cuspDeg,
    cuspSign,
    lord,
    lordHouse: lord.house,
    lordSign,
    lordDegree: lord.signDegree,
    placementMeaning,
    karaka: meta.karaka,
    residentBodies,
  };
}

export function getNakshatraDetail(
  nakshatraIndex: number,
  allBodies: CelestialBody[]
): NakshatraDetail {
  const nak = NAKSHATRAS[nakshatraIndex];
  const lordKey = nak.lord;
  const lord = allBodies.find((b) => b.key === lordKey) || allBodies[0];
  const lordSign = ZODIAC_SIGNS[lord.signIndex];
  const residentBodies = allBodies.filter((b) => b.nakshatraIndex === nakshatraIndex);
  const houseDomain = HOUSE_DOMAINS[lord.house]?.domain || 'Life Arena';

  const placementMeaning = `The Lord of ${nak.name} (${lord.name}) is situated in House ${lord.house} (${lordSign.name}). The cosmic archetype governed by ${nak.deity} expresses through ${lord.name}'s current position, directing intuitive impulse into ${houseDomain}.`;

  return {
    nakshatra: nak,
    lord,
    lordHouse: lord.house,
    lordSign,
    lordDegree: lord.signDegree,
    placementMeaning,
    deity: nak.deity,
    symbol: nak.symbol,
    residentBodies,
  };
}

/**
 * Generates an in-depth tactical synthesis for any aspect chord between two bodies.
 */
export function getAspectSynthesis(
  aspect: Aspect,
  b1: CelestialBody,
  b2: CelestialBody
): string {
  const p1 = b1.key;
  const p2 = b2.key;
  const type = aspect.type;

  // Key combinations
  if ((p1 === 'sun' && p2 === 'saturn') || (p1 === 'saturn' && p2 === 'sun')) {
    if (type === 'conjunction') return 'Sovereign Will meets Institutional Reality: High pressure to formalize duties. Eliminate all administrative slack and superficial ego.';
    if (type === 'opposition') return 'Polarity between Sovereign Autonomy and Heavy Duty: Structural friction between immediate desires and institutional obligations. Patience required.';
    if (type === 'square') return 'Dynamic Crisis of Compliance: Urgent requirement to upgrade procedural standards before external oversight forces an audit.';
    return 'Constructive Duty: Systematic endurance and sovereign responsibility aligned in long-term rhythm.';
  }

  if ((p1 === 'sun' && p2 === 'jupiter') || (p1 === 'jupiter' && p2 === 'sun')) {
    return 'Dharmic Expansion & Executive Favor: Harmonious alignment of purpose and wisdom. Optimal window for leadership, consulting mentors, and strategic expansion.';
  }

  if ((p1 === 'mars' && p2 === 'saturn') || (p1 === 'saturn' && p2 === 'mars')) {
    if (type === 'square' || type === 'opposition') return 'Frictional Resistance (Accelerator meets Brakes): Intense drive meets stubborn institutional walls. Do not force outcomes with anger; channel force into rigorous system refinement.';
    return 'Controlled Power: Sustained mechanical drive with high precision and deliberate discipline.';
  }

  if ((p1 === 'mercury' && p2 === 'jupiter') || (p1 === 'jupiter' && p2 === 'mercury')) {
    return 'Strategic Intellect & Macro Vision: Detail accuracy merges with philosophical breadth. Exceptional for formal agreements, legal filings, and high-value trade negotiations.';
  }

  if ((p1 === 'moon' && p2 === 'mars') || (p1 === 'mars' && p2 === 'moon')) {
    return 'Dynamic Commercial Drive (Chandra-Mangala): Rapid decisive action and strong passion. Guard against emotional reactivity or hasty financial commitments.';
  }

  if ((p1 === 'moon' && p2 === 'saturn') || (p1 === 'saturn' && p2 === 'moon')) {
    return 'Emotional Stoicism & Realism: Mind is sober and focused on duty. Superb for solitary deep work and decluttering; guard against transient pessimism.';
  }

  if ((p1 === 'venus' && p2 === 'jupiter') || (p1 === 'jupiter' && p2 === 'venus')) {
    return 'Allied Harmony & Strategic Wealth: Highest cooperative alignment. Fosters diplomatic breakthroughs, aesthetic polish, and win-win contract negotiations.';
  }

  // Generic fallback based on aspect type
  if (type === 'trine' || type === 'sextile') {
    return `Harmonious Cooperative Flow: Seamless resonance between ${b1.name} and ${b2.name}. Energy moves with natural momentum and low friction.`;
  }
  if (type === 'square') {
    return `Frictional Tension: Demands decisive adjustments and active problem-solving between ${b1.name} and ${b2.name}. Friction creates breakthroughs when met with procedural rigor.`;
  }
  if (type === 'opposition') {
    return `Polarity Awareness: Bilateral negotiation required between the archetypes of ${b1.name} and ${b2.name}. Balance internal needs with partner accountability.`;
  }
  if (type === 'conjunction') {
    return `Fused Concentration: Intense fusion of energies. Heightens both strengths and vulnerabilities; demands clear boundaries.`;
  }
  if (type === 'drishti') {
    return `Vedic Oversight: Gaze commanding long-term accountability and structural consequence.`;
  }

  return 'Active celestial aspect chord modifying baseline planetary expression.';
}

export interface IncomingAspectRay {
  castingBody: CelestialBody;
  aspectType: string;
  effect: string;
}

/**
 * Calculates all classical Parashari Drishti (aspect rays) cast onto a specific zodiac sign.
 */
export function getAspectsCastingOnSign(
  targetSignIndex: number,
  allBodies: CelestialBody[]
): IncomingAspectRay[] {
  const rays: IncomingAspectRay[] = [];

  for (const b of allBodies) {
    if (b.signIndex === targetSignIndex) continue; // Same sign is conjunction, not aspect
    const diff = (targetSignIndex - b.signIndex + 12) % 12; // Signs ahead (0 to 11)

    // 7th House Aspect (6 signs ahead = 7th house in 1-based index)
    if (diff === 6) {
      rays.push({
        castingBody: b,
        aspectType: '7th Full Opposition Drishti (180°)',
        effect: `Direct bilateral gaze from ${b.name}. Projects ${b.name}'s core drives into this sign's life arena.`,
      });
    }

    // Mars special aspects (4th and 8th)
    if (b.key === 'mars') {
      if (diff === 3) {
        rays.push({
          castingBody: b,
          aspectType: 'Mars 4th Chaturtha Drishti',
          effect: 'Dynamic protective shield and urgent impetus to fortify foundational structures.',
        });
      } else if (diff === 7) {
        rays.push({
          castingBody: b,
          aspectType: 'Mars 8th Ashta Drishti',
          effect: 'Subterranean penetrating gaze; triggers sudden transformative audits and urgency.',
        });
      }
    }

    // Jupiter special aspects (5th and 9th)
    if (b.key === 'jupiter') {
      if (diff === 4) {
        rays.push({
          castingBody: b,
          aspectType: 'Jupiter 5th Panchama Drishti (Trinal Grace)',
          effect: 'Dharmic benevolence, wisdom expansion, and creative protection over this sign.',
        });
      } else if (diff === 8) {
        rays.push({
          castingBody: b,
          aspectType: 'Jupiter 9th Navama Drishti (Supreme Fortune)',
          effect: 'Highest auspicious blessing; purifies afflictions and opens mentors or ethical clarity.',
        });
      }
    }

    // Saturn special aspects (3rd and 10th)
    if (b.key === 'saturn') {
      if (diff === 2) {
        rays.push({
          castingBody: b,
          aspectType: 'Saturn 3rd Tritiya Drishti',
          effect: 'Demands disciplined effort, patience, and persistent technical craftsmanship.',
        });
      } else if (diff === 9) {
        rays.push({
          castingBody: b,
          aspectType: 'Saturn 10th Dashama Drishti (Karmic Duty)',
          effect: 'Imposes heavy organizational accountability, institutional scrutiny, and austere duty.',
        });
      }
    }

    // Rahu & Ketu special aspects (5th and 9th)
    if (b.key === 'rahu' || b.key === 'ketu') {
      if (diff === 4 || diff === 8) {
        rays.push({
          castingBody: b,
          aspectType: `${b.name} Trinal Shadow Drishti`,
          effect: `Injects unconventional ambition, karmic intensity, and sudden catalytic shifts.`,
        });
      }
    }
  }

  return rays;
}

/**
 * Calculates classical Parashari Drishti cast onto a specific Nakshatra arc.
 */
export function getAspectsCastingOnNakshatra(
  targetNakIndex: number,
  allBodies: CelestialBody[]
): IncomingAspectRay[] {
  const nak = NAKSHATRAS[targetNakIndex];
  const midDeg = (nak.startDegree + nak.endDegree) / 2;
  const targetSign = Math.floor(midDeg / 30);
  return getAspectsCastingOnSign(targetSign, allBodies);
}

