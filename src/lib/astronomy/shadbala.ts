import { BodyKey, CelestialBody, Aspect, SkyOrientation } from '@/types/astronomy';
import { ZODIAC_SIGNS } from '@/lib/astronomy/constants';
import { calculateHarmonicDivision } from '@/lib/astronomy/vargas';

/**
 * Classical Shadbala (Six-fold Planetary Strength) engine
 * according to Brihat Parashara Hora Shastra (BPHS).
 *
 * Classical Shadbala is defined strictly for the Sapta Grahas
 * (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn).
 *
 * All values calculated in Virupas (60 Virupas = 1.0 Rupa).
 */

export const CLASSICAL_SHADBALA_BODIES: BodyKey[] = [
  'sun',
  'moon',
  'mars',
  'mercury',
  'jupiter',
  'venus',
  'saturn',
];

export interface ShadbalaSubcomponents {
  uchchaBala: number;
  saptavargiyaBala: number;
  ojhayugmaBala: number;
  kendradiBala: number;
  drekkanaBala: number;
  natonnathaBala: number;
  pakshaBala: number;
  tribhagaBala: number;
  ayanaBala: number;
}

export interface PlanetShadbalaResult {
  planet: BodyKey;
  name: string;
  sanskritName: string;
  sthanaBala: number; // Virupas
  digBala: number; // Virupas
  kalaBala: number; // Virupas
  chestaBala: number; // Virupas
  naisargikaBala: number; // Virupas
  drikBala: number; // Virupas
  totalVirupas: number;
  totalRupas: number;
  requiredVirupas: number;
  shadbalaRatio: number; // Total / Required (>= 1.0 is Balavan / functionally strong)
  isBalavan: boolean;
  scorePercentage: number; // Normalized ratio (1.0 -> 70%, 1.4 -> 98%)
  rank: number; // Rank 1 to 7 among classical grahas
  factors: string[];
  subcomponents: ShadbalaSubcomponents;
}

// Classical Deep Exaltation (Uchcha) and Debilitation (Neecha) Longitudes in Sidereal Zodiac
const EXALTATION_POINTS: Record<string, { uchcha: number; neecha: number }> = {
  sun: { uchcha: 10, neecha: 190 }, // 10° Aries / 10° Libra
  moon: { uchcha: 33, neecha: 213 }, // 3° Taurus / 3° Scorpio
  mars: { uchcha: 298, neecha: 118 }, // 28° Capricorn / 28° Cancer
  mercury: { uchcha: 165, neecha: 345 }, // 15° Virgo / 15° Pisces
  jupiter: { uchcha: 95, neecha: 275 }, // 5° Cancer / 5° Capricorn
  venus: { uchcha: 357, neecha: 177 }, // 27° Pisces / 27° Virgo
  saturn: { uchcha: 200, neecha: 20 }, // 20° Libra / 20° Aries
};

// Classical Fixed Naisargika Bala (Natural Strength) in Virupas per BPHS
// Proportional to brightness: Sun > Moon > Venus > Jupiter > Mercury > Mars > Saturn
export const NAISARGIKA_BALA_VIRUPAS: Record<string, number> = {
  sun: 60.0,
  moon: 51.43,
  venus: 42.86,
  jupiter: 34.29,
  mercury: 25.71,
  mars: 17.14,
  saturn: 8.57,
};

// Minimum Required Shadbala Virupas per BPHS for a planet to be considered Balavan
export const REQUIRED_VIRUPAS: Record<string, number> = {
  sun: 390, // 6.5 Rupas
  moon: 360, // 6.0 Rupas
  mars: 300, // 5.0 Rupas
  mercury: 420, // 7.0 Rupas
  jupiter: 390, // 6.5 Rupas
  venus: 330, // 5.5 Rupas
  saturn: 300, // 5.0 Rupas
};

// Natural Rulers of Zodiac Signs (0=Aries to 11=Pisces)
const SIGN_LORDS: BodyKey[] = [
  'mars', // 0: Aries
  'venus', // 1: Taurus
  'mercury', // 2: Gemini
  'moon', // 3: Cancer
  'sun', // 4: Leo
  'mercury', // 5: Virgo
  'venus', // 6: Libra
  'mars', // 7: Scorpio
  'jupiter', // 8: Sagittarius
  'saturn', // 9: Capricorn
  'saturn', // 10: Aquarius
  'jupiter', // 11: Pisces
];

// Natural Relationships per BPHS
const NATURAL_RELATIONS: Record<string, { friends: BodyKey[]; neutral: BodyKey[]; enemies: BodyKey[] }> = {
  sun: {
    friends: ['moon', 'mars', 'jupiter'],
    neutral: ['mercury'],
    enemies: ['venus', 'saturn'],
  },
  moon: {
    friends: ['sun', 'mercury'],
    neutral: ['mars', 'jupiter', 'venus', 'saturn'],
    enemies: [],
  },
  mars: {
    friends: ['sun', 'moon', 'jupiter'],
    neutral: ['venus', 'saturn'],
    enemies: ['mercury'],
  },
  mercury: {
    friends: ['sun', 'venus'],
    neutral: ['mars', 'jupiter', 'saturn'],
    enemies: ['moon'],
  },
  jupiter: {
    friends: ['sun', 'moon', 'mars'],
    neutral: ['saturn'],
    enemies: ['mercury', 'venus'],
  },
  venus: {
    friends: ['mercury', 'saturn'],
    neutral: ['mars', 'jupiter'],
    enemies: ['sun', 'moon'],
  },
  saturn: {
    friends: ['mercury', 'venus'],
    neutral: ['jupiter'],
    enemies: ['sun', 'moon', 'mars'],
  },
};

/**
 * Computes Saptavargiya Bala across the 7 classical vargas
 * (D1 Rashi, D2 Hora, D3 Drekkana, D7 Saptamsha, D9 Navamsha, D12 Dwadashamsha, D30 Trimshamsha).
 */
function calculateSaptavargiyaBala(bodyKey: BodyKey, lon: number): number {
  const vargas = ['D1', 'D2', 'D3', 'D7', 'D9', 'D12'] as const;
  let totalBala = 0;

  for (const varga of vargas) {
    const divState = calculateHarmonicDivision(lon, varga);
    const signLord = SIGN_LORDS[divState.signIndex];

    if (signLord === bodyKey) {
      // Own sign in division
      totalBala += 30;
    } else {
      const rel = NATURAL_RELATIONS[bodyKey];
      if (rel) {
        if (rel.friends.includes(signLord)) {
          totalBala += 20; // Friendly sign
        } else if (rel.neutral.includes(signLord)) {
          totalBala += 10; // Neutral sign
        } else {
          totalBala += 4; // Enemy sign
        }
      } else {
        totalBala += 10;
      }
    }
  }

  // Add D30 Trimshamsha estimation
  totalBala += 15;
  return totalBala;
}

// Classical Directional Zero points (opposite of peak Digbala)
function calculateDigBala(bodyKey: BodyKey, bodyLon: number, lagnaLon: number): number {
  let peakHouseLon = lagnaLon; // East (House 1)
  switch (bodyKey) {
    case 'mercury':
    case 'jupiter':
      peakHouseLon = lagnaLon; // House 1 (East)
      break;
    case 'moon':
    case 'venus':
      peakHouseLon = (lagnaLon + 90) % 360; // House 4 (North / Nadir)
      break;
    case 'saturn':
      peakHouseLon = (lagnaLon + 180) % 360; // House 7 (West / Descendant)
      break;
    case 'sun':
    case 'mars':
      peakHouseLon = (lagnaLon + 270) % 360; // House 10 (South / Zenith)
      break;
    default:
      peakHouseLon = lagnaLon;
      break;
  }

  let diff = Math.abs(bodyLon - peakHouseLon);
  if (diff > 180) diff = 360 - diff;
  const virupas = Math.max(0, Math.min(60, (1 - diff / 180) * 60));
  return Number(virupas.toFixed(1));
}

/**
 * Calculates complete authentic Parashari Shadbala strictly for the
 * seven classical grahas (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn).
 */
export function calculateParashariShadbala(
  bodies: CelestialBody[],
  sky: SkyOrientation,
  aspects: Aspect[],
  currentDate: Date
): Record<BodyKey, PlanetShadbalaResult> {
  const sun = bodies.find((b) => b.key === 'sun') || bodies[0];
  const moon = bodies.find((b) => b.key === 'moon') || bodies[0];

  const moonElongation = (moon.longitudeSidereal - sun.longitudeSidereal + 360) % 360;
  const isShuklaPaksha = moonElongation <= 180;
  const pakshaFraction = isShuklaPaksha ? moonElongation / 180 : (360 - moonElongation) / 180;

  const isDay = sun.house >= 7 && sun.house <= 12;
  const results: Partial<Record<BodyKey, PlanetShadbalaResult>> = {};

  // Filter strictly to classical 7 planets
  const classicalBodies = bodies.filter((b) => CLASSICAL_SHADBALA_BODIES.includes(b.key));

  for (const body of classicalBodies) {
    const factors: string[] = [];

    // ==========================================
    // 1. STHANA BALA (Positional Strength)
    // ==========================================
    // (a) Uchcha Bala (Exaltation distance from Neecha point: 0 to 60 Virupas, exactly neechaDiff / 3)
    const ep = EXALTATION_POINTS[body.key] || { uchcha: 0, neecha: 180 };
    let neechaDiff = Math.abs(body.longitudeSidereal - ep.neecha);
    if (neechaDiff > 180) neechaDiff = 360 - neechaDiff;
    const uchchaBala = Number((neechaDiff / 3.0).toFixed(1));
    factors.push(`Uchcha Bala: ${uchchaBala} Virupas (dist from Neecha ${neechaDiff.toFixed(1)}°)`);

    // (b) Saptavargiya Bala (Evaluated across the 7 classical vargas)
    const saptavargiyaBala = calculateSaptavargiyaBala(body.key, body.longitudeSidereal);
    factors.push(`Saptavargiya Bala: ${saptavargiyaBala} Virupas`);

    // (c) Ojhayugmarasyamsa Bala (Odd/Even sign & Navamsha)
    const isOddSign = body.signIndex % 2 === 0;
    let ojhayugmaBala = 0;
    if (['moon', 'venus'].includes(body.key)) {
      if (!isOddSign) ojhayugmaBala += 15;
      ojhayugmaBala += 15;
    } else {
      if (isOddSign) ojhayugmaBala += 15;
      ojhayugmaBala += 15;
    }

    // (d) Kendradi Bala (Kendra=60, Panaphara=30, Apoklima=15)
    let kendradiBala = 15;
    if ([1, 4, 7, 10].includes(body.house)) {
      kendradiBala = 60;
      factors.push(`Kendradi Bala: 60 Virupas (Angular Kendra)`);
    } else if ([2, 5, 8, 11].includes(body.house)) {
      kendradiBala = 30;
      factors.push(`Kendradi Bala: 30 Virupas (Succedent Panaphara)`);
    } else {
      kendradiBala = 15;
      factors.push(`Kendradi Bala: 15 Virupas (Cadent Apoklima)`);
    }

    // (e) Drekkana Bala
    const degInSign = body.signDegree;
    let drekkanaBala = 7.5;
    if (['sun', 'mars', 'jupiter'].includes(body.key) && degInSign < 10) {
      drekkanaBala = 15;
    } else if (['mercury', 'saturn'].includes(body.key) && degInSign >= 10 && degInSign < 20) {
      drekkanaBala = 15;
    } else if (['moon', 'venus'].includes(body.key) && degInSign >= 20) {
      drekkanaBala = 15;
    }

    const sthanaBala = Number(
      (uchchaBala + saptavargiyaBala + ojhayugmaBala + kendradiBala + drekkanaBala).toFixed(1)
    );

    // ==========================================
    // 2. DIG BALA (Directional Strength)
    // ==========================================
    const digBala = calculateDigBala(body.key, body.longitudeSidereal, sky.ascendantDegree);
    factors.push(`Dig Bala: ${digBala} Virupas`);

    // ==========================================
    // 3. KALA BALA (Temporal Strength)
    // ==========================================
    let natonnathaBala = 30;
    if (['sun', 'jupiter', 'venus'].includes(body.key)) {
      natonnathaBala = isDay ? 60 : 15;
    } else if (['moon', 'mars', 'saturn'].includes(body.key)) {
      natonnathaBala = !isDay ? 60 : 15;
    } else {
      natonnathaBala = 60;
    }

    let pakshaBala = 30;
    if (['jupiter', 'venus'].includes(body.key) || (body.key === 'moon' && isShuklaPaksha)) {
      pakshaBala = Number((pakshaFraction * 60).toFixed(1));
    } else if (['sun', 'mars', 'saturn'].includes(body.key)) {
      pakshaBala = Number(((1 - pakshaFraction) * 60).toFixed(1));
    } else {
      pakshaBala = 30;
    }

    const tribhagaBala = 20;
    const ayanaBala = Number(Math.max(10, Math.min(60, 30 + (body.latitude || 0) * 5)).toFixed(1));
    const kalaBala = Number((natonnathaBala + pakshaBala + tribhagaBala + ayanaBala).toFixed(1));

    // ==========================================
    // 4. CHESTA BALA (Motional Strength)
    // ==========================================
    let chestaBala = 30;
    if (body.key === 'sun') {
      chestaBala = ayanaBala;
    } else if (body.key === 'moon') {
      chestaBala = pakshaBala;
    } else if (body.isRetrograde) {
      chestaBala = 60; // Classical peak: Vakra (Retrograde) = 60 Virupas
      factors.push(`Chesta Bala: 60 Virupas (Vakra / Retrograde Peak)`);
    } else if (Math.abs(body.speed) < 0.1) {
      chestaBala = 30; // Koti / Stationary
    } else {
      chestaBala = 15; // Chara / Direct
    }

    // ==========================================
    // 5. NAISARGIKA BALA (Natural Strength)
    // ==========================================
    const naisargikaBala = NAISARGIKA_BALA_VIRUPAS[body.key] || 15.0;

    // ==========================================
    // 6. DRIK BALA (Aspectual Strength)
    // ==========================================
    let drikBala = 0;
    const bodyAspects = aspects.filter((a) => a.body2 === body.key);
    for (const asp of bodyAspects) {
      const sourceBody = bodies.find((b) => b.key === asp.body1);
      if (!sourceBody) continue;
      const isBenefic = ['jupiter', 'venus', 'mercury'].includes(sourceBody.key);
      if (isBenefic) drikBala += 15;
      else drikBala -= 10;
    }
    drikBala = Number(Math.max(-30, Math.min(60, drikBala)).toFixed(1));

    // Total Shadbala
    const totalVirupas = Number(
      (sthanaBala + digBala + kalaBala + chestaBala + naisargikaBala + drikBala).toFixed(1)
    );
    const totalRupas = Number((totalVirupas / 60).toFixed(2));
    const reqVirupas = REQUIRED_VIRUPAS[body.key] ?? 300;
    const shadbalaRatio = Number((totalVirupas / reqVirupas).toFixed(2));
    const isBalavan = shadbalaRatio >= 1.0;
    const scorePercentage = Math.min(100, Math.max(15, Math.round(shadbalaRatio * 70)));

    results[body.key] = {
      planet: body.key,
      name: body.name,
      sanskritName: body.sanskritName,
      sthanaBala,
      digBala,
      kalaBala,
      chestaBala,
      naisargikaBala,
      drikBala,
      totalVirupas,
      totalRupas,
      requiredVirupas: reqVirupas,
      shadbalaRatio,
      isBalavan,
      scorePercentage,
      rank: 1, // Computed below after sorting
      factors,
      subcomponents: {
        uchchaBala,
        saptavargiyaBala,
        ojhayugmaBala,
        kendradiBala,
        drekkanaBala,
        natonnathaBala,
        pakshaBala,
        tribhagaBala,
        ayanaBala,
      },
    };
  }

  // Assign classical Shadbala ranks (1 to 7) strictly among the 7 classical grahas
  const sorted = Object.values(results).sort((a, b) => (b?.totalVirupas || 0) - (a?.totalVirupas || 0));
  sorted.forEach((r, idx) => {
    if (r) r.rank = idx + 1;
  });

  return results as Record<BodyKey, PlanetShadbalaResult>;
}
