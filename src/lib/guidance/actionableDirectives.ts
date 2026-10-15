import { ActionGuidance, BodyKey, CelestialBody, SookshmaDirectives } from '@/types/astronomy';

export const BASE_PLANETARY_DIRECTIVES: Record<
  BodyKey,
  {
    mandate: string;
    avoid: string;
    executionProtocol: string;
    retrogradeProtocol: string;
  }
> = {
  saturn: {
    mandate: 'Enforce structural discipline, systematize recurring workflows, and build enduring foundations.',
    avoid: 'Shortcuts, speculative gambles, complaining about workload, evading difficult administrative responsibilities.',
    executionProtocol: 'Audit all active processes. Document standard operating procedures. Work with extended time horizons (3 to 10 years).',
    retrogradeProtocol: 'Retrograde Phase: Internal infrastructure audit. Resolve technical and financial debt. Do not launch unverified systems; stress-test existing architecture.',
  },
  rahu: {
    mandate: 'Pioneer unconventional methods, explore innovative frontiers, and cultivate technical and intellectual skills.',
    avoid: 'Imposter syndrome, obsessive illusions, get-rich-quick mirages, losing grounding in fundamentals.',
    executionProtocol: 'Run small, rapid experiments in modern or foreign arenas. Use technology to bypass gatekeepers while tracking objective metrics.',
    retrogradeProtocol: 'Retrograde Motion (Natural): Maintain acute skepticism toward shiny objects. Channel ambition into deep mastery rather than superficial buzz.',
  },
  ketu: {
    mandate: 'Streamline operations, automate or delegate legacy tasks, eliminate redundant commitments, practice detachment.',
    avoid: 'Micromanagement, clinging to sunk costs, hoarding obsolete possessions or responsibilities.',
    executionProtocol: 'Conduct radical decluttering. Systematize automation. Drop non-core projects to channel full focus into sovereign deep work.',
    retrogradeProtocol: 'Retrograde Motion (Natural): Deep retrospective distillation. Synthesize essential lessons from past failures; discard baggage.',
  },
  mars: {
    mandate: 'Execute decisive direct action, tackle high-friction obstacles, defend boundaries, maintain physical vigor.',
    avoid: 'Passive hesitation, vindictive arguments, impulsive rage, reckless physical exertion without recovery.',
    executionProtocol: 'Pick the single most intimidating task of the day and crush it before noon. Keep physical training consistent and intense.',
    retrogradeProtocol: 'Retrograde Phase: Halt outward aggression. Direct martial vigor toward internal self-mastery, strategic review, and precision calibration.',
  },
  jupiter: {
    mandate: 'Expand knowledge synthesis, seek seasoned mentorship, practice ethical stewardship, invest in compounding skills.',
    avoid: 'Dogmatic arrogance, over-leveraging capital, promising more than operational capacity allows.',
    executionProtocol: 'Allocate capital and time to foundational education. Build win-win alliances. Frame all initiatives in long-term ethical value.',
    retrogradeProtocol: 'Retrograde Phase: Review internal philosophy and legal frameworks. Re-evaluate ethical alignment before external expansion.',
  },
  mercury: {
    mandate: 'Refine commercial contracts, optimize analytical accuracy, sharpen technical writing, negotiate terms.',
    avoid: 'Superficial multitasking, gossip, signing ambiguous documents without scrutiny, verbal ambiguity.',
    executionProtocol: 'Document all agreements in writing. Verify quantitative assumptions twice. Communicate with concise brevity.',
    retrogradeProtocol: 'Retrograde Phase: Stringent review protocol. Backup critical data, verify contract terms, re-open paused negotiations rather than signing new untested agreements.',
  },
  venus: {
    mandate: 'Elevate aesthetic standards, negotiate diplomatic agreements, nurture strategic partnerships, value resources.',
    avoid: 'People-pleasing, compromising core standards for comfort, frivolous luxury spending.',
    executionProtocol: 'Invest in visual and functional elegance. Establish clear reciprocal expectations in partnerships. Treat design as a competitive moat.',
    retrogradeProtocol: 'Retrograde Phase: Re-evaluate personal and commercial relationship contracts. Audit resource allocation; resolve lingering interpersonal frictions.',
  },
  sun: {
    mandate: 'Exercise sovereign executive authority, take unconditional responsibility, align actions with core purpose.',
    avoid: 'Ego defensiveness, authoritarian micromanagement, seeking external validation for obvious duties.',
    executionProtocol: 'Make clear decisions and own the outcome. Maintain physical vitality with morning sunlight and cardiovascular conditioning.',
    retrogradeProtocol: 'Sun never retrogrades in geocentric astronomy.',
  },
  moon: {
    mandate: 'Manage emotional resilience, pace workloads with natural circadian rhythms, cultivate mental focus.',
    avoid: 'Emotional reactivity, impulsive commitments made under temporary mood swings, erratic sleep.',
    executionProtocol: 'Track mental energy cycles. Prioritize sleep hygiene. Align collaborative sprints with waxing moon phases and reflective audits with waning phases.',
    retrogradeProtocol: 'Moon never retrogrades in geocentric astronomy.',
  },
  uranus: {
    mandate: 'Macro Insight: Challenge rigid paradigms, adopt forward-looking methods, and foster inventive thinking.',
    avoid: 'Conformity for the sake of comfort, resisting inevitable technological shifts.',
    executionProtocol: 'Identify stagnant legacy systems in your industry and design automated, non-conformist solutions.',
    retrogradeProtocol: 'Retrograde Phase: Internalize innovation. Refactor proprietary code and workflows away from public scrutiny.',
  },
  neptune: {
    mandate: 'Macro Vision: Develop subtle intuitive discernment, dissolve rigid identity, cultivate creative flow.',
    avoid: 'Vague promises, deceptive fine print, escapism through substances or procrastination.',
    executionProtocol: 'Insist on transparent verification in all deals. Channel subtle perception into artistic and architectural vision.',
    retrogradeProtocol: 'Retrograde Phase: Piercing illusions. Clarify murky situations with objective facts.',
  },
  pluto: {
    mandate: 'Macro Catharsis: Ruthlessly purge dead organizational weight, confront unspoken power dynamics, rebuild from zero.',
    avoid: 'Power struggles, clinging to decaying structures, fear of necessary creative destruction.',
    executionProtocol: 'Execute difficult amputations of failing initiatives. Rebuild operational structures with raw durability.',
    retrogradeProtocol: 'Retrograde Phase: Deep internal regeneration. Transform foundational habits at the root level.',
  },
};

const HOUSE_DOMAINS: Record<number, string> = {
  1: 'Self, vitality, physical appearance, sovereign direction.',
  2: 'Liquid capital, resources, family legacy, speech, value.',
  3: 'Courage, technical skills, communications, short travel, peer effort.',
  4: 'Home, emotional foundation, property, inner psychological peace.',
  5: 'Intellect, creative output, investments, strategic foresight.',
  6: 'Daily routines, problem-solving, debt resolution, competitive friction.',
  7: 'Direct partnerships, contracts, external agreements, diplomacy.',
  8: 'Transformation, shared resources, crisis management, deep research.',
  9: 'Higher wisdom, long-range strategy, legal ethics, mentorship.',
  10: 'Career output, public reputation, institutional authority, duty.',
  11: 'Network alliances, large-scale gains, group achievements, scale.',
  12: 'Solitude, subconscious processing, radical decluttering, foreign lands.',
};

/**
 * Generates tailored practical directives for a specific celestial body.
 */
export function getDirectiveForBody(body: CelestialBody): ActionGuidance {
  const base = BASE_PLANETARY_DIRECTIVES[body.key];
  const houseDomain = HOUSE_DOMAINS[body.house] || 'Core Life Arena';

  return {
    planetKey: body.key,
    mandate: `${base.mandate} Target arena: House ${body.house} (${houseDomain}).`,
    avoid: base.avoid,
    executionProtocol: `${base.executionProtocol} Focus on House ${body.house} matters.`,
    retrogradeProtocol: body.isRetrograde ? base.retrogradeProtocol : undefined,
  };
}

/**
 * Generates concrete Opportunities and Risks for the active Sookshmadasha combination.
 */
export function getSookshmaDirectives(
  mahaLord: BodyKey,
  antarLord: BodyKey,
  pratyLord: BodyKey,
  sookshmaLord: BodyKey
): SookshmaDirectives {
  const opportunities: string[] = [];
  const risks: string[] = [];

  // Generate tactical opportunities based on Sookshma Lord
  switch (sookshmaLord) {
    case 'mars':
      opportunities.push('High-velocity execution: Break through stubborn operational bottlenecks.');
      opportunities.push('Decisive action: Finalize contentious decisions without hesitation.');
      risks.push('Friction risk: Unnecessary verbal aggression in team settings.');
      risks.push('Physical risk: Rushing manual tasks resulting in minor accidents or strain.');
      break;
    case 'mercury':
      opportunities.push('Commercial precision: Negotiate contracts, publish written assets, audit metrics.');
      opportunities.push('Analytical focus: Solve intricate mathematical or technical bugs.');
      risks.push('Overthinking trap: Analysis paralysis delaying critical execution.');
      risks.push('Superficiality: Skimming complex agreements without deep verification.');
      break;
    case 'jupiter':
      opportunities.push('Strategic clarity: Align with experienced mentors, synthesize long-range roadmaps.');
      opportunities.push('Capital allocation: Invest in durable knowledge or ethical assets.');
      risks.push('Over-optimism: Underestimating operational friction and delivery costs.');
      risks.push('Dogma: Disregarding practical counter-arguments.');
      break;
    case 'venus':
      opportunities.push('Diplomatic alignment: Secure partnership agreements, refine design interfaces.');
      opportunities.push('Aesthetic refinement: Elevate presentation quality before key stakeholders.');
      risks.push('Compromise trap: Conceding critical standards to preserve temporary harmony.');
      risks.push('Indulgence: Excessive expenditure on non-essential aesthetics.');
      break;
    case 'saturn':
      opportunities.push('Structural endurance: Complete heavy unglamorous administration tasks.');
      opportunities.push('Systems audit: Enforce operating rules, clear compliance and technical debt.');
      risks.push('Pessimism: Delaying actionable opportunities out of excessive caution.');
      risks.push('Fatigue: Overworking without adequate hydration and physical rest.');
      break;
    case 'rahu':
      opportunities.push('Innovative breakthroughs: Explore unconventional approaches and creative solutions.');
      opportunities.push('Lateral thinking: Bypass conventional barriers through innovative methods.');
      risks.push('Illusion trap: Chasing shiny unproven shortcuts under pressure.');
      risks.push('Reputational risk: Engaging in questionable shortcuts that compromise trust.');
      break;
    case 'ketu':
      opportunities.push('Radical distillation: Eliminate redundant overhead, automate tasks, declutter.');
      opportunities.push('Deep focus: Solitary research unburdened by social distraction.');
      risks.push('Disengagement: Abandoning responsibilities prematurely.');
      risks.push('Alienation: Failing to communicate vital status updates to collaborators.');
      break;
    case 'sun':
      opportunities.push('Executive command: Take ownership of projects, present directly to leadership.');
      opportunities.push('Core alignment: Eliminate activities that contradict core principles.');
      risks.push('Ego flare-ups: Reacting defensively to constructive critique.');
      risks.push('Burnout: Assuming full burden without delegating operational tasks.');
      break;
    case 'moon':
      opportunities.push('Public resonance: Communicate with stakeholders, foster team alignment.');
      opportunities.push('Intuitive clarity: Calibrate pace with true cognitive capacity.');
      risks.push('Mood volatility: Making irrevocable commitments during transient emotional states.');
      risks.push('Over-sensitivity: Interpreting standard procedural feedback as personal attack.');
      break;
    default:
      opportunities.push('Focused execution within current planetary window.');
      risks.push('Observe routine discipline.');
      break;
  }

  // Cross-reference with Mahadasha Lord context
  if (mahaLord === 'saturn' && sookshmaLord === 'mars') {
    opportunities.push('Master disciplined force: High capacity for intense, controlled physical and engineering work.');
    risks.push('Structural friction: Frustration with slow institutional timelines.');
  } else if (mahaLord === 'jupiter' && sookshmaLord === 'mercury') {
    opportunities.push('Peak intellectual synthesis: High capacity for drafting whitepapers, code, or strategic plans.');
  }

  return {
    opportunities,
    risks,
    operationalFocus: `Active Cycle: ${mahaLord.toUpperCase()} Maha / ${antarLord.toUpperCase()} Antar / ${pratyLord.toUpperCase()} Pratyantar / ${sookshmaLord.toUpperCase()} Sookshma.`,
  };
}
