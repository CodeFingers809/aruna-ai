import * as Astronomy from 'astronomy-engine';
import { BodyKey, HoraPeriod, ObserverLocation } from '@/types/astronomy';

// Chaldean / Vedic descending orbital speed order
const CHALDEAN_ORDER: BodyKey[] = [
  'saturn',
  'jupiter',
  'mars',
  'sun',
  'venus',
  'mercury',
  'moon',
];

// Day Lords: 0=Sunday (Sun), 1=Monday (Moon), 2=Tuesday (Mars), etc.
const DAY_LORDS: BodyKey[] = [
  'sun',
  'moon',
  'mars',
  'mercury',
  'jupiter',
  'venus',
  'saturn',
];

const HORA_ATTRIBUTES: Record<
  BodyKey,
  { nature: string; focus: string; risk: string }
> = {
  sun: {
    nature: 'Sovereign / Executive',
    focus: 'Leadership accountability, executive alignment, presenting to superiors, vital decisions.',
    risk: 'Ego friction, arrogance, rejecting constructive feedback.',
  },
  moon: {
    nature: 'Fluid / Receptive',
    focus: 'Public communication, team cohesion, emotional equilibrium, mental nourishment.',
    risk: 'Indecisiveness, mood fluctuation, emotional reactivity.',
  },
  mars: {
    nature: 'Vigorous / Dynamic',
    focus: 'High-friction physical output, decisive executive cuts, breaking stubborn bottlenecks.',
    risk: 'Unnecessary conflict, rash impulsive maneuvers, injury.',
  },
  mercury: {
    nature: 'Analytical / Commercial',
    focus: 'Data analysis, commerce, contract drafting, technical skill acquisition, negotiation.',
    risk: 'Over-intellectualizing, superficial multitasking, verbal deceit.',
  },
  jupiter: {
    nature: 'Expansive / Ethical',
    focus: 'Strategic roadmaps, seeking mentorship, legal clarity, knowledge synthesis, long-term capital.',
    risk: 'Over-optimism, over-extending budgets, ignoring operational details.',
  },
  venus: {
    nature: 'Harmonic / Refined',
    focus: 'Diplomatic agreements, aesthetic design refinement, partnerships, resource valuation.',
    risk: 'Hedonism, conflict avoidance, compromising critical standards for comfort.',
  },
  saturn: {
    nature: 'Disciplined / Structural',
    focus: 'Heavy operational grind, auditing infrastructure debt, enforcing boundaries, enduring chores.',
    risk: 'Pessimism, paralysis by delay, uncommunicative isolation.',
  },
  rahu: { nature: 'Disruptive', focus: 'Unorthodox exploration.', risk: 'Illusion.' },
  ketu: { nature: 'Detached', focus: 'Simplification.', risk: 'Disengagement.' },
  uranus: { nature: 'Awakening', focus: 'Radical innovation.', risk: 'Chaos.' },
  neptune: { nature: 'Visionary', focus: 'Subconscious intuition.', risk: 'Deception.' },
  pluto: { nature: 'Regenerative', focus: 'Systemic purging.', risk: 'Power struggle.' },
};

/**
 * Calculates the 24 Planetary Hours (Hora) for the given date and location.
 */
export function calculatePlanetaryHours(
  date: Date,
  location: ObserverLocation
): { currentHora: HoraPeriod; allHoras: HoraPeriod[] } {
  const obs = new Astronomy.Observer(location.latitude, location.longitude, location.altitude);
  const time = new Astronomy.AstroTime(date);

  // Search sunrise and sunset for current day
  const riseSearch = Astronomy.SearchRiseSet(Astronomy.Body.Sun, obs, -1, time, -1);
  const setSearch = Astronomy.SearchRiseSet(Astronomy.Body.Sun, obs, 1, time, 1);

  // Approximate if search fails or polar regions
  let sunriseDate = riseSearch ? riseSearch.date : new Date(date);
  let sunsetDate = setSearch ? setSearch.date : new Date(date);

  if (!riseSearch) {
    sunriseDate = new Date(date);
    sunriseDate.setHours(6, 0, 0, 0);
  }
  if (!setSearch) {
    sunsetDate = new Date(date);
    sunsetDate.setHours(18, 0, 0, 0);
  }

  // Calculate day lord from local day of week at sunrise
  const dayOfWeek = sunriseDate.getDay();
  const dayLord = DAY_LORDS[dayOfWeek];
  const dayLordIndex = CHALDEAN_ORDER.indexOf(dayLord);

  const dayLengthMs = sunsetDate.getTime() - sunriseDate.getTime();
  const nightLengthMs = 86400000 - dayLengthMs;
  const dayHourMs = dayLengthMs / 12;
  const nightHourMs = nightLengthMs / 12;

  const targetMs = date.getTime();
  const horas: HoraPeriod[] = [];
  let currentHoraIndex = 0;

  // 12 Daytime Horas
  for (let i = 0; i < 12; i++) {
    const startMs = sunriseDate.getTime() + i * dayHourMs;
    const endMs = startMs + dayHourMs;
    const planetIndex = (dayLordIndex + i) % 7;
    const planet = CHALDEAN_ORDER[planetIndex];
    const isCurrent = targetMs >= startMs && targetMs < endMs;
    if (isCurrent) currentHoraIndex = i;

    const attr = HORA_ATTRIBUTES[planet];
    horas.push({
      planet,
      startTime: new Date(startMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(endMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrent,
      nature: attr.nature,
      focus: attr.focus,
      risk: attr.risk,
    });
  }

  // 12 Nighttime Horas
  for (let i = 0; i < 12; i++) {
    const startMs = sunsetDate.getTime() + i * nightHourMs;
    const endMs = startMs + nightHourMs;
    const planetIndex = (dayLordIndex + 12 + i) % 7;
    const planet = CHALDEAN_ORDER[planetIndex];
    const isCurrent = targetMs >= startMs && targetMs < endMs;
    if (isCurrent) currentHoraIndex = 12 + i;

    const attr = HORA_ATTRIBUTES[planet];
    horas.push({
      planet,
      startTime: new Date(startMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(endMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrent,
      nature: attr.nature,
      focus: attr.focus,
      risk: attr.risk,
    });
  }

  const activeHora = horas.find((h) => h.isCurrent) || horas[0];
  return {
    currentHora: activeHora,
    allHoras: horas,
  };
}
