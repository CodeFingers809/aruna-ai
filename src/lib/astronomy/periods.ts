import { MajorPeriod } from '@/types/astronomy';

/**
 * Calculates major planetary return and transit periods in strict chronological order:
 * Jupiter Returns (every 12 years), Saturn Returns (every ~29.5 years),
 * and Saturn Sade Sati 7.5-year structural crucibles.
 */
export function calculateMajorPeriods(
  natalDate: Date,
  natalMoonSign: number,
  currentDate: Date,
  currentSaturnSign: number
): MajorPeriod[] {
  const periods: MajorPeriod[] = [];
  const birthYear = natalDate.getFullYear();
  const currentYear = currentDate.getFullYear();
  const currentMs = currentDate.getTime();

  // 1. Jupiter Returns (every 12 years: Age 12, 24, 36, 48, 60, 72, 84)
  const jupiterAges = [12, 24, 36, 48, 60, 72, 84];
  for (const age of jupiterAges) {
    const yr = birthYear + age;
    const start = new Date(yr, 0, 1);
    const end = new Date(yr, 11, 31);
    const isCurrent = currentMs >= start.getTime() && currentMs <= end.getTime();
    const isPast = currentMs > end.getTime();

    periods.push({
      type: 'jupiter_return',
      title: `Jupiter Return (Age ${age})`,
      phase: isCurrent ? 'Active Cycle' : isPast ? 'Completed' : 'Upcoming',
      startDate: `${yr}-01-01`,
      peakDate: `${yr}-06-15`,
      endDate: `${yr}-12-31`,
      description:
        'Jupiter completes its 12-year solar orbit. Phase of strategic expansion, higher philosophical synthesis, seeking seasoned mentors, and broad horizon growth.',
      actionProtocol:
        'Invest in advanced education, strategic business ventures, and ethical leadership. Avoid over-optimistic speculation.',
    });
  }

  // 2. Saturn Returns (every ~29.5 years: Age ~29.5, ~59, ~88.5)
  const saturnAges = [29, 59, 88];
  for (let i = 0; i < saturnAges.length; i++) {
    const age = saturnAges[i];
    const yr = birthYear + age;
    const start = new Date(yr - 1, 0, 1);
    const end = new Date(yr + 1, 11, 31);
    const isCurrent = currentMs >= start.getTime() && currentMs <= end.getTime();
    const isPast = currentMs > end.getTime();

    periods.push({
      type: 'saturn_return',
      title: `Saturn Return ${i + 1} (Age ${age})`,
      phase: isCurrent ? 'Active Cycle' : isPast ? 'Completed' : 'Upcoming',
      startDate: `${yr - 1}-01-01`,
      peakDate: `${yr}-06-15`,
      endDate: `${yr + 1}-12-31`,
      description:
        'Saturn returns to its natal orbital position. Foundational audit of life structures, career commitments, and institutional accountability. Elimination of shortcuts.',
      actionProtocol:
        'Conduct full audit of personal and professional obligations. Formalize long-term systems. Accept heavy responsibilities without complaint.',
    });
  }

  // 3. Saturn Sade Sati (7.5-Year Structural Crucible across lifespan)
  // Calculate when Saturn is in 12th, 1st, and 2nd from natal Moon
  const signDiff = (currentSaturnSign - natalMoonSign + 12) % 12;
  const isSadeSatiActiveNow = signDiff === 11 || signDiff === 0 || signDiff === 1;

  let currentPhaseLabel = 'Inactive';
  if (signDiff === 11) currentPhaseLabel = 'Rising Phase (Saturn in 12th from Moon)';
  else if (signDiff === 0) currentPhaseLabel = 'Peak Phase (Saturn conjunct natal Moon)';
  else if (signDiff === 1) currentPhaseLabel = 'Setting Phase (Saturn in 2nd from Moon)';

  // Approximate year of the active/nearest Sade Sati
  let activeSadeSatiStartYear = currentYear;
  if (signDiff === 11) activeSadeSatiStartYear = currentYear - 1;
  else if (signDiff === 0) activeSadeSatiStartYear = currentYear - 3;
  else if (signDiff === 1) activeSadeSatiStartYear = currentYear - 5;
  else {
    // If inactive, calculate distance in years to 12th from Moon
    const signsUntil12th = (natalMoonSign - 1 - currentSaturnSign + 12) % 12;
    activeSadeSatiStartYear = Math.round(currentYear + signsUntil12th * 2.45);
  }

  // Generate 3 generational Sade Sati cycles across a 90-year lifespan
  const sadeSatiCycles = [
    activeSadeSatiStartYear - 29,
    activeSadeSatiStartYear,
    activeSadeSatiStartYear + 29,
  ];

  for (let c = 0; c < sadeSatiCycles.length; c++) {
    const startYr = sadeSatiCycles[c];
    const endYr = startYr + 7;
    const startAge = startYr - birthYear;
    const endAge = endYr - birthYear;

    // Filter out cycles before birth
    if (endYr < birthYear) continue;

    const start = new Date(startYr, 0, 1);
    const end = new Date(endYr, 11, 31);
    const isCurrent = currentMs >= start.getTime() && currentMs <= end.getTime();
    const isPast = currentMs > end.getTime();

    periods.push({
      type: 'sade_sati',
      title: `Saturn Sade Sati (Age ${Math.max(0, startAge)}–${endAge})`,
      phase: isCurrent ? `Active: ${currentPhaseLabel}` : isPast ? 'Completed' : 'Upcoming',
      startDate: `${startYr}-01-01`,
      peakDate: `${startYr + 3}-06-01`,
      endDate: `${endYr}-12-31`,
      description:
        '7.5-year transit of Saturn through 12th, 1st, and 2nd houses relative to natal Moon. Deep psychological maturity crucible, shedding illusions and grounding emotional stability.',
      actionProtocol:
        'Cultivate iron psychological resilience. Eliminate frivolous expenditure and toxic dependencies. Embrace routine, manual work, and service.',
    });
  }

  // Sort ALL periods in strict chronological order by startDate
  periods.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return periods;
}
