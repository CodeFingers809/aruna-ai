import * as Astronomy from 'astronomy-engine';
import { BodyKey, CelestialBody, Dignity, ObserverLocation } from '@/types/astronomy';
import { CELESTIAL_BODY_CONFIG, NAKSHATRAS } from './constants';

/**
 * Calculates high-precision Lahiri (Chitrapaksha) Ayanamsha in degrees
 * for a given Julian Ephemeris Century (T from J2000.0).
 */
export function getLahiriAyanamsha(time: Astronomy.AstroTime): number {
  // Centuries from J2000.0 (JD 2451545.0)
  // Astronomy.AstroTime ut property is days since J2000 (JD - 2451545.0)
  const T = time.tt / 36525.0;
  // Indian Government Calendar Reform Committee / Spica at 180°
  // Standard formula: 23°51'25.53" + 50.290966" * T + 0.000222" * T^2
  const ayanamsha = 23.856944 + 1.396042 * T + 0.000308 * T * T;
  return ayanamsha;
}

/**
 * Mean lunar ascending node (Rahu) in tropical degrees.
 */
function getMeanRahuLongitude(time: Astronomy.AstroTime): number {
  const T = time.tt / 36525.0;
  // IAU formula for mean longitude of ascending node of the Moon
  let omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000.0;
  omega = ((omega % 360) + 360) % 360;
  return omega;
}

const ASTRONOMY_BODY_MAP: Partial<Record<BodyKey, Astronomy.Body>> = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
  pluto: Astronomy.Body.Pluto,
};

// Classical Exaltation & Debilitation degrees (Sidereal)
const DIGNITY_RULES: Record<
  BodyKey,
  {
    exaltSign: number;
    exaltDegree: number;
    debilSign: number;
    ownSigns: number[];
    moolatrikonaSign: number;
    combustionLimit: number; // Angular distance from Sun in degrees
  }
> = {
  sun: { exaltSign: 0, exaltDegree: 10, debilSign: 6, ownSigns: [4], moolatrikonaSign: 4, combustionLimit: 0 },
  moon: { exaltSign: 1, exaltDegree: 3, debilSign: 7, ownSigns: [3], moolatrikonaSign: 1, combustionLimit: 12 },
  mars: { exaltSign: 9, exaltDegree: 28, debilSign: 3, ownSigns: [0, 7], moolatrikonaSign: 0, combustionLimit: 17 },
  mercury: { exaltSign: 5, exaltDegree: 15, debilSign: 11, ownSigns: [2, 5], moolatrikonaSign: 5, combustionLimit: 14 },
  jupiter: { exaltSign: 3, exaltDegree: 5, debilSign: 9, ownSigns: [8, 11], moolatrikonaSign: 8, combustionLimit: 11 },
  venus: { exaltSign: 11, exaltDegree: 27, debilSign: 5, ownSigns: [1, 6], moolatrikonaSign: 6, combustionLimit: 10 },
  saturn: { exaltSign: 6, exaltDegree: 20, debilSign: 0, ownSigns: [9, 10], moolatrikonaSign: 10, combustionLimit: 15 },
  rahu: { exaltSign: 1, exaltDegree: 20, debilSign: 7, ownSigns: [10], moolatrikonaSign: 10, combustionLimit: 0 },
  ketu: { exaltSign: 7, exaltDegree: 20, debilSign: 1, ownSigns: [7], moolatrikonaSign: 7, combustionLimit: 0 },
  uranus: { exaltSign: 7, exaltDegree: 15, debilSign: 1, ownSigns: [10], moolatrikonaSign: 10, combustionLimit: 0 },
  neptune: { exaltSign: 3, exaltDegree: 15, debilSign: 9, ownSigns: [11], moolatrikonaSign: 11, combustionLimit: 0 },
  pluto: { exaltSign: 0, exaltDegree: 15, debilSign: 6, ownSigns: [7], moolatrikonaSign: 7, combustionLimit: 0 },
};

function determineDignity(key: BodyKey, signIndex: number, signDegree: number): Dignity {
  const rules = DIGNITY_RULES[key];
  if (!rules) return 'neutral';

  if (signIndex === rules.exaltSign) {
    if (Math.abs(signDegree - rules.exaltDegree) <= 5) return 'exalted';
    return 'exalted';
  }
  if (signIndex === rules.debilSign) return 'debilitated';
  if (signIndex === rules.moolatrikonaSign) return 'moolatrikona';
  if (rules.ownSigns.includes(signIndex)) return 'own';

  return 'neutral';
}

/**
 * Calculates raw tropical geocentric ecliptic coordinates
 */
export function getTropicalCoordinates(
  bodyKey: BodyKey,
  time: Astronomy.AstroTime
): { elon: number; elat: number } {
  if (bodyKey === 'rahu') {
    return { elon: getMeanRahuLongitude(time), elat: 0 };
  }
  if (bodyKey === 'ketu') {
    const rahuLon = getMeanRahuLongitude(time);
    return { elon: (rahuLon + 180) % 360, elat: 0 };
  }

  const astroBody = ASTRONOMY_BODY_MAP[bodyKey];
  if (astroBody === undefined) {
    return { elon: 0, elat: 0 };
  }

  const geoVec = Astronomy.GeoVector(astroBody, time, true);
  const ecl = Astronomy.Ecliptic(geoVec);
  return {
    elon: ((ecl.elon % 360) + 360) % 360,
    elat: ecl.elat,
  };
}

/**
 * Calculates high-precision Lahiri sidereal Nirayana longitude for a given body and time.
 */
export function getSiderealLongitude(bodyKey: BodyKey, time: Astronomy.AstroTime): number {
  const trop = getTropicalCoordinates(bodyKey, time);
  const ayanamsha = getLahiriAyanamsha(time);
  return ((trop.elon - ayanamsha) % 360 + 360) % 360;
}

/**
 * Computes all 12 celestial bodies for a specific timestamp and observer location.
 */
export function calculateAllCelestialBodies(
  date: Date,
  location: ObserverLocation
): { bodies: CelestialBody[]; ayanamsha: number; sunTropicalLon: number } {
  const time = new Astronomy.AstroTime(date);
  // Time + 1 hour for numerical speed differentiation
  const timeNext = time.AddDays(1 / 24.0);

  const ayanamsha = getLahiriAyanamsha(time);
  const obs = new Astronomy.Observer(location.latitude, location.longitude, location.altitude);

  const sunTropical = getTropicalCoordinates('sun', time);
  const sunTropicalLon = sunTropical.elon;

  const bodyKeys: BodyKey[] = [
    'sun',
    'moon',
    'mars',
    'mercury',
    'jupiter',
    'venus',
    'saturn',
    'rahu',
    'ketu',
    'uranus',
    'neptune',
    'pluto',
  ];

  const bodies: CelestialBody[] = bodyKeys.map((key) => {
    const config = CELESTIAL_BODY_CONFIG[key];
    const tropCurrent = getTropicalCoordinates(key, time);
    const tropNext = getTropicalCoordinates(key, timeNext);

    // Calculate hourly delta in degrees, converting to daily speed (°/day)
    let deltaLon = tropNext.elon - tropCurrent.elon;
    // Normalize delta across 0/360 boundary
    if (deltaLon > 180) deltaLon -= 360;
    if (deltaLon < -180) deltaLon += 360;
    const dailySpeed = deltaLon * 24.0;

    // Rahu and Ketu naturally move retrograde
    const isRetrograde = key === 'rahu' || key === 'ketu' ? true : dailySpeed < 0;

    // Convert to Sidereal Nirayana
    const siderealLon = ((tropCurrent.elon - ayanamsha) % 360 + 360) % 360;
    const signIndex = Math.floor(siderealLon / 30);
    const signDegree = siderealLon % 30;

    // Nakshatra and Pada calculation (each nakshatra is 13°20' = 13.333333°)
    const nakshatraIndex = Math.floor(siderealLon / (360 / 27));
    const nakshatraDegree = siderealLon % (360 / 27);
    // Each pada is 3°20' = 3.333333°
    const pada = Math.min(4, Math.floor(nakshatraDegree / (360 / 108)) + 1);

    // Combustion
    let isCombust = false;
    if (key !== 'sun' && key !== 'rahu' && key !== 'ketu') {
      let sunSep = Math.abs(tropCurrent.elon - sunTropicalLon);
      if (sunSep > 180) sunSep = 360 - sunSep;
      const limit = DIGNITY_RULES[key]?.combustionLimit || 0;
      isCombust = sunSep <= limit;
    }

    // Dignity
    const dignity = determineDignity(key, signIndex, signDegree);

    // Altitude and Azimuth (Horizontal coordinates from observer)
    let altitude = 0;
    let azimuth = 0;
    const astroBody = ASTRONOMY_BODY_MAP[key];

    if (astroBody !== undefined) {
      const equ = Astronomy.Equator(astroBody, time, obs, true, true);
      const hor = Astronomy.Horizon(time, obs, equ.ra, equ.dec, 'normal');
      altitude = hor.altitude;
      azimuth = hor.azimuth;
    } else {
      // For Rahu and Ketu, estimate altitude based on ecliptic position and LST
      const gmst = Astronomy.SiderealTime(time);
      const lstDeg = ((gmst * 15 + location.longitude) % 360 + 360) % 360;
      let hourAngle = lstDeg - tropCurrent.elon;
      if (hourAngle < -180) hourAngle += 360;
      if (hourAngle > 180) hourAngle -= 360;
      altitude = 90 - Math.abs(hourAngle);
      azimuth = ((hourAngle + 180) % 360 + 360) % 360;
    }

    const isVisibleAboveHorizon = altitude > 0;

    return {
      key,
      name: config.name,
      sanskritName: config.sanskritName,
      symbol: config.symbol,
      color: config.color,
      category: config.category,
      longitudeTropical: tropCurrent.elon,
      longitudeSidereal: siderealLon,
      latitude: tropCurrent.elat,
      speed: dailySpeed,
      isRetrograde,
      signIndex,
      signDegree,
      house: 1, // Will be resolved by houses engine
      nakshatraIndex,
      nakshatraDegree,
      pada,
      dignity,
      isCombust,
      altitude,
      azimuth,
      isVisibleAboveHorizon,
    };
  });

  return {
    bodies,
    ayanamsha,
    sunTropicalLon,
  };
}
