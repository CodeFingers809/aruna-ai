import { DivisionType, BodyDivisionState } from '@/types/astronomy';

/**
 * Calculates the divisional sign index (0-11, Aries to Pisces)
 * and degree within that divisional sign for any sidereal longitude.
 *
 * Traditional Parashari definitions:
 * - D1 (Rasi): 30° per sign.
 * - D2 (Hora): 15° per sign. In odd signs: 0-15° Leo (Sun), 15-30° Cancer (Moon). In even signs: 0-15° Cancer, 15-30° Leo.
 * - D3 (Drekkana): 10° per sign. 1st decan is same sign, 2nd is 5th from it, 3rd is 9th from it.
 * - D7 (Saptamsha): 4°17'8.57" per part. In odd signs, starts from same sign. In even signs, starts from 7th sign.
 * - D9 (Navamsha): 3°20' per part (200' arc).
 *     * Fire signs (0, 4, 8) start from Aries (0).
 *     * Earth signs (1, 5, 9) start from Capricorn (9).
 *     * Air signs (2, 6, 10) start from Libra (6).
 *     * Water signs (3, 7, 11) start from Cancer (3).
 * - D10 (Dashamsha): 3° per part. In odd signs, starts from same sign. In even signs, starts from 9th sign.
 * - D12 (Dwadashamsha): 2°30' per part. Starts from same sign.
 * - D60 (Shashtiamsha): 0°30' (30' arc). Each half degree. Sign = (Rasi sign + part - 1) % 12.
 */
export function calculateHarmonicDivision(
  siderealLongitude: number,
  divisionType: DivisionType
): BodyDivisionState {
  const normLon = ((siderealLongitude % 360) + 360) % 360;
  const signIndex = Math.floor(normLon / 30);
  const degreeInSign = normLon % 30;
  const isOddSign = signIndex % 2 === 0; // Aries=0 (odd sign in astrology 1st), Taurus=1 (even)

  let divisionalSignIndex = 0;
  let divisionalDegree = 0;

  switch (divisionType) {
    case 'D1': {
      divisionalSignIndex = signIndex;
      divisionalDegree = degreeInSign;
      break;
    }

    case 'D2': {
      // 15° segments
      const part = degreeInSign < 15 ? 0 : 1;
      divisionalDegree = (degreeInSign % 15) * 2;
      if (isOddSign) {
        // Leo (4) then Cancer (3)
        divisionalSignIndex = part === 0 ? 4 : 3;
      } else {
        // Cancer (3) then Leo (4)
        divisionalSignIndex = part === 0 ? 3 : 4;
      }
      break;
    }

    case 'D3': {
      // 10° segments
      const part = Math.floor(degreeInSign / 10); // 0, 1, 2
      divisionalDegree = (degreeInSign % 10) * 3;
      if (part === 0) divisionalSignIndex = signIndex;
      else if (part === 1) divisionalSignIndex = (signIndex + 4) % 12; // 5th sign
      else divisionalSignIndex = (signIndex + 8) % 12; // 9th sign
      break;
    }

    case 'D7': {
      // 30 / 7 = 4.285714 degrees
      const part = Math.floor((degreeInSign * 7) / 30);
      divisionalDegree = (degreeInSign - (part * 30) / 7) * 7;
      if (isOddSign) {
        divisionalSignIndex = (signIndex + part) % 12;
      } else {
        divisionalSignIndex = (signIndex + 6 + part) % 12; // starts from 7th
      }
      break;
    }

    case 'D9': {
      // 3°20' = 3.333333°
      const part = Math.floor(degreeInSign / (30 / 9)); // 0 to 8
      divisionalDegree = (degreeInSign - part * (30 / 9)) * 9;
      const elementGroup = signIndex % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water
      let startSign = 0;
      if (elementGroup === 0) startSign = 0; // Aries
      else if (elementGroup === 1) startSign = 9; // Capricorn
      else if (elementGroup === 2) startSign = 6; // Libra
      else startSign = 3; // Cancer
      divisionalSignIndex = (startSign + part) % 12;
      break;
    }

    case 'D10': {
      // 3° segments
      const part = Math.floor(degreeInSign / 3); // 0 to 9
      divisionalDegree = (degreeInSign % 3) * 10;
      if (isOddSign) {
        divisionalSignIndex = (signIndex + part) % 12;
      } else {
        divisionalSignIndex = (signIndex + 8 + part) % 12; // starts from 9th
      }
      break;
    }

    case 'D12': {
      // 2.5° segments
      const part = Math.floor(degreeInSign / 2.5); // 0 to 11
      divisionalDegree = (degreeInSign % 2.5) * 12;
      divisionalSignIndex = (signIndex + part) % 12;
      break;
    }

    case 'D60': {
      // 0.5° segments
      const part = Math.floor(degreeInSign / 0.5); // 0 to 59
      divisionalDegree = (degreeInSign % 0.5) * 60;
      divisionalSignIndex = (signIndex + part) % 12;
      break;
    }
  }

  // Vargottama: Check if D9 sign is identical to D1 sign
  let isVargottama = false;
  if (divisionType === 'D9') {
    isVargottama = divisionalSignIndex === signIndex;
  }

  return {
    divisionType,
    signIndex: divisionalSignIndex,
    signDegree: divisionalDegree,
    isVargottama,
  };
}
