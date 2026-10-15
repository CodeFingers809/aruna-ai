import { Aspect, BodyKey, CelestialBody } from '@/types/astronomy';
import { ZODIAC_SIGNS, NAKSHATRAS } from '@/lib/astronomy/constants';
import { StrategicFocus } from '@/context/AstrologyContext';
import { NatalChartBlueprint } from '@/lib/astronomy/natal';
import {
  crossVerifyTransitWithNatal,
  NatalCrossVerificationResult,
} from '@/lib/astronomy/natalCrossVerification';

export interface ElaboratePlanetaryAnalysis {
  bodyKey: BodyKey;
  bodyName: string;
  sanskritName: string;
  symbol: string;
  color: string;
  // Core Configuration
  house: number;
  houseDomain: string;
  houseClassification: string; // Kendra, Trikona, Dusthana, Upachaya
  signName: string;
  signSanskrit: string;
  signElement: string;
  signModality: string;
  signDegree: number;
  nakshatraName: string;
  nakshatraDeity: string;
  nakshatraSymbol: string;
  pada: number;
  dignity: string;
  isCombust: boolean;
  isRetrograde: boolean;
  speed: number;
  // Deep Elaborate Sections
  energyAnalysis: string;
  aspectModifications: string[];
  mandate: string[];
  restraints: string[];
  executionProtocol: string[];
  retrogradeProtocol?: string;
  combustionProtocol?: string;
  natalCrossVerification?: NatalCrossVerificationResult | null;
}

const HOUSE_CLASSIFICATIONS: Record<number, { domain: string; classification: string }> = {
  1: { domain: 'Self, Physical Vitality, Identity, Sovereign Executive Presence', classification: 'Kendra & Trikona (Peak Foundational Pivot)' },
  2: { domain: 'Liquid Assets, Capital Allocation, Speech, Family Lineage, Value Reserves', classification: 'Maraka & Artha Bhava (Resource Foundation)' },
  3: { domain: 'Courage, Technical Skills, Daily Peer Execution, Short Travels, Hands-on Craft', classification: 'Upachaya (Grows Stronger with Effort)' },
  4: { domain: 'Home, Emotional Sanctuary, Fixed Property, Psychological Foundations', classification: 'Kendra (Core Inner Anchor)' },
  5: { domain: 'Strategic Intellect, Creative Output, Speculative Calculation, Ancient Wisdom', classification: 'Trikona (Dharmic Genius & Merit)' },
  6: { domain: 'Obstacles, Debt Resolution, Daily Operational Grind, Competitive Friction, Health', classification: 'Dusthana & Upachaya (Problem Solving Crucible)' },
  7: { domain: 'Strategic Partnerships, Formal Contracts, Bilateral Diplomacy, Public Dealing', classification: 'Kendra (External Alliance Mirror)' },
  8: { domain: 'Deep Transformations, Crisis Management, Unearned Capital, Systemic Audits, Secrets', classification: 'Dusthana & Moksha (Deep Subterranean Metamorphosis)' },
  9: { domain: 'Higher Wisdom, Long-Range Strategy, Mentorship, International Reach, Dharma', classification: 'Trikona (Supreme Dharmic Guidance)' },
  10: { domain: 'Career Authority, Public Impact, Institutional Leadership, Relentless Duty', classification: 'Kendra & Upachaya (Highest Realm of Tangible Work)' },
  11: { domain: 'Large-Scale Networks, Abundant Gains, Group Alliances, Compound Wealth', classification: 'Upachaya & Labha Bhava (Peak Expansion Realm)' },
  12: { domain: 'Solitude, Deep Subconscious Rest, Radical Decluttering, Foreign Realms, Release', classification: 'Dusthana & Moksha (Sanctuary of Surrender)' },
};

/**
 * Builds a deep, multi-variable, highly structured elaborate analysis for a celestial body,
 * tailored to the selected Strategic Focus domain, the active Nakshatra, and your Natal Blueprint.
 */
export function buildElaboratePlanetaryAnalysis(
  body: CelestialBody,
  allBodies: CelestialBody[],
  aspects: Aspect[],
  strategicFocus: StrategicFocus = 'general',
  natalBlueprint?: NatalChartBlueprint
): ElaboratePlanetaryAnalysis {
  const sign = ZODIAC_SIGNS[body.signIndex];
  const nak = NAKSHATRAS[body.nakshatraIndex];
  const houseMeta = HOUSE_CLASSIFICATIONS[body.house] || {
    domain: 'General Life Arena',
    classification: 'Neutral',
  };

  // Find aspects directly impacting this body
  const relevantAspects = aspects.filter(
    (a) => a.body1 === body.key || a.body2 === body.key
  );

  const aspectModifications: string[] = [];
  for (const a of relevantAspects) {
    const otherKey = a.body1 === body.key ? a.body2 : a.body1;
    const otherBody = allBodies.find((b) => b.key === otherKey);
    const otherName = otherBody ? otherBody.name : otherKey;

    if (a.type === 'trine') {
      aspectModifications.push(
        `Harmonious Trine with ${otherName}: Smooth flow of allied energy. Facilitates natural momentum and unlocks cooperative channels with minimal friction.`
      );
    } else if (a.type === 'square') {
      aspectModifications.push(
        `Frictional Square with ${otherName}: Dynamic tension demanding decisive action. Friction forces you to upgrade operational standards and resolve competing priorities.`
      );
    } else if (a.type === 'opposition') {
      aspectModifications.push(
        `Direct Opposition with ${otherName}: Polarity tension requiring balance. Requires conscious negotiation between internal sovereignty and external partnership expectations.`
      );
    } else if (a.type === 'conjunction') {
      aspectModifications.push(
        `Fused Conjunction with ${otherName}: Intensified concentrated force. Both archetypes merge directly; demands heightened discernment to prevent one from overwhelming the other.`
      );
    } else if (a.type === 'drishti') {
      aspectModifications.push(
        `Vedic Drishti from ${otherName}: Planetary gaze exerting structural pressure and oversight, commanding you to account for long-term consequences.`
      );
    }
  }

  if (aspectModifications.length === 0) {
    aspectModifications.push(
      'No major hard aspects currently active: Operating in an autonomous vacuum, free from acute external cross-currents.'
    );
  }

  // Energy Capacity Analysis
  let energyAnalysis = '';
  if (body.dignity === 'exalted') {
    energyAnalysis = `Peak Exalted Dignity (Uchcha): ${body.name} operates at maximum structural sovereignty in ${sign.name}. Its inherent virtues express with clarity, resilience, and high executive authority. Resistance is low; execution capacity is exceptional.`;
  } else if (body.dignity === 'debilitated') {
    energyAnalysis = `Debilitated Dignity (Neecha): ${body.name} experiences acute structural friction in ${sign.name}. Raw energy tends toward distortion or reactivity. Direct outward force will meet stubborn resistance; you must rely on defensive discipline, procedural humility, and rigorous checks rather than aggressive bravado.`;
  } else if (body.dignity === 'own') {
    energyAnalysis = `Own Sign Dignity (Swakshetra): ${body.name} resides comfortably on home turf in ${sign.name}. High natural resilience, self-reliance, and sustained stamina. Operational initiatives in this sector produce consistent compounding returns.`;
  } else if (body.dignity === 'moolatrikona') {
    energyAnalysis = `Moolatrikona Power: Highly purposeful and mission-driven. ${body.name} possesses sharp focus and deliberate duty in ${sign.name}.`;
  } else {
    energyAnalysis = `Neutral / Balanced Dignity: ${body.name} functions steadily in ${sign.name}. Progress is directly proportional to your procedural rigor, daily execution habits, and active aspects.`;
  }

  if (body.isCombust) {
    energyAnalysis += ` [Combustion / Asta Active]: Close proximity to the Sun internalizes the planet's outer expression. External ego-driven displays will face eclipse; true power lies in silent, meticulous internal mastery away from the spotlight.`;
  }

  if (body.isRetrograde) {
    energyAnalysis += ` [Retrograde Motion (℞) — Vakra Gati]: Daily speed is negative (${body.speed.toFixed(3)}°/day). In classical Parashari Jyotish, retrograde motion elevates Chesta Bala (motional potency) while reversing the planet's external vector. Instead of pushing outward aggression or public displays, this immense force must be channeled inward: conduct exhaustive forensic audits, fix structural/technical debt, and reclaim previously paused high-value projects.`;
  }

  // 1. Nakshatra Layer Integration
  energyAnalysis += `\n\n[Nakshatra Arc — ${nak.name} #${nak.index + 1} Pada ${body.pada}]: Governed by divine patron ${nak.deity} (Symbol: ${nak.symbol}) and ruled by lord ${nak.lord.toUpperCase()}. This lunar mansion channels ${nak.name}'s cosmic shakti into House ${body.house}.`;

  // 2. Natal Blueprint Layer Integration
  if (natalBlueprint) {
    const natalPlanet = natalBlueprint.planets.find((p) => p.key === body.key);
    const transitHouseFromNatalLagna = ((body.signIndex - natalBlueprint.lagnaSignIndex + 12) % 12) + 1;
    const transitHouseFromNatalMoon = ((body.signIndex - natalBlueprint.moonSignIndex + 12) % 12) + 1;

    // Check if transiting over any natal body
    const conjunctNatalPlanets = natalBlueprint.planets.filter(
      (np) => np.signIndex === body.signIndex
    );

    let natalResonance = `\n\n[Natal Blueprint Resonance]: Relative to your natal chart, this transit activates your Natal House ${transitHouseFromNatalLagna} (from Lagna: ${ZODIAC_SIGNS[natalBlueprint.lagnaSignIndex].name}) and House ${transitHouseFromNatalMoon} (from Moon: ${ZODIAC_SIGNS[natalBlueprint.moonSignIndex].name}).`;

    if (natalPlanet) {
      const nSign = ZODIAC_SIGNS[natalPlanet.signIndex];
      natalResonance += ` In your birth blueprint, ${body.name} is stationed in ${nSign.name} (Natal House ${natalPlanet.house}, Pada ${natalPlanet.pada}, Dignity: ${natalPlanet.dignity}, Chara Karaka: ${natalPlanet.karaka.title}).`;
      if (transitHouseFromNatalLagna === natalPlanet.house) {
        natalResonance += ` This constitutes a sacred Planetary Return cycle, initiating a complete reset of this planet's life themes.`;
      }
      if (natalPlanet.isVargottama) {
        natalResonance += ` As a natal Vargottama planet, its transit shifts carry magnified personal significance.`;
      }
    }

    if (conjunctNatalPlanets.length > 0) {
      natalResonance += ` Currently transiting in direct conjunction with your natal ${conjunctNatalPlanets.map((cp) => `${cp.name} (${cp.signDegree.toFixed(1)}°)`).join(', ')}, igniting direct catalytic activation of those natal archetypes.`;
    }

    energyAnalysis += natalResonance;
  }

  // Tailored Mandates, Restraints, and Systems based on Planet archetype + House + Sign
  const mandate: string[] = [];
  const restraints: string[] = [];
  const executionProtocol: string[] = [];

  switch (body.key) {
    case 'saturn':
      mandate.push(
        `Anchor uncompromising systems and iron boundaries in House ${body.house} (${houseMeta.domain}).`,
        `Commit to non-negotiable multi-year time horizons; refuse to abandon slow-growth structural pillars.`,
        `Take total ownership of tedious, unglamorous administrative debts and institutional compliance.`
      );
      restraints.push(
        `Never indulge in get-rich-quick shortcuts, speculative gambles, or premature victory laps.`,
        `Eliminate complaints regarding workload intensity; treat institutional pressure as a stress-test for longevity.`,
        `Do not isolate yourself in cynical paralysis or bureaucratic inaction.`
      );
      executionProtocol.push(
        `Daily System Audit: Allocate the first 90 minutes of the workday to resolving structural bottlenecks before opening communication feeds.`,
        `Standard Operating Procedures (SOPs): Document every recurring protocol to eliminate dependency on transient willpower.`,
        `Zero Tolerance for Sloppiness: Double-check all contractual deliverables and compliance checklists.`
      );
      break;

    case 'rahu':
      mandate.push(
        `Pioneer unconventional frontiers and develop innovative technical capabilities in House ${body.house}.`,
        `Aggressively study modern methodologies, foreign perspectives, and technological bypasses.`,
        `Channel insatiable ambition into technical and commercial mastery rather than superficial status symbols.`
      );
      restraints.push(
        `Do not fall victim to shiny-object syndrome or deceptive hype cycles.`,
        `Avoid ethical shortcuts or shady legal grey areas that create catastrophic long-term exposure.`,
        `Beware of imposter syndrome; ground bold vision with concrete empirical validation.`
      );
      executionProtocol.push(
        `Measured Pilot Testing: Initiate well-defined, low-risk experimental projects with clear boundaries.`,
        `Thoughtful Distribution: Establish reliable channels to share your knowledge and creative work.`,
        `Weekly Reality Check: Consult grounded mentors to sanity-check your boldest assumptions against cold reality.`
      );
      break;

    case 'ketu':
      mandate.push(
        `Execute radical operational decluttering and systematic automation in House ${body.house}.`,
        `Drop obsolete projects, purge dead inventory, and surrender micromanagement to cultivate peace.`,
        `Synthesize profound qualitative insights from historical failures and practice emotional detachment.`
      );
      restraints.push(
        `Do not cling to sunk costs or decaying relationships out of habitual guilt.`,
        `Avoid nihilistic withdrawal or abandoning operational responsibilities without delegating properly.`,
        `Never hoard obsolete physical or digital clutter.`
      );
      executionProtocol.push(
        `The 80/20 Elimination Sprint: Audit your commitments; identify and amputate the bottom 20% that yields 80% of mental drag.`,
        `Deep Solitary Focus: Schedule 3 hours of uninterrupted solitary deep work daily with all notifications disabled.`,
        `Mindful Release: Formally archive completed milestones and surrender obsessive fixation on final outcomes.`
      );
      break;

    case 'mars':
      mandate.push(
        `Deploy aggressive, direct physical and executive action into House ${body.house}.`,
        `Crush intimidating operational bottlenecks with speed, decisiveness, and courage.`,
        `Defend boundaries uncompromisingly against boundary-crossers and operational slackers.`
      );
      restraints.push(
        `Avoid passive-aggressive hesitation, emotional rage outbursts, and petty vindictive arguments.`,
        `Never charge into battle without tactical intelligence; raw aggression without strategy leads to defeat.`,
        `Do not ignore physical recovery; over-training or sleep deprivation impairs executive command.`
      );
      executionProtocol.push(
        `Eat the Frog: Tackle the most contentious phone call or complex engineering challenge first thing each morning.`,
        `Physical Vigor Baseline: Maintain rigorous cardiovascular conditioning and strength training to discharge physiological tension.`,
        `Decisive Execution Window: Cap strategic deliberations at 24 hours; execute with speed and iterate based on feedback.`
      );
      break;

    case 'jupiter':
      mandate.push(
        `Synthesize expansive wisdom, seek seasoned mentors, and practice ethical stewardship in House ${body.house}.`,
        `Allocate resources to compounding knowledge assets, strategic legal structures, and mentorship.`,
        `Lead through benevolent authority, generosity, and long-range philosophical clarity.`
      );
      restraints.push(
        `Guard against self-righteous dogma, intellectual arrogance, and moral preachy behavior.`,
        `Never over-extend financial budgets based on rosy speculative projections.`,
        `Do not make grand promises that exceed current operational fulfillment bandwidth.`
      );
      executionProtocol.push(
        `Strategic Reading & Mentorship: Dedicate 60 minutes daily to studying foundational historical texts and consulting industry veterans.`,
        `Capital Preservation Rule: Ensure capital investments carry a margin of safety and prioritize ethical longevity over quick flips.`,
        `Teaching & Publishing: Codify your core lessons into clear frameworks and share them generously with your network.`
      );
      break;

    case 'mercury':
      mandate.push(
        `Optimize analytical precision, refine written contracts, and negotiate terms in House ${body.house}.`,
        `Cultivate high-speed commercial trade, data engineering, and succinct written clarity.`,
        `Master principled negotiation; use accurate facts to reach honorable agreements.`
      );
      restraints.push(
        `Avoid superficial multitasking, analysis paralysis, and engaging in idle gossip.`,
        `Never sign contracts with ambiguous clauses; examine the fine print with microscopic scrutiny.`,
        `Do not prioritize witty cleverness over plain truth.`
      );
      executionProtocol.push(
        `Written Verification Cadence: Summarize every meeting and verbal agreement into an itemized written memo within 2 hours.`,
        `Quantitative Audit: Validate all performance metrics, spreadsheets, and financial forecasts down to the decimal.`,
        `Concise Communication: Edit all external communications to be 50% shorter, eliminating conversational fluff.`
      );
      break;

    case 'venus':
      mandate.push(
        `Elevate design aesthetics, cultivate reciprocal partnerships, and refine diplomacy in House ${body.house}.`,
        `Treat functional elegance as a core competitive advantage; elevate the sensory quality of all deliverables.`,
        `Structure equitable, win-win alliance contracts with transparent profit-sharing.`
      );
      restraints.push(
        `Avoid conflict-avoidant people-pleasing that compromises vital engineering standards.`,
        `Never indulge in wasteful luxury expenditure to mask underlying operational insecurity.`,
        `Do not enter codependent partnerships where reciprocity is imbalanced.`
      );
      executionProtocol.push(
        `Design Polish Pass: Review every public-facing interface, document, or environment for aesthetic symmetry and harmony.`,
        `Contractual Reciprocity: Ensure all alliance contracts clearly stipulate mutual obligations and dispute-resolution protocols.`,
        `Resource Valuation: Audit pricing and ensure your deliverables command premium value in the marketplace.`
      );
      break;

    case 'sun':
      mandate.push(
        `Embody sovereign executive accountability and align every move with dharma in House ${body.house}.`,
        `Make decisive executive calls; accept full personal responsibility for outcomes without deflection.`,
        `Lead from the front with radiant vitality, dignity, and unwavering integrity.`
      );
      restraints.push(
        `Guard against autocratic ego flare-ups, narcissism, and defensive reactions to critique.`,
        `Never micromanage competent subordinates or demand applause for fulfilling basic duties.`,
        `Do not neglect physical heart vitality and circadian sunlight exposure.`
      );
      executionProtocol.push(
        `Morning Sovereign Command: Stand in natural sunlight for 15 minutes at dawn; set the daily executive mandate with absolute clarity.`,
        `Unconditional Ownership: When a team deliverable falls short, publically absorb the blame and privately fix the root cause.`,
        `Mission Alignment Check: Review all active quarterly objectives; terminate any project that betrays core sovereign values.`
      );
      break;

    case 'moon':
      mandate.push(
        `Manage emotional resilience, pace workloads with circadian rhythms, and foster deep team alignment in House ${body.house}.`,
        `Listen to intuitive somatic cues; navigate complex human negotiations with empathy and tact.`,
        `Guard mental peace through disciplined sleep hygiene and psychological nourishment.`
      );
      restraints.push(
        `Avoid making irrevocable commitments during transient emotional volatility or fatigue.`,
        `Do not over-react to procedural criticism; separate professional feedback from personal self-worth.`,
        `Never sacrifice restorative sleep for late-night reactive busywork.`
      );
      executionProtocol.push(
        `Circadian Sleep Protocol: Enforce a strict 8-hour sleep window in a completely dark, cool room without screen exposure before bed.`,
        `Emotional Equilibrium Pause: Before responding to high-stakes provocative communications, enforce a mandatory 2-hour cooling delay.`,
        `Public Resonance Alignment: Schedule major public presentations and high-stakes meetings during peak cognitive alertness.`
      );
      break;

    case 'uranus':
      mandate.push(
        `Shatter obsolete paradigms and design radical automated infrastructure in House ${body.house}.`,
        `Champion technical disruption and non-conformist breakthroughs that bypass legacy gatekeepers.`
      );
      restraints.push(
        `Do not rebel purely for the sake of shock value without building a superior replacement system.`,
        `Avoid chaotic instability that alienates essential operational partners.`
      );
      executionProtocol.push(
        `First-Principles Deconstruction: Challenge standard assumptions; design solutions using modern, effective tools.`
      );
      break;

    case 'neptune':
      mandate.push(
        `Channel profound creative flow, visionary intuition, and psychological insight in House ${body.house}.`,
        `Cultivate subtle discernment; see through superficial facades to perceived underlying realities.`
      );
      restraints.push(
        `Guard against self-delusion, vague hand-waving, and deceptive contracts with hidden clauses.`,
        `Never use escapism (substances, media addiction) to evade mundane operational duties.`
      );
      executionProtocol.push(
        `Radical Transparency Verification: Insist on verifiable third-party escrow and quantitative audits in all deals.`
      );
      break;

    case 'pluto':
      if (body.isRetrograde) {
        mandate.push(
          `Conduct ruthless internal forensic auditing and structural reclamation in House ${body.house}.`,
          `Confront hidden vulnerabilities; purge dysfunctional processes and rebuild with indestructible durability.`
        );
        restraints.push(
          `Avoid public confrontations, toxic paranoia, and destructive vengefulness.`,
          `Do not cling to rotting internal systems out of sentimental attachment.`
        );
        executionProtocol.push(
          `Internal System Amputation: Identify failing internal protocols, paused codebases, or legacy administrative debt; terminate them cleanly to declutter House ${body.house}.`
        );
      } else {
        mandate.push(
          `Execute ruthless creative destruction of dead organizational weight in House ${body.house}.`,
          `Confront hidden power dynamics; purge dysfunctional habits and rebuild with indestructible durability.`
        );
        restraints.push(
          `Avoid petty power struggles, toxic paranoia, and destructive vengefulness.`,
          `Do not cling to rotting systems out of sentimental attachment.`
        );
        executionProtocol.push(
          `Surgical Amputation: Identify failing initiatives and terminate them cleanly without lingering regret. Rebuild from ground zero.`
        );
      }
      break;
  }

  // Domain-specific tailoring based on strategicFocus
  if (strategicFocus === 'career') {
    energyAnalysis += `\n\n[Domain Focus: Career & Enterprise]: ${body.name} in House ${body.house} commands professional authority, institutional standing, and reputation. Focus operational energy on core deliverables, stakeholder trust, and steady career consolidation.`;
    mandate.unshift(
      `Direct ${body.name}'s strength toward career milestones, organizational leadership, and professional excellence in House ${body.house}.`
    );
    restraints.unshift(
      `Do not risk professional reputation, breach ethical trust, or allow emotional volatility to leak into professional responsibilities.`
    );
    executionProtocol.unshift(
      `Executive Alignment: Establish clear accountability milestones with colleagues and counterparties, document operational consensus, and execute with disciplined leadership.`
    );
  } else if (strategicFocus === 'wealth') {
    energyAnalysis += `\n\n[Domain Focus: Wealth & Resources]: ${body.name} in House ${body.house} directly influences financial security, resource management, and enduring prosperity (Dhana). All decisions must prioritize ethical resource accumulation and preservation over speculative exuberance.`;
    mandate.unshift(
      `Audit resource reserves and channel efforts toward steady, high-conviction wealth preservation influenced by House ${body.house}.`
    );
    restraints.unshift(
      `Refuse unvetted speculative ventures, emotional purchases, or debt traps during this planetary cycle.`
    );
    executionProtocol.unshift(
      `Financial Audit: Conduct a disciplined review of expenditure patterns, recurring commitments, and savings reserves.`
    );
  } else if (strategicFocus === 'relationships') {
    energyAnalysis += `\n\n[Domain Focus: Relationships & Love]: ${body.name} in House ${body.house} commands relational contracts, emotional reciprocity, boundary negotiations, and mutual commitments. Clarity of intent is paramount.`;
    mandate.unshift(
      `Establish transparent contractual expectations and emotional clarity with primary partners; honor mutual commitments without passive-aggressive ambiguity.`
    );
    restraints.unshift(
      `Avoid unilateral decisions that disregard your partner's sovereignty, and do not compromise non-negotiable core values for superficial harmony.`
    );
    executionProtocol.unshift(
      `Radical Candor Dialogue: Schedule focused, non-defensive conversations to align mutual horizons and recalibrate shared boundaries.`
    );
  } else if (strategicFocus === 'health') {
    energyAnalysis += `\n\n[Domain Focus: Health & Vitality]: ${body.name} in House ${body.house} governs psychosomatic vitality, metabolic pacing, recovery cycles, and nervous system load. Operational output must be paced with physiological sustainability.`;
    mandate.unshift(
      `Synchronize your daily operational tempo with biological rest cycles; prioritize deep sleep, nervous system regulation, and anti-inflammatory nutrition.`
    );
    restraints.unshift(
      `Do not sacrifice sleep or biological recovery to compensate for procedural inefficiencies or external crisis demands.`
    );
    executionProtocol.unshift(
      `Biological Protocol: Implement strict screen curfews, scheduled physical exertion, and intentional nervous system resets throughout the working day.`
    );
  } else if (strategicFocus === 'family') {
    energyAnalysis += `\n\n[Domain Focus: Family & Lineage]: ${body.name} in House ${body.house} acts upon generational bonds, domestic foundations, ancestral duties, and emotional roots.`;
    mandate.unshift(
      `Fortify domestic peace, support elder and descendant dependents, and maintain absolute integrity in family matters.`
    );
    restraints.unshift(
      `Do not let outside ambition cause neglect of household stability, parental duties, or domestic sanctuaries.`
    );
    executionProtocol.unshift(
      `Domestic Anchor: Dedicate protected hours to domestic upkeep, family coordination, and shared nourishment without professional intrusion.`
    );
  } else if (strategicFocus === 'dharma') {
    energyAnalysis += `\n\n[Domain Focus: Dharma & Solitude]: ${body.name} in House ${body.house} acts upon higher purpose, ethical alignment, contemplative wisdom, and transcendent detachment.`;
    mandate.unshift(
      `Align every professional and personal initiative with timeless ethical principles and your sovereign soul purpose (Atmakaraka trajectory).`
    );
    restraints.unshift(
      `Avoid meaningless social friction, ego inflation, or compromising fundamental values for short-term vanity.`
    );
    executionProtocol.unshift(
      `Contemplative Sanctuary: Carve out uninterrupted daily solitude for philosophical reading, meditation, and introspection on long-term karmic trajectory.`
    );
  }

  // Harmonize Mandate & Restraints when planet is Retrograde (Vakra Gati)
  if (body.isRetrograde) {
    mandate.unshift(
      `Retrograde Operational Mandate (℞): Pivot all intensity inward into House ${body.house}. Conduct an exhaustive forensic audit of historical decisions, unfulfilled promises, and infrastructure debt. Consolidate internal resilience rather than pushing external expansion.`
    );
    restraints.unshift(
      `Do NOT push aggressive outward expansion, public confrontations, or signing hasty untested commitments in House ${body.house} during this retrograde phase.`
    );
    executionProtocol.unshift(
      `Retrospective Audit Sprint: Re-verify data assumptions, audit historical compliance, and refactor existing architectures before committing new outward capital.`
    );
  }

  // Retrograde Protocol (if active)
  let retrogradeProtocol: string | undefined;
  if (body.isRetrograde) {
    retrogradeProtocol = `Retrograde Phase Protocol (℞): Do not push aggressive outward expansion or sign hasty untested commitments in House ${body.house}. Conduct an exhaustive retrospective audit: fix technical and financial debt, review compliance, re-verify data assumptions, and restructure team hierarchies. Re-engaging past paused initiatives will yield higher compound progress than launching new unverified ones.`;
  }

  // Combustion Protocol (if active)
  let combustionProtocol: string | undefined;
  if (body.isCombust) {
    combustionProtocol = `Combustion Protocol: ${body.name} is within the scorching orb of the Sun. External public expression will meet solar glare; speech or overt ambition may trigger friction. Channel all focus into silent, background engineering mastery, private research, and refining internal systems away from the public gaze.`;
  }

  return {
    bodyKey: body.key,
    bodyName: body.name,
    sanskritName: body.sanskritName,
    symbol: body.symbol,
    color: body.color,
    house: body.house,
    houseDomain: houseMeta.domain,
    houseClassification: houseMeta.classification,
    signName: sign.name,
    signSanskrit: sign.sanskritName,
    signElement: sign.element,
    signModality: sign.modality,
    signDegree: body.signDegree,
    nakshatraName: nak.name,
    nakshatraDeity: nak.deity,
    nakshatraSymbol: nak.symbol,
    pada: body.pada,
    dignity: body.dignity,
    isCombust: body.isCombust,
    isRetrograde: body.isRetrograde,
    speed: body.speed,
    energyAnalysis,
    aspectModifications,
    mandate,
    restraints,
    executionProtocol,
    retrogradeProtocol,
    combustionProtocol,
    natalCrossVerification: natalBlueprint ? crossVerifyTransitWithNatal(body, natalBlueprint) : null,
  };
}
