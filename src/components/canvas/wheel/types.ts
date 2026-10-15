import { BodyKey } from '@/types/astronomy';

export const WHEEL_CX = 550;
export const WHEEL_CY = 550;
export const WHEEL_VIEWBOX = '0 0 1100 1100';

export interface Point2D {
  x: number;
  y: number;
}

export type HoveredItem =
  | { type: 'planet'; key: BodyKey }
  | { type: 'sign'; index: number }
  | { type: 'house'; number: number }
  | { type: 'nakshatra'; index: number }
  | null;

/**
 * Calculates (x, y) coordinates on the SVG canvas for a given sidereal longitude and radius.
 */
export function getWheelCoordinates(longitude: number, radius: number, rotationOffset: number): Point2D {
  const angleDeg = longitude + rotationOffset;
  const angleRad = (angleDeg * Math.PI) / 180.0;
  return {
    x: WHEEL_CX + radius * Math.cos(angleRad),
    y: WHEEL_CY + radius * Math.sin(angleRad),
  };
}

/**
 * Computes SVG arc path for a circular ring sector between rInner and rOuter.
 */
export function getSectorPath(
  rInner: number,
  rOuter: number,
  startDeg: number,
  endDeg: number
): string {
  const rad = Math.PI / 180;
  const a1 = startDeg * rad;
  const a2 = endDeg * rad;
  const x1 = WHEEL_CX + rOuter * Math.cos(a1);
  const y1 = WHEEL_CY + rOuter * Math.sin(a1);
  const x2 = WHEEL_CX + rOuter * Math.cos(a2);
  const y2 = WHEEL_CY + rOuter * Math.sin(a2);
  const x3 = WHEEL_CX + rInner * Math.cos(a2);
  const y3 = WHEEL_CY + rInner * Math.sin(a2);
  const x4 = WHEEL_CX + rInner * Math.cos(a1);
  const y4 = WHEEL_CY + rInner * Math.sin(a1);

  const span = (((endDeg - startDeg) % 360) + 360) % 360;
  const arcSweep = span > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${arcSweep} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${arcSweep} 0 ${x4} ${y4} Z`;
}

/**
 * Computes orbital radial distance from Earth center for celestial bodies.
 */
export function getPlanetTrackRadius(key: BodyKey): number {
  switch (key) {
    case 'moon':
      return 72;
    case 'mercury':
      return 88;
    case 'venus':
      return 104;
    case 'sun':
      return 120;
    case 'mars':
      return 136;
    case 'jupiter':
      return 152;
    case 'saturn':
      return 168;
    case 'rahu':
    case 'ketu':
      return 184;
    case 'uranus':
      return 198;
    case 'neptune':
      return 210;
    case 'pluto':
      return 220;
    default:
      return 150;
  }
}

/**
 * Correctly computes tangential text rotation angle so that all labels around the
 * circular ring ALWAYS remain right-side up to the viewer.
 *
 * In polar screen space:
 * Top half (180° to 360°): angleOnScreen + 90
 * Bottom half (0° to 180°): angleOnScreen - 90
 */
export function getUprightTangentRotation(midDeg: number, rotationOffset: number): number {
  const angleOnScreen = (((midDeg + rotationOffset) % 360) + 360) % 360;
  if (angleOnScreen >= 180) {
    return angleOnScreen + 90;
  } else {
    return angleOnScreen - 90;
  }
}
