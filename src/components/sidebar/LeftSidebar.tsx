'use client';

import React, { useState } from 'react';
import { useAstrology } from '@/context/AstrologyContext';
import { ZODIAC_SIGNS, NAKSHATRAS } from '@/lib/astronomy/constants';
import { BodyKey } from '@/types/astronomy';
import {
  Compass,
  ArrowsLeftRight,
  TreeStructure,
  User,
  Hourglass,
  Calendar,
  CaretRight,
  CaretDown,
  MapPin,
  MagnifyingGlass,
  Sparkle,
  ShieldCheck,
  Star,
  ClockAfternoon,
  ArrowCounterClockwise,
  Check,
} from '@phosphor-icons/react';
import { searchCities, CityData } from '@/lib/astronomy/cities';
import { calculateAllAntardashasForMaha, calculateAllPratyantardashasForAntar } from '@/lib/astronomy/dasha';
import {
  calculateHighStakesEvents,
  VedicRadarEvent,
  EventHorizon,
  EventDomain,
} from '@/lib/astronomy/eventRadar';
import { explainDashaPeriod } from '@/lib/astronomy/dashaExplanations';

export function LeftSidebar() {
  const {
    currentDate,
    setCurrentDate,
    setIsLiveSync,
    displayedBodies,
    transits,
    activeDasha,
    natalProfile,
    setNatalProfile,
    natalBlueprint,
    varshaphal,
    majorPeriods,
    leftSidebarTab,
    setLeftSidebarTab,
    selectedPlanetKey,
    setSelectedPlanetKey,
  } = useAstrology();

  // Natal form editing state
  const [isEditingNatal, setIsEditingNatal] = useState(false);
  const [natalName, setNatalName] = useState(natalProfile.name);
  const [natalDate, setNatalDate] = useState(natalProfile.birthDate.slice(0, 16));
  const [natalCityName, setNatalCityName] = useState(natalProfile.cityName);
  const [natalLatitude, setNatalLatitude] = useState(natalProfile.latitude);
  const [natalLongitude, setNatalLongitude] = useState(natalProfile.longitude);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [expandedTransitPlanet, setExpandedTransitPlanet] = useState<BodyKey | null>(null);
  const [expandedNatalPlanet, setExpandedNatalPlanet] = useState<BodyKey | null>(null);
  const [expandedAntarLord, setExpandedAntarLord] = useState<string | null>(activeDasha.antardasha.lord || null);
  const [periodViewMode, setPeriodViewMode] = useState<'radar' | 'vimshottari' | 'macro'>('radar');

  // Event Radar state
  const [radarHorizon, setRadarHorizon] = useState<EventHorizon>('future');
  const [radarDomain, setRadarDomain] = useState<EventDomain>('all');
  const [radarRangeYears, setRadarRangeYears] = useState<number>(2);
  const [jumpedEventId, setJumpedEventId] = useState<string | null>(null);

  // Compute Vedic radar events (forward and backward astronomical milestones)
  const radarEvents = React.useMemo(() => {
    return calculateHighStakesEvents(currentDate, natalBlueprint, {
      horizon: radarHorizon,
      domain: radarDomain,
      timeRangeYears: radarRangeYears,
    });
  }, [currentDate, natalBlueprint, radarHorizon, radarDomain, radarRangeYears]);

  const handleJumpToEventDate = (event: VedicRadarEvent) => {
    setIsLiveSync(false);
    const targetDate = new Date(`${event.peakDate}T12:00:00Z`);
    setCurrentDate(targetDate);
    setJumpedEventId(event.id);
    setTimeout(() => setJumpedEventId(null), 3000);
  };

  // Keep local editing state strictly synced with context/persisted profile
  React.useEffect(() => {
    setNatalName(natalProfile.name);
    setNatalDate(natalProfile.birthDate.slice(0, 16));
    setNatalCityName(natalProfile.cityName);
    setNatalLatitude(natalProfile.latitude);
    setNatalLongitude(natalProfile.longitude);
  }, [natalProfile]);

  const citySearchResults = isSearchingCity || citySearchQuery ? searchCities(citySearchQuery) : [];

  const handleSelectCity = (city: CityData) => {
    const fullLoc = `${city.name}, ${city.country}`;
    setNatalCityName(fullLoc);
    setNatalLatitude(city.latitude);
    setNatalLongitude(city.longitude);
    setCitySearchQuery('');
    setIsSearchingCity(false);
  };

  const handleSaveNatal = () => {
    setNatalProfile({
      name: natalName.trim() || 'Observer',
      birthDate: new Date(natalDate).toISOString(),
      latitude: natalLatitude,
      longitude: natalLongitude,
      cityName: natalCityName || 'New Delhi, India',
    });
    setIsEditingNatal(false);
  };

  const tabs = [
    { id: 'positions', label: 'Positions', icon: Compass },
    { id: 'transits', label: 'Transits', icon: ArrowsLeftRight },
    { id: 'dashas', label: 'Dashas & Varsha', icon: TreeStructure },
    { id: 'natal', label: 'Natal', icon: User },
    { id: 'periods', label: 'Periods', icon: Hourglass },
  ] as const;

  return (
    <aside className="w-80 lg:w-[340px] shrink-0 h-full flex flex-col bg-slate-950/70 backdrop-blur-md border-r border-slate-800/80 text-xs overflow-hidden z-20">
      {/* Tab Navigation Header */}
      <div className="grid grid-cols-5 border-b border-slate-800/80 bg-slate-900/60 p-1 gap-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = leftSidebarTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setLeftSidebarTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded transition-colors ${
                isActive
                  ? 'bg-slate-800 text-cyan-300 font-semibold border border-slate-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title={tab.label}
            >
              <Icon size={15} weight={isActive ? 'bold' : 'regular'} />
              <span className="text-[9px] mt-0.5 truncate max-w-full">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* TAB 1: POSITIONS */}
        {leftSidebarTab === 'positions' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] pb-1 border-b border-slate-800/60 px-1">
              <span>GRAHA</span>
              <span>SIGN • DEGREE</span>
              <span>HOUSE</span>
            </div>

            {displayedBodies.map((b) => {
              const sign = ZODIAC_SIGNS[b.signIndex];
              const isSelected = selectedPlanetKey === b.key;

              return (
                <div
                  key={b.key}
                  onClick={() => setSelectedPlanetKey(isSelected ? null : b.key)}
                  className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-700/80 text-cyan-100 shadow-sm ring-1 ring-cyan-500/20'
                      : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ color: b.color }} className="text-base font-bold shrink-0">
                      {b.symbol}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-100 text-xs">{b.name}</span>
                        {b.isRetrograde && (
                          <span className="text-red-400 font-mono text-[9px] font-bold bg-red-950/60 px-1 rounded">
                            ℞
                          </span>
                        )}
                        {b.isCombust && (
                          <span className="text-amber-400 font-mono text-[8px] bg-amber-950/60 px-1 rounded">
                            Combust
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">{b.sanskritName}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-cyan-300 text-xs">
                      {Math.floor(b.signDegree)}° {Math.floor((b.signDegree % 1) * 60)}&apos; {sign.symbol}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                      <span>{sign.name}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-300 font-medium">H{b.house}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: TRANSITS */}
        {leftSidebarTab === 'transits' && (
          <div className="space-y-2.5">
            <span className="text-slate-400 font-medium text-[11px] block pb-1 border-b border-slate-800/60">
              Active Ingress Windows & Meaning
            </span>

            <div className="space-y-2">
              {transits.map((tr) => {
                const body = displayedBodies.find((b) => b.key === tr.planet);
                const curSign = ZODIAC_SIGNS[tr.currentSign];
                const nextSign = ZODIAC_SIGNS[tr.nextSign];
                const isExpanded = expandedTransitPlanet === tr.planet;

                return (
                  <div
                    key={tr.planet}
                    className="p-2.5 bg-slate-900/50 border border-slate-800/80 rounded-lg space-y-1.5 transition-colors hover:border-slate-700"
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedTransitPlanet(isExpanded ? null : tr.planet)}
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ color: body?.color }} className="text-base font-bold">
                          {body?.symbol}
                        </span>
                        <div>
                          <span className="font-semibold text-slate-100 text-xs">{body?.name}</span>
                          <span className="text-[10px] text-slate-400 block">
                            {curSign.name} → {nextSign.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="text-right font-mono text-[10px]">
                          <span className="text-cyan-400 font-semibold">{tr.daysRemaining}d</span>
                          <span className="text-slate-500 block">remaining</span>
                        </div>
                        {isExpanded ? (
                          <CaretDown size={12} className="text-cyan-400" />
                        ) : (
                          <CaretRight size={12} className="text-slate-500" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/50">
                      <span>Ingress: {tr.entryDate}</span>
                      <span>Next: {tr.exitDate}</span>
                    </div>

                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-800/60 space-y-2 text-xs">
                        {tr.meaning && (
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider block">
                              Transit Significance
                            </span>
                            <p className="text-slate-300 leading-relaxed">{tr.meaning}</p>
                          </div>
                        )}
                        {tr.mandate && (
                          <div className="space-y-0.5 p-2 bg-emerald-950/20 border border-emerald-900/50 rounded">
                            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                              Strategic Mandate (What to Execute)
                            </span>
                            <p className="text-emerald-200/90">{tr.mandate}</p>
                          </div>
                        )}
                        {tr.restraints && (
                          <div className="space-y-0.5 p-2 bg-rose-950/20 border border-rose-900/50 rounded">
                            <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider block">
                              Hazards & Friction Points (What to Avoid)
                            </span>
                            <p className="text-rose-200/90">{tr.restraints}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: DASHAS & VARSHAPHAL MERGED */}
        {leftSidebarTab === 'dashas' && (
          <div className="space-y-3">
            {/* Section A: Vimshottari Dasha Hierarchy */}
            <div className="space-y-2">
              <span className="text-slate-400 font-medium text-[11px] block pb-1 border-b border-slate-800/60">
                Vimshottari Dasha Hierarchy (Micro to Macro)
              </span>

              {[
                { label: 'Mahadasha (Level 1)', node: activeDasha.mahadasha, color: '#38bdf8' },
                { label: 'Antardasha (Level 2)', node: activeDasha.antardasha, color: '#10b981' },
                { label: 'Pratyantardasha (Level 3)', node: activeDasha.pratyantardasha, color: '#f59e0b' },
                { label: 'Sookshmadasha (Level 4)', node: activeDasha.sookshmadasha, color: '#a855f7' },
              ].map((tier) => {
                const body = displayedBodies.find((b) => b.key === tier.node.lord);
                return (
                  <div
                    key={tier.label}
                    className="p-2.5 bg-slate-900/50 border border-slate-800/70 rounded-lg space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">{tier.label}</span>
                      <span
                        className="font-semibold text-slate-100 flex items-center gap-1"
                        style={{ color: tier.color }}
                      >
                        {body?.symbol} {body?.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono pt-1">
                      <span>{tier.node.startDate}</span>
                      <span className="text-cyan-400 font-semibold">{tier.node.progressPercentage}%</span>
                      <span>{tier.node.endDate}</span>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: tier.color,
                          width: `${tier.node.progressPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Dasha Parashari Synthesis & Natal Cross-Verification */}
            {(() => {
              const activeExp = explainDashaPeriod(
                activeDasha.mahadasha,
                activeDasha.antardasha,
                natalBlueprint
              );
              return (
                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Active Dasha Mechanics & Synthesis
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border ${activeExp.vectorBadgeClass}`}
                    >
                      {activeExp.manifestationVector}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-300 leading-relaxed bg-slate-950/70 p-2 rounded-lg border border-slate-800/60">
                    {activeExp.classicalMeaning}
                  </p>
                  <div className="p-2 bg-cyan-950/20 border border-cyan-800/60 rounded-lg space-y-0.5 text-[10px]">
                    <span className="text-[9.5px] font-bold text-cyan-300 uppercase tracking-wider block">
                      Natal Kundli Cross-Verification:
                    </span>
                    <p className="text-cyan-200/90 leading-relaxed">
                      {activeExp.natalCrossVerification}
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-950/90 border border-slate-800 rounded-lg space-y-1 text-[10px]">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                      Vedic Remedial Mantra (देवनागरी संस्कृत):
                    </span>
                    <p className="font-sans text-cyan-300 text-sm font-semibold select-all tracking-wide">
                      {activeExp.sanskritMantraDevanagari || activeExp.sanskritMantra}
                    </p>
                    {activeExp.sanskritMantraIast && (
                      <p className="font-mono text-slate-400 text-[10px] select-all">
                        {activeExp.sanskritMantraIast}
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Section B: Annual Varshaphal (Solar Return) */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-slate-400 font-medium text-[11px] block pb-1 border-b border-slate-800/60">
                Annual Varshaphal Solar Return ({varshaphal.year})
              </span>

              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Return Instant:</span>
                  <span className="text-cyan-300 font-mono text-[11px]">
                    {new Date(varshaphal.solarReturnDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Varsha Lagna:</span>
                  <span className="text-slate-200 font-semibold">
                    {ZODIAC_SIGNS[varshaphal.varshaLagna].sanskritName} (
                    {ZODIAC_SIGNS[varshaphal.varshaLagna].name})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Muntha Sign:</span>
                  <span className="text-amber-400 font-semibold">
                    {ZODIAC_SIGNS[varshaphal.munthaSign].sanskritName} (House {varshaphal.munthaHouse})
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400 text-[11px]">Varsheshwara (Year Lord):</span>
                  <span className="text-emerald-400 font-bold capitalize flex items-center gap-1">
                    <Star size={13} weight="fill" />
                    {varshaphal.varsheshwara}
                  </span>
                </div>
              </div>

              {/* Dasha & Varshaphal Confluence Analysis */}
              <div className="p-2.5 bg-cyan-950/20 border border-cyan-800/60 rounded-lg text-xs space-y-1">
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block">
                  Confluent Timing Mechanics
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Mahadasha lord <strong className="text-cyan-200 capitalize">{activeDasha.mahadasha.lord}</strong> sets your strategic multi-year mandate, while Year Lord <strong className="text-emerald-300 capitalize">{varshaphal.varsheshwara}</strong> and Muntha in <strong className="text-amber-300">House {varshaphal.munthaHouse}</strong> govern this year&apos;s primary tactical events and friction points. Synchronize major initiatives during overlapping supportive Horas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DEEP NATAL CHART BLUEPRINT */}
        {leftSidebarTab === 'natal' && (
          <div className="space-y-3">
            {/* Header: Profile Card & Edit Form */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium text-[11px]">Natal Blueprint Details</span>
              <button
                onClick={() => setIsEditingNatal((prev) => !prev)}
                className="text-cyan-400 hover:text-cyan-300 text-[10px] font-medium"
              >
                {isEditingNatal ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingNatal ? (
              <div className="space-y-2.5 bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div>
                  <label className="text-slate-400 text-[10px] block font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={natalName}
                    onChange={(e) => setNatalName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 outline-none text-xs focus:border-cyan-700"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[10px] block font-medium mb-1">Date & Time of Birth</label>
                  <input
                    type="datetime-local"
                    value={natalDate}
                    onChange={(e) => setNatalDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 outline-none text-xs font-mono focus:border-cyan-700"
                  />
                </div>
                <div className="relative">
                  <label className="text-slate-400 text-[10px] block font-medium mb-1">Birth Location (City)</label>
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs focus-within:border-cyan-700">
                    <MapPin size={13} className="text-cyan-400 mr-1.5 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search city (e.g. Mumbai, New Delhi, London)..."
                      value={isSearchingCity ? citySearchQuery : natalCityName}
                      onFocus={() => {
                        setIsSearchingCity(true);
                        setCitySearchQuery('');
                      }}
                      onChange={(e) => {
                        setIsSearchingCity(true);
                        setCitySearchQuery(e.target.value);
                      }}
                      className="w-full bg-transparent border-none text-slate-200 outline-none text-xs"
                    />
                  </div>

                  {/* Dropdown list for city search */}
                  {isSearchingCity && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-slate-950 border border-slate-700 rounded-lg shadow-2xl z-30 divide-y divide-slate-800/60">
                      <div className="px-2.5 py-1 bg-slate-900 text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                        <span>Select City</span>
                        <button
                          type="button"
                          onClick={() => setIsSearchingCity(false)}
                          className="text-slate-500 hover:text-slate-300"
                        >
                          ✕
                        </button>
                      </div>
                      {citySearchResults.map((city) => (
                        <button
                          key={`${city.name}-${city.country}`}
                          type="button"
                          onClick={() => handleSelectCity(city)}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800/80 transition-colors flex items-center justify-between text-xs"
                        >
                          <span className="text-slate-200 font-medium">{city.name}</span>
                          <span className="text-slate-400 text-[10px]">{city.country}</span>
                        </button>
                      ))}
                      {citySearchResults.length === 0 && (
                        <div className="p-2.5 text-center text-[10px] text-slate-500">
                          No matching cities found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSaveNatal}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-1.5 rounded transition-colors text-xs mt-1"
                >
                  Save Profile
                </button>
              </div>
            ) : (
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-100 font-semibold text-xs">{natalProfile.name}</span>
                  <span className="text-cyan-400 text-[11px] font-medium flex items-center gap-1">
                    <MapPin size={12} weight="fill" />
                    {natalProfile.cityName}
                  </span>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  {new Date(natalProfile.birthDate).toLocaleString()}
                </div>
              </div>
            )}

            {/* Natal Lagna & Core Karaka Banner */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-lg space-y-1">
                <span className="text-slate-500 text-[10px] block">Lagna (Eastern Horizon)</span>
                <span className="font-bold text-cyan-300">
                  {ZODIAC_SIGNS[natalBlueprint.lagnaSignIndex].name} ({natalBlueprint.lagnaDegree.toFixed(1)}°)
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {ZODIAC_SIGNS[natalBlueprint.lagnaSignIndex].sanskritName}
                </span>
              </div>
              <div className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-lg space-y-1">
                <span className="text-slate-500 text-[10px] block">Moon Nakshatra (Janma)</span>
                <span className="font-bold text-slate-200">
                  {NAKSHATRAS[natalBlueprint.moonNakshatraIndex].name}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Pada {natalBlueprint.moonPada} • {ZODIAC_SIGNS[natalBlueprint.moonSignIndex].name}
                </span>
              </div>
            </div>

            {/* Chart Vitality Strength Bar */}
            <div className="p-2.5 bg-slate-900/40 border border-slate-800 rounded-lg space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Overall Natal Strength</span>
                <span className="font-mono text-cyan-400 font-bold">{natalBlueprint.overallChartStrength}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{ width: `${natalBlueprint.overallChartStrength}%` }}
                />
              </div>
            </div>

            {/* Deep Natal Planets List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-400 font-medium text-[11px] pb-1 border-b border-slate-800/60">
                <span>Natal Grahas (Power, Rank, Divisions)</span>
                <span className="text-[10px] text-slate-500 font-mono">Click to expand</span>
              </div>

              {natalBlueprint.planets.map((planet) => {
                const sign = ZODIAC_SIGNS[planet.signIndex];
                const nak = NAKSHATRAS[planet.nakshatraIndex];
                const d9Sign = ZODIAC_SIGNS[planet.d9SignIndex];
                const d10Sign = ZODIAC_SIGNS[planet.d10SignIndex];
                const isExpanded = expandedNatalPlanet === planet.key;

                return (
                  <div
                    key={planet.key}
                    className="p-2.5 bg-slate-900/50 border border-slate-800/80 rounded-lg space-y-2 transition-colors hover:border-slate-700"
                  >
                    {/* Header Row */}
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedNatalPlanet(isExpanded ? null : planet.key)}
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ color: planet.color }} className="text-base font-bold">
                          {planet.symbol}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-100 text-xs">{planet.name}</span>
                            {planet.karaka.rank && (
                              <span
                                className="bg-amber-950/80 text-amber-300 text-[8.5px] font-bold px-1 py-0.5 rounded border border-amber-800/80"
                                title={planet.karaka.title}
                              >
                                {planet.karaka.rank}
                              </span>
                            )}
                            {planet.isVargottama && (
                              <span className="bg-emerald-950/80 text-emerald-300 text-[8.5px] font-bold px-1 py-0.5 rounded border border-emerald-800/80 flex items-center gap-0.5">
                                <Sparkle size={9} />
                                Vargottama
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {planet.sanskritName} • House {planet.house}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="font-mono text-cyan-300 font-semibold text-xs block">
                            {planet.powerPercentage}%
                          </span>
                          <span className="text-[9px] capitalize text-slate-400">
                            {planet.dignity}
                          </span>
                        </div>
                        {isExpanded ? (
                          <CaretDown size={13} className="text-cyan-400" />
                        ) : (
                          <CaretRight size={13} className="text-slate-500" />
                        )}
                      </div>
                    </div>

                    {/* Quick Telemetry Strip */}
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/50">
                      <div>
                        <span className="text-slate-500">D1: </span>
                        <span className="text-slate-200">{sign.name} {planet.signDegree.toFixed(1)}°</span>
                      </div>
                      <div>
                        <span className="text-slate-500">D9: </span>
                        <span className="text-cyan-300">{d9Sign.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Role: </span>
                        <span className="text-slate-300 font-sans font-semibold">{planet.functionalNature}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">D10: </span>
                        <span className="text-slate-300">{d10Sign.name}</span>
                      </div>
                    </div>

                    {/* Expandable Deep Synthesis */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                        {planet.karaka.rank && (
                          <div className="p-2 bg-amber-950/20 border border-amber-900/60 rounded space-y-0.5">
                            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                              Jaimini Karaka: {planet.karaka.sanskritTitle} ({planet.karaka.title})
                            </span>
                            <p className="text-amber-200/90 text-[11px] leading-relaxed">
                              {planet.karaka.significance}
                            </p>
                          </div>
                        )}

                        <div className="space-y-1 text-[11px] text-slate-300 leading-relaxed bg-slate-950/50 p-2 rounded border border-slate-800/60">
                          <div>
                            <span className="text-slate-500">Nakshatra: </span>
                            <span className="text-slate-200 font-semibold">{nak.name} (Pada {planet.pada})</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Houses Ruled: </span>
                            <span className="text-slate-200">
                              {planet.housesRuled.length ? `House(s) ${planet.housesRuled.join(', ')}` : 'None'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Vedic Drishti Cast: </span>
                            <span className="text-cyan-300">
                              House(s) {planet.aspectsCastToHouses.join(', ')}
                            </span>
                          </div>
                          {planet.aspectsReceivedFrom.length > 0 && (
                            <div>
                              <span className="text-slate-500">Aspects Received: </span>
                              <span className="text-slate-300">
                                {planet.aspectsReceivedFrom.join('; ')}
                              </span>
                            </div>
                          )}
                        </div>

                        {planet.effectsAndYogas.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                              Special Effects & Alignments
                            </span>
                            <ul className="space-y-1 text-[11px] text-slate-300 list-disc pl-4">
                              {planet.effectsAndYogas.map((eff, idx) => (
                                <li key={idx}>{eff}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Classical Yogas Detected Card */}
            {natalBlueprint.yogas.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 font-medium text-[11px] block pb-1 border-b border-slate-800/60">
                  Classical Natal Yogas ({natalBlueprint.yogas.length} Active)
                </span>

                <div className="space-y-2">
                  {natalBlueprint.yogas.map((yoga, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300 text-xs">{yoga.name}</span>
                        <span className="bg-cyan-950/80 text-cyan-300 text-[9px] px-1.5 py-0.5 rounded border border-cyan-800/80 font-mono">
                          {yoga.type} Yoga
                        </span>
                      </div>
                      <p className="text-slate-400 text-[10px]">{yoga.description}</p>
                      <div className="p-1.5 bg-slate-950/80 border border-slate-800/60 rounded text-[10px] text-emerald-300/90 leading-relaxed mt-1">
                        <span className="font-semibold text-emerald-400">Operational Effect: </span>
                        {yoga.operationalEffect}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PERIODS (FORWARD & BACKWARD EVENT RADAR + DEEP DASHA SYNTHESIS) */}
        {leftSidebarTab === 'periods' && (
          <div className="space-y-3">
            {/* Sub-Tab Navigation Header */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
              <span className="text-slate-300 font-medium text-[11px]">
                {periodViewMode === 'radar'
                  ? 'Event Radar (Time Machine)'
                  : periodViewMode === 'vimshottari'
                  ? 'Vimshottari Dasha Hierarchy'
                  : 'Macro Planetary Cycles'}
              </span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'radar', label: 'Radar' },
                  { id: 'vimshottari', label: 'Dashas' },
                  { id: 'macro', label: 'Macro' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setPeriodViewMode(mode.id as any)}
                    className={`text-[9px] font-mono px-2 py-0.5 rounded capitalize transition-colors ${
                      periodViewMode === mode.id
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ============================================================== */}
            {/* SUB-TAB 1: HIGH-STAKES FORWARD & BACKWARD EVENT RADAR           */}
            {/* ============================================================== */}
            {periodViewMode === 'radar' && (
              <div className="space-y-2.5">
                {/* Horizon Switcher: Upcoming (Future) vs Historical (Past) */}
                <div className="grid grid-cols-2 p-0.5 bg-slate-900/80 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setRadarHorizon('future')}
                    className={`py-1 text-[10px] font-semibold rounded transition-colors flex items-center justify-center gap-1 ${
                      radarHorizon === 'future'
                        ? 'bg-cyan-950 text-cyan-200 border border-cyan-700 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>▶ Upcoming (Future)</span>
                  </button>
                  <button
                    onClick={() => setRadarHorizon('past')}
                    className={`py-1 text-[10px] font-semibold rounded transition-colors flex items-center justify-center gap-1 ${
                      radarHorizon === 'past'
                        ? 'bg-amber-950 text-amber-200 border border-amber-700 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>◀ Historical (Past)</span>
                  </button>
                </div>

                {/* Filter Controls: Domain & Range */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">Domain Focus:</span>
                    <div className="flex items-center gap-1 overflow-x-auto">
                      {(['all', 'career', 'wealth', 'love', 'health', 'dharma'] as const).map((dom) => (
                        <button
                          key={dom}
                          onClick={() => setRadarDomain(dom)}
                          className={`text-[9px] px-1.5 py-0.5 rounded capitalize transition-colors ${
                            radarDomain === dom
                              ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-700 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {dom}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">Time Window:</span>
                    <div className="flex items-center gap-1">
                      {[
                        { years: 0.5, label: '6M' },
                        { years: 1, label: '1Y' },
                        { years: 2, label: '2Y' },
                        { years: 3, label: '3Y' },
                      ].map((r) => (
                        <button
                          key={r.label}
                          onClick={() => setRadarRangeYears(r.years)}
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                            radarRangeYears === r.years
                              ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Classical Parashari Event Filter */}
                <div className="p-2 bg-slate-950/70 border border-slate-800/80 rounded-lg text-[9.5px] text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                    <ShieldCheck size={12} className="text-cyan-400" />
                    Major Transit & Dasha Alignment
                  </span>
                  <span className="text-slate-500 font-mono">BPHS Criteria</span>
                </div>

                {/* Event Cards List */}
                <div className="space-y-2.5">
                  {radarEvents.length === 0 ? (
                    <div className="p-6 text-center bg-slate-900/30 border border-slate-800/60 rounded-xl space-y-1.5 text-xs">
                      <Hourglass size={24} className="mx-auto text-slate-500" />
                      <p className="text-slate-300 font-semibold">No Milestone Events in this Window</p>
                      <p className="text-[10px] text-slate-500">
                        Try expanding the time window to 2Y/3Y or setting Domain Focus to &apos;All&apos;.
                      </p>
                    </div>
                  ) : (
                    radarEvents.map((evt) => {
                      const isJumped = jumpedEventId === evt.id;
                      const absDays = Math.abs(evt.daysFromNow);
                      const daysText =
                        evt.daysFromNow === 0
                          ? 'Today (Peak Exact)'
                          : evt.daysFromNow > 0
                          ? `in ${absDays} days`
                          : `${absDays} days ago`;

                      return (
                        <div
                          key={evt.id}
                          className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
                        >
                          {/* Top Row: Event Name & Date */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-slate-100 text-xs tracking-tight">
                                {evt.title}
                              </h4>
                              <span className="text-[10px] text-cyan-400/90 font-mono">
                                {evt.sanskritTitle}
                              </span>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <span className="text-[10px] font-mono text-slate-300 font-semibold block">
                                {evt.peakDate}
                              </span>
                              <span
                                className={`text-[9px] font-mono ${
                                  evt.horizon === 'future' ? 'text-cyan-400' : 'text-amber-400'
                                }`}
                              >
                                {daysText}
                              </span>
                            </div>
                          </div>

                          {/* Second Row: Quality & Natal Point */}
                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800/50">
                            <div className="flex items-center gap-1 flex-wrap">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${evt.badgeClass}`}
                              >
                                {evt.domain.toUpperCase()} • {evt.qualityTier.replace(/_/g, ' ').toUpperCase()}
                              </span>
                              {evt.applicableDomains &&
                                evt.applicableDomains
                                  .filter((d) => d !== evt.domain && d !== 'all')
                                  .map((d) => (
                                    <span
                                      key={d}
                                      className="px-1 py-0.2 rounded text-[8.5px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/60 uppercase"
                                    >
                                      {d}
                                    </span>
                                  ))}
                            </div>
                            <span className="text-slate-400 font-mono text-[9.5px]">
                              {evt.natalPointTargeted}
                            </span>
                          </div>

                          {/* Classical Mechanism */}
                          <p className="text-[10.5px] text-slate-300 leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                            {evt.classicalMechanism}
                          </p>

                          {/* Natal Cross-Verification */}
                          {evt.natalCrossVerification && (
                            <div className="p-2 bg-cyan-950/20 border border-cyan-800/50 rounded-lg space-y-0.5 text-[10px]">
                              <span className="text-[9.5px] font-bold text-cyan-300 uppercase tracking-wider block">
                                Natal Kundli Cross-Verification:
                              </span>
                              <p className="text-cyan-200/90 leading-relaxed">
                                {evt.natalCrossVerification}
                              </p>
                            </div>
                          )}

                          {/* Classical Prescriptions */}
                          <div className="grid grid-cols-1 gap-1 text-[10px]">
                            <div className="p-1.5 bg-emerald-950/20 border border-emerald-900/40 rounded text-emerald-300 leading-relaxed">
                              <span className="font-bold text-emerald-400">Prescription: </span>
                              {evt.tacticalDirective}
                            </div>
                            <div className="p-1.5 bg-rose-950/20 border border-rose-900/40 rounded text-rose-300 leading-relaxed">
                              <span className="font-bold text-rose-400">Avoid: </span>
                              {evt.tacticalAvoid}
                            </div>
                          </div>

                          {/* Action Button: Jump to Date */}
                          <button
                            onClick={() => handleJumpToEventDate(evt)}
                            className={`w-full py-1.5 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                              isJumped
                                ? 'bg-emerald-950 border-emerald-600 text-emerald-200 shadow-md'
                                : 'bg-slate-900 hover:bg-cyan-950 border-slate-800 hover:border-cyan-700 text-slate-300 hover:text-cyan-200'
                            }`}
                          >
                            {isJumped ? (
                              <>
                                <Check size={13} className="text-emerald-400" />
                                <span>Snapped Wheel to {evt.peakDate}</span>
                              </>
                            ) : (
                              <>
                                <ClockAfternoon size={13} className="text-cyan-400" />
                                <span>Jump to Date (Inspect Chart Wheel)</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SUB-TAB 2: VIMSHOTTARI DASHA HIERARCHY & DEEP EXPLANATIONS      */}
            {/* ============================================================== */}
            {periodViewMode === 'vimshottari' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    {activeDasha.mahadasha.lord?.toUpperCase()} Mahadasha Antardashas
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {activeDasha.mahadasha.startDate} — {activeDasha.mahadasha.endDate}
                  </span>
                </div>

                <div className="space-y-2">
                  {calculateAllAntardashasForMaha(activeDasha.mahadasha, currentDate).map((antar) => {
                    const isAntarActive = antar.isActive;
                    const isAntarExpanded = expandedAntarLord === antar.lord;
                    const subPratyantardashas = isAntarExpanded
                      ? calculateAllPratyantardashasForAntar(antar, currentDate)
                      : [];

                    // Calculate deep Parashari explanation cross-verified with natal chart
                    const dashaExplanation = explainDashaPeriod(
                      activeDasha.mahadasha,
                      antar,
                      natalBlueprint
                    );

                    return (
                      <div
                        key={antar.lord}
                        className={`rounded-xl border transition-all ${
                          isAntarActive
                            ? 'bg-slate-900/90 border-cyan-700/80 ring-1 ring-cyan-500/20 shadow-md shadow-cyan-950/40'
                            : 'bg-slate-900/40 border-slate-800/70 hover:border-slate-700'
                        }`}
                      >
                        <button
                          onClick={() =>
                            setExpandedAntarLord(isAntarExpanded ? null : antar.lord)
                          }
                          className="w-full text-left p-2.5 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-xs ${
                                isAntarActive ? 'text-cyan-300 font-bold' : 'text-slate-300'
                              } capitalize`}
                            >
                              {antar.lord} Antardasha
                            </span>
                            {isAntarActive && (
                              <span className="text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                                ACTIVE
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[9.5px] font-mono text-slate-400">
                              {antar.startDate} to {antar.endDate}
                            </span>
                            <span className="text-slate-500 text-[10px]">
                              {isAntarExpanded ? '▲' : '▼'}
                            </span>
                          </div>
                        </button>

                        {/* Progress Bar */}
                        <div className="px-2.5 pb-2">
                          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isAntarActive ? 'bg-cyan-400' : 'bg-slate-600'
                              }`}
                              style={{ width: `${antar.progressPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Expandable Deep Synthesis & Natal Cross-Verification */}
                        {(isAntarExpanded || isAntarActive) && (
                          <div className="p-3 border-t border-slate-800/80 bg-slate-950/70 rounded-b-xl space-y-2.5 text-xs">
                            {/* Manifestation Vector & Theme */}
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 font-medium">
                                {dashaExplanation.theme}
                              </span>
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border ${dashaExplanation.vectorBadgeClass}`}
                              >
                                {dashaExplanation.manifestationVector}
                              </span>
                            </div>

                            {/* Classical Parashari Meaning */}
                            <p className="text-[10.5px] text-slate-300 leading-relaxed bg-slate-950/80 p-2 rounded-lg border border-slate-800/60">
                              {dashaExplanation.classicalMeaning}
                            </p>

                            {/* Natal Kundli Cross-Verification */}
                            <div className="p-2 bg-cyan-950/20 border border-cyan-800/60 rounded-lg space-y-0.5 text-[10px]">
                              <span className="text-[9.5px] font-bold text-cyan-300 uppercase tracking-wider block">
                                Natal Kundli Cross-Verification:
                              </span>
                              <p className="text-cyan-200/90 leading-relaxed">
                                {dashaExplanation.natalCrossVerification}
                              </p>
                            </div>

                            {/* Authentic Sanskrit Mantra */}
                            <div className="p-2.5 bg-slate-950/90 border border-slate-800 rounded-lg space-y-1 text-[10px]">
                              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                                Vedic Remedial Mantra (देवनागरी संस्कृत):
                              </span>
                              <p className="font-sans text-cyan-300 text-sm font-semibold select-all tracking-wide">
                                {dashaExplanation.sanskritMantraDevanagari || dashaExplanation.sanskritMantra}
                              </p>
                              {dashaExplanation.sanskritMantraIast && (
                                <p className="font-mono text-slate-400 text-[10px] select-all">
                                  {dashaExplanation.sanskritMantraIast}
                                </p>
                              )}
                            </div>

                            {/* Tactical Directives */}
                            <div className="grid grid-cols-1 gap-1 text-[10px]">
                              <div className="p-1.5 bg-emerald-950/20 border border-emerald-900/40 rounded text-emerald-300 leading-relaxed">
                                <span className="font-bold text-emerald-400">Tactical Directives: </span>
                                {dashaExplanation.tacticalDo.join(' ')}
                              </div>
                              <div className="p-1.5 bg-rose-950/20 border border-rose-900/40 rounded text-rose-300 leading-relaxed">
                                <span className="font-bold text-rose-400">Tactical Avoid: </span>
                                {dashaExplanation.tacticalAvoid.join(' ')}
                              </div>
                            </div>

                            {/* Level 3 Pratyantardashas Drilldown */}
                            {isAntarExpanded && subPratyantardashas.length > 0 && (
                              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                  Pratyantardasha Micro-Cycles (Level 3)
                                </span>
                                <div className="grid grid-cols-1 gap-1">
                                  {subPratyantardashas.map((praty) => (
                                    <div
                                      key={praty.lord}
                                      className={`p-1.5 rounded flex items-center justify-between text-[9.5px] border ${
                                        praty.isActive
                                          ? 'bg-cyan-950/80 border-cyan-800 text-cyan-200 font-semibold shadow-sm'
                                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5">
                                        <span className="capitalize font-medium text-slate-200">
                                          {praty.lord}
                                        </span>
                                        {praty.isActive && (
                                          <span className="text-[8px] font-mono px-1 rounded bg-amber-400 text-slate-950 font-bold">
                                            CURRENT
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 font-mono">
                                        <span>
                                          {praty.startDate.slice(5)} → {praty.endDate.slice(5)}
                                        </span>
                                        <span className="text-slate-500">
                                          ({praty.durationDays}d)
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SUB-TAB 3: MAJOR PLANETARY CYCLES & RETURNS                     */}
            {/* ============================================================== */}
            {periodViewMode === 'macro' && (
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Major Planetary Cycles & Structural Returns
                </span>

                <div className="relative border-l border-slate-800/80 ml-2 pl-3 space-y-3">
                  {majorPeriods.map((mp, idx) => {
                    const isActive = mp.phase.includes('Active');
                    const isCompleted = mp.phase === 'Completed';

                    return (
                      <div key={idx} className="relative group">
                        {/* Timeline Node Dot */}
                        <div
                          className={`absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full border-2 transition-all ${
                            isActive
                              ? 'bg-amber-400 border-slate-950 ring-2 ring-amber-400/50 scale-125'
                              : isCompleted
                              ? 'bg-slate-700 border-slate-950'
                              : 'bg-cyan-500/70 border-slate-950'
                          }`}
                        />

                        <div
                          className={`p-2.5 rounded-lg border transition-all space-y-1.5 ${
                            isActive
                              ? 'bg-slate-900/90 border-amber-800/80 ring-1 ring-amber-500/30'
                              : 'bg-slate-900/40 border-slate-800/70'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-100 text-xs">{mp.title}</span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-medium ${
                                isActive
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800/80 font-bold'
                                  : isCompleted
                                  ? 'bg-slate-800/70 text-slate-500'
                                  : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60'
                              }`}
                            >
                              {mp.phase}
                            </span>
                          </div>

                          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                            <span className="text-slate-300 font-medium">
                              {mp.startDate.slice(0, 4)} — {mp.endDate.slice(0, 4)}
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-400 leading-relaxed">{mp.description}</p>

                          <div className="p-1.5 bg-slate-950/60 border border-slate-800/60 rounded text-[10px] text-cyan-200/90 leading-relaxed">
                            <span className="text-slate-400 font-medium">Protocol: </span>
                            {mp.actionProtocol}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
