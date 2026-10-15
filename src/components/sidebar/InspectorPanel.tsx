import React from 'react';
import { useAstrology } from '@/context/AstrologyContext';
import { BodyKey, CelestialBody } from '@/types/astronomy';
import { ZODIAC_SIGNS, NAKSHATRAS } from '@/lib/astronomy/constants';
import {
  getSignDetail,
  getHouseDetail,
  getNakshatraDetail,
  getAspectsCastingOnSign,
  getAspectsCastingOnNakshatra,
  getAspectSynthesis,
  IncomingAspectRay,
} from '@/lib/astronomy/dispositors';
import {
  NAISARGIKA_PLANETARY_RELATIONSHIPS,
  getVedicSignRelationships,
  getNakshatraTarabala,
  getNakshatraDeepRelationships,
} from '@/lib/astronomy/relationships';
import { buildElaboratePlanetaryAnalysis } from '@/lib/guidance/elaborateGuidance';
import { VedicRahuIcon, VedicKetuIcon } from '@/components/canvas/wheel/WheelDefinitions';

// Authentic Vedic deities, mantras, and gemstones for celestial bodies
const VEDIC_LORE: Record<
  string,
  {
    deity: string;
    beejMantra: string;
    beejMantraDevanagari: string;
    gemstone: string;
    day: string;
    nature: string;
    guna: string;
  }
> = {
  sun: {
    deity: 'Lord Surya Narayana (Solar Divinity)',
    beejMantra: 'Om Hram Hreem Hroum Sah Suryaya Namah',
    beejMantraDevanagari: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः॥',
    gemstone: 'Ruby (Manikya)',
    day: 'Sunday (Ravivar)',
    nature: 'Kshatriya / Royal Sattva',
    guna: 'Sattva',
  },
  moon: {
    deity: 'Lord Chandra / Somadeva (Mind & Waters)',
    beejMantra: 'Om Shram Shreem Shroum Sah Chandraya Namah',
    beejMantraDevanagari: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः॥',
    gemstone: 'Natural Pearl (Mukta)',
    day: 'Monday (Somavar)',
    nature: 'Vaishya / Emotional Nurturance',
    guna: 'Sattva',
  },
  mars: {
    deity: 'Lord Mangala / Kartikeya (Commander of Gods)',
    beejMantra: 'Om Kram Kreem Kroum Sah Bhaumaya Namah',
    beejMantraDevanagari: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः॥',
    gemstone: 'Red Coral (Moonga)',
    day: 'Tuesday (Mangalvar)',
    nature: 'Kshatriya / Primal Energy & Courage',
    guna: 'Tamas',
  },
  mercury: {
    deity: 'Lord Budha / Maha Vishnu (Discriminative Intellect)',
    beejMantra: 'Om Bram Breem Broum Sah Budhaya Namah',
    beejMantraDevanagari: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः॥',
    gemstone: 'Emerald (Panna)',
    day: 'Wednesday (Budhavar)',
    nature: 'Vaishya / Logic & Commerce',
    guna: 'Rajas',
  },
  jupiter: {
    deity: 'Guru Brihaspati / Lord Brahma (Divine Preceptor)',
    beejMantra: 'Om Gram Greem Groum Sah Gurave Namah',
    beejMantraDevanagari: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः॥',
    gemstone: 'Yellow Sapphire (Pukhraj)',
    day: 'Thursday (Guruvar)',
    nature: 'Brahmin / Supreme Wisdom & Dharma',
    guna: 'Sattva',
  },
  venus: {
    deity: 'Shukracharya / Goddess Mahalakshmi (Harmony & Beauty)',
    beejMantra: 'Om Dram Dreem Droum Sah Shukraya Namah',
    beejMantraDevanagari: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः॥',
    gemstone: 'Diamond (Heera) or White Zircon',
    day: 'Friday (Shukravar)',
    nature: 'Brahmin / Devotion, Fine Arts & Rejuvenation',
    guna: 'Rajas',
  },
  saturn: {
    deity: 'Lord Shani Dev / Lord Yama (Dispenser of Karma)',
    beejMantra: 'Om Pram Preem Proum Sah Shanaishcharaya Namah',
    beejMantraDevanagari: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः॥',
    gemstone: 'Blue Sapphire (Neelam)',
    day: 'Saturday (Shanivar)',
    nature: 'Shudra / Discipline, Austerity & Perseverance',
    guna: 'Tamas',
  },
  rahu: {
    deity: 'Swarbhanu / Goddess Durga (Cosmic Maya & Ambition)',
    beejMantra: 'Om Bhram Bhreem Bhroum Sah Rahave Namah',
    beejMantraDevanagari: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः॥',
    gemstone: 'Hessonite Garnet (Gomed)',
    day: 'Saturday / Twilight',
    nature: 'Chandal / Innovation, Unconventional Mastery',
    guna: 'Tamas',
  },
  ketu: {
    deity: 'Lord Ganesha / Matsya Avatar (Spiritual Liberation)',
    beejMantra: 'Om Kem Ketave Namah',
    beejMantraDevanagari: 'ॐ कें केतवे नमः॥',
    gemstone: "Cat's Eye (Vaidurya)",
    day: 'Tuesday / Midnight',
    nature: 'Ascetic / Moksha, Detachment & Mystic Intuition',
    guna: 'Tamas',
  },
};

export function InspectorPanel({ onClose }: { onClose: () => void }) {
  const {
    inspectedEntity,
    displayedBodies,
    aspects,
    sky,
    chartEnergy,
    strategicFocus,
    natalBlueprint,
  } = useAstrology();

  if (!inspectedEntity) return null;

  // ----------------------------------------------------
  // 1. INSPECT PLANET
  // ----------------------------------------------------
  if (inspectedEntity.type === 'planet') {
    const body = displayedBodies.find((b) => b.key === inspectedEntity.id) || displayedBodies[0];
    const lore = VEDIC_LORE[body.key];
    const relationships = NAISARGIKA_PLANETARY_RELATIONSHIPS[body.key];
    const energy = chartEnergy.planetEnergies.find((p) => p.planet === body.key);
    const elaborate = buildElaboratePlanetaryAnalysis(body, displayedBodies, aspects, strategicFocus, natalBlueprint);

    // Active aspects received by this planet
    const activeAspectsOnBody = aspects
      .filter((a) => a.body1 === body.key || a.body2 === body.key)
      .map((a) => {
        const partnerKey = a.body1 === body.key ? a.body2 : a.body1;
        const partner = displayedBodies.find((b) => b.key === partnerKey);
        const synthesis = partner ? getAspectSynthesis(a, body, partner) : a.description;
        return { aspect: a, partner, synthesis };
      });

    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Header with Close */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            {body.key === 'rahu' ? (
              <svg viewBox="0 0 36 36" className="w-8 h-8">
                <VedicRahuIcon x={18} y={18} size={28} />
              </svg>
            ) : body.key === 'ketu' ? (
              <svg viewBox="0 0 36 36" className="w-8 h-8">
                <VedicKetuIcon x={18} y={18} size={28} />
              </svg>
            ) : (
              <span className="text-2xl" style={{ color: body.color }}>
                {body.symbol}
              </span>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-100 text-sm">{body.name}</h3>
                <span className="text-cyan-400 font-mono text-xs">({body.sanskritName})</span>
              </div>
              <p className="text-[10px] text-slate-400">
                House {body.house} • {ZODIAC_SIGNS[body.signIndex].name} ({body.signDegree.toFixed(2)}°)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg flex items-center gap-1"
          >
            ✕ Back
          </button>
        </div>

        {/* Authentic Parashari Shadbala Metrics strictly for 7 Classical Grahas */}
        {energy && energy.hasShadbala && (
          <div className="p-3 bg-slate-900/80 border border-cyan-800/40 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] uppercase font-bold text-cyan-300 tracking-wider">
                Classical Parashari Shadbala (BPHS)
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  energy.isBalavan
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                }`}
              >
                {energy.isBalavan
                  ? `Balavan (${(energy.shadbalaRatio * 100).toFixed(0)}% of Req)`
                  : 'Alpabala (Below Baseline)'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
                <div className="text-[9.5px] text-slate-400">Total Virupas</div>
                <div className="text-xs font-bold font-mono text-cyan-300">
                  {energy.totalVirupas}
                </div>
                <div className="text-[8.5px] text-slate-500 font-mono">
                  ({energy.totalRupas} Rupas)
                </div>
              </div>
              <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
                <div className="text-[9.5px] text-slate-400">Required BPHS</div>
                <div className="text-xs font-bold font-mono text-slate-200">
                  {energy.requiredVirupas}
                </div>
                <div className="text-[8.5px] text-slate-500 font-mono">Virupas</div>
              </div>
              <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
                <div className="text-[9.5px] text-slate-400">Strength Ratio</div>
                <div
                  className={`text-xs font-bold font-mono ${
                    energy.shadbalaRatio >= 1 ? 'text-emerald-300' : 'text-amber-300'
                  }`}
                >
                  {(energy.shadbalaRatio * 100).toFixed(0)}%
                </div>
                <div className="text-[8.5px] text-slate-500 font-mono">
                  Rank #{energy.rank} of 7
                </div>
              </div>
            </div>

            {/* Classical Parashari Threshold Explanatory Callout */}
            <div className="p-2 bg-slate-950/90 border border-slate-800/80 rounded-lg text-[9.5px] text-slate-300 leading-relaxed space-y-1">
              <div className="flex items-center gap-1 text-cyan-300 font-semibold">
                <span>✦ Parashari Standard (BPHS Ch. 27):</span>
              </div>
              <p>
                In classical Vedic Jyotish, required Virupas (Sun: 390, Moon: 360, Mars: 300, Mercury: 420, Jupiter: 390, Venus: 330, Saturn: 300) mark the minimum operational baseline. Planets with ratio ≥ 1.0 are designated <strong className="text-emerald-300">Balavan</strong>, possessing the functional capacity to manifest their portfolio.
              </p>
            </div>

            {/* 6-Fold Sub-Balas */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] pt-1.5 border-t border-slate-800/80">
              <div className="flex justify-between text-slate-400">
                <span>Sthana Bala (Positional):</span>
                <span className="text-slate-200 font-mono">{energy.sthanaBala} V</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dig Bala (Directional):</span>
                <span className="text-slate-200 font-mono">{energy.digBala} V</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Kala Bala (Temporal):</span>
                <span className="text-slate-200 font-mono">{energy.kalaBala} V</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Chesta Bala (Motional):</span>
                <span className="text-slate-200 font-mono">{energy.chestaBala} V</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Naisargika (Natural):</span>
                <span className="text-slate-200 font-mono">{energy.naisargikaBala} V</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Drik Bala (Aspectual):</span>
                <span className="text-slate-200 font-mono">{energy.drikBala} V</span>
              </div>
            </div>
          </div>
        )}

        {energy && !energy.hasShadbala && (
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider">
                Classical Parashari Shadbala (BPHS)
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800/80 text-slate-400 border border-slate-700">
                Non-Physical / Chhaya Graha
              </span>
            </div>
            <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-lg text-[10px] text-slate-300 leading-relaxed space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-300/90 font-semibold">
                <span>✦ Parashari Standard (BPHS Ch. 27):</span>
              </div>
              <p>
                In Maharishi Parashara&apos;s classical system, Shadbala (Six-Fold Strength) is mathematically defined strictly for the seven physical grahas (Surya, Chandra, Mangala, Budha, Guru, Shukra, and Shani) possessing visible physical discs and distinct orbital ray dynamics.
              </p>
              <p className="text-slate-400 text-[9.5px]">
                As shadow intersection points (Chhaya Grahas) or modern outer bodies, their potency is assessed through sign dispositorship, house placement, and planetary aspects rather than 6-fold virupa quantification.
              </p>
            </div>
          </div>
        )}

        {/* Aspects Received & Drishti Interlocking */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Active Aspect Chords & Drishti Rays on {body.name}:
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">
              {activeAspectsOnBody.length} Active
            </span>
          </div>

          {activeAspectsOnBody.length > 0 ? (
            <div className="space-y-1.5">
              {activeAspectsOnBody.map(({ aspect, partner, synthesis }, idx) => (
                <div
                  key={`body-asp-${idx}`}
                  className="p-2 bg-slate-950/80 border border-slate-800 rounded-lg text-[10px] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          aspect.isHarmonious
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {aspect.type}
                      </span>
                      <span className="font-semibold text-slate-200">
                        with {partner?.name}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">
                      orb ±{aspect.orb.toFixed(1)}°
                    </span>
                  </div>
                  <p className="text-[9.5px] text-cyan-100/90 leading-relaxed">
                    {synthesis}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2 bg-slate-950/60 border border-slate-800/80 rounded-lg text-[10px] text-slate-400 italic">
              No direct acute aspect chords currently intersecting {body.name}. Operating with unimpeded solitary velocity.
            </div>
          )}
        </div>

        {/* Naisargika Sambandha: Friendly (Green) and Enemy (Red) Planets */}
        {relationships && (
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Permanent Vedic Planetary Friendships (Naisargika Sambandha):
            </span>

            {/* Friendly Planets: GREEN background boxes */}
            <div>
              <span className="text-[9.5px] font-semibold text-emerald-400 block mb-1">
                Mitra (Natural Friends):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {relationships.friends.length > 0 ? (
                  relationships.friends.map((fKey) => {
                    const friendBody = displayedBodies.find((b) => b.key === fKey);
                    return (
                      <span
                        key={`friend-${fKey}`}
                        className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 shadow-sm"
                      >
                        <span style={{ color: friendBody?.color }}>{friendBody?.symbol || '✦'}</span>
                        <span>{friendBody?.name || fKey}</span>
                      </span>
                    );
                  })
                ) : (
                  <span className="text-[10px] text-slate-500 italic">None</span>
                )}
              </div>
            </div>

            {/* Enemy Planets: RED background boxes */}
            <div>
              <span className="text-[9.5px] font-semibold text-rose-400 block mb-1">
                Shatru (Natural Enemies):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {relationships.enemies.length > 0 ? (
                  relationships.enemies.map((eKey) => {
                    const enemyBody = displayedBodies.find((b) => b.key === eKey);
                    return (
                      <span
                        key={`enemy-${eKey}`}
                        className="bg-rose-950/80 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 shadow-sm"
                      >
                        <span style={{ color: enemyBody?.color }}>{enemyBody?.symbol || '✦'}</span>
                        <span>{enemyBody?.name || eKey}</span>
                      </span>
                    );
                  })
                ) : (
                  <span className="text-[10px] text-slate-500 italic">None</span>
                )}
              </div>
            </div>

            {/* Neutral Planets */}
            <div>
              <span className="text-[9.5px] font-semibold text-slate-400 block mb-1">
                Sama (Neutrals):
              </span>
              <div className="flex flex-wrap gap-1">
                {relationships.neutrals.map((nKey) => {
                  const nBody = displayedBodies.find((b) => b.key === nKey);
                  return (
                    <span
                      key={`neutral-${nKey}`}
                      className="bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[9.5px]"
                    >
                      {nBody?.name.split(' ')[0] || nKey}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Vedic Lore & Remedy */}
        {lore && (
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 text-[10.5px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Vedic Divinity, Mantra & Remediation:
            </span>
            <div className="flex justify-between">
              <span className="text-slate-400">Presiding Deity:</span>
              <span className="text-slate-200 font-semibold">{lore.deity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Gemstone (Ratna):</span>
              <span className="text-cyan-300 font-medium">{lore.gemstone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Governing Day:</span>
              <span className="text-slate-300">{lore.day}</span>
            </div>
            <div className="p-2.5 bg-slate-950/90 border border-slate-800 rounded-lg space-y-1">
              <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5 tracking-wider">
                Vedic Beej Mantra (देवनागरी संस्कृत):
              </span>
              <p className="font-sans text-cyan-300 text-sm font-semibold select-all tracking-wide">
                {lore.beejMantraDevanagari}
              </p>
              <p className="font-mono text-slate-400 text-[10px] select-all">
                {lore.beejMantra}
              </p>
            </div>
          </div>
        )}

        {/* Natal Kundli Cross-Verification & Manifestation Vector */}
        {elaborate.natalCrossVerification && (
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Natal Kundli Cross-Verification
              </span>
              <span
                className={`text-[9.5px] px-2 py-0.5 rounded font-mono font-bold border ${elaborate.natalCrossVerification.vectorBadgeClass}`}
              >
                {elaborate.natalCrossVerification.vectorLabel}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
              <div>
                <span className="text-slate-500">Sky Dignity: </span>
                <span className="text-cyan-300 font-semibold capitalize">
                  {elaborate.natalCrossVerification.transitDignity}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Natal Dignity: </span>
                <span className="text-slate-200 capitalize">
                  {elaborate.natalCrossVerification.natalDignity}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Natal Power: </span>
                <span className="text-emerald-400">
                  {elaborate.natalCrossVerification.natalPowerPercentage}%
                </span>
              </div>
              <div>
                <span className="text-slate-500">Rules House(s): </span>
                <span className="text-slate-300">
                  {elaborate.natalCrossVerification.natalHouseOwned.length
                    ? elaborate.natalCrossVerification.natalHouseOwned.join(', ')
                    : 'None'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-300 block">
                Classical Parashari Synthesis:
              </span>
              <p className="text-[10.5px] text-slate-300 leading-relaxed bg-slate-950/50 p-2 rounded border border-slate-800/60">
                {elaborate.natalCrossVerification.synthesis}
              </p>
            </div>

            <div className="p-2 bg-emerald-950/20 border border-emerald-900/50 rounded-lg space-y-0.5">
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                Natal Authorization Directive:
              </span>
              <p className="text-[10.5px] text-emerald-200/90 leading-relaxed">
                {elaborate.natalCrossVerification.operationalDirective}
              </p>
            </div>
          </div>
        )}

        {/* Strategic Operational Guidance */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Strategic Operational Mandate
            </span>
            <span className="text-[10px] text-cyan-400 font-medium">
              {elaborate.dignity.toUpperCase()}
            </span>
          </div>
          <p className="text-[11px] text-slate-200 leading-relaxed">
            {elaborate.energyAnalysis}
          </p>
          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <span className="text-[10px] font-semibold text-emerald-400 block">
              Core Action Directives:
            </span>
            <ul className="list-disc pl-4 space-y-0.5 text-[10.5px] text-slate-300 leading-relaxed">
              {elaborate.mandate.slice(0, 2).map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. INSPECT SIGN
  // ----------------------------------------------------
  if (inspectedEntity.type === 'sign') {
    const detail = getSignDetail(inspectedEntity.id, displayedBodies);
    const signRels = getVedicSignRelationships(inspectedEntity.id);
    const incomingAspects = getAspectsCastingOnSign(inspectedEntity.id, displayedBodies);

    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Header with Close */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl text-cyan-400">{detail.sign.symbol}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-100 text-sm">{detail.sign.name}</h3>
                <span className="text-cyan-400 font-mono text-xs">({detail.sign.sanskritName})</span>
              </div>
              <p className="text-[10px] text-slate-400">
                {detail.sign.element} • {detail.sign.modality} • {detail.sign.startDegree}° – {detail.sign.endDegree}° Sidereal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg flex items-center gap-1"
          >
            ✕ Back
          </button>
        </div>

        {/* Friendly and Enemy Signs (Green and Red Badges) */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Zodiac Alignment (Harmonic Trikona & Shadashtaka):
          </span>

          {/* Friendly Signs: Green background */}
          <div>
            <span className="text-[9.5px] font-semibold text-emerald-400 block mb-1">
              Friendly Harmonic Signs (Trikona Allies & Upachaya):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {signRels.friendlySigns.map((sIdx) => {
                const fSign = ZODIAC_SIGNS[sIdx];
                return (
                  <span
                    key={`sign-friend-${sIdx}`}
                    className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 shadow-sm"
                  >
                    <span>{fSign.symbol}</span>
                    <span>{fSign.name}</span>
                    <span className="text-[9px] opacity-75">({fSign.element})</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Enemy Signs: Red background */}
          <div>
            <span className="text-[9.5px] font-semibold text-rose-400 block mb-1">
              Inimical Signs (Shadashtaka 6th/8th Friction):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {signRels.enemySigns.map((sIdx) => {
                const eSign = ZODIAC_SIGNS[sIdx];
                return (
                  <span
                    key={`sign-enemy-${sIdx}`}
                    className="bg-rose-950/80 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 shadow-sm"
                  >
                    <span>{eSign.symbol}</span>
                    <span>{eSign.name}</span>
                    <span className="text-[9px] opacity-75">({eSign.element})</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Friendly and Enemy Planets for this Sign */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Planetary Affinities for {detail.sign.name} (Graha Sambandha):
          </span>

          {/* Friendly Planets */}
          <div>
            <span className="text-[9.5px] font-semibold text-emerald-400 block mb-1">
              Mitra Grahas (Natural Allied Planets for {detail.lord.name}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {signRels.friendlyPlanets.length > 0 ? (
                signRels.friendlyPlanets.map((pKey) => {
                  const pBody = displayedBodies.find((b) => b.key === pKey);
                  return (
                    <span
                      key={`sign-p-friend-${pKey}`}
                      className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 shadow-sm"
                    >
                      <span style={{ color: pBody?.color }}>{pBody?.symbol || '✦'}</span>
                      <span>{pBody?.name || pKey}</span>
                    </span>
                  );
                })
              ) : (
                <span className="text-[10px] text-slate-500 italic">None</span>
              )}
            </div>
          </div>

          {/* Enemy Planets */}
          <div>
            <span className="text-[9.5px] font-semibold text-rose-400 block mb-1">
              Shatru Grahas (Inimical / Friction Planets):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {signRels.enemyPlanets.length > 0 ? (
                signRels.enemyPlanets.map((pKey) => {
                  const pBody = displayedBodies.find((b) => b.key === pKey);
                  return (
                    <span
                      key={`sign-p-enemy-${pKey}`}
                      className="bg-rose-950/80 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 shadow-sm"
                    >
                      <span style={{ color: pBody?.color }}>{pBody?.symbol || '✦'}</span>
                      <span>{pBody?.name || pKey}</span>
                    </span>
                  );
                })
              ) : (
                <span className="text-[10px] text-slate-500 italic">None</span>
              )}
            </div>
          </div>
        </div>

        {/* Incoming Parashari Drishti (Aspect Rays) on this Sign */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Incoming Parashari Drishti (Aspect Rays) on {detail.sign.name}:
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">
              {incomingAspects.length} Rays
            </span>
          </div>

          {incomingAspects.length > 0 ? (
            <div className="space-y-1.5">
              {incomingAspects.map((ray, idx) => (
                <div
                  key={`ray-sign-${idx}`}
                  className="p-2 bg-slate-950/80 border border-slate-800 rounded-lg text-[10px] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: ray.castingBody.color }} className="font-bold">
                        {ray.castingBody.symbol}
                      </span>
                      <span className="font-semibold text-slate-200">
                        {ray.castingBody.name}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-[9px] font-mono">
                      {ray.aspectType}
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-300 leading-relaxed">
                    {ray.effect}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2 bg-slate-950/60 border border-slate-800/80 rounded-lg text-[10px] text-slate-400 italic">
              No direct external Parashari special aspect rays currently impinging on this sign arc.
            </div>
          )}
        </div>

        {/* Sign Lord & Dispositor Dynamics */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 text-[10.5px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Sign Lord (Rashi Adhipati) & Dispositor Dynamics:
          </span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <span style={{ color: detail.lord.color }}>{detail.lord.symbol}</span>
              <span className="font-bold">{detail.lord.name}</span>
              <span className="text-slate-400 text-[10px]">({detail.lord.sanskritName})</span>
            </div>
            <span className="text-cyan-300 font-mono font-semibold">
              in House {detail.lordHouse}
            </span>
          </div>
          <div className="text-slate-400">
            Resides in {detail.lordSign.name} ({detail.lordDegree.toFixed(1)}°) • Dignity: {detail.lord.dignity}
          </div>
          <div className="p-2 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-300 leading-relaxed">
            {detail.dispositorMeaning}
          </div>
        </div>

        {/* Celestial Bodies Currently Transiting this sign & Inception of Effects */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Celestial Inhabitants Currently Transiting {detail.sign.name}:
          </span>
          {detail.residentBodies.length > 0 ? (
            <div className="space-y-2">
              {detail.residentBodies.map((b) => {
                // Aspects falling directly on this resident planet
                const bAspects = aspects.filter((a) => a.body1 === b.key || a.body2 === b.key);
                return (
                  <div
                    key={b.key}
                    className="p-2 bg-slate-950/90 border border-slate-800 rounded-lg text-[10px] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span style={{ color: b.color }} className="text-sm">
                          {b.symbol}
                        </span>
                        <span className="font-bold text-slate-100">{b.name}</span>
                        <span className="text-cyan-400 font-mono">
                          {b.signDegree.toFixed(2)}°
                        </span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 capitalize font-medium">
                        {b.dignity}
                      </span>
                    </div>

                    <div className="text-[9.5px] text-slate-400">
                      Occupies Nakshatra Pada {b.pada} • Speed: {b.isRetrograde ? 'Retrograde (Vakra)' : 'Direct (Margi)'}
                    </div>

                    {bAspects.length > 0 && (
                      <div className="pt-1 border-t border-slate-800/60 text-[9px] text-slate-400">
                        <span className="text-cyan-300 font-medium">Aspects Received: </span>
                        {bAspects.map((ba, i) => {
                          const partnerKey = ba.body1 === b.key ? ba.body2 : ba.body1;
                          const partner = displayedBodies.find((p) => p.key === partnerKey);
                          return (
                            <span key={i} className="inline-block mr-1.5 text-slate-300">
                              {ba.type} by {partner?.name} (±{ba.orb.toFixed(1)}°)
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-lg text-[10px] text-slate-300 leading-relaxed space-y-1">
              <span className="font-semibold text-cyan-300 block">
                Sunya Rashi (Open Receptive Field):
              </span>
              <p>
                {detail.sign.name} is currently unoccupied by resident celestial bodies. In classical Vedic mechanics, an unoccupied sign operates with zero internal friction and functions as an open channel. Its karmic expression is entirely governed by its Dispositor Lord (<strong className="text-slate-100">{detail.lord.name}</strong> transiting in House {detail.lordHouse}) and activated whenever transiting planets cast external Drishti rays across its arc.
              </p>
            </div>
          )}
        </div>

        {/* Deep Inception Synthesis for this Sign */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider block">
            Inception Synthesis:
          </span>
          <p className="text-[10.5px] text-slate-200 leading-relaxed">
            As a <strong className="text-cyan-300">{detail.sign.element} / {detail.sign.modality}</strong> archetype, {detail.sign.name} is commanded by {detail.lord.name} situated in House {detail.lordHouse}. {
              detail.residentBodies.length > 0
                ? `The presence of ${detail.residentBodies.map((b) => b.name).join(', ')} directly focalizes concentrated karma here, demanding proactive executive attention.`
                : `Because this sign is currently empty, it serves as a pure conduit for ${detail.lord.name}'s dispositorship without conflicting resident agendas.`
            } {
              incomingAspects.length > 0
                ? `External oversight from ${incomingAspects.map((r) => r.castingBody.name).join(', ')} ensures constant accountability and prevents reckless deviation.`
                : `No harsh cross-aspects are currently disrupting this sign's trajectory.`
            }
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. INSPECT HOUSE
  // ----------------------------------------------------
  if (inspectedEntity.type === 'house') {
    const detail = getHouseDetail(inspectedEntity.id, sky.ascendantDegree, displayedBodies);

    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Header with Close */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400 font-bold font-mono text-base">H{detail.houseNumber}</span>
              <h3 className="font-bold text-slate-100 text-sm">House {detail.houseNumber}</h3>
              <span className="text-slate-400 text-xs">(Bhava {detail.houseNumber})</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-300 mt-0.5">
              <span className="bg-cyan-950/80 border border-cyan-800 px-1.5 py-0.5 rounded">
                {detail.classification}
              </span>
              <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                Karaka: {detail.karaka}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg flex items-center gap-1"
          >
            ✕ Back
          </button>
        </div>

        {/* Operational Scope */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Life Arena & Operational Scope:
          </span>
          <p className="text-[11px] text-slate-200 leading-relaxed font-medium">
            {detail.domain}
          </p>
        </div>

        {/* House Lord & Transiting Placement */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 text-[10.5px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            House Lord (Bhavesha) & Current Transiting Placement:
          </span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <span style={{ color: detail.lord.color }}>{detail.lord.symbol}</span>
              <span className="font-bold">{detail.lord.name}</span>
              <span className="text-slate-400 text-[10px]">({detail.lord.sanskritName})</span>
            </div>
            <span className="text-cyan-300 font-mono font-semibold">
              in House {detail.lordHouse}
            </span>
          </div>
          <div className="text-slate-400">
            Resides in {detail.lordSign.name} ({detail.lordDegree.toFixed(1)}°)
          </div>
          <div className="p-2 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-300 leading-relaxed">
            {detail.placementMeaning}
          </div>
        </div>

        {/* Residing Bodies in House */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Bodies Currently Transiting House {detail.houseNumber}:
          </span>
          {detail.residentBodies.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {detail.residentBodies.map((b) => (
                <div
                  key={b.key}
                  className="bg-slate-950/90 border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] text-slate-200 flex items-center gap-1.5"
                >
                  <span style={{ color: b.color }}>{b.symbol}</span>
                  <span className="font-semibold">{b.name}</span>
                  <span className="text-cyan-400 font-mono">{b.signDegree.toFixed(1)}°</span>
                  <span className="text-slate-400">({b.dignity})</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-slate-500 text-[10px] italic">
              No celestial bodies currently occupying this house.
            </span>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 4. INSPECT NAKSHATRA
  // ----------------------------------------------------
  if (inspectedEntity.type === 'nakshatra') {
    const detail = getNakshatraDetail(inspectedEntity.id, displayedBodies);
    const deepRels = getNakshatraDeepRelationships(inspectedEntity.id);
    const incomingAspects = getAspectsCastingOnNakshatra(inspectedEntity.id, displayedBodies);

    // Calculate Tarabala relationships against other nakshatras
    const sampleAllies = [1, 3, 5, 7, 8].map((taraOffset) => {
      const targetIdx = (inspectedEntity.id + taraOffset * 3) % 27;
      return {
        nak: NAKSHATRAS[targetIdx],
        tb: getNakshatraTarabala(inspectedEntity.id, targetIdx),
      };
    });

    const sampleFriction = [2, 4, 6].map((taraOffset) => {
      const targetIdx = (inspectedEntity.id + taraOffset * 3) % 27;
      return {
        nak: NAKSHATRAS[targetIdx],
        tb: getNakshatraTarabala(inspectedEntity.id, targetIdx),
      };
    });

    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Header with Close */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400 font-bold text-base">✦</span>
              <h3 className="font-bold text-slate-100 text-sm">{detail.nakshatra.name}</h3>
              <span className="text-slate-400 text-xs">#{detail.nakshatra.index + 1}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-300 mt-0.5">
              <span className="bg-cyan-950/80 border border-cyan-800 px-1.5 py-0.5 rounded font-semibold">
                Deity: {detail.deity}
              </span>
              <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                Symbol: {detail.symbol}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg flex items-center gap-1"
          >
            ✕ Back
          </button>
        </div>

        {/* 1. Navatara Chakra Tarabala (Friendly vs Friction Nakshatras) */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Navatara Chakra Dynamics & Tarabala (Lunar Mansion Allies):
          </span>

          {/* Friendly Nakshatra Allies: Green background */}
          <div>
            <span className="text-[9.5px] font-semibold text-emerald-400 block mb-1">
              Harmonious Allies (Sampat, Kshema, Sadhana, Mitra):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleAllies.map(({ nak, tb }) => (
                <span
                  key={`tb-ally-${nak.name}`}
                  className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 shadow-sm"
                >
                  <span>✦ {nak.name}</span>
                  <span className="text-[9px] opacity-75">({tb.title.split(' ')[0]})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Friction Nakshatras: Red background */}
          <div>
            <span className="text-[9.5px] font-semibold text-rose-400 block mb-1">
              Friction Nakshatras (Vipat, Pratyak, Naidhana):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleFriction.map(({ nak, tb }) => (
                <span
                  key={`tb-fric-${nak.name}`}
                  className="bg-rose-950/80 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 shadow-sm"
                >
                  <span>✦ {nak.name}</span>
                  <span className="text-[9px] opacity-75">({tb.title.split(' ')[0]})</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Friendly & Enemy Planets for this Nakshatra */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Planetary Affinities for {detail.nakshatra.name} (Graha Sambandha):
          </span>

          {/* Friendly Planets */}
          <div>
            <span className="text-[9.5px] font-semibold text-emerald-400 block mb-1">
              Mitra Grahas (Natural Allied Planets for Lord {detail.lord.name}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {deepRels.friendlyPlanets.length > 0 ? (
                deepRels.friendlyPlanets.map((pKey) => {
                  const pBody = displayedBodies.find((b) => b.key === pKey);
                  return (
                    <span
                      key={`nak-p-friend-${pKey}`}
                      className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 shadow-sm"
                    >
                      <span style={{ color: pBody?.color }}>{pBody?.symbol || '✦'}</span>
                      <span>{pBody?.name || pKey}</span>
                    </span>
                  );
                })
              ) : (
                <span className="text-[10px] text-slate-500 italic">None</span>
              )}
            </div>
          </div>

          {/* Enemy Planets */}
          <div>
            <span className="text-[9.5px] font-semibold text-rose-400 block mb-1">
              Shatru Grahas (Inimical / Friction Planets):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {deepRels.enemyPlanets.length > 0 ? (
                deepRels.enemyPlanets.map((pKey) => {
                  const pBody = displayedBodies.find((b) => b.key === pKey);
                  return (
                    <span
                      key={`nak-p-enemy-${pKey}`}
                      className="bg-rose-950/80 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 shadow-sm"
                    >
                      <span style={{ color: pBody?.color }}>{pBody?.symbol || '✦'}</span>
                      <span>{pBody?.name || pKey}</span>
                    </span>
                  );
                })
              ) : (
                <span className="text-[10px] text-slate-500 italic">None</span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Friendly & Enemy Signs for this Nakshatra */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Zodiac Sign Alignment (Home & Harmonic Trines):
          </span>

          {/* Friendly Signs */}
          <div>
            <span className="text-[9.5px] font-semibold text-emerald-400 block mb-1">
              Harmonic Signs (Home Rashis & Allied Trines):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {deepRels.friendlySigns.map((sIdx) => {
                const fSign = ZODIAC_SIGNS[sIdx];
                return (
                  <span
                    key={`nak-s-friend-${sIdx}`}
                    className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 shadow-sm"
                  >
                    <span>{fSign.symbol}</span>
                    <span>{fSign.name}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Enemy Signs */}
          <div>
            <span className="text-[9.5px] font-semibold text-rose-400 block mb-1">
              Inimical Signs (6th/8th Shadashtaka Friction):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {deepRels.enemySigns.map((sIdx) => {
                const eSign = ZODIAC_SIGNS[sIdx];
                return (
                  <span
                    key={`nak-s-enemy-${sIdx}`}
                    className="bg-rose-950/80 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 shadow-sm"
                  >
                    <span>{eSign.symbol}</span>
                    <span>{eSign.name}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Favorable & Friction Houses for this Nakshatra */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Bhava Alignment (Favorable vs Friction Houses):
          </span>

          {/* Favorable Houses */}
          <div>
            <span className="text-[9.5px] font-semibold text-emerald-400 block mb-1">
              Favorable Bhavas (Kendras, Trikonas & Upachaya):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {deepRels.favorableHouses.map((hNum) => (
                <span
                  key={`nak-h-fav-${hNum}`}
                  className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-medium shadow-sm font-mono"
                >
                  House {hNum}
                </span>
              ))}
            </div>
          </div>

          {/* Friction Houses */}
          <div>
            <span className="text-[9.5px] font-semibold text-rose-400 block mb-1">
              Friction Bhavas (Dusthana Transformation & Debt):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {deepRels.frictionHouses.map((hNum) => (
                <span
                  key={`nak-h-fric-${hNum}`}
                  className="bg-rose-950/80 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded text-[10px] font-medium shadow-sm font-mono"
                >
                  House {hNum} (Dusthana)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Incoming Parashari Drishti (Aspect Rays) on this Nakshatra */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Incoming Parashari Drishti on {detail.nakshatra.name}:
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">
              {incomingAspects.length} Rays
            </span>
          </div>

          {incomingAspects.length > 0 ? (
            <div className="space-y-1.5">
              {incomingAspects.map((ray, idx) => (
                <div
                  key={`ray-nak-${idx}`}
                  className="p-2 bg-slate-950/80 border border-slate-800 rounded-lg text-[10px] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: ray.castingBody.color }} className="font-bold">
                        {ray.castingBody.symbol}
                      </span>
                      <span className="font-semibold text-slate-200">
                        {ray.castingBody.name}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-[9px] font-mono">
                      {ray.aspectType}
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-300 leading-relaxed">
                    {ray.effect}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2 bg-slate-950/60 border border-slate-800/80 rounded-lg text-[10px] text-slate-400 italic">
              No direct external Parashari special aspect rays currently impinging on this lunar mansion.
            </div>
          )}
        </div>

        {/* 6. Nakshatra Lord & Cosmic Channel */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 text-[10.5px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Nakshatra Lord & Planetary Channel:
          </span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <span style={{ color: detail.lord.color }}>{detail.lord.symbol}</span>
              <span className="font-bold">{detail.lord.name}</span>
              <span className="text-slate-400 text-[10px]">({detail.lord.sanskritName})</span>
            </div>
            <span className="text-cyan-300 font-mono font-semibold">
              in House {detail.lordHouse}
            </span>
          </div>
          <div className="text-slate-400">
            Resides in {detail.lordSign.name} ({detail.lordDegree.toFixed(1)}°) • Dignity: {detail.lord.dignity}
          </div>
          <div className="p-2 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-300 leading-relaxed">
            {detail.placementMeaning}
          </div>
        </div>

        {/* 7. Celestial Inhabitants Currently Transiting this Nakshatra */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Bodies Currently Transiting {detail.nakshatra.name}:
          </span>
          {detail.residentBodies.length > 0 ? (
            <div className="space-y-2">
              {detail.residentBodies.map((b) => {
                const bAspects = aspects.filter((a) => a.body1 === b.key || a.body2 === b.key);
                return (
                  <div
                    key={b.key}
                    className="p-2 bg-slate-950/90 border border-slate-800 rounded-lg text-[10px] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span style={{ color: b.color }} className="text-sm">
                          {b.symbol}
                        </span>
                        <span className="font-bold text-slate-100">{b.name}</span>
                        <span className="text-cyan-400 font-mono">Pada {b.pada}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 capitalize font-medium">
                        {b.dignity}
                      </span>
                    </div>

                    <div className="text-[9.5px] text-slate-400">
                      Exact Longitude: {b.signDegree.toFixed(2)}° • Speed: {b.isRetrograde ? 'Retrograde (Vakra)' : 'Direct (Margi)'}
                    </div>

                    {bAspects.length > 0 && (
                      <div className="pt-1 border-t border-slate-800/60 text-[9px] text-slate-400">
                        <span className="text-cyan-300 font-medium">Aspects Received: </span>
                        {bAspects.map((ba, i) => {
                          const partnerKey = ba.body1 === b.key ? ba.body2 : ba.body1;
                          const partner = displayedBodies.find((p) => p.key === partnerKey);
                          return (
                            <span key={i} className="inline-block mr-1.5 text-slate-300">
                              {ba.type} by {partner?.name} (±{ba.orb.toFixed(1)}°)
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-lg text-[10px] text-slate-300 leading-relaxed space-y-1">
              <span className="font-semibold text-cyan-300 block">
                Clear Lunar Mansion Portal:
              </span>
              <p>
                No celestial bodies are currently transiting {detail.nakshatra.name}. It transmits its pure archetypal vibration directly through its ruler <strong className="text-slate-100">{detail.lord.name}</strong> (transiting House {detail.lordHouse}) into the natal chart matrix.
              </p>
            </div>
          )}
        </div>

        {/* 8. Deep Inception Synthesis for this Nakshatra */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider block">
            Inception Synthesis:
          </span>
          <p className="text-[10.5px] text-slate-200 leading-relaxed">
            Governed by <strong className="text-cyan-300">{detail.deity}</strong> and symbolized by <strong className="text-slate-100">{detail.symbol}</strong>, {detail.nakshatra.name} channels its karmic current through planetary lord {detail.lord.name} in House {detail.lordHouse}. {
              detail.residentBodies.length > 0
                ? `Active transit bodies (${detail.residentBodies.map((b) => b.name).join(', ')}) amplify its manifestation potential in real time.`
                : `Its dormant station acts as a tranquil sanctuary, unclouded by transiting planetary strife.`
            } {
              incomingAspects.length > 0
                ? `Parashari Drishti rays from ${incomingAspects.map((r) => r.castingBody.name).join(', ')} introduce structural checks, demanding high vigilance and discipline.`
                : `Enjoying unhindered lunar transmission with minimal friction rays.`
            }
          </p>
        </div>
      </div>
    );
  }

  return null;
}

