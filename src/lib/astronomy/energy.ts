import { Aspect, BodyKey, CelestialBody, Dignity, SkyOrientation } from '@/types/astronomy';
import { ZODIAC_SIGNS } from '@/lib/astronomy/constants';
import { calculateParashariShadbala, PlanetShadbalaResult } from '@/lib/astronomy/shadbala';

export type EnergyStatus = 'Dominant' | 'Elevated' | 'Equilibrium' | 'Subdued' | 'Constrained';

export interface PlanetEnergyLevel {
  planet: BodyKey;
  name: string;
  sanskritName: string;
  symbol: string;
  color: string;
  hasShadbala: boolean;
  score: number; // 0 to 100% normalized Shadbala score (0 if non-classical)
  status: EnergyStatus;
  dignity: Dignity;
  isRetrograde: boolean;
  isCombust: boolean;
  house: number;
  factors: string[];
  // Authentic Parashari Shadbala metrics
  totalVirupas: number;
  totalRupas: number;
  requiredVirupas: number;
  shadbalaRatio: number;
  isBalavan: boolean;
  sthanaBala: number;
  digBala: number;
  kalaBala: number;
  chestaBala: number;
  naisargikaBala: number;
  drikBala: number;
  rank: number;
}

export interface ChartElementalBalance {
  fire: number; // percentage 0-100
  earth: number;
  air: number;
  water: number;
}

export interface ChartModalityBalance {
  cardinal: number;
  fixed: number;
  mutable: number;
}

export interface ChartEnergyTelemetry {
  vitalityScore: number; // 0 to 100
  averageShadbalaRatio: number; // Average ratio across 7 classical grahas
  balavanCount: number; // Count of planets meeting >= 1.0 ratio
  planetEnergies: PlanetEnergyLevel[];
  elementalBalance: ChartElementalBalance;
  modalityBalance: ChartModalityBalance;
  hemisphereBalance: {
    eastern: number; // Houses 10, 11, 12, 1, 2, 3
    western: number; // Houses 4, 5, 6, 7, 8, 9
    diurnal: number; // Above horizon (Houses 7 to 12)
    nocturnal: number; // Below horizon (Houses 1 to 6)
  };
}

/**
 * Calculates authentic Vedic Shadbala planetary energies (Virupas, Rupas, Balavan ratio)
 * and chart telemetry per Brihat Parashara Hora Shastra.
 *
 * Shadbala is computed strictly for the 7 classical grahas. Non-classical bodies (nodes,
 * outer bodies) are flagged with hasShadbala = false and excluded from required Virupas.
 */
export function calculatePlanetaryEnergies(
  bodies: CelestialBody[],
  aspects: Aspect[],
  sky?: SkyOrientation,
  currentDate: Date = new Date()
): ChartEnergyTelemetry {
  const effectiveSky: SkyOrientation = sky || {
    ascendantDegree: 0,
    ascendantDegreeTropical: 0,
    zenithDegree: 270,
    zenithDegreeTropical: 270,
    nadirDegree: 90,
    descendantDegree: 180,
    localSiderealTime: 0,
    isDaytime: true,
    solarAltitude: 45,
  };

  const shadbalaMap = calculateParashariShadbala(bodies, effectiveSky, aspects, currentDate);

  const planetEnergies: PlanetEnergyLevel[] = bodies.map((body) => {
    const shad = shadbalaMap[body.key];
    const hasShadbala = Boolean(shad);

    let status: EnergyStatus = 'Equilibrium';
    if (shad) {
      if (shad.shadbalaRatio >= 1.3) status = 'Dominant';
      else if (shad.shadbalaRatio >= 1.05) status = 'Elevated';
      else if (shad.shadbalaRatio >= 0.9) status = 'Equilibrium';
      else if (shad.shadbalaRatio >= 0.75) status = 'Subdued';
      else status = 'Constrained';
    }

    const factors = shad
      ? [
          `Parashari Shadbala: ${shad.totalVirupas} Virupas (${shad.totalRupas} Rupas)`,
          `Balavan Ratio: ${(shad.shadbalaRatio * 100).toFixed(0)}% of required ${shad.requiredVirupas} Virupas (${
            shad.isBalavan ? 'Balavan (Meets BPHS Minimum)' : 'Alpabala (Below Required Threshold)'
          })`,
          ...shad.factors,
        ]
      : [`Non-classical body: Shadbala not applicable in Parashari Jyotish.`];

    return {
      planet: body.key,
      name: body.name,
      sanskritName: body.sanskritName,
      symbol: body.symbol,
      color: body.color,
      hasShadbala,
      score: shad ? shad.scorePercentage : 0,
      status,
      dignity: body.dignity,
      isRetrograde: body.isRetrograde,
      isCombust: body.isCombust,
      house: body.house,
      factors,
      totalVirupas: shad ? shad.totalVirupas : 0,
      totalRupas: shad ? shad.totalRupas : 0,
      requiredVirupas: shad ? shad.requiredVirupas : 0,
      shadbalaRatio: shad ? shad.shadbalaRatio : 0,
      isBalavan: shad ? shad.isBalavan : false,
      sthanaBala: shad ? shad.sthanaBala : 0,
      digBala: shad ? shad.digBala : 0,
      kalaBala: shad ? shad.kalaBala : 0,
      chestaBala: shad ? shad.chestaBala : 0,
      naisargikaBala: shad ? shad.naisargikaBala : 0,
      drikBala: shad ? shad.drikBala : 0,
      rank: shad ? shad.rank : 0,
    };
  });

  // Calculate classical Shadbala average ratio across the 7 classical bodies
  const classicalEnergies = planetEnergies.filter((p) => p.hasShadbala);
  const avgRatio = Number(
    (
      classicalEnergies.reduce((sum, p) => sum + p.shadbalaRatio, 0) /
      (classicalEnergies.length || 1)
    ).toFixed(2)
  );
  const balavanCount = classicalEnergies.filter((p) => p.isBalavan).length;
  const avgScore =
    classicalEnergies.reduce((sum, p) => sum + p.score, 0) / (classicalEnergies.length || 1);
  const vitalityScore = Math.round(avgScore);

  // Elemental & Modality counts
  let fireCount = 0;
  let earthCount = 0;
  let airCount = 0;
  let waterCount = 0;

  let cardinalCount = 0;
  let fixedCount = 0;
  let mutableCount = 0;

  let easternCount = 0;
  let westernCount = 0;
  let diurnalCount = 0;
  let nocturnalCount = 0;

  for (const b of bodies) {
    const sign = ZODIAC_SIGNS[b.signIndex];
    if (sign.element === 'Fire') fireCount++;
    else if (sign.element === 'Earth') earthCount++;
    else if (sign.element === 'Air') airCount++;
    else if (sign.element === 'Water') waterCount++;

    if (sign.modality === 'Cardinal') cardinalCount++;
    else if (sign.modality === 'Fixed') fixedCount++;
    else if (sign.modality === 'Mutable') mutableCount++;

    if ([10, 11, 12, 1, 2, 3].includes(b.house)) easternCount++;
    else westernCount++;

    if (b.house >= 7 && b.house <= 12) diurnalCount++;
    else nocturnalCount++;
  }

  const total = bodies.length || 1;

  const elementalBalance: ChartElementalBalance = {
    fire: Math.round((fireCount / total) * 100),
    earth: Math.round((earthCount / total) * 100),
    air: Math.round((airCount / total) * 100),
    water: Math.round((waterCount / total) * 100),
  };

  const modalityBalance: ChartModalityBalance = {
    cardinal: Math.round((cardinalCount / total) * 100),
    fixed: Math.round((fixedCount / total) * 100),
    mutable: Math.round((mutableCount / total) * 100),
  };

  return {
    vitalityScore,
    averageShadbalaRatio: avgRatio,
    balavanCount,
    planetEnergies,
    elementalBalance,
    modalityBalance,
    hemisphereBalance: {
      eastern: easternCount,
      western: westernCount,
      diurnal: diurnalCount,
      nocturnal: nocturnalCount,
    },
  };
}
