import * as Astronomy from 'astronomy-engine';
import { BodyKey, ObserverLocation, VarshaphalData } from '@/types/astronomy';
import { calculateAllCelestialBodies } from './ephemeris';
import { calculateSkyAndHouses } from './houses';

/**
 * Calculates Solar Return (Varshaphal) for a given target year,
 * natal birth date, and natal Sun longitude.
 */
export function calculateVarshaphal(
  targetYear: number,
  natalDate: Date,
  natalSunSiderealLon: number,
  natalLagnaSign: number,
  location: ObserverLocation
): VarshaphalData {
  // Approximate solar return around birthday in target year
  const approxReturn = new Date(
    targetYear,
    natalDate.getMonth(),
    natalDate.getDate(),
    natalDate.getHours(),
    natalDate.getMinutes()
  );

  // Muntha calculation: moves 1 sign per year completed from Natal Lagna
  const age = targetYear - natalDate.getFullYear();
  const munthaSign = (natalLagnaSign + age) % 12;

  // Compute ephemeris and Lagna for the solar return moment
  const { bodies } = calculateAllCelestialBodies(approxReturn, location);
  const { sky } = calculateSkyAndHouses(approxReturn, location, bodies);

  const varshaLagna = Math.floor(sky.ascendantDegree / 30);
  const munthaHouse = ((munthaSign - varshaLagna + 12) % 12) + 1;

  // Potential Year Lord candidates in Tajika system:
  // Usually the strongest among Lagna Lord, Natal Lagna Lord, Sun/Moon Lord, Muntha Lord
  // Here we identify the ruler of the Muntha sign
  const MUNTHA_LORDS: BodyKey[] = [
    'mars',
    'venus',
    'mercury',
    'moon',
    'sun',
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
    'saturn',
    'jupiter',
  ];
  const varsheshwara = MUNTHA_LORDS[munthaSign];

  return {
    year: targetYear,
    solarReturnDate: approxReturn.toISOString(),
    varshaLagna,
    munthaSign,
    munthaHouse,
    varsheshwara,
  };
}
