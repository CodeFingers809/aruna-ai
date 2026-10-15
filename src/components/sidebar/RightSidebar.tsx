'use client';

import React, { useState } from 'react';
import { useAstrology, StrategicFocus } from '@/context/AstrologyContext';
import { buildElaboratePlanetaryAnalysis } from '@/lib/guidance/elaborateGuidance';
import { ZODIAC_SIGNS } from '@/lib/astronomy/constants';
import { getAspectSynthesis } from '@/lib/astronomy/dispositors';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { KundliChart } from '@/components/common/KundliChart';
import { InspectorPanel } from './InspectorPanel';
import { FullAiWorkspaceModal } from '@/components/ai/FullAiWorkspaceModal';
import {
  Compass,
  FileText,
  Graph,
  Robot,
  Lightning,
  Warning,
  ShieldCheck,
  Clock,
  Sparkle,
  Copy,
  PaperPlaneTilt,
  Crosshair,
  Gauge,
  Flame,
  Drop,
  Wind,
  Tree,
  ArrowsOut,
  ArrowsIn,
  Eye,
} from '@phosphor-icons/react';

export function RightSidebar() {
  const {
    displayedBodies,
    aspects,
    sky,
    selectedPlanetKey,
    setSelectedPlanetKey,
    inspectedEntity,
    setInspectedEntity,
    currentHora,
    sookshmaDirectives,
    activeDasha,
    currentDate,
    userLocation,
    natalProfile,
    natalBlueprint,
    chartEnergy,
    strategicFocus,
    setIsAiWorkspaceOpen,
    runAiAnalysis,
  } = useAstrology();

  const [activeTab, setActiveTab] = useState<'directives' | 'briefing' | 'aspects' | 'ai' | 'inspector'>('directives');
  const [copied, setCopied] = useState(false);
  const [aspectPlanetFilter, setAspectPlanetFilter] = useState<string>('all');

  // AI Tab state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiModel, setAiModel] = useState<string>('gemini-3.8-flash');
  const [isAiExpanded, setIsAiExpanded] = useState<boolean>(false);
  const [showAiDemoChart, setShowAiDemoChart] = useState<boolean>(false);

  // Switch to inspector tab automatically when an entity is inspected
  React.useEffect(() => {
    if (inspectedEntity) {
      setActiveTab('inspector');
    }
  }, [inspectedEntity]);

  // Group aspects by celestial body and synthesize actionable meaning
  const planetAspectGroups = React.useMemo(() => {
    return displayedBodies.map((body) => {
      const activeAspects = aspects
        .filter((a) => a.body1 === body.key || a.body2 === body.key)
        .map((a) => {
          const partnerKey = a.body1 === body.key ? a.body2 : a.body1;
          const partner = displayedBodies.find((b) => b.key === partnerKey);
          const synthesis = partner ? getAspectSynthesis(a, body, partner) : a.description;
          return {
            aspect: a,
            partner,
            synthesis,
          };
        });
      return {
        body,
        aspects: activeAspects,
      };
    }).filter((group) => group.aspects.length > 0);
  }, [displayedBodies, aspects]);

  const filteredPlanetGroups = aspectPlanetFilter === 'all'
    ? planetAspectGroups
    : planetAspectGroups.filter((g) => g.body.key === aspectPlanetFilter);

  // Selected planet or active Dasha lord
  const targetBodyKey = selectedPlanetKey || activeDasha.mahadasha.lord || 'sun';
  const targetBody =
    displayedBodies.find((b) => b.key === targetBodyKey) || displayedBodies[0];

  // Build elaborate multi-variable analysis aligned to current strategicFocus
  const elaborateAnalysis = buildElaboratePlanetaryAnalysis(
    targetBody,
    displayedBodies,
    aspects,
    strategicFocus
  );

  const handleRunAiAnalysis = async (customQuestion?: string) => {
    setAiLoading(true);
    setAiError(null);
    const question = customQuestion || aiPrompt;

    try {
      const celestialContext = {
        timestamp: currentDate.toISOString(),
        observerLocation: userLocation,
        natalProfile,
        strategicFocus,
        chartEnergySummary: {
          vitalityScore: chartEnergy.vitalityScore,
          elementalBalance: chartEnergy.elementalBalance,
          modalityBalance: chartEnergy.modalityBalance,
          hemisphereBalance: chartEnergy.hemisphereBalance,
        },
        natalBlueprint: {
          lagnaSign: ZODIAC_SIGNS[natalBlueprint.lagnaSignIndex].name,
          lagnaDegree: natalBlueprint.lagnaDegree,
          moonSign: ZODIAC_SIGNS[natalBlueprint.moonSignIndex].name,
          moonNakshatra: natalBlueprint.moonNakshatraIndex,
          moonPada: natalBlueprint.moonPada,
          atmakaraka: natalBlueprint.atmakaraka,
          amatyakaraka: natalBlueprint.amatyakaraka,
          overallChartStrength: natalBlueprint.overallChartStrength,
          prominentYogas: natalBlueprint.yogas.map(
            (y) => `${y.name} (${y.type}): ${y.description} -> ${y.operationalEffect}`
          ),
          natalPlanets: natalBlueprint.planets.map((p) => ({
            name: p.name,
            sanskritName: p.sanskritName,
            sign: ZODIAC_SIGNS[p.signIndex].name,
            degree: p.signDegree,
            house: p.house,
            dignity: p.dignity,
            powerPercentage: p.powerPercentage,
            karakaRank: p.karaka.rank,
            karakaTitle: p.karaka.title,
            isVargottama: p.isVargottama,
            d9Sign: ZODIAC_SIGNS[p.d9SignIndex].name,
            d10Sign: ZODIAC_SIGNS[p.d10SignIndex].name,
            functionalNature: p.functionalNature,
            housesRuled: p.housesRuled,
          })),
        },
        activeDasha: {
          mahadasha: activeDasha.mahadasha.lord,
          antardasha: activeDasha.antardasha.lord,
          pratyantardasha: activeDasha.pratyantardasha.lord,
          sookshmadasha: activeDasha.sookshmadasha.lord,
        },
        currentHora: {
          planet: currentHora.planet,
          focus: currentHora.focus,
          risk: currentHora.risk,
        },
        planetaryPositions: displayedBodies.map((b) => ({
          planet: b.name,
          house: b.house,
          degree: b.signDegree,
          sign: ZODIAC_SIGNS[b.signIndex].name,
          nakshatra: b.nakshatraIndex,
          dignity: b.dignity,
          isRetrograde: b.isRetrograde,
          isCombust: b.isCombust,
          speed: b.speed,
        })),
        activeAspects: aspects.map((a) => a.description),
      };

      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: question,
          strategicFocus,
          celestialContext,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error || 'Failed to generate AI analysis.');
      } else {
        setAiResponse(data.analysis);
        if (data.model) setAiModel(data.model);
      }
    } catch (err: any) {
      setAiError(err.message || 'Network error while contacting AI service.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyFullBriefing = () => {
    const text = `ARUNA AI STRATEGIC TELEMETRY BRIEFING (${currentDate.toISOString().split('T')[0]})
[FOCUS DOMAIN: ${strategicFocus.toUpperCase()}]
========================================================================
CLASSICAL SHADBALA AGGREGATE: ${chartEnergy.averageShadbalaRatio ? `${chartEnergy.averageShadbalaRatio.toFixed(2)}x` : '—'} (${chartEnergy.balavanCount || 0}/7 Balavan)
Elemental Balance: Fire ${chartEnergy.elementalBalance.fire}% | Earth ${chartEnergy.elementalBalance.earth}% | Air ${chartEnergy.elementalBalance.air}% | Water ${chartEnergy.elementalBalance.water}%

ACTIVE HORA: ${currentHora.planet.toUpperCase()} (${currentHora.startTime} - ${currentHora.endTime})
- Operational Focus: ${currentHora.focus}
- Friction Hazard: ${currentHora.risk}

ACTIVE SOOKSHMADASHA (${activeDasha.mahadasha.lord.toUpperCase()} / ${activeDasha.antardasha.lord.toUpperCase()} / ${activeDasha.pratyantardasha.lord.toUpperCase()} / ${activeDasha.sookshmadasha.lord.toUpperCase()})
- Opportunities:
${sookshmaDirectives.opportunities.map((o) => `  * ${o}`).join('\n')}
- Hazards & Risks:
${sookshmaDirectives.risks.map((r) => `  * ${r}`).join('\n')}

FOCUS PLANET: ${elaborateAnalysis.bodyName.toUpperCase()} (${elaborateAnalysis.sanskritName})
Location: House ${elaborateAnalysis.house} (${elaborateAnalysis.houseDomain})
Sign: ${elaborateAnalysis.signName} (${elaborateAnalysis.signSanskrit}) at ${elaborateAnalysis.signDegree.toFixed(1)}°
Nakshatra: ${elaborateAnalysis.nakshatraName} (Deity: ${elaborateAnalysis.nakshatraDeity}, Pada ${elaborateAnalysis.pada})
Dignity: ${elaborateAnalysis.dignity.toUpperCase()} | Speed: ${elaborateAnalysis.speed.toFixed(3)}°/day ${elaborateAnalysis.isRetrograde ? '[RETROGRADE ℞]' : ''} ${elaborateAnalysis.isCombust ? '[COMBUST]' : ''}

ENERGY ANALYSIS:
${elaborateAnalysis.energyAnalysis}

MANDATE (WHAT TO DO):
${elaborateAnalysis.mandate.map((m) => `  1. ${m}`).join('\n')}

RESTRAINTS (WHAT TO AVOID):
${elaborateAnalysis.restraints.map((r) => `  - ${r}`).join('\n')}

EXECUTION PROTOCOL (HOW TO DO IT):
${elaborateAnalysis.executionProtocol.map((e) => `  > ${e}`).join('\n')}
${elaborateAnalysis.retrogradeProtocol ? `\nRETROGRADE PROTOCOL:\n${elaborateAnalysis.retrogradeProtocol}` : ''}
${elaborateAnalysis.combustionProtocol ? `\nCOMBUSTION PROTOCOL:\n${elaborateAnalysis.combustionProtocol}` : ''}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick query chips tailored to active strategicFocus
  const focusQueries: Record<StrategicFocus, string[]> = {
    general: [
      'Synthesize today\'s optimal execution window based on active Hora and Sookshmadasha.',
      `Analyze ${targetBody.name} in House ${targetBody.house} and provide a 90-day structural roadmap.`,
      'What are the critical blind spots and hazards in this current transit configuration?',
      'Synthesize my full Natal Blueprint against today\'s geocentric transit alignments.',
    ],
    career: [
      'What is my optimal career timing right now based on active Dasha and Amatyakaraka (AmK)?',
      `How does ${targetBody.name} in House ${targetBody.house} affect executive negotiations and leadership authority?`,
      'Identify acute professional friction traps, corporate politics hazards, and delivery blind spots.',
      'Provide a 90-day career execution roadmap with specific timing windows.',
    ],
    wealth: [
      'Audit my financial timing and risk exposure based on active Dasha and transits.',
      'Which planetary periods present peak prosperity and wealth accumulation (Dhana Yoga) opportunities?',
      'What speculative traps, fiscal blind spots, and expenditure leaks should I immediately avoid?',
      'Synthesize 2nd, 11th, and 9th house activations for long-term wealth preservation and Dhana Yoga fulfillment.',
    ],
    relationships: [
      'Analyze bilateral partnership equilibrium and contract commitments for this period.',
      `How should I navigate boundary negotiations under ${targetBody.name}'s current aspects?`,
      'Identify unspoken relational tensions, partnership vulnerabilities, and timing windows for resolution.',
      'Evaluate Darakaraka (DK) and 7th house mechanics in relation to current transits.',
    ],
    health: [
      'Evaluate my physiological vitality, nervous system workload, and biological recovery pacing.',
      'What acute physical fatigue traps and stress vulnerabilities are active in this configuration?',
      'Provide a daily circadian and recovery protocol synchronized with current Horas.',
      'Analyze 1st, 6th, and 8th house influences on metabolic endurance.',
    ],
    family: [
      'Assess domestic stability, family lineage assets, and home-front obligations this cycle.',
      'How do I maintain domestic harmony while managing demanding professional pressures?',
      'What generational or familial friction points require proactive mediation?',
      'Evaluate 4th house and Matrukaraka (MK) influences on emotional sanctuary.',
    ],
    dharma: [
      'Align current daily actions with my sovereign life mission and Atmakaraka (AK) trajectory.',
      'What ethical or purpose-driven corrections must I make during this planetary phase?',
      'Provide an introspective roadmap for solitary contemplation, study, and mental release.',
      'Synthesize 9th and 12th house placements for spiritual integrity and detached action.',
    ],
  };

  const tabs = [
    { id: 'directives', label: 'Directives', icon: FileText },
    { id: 'briefing', label: 'Briefing', icon: Graph },
    { id: 'aspects', label: 'Aspects', icon: Compass },
    { id: 'ai', label: 'AI Synthesis', icon: Robot },
    ...(inspectedEntity ? [{ id: 'inspector', label: 'Inspector', icon: Eye }] : []),
  ];

  return (
    <aside className="w-80 lg:w-[350px] shrink-0 h-full flex flex-col bg-slate-950/70 backdrop-blur-md border-l border-slate-800/80 text-xs overflow-hidden z-20">
      {/* Tab Navigation Header */}
      <div className={`grid ${inspectedEntity ? 'grid-cols-5' : 'grid-cols-4'} border-b border-slate-800/80 bg-slate-900/60 p-1 gap-0.5`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'ai') {
                  setIsAiWorkspaceOpen(true);
                } else {
                  setActiveTab(tab.id as any);
                }
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded transition-colors ${
                isActive
                  ? 'bg-slate-800 text-cyan-300 font-semibold border border-slate-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon size={15} weight={isActive ? 'bold' : 'regular'} />
              <span className="text-[9px] mt-0.5 truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {/* TAB 1: ELABORATE DIRECTIVES */}
        {activeTab === 'directives' && (
          <div className="space-y-3.5">
            {/* Active Strategic Focus Indicator */}
            {strategicFocus !== 'general' && (
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-cyan-950/40 border border-cyan-800/60 rounded-lg text-[10px]">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Crosshair size={12} className="text-cyan-400" />
                  Focus Domain:
                </span>
                <span className="text-cyan-300 font-bold capitalize">
                  {strategicFocus} & Enterprise
                </span>
              </div>
            )}

            {/* Planet Selection Pills */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Select Celestial Body
              </span>
              <div className="flex flex-wrap gap-1">
                {displayedBodies.map((b) => (
                  <button
                    key={b.key}
                    onClick={() => setSelectedPlanetKey(b.key)}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                      targetBody.key === b.key
                        ? 'bg-cyan-950 text-cyan-200 border border-cyan-700 shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                    }`}
                  >
                    {b.symbol} {b.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Planet Header Card */}
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span style={{ color: elaborateAnalysis.color }} className="text-base font-bold">
                    {elaborateAnalysis.symbol}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{elaborateAnalysis.bodyName}</h3>
                    <span className="text-[10px] text-slate-400">
                      {elaborateAnalysis.sanskritName} • Pada {elaborateAnalysis.pada}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-mono text-cyan-300 font-semibold text-xs">
                    H{elaborateAnalysis.house} • {elaborateAnalysis.signDegree.toFixed(1)}°
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">
                    {elaborateAnalysis.dignity}
                  </span>
                </div>
              </div>

              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-1.5 text-[9.5px]">
                <span className="bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60 font-medium">
                  {elaborateAnalysis.signName} ({elaborateAnalysis.signSanskrit})
                </span>
                <span className="bg-slate-800/80 text-cyan-300 px-2 py-0.5 rounded border border-slate-700/60 font-medium">
                  Nakshatra: {elaborateAnalysis.nakshatraName}
                </span>
                {elaborateAnalysis.isRetrograde && (
                  <span className="bg-red-950/60 text-red-300 px-2 py-0.5 rounded border border-red-800 font-semibold">
                    ℞ Retrograde
                  </span>
                )}
                {elaborateAnalysis.isCombust && (
                  <span className="bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-semibold">
                    Combust
                  </span>
                )}
              </div>
            </div>

            {/* 1. Energy Analysis */}
            <div className="p-3 bg-slate-900/40 border border-slate-800/70 rounded-lg space-y-1.5">
              <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider block">
                Energy Capacity & Operational Moat
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap">
                {elaborateAnalysis.energyAnalysis}
              </p>
            </div>

            {/* 2. Aspect Modifications */}
            <div className="p-3 bg-slate-900/40 border border-slate-800/70 rounded-lg space-y-1.5">
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block">
                Active Aspect Modifications
              </span>
              <ul className="space-y-1 text-[11px] text-slate-300 list-disc pl-4 leading-relaxed">
                {elaborateAnalysis.aspectModifications.map((asp, i) => (
                  <li key={i}>{asp}</li>
                ))}
              </ul>
            </div>

            {/* 3. The Mandate (What to do) */}
            <div className="p-3 bg-slate-900/40 border border-slate-800/70 rounded-lg space-y-2">
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightning size={14} weight="fill" />
                The Mandate (What to Execute)
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-200 leading-relaxed">
                {elaborateAnalysis.mandate.map((man, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{man}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Restraints (What to avoid) */}
            <div className="p-3 bg-slate-900/40 border border-slate-800/70 rounded-lg space-y-2">
              <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <Warning size={14} weight="fill" />
                Restraints & Hazards (What to Avoid)
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
                {elaborateAnalysis.restraints.map((res, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. Execution Protocol (How to do it) */}
            <div className="p-3 bg-slate-900/40 border border-slate-800/70 rounded-lg space-y-2">
              <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} weight="fill" />
                Execution Systems & Operating Protocols
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
                {elaborateAnalysis.executionProtocol.map((exe, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-cyan-500 font-bold">&gt;</span>
                    <span>{exe}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Retrograde Protocol (if active) */}
            {elaborateAnalysis.retrogradeProtocol && (
              <div className="p-3 bg-red-950/20 border border-red-900/50 rounded-lg space-y-1.5">
                <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="font-serif font-bold text-xs">℞</span> Retrograde Contingency Protocol
                </span>
                <p className="text-[11px] text-red-200/90 leading-relaxed">
                  {elaborateAnalysis.retrogradeProtocol}
                </p>
              </div>
            )}

            {/* Combustion Protocol (if active) */}
            {elaborateAnalysis.combustionProtocol && (
              <div className="p-3 bg-amber-950/20 border border-amber-900/50 rounded-lg space-y-1.5">
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  Combustion Protocol
                </span>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  {elaborateAnalysis.combustionProtocol}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MASTER BRIEFING & ENERGY TELEMETRY */}
        {activeTab === 'briefing' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-[11px] font-semibold text-slate-300">Master Operational Briefing</span>
              <button
                onClick={handleCopyFullBriefing}
                className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded transition-colors"
              >
                <Copy size={12} />
                <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
              </button>
            </div>

            {/* Classical Shadbala Aggregate */}
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold text-xs flex items-center gap-1.5">
                  <Gauge size={14} className="text-cyan-400" />
                  Classical Shadbala Aggregate
                </span>
                <span className="font-mono text-cyan-300 font-extrabold text-sm">
                  {chartEnergy.averageShadbalaRatio ? `${chartEnergy.averageShadbalaRatio.toFixed(2)}x` : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>BPHS Balavan Threshold: ≥1.00x</span>
                <span className="text-emerald-400 font-semibold">{chartEnergy.balavanCount || 0}/7 Balavan</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((chartEnergy.averageShadbalaRatio || 1.0) / 1.5) * 100)}%` }}
                />
              </div>

              {/* Elemental Spectrum Bar */}
              <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Elemental Spectrum
                </span>
                <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-800 border border-slate-700/60">
                  <div
                    style={{ width: `${chartEnergy.elementalBalance.fire}%` }}
                    className="bg-rose-500"
                    title={`Fire: ${chartEnergy.elementalBalance.fire}%`}
                  />
                  <div
                    style={{ width: `${chartEnergy.elementalBalance.earth}%` }}
                    className="bg-amber-600"
                    title={`Earth: ${chartEnergy.elementalBalance.earth}%`}
                  />
                  <div
                    style={{ width: `${chartEnergy.elementalBalance.air}%` }}
                    className="bg-cyan-400"
                    title={`Air: ${chartEnergy.elementalBalance.air}%`}
                  />
                  <div
                    style={{ width: `${chartEnergy.elementalBalance.water}%` }}
                    className="bg-blue-600"
                    title={`Water: ${chartEnergy.elementalBalance.water}%`}
                  />
                </div>

                <div className="grid grid-cols-4 gap-1 text-[9.5px] font-mono text-center pt-0.5">
                  <span className="text-rose-400 flex items-center justify-center gap-0.5">
                    Fire {chartEnergy.elementalBalance.fire}%
                  </span>
                  <span className="text-amber-400 flex items-center justify-center gap-0.5">
                    Earth {chartEnergy.elementalBalance.earth}%
                  </span>
                  <span className="text-cyan-300 flex items-center justify-center gap-0.5">
                    Air {chartEnergy.elementalBalance.air}%
                  </span>
                  <span className="text-blue-400 flex items-center justify-center gap-0.5">
                    Water {chartEnergy.elementalBalance.water}%
                  </span>
                </div>
              </div>
            </div>

            {/* Planetary Energy Levels List (Authentic Vedic Shadbala) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Parashari Shadbala (BPHS Virupas)
                </span>
                <span className="text-[9px] text-cyan-400 font-mono">1 Rupa = 60 Virupas</span>
              </div>

              <div className="space-y-1.5">
                {chartEnergy.planetEnergies.map((p) => {
                  let statusColor = 'text-cyan-300 bg-cyan-950/80 border-cyan-800';
                  if (p.status === 'Dominant') statusColor = 'text-emerald-300 bg-emerald-950/80 border-emerald-800';
                  else if (p.status === 'Elevated') statusColor = 'text-cyan-300 bg-cyan-950/80 border-cyan-800';
                  else if (p.status === 'Equilibrium') statusColor = 'text-indigo-300 bg-indigo-950/80 border-indigo-800';
                  else if (p.status === 'Subdued') statusColor = 'text-amber-300 bg-amber-950/80 border-amber-800';
                  else statusColor = 'text-rose-300 bg-rose-950/80 border-rose-800';

                  return (
                    <div
                      key={p.planet}
                      className="p-2.5 bg-slate-900/50 border border-slate-800/70 rounded-lg space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span style={{ color: p.color }} className="font-bold text-sm">
                            {p.symbol}
                          </span>
                          <span className="font-bold text-slate-100">{p.name}</span>
                          <span className="text-[10px] text-slate-500">H{p.house}</span>
                          {p.hasShadbala && (
                            <span className="text-[9px] font-mono text-slate-400">#{p.rank}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {p.hasShadbala ? (
                            <>
                              <span
                                className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded border ${statusColor}`}
                              >
                                {p.isBalavan ? 'Balavan' : p.status}
                              </span>
                              <span className="font-mono text-cyan-300 font-bold text-xs">
                                {p.totalVirupas} Virupas
                              </span>
                            </>
                          ) : (
                            <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded border border-slate-800 bg-slate-950 text-slate-400">
                              Chhaya / Non-Classical
                            </span>
                          )}
                        </div>
                      </div>

                      {p.hasShadbala && (
                        <>
                          <div className="flex items-center justify-between text-[9.5px] text-slate-400 font-mono">
                            <span>Ratio: {(p.shadbalaRatio * 100).toFixed(0)}% of req {p.requiredVirupas} Virupas</span>
                            <span>{p.totalRupas} Rupas</span>
                          </div>

                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                backgroundColor: p.isBalavan ? '#10b981' : p.color,
                                width: `${Math.min(100, Math.max(5, (p.shadbalaRatio / 1.5) * 100))}%`,
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Hora Card */}
            <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-cyan-300 text-xs">
                  <Clock size={14} />
                  Current Hora: {currentHora.planet.toUpperCase()}
                </span>
                <span className="font-mono text-slate-400 text-[10px]">
                  {currentHora.startTime} - {currentHora.endTime}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 leading-relaxed">
                <span className="text-slate-500 font-medium">Focus: </span>
                {currentHora.focus}
              </div>
              <div className="text-[10px] text-amber-300/90 leading-relaxed">
                <span className="text-amber-500 font-medium">Friction Risk: </span>
                {currentHora.risk}
              </div>
            </div>

            {/* Sookshmadasha Opportunities & Risks */}
            <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg space-y-2">
              <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider block border-b border-slate-800 pb-1">
                Active Sookshmadasha Window
              </span>

              <div className="space-y-1">
                <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                  Execution Opportunities
                </span>
                <ul className="space-y-1 pl-4 list-disc text-[11px] text-slate-300 leading-relaxed">
                  {sookshmaDirectives.opportunities.map((opp, i) => (
                    <li key={i}>{opp}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1 pt-1.5 border-t border-slate-800/60">
                <span className="text-[10px] font-medium text-amber-400 flex items-center gap-1">
                  Operational Risks
                </span>
                <ul className="space-y-1 pl-4 list-disc text-[11px] text-slate-300 leading-relaxed">
                  {sookshmaDirectives.risks.map((risk, i) => (
                    <li key={i}>{risk}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Macro Era Climate */}
            <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block border-b border-slate-800 pb-1">
                Macro-Era Climate (Outer Harbingers)
              </span>
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div>
                  <span className="text-cyan-400 font-medium">Aruna (Uranus): </span>
                  <span>Break stagnant dogmas through original insight and innovative methods.</span>
                </div>
                <div>
                  <span className="text-blue-400 font-medium">Varuna (Neptune): </span>
                  <span>Cultivate subtle discernment and spiritual depth; maintain clarity against illusion.</span>
                </div>
                <div>
                  <span className="text-purple-400 font-medium">Yama (Pluto): </span>
                  <span>Release obsolete patterns and rebuild foundations with enduring resilience.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ASPECT MATRIX */}
        {activeTab === 'aspects' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-[11px] font-semibold text-slate-300">
                Aspect Formations by Planet ({aspects.length} total)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {planetAspectGroups.length} Bodies Active
              </span>
            </div>

            {/* Quick Filter by Planet */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
              <button
                onClick={() => setAspectPlanetFilter('all')}
                className={`px-2 py-0.5 rounded text-[10px] shrink-0 font-medium transition-colors ${
                  aspectPlanetFilter === 'all'
                    ? 'bg-cyan-950 text-cyan-200 border border-cyan-800 font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                All ({aspects.length})
              </button>
              {planetAspectGroups.map((g) => (
                <button
                  key={g.body.key}
                  onClick={() => setAspectPlanetFilter(g.body.key)}
                  className={`px-2 py-0.5 rounded text-[10px] shrink-0 flex items-center gap-1 transition-colors ${
                    aspectPlanetFilter === g.body.key
                      ? 'bg-cyan-950 text-cyan-200 border border-cyan-800 font-bold'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span style={{ color: g.body.color }}>{g.body.symbol}</span>
                  <span>{g.body.name.split(' ')[0]}</span>
                  <span className="text-[9px] text-slate-500 font-mono">({g.aspects.length})</span>
                </button>
              ))}
            </div>

            {/* Grouped Cards */}
            <div className="space-y-3">
              {filteredPlanetGroups.map((group) => {
                const b = group.body;
                return (
                  <div
                    key={b.key}
                    className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2.5 shadow-sm"
                  >
                    {/* Planet Header */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        <span style={{ color: b.color }} className="text-sm font-bold">
                          {b.symbol}
                        </span>
                        <span className="font-semibold text-slate-100 text-xs">{b.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          (H{b.house} • {ZODIAC_SIGNS[b.signIndex].name})
                        </span>
                      </div>
                      <span className="text-[10px] text-cyan-400 font-mono font-medium">
                        {group.aspects.length} Aspects
                      </span>
                    </div>

                    {/* Aspects list */}
                    <div className="space-y-2">
                      {group.aspects.map(({ aspect, partner, synthesis }, idx) => {
                        return (
                          <div
                            key={idx}
                            className="p-2 bg-slate-950/70 border border-slate-800/80 rounded-md space-y-1.5 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                                    aspect.isHarmonious
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                                  }`}
                                >
                                  {aspect.type}
                                </span>
                                <span className="text-slate-300 font-medium">
                                  with {partner?.name || 'Body'}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">
                                ±{aspect.orb.toFixed(1)}°
                              </span>
                            </div>

                            <div className="pt-1 border-t border-slate-800/50 space-y-1">
                              <span className="text-[9.5px] font-semibold text-slate-400 block uppercase tracking-wider">
                                Tactical Meaning & Operational Mandate:
                              </span>
                              <p className="text-[10px] text-cyan-100/90 leading-relaxed bg-slate-900/60 p-2 rounded border border-slate-800/40">
                                {synthesis}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredPlanetGroups.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-500">
                  No active aspects for selected criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AI STRATEGIC SYNTHESIS LAUNCHER */}
        {activeTab === 'ai' && (
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3.5 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400 shadow-md">
              <Sparkle size={24} weight="fill" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <h3 className="font-bold text-slate-100 text-sm">AI Strategic Workspace</h3>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5">
                Full-scale strategic intelligence deck: deep tactical synthesis integrated with interactive Vedic Kundli Chakra telemetry.
              </p>
            </div>

            <button
              onClick={() => setIsAiWorkspaceOpen(true)}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-slate-950 font-bold rounded-lg text-xs shadow-md shadow-cyan-950/60 transition-all flex items-center justify-center gap-2"
            >
              <ArrowsOut size={14} weight="bold" />
              <span>Launch Full AI Workspace</span>
            </button>

            <div className="pt-2 border-t border-slate-800/80 text-left space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Direct Tactical Queries ({strategicFocus.toUpperCase()}):
              </span>
              <div className="flex flex-col gap-1.5">
                {(focusQueries[strategicFocus] || focusQueries.general).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsAiWorkspaceOpen(true);
                      runAiAnalysis(q);
                    }}
                    className="text-left p-2 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 rounded text-[10.5px] text-slate-300 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: INSPECTOR PANEL (Opens when ANY entity is clicked) */}
        {activeTab === 'inspector' && (
          <InspectorPanel
            onClose={() => {
              setInspectedEntity(null);
              setActiveTab('directives');
            }}
          />
        )}
      </div>
    </aside>
  );
}
