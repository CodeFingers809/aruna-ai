import * as Astronomy from 'astronomy-engine';
import { CelestialBody, HouseCusp, ObserverLocation, SkyOrientation } from '@/types/astronomy';
import { getLahiriAyanamsha } from './ephemeris';

/**
 * Calculates Local Sidereal Time, Midheaven (MC / Zenith),
 * Ascendant (Lagna), and 12 House Cusps.
 */
export function calculateSkyAndHouses(
  date: Date,
  location: ObserverLocation,
  bodies: CelestialBody[]
): {
  sky: SkyOrientation;
  houseCusps: HouseCusp[];
  updatedBodies: CelestialBody[];
} {
  const time = new Astronomy.AstroTime(date);
  const ayanamsha = getLahiriAyanamsha(time);

  // Greenwich Mean Sidereal Time in hours
  const gmstHours = Astronomy.SiderealTime(time);
  // Local Sidereal Time in degrees
  const lstDeg = ((gmstHours * 15 + location.longitude) % 360 + 360) % 360;
  const lstHours = lstDeg / 15.0;

  // Obliquity of the Ecliptic
  const epsRad = (23.4392911 * Math.PI) / 180.0;
  const latRad = (location.latitude * Math.PI) / 180.0;
  const lstRad = (lstDeg * Math.PI) / 180.0;

  // Midheaven (MC / Zenith) Tropical Longitude
  // tan(MC) = tan(LST) / cos(eps)
  const mcRad = Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(epsRad));
  const mcTropical = ((mcRad * (180.0 / Math.PI)) % 360 + 360) % 360;
  const mcSidereal = ((mcTropical - ayanamsha) % 360 + 360) % 360;

  // Imum Coeli (IC / Nadir)
  const icSidereal = (mcSidereal + 180) % 360;

  // Ascendant (Lagna / Eastern Horizon) Tropical Longitude
  // tan(Asc) = cos(LST) / -(sin(LST)*cos(eps) + tan(lat)*sin(eps))
  const num = Math.cos(lstRad);
  const den = -(Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
  const ascRad = Math.atan2(num, den);
  const ascTropical = ((ascRad * (180.0 / Math.PI)) % 360 + 360) % 360;
  const ascSidereal = ((ascTropical - ayanamsha) % 360 + 360) % 360;

  // Descendant (Western Horizon)
  const dscSidereal = (ascSidereal + 180) % 360;

  // Find Sun's altitude to determine if it is daytime
  const sun = bodies.find((b) => b.key === 'sun');
  const solarAltitude = sun ? sun.altitude : 0;
  const isDaytime = solarAltitude > -0.833; // Civil twilight / sunrise threshold

  const sky: SkyOrientation = {
    zenithDegree: mcSidereal,
    zenithDegreeTropical: mcTropical,
    nadirDegree: icSidereal,
    ascendantDegree: ascSidereal,
    ascendantDegreeTropical: ascTropical,
    descendantDegree: dscSidereal,
    localSiderealTime: lstHours,
    isDaytime,
    solarAltitude,
  };

  // Vedic Equal House / Bhava Chalita System (each house spans 30° from Ascendant)
  // House 1 starts 15° before Lagna to 15° after Lagna, or Equal House starting at Ascendant
  // Standard Equal House: House 1 begins at Ascendant degree
  const houseCusps: HouseCusp[] = [];
  for (let h = 1; h <= 12; h++) {
    const cuspDeg = (ascSidereal + (h - 1) * 30) % 360;
    const signIndex = Math.floor(cuspDeg / 30);
    houseCusps.push({
      house: h,
      signIndex,
      degree: cuspDeg,
      degreeTropical: (cuspDeg + ayanamsha) % 360,
      altitudeStart: 0,
      altitudeEnd: 0,
    });
  }

  // Assign each body to its house based on Equal House from Ascendant
  const updatedBodies = bodies.map((body) => {
    let diff = body.longitudeSidereal - ascSidereal;
    if (diff < 0) diff += 360;
    const house = Math.floor(diff / 30) + 1;
    return {
      ...body,
      house,
    };
  });

  return {
    sky,
    houseCusps,
    updatedBodies,
  };
}
