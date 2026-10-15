import { BodyKey, CelestialBody, Dignity, ObserverLocation } from '@/types/astronomy';
import { calculateAllCelestialBodies } from '@/lib/astronomy/ephemeris';
import { calculateSkyAndHouses } from '@/lib/astronomy/houses';
import { calculateHarmonicDivision } from '@/lib/astronomy/vargas';
import { ZODIAC_SIGNS, NAKSHATRAS } from '@/lib/astronomy/constants';

export type CharaKarakaRank = 'AK' | 'AmK' | 'BK' | 'MK' | 'PK' | 'GK' | 'DK' | null;

export interface CharaKarakaInfo {
  rank: CharaKarakaRank;
  title: string;
  sanskritTitle: string;
  significance: string;
}

export interface NatalPlanetAnalysis {
  key: BodyKey;
  name: string;
  sanskritName: string;
  symbol: string;
  color: string;
  // Position
  longitudeSidereal: number;
  signIndex: number;
  signDegree: number;
  house: number;
  nakshatraIndex: number;
  nakshatraDegree: number;
  pada: number;
  dignity: Dignity;
  isRetrograde: boolean;
  isCombust: boolean;
  // Power & Rank
  powerPercentage: number; // 0 to 100%
  karaka: CharaKarakaInfo;
  // Divisional Charts
  d9SignIndex: number;
  isVargottama: boolean;
  d10SignIndex: number;
  d12SignIndex: number;
  d60SignIndex: number;
  // Functional Vedic Attributes
  housesRuled: number[];
  functionalNature: 'Benefic' | 'Malefic' | 'Neutral' | 'Yogakaraka';
  aspectsCastToHouses: number[];
  aspectsReceivedFrom: string[];
  // Deep Synthesis
  effectsAndYogas: string[];
  elaborateExplanation: string;
}

export interface NatalYoga {
  name: string;
  sanskritName: string;
  type: 'Raja' | 'Dhana' | 'Viparita' | 'Mahapurusha' | 'Solar/Lunar' | 'Special';
  planetsInvolved: BodyKey[];
  description: string;
  operationalEffect: string;
}

export interface NatalChartBlueprint {
  birthDate: string;
  location: ObserverLocation;
  lagnaSignIndex: number;
  lagnaDegree: number;
  moonSignIndex: number;
  moonNakshatraIndex: number;
  moonPada: number;
  sunSignIndex: number;
  atmakaraka: BodyKey;
  amatyakaraka: BodyKey;
  planets: NatalPlanetAnalysis[];
  yogas: NatalYoga[];
  overallChartStrength: number;
}

const KARAKA_DEFINITIONS: Record<Exclude<CharaKarakaRank, null>, { title: string; sanskritTitle: string; significance: string }> = {
  AK: {
    title: 'Soul Significator',
    sanskritTitle: 'Atmakaraka',
    significance: 'Primary governor of destiny, core executive intent, life mission, and inner sovereignty.',
  },
  AmK: {
    title: 'Career & Mind Significator',
    sanskritTitle: 'Amatyakaraka',
    significance: 'Prime driver of vocation, executive intellect, commercial strategies, and wealth accumulation.',
  },
  BK: {
    title: 'Courage & Mentorship',
    sanskritTitle: 'Bhratrukaraka',
    significance: 'Signifies advisors, elder allies, relentless initiative, and enterprise comrades.',
  },
  MK: {
    title: 'Foundation & Sanctuary',
    sanskritTitle: 'Matrukaraka',
    significance: 'Signifies emotional stability, fixed properties, domestic roots, and institutional foundation.',
  },
  PK: {
    title: 'Intellect & Innovation',
    sanskritTitle: 'Putrakaraka',
    significance: 'Signifies creative intelligence, strategic calculation, offspring, and high-stakes speculative decisions.',
  },
  GK: {
    title: 'Competitive Friction',
    sanskritTitle: 'Gnatikaraka',
    significance: 'Signifies operational friction, litigation, rivals, systemic hurdles, and endurance tests.',
  },
  DK: {
    title: 'Alliances & Contracts',
    sanskritTitle: 'Darakaraka',
    significance: 'Signifies primary business partners, marital spouse, commercial agreements, and external counterparties.',
  },
};

// Sign Rulers for house lordship calculation
const SIGN_RULERS: Record<number, BodyKey> = {
  0: 'mars',     // Aries
  1: 'venus',    // Taurus
  2: 'mercury',  // Gemini
  3: 'moon',     // Cancer
  4: 'sun',      // Leo
  5: 'mercury',  // Virgo
  6: 'venus',    // Libra
  7: 'mars',     // Scorpio
  8: 'jupiter',  // Sagittarius
  9: 'saturn',   // Capricorn
  10: 'saturn',  // Aquarius
  11: 'jupiter', // Pisces
};

/**
 * Calculates a complete Natal Chart Blueprint with Jaimini Karakas, divisional charts (D9, D10, D12, D60),
 * functional nature, dignities, power percentages, and classical Yogas.
 */
export function calculateNatalChartBlueprint(
  birthDate: Date,
  location: ObserverLocation
): NatalChartBlueprint {
  const { bodies: rawBodies } = calculateAllCelestialBodies(birthDate, location);
  const { sky, houseCusps, updatedBodies } = calculateSkyAndHouses(birthDate, location, rawBodies);

  const lagnaSignIndex = Math.floor(sky.ascendantDegree / 30);
  const lagnaDegree = sky.ascendantDegree % 30;

  // 1. Identify Jaimini Chara Karakas (Sort 7 classical planets by degrees inside sign)
  const classicalKeys: BodyKey[] = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const classicalBodies = updatedBodies
    .filter((b) => classicalKeys.includes(b.key))
    .sort((a, b) => b.signDegree - a.signDegree); // Highest degree first

  const karakaOrder: Exclude<CharaKarakaRank, null>[] = ['AK', 'AmK', 'BK', 'MK', 'PK', 'GK', 'DK'];
  const karakaMap = new Map<BodyKey, CharaKarakaRank>();

  classicalBodies.forEach((b, idx) => {
    if (idx < karakaOrder.length) {
      karakaMap.set(b.key, karakaOrder[idx]);
    }
  });

  // 2. Identify house rulerships for each planet based on Lagna sign
  const planetRulerships = new Map<BodyKey, number[]>();
  for (let house = 1; house <= 12; house++) {
    const signOfHouse = (lagnaSignIndex + (house - 1)) % 12;
    const ruler = SIGN_RULERS[signOfHouse];
    if (ruler) {
      const existing = planetRulerships.get(ruler) || [];
      existing.push(house);
      planetRulerships.set(ruler, existing);
    }
  }

  // 3. Process each planet
  const analyzedPlanets: NatalPlanetAnalysis[] = updatedBodies.map((body) => {
    const housesRuled = planetRulerships.get(body.key) || [];

    // Calculate D9 Navamsha, D10, D12, D60
    const d9 = calculateHarmonicDivision(body.longitudeSidereal, 'D9');
    const d10 = calculateHarmonicDivision(body.longitudeSidereal, 'D10');
    const d12 = calculateHarmonicDivision(body.longitudeSidereal, 'D12');
    const d60 = calculateHarmonicDivision(body.longitudeSidereal, 'D60');

    // Chara Karaka info
    const rank = karakaMap.get(body.key) || null;
    const karakaInfo: CharaKarakaInfo = rank
      ? {
          rank,
          title: KARAKA_DEFINITIONS[rank].title,
          sanskritTitle: KARAKA_DEFINITIONS[rank].sanskritTitle,
          significance: KARAKA_DEFINITIONS[rank].significance,
        }
      : {
          rank: null,
          title: 'Subtle Graha',
          sanskritTitle: 'Chaya/Outer Graha',
          significance: 'Shadow or outer generational catalyst.',
        };

    // Calculate Power Score (0-100%)
    let power = 50;
    if (body.dignity === 'exalted') power = 95;
    else if (body.dignity === 'moolatrikona') power = 85;
    else if (body.dignity === 'own') power = 78;
    else if (body.dignity === 'friend') power = 65;
    else if (body.dignity === 'neutral') power = 52;
    else if (body.dignity === 'enemy') power = 38;
    else if (body.dignity === 'debilitated') power = 20;

    // Divisional Vargottama boost (+12%)
    if (d9.isVargottama) power += 12;

    // Kendra / Trikona boost
    if ([1, 4, 7, 10].includes(body.house)) power += 6;
    if ([5, 9].includes(body.house)) power += 8;
    if (body.house === 11) power += 6;
    if ([6, 8, 12].includes(body.house)) {
      if (body.dignity !== 'exalted' && body.dignity !== 'own') power -= 8;
    }

    if (body.isRetrograde && body.key !== 'rahu' && body.key !== 'ketu') power += 8;
    if (body.isCombust) power -= 16;

    const powerPercentage = Math.max(10, Math.min(100, Math.round(power)));

    // Functional Nature calculation based on house rulerships
    let functionalNature: 'Benefic' | 'Malefic' | 'Neutral' | 'Yogakaraka' = 'Neutral';
    const isLordOfKendra = housesRuled.some((h) => [1, 4, 7, 10].includes(h));
    const isLordOfTrikona = housesRuled.some((h) => [1, 5, 9].includes(h));
    const isLordOfDusthana = housesRuled.some((h) => [6, 8, 12].includes(h));

    if (isLordOfKendra && isLordOfTrikona) {
      functionalNature = 'Yogakaraka';
    } else if (isLordOfTrikona) {
      functionalNature = 'Benefic';
    } else if (isLordOfDusthana && !isLordOfTrikona) {
      functionalNature = 'Malefic';
    } else {
      functionalNature = 'Neutral';
    }

    // Special Vedic Aspects Cast
    const aspectsCastToHouses: number[] = [];
    const h = body.house;
    // Every planet aspects 7th from itself
    aspectsCastToHouses.push(((h + 6 - 1) % 12) + 1);

    if (body.key === 'mars') {
      // Mars aspects 4th and 8th
      aspectsCastToHouses.push(((h + 3 - 1) % 12) + 1);
      aspectsCastToHouses.push(((h + 7 - 1) % 12) + 1);
    } else if (body.key === 'jupiter') {
      // Jupiter aspects 5th and 9th
      aspectsCastToHouses.push(((h + 4 - 1) % 12) + 1);
      aspectsCastToHouses.push(((h + 8 - 1) % 12) + 1);
    } else if (body.key === 'saturn') {
      // Saturn aspects 3rd and 10th
      aspectsCastToHouses.push(((h + 2 - 1) % 12) + 1);
      aspectsCastToHouses.push(((h + 9 - 1) % 12) + 1);
    } else if (body.key === 'rahu' || body.key === 'ketu') {
      // Rahu/Ketu aspect 5th and 9th
      aspectsCastToHouses.push(((h + 4 - 1) % 12) + 1);
      aspectsCastToHouses.push(((h + 8 - 1) % 12) + 1);
    }

    // Aspects received from other planets
    const aspectsReceivedFrom: string[] = [];
    for (const other of updatedBodies) {
      if (other.key === body.key) continue;
      const otherHouse = other.house;
      const dist = ((body.house - otherHouse + 12) % 12) + 1; // 1 to 12

      if (dist === 7) {
        aspectsReceivedFrom.push(`${other.name} (Direct 7th House Drishti)`);
      } else if (other.key === 'mars' && (dist === 4 || dist === 8)) {
        aspectsReceivedFrom.push(`${other.name} (Special ${dist}th House Drishti)`);
      } else if (other.key === 'jupiter' && (dist === 5 || dist === 9)) {
        aspectsReceivedFrom.push(`${other.name} (Benevolent ${dist}th House Drishti)`);
      } else if (other.key === 'saturn' && (dist === 3 || dist === 10)) {
        aspectsReceivedFrom.push(`${other.name} (Demanding ${dist}th House Drishti)`);
      }
    }

    // Effects & Yogas
    const effectsAndYogas: string[] = [];
    if (d9.isVargottama) {
      effectsAndYogas.push('Vargottama in D9 Navamsha: Imparts deep structural integrity and enduring results.');
    }
    if (functionalNature === 'Yogakaraka') {
      effectsAndYogas.push('Yogakaraka Authority: Single-handedly creates high status, prestige, and executive leadership.');
    }
    if (body.dignity === 'exalted') {
      effectsAndYogas.push(`Exalted Dignity: Exceptional operational purity and effortless execution in ${ZODIAC_SIGNS[body.signIndex].name}.`);
    } else if (body.dignity === 'debilitated') {
      effectsAndYogas.push(`Debilitation: Requires strategic compensation, partner reliance, and structured protocols.`);
    }

    const sign = ZODIAC_SIGNS[body.signIndex];
    const nak = NAKSHATRAS[body.nakshatraIndex];
    const d9Sign = ZODIAC_SIGNS[d9.signIndex];
    const d10Sign = ZODIAC_SIGNS[d10.signIndex];

    // Build structured elaborate explanation
    const elaborateExplanation = `${body.name} (${body.sanskritName}) resides in House ${body.house} in ${sign.name} (${sign.sanskritName}) at ${body.signDegree.toFixed(2)}°, occupying ${nak.name} Nakshatra (Pada ${body.pada}).
- Power Score: ${powerPercentage}% (${body.dignity.toUpperCase()}${body.isRetrograde ? ', RETROGRADE ℞' : ''}${body.isCombust ? ', COMBUST' : ''}).
- Jaimini Rank: ${karakaInfo.rank ? `${karakaInfo.rank} (${karakaInfo.title})` : 'Non-Chara Graha'}. ${karakaInfo.significance}
- Divisional Blueprint: D9 Navamsha in ${d9Sign.name}${d9.isVargottama ? ' [VARGOTTAMA]' : ''}; D10 Dashamsha (Career) in ${d10Sign.name}.
- House Authority: Rules House(s) ${housesRuled.join(', ') || 'None'}; Functional ${functionalNature}.
- Vedic Drishti: Casts rays upon House(s) ${aspectsCastToHouses.join(', ')}. Receives aspect from: ${aspectsReceivedFrom.length ? aspectsReceivedFrom.join('; ') : 'None'}.`;

    return {
      key: body.key,
      name: body.name,
      sanskritName: body.sanskritName,
      symbol: body.symbol,
      color: body.color,
      longitudeSidereal: body.longitudeSidereal,
      signIndex: body.signIndex,
      signDegree: body.signDegree,
      house: body.house,
      nakshatraIndex: body.nakshatraIndex,
      nakshatraDegree: body.nakshatraDegree,
      pada: body.pada,
      dignity: body.dignity,
      isRetrograde: body.isRetrograde,
      isCombust: body.isCombust,
      powerPercentage,
      karaka: karakaInfo,
      d9SignIndex: d9.signIndex,
      isVargottama: d9.isVargottama,
      d10SignIndex: d10.signIndex,
      d12SignIndex: d12.signIndex,
      d60SignIndex: d60.signIndex,
      housesRuled,
      functionalNature,
      aspectsCastToHouses,
      aspectsReceivedFrom,
      effectsAndYogas,
      elaborateExplanation,
    };
  });

  // 4. Detect prominent Yogas across the entire chart
  const yogas: NatalYoga[] = [];

  const sun = analyzedPlanets.find((p) => p.key === 'sun');
  const mercury = analyzedPlanets.find((p) => p.key === 'mercury');
  const moon = analyzedPlanets.find((p) => p.key === 'moon');
  const jupiter = analyzedPlanets.find((p) => p.key === 'jupiter');
  const mars = analyzedPlanets.find((p) => p.key === 'mars');
  const venus = analyzedPlanets.find((p) => p.key === 'venus');
  const saturn = analyzedPlanets.find((p) => p.key === 'saturn');

  // Budhaditya Yoga (Sun + Mercury in same house)
  if (sun && mercury && sun.house === mercury.house) {
    yogas.push({
      name: 'Budhaditya Yoga',
      sanskritName: 'Budha-Aditya Yoga',
      type: 'Solar/Lunar',
      planetsInvolved: ['sun', 'mercury'],
      description: `Sun and Mercury conjoined in House ${sun.house}.`,
      operationalEffect: 'Sharp analytical faculties, commercial acumen, administrative clarity, and quick grasping power.',
    });
  }

  // Gaja Kesari Yoga (Jupiter in Kendra 1, 4, 7, 10 from Moon)
  if (moon && jupiter) {
    const distFromMoon = ((jupiter.house - moon.house + 12) % 12) + 1;
    if ([1, 4, 7, 10].includes(distFromMoon)) {
      yogas.push({
        name: 'Gaja Kesari Yoga',
        sanskritName: 'Gaja-Kesari Yoga',
        type: 'Raja',
        planetsInvolved: ['moon', 'jupiter'],
        description: `Jupiter in House ${jupiter.house} is in Kendra (${distFromMoon}th) from Moon in House ${moon.house}.`,
        operationalEffect: 'Unshakeable reputation, strategic wisdom, institutional respect, and enduring moral integrity.',
      });
    }
  }

  // Pancha Mahapurusha Yogas (Mars Ruchaka, Mercury Bhadra, Jupiter Hamsa, Venus Malavya, Saturn Shasha in Kendra in Own/Exalted)
  const checkMahapurusha = (
    planet: NatalPlanetAnalysis | undefined,
    name: string,
    sanskrit: string
  ) => {
    if (!planet) return;
    if ([1, 4, 7, 10].includes(planet.house) && (planet.dignity === 'exalted' || planet.dignity === 'own')) {
      yogas.push({
        name: `${name} Yoga`,
        sanskritName: sanskrit,
        type: 'Mahapurusha',
        planetsInvolved: [planet.key],
        description: `${planet.name} in House ${planet.house} in ${planet.dignity} dignity within a foundational Kendra.`,
        operationalEffect: `Archetypal mastery in ${planet.name}'s domain: high executive command, unwavering focus, and authority.`,
      });
    }
  };

  checkMahapurusha(mars, 'Ruchaka', 'Ruchaka Mahapurusha Yoga');
  checkMahapurusha(mercury, 'Bhadra', 'Bhadra Mahapurusha Yoga');
  checkMahapurusha(jupiter, 'Hamsa', 'Hamsa Mahapurusha Yoga');
  checkMahapurusha(venus, 'Malavya', 'Malavya Mahapurusha Yoga');
  checkMahapurusha(saturn, 'Shasha', 'Shasha Mahapurusha Yoga');

  // Raja Yoga (Lord of Kendra + Lord of Trikona conjunction)
  for (const p1 of analyzedPlanets) {
    for (const p2 of analyzedPlanets) {
      if (p1.key >= p2.key) continue;
      const p1HasKendra = p1.housesRuled.some((h) => [1, 4, 7, 10].includes(h));
      const p1HasTrikona = p1.housesRuled.some((h) => [1, 5, 9].includes(h));
      const p2HasKendra = p2.housesRuled.some((h) => [1, 4, 7, 10].includes(h));
      const p2HasTrikona = p2.housesRuled.some((h) => [1, 5, 9].includes(h));

      if (
        (p1HasKendra && p2HasTrikona) ||
        (p1HasTrikona && p2HasKendra)
      ) {
        if (p1.house === p2.house) {
          yogas.push({
            name: 'Kendra-Trikona Raja Yoga',
            sanskritName: 'Dharma-Karmadhipati Raja Yoga',
            type: 'Raja',
            planetsInvolved: [p1.key, p2.key],
            description: `Kendra lord ${p1.name} and Trikona lord ${p2.name} conjoined in House ${p1.house}.`,
            operationalEffect: 'High professional stature, executive authority, prosperity, and institutional elevation.',
          });
        }
      }
    }
  }

  // Viparita Raja Yoga (Harsha, Sarala, Vimala: Lord of 6, 8, 12 in 6, 8, 12)
  for (const p of analyzedPlanets) {
    const isDusthanaLord = p.housesRuled.some((h) => [6, 8, 12].includes(h));
    const isDusthanaPlacement = [6, 8, 12].includes(p.house);
    if (isDusthanaLord && isDusthanaPlacement && !p.housesRuled.some((h) => [1, 5, 9].includes(h))) {
      yogas.push({
        name: 'Viparita Raja Yoga',
        sanskritName: 'Viparita Raja Yoga',
        type: 'Viparita',
        planetsInvolved: [p.key],
        description: `Dusthana lord ${p.name} placed in House ${p.house} (Dusthana).`,
        operationalEffect: 'Triumph over adversaries, sudden breakthrough out of crisis, and gains emerging through friction.',
      });
    }
  }

  // Chart Strength
  const avgPower =
    analyzedPlanets.reduce((acc, p) => acc + p.powerPercentage, 0) /
    (analyzedPlanets.length || 1);

  return {
    birthDate: birthDate.toISOString(),
    location,
    lagnaSignIndex,
    lagnaDegree,
    moonSignIndex: moon?.signIndex ?? 0,
    moonNakshatraIndex: moon?.nakshatraIndex ?? 0,
    moonPada: moon?.pada ?? 1,
    sunSignIndex: sun?.signIndex ?? 0,
    atmakaraka: classicalBodies[0]?.key ?? 'sun',
    amatyakaraka: classicalBodies[1]?.key ?? 'moon',
    planets: analyzedPlanets,
    yogas,
    overallChartStrength: Math.round(avgPower),
  };
}
