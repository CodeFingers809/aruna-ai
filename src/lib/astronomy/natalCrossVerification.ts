import { BodyKey, CelestialBody, Dignity } from '@/types/astronomy';
import { NatalChartBlueprint, NatalPlanetAnalysis } from '@/lib/astronomy/natal';
import { ZODIAC_SIGNS } from '@/lib/astronomy/constants';

export type ManifestationVector =
  | 'AMPLIFIED_BREAKTHROUGH'
  | 'MODULATED_DELAYED'
  | 'INVERTED_HAZARD'
  | 'FRICTION_MASTERY'
  | 'ACUTE_CRUCIBLE';

export interface NatalCrossVerificationResult {
  manifestationVector: ManifestationVector;
  vectorLabel: string;
  vectorBadgeClass: string;
  transitDignity: Dignity;
  natalDignity: Dignity | 'unplaced';
  natalPowerPercentage: number;
  natalHouseOwned: number[];
  natalHouseOccupied: number;
  transitHouseFromLagna: number;
  transitHouseFromMoon: number;
  natalAspectsReceived: string[];
  isCombustInNatal: boolean;
  isRetrogradeInNatal: boolean;
  synthesis: string;
  operationalDirective: string;
}

/**
 * Cross-verifies an active transit body in the sky against the native's natal blueprint.
 * Fundamental Vedic Law: "Transit (Gochara) cannot deliver what the Natal Kundli does not authorize."
 */
export function crossVerifyTransitWithNatal(
  transitBody: CelestialBody,
  natalBlueprint: NatalChartBlueprint | null
): NatalCrossVerificationResult | null {
  if (!natalBlueprint) return null;

  const natalPlanet = natalBlueprint.planets.find((p) => p.key === transitBody.key);
  const transitHouseFromLagna =
    ((transitBody.signIndex - natalBlueprint.lagnaSignIndex + 12) % 12) + 1;
  const transitHouseFromMoon =
    ((transitBody.signIndex - natalBlueprint.moonSignIndex + 12) % 12) + 1;

  const transitDignity = transitBody.dignity;
  const natalDignity = natalPlanet ? natalPlanet.dignity : 'neutral';
  const natalPower = natalPlanet ? natalPlanet.powerPercentage : 50;
  const natalHousesOwned = natalPlanet ? natalPlanet.housesRuled : [];
  const natalHouseOccupied = natalPlanet ? natalPlanet.house : 1;
  const natalAspects = natalPlanet ? natalPlanet.aspectsReceivedFrom : [];
  const isCombustInNatal = natalPlanet ? natalPlanet.isCombust : false;
  const isRetrogradeInNatal = natalPlanet ? natalPlanet.isRetrograde : false;

  const isTransitFavorable =
    transitDignity === 'exalted' ||
    transitDignity === 'own' ||
    transitDignity === 'moolatrikona' ||
    [1, 5, 9, 10, 11].includes(transitHouseFromLagna);

  const isNatalStrong =
    (natalDignity === 'exalted' ||
      natalDignity === 'own' ||
      natalDignity === 'moolatrikona' ||
      natalPower >= 65) &&
    !isCombustInNatal;

  const isNatalDebilitatedOrAfflicted =
    natalDignity === 'debilitated' ||
    natalDignity === 'enemy' ||
    natalPower < 45 ||
    isCombustInNatal;

  let manifestationVector: ManifestationVector = 'MODULATED_DELAYED';
  let vectorLabel = 'Modulated & Delayed Yield';
  let vectorBadgeClass = 'bg-amber-950/80 text-amber-300 border-amber-800';
  let synthesis = '';
  let operationalDirective = '';

  const planetName = transitBody.name;
  const transitSignName = ZODIAC_SIGNS[transitBody.signIndex].name;
  const natalSignName = natalPlanet
    ? ZODIAC_SIGNS[natalPlanet.signIndex].name
    : 'Unknown';

  if (isTransitFavorable && isNatalStrong) {
    manifestationVector = 'AMPLIFIED_BREAKTHROUGH';
    vectorLabel = 'Amplified Breakthrough (Authorized)';
    vectorBadgeClass = 'bg-emerald-950/90 text-emerald-300 border-emerald-700 shadow-sm';
    synthesis = `High-yield alignment. ${planetName} is structurally supported in the sky (${transitDignity} in ${transitSignName}) AND possesses robust natal authorization (${natalDignity} in natal ${natalSignName}, Power: ${natalPower}%, ruling House(s) ${natalHousesOwned.join(', ')}). Your natal vessel has the capacity to translate current celestial support into lasting institutional and personal gains.`;
    operationalDirective = `Aggressively formalize initiatives in House ${transitHouseFromLagna}. Capitalize on outward opportunities without fear of hidden systemic fragility; your natal foundation fully sustains this expansion.`;
  } else if (isTransitFavorable && isNatalDebilitatedOrAfflicted) {
    manifestationVector = 'INVERTED_HAZARD';
    vectorLabel = 'Inverted Hazard / Deceptive Surface';
    vectorBadgeClass = 'bg-rose-950/90 text-rose-300 border-rose-800 shadow-sm';
    synthesis = `Deceptive optical favorability. While ${planetName}'s sky position appears advantageous (${transitDignity} in ${transitSignName}), your natal foundation is compromised (${natalDignity} in natal ${natalSignName}, Power: ${natalPower}%${isCombustInNatal ? ', Combust' : ''}). In classical Jyotish, transit fruits cannot exceed natal authority. Superficial promises will encounter hidden friction, ungrounded optimism, or administrative traps.`;
    operationalDirective = `Exercise extreme discernment. Do NOT mistake outward excitement for guaranteed stability. Double-check contractual fine print, eliminate ego-driven commitments, and refuse speculative over-extension in House ${transitHouseFromLagna}.`;
  } else if (!isTransitFavorable && isNatalStrong) {
    manifestationVector = 'FRICTION_MASTERY';
    vectorLabel = 'Friction-Hardened Mastery';
    vectorBadgeClass = 'bg-cyan-950/90 text-cyan-200 border-cyan-700 shadow-sm';
    synthesis = `Crucible of mastery. Current transit brings pressure or structural austerity in House ${transitHouseFromLagna} (${transitDignity} in ${transitSignName}), BUT your natal blueprint holds profound strength (${natalDignity} in natal ${natalSignName}, Power: ${natalPower}%). You possess the innate stamina and institutional resilience to withstand this test. This transit will not break you; it will forge executive authority through rigorous discipline.`;
    operationalDirective = `Lean directly into difficult responsibilities. Accept heavy operational burdens, audit systemic debts, and build unshakeable long-term systems. Your natal strength will turn this pressure into a definitive competitive moat.`;
  } else if (!isTransitFavorable && isNatalDebilitatedOrAfflicted) {
    manifestationVector = 'ACUTE_CRUCIBLE';
    vectorLabel = 'Acute Crucible / High Vigilance';
    vectorBadgeClass = 'bg-red-950/90 text-red-200 border-red-700 animate-pulse';
    synthesis = `Compounded vulnerability window. Both current transit (${transitDignity} in ${transitSignName}, House ${transitHouseFromLagna}) and your birth blueprint (${natalDignity} in natal ${natalSignName}, Power: ${natalPower}%) face structural deficits. Raw force will meet stubborn resistance and risk sudden depletion or conflict.`;
    operationalDirective = `Adopt a 100% defensive posture. Strip away non-essential commitments, avoid public confrontations, postpone high-risk capital deployments, and maintain disciplined health routines. Execute quiet remediation rather than outward aggression.`;
  } else {
    manifestationVector = 'MODULATED_DELAYED';
    vectorLabel = 'Modulated & Steady Yield';
    vectorBadgeClass = 'bg-amber-950/80 text-amber-300 border-amber-800';
    synthesis = `Standard procedural progression. ${planetName} expresses with moderate momentum. Manifestation depends strictly on consistent daily execution and procedural hygiene rather than effortless luck.`;
    operationalDirective = `Maintain steady, methodical progress. Honor routines, verify deliverables, and let compounding effort carry your objectives forward.`;
  }

  // Factor in natal aspects if present
  if (natalAspects.length > 0) {
    synthesis += ` In your birth chart, ${planetName} receives aspects from ${natalAspects.join('; ')}, permanently conditioning its transit response toward those archetypal themes.`;
  }

  return {
    manifestationVector,
    vectorLabel,
    vectorBadgeClass,
    transitDignity,
    natalDignity,
    natalPowerPercentage: natalPower,
    natalHouseOwned: natalHousesOwned,
    natalHouseOccupied,
    transitHouseFromLagna,
    transitHouseFromMoon,
    natalAspectsReceived: natalAspects,
    isCombustInNatal,
    isRetrogradeInNatal,
    synthesis,
    operationalDirective,
  };
}
