'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ActionGuidance,
  ActiveDashaChain,
  Aspect,
  BodyKey,
  CelestialBody,
  DivisionType,
  HoraPeriod,
  HouseCusp,
  MajorPeriod,
  NatalProfile,
  ObserverLocation,
  SkyOrientation,
  SookshmaDirectives,
  TransitEvent,
  VarshaphalData,
} from '@/types/astronomy';
import { calculateAllCelestialBodies } from '@/lib/astronomy/ephemeris';
import { calculateSkyAndHouses } from '@/lib/astronomy/houses';
import { calculateAspects } from '@/lib/astronomy/aspects';
import { calculateVimshottariDasha } from '@/lib/astronomy/dasha';
import { calculatePlanetaryHours } from '@/lib/astronomy/hora';
import { calculateTransits } from '@/lib/astronomy/transits';
import { calculateVarshaphal } from '@/lib/astronomy/varshaphal';
import { calculateMajorPeriods } from '@/lib/astronomy/periods';
import { getDirectiveForBody, getSookshmaDirectives } from '@/lib/guidance/actionableDirectives';

import { calculatePlanetaryEnergies, ChartEnergyTelemetry } from '@/lib/astronomy/energy';
import { calculateNatalChartBlueprint, NatalChartBlueprint } from '@/lib/astronomy/natal';
import { ZODIAC_SIGNS } from '@/lib/astronomy/constants';

export type TimeUnit = 'minutes' | 'hours' | 'days' | 'months' | 'years';

export type StrategicFocus =
  | 'general'
  | 'career'
  | 'wealth'
  | 'relationships'
  | 'health'
  | 'family'
  | 'dharma';

export type InspectedEntity =
  | { type: 'planet'; id: BodyKey }
  | { type: 'sign'; id: number }
  | { type: 'house'; id: number }
  | { type: 'nakshatra'; id: number }
  | null;

export type LeftSidebarTab =
  | 'positions'
  | 'transits'
  | 'dashas'
  | 'natal'
  | 'periods'
  | 'varshaphal';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  model?: string;
  spotlightKeys?: string[];
}

interface AstrologyContextType {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  isLiveSync: boolean;
  setIsLiveSync: (sync: boolean) => void;
  userLocation: ObserverLocation;
  setUserLocation: (loc: ObserverLocation) => void;
  autoDetectLocation: () => void;
  isDetectingLocation: boolean;
  natalProfile: NatalProfile;
  setNatalProfile: (profile: NatalProfile) => void;
  systemMode: 'classical' | 'extended';
  setSystemMode: (mode: 'classical' | 'extended') => void;
  wheelOrientation: 'sky' | 'ascendant';
  setWheelOrientation: (orient: 'sky' | 'ascendant') => void;
  activeDivisionLens: DivisionType;
  setActiveDivisionLens: (lens: DivisionType) => void;
  selectedPlanetKey: BodyKey | null;
  setSelectedPlanetKey: (key: BodyKey | null) => void;
  inspectedEntity: InspectedEntity;
  setInspectedEntity: (entity: InspectedEntity) => void;
  strategicFocus: StrategicFocus;
  setStrategicFocus: (focus: StrategicFocus) => void;
  isPlaying: boolean;
  speedMultiplier: number;
  setSpeedMultiplier: (speed: number) => void;
  togglePlayback: () => void;
  arrowMultiplierAmount: number;
  setArrowMultiplierAmount: (amt: number) => void;
  arrowMultiplierUnit: TimeUnit;
  setArrowMultiplierUnit: (unit: TimeUnit) => void;
  stepTime: (amount: number, unit: TimeUnit, animate?: boolean) => void;
  resetToNow: () => void;
  // Full-Page AI Workspace & Multi-turn Conversational Intelligence
  isAiWorkspaceOpen: boolean;
  setIsAiWorkspaceOpen: (open: boolean) => void;
  aiResponse: string | null;
  setAiResponse: (res: string | null) => void;
  aiLoading: boolean;
  setAiLoading: (loading: boolean) => void;
  aiError: string | null;
  setAiError: (err: string | null) => void;
  aiModel: string;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  sendChatMessage: (
    message: string,
    existingHistory?: ChatMessage[]
  ) => Promise<ChatMessage | null>;
  clearChat: () => void;
  runAiAnalysis: (customQuestion?: string) => Promise<void>;
  // Computed Data
  allBodies: CelestialBody[];
  displayedBodies: CelestialBody[];
  sky: SkyOrientation;
  houseCusps: HouseCusp[];
  aspects: Aspect[];
  transits: TransitEvent[];
  activeDasha: ActiveDashaChain;
  currentHora: HoraPeriod;
  allHoras: HoraPeriod[];
  sookshmaDirectives: SookshmaDirectives;
  majorPeriods: MajorPeriod[];
  varshaphal: VarshaphalData;
  activeDirective: ActionGuidance;
  chartEnergy: ChartEnergyTelemetry;
  natalBlueprint: NatalChartBlueprint;
  leftSidebarTab: LeftSidebarTab;
  setLeftSidebarTab: (tab: LeftSidebarTab) => void;
}

const DEFAULT_LOCATION: ObserverLocation = {
  latitude: 28.6139,
  longitude: 77.209,
  altitude: 0,
  cityName: 'New Delhi, India',
  timezone: 'Asia/Kolkata',
};

const DEFAULT_NATAL: NatalProfile = {
  name: 'Observer',
  birthDate: '1995-10-15T08:30:00.000Z',
  latitude: 28.6139,
  longitude: 77.209,
  cityName: 'New Delhi, India',
};

const AstrologyContext = createContext<AstrologyContextType | null>(null);

export function AstrologyProvider({ children }: { children: React.ReactNode }) {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [isLiveSync, setIsLiveSync] = useState<boolean>(true);
  const [isAiWorkspaceOpen, setIsAiWorkspaceOpen] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const aiModel = 'gemini-3.8-flash';

  const [userLocation, setUserLocation] = useState<ObserverLocation>(DEFAULT_LOCATION);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [natalProfile, setNatalProfile] = useState<NatalProfile>(DEFAULT_NATAL);
  const [systemMode, setSystemMode] = useState<'classical' | 'extended'>('extended');
  const [wheelOrientation, setWheelOrientation] = useState<'sky' | 'ascendant'>('sky');
  const [activeDivisionLens, setActiveDivisionLens] = useState<DivisionType>('D1');
  const [selectedPlanetKey, setSelectedPlanetKey] = useState<BodyKey | null>(null);
  const [inspectedEntity, setInspectedEntity] = useState<InspectedEntity>(null);
  const [strategicFocus, setStrategicFocus] = useState<StrategicFocus>('general');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(86400); // 1 day per sec default
  const [arrowMultiplierAmount, setArrowMultiplierAmount] = useState<number>(1);
  const [arrowMultiplierUnit, setArrowMultiplierUnit] = useState<TimeUnit>('days');
  const [leftSidebarTab, setLeftSidebarTab] = useState<LeftSidebarTab>('positions');

  const animationFrameRef = useRef<number | null>(null);
  const transitionRef = useRef<number | null>(null);

  // Save changes to profile & location
  const updateNatalProfile = useCallback((profile: NatalProfile) => {
    setNatalProfile(profile);
    try {
      localStorage.setItem('aruna_natal_profile', JSON.stringify(profile));
    } catch {}
  }, []);

  const updateUserLocation = useCallback((loc: ObserverLocation) => {
    setUserLocation(loc);
    try {
      localStorage.setItem('aruna_user_location', JSON.stringify(loc));
    } catch {}
  }, []);

  // GPS Auto-detect
  const autoDetectLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const alt = pos.coords.altitude || 0;
        let cityName = `GPS (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
            { headers: { 'User-Agent': 'ArunaAI-App/1.0' } }
          );
          if (res.ok) {
            const data = await res.json();
            cityName =
              data.address?.city ||
              data.address?.town ||
              data.address?.county ||
              data.display_name?.split(',')[0] ||
              cityName;
          }
        } catch {}

        updateUserLocation({
          latitude: lat,
          longitude: lon,
          altitude: alt,
          cityName,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        });
        setIsDetectingLocation(false);
      },
      (err) => {
        console.warn('Geolocation detection failed:', err);
        setIsDetectingLocation(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [updateUserLocation]);

  // Load saved profile or auto-detect GPS on first launch
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aruna_natal_profile');
      if (saved) {
        setNatalProfile(JSON.parse(saved));
      }
      const savedLoc = localStorage.getItem('aruna_user_location');
      if (savedLoc) {
        setUserLocation(JSON.parse(savedLoc));
      } else {
        autoDetectLocation();
      }
    } catch {
      autoDetectLocation();
    }
  }, [autoDetectLocation]);

  // Continuous fluid playback via requestAnimationFrame
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    let lastTime = performance.now();
    const tick = (now: number) => {
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;
      const advanceMs = deltaSec * speedMultiplier * 1000;
      setCurrentDate((prev) => new Date(prev.getTime() + advanceMs));
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, speedMultiplier]);

  // Live real-time clock synchronization
  useEffect(() => {
    if (!isLiveSync || isPlaying) return;
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isLiveSync, isPlaying]);

  const togglePlayback = useCallback(() => {
    setIsLiveSync(false);
    setIsPlaying((prev) => !prev);
  }, []);

  const resetToNow = useCallback(() => {
    setIsPlaying(false);
    setCurrentDate(new Date());
    setIsLiveSync(true);
  }, []);

  // Smooth animated time stepping (supports minutes, hours, days, months, years)
  const stepTime = useCallback(
    (amount: number, unit: TimeUnit, animate = true) => {
      setIsLiveSync(false);
      const computeTargetDate = (base: Date) => {
        const next = new Date(base);
        if (unit === 'minutes') next.setMinutes(next.getMinutes() + amount);
        else if (unit === 'hours') next.setHours(next.getHours() + amount);
        else if (unit === 'days') next.setDate(next.getDate() + amount);
        else if (unit === 'months') next.setMonth(next.getMonth() + amount);
        else if (unit === 'years') next.setFullYear(next.getFullYear() + amount);
        return next;
      };

      if (!animate) {
        setCurrentDate((prev) => computeTargetDate(prev));
        return;
      }

      // Smooth 250ms interpolation
      const startMs = currentDate.getTime();
      const endMs = computeTargetDate(currentDate).getTime();
      const durationMs = 250;
      const startTime = performance.now();

      if (transitionRef.current) {
        cancelAnimationFrame(transitionRef.current);
      }

      const stepAnimation = (now: number) => {
        const progress = Math.min(1, (now - startTime) / durationMs);
        // Ease-out cubic curve
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentMs = startMs + (endMs - startMs) * ease;
        setCurrentDate(new Date(currentMs));

        if (progress < 1) {
          transitionRef.current = requestAnimationFrame(stepAnimation);
        } else {
          transitionRef.current = null;
        }
      };

      transitionRef.current = requestAnimationFrame(stepAnimation);
    },
    [currentDate]
  );

  const lastKeyStepTimeRef = useRef<number>(0);

  // Global Keyboard Navigation: ArrowLeft, ArrowRight, and Escape
  useEffect(() => {
    const THROTTLE_INTERVAL_MS = 220;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key clears any selection or modal immediately
      if (e.key === 'Escape') {
        setSelectedPlanetKey(null);
        setInspectedEntity(null);
        setIsAiWorkspaceOpen(false);
        return;
      }

      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const now = Date.now();
        if (now - lastKeyStepTimeRef.current < THROTTLE_INTERVAL_MS) return;
        lastKeyStepTimeRef.current = now;
        stepTime(-arrowMultiplierAmount, arrowMultiplierUnit, true);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const now = Date.now();
        if (now - lastKeyStepTimeRef.current < THROTTLE_INTERVAL_MS) return;
        lastKeyStepTimeRef.current = now;
        stepTime(arrowMultiplierAmount, arrowMultiplierUnit, true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [arrowMultiplierAmount, arrowMultiplierUnit, stepTime]);

  // Compute ephemeris and houses for current moment
  const { allBodies, sky, houseCusps } = useMemo(() => {
    const { bodies: rawBodies } = calculateAllCelestialBodies(currentDate, userLocation);
    const { sky: computedSky, houseCusps: computedCusps, updatedBodies } = calculateSkyAndHouses(
      currentDate,
      userLocation,
      rawBodies
    );
    return {
      allBodies: updatedBodies,
      sky: computedSky,
      houseCusps: computedCusps,
    };
  }, [currentDate, userLocation]);

  // Filter bodies based on classical (9) vs extended (12)
  const displayedBodies = useMemo(() => {
    if (systemMode === 'classical') {
      return allBodies.filter((b) => b.category === 'classical');
    }
    return allBodies;
  }, [allBodies, systemMode]);

  // Compute aspects
  const aspects = useMemo(() => {
    return calculateAspects(displayedBodies);
  }, [displayedBodies]);

  // Compute transits
  const transits = useMemo(() => {
    return calculateTransits(currentDate, displayedBodies);
  }, [currentDate, displayedBodies]);

  // Memoize static natal ephemeris so it NEVER recomputes on time playback
  const natalEphemeris = useMemo(() => {
    const birthDate = new Date(natalProfile.birthDate);
    const birthEphemeris = calculateAllCelestialBodies(birthDate, {
      latitude: natalProfile.latitude,
      longitude: natalProfile.longitude,
      altitude: 0,
      cityName: natalProfile.cityName,
      timezone: 'UTC',
    });
    const birthMoon = birthEphemeris.bodies.find((b) => b.key === 'moon');
    const birthSun = birthEphemeris.bodies.find((b) => b.key === 'sun');
    const { sky: birthSky } = calculateSkyAndHouses(
      birthDate,
      {
        latitude: natalProfile.latitude,
        longitude: natalProfile.longitude,
        altitude: 0,
        cityName: natalProfile.cityName,
        timezone: 'UTC',
      },
      birthEphemeris.bodies
    );

    return {
      birthDate,
      birthMoonLon: birthMoon ? birthMoon.longitudeSidereal : 45.0,
      birthMoonSign: birthMoon ? birthMoon.signIndex : 1,
      birthSunLon: birthSun ? birthSun.longitudeSidereal : 180.0,
      birthLagnaSign: Math.floor(birthSky.ascendantDegree / 30),
    };
  }, [natalProfile]);

  // Compute Vimshottari Dashas from natal profile
  const activeDasha = useMemo(() => {
    return calculateVimshottariDasha(
      natalEphemeris.birthDate,
      natalEphemeris.birthMoonLon,
      currentDate
    );
  }, [natalEphemeris, currentDate]);

  // Compute planetary hours (Hora)
  const { currentHora, allHoras } = useMemo(() => {
    return calculatePlanetaryHours(currentDate, userLocation);
  }, [currentDate, userLocation]);

  // Compute Sookshmadasha Opportunities & Risks
  const sookshmaDirectives = useMemo(() => {
    return getSookshmaDirectives(
      activeDasha.mahadasha.lord,
      activeDasha.antardasha.lord,
      activeDasha.pratyantardasha.lord,
      activeDasha.sookshmadasha.lord
    );
  }, [activeDasha]);

  // Compute major periods (Saturn Return, Sade Sati, Jupiter Return)
  const majorPeriods = useMemo(() => {
    const currentSaturn = allBodies.find((b) => b.key === 'saturn');
    const currentSaturnSign = currentSaturn ? currentSaturn.signIndex : 10;
    return calculateMajorPeriods(
      natalEphemeris.birthDate,
      natalEphemeris.birthMoonSign,
      currentDate,
      currentSaturnSign
    );
  }, [natalEphemeris, currentDate, allBodies]);

  // Compute Varshaphal
  const varshaphal = useMemo(() => {
    return calculateVarshaphal(
      currentDate.getFullYear(),
      natalEphemeris.birthDate,
      natalEphemeris.birthSunLon,
      natalEphemeris.birthLagnaSign,
      userLocation
    );
  }, [natalEphemeris, currentDate, userLocation]);

  // Compute Planetary Energy Score & Vitality via Authentic Vedic Shadbala
  const chartEnergy = useMemo(() => {
    return calculatePlanetaryEnergies(displayedBodies, aspects, sky, currentDate);
  }, [displayedBodies, aspects, sky, currentDate]);

  // Compute Full Natal Chart Blueprint (Jaimini Karakas, Divisional, Yogas)
  const natalBlueprint = useMemo(() => {
    return calculateNatalChartBlueprint(
      new Date(natalProfile.birthDate),
      {
        latitude: natalProfile.latitude,
        longitude: natalProfile.longitude,
        altitude: 0,
        cityName: natalProfile.cityName,
        timezone: 'UTC',
      }
    );
  }, [natalProfile]);

  // Active directive
  const activeDirective = useMemo(() => {
    const targetKey = selectedPlanetKey || activeDasha.mahadasha.lord || 'sun';
    const body = allBodies.find((b) => b.key === targetKey) || allBodies[0];
    return getDirectiveForBody(body);
  }, [selectedPlanetKey, activeDasha, allBodies]);

  // Conversational AI Chat Runner using Gemini 3.8 Flash
  const sendChatMessage = useCallback(
    async (
      userPrompt: string,
      existingHistory?: ChatMessage[]
    ): Promise<ChatMessage | null> => {
      const trimmed = userPrompt.trim();
      if (!trimmed) return null;

      setAiLoading(true);
      setAiError(null);

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };

      const historyToSend = existingHistory || chatMessages;
      const updatedMessages = [...historyToSend, userMsg];
      setChatMessages(updatedMessages);

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
            lagnaSign: ZODIAC_SIGNS[natalBlueprint.lagnaSignIndex]?.name,
            lagnaDegree: natalBlueprint.lagnaDegree,
            moonSign: ZODIAC_SIGNS[natalBlueprint.moonSignIndex]?.name,
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
              sign: ZODIAC_SIGNS[p.signIndex]?.name,
              degree: p.signDegree,
              house: p.house,
              dignity: p.dignity,
              powerPercentage: p.powerPercentage,
            })),
          },
          activeDasha: {
            mahadasha: activeDasha.mahadasha,
            antardasha: activeDasha.antardasha,
            pratyantardasha: activeDasha.pratyantardasha,
            sookshmadasha: activeDasha.sookshmadasha,
          },
          currentHora: currentHora.planet,
          varshaphalYearLord: varshaphal.varsheshwara,
          varshaphalMunthaHouse: varshaphal.munthaHouse,
          transitingBodies: displayedBodies.map((b) => ({
            name: b.name,
            sign: ZODIAC_SIGNS[b.signIndex]?.name,
            degree: b.signDegree,
            house: b.house,
            isRetrograde: b.isRetrograde,
          })),
        };

        const res = await fetch('/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: trimmed,
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            strategicFocus,
            celestialContext,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error ${res.status}`);
        }

        const data = await res.json();
        const spotlightKeys = data.spotlightKeys || [];

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          role: 'assistant',
          content: data.analysis,
          timestamp: Date.now(),
          model: data.model || aiModel,
          spotlightKeys,
        };

        setChatMessages((prev) => [...prev, assistantMsg]);
        setAiResponse(data.analysis);
        return assistantMsg;
      } catch (err: any) {
        console.error('AI Analysis failed:', err);
        const errMsg =
          err.message || 'Failed to synthesize telemetry with Gemini 3.8 Flash.';
        setAiError(errMsg);
        return null;
      } finally {
        setAiLoading(false);
      }
    },
    [
      chatMessages,
      currentDate,
      userLocation,
      natalProfile,
      strategicFocus,
      chartEnergy,
      natalBlueprint,
      activeDasha,
      currentHora,
      varshaphal,
      displayedBodies,
      aiModel,
    ]
  );

  const clearChat = useCallback(() => {
    setChatMessages([]);
    setAiResponse(null);
    setAiError(null);
  }, []);

  const runAiAnalysis = useCallback(
    async (customQuestion?: string) => {
      const question =
        customQuestion ||
        (chatMessages.length === 0
          ? `Provide a comprehensive planetary timing evaluation aligned to ${strategicFocus}: what should I execute, what should I avoid, and how should I navigate the active Sookshmadasha, transits, and natal blueprint?`
          : 'Continue the analysis with real-time transit telemetry.');
      await sendChatMessage(question);
    },
    [sendChatMessage, strategicFocus, chatMessages.length]
  );

  const value: AstrologyContextType = {
    currentDate,
    setCurrentDate,
    isLiveSync,
    setIsLiveSync,
    userLocation,
    setUserLocation: updateUserLocation,
    autoDetectLocation,
    isDetectingLocation,
    natalProfile,
    setNatalProfile: updateNatalProfile,
    systemMode,
    setSystemMode,
    wheelOrientation,
    setWheelOrientation,
    activeDivisionLens,
    setActiveDivisionLens,
    selectedPlanetKey,
    setSelectedPlanetKey,
    inspectedEntity,
    setInspectedEntity,
    strategicFocus,
    setStrategicFocus,
    isPlaying,
    speedMultiplier,
    setSpeedMultiplier,
    togglePlayback,
    arrowMultiplierAmount,
    setArrowMultiplierAmount,
    arrowMultiplierUnit,
    setArrowMultiplierUnit,
    stepTime,
    resetToNow,
    isAiWorkspaceOpen,
    setIsAiWorkspaceOpen,
    aiResponse,
    setAiResponse,
    aiLoading,
    setAiLoading,
    aiError,
    setAiError,
    aiModel,
    chatMessages,
    setChatMessages,
    sendChatMessage,
    clearChat,
    runAiAnalysis,
    allBodies,
    displayedBodies,
    sky,
    houseCusps,
    aspects,
    transits,
    activeDasha,
    currentHora,
    allHoras,
    sookshmaDirectives,
    majorPeriods,
    varshaphal,
    activeDirective,
    chartEnergy,
    natalBlueprint,
    leftSidebarTab,
    setLeftSidebarTab,
  };

  return <AstrologyContext.Provider value={value}>{children}</AstrologyContext.Provider>;
}

export function useAstrology() {
  const context = useContext(AstrologyContext);
  if (!context) {
    throw new Error('useAstrology must be used within an AstrologyProvider');
  }
  return context;
}
