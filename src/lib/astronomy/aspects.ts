import { Aspect, AspectType, CelestialBody } from '@/types/astronomy';

interface AspectDefinition {
  type: AspectType;
  angle: number;
  orb: number;
  isHarmonious: boolean;
  name: string;
}

const MAJOR_ASPECTS: AspectDefinition[] = [
  { type: 'conjunction', angle: 0, orb: 8, isHarmonious: true, name: 'Conjunction' },
  { type: 'sextile', angle: 60, orb: 6, isHarmonious: true, name: 'Sextile' },
  { type: 'square', angle: 90, orb: 7, isHarmonious: false, name: 'Square' },
  { type: 'trine', angle: 120, orb: 8, isHarmonious: true, name: 'Trine' },
  { type: 'opposition', angle: 180, orb: 8, isHarmonious: false, name: 'Opposition' },
];

/**
 * Calculates geometric aspects and Vedic Drishtis between celestial bodies.
 */
export function calculateAspects(bodies: CelestialBody[]): Aspect[] {
  const aspects: Aspect[] = [];

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const b1 = bodies[i];
      const b2 = bodies[j];

      // Rahu and Ketu are permanently 180° opposite by astronomical definition (lunar nodal axis).
      // They should NEVER be reported as a dynamic mutual opposition aspect.
      if ((b1.key === 'rahu' && b2.key === 'ketu') || (b1.key === 'ketu' && b2.key === 'rahu')) {
        continue;
      }

      let diff = Math.abs(b1.longitudeSidereal - b2.longitudeSidereal);
      if (diff > 180) diff = 360 - diff;

      // Check standard geometric aspects
      for (const def of MAJOR_ASPECTS) {
        const orb = Math.abs(diff - def.angle);
        if (orb <= def.orb) {
          aspects.push({
            body1: b1.key,
            body2: b2.key,
            type: def.type,
            angle: diff,
            orb: Math.round(orb * 100) / 100,
            isHarmonious: def.isHarmonious,
            description: `${b1.name} ${def.name} ${b2.name} (${Math.round(diff)}°, orb ${orb.toFixed(1)}°)`,
          });
          break; // Avoid double matching
        }
      }
    }
  }

  // Vedic Special Drishtis (Planetary Sight)
  for (const b1 of bodies) {
    if (['mars', 'jupiter', 'saturn', 'rahu'].includes(b1.key)) {
      for (const b2 of bodies) {
        if (
          b1.key === b2.key ||
          (b1.key === 'rahu' && b2.key === 'ketu') ||
          (b1.key === 'ketu' && b2.key === 'rahu')
        ) {
          continue;
        }

        let forwardAngle = (b2.longitudeSidereal - b1.longitudeSidereal + 360) % 360;
        let isSpecialDrishti = false;
        let drishtiName = '';

        if (b1.key === 'mars') {
          // 4th house (~90°), 8th house (~210°)
          if (Math.abs(forwardAngle - 90) <= 8) {
            isSpecialDrishti = true;
            drishtiName = 'Mars 4th Drishti (Aggressive focus)';
          } else if (Math.abs(forwardAngle - 210) <= 8) {
            isSpecialDrishti = true;
            drishtiName = 'Mars 8th Drishti (Deep pressure)';
          }
        } else if (b1.key === 'jupiter') {
          // 5th house (~120°), 9th house (~240°)
          if (Math.abs(forwardAngle - 120) <= 8) {
            isSpecialDrishti = true;
            drishtiName = 'Jupiter 5th Drishti (Benevolent wisdom)';
          } else if (Math.abs(forwardAngle - 240) <= 8) {
            isSpecialDrishti = true;
            drishtiName = 'Jupiter 9th Drishti (Dharmic expansion)';
          }
        } else if (b1.key === 'saturn') {
          // 3rd house (~60°), 10th house (~270°)
          if (Math.abs(forwardAngle - 60) <= 8) {
            isSpecialDrishti = true;
            drishtiName = 'Saturn 3rd Drishti (Demanding effort)';
          } else if (Math.abs(forwardAngle - 270) <= 8) {
            isSpecialDrishti = true;
            drishtiName = 'Saturn 10th Drishti (Structural duty)';
          }
        }

        if (isSpecialDrishti) {
          // Avoid duplicate if standard aspect already added
          const exists = aspects.some(
            (a) =>
              (a.body1 === b1.key && a.body2 === b2.key) ||
              (a.body1 === b2.key && a.body2 === b1.key && a.type === 'drishti')
          );
          if (!exists) {
            aspects.push({
              body1: b1.key,
              body2: b2.key,
              type: 'drishti',
              angle: forwardAngle,
              orb: 0,
              isHarmonious: b1.key === 'jupiter',
              description: `${b1.name} casts ${drishtiName} on ${b2.name}`,
            });
          }
        }
      }
    }
  }

  return aspects;
}
