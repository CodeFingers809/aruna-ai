export type BodyKey =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'rahu'
  | 'ketu'
  | 'uranus'
  | 'neptune'
  | 'pluto';

export type BodyCategory = 'classical' | 'outer';

export type Dignity =
  | 'exalted'
  | 'moolatrikona'
  | 'own'
  | 'friend'
  | 'neutral'
  | 'enemy'
  | 'debilitated';

export interface CelestialBody {
  key: BodyKey;
  name: string;
  sanskritName: string;
  symbol: string;
  color: string;
  category: BodyCategory;
  // Longitudes in degrees [0, 360)
  longitudeTropical: number;
  longitudeSidereal: number;
  latitude: number;
  // Daily speed in degrees/day (negative = retrograde)
  speed: number;
  isRetrograde: boolean;
  // Calculated astrological positions (Sidereal)
  signIndex: number; // 0 to 11 (Aries to Pisces)
  signDegree: number; // 0 to 30
  house: number; // 1 to 12
  nakshatraIndex: number; // 0 to 26
  nakshatraDegree: number; // 0 to 13.333
  pada: number; // 1 to 4
  dignity: Dignity;
  isCombust: boolean;
  // Horizontal coordinates relative to observer
  altitude: number; // Degrees above/below horizon (-90 to +90)
  azimuth: number; // Degrees from North (0 to 360)
  isVisibleAboveHorizon: boolean;
}

export interface ZodiacSign {
  index: number;
  name: string;
  sanskritName: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  ruler: BodyKey;
  startDegree: number;
  endDegree: number;
}

export interface Nakshatra {
  index: number;
  name: string;
  lord: BodyKey;
  deity: string;
  symbol: string;
  startDegree: number;
  endDegree: number;
  padas: {
    pada: number;
    navamshaSignIndex: number;
  }[];
}

export interface HouseCusp {
  house: number;
  signIndex: number;
  degree: number; // In Sidereal
  degreeTropical: number;
  altitudeStart: number;
  altitudeEnd: number;
}

export type AspectType =
  | 'conjunction'
  | 'sextile'
  | 'square'
  | 'trine'
  | 'opposition'
  | 'drishti';

export interface Aspect {
  body1: BodyKey;
  body2: BodyKey;
  type: AspectType;
  angle: number; // Angular separation in degrees
  orb: number; // Degrees away from exact
  isHarmonious: boolean;
  description: string;
}

export type DivisionType =
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D7'
  | 'D9'
  | 'D10'
  | 'D12'
  | 'D60';

export interface DivisionInfo {
  type: DivisionType;
  name: string;
  sanskritName: string;
  divisionsPerSign: number;
  arcSpanMinutes: number; // In arcminutes (e.g. D9 is 200' = 3°20')
  description: string;
  physicalGeometry: string;
}

export interface BodyDivisionState {
  divisionType: DivisionType;
  signIndex: number;
  signDegree: number;
  isVargottama: boolean;
}

export interface ObserverLocation {
  latitude: number;
  longitude: number;
  altitude: number;
  cityName: string;
  timezone: string;
}

export interface SkyOrientation {
  zenithDegree: number; // Midheaven (MC) in Sidereal [0, 360)
  zenithDegreeTropical: number;
  nadirDegree: number; // IC
  ascendantDegree: number; // Lagna (Eastern Horizon)
  ascendantDegreeTropical: number;
  descendantDegree: number; // Western Horizon
  localSiderealTime: number; // In hours [0, 24)
  isDaytime: boolean;
  solarAltitude: number;
}

export interface DashaNode {
  level: 'maha' | 'antar' | 'pratyantar' | 'sookshma';
  lord: BodyKey;
  startDate: string;
  endDate: string;
  durationDays: number;
  progressPercentage: number; // 0 to 100
  isActive: boolean;
}

export interface ActiveDashaChain {
  mahadasha: DashaNode;
  antardasha: DashaNode;
  pratyantardasha: DashaNode;
  sookshmadasha: DashaNode;
}

export interface HoraPeriod {
  planet: BodyKey;
  startTime: string;
  endTime: string;
  isCurrent: boolean;
  nature: string;
  focus: string;
  risk: string;
}

export interface TransitEvent {
  planet: BodyKey;
  currentSign: number;
  entryDate: string;
  exitDate: string;
  nextSign: number;
  daysRemaining: number;
  shiftDescription?: string;
  meaning?: string;
  mandate?: string;
  restraints?: string;
  retrogradeWindow?: {
    startDate: string;
    endDate: string;
  };
}

export interface MajorPeriod {
  type: 'saturn_return' | 'sade_sati' | 'jupiter_return';
  title: string;
  phase: string;
  startDate: string;
  peakDate?: string;
  endDate: string;
  description: string;
  actionProtocol: string;
}

export interface ActionGuidance {
  planetKey: BodyKey;
  mandate: string; // What to do
  avoid: string; // What to avoid
  executionProtocol: string; // How to execute
  retrogradeProtocol?: string;
}

export interface SookshmaDirectives {
  opportunities: string[];
  risks: string[];
  operationalFocus: string;
}

export interface NatalProfile {
  name: string;
  birthDate: string; // ISO string
  latitude: number;
  longitude: number;
  cityName: string;
}

export interface VarshaphalData {
  year: number;
  solarReturnDate: string;
  varshaLagna: number;
  munthaSign: number;
  munthaHouse: number;
  varsheshwara: BodyKey;
}
