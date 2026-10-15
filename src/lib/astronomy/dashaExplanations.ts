import { BodyKey, DashaNode } from '@/types/astronomy';
import { NatalChartBlueprint } from '@/lib/astronomy/natal';

export interface DashaPeriodExplanation {
  title: string;
  sanskritName: string;
  theme: string;
  classicalMeaning: string;
  natalCrossVerification: string;
  manifestationVector: 'Breakthrough' | 'Structural Test' | 'Karmic Pivot' | 'Consolidation';
  vectorBadgeClass: string;
  careerImpact: string;
  financialImpact: string;
  relationalImpact: string;
  sanskritMantra: string; // Devanagari script primary
  sanskritMantraDevanagari: string;
  sanskritMantraIast: string;
  tacticalDo: string[];
  tacticalAvoid: string[];
}

// Classical Parashari Mahadasha Overviews with authentic Devanagari Sanskrit Beej Mantras
const MAHA_OVERVIEWS: Record<
  BodyKey,
  {
    title: string;
    archetype: string;
    coreMandate: string;
    mantraDevanagari: string;
    mantraIast: string;
  }
> = {
  sun: {
    title: 'Surya Mahadasha (6 Years)',
    archetype: 'Sovereign Authority & Executive Visibility',
    coreMandate: 'Purification of identity, stepping into leadership, formalizing civic duties, and establishing unwavering personal sovereignty.',
    mantraDevanagari: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः॥',
    mantraIast: 'Om Hram Hreem Hroum Sah Suryaya Namah',
  },
  moon: {
    title: 'Chandra Mahadasha (10 Years)',
    archetype: 'Emotional Fluency, Public Resonance & Receptivity',
    coreMandate: 'Cultivating emotional stability, domestic foundation, intuitive commercial timing, and relational receptivity.',
    mantraDevanagari: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः॥',
    mantraIast: 'Om Shram Shreem Shroum Sah Chandraya Namah',
  },
  mars: {
    title: 'Mangala Mahadasha (7 Years)',
    archetype: 'Strategic Conquest, Technical Vigor & Real Estate',
    coreMandate: 'Relentless execution, technical mastery, defending boundaries, physical endurance, and bold initiatives.',
    mantraDevanagari: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः॥',
    mantraIast: 'Om Kram Kreem Kroum Sah Bhaumaya Namah',
  },
  rahu: {
    title: 'Rahu Mahadasha (18 Years)',
    archetype: 'Unconventional Ambition, Catalytic Outlier Growth & Illusion',
    coreMandate: 'Navigating rapid worldly ascent, foreign connections, technological disruption, while fiercely avoiding ethical compromise.',
    mantraDevanagari: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः॥',
    mantraIast: 'Om Bhram Bhreem Bhroum Sah Rahave Namah',
  },
  jupiter: {
    title: 'Guru Mahadasha (16 Years)',
    archetype: 'Dharmic Wisdom, Macro Expansion & Institutional Honor',
    coreMandate: 'Expanding intellectual horizons, ethical leadership, strategic capital deployment, mentorship, and spiritual synthesis.',
    mantraDevanagari: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः॥',
    mantraIast: 'Om Gram Greem Groum Sah Gurave Namah',
  },
  saturn: {
    title: 'Shani Mahadasha (19 Years)',
    archetype: 'Karmic Accounting, Institutional Duty & Iron Endurance',
    coreMandate: 'Shedding all superficial shortcuts, enduring austere training, mastering organizational discipline, and building permanent structures.',
    mantraDevanagari: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः॥',
    mantraIast: 'Om Pram Preem Proum Sah Shanaishcharaya Namah',
  },
  mercury: {
    title: 'Budha Mahadasha (17 Years)',
    archetype: 'Commercial Precision, Analytical Acumen & Communication',
    coreMandate: 'Scaling trade systems, intellectual agility, contractual negotiations, diversification, and analytical rigor.',
    mantraDevanagari: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः॥',
    mantraIast: 'Om Bram Breem Broum Sah Budhaya Namah',
  },
  ketu: {
    title: 'Ketu Mahadasha (7 Years)',
    archetype: 'Radical Detachment, Deep Subconscious Rest & Sovereignty',
    coreMandate: 'Stripping away material illusions, forensic introspection, releasing obsolete identities, and spiritual liberation.',
    mantraDevanagari: 'ॐ कें केतवे नमः॥',
    mantraIast: 'Om Kem Ketave Namah',
  },
  venus: {
    title: 'Shukra Mahadasha (20 Years)',
    archetype: 'Refined Harmony, Diplomatic Wealth & Creative Luxury',
    coreMandate: 'Cultivating strategic alliances, aesthetic polish, asset liquidity, marital reciprocity, and cultural elevation.',
    mantraDevanagari: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः॥',
    mantraIast: 'Om Dram Dreem Droum Sah Shukraya Namah',
  },
  uranus: { title: 'Aruna Cycle', archetype: 'Systemic Breakthrough', coreMandate: 'Radical innovation.', mantraDevanagari: 'ॐ अरुणाय नमः॥', mantraIast: 'Om Arunaya Namah' },
  neptune: { title: 'Varuna Cycle', archetype: 'Visionary Synthesis', coreMandate: 'Intuitive clarity.', mantraDevanagari: 'ॐ वरुणाय नमः॥', mantraIast: 'Om Varunaya Namah' },
  pluto: { title: 'Yama Cycle', archetype: 'Karmic Metamorphosis', coreMandate: 'Deep regenerative transformation.', mantraDevanagari: 'ॐ यमाय नमः॥', mantraIast: 'Om Yamaya Namah' },
};

/**
 * Builds an authentic, comprehensive explanation for any Mahadasha - Antardasha combination
 * cross-verified with the user's natal chart.
 */
export function explainDashaPeriod(
  mahaNode: DashaNode,
  antarNode: DashaNode,
  natalBlueprint: NatalChartBlueprint | null
): DashaPeriodExplanation {
  const mahaLord = mahaNode.lord;
  const antarLord = antarNode.lord;

  const mahaMeta = MAHA_OVERVIEWS[mahaLord] || MAHA_OVERVIEWS.jupiter;
  const antarMeta = MAHA_OVERVIEWS[antarLord] || MAHA_OVERVIEWS.saturn;

  const title = `${mahaLord.toUpperCase()} - ${antarLord.toUpperCase()} Antardasha`;
  const sanskritName = `${mahaLord.charAt(0).toUpperCase() + mahaLord.slice(1)}-${antarLord.charAt(0).toUpperCase() + antarLord.slice(1)} Dasha`;

  // Look up natal placements of both lords
  let natalVerification = 'Natal cross-verification pending profile loading.';
  let mutualRelationship = 'Neutral alignment';
  let vector: DashaPeriodExplanation['manifestationVector'] = 'Consolidation';
  let badgeClass = 'bg-cyan-950/80 text-cyan-300 border-cyan-800';

  if (natalBlueprint) {
    const pMaha = natalBlueprint.planets.find((p) => p.key === mahaLord);
    const pAntar = natalBlueprint.planets.find((p) => p.key === antarLord);

    if (pMaha && pAntar) {
      const houseDiff = ((pAntar.house - pMaha.house + 12) % 12) + 1;
      const mahaHouses = pMaha.housesRuled.join(', ');
      const antarHouses = pAntar.housesRuled.join(', ');

      if ([1, 4, 7, 10].includes(houseDiff)) {
        mutualRelationship = `Mutual Kendra (${houseDiff}th house connection): Dynamic operational collaboration, high public accountability, and mutual empowerment between the two planetary rulers.`;
        vector = 'Breakthrough';
        badgeClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      } else if ([5, 9].includes(houseDiff)) {
        mutualRelationship = `Mutual Trikona (${houseDiff}th house connection): Highly auspicious dharmic flow. Grace, strategic expansion, and low-friction luck in the affairs governed by these planets.`;
        vector = 'Breakthrough';
        badgeClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      } else if (houseDiff === 6 || houseDiff === 8) {
        mutualRelationship = `Shashtashtaka Position (6/8 mutual distance): Classical friction and karmic testing. Prone to procedural disputes, health sensitivity, or operational restructuring before resolution.`;
        vector = 'Structural Test';
        badgeClass = 'bg-rose-950/80 text-rose-300 border-rose-800';
      } else if (houseDiff === 2 || houseDiff === 12) {
        mutualRelationship = `Dwidwadasa Position (2/12 mutual distance): Heavy capital reallocation, foreign ties, unearned expenditures, or relocation. Energy transfers rapidly between sectors.`;
        vector = 'Karmic Pivot';
        badgeClass = 'bg-amber-950/80 text-amber-300 border-amber-800';
      } else {
        mutualRelationship = `Mutual Alignment: Steady reciprocal momentum.`;
      }

      natalVerification = `In your Janma Kundli, Mahadasha lord ${pMaha.name} rules House(s) ${mahaHouses || 'None'} (Stationed in House ${pMaha.house}, Dignity: ${pMaha.dignity}, Power: ${pMaha.powerPercentage}%), while Antardasha lord ${pAntar.name} rules House(s) ${antarHouses || 'None'} (Stationed in House ${pAntar.house}, Dignity: ${pAntar.dignity}, Power: ${pAntar.powerPercentage}%). ${mutualRelationship}`;
    }
  }

  // Classical synthesis based on pairs
  const theme = `${mahaMeta.archetype} channeled through ${antarMeta.archetype}`;
  let classicalMeaning = `Under ${mahaLord.toUpperCase()} Mahadasha, the overarching sovereign agenda is set by ${mahaMeta.title}. The active sub-governor ${antarLord.toUpperCase()} acts as the operational executor, applying its specific archetypal lens to manifest events.`;

  // Specific major combinations
  if (mahaLord === 'jupiter' && antarLord === 'saturn') {
    classicalMeaning = 'Guru-Shani Dasha (The Architect & The Judge): Classical period of grand vision colliding with rigorous reality. Jupiter expands aspirations while Saturn demands institutional compliance, legal precision, and elimination of shortcuts. Enduring institutional foundation built through patience.';
  } else if (mahaLord === 'saturn' && antarLord === 'mercury') {
    classicalMeaning = 'Shani-Budha Dasha (Systemic Commercial Mastery): Saturn provides the iron discipline and patience, while Mercury injects sharp analytical calculation and commercial contracts. Highly lucrative for technical systems, formal writing, and institutional diplomacy.';
  } else if (mahaLord === 'rahu' && antarLord === 'jupiter') {
    classicalMeaning = 'Rahu-Guru Dasha (Guru Chandal Synthesis): A pivotal threshold period. The native is propelled into foreign territories, unconventional promotions, or intense philosophical questioning. The key test is maintaining moral and ethical integrity despite seductive shortcuts.';
  } else if (mahaLord === 'saturn' && antarLord === 'saturn') {
    classicalMeaning = 'Shani Swabhukti (The Foundation Stone): The opening gate of Saturn Mahadasha. A complete structural audit of life obligations. Weak commitments are ruthlessly pruned; authentic long-term duties receive permanent scaffolding.';
  } else if (mahaLord === 'venus' && antarLord === 'mars') {
    classicalMeaning = 'Shukra-Mangala Dasha (Passion & Execution): Creative desire and aesthetic taste merge with fiery decisive drive. Excellent for tangible property acquisitions and high-energy campaigns; beware impulsive relational clashes.';
  }

  return {
    title,
    sanskritName,
    theme,
    classicalMeaning,
    natalCrossVerification: natalVerification,
    manifestationVector: vector,
    vectorBadgeClass: badgeClass,
    careerImpact: `Direct activation of vocational duties through ${antarLord.toUpperCase()}'s methods. Focus on structured delivery and institutional accountability.`,
    financialImpact: `Capital flow requires deliberate procedural hygiene. Favor asset consolidation over speculative volatility.`,
    relationalImpact: `Bilateral reciprocity tested against long-term commitment. Maintain clear emotional and contractual boundaries.`,
    sanskritMantra: antarMeta.mantraDevanagari,
    sanskritMantraDevanagari: antarMeta.mantraDevanagari,
    sanskritMantraIast: antarMeta.mantraIast,
    tacticalDo: [
      `Align daily initiatives with ${antarLord.toUpperCase()}'s archetypal strengths.`,
      `Conduct exhaustive audits of duties governed by this planetary pair.`,
      `Recite the authentic Sanskrit vibration for smooth energetic resonance.`,
    ],
    tacticalAvoid: [
      `Avoid forcing outcomes through impatient shortcuts or emotional bravado.`,
      `Do not overlook fine-print compliance or institutional protocols.`,
    ],
  };
}
