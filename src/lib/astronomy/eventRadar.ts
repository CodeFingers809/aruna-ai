import { BodyKey } from '@/types/astronomy';
import { NatalChartBlueprint } from '@/lib/astronomy/natal';
import { ZODIAC_SIGNS } from '@/lib/astronomy/constants';

export type EventHorizon = 'future' | 'past';
export type EventDomain = 'career' | 'wealth' | 'love' | 'health' | 'dharma' | 'all';
export type QualityTier =
  | 'CRITICAL_MILESTONE'
  | 'HIGH_STAKES_BREAKTHROUGH'
  | 'STRUCTURAL_CRUCIBLE'
  | 'KARMIC_TRANSITION';

export interface VedicRadarEvent {
  id: string;
  type: string;
  title: string;
  sanskritTitle: string;
  peakDate: string; // YYYY-MM-DD
  peakTimestamp: number;
  horizon: EventHorizon;
  daysFromNow: number;
  domain: EventDomain;
  applicableDomains: EventDomain[];
  qualityTier: QualityTier;
  nature: 'favorable' | 'challenging' | 'transformational';
  transitBody: BodyKey;
  targetHouseFromLagna: number;
  targetHouseFromMoon: number;
  natalPointTargeted: string;
  classicalMechanism: string;
  natalCrossVerification: string;
  tacticalDirective: string;
  tacticalAvoid: string;
  badgeClass: string;
}

export interface EventRadarOptions {
  horizon?: EventHorizon | 'all';
  domain?: EventDomain;
  timeRangeYears?: number; // 0.5, 1, 2, 3
}

interface RawAstronomicalEvent {
  year: number;
  month: number; // 0-indexed (0 = Jan, 11 = Dec)
  day: number;
  planet: BodyKey;
  signIndex: number;
  type: string;
  sanskrit: string;
  desc: string;
}

/**
 * Known astronomical ephemeris milestone vectors (Past & Future anchors covering 2022 through 2028/2029)
 * Computed with astronomy-engine high-precision geocentric coordinates and Lahiri ayanamsha:
 * - 48 annual Solar Ingresses / Sankrantis (2024–2027) + key 2028 ingress
 * - Major Retrograde and Direct Stations (Mars, Venus, Jupiter, Saturn, Mercury)
 * - Major Planetary Ingresses (Saturn, Jupiter, Rahu-Ketu, Mars)
 * - Solar and Lunar Eclipses (2023–2027)
 */
export const RAW_ASTRONOMICAL_EVENTS: RawAstronomicalEvent[] = [
  // ==========================================================================
  // 1. 2022 HISTORICAL ANCHORS
  // ==========================================================================
  {
    year: 2022,
    month: 3,
    day: 12,
    planet: 'rahu',
    signIndex: 0, // Aries
    type: 'nodal_ingress',
    sanskrit: 'Rahu-Ketu Mesha-Tula Sanchara',
    desc: 'True Nodes shifted onto the Aries-Libra axis, activating the polarity between personal identity and contractual alliances.',
  },
  {
    year: 2022,
    month: 3,
    day: 13,
    planet: 'jupiter',
    signIndex: 11, // Pisces
    type: 'jupiter_ingress',
    sanskrit: 'Guru Meena Pravesha',
    desc: 'Jupiter entered own sign Pisces (Swakshetra), establishing an annual cycle of philosophical and contemplative expansion.',
  },
  {
    year: 2022,
    month: 3,
    day: 29,
    planet: 'saturn',
    signIndex: 10, // Aquarius
    type: 'saturn_ingress',
    sanskrit: 'Shani Kumbha Pravesha (Prathama)',
    desc: 'Saturn briefly entered own moolatrikona sign Aquarius, initiating a preview of multi-year institutional duty.',
  },

  // ==========================================================================
  // 2. 2023 HISTORICAL ANCHORS
  // ==========================================================================
  {
    year: 2023,
    month: 0,
    day: 17,
    planet: 'saturn',
    signIndex: 10, // Aquarius
    type: 'saturn_ingress',
    sanskrit: 'Shani Kumbha Pravesha',
    desc: 'Saturn entered own moolatrikona sign Aquarius, concluding its Capricorn transit and establishing a multi-year foundation of institutional discipline.',
  },
  {
    year: 2023,
    month: 3,
    day: 20,
    planet: 'sun',
    signIndex: 0, // Aries
    type: 'solar_eclipse',
    sanskrit: 'Surya Grahan (Ashwini)',
    desc: 'Total Solar Eclipse in Aries (Ashwini nakshatra), calling for internal reflection on identity, initiative, and vital energy.',
  },
  {
    year: 2023,
    month: 3,
    day: 22,
    planet: 'jupiter',
    signIndex: 0, // Aries
    type: 'jupiter_ingress',
    sanskrit: 'Guru Mesha Pravesha',
    desc: 'Jupiter entered Aries, initiating a new 12-year solar expansion round and casting auspicious trinal drishti on Leo and Sagittarius.',
  },
  {
    year: 2023,
    month: 4,
    day: 5,
    planet: 'moon',
    signIndex: 6, // Libra
    type: 'lunar_eclipse',
    sanskrit: 'Chandra Grahan (Vishakha)',
    desc: 'Penumbral Lunar Eclipse in Libra, illuminating subconscious attachments and demanding equanimity in partnerships.',
  },
  {
    year: 2023,
    month: 5,
    day: 17,
    planet: 'saturn',
    signIndex: 10, // Aquarius
    type: 'saturn_station',
    sanskrit: 'Shani Kumbha Vakra Sthiti',
    desc: 'Saturn stationed retrograde at 13° Aquarius, enforcing meticulous review of pending structural commitments.',
  },
  {
    year: 2023,
    month: 6,
    day: 23,
    planet: 'venus',
    signIndex: 4, // Leo
    type: 'venus_station',
    sanskrit: 'Shukra Simha Vakra Sthiti',
    desc: 'Venus stationed retrograde in Leo, prompting deep reassessment of partnership values and financial allocations.',
  },
  {
    year: 2023,
    month: 8,
    day: 4,
    planet: 'venus',
    signIndex: 3, // Cancer
    type: 'venus_station',
    sanskrit: 'Shukra Karka Marga Gati',
    desc: 'Venus completed retrograde motion and stationed direct in late Cancer, restoring bilateral goodwill and domestic tranquility.',
  },
  {
    year: 2023,
    month: 8,
    day: 4,
    planet: 'jupiter',
    signIndex: 0, // Aries
    type: 'jupiter_station',
    sanskrit: 'Guru Mesha Vakra Sthiti',
    desc: 'Jupiter stationed retrograde in Aries at 21° sidereal, internalizing dharmic expansion and advising review of philosophical pursuits.',
  },
  {
    year: 2023,
    month: 9,
    day: 14,
    planet: 'sun',
    signIndex: 5, // Virgo
    type: 'solar_eclipse',
    sanskrit: 'Surya Grahan (Chitra)',
    desc: 'Annular Solar Eclipse in Virgo, calling for internal reflection on service, health discipline, and administrative duties.',
  },
  {
    year: 2023,
    month: 9,
    day: 28,
    planet: 'moon',
    signIndex: 0, // Aries
    type: 'lunar_eclipse',
    sanskrit: 'Chandra Grahan (Bharani)',
    desc: 'Partial Lunar Eclipse in Aries, concluding emotional karmic loops and fostering spiritual equanimity.',
  },
  {
    year: 2023,
    month: 9,
    day: 30,
    planet: 'rahu',
    signIndex: 11, // Pisces
    type: 'nodal_ingress',
    sanskrit: 'Rahu-Ketu Meena-Kanya Sanchara',
    desc: 'True Nodes shifted onto the Pisces-Virgo axis for an 18-month karmic transit cycle, highlighting spiritual discernment and analytical duties.',
  },
  {
    year: 2023,
    month: 10,
    day: 4,
    planet: 'saturn',
    signIndex: 10, // Aquarius
    type: 'saturn_station',
    sanskrit: 'Shani Kumbha Marga Gati',
    desc: 'Saturn stationed direct in Aquarius at 6° sidereal, rewarding steady perseverance and releasing forward momentum.',
  },
  {
    year: 2023,
    month: 11,
    day: 31,
    planet: 'jupiter',
    signIndex: 0, // Aries
    type: 'jupiter_station',
    sanskrit: 'Guru Mesha Marga Gati',
    desc: 'Jupiter completed retrograde motion and stationed direct in Aries at 11° sidereal, releasing forward momentum in educational pursuits.',
  },

  // ==========================================================================
  // 3. 2024 COMPLETE ASTRONOMICAL MILESTONES (12 Sankrantis + Stations + Eclipses)
  // ==========================================================================
  {
    year: 2024,
    month: 0,
    day: 15,
    planet: 'sun',
    signIndex: 9, // Capricorn
    type: 'solar_sankranti',
    sanskrit: 'Makara Sankranti',
    desc: 'Sun ingresses into Capricorn (Makara), marking Uttarayana (northern movement) and stimulating career endurance and institutional responsibility.',
  },
  {
    year: 2024,
    month: 1,
    day: 6,
    planet: 'mars',
    signIndex: 9, // Capricorn
    type: 'mars_exaltation',
    sanskrit: 'Mangala Makara Uchcha Sanchara',
    desc: 'Mars enters Capricorn in supreme exaltation (Uchcha), delivering unyielding fortitude, tactical discipline, and capacity to overcome adversity.',
  },
  {
    year: 2024,
    month: 1,
    day: 13,
    planet: 'sun',
    signIndex: 10, // Aquarius
    type: 'solar_sankranti',
    sanskrit: 'Kumbha Sankranti',
    desc: 'Sun ingresses into Aquarius (Kumbha), activating collective obligations, public networks, and systemic duties.',
  },
  {
    year: 2024,
    month: 2,
    day: 14,
    planet: 'sun',
    signIndex: 11, // Pisces
    type: 'solar_sankranti',
    sanskrit: 'Meena Sankranti',
    desc: 'Sun ingresses into Pisces (Meena), activating contemplative inquiry, dissolution of material concerns, and charitable expenditure.',
  },
  {
    year: 2024,
    month: 2,
    day: 25,
    planet: 'moon',
    signIndex: 5, // Virgo
    type: 'lunar_eclipse',
    sanskrit: 'Chandra Grahan (Hasta)',
    desc: 'Lunar Eclipse in Virgo, illuminating cognitive patterns and encouraging mindfulness in daily duty and health regimens.',
  },
  {
    year: 2024,
    month: 3,
    day: 2,
    planet: 'mercury',
    signIndex: 0, // Aries
    type: 'mercury_station',
    sanskrit: 'Budha Mesha Vakra Sthiti',
    desc: 'Mercury stations retrograde in Aries, prompting verification of rapid communications and immediate transactional terms.',
  },
  {
    year: 2024,
    month: 3,
    day: 8,
    planet: 'sun',
    signIndex: 11, // Pisces
    type: 'solar_eclipse',
    sanskrit: 'Surya Grahan (Revati)',
    desc: 'Total Solar Eclipse in Pisces (Revati nakshatra), concluding a major spiritual cycle and urging silent contemplation.',
  },
  {
    year: 2024,
    month: 3,
    day: 13,
    planet: 'sun',
    signIndex: 0, // Aries
    type: 'solar_sankranti',
    sanskrit: 'Mesha Sankranti',
    desc: 'Sun ingresses into Aries (Mesha) in supreme exaltation (Uchcha), maximizing executive vitality, personal initiative, and dharmic authority.',
  },
  {
    year: 2024,
    month: 4,
    day: 1,
    planet: 'jupiter',
    signIndex: 1, // Taurus
    type: 'jupiter_ingress',
    sanskrit: 'Guru Vrishabha Pravesha',
    desc: 'Jupiter entered Taurus (Venusian earth sign), supporting material stability and ethical wealth accumulation.',
  },
  {
    year: 2024,
    month: 4,
    day: 14,
    planet: 'sun',
    signIndex: 1, // Taurus
    type: 'solar_sankranti',
    sanskrit: 'Vrishabha Sankranti',
    desc: 'Sun ingresses into Taurus (Vrishabha), stabilizing material resources, family assets, and fiscal planning.',
  },
  {
    year: 2024,
    month: 5,
    day: 14,
    planet: 'sun',
    signIndex: 2, // Gemini
    type: 'solar_sankranti',
    sanskrit: 'Mithuna Sankranti',
    desc: 'Sun ingresses into Gemini (Mithuna), stimulating trade, technical communication, and intellectual focus.',
  },
  {
    year: 2024,
    month: 5,
    day: 29,
    planet: 'saturn',
    signIndex: 10, // Aquarius
    type: 'saturn_station',
    sanskrit: 'Shani Kumbha Vakra Sthiti',
    desc: 'Saturn stations retrograde in Aquarius at 25° sidereal, demanding thorough accountability in long-term works.',
  },
  {
    year: 2024,
    month: 6,
    day: 16,
    planet: 'sun',
    signIndex: 3, // Cancer
    type: 'solar_sankranti',
    sanskrit: 'Karka Sankranti',
    desc: 'Sun ingresses into Cancer (Karka), marking Dakshinayana (southern movement) and directing focus toward domestic foundations and emotional balance.',
  },
  {
    year: 2024,
    month: 7,
    day: 5,
    planet: 'mercury',
    signIndex: 4, // Leo
    type: 'mercury_station',
    sanskrit: 'Budha Simha Vakra Sthiti',
    desc: 'Mercury stations retrograde in Leo, calling for review of official statements and administrative records.',
  },
  {
    year: 2024,
    month: 7,
    day: 16,
    planet: 'sun',
    signIndex: 4, // Leo
    type: 'solar_sankranti',
    sanskrit: 'Simha Sankranti',
    desc: 'Sun ingresses into own moolatrikona sign Leo (Simha), delivering maximum sovereign authority and administrative capacity.',
  },
  {
    year: 2024,
    month: 8,
    day: 16,
    planet: 'sun',
    signIndex: 5, // Virgo
    type: 'solar_sankranti',
    sanskrit: 'Kanya Sankranti',
    desc: 'Sun ingresses into Virgo (Kanya), directing attention to rigorous analytical documentation, operational discipline, and duty fulfillment.',
  },
  {
    year: 2024,
    month: 8,
    day: 18,
    planet: 'moon',
    signIndex: 11, // Pisces
    type: 'lunar_eclipse',
    sanskrit: 'Chandra Grahan (Meena)',
    desc: 'Partial Lunar Eclipse in Pisces, fostering emotional surrender, inner quietude, and dissolution of mental anxieties.',
  },
  {
    year: 2024,
    month: 9,
    day: 2,
    planet: 'sun',
    signIndex: 5, // Virgo
    type: 'solar_eclipse',
    sanskrit: 'Surya Grahan (Kanya)',
    desc: 'Annular Solar Eclipse in Virgo (Hasta nakshatra), calling for discernment, bodily purification, and fulfillment of duties.',
  },
  {
    year: 2024,
    month: 9,
    day: 9,
    planet: 'jupiter',
    signIndex: 1, // Taurus
    type: 'jupiter_station',
    sanskrit: 'Guru Vrishabha Vakra Sthiti',
    desc: 'Jupiter stations retrograde in Taurus at 27° sidereal, turning focus toward financial audit and consolidating family reserves.',
  },
  {
    year: 2024,
    month: 9,
    day: 17,
    planet: 'sun',
    signIndex: 6, // Libra
    type: 'solar_sankranti',
    sanskrit: 'Tula Sankranti',
    desc: 'Sun ingresses into Libra (Tula) in debilitation (Neecha), cautioning against egoic compromises and calling for balance in contractual alliances.',
  },
  {
    year: 2024,
    month: 9,
    day: 20,
    planet: 'mars',
    signIndex: 3, // Cancer
    type: 'mars_debilitation',
    sanskrit: 'Mangala Karka Neecha Pravesha',
    desc: 'Mars enters Cancer in debilitation (Neecha), cautioning against reactive impulses and requiring careful physical discipline.',
  },
  {
    year: 2024,
    month: 10,
    day: 15,
    planet: 'saturn',
    signIndex: 10, // Aquarius
    type: 'saturn_station',
    sanskrit: 'Shani Marga Gati (Kumbha)',
    desc: 'Saturn completed retrograde motion and stationed direct at 18° Aquarius, rewarding steady perseverance.',
  },
  {
    year: 2024,
    month: 10,
    day: 16,
    planet: 'sun',
    signIndex: 7, // Scorpio
    type: 'solar_sankranti',
    sanskrit: 'Vrishchika Sankranti',
    desc: 'Sun ingresses into Scorpio (Vrishchika), activating deep investigative inquiry, confidential matters, and psychological stamina.',
  },
  {
    year: 2024,
    month: 10,
    day: 26,
    planet: 'mercury',
    signIndex: 7, // Scorpio
    type: 'mercury_station',
    sanskrit: 'Budha Vrishchika Vakra Sthiti',
    desc: 'Mercury stations retrograde in Scorpio, advising thorough scrutiny of financial accounts and confidential agreements.',
  },
  {
    year: 2024,
    month: 11,
    day: 6,
    planet: 'mars',
    signIndex: 3, // Cancer
    type: 'mars_station',
    sanskrit: 'Mangala Karka Vakra Sthiti',
    desc: 'Mars stations retrograde in Cancer at 12° sidereal, internalizing assertive energy and demanding patient emotional restraint.',
  },
  {
    year: 2024,
    month: 11,
    day: 15,
    planet: 'sun',
    signIndex: 8, // Sagittarius
    type: 'solar_sankranti',
    sanskrit: 'Dhanu Sankranti',
    desc: 'Sun ingresses into Sagittarius (Dhanu), initiating Dhanurmas with focus on scriptural study, preceptors, and ethical alignment.',
  },

  // ==========================================================================
  // 4. 2025 COMPLETE ASTRONOMICAL MILESTONES (12 Sankrantis + Stations + Eclipses)
  // ==========================================================================
  {
    year: 2025,
    month: 0,
    day: 14,
    planet: 'sun',
    signIndex: 9, // Capricorn
    type: 'solar_sankranti',
    sanskrit: 'Makara Sankranti',
    desc: 'Sun ingresses into Capricorn (Makara), marking Uttarayana (northern course) and directing vitality toward civic duty and enduring works.',
  },
  {
    year: 2025,
    month: 1,
    day: 4,
    planet: 'jupiter',
    signIndex: 1, // Taurus
    type: 'jupiter_station',
    sanskrit: 'Guru Vrishabha Marga Gati',
    desc: 'Jupiter stations direct in Taurus at 17° sidereal, releasing forward momentum for material stability and ethical wealth accumulation.',
  },
  {
    year: 2025,
    month: 1,
    day: 12,
    planet: 'sun',
    signIndex: 10, // Aquarius
    type: 'solar_sankranti',
    sanskrit: 'Kumbha Sankranti',
    desc: 'Sun ingresses into Aquarius (Kumbha), activating social welfare commitments, institutional networks, and structural duties.',
  },
  {
    year: 2025,
    month: 1,
    day: 24,
    planet: 'mars',
    signIndex: 2, // Gemini
    type: 'mars_station',
    sanskrit: 'Mangala Mithuna Marga Gati',
    desc: 'Mars completes retrograde motion and stations direct at 22° Gemini, unlocking direct execution, technical focus, and intellectual vigor.',
  },
  {
    year: 2025,
    month: 2,
    day: 2,
    planet: 'venus',
    signIndex: 11, // Pisces
    type: 'venus_station',
    sanskrit: 'Shukra Meena Uchcha Vakra Sthiti',
    desc: 'Exalted Venus stations retrograde in Pisces at 16° sidereal, deepening devotional contemplation and requiring evaluation of relational boundaries.',
  },
  {
    year: 2025,
    month: 2,
    day: 14,
    planet: 'moon',
    signIndex: 4, // Leo
    type: 'lunar_eclipse',
    sanskrit: 'Chandra Grahan (Purva Phalguni)',
    desc: 'Total Lunar Eclipse in Leo, illuminating subconscious attachments and fostering emotional release from egoic expectations.',
  },
  {
    year: 2025,
    month: 2,
    day: 14,
    planet: 'sun',
    signIndex: 11, // Pisces
    type: 'solar_sankranti',
    sanskrit: 'Meena Sankranti',
    desc: 'Sun ingresses into Pisces (Meena), closing the solar zodiacal cycle through spiritual introspection, charitable duty, and non-attachment.',
  },
  {
    year: 2025,
    month: 2,
    day: 15,
    planet: 'mercury',
    signIndex: 11, // Pisces
    type: 'mercury_station',
    sanskrit: 'Budha Meena Vakra Sthiti',
    desc: 'Mercury stations retrograde in Pisces in debilitation, requiring extra care in accounting, mathematical calculations, and written terms.',
  },
  {
    year: 2025,
    month: 2,
    day: 29,
    planet: 'saturn',
    signIndex: 11, // Pisces
    type: 'saturn_ingress',
    sanskrit: 'Shani Meena Pravesha',
    desc: 'Saturn enters oceanic Pisces, concluding its transit through own signs and directing karma toward spiritual contemplation and philosophical discipline.',
  },
  {
    year: 2025,
    month: 2,
    day: 29,
    planet: 'sun',
    signIndex: 11, // Pisces
    type: 'solar_eclipse',
    sanskrit: 'Surya Grahan (Meena)',
    desc: 'Partial Solar Eclipse in Pisces, opening an introspective window for settling ancestral obligations and spiritual quietude.',
  },
  {
    year: 2025,
    month: 3,
    day: 13,
    planet: 'venus',
    signIndex: 11, // Pisces
    type: 'venus_station',
    sanskrit: 'Shukra Meena Marga Gati',
    desc: 'Exalted Venus stations direct in Pisces at 0° sidereal, restoring refined aesthetic harmony, bilateral goodwill, and devotion.',
  },
  {
    year: 2025,
    month: 3,
    day: 14,
    planet: 'sun',
    signIndex: 0, // Aries
    type: 'solar_sankranti',
    sanskrit: 'Mesha Sankranti',
    desc: 'Sun ingresses into Aries (Mesha) in supreme exaltation (Uchcha), renewing vital energy and initiating decisive executive endeavors.',
  },
  {
    year: 2025,
    month: 4,
    day: 14,
    planet: 'jupiter',
    signIndex: 2, // Gemini
    type: 'jupiter_ingress',
    sanskrit: 'Guru Mithuna Pravesha',
    desc: 'Jupiter enters intellectual Gemini, expanding scholarship, communication, philosophical discourse, and analytical study.',
  },
  {
    year: 2025,
    month: 4,
    day: 14,
    planet: 'sun',
    signIndex: 1, // Taurus
    type: 'solar_sankranti',
    sanskrit: 'Vrishabha Sankranti',
    desc: 'Sun ingresses into Taurus (Vrishabha), consolidating tangible reserves, family commitments, and speech integrity.',
  },
  {
    year: 2025,
    month: 4,
    day: 18,
    planet: 'rahu',
    signIndex: 10, // Aquarius
    type: 'nodal_ingress',
    sanskrit: 'Rahu-Ketu Kumbha-Simha Sanchara',
    desc: 'Rahu enters Aquarius and Ketu enters Leo, activating the karmic axis between collective welfare and sovereign individual purpose.',
  },
  {
    year: 2025,
    month: 5,
    day: 15,
    planet: 'sun',
    signIndex: 2, // Gemini
    type: 'solar_sankranti',
    sanskrit: 'Mithuna Sankranti',
    desc: 'Sun ingresses into Gemini (Mithuna), activating communicative enterprise, trade negotiations, and intellectual documentation.',
  },
  {
    year: 2025,
    month: 6,
    day: 13,
    planet: 'saturn',
    signIndex: 11, // Pisces
    type: 'saturn_station',
    sanskrit: 'Shani Meena Vakra Sthiti',
    desc: 'Saturn stations retrograde in Pisces at 7° sidereal, demanding deep introspection regarding unfulfilled responsibilities and karmic accounts.',
  },
  {
    year: 2025,
    month: 6,
    day: 16,
    planet: 'sun',
    signIndex: 3, // Cancer
    type: 'solar_sankranti',
    sanskrit: 'Karka Sankranti',
    desc: 'Sun ingresses into Cancer (Karka), marking Dakshinayana and prioritizing internal equilibrium and ancestral duties.',
  },
  {
    year: 2025,
    month: 6,
    day: 18,
    planet: 'mercury',
    signIndex: 3, // Cancer
    type: 'mercury_station',
    sanskrit: 'Budha Karka Vakra Sthiti',
    desc: 'Mercury stations retrograde in Cancer, advising patience in family discussions and domestic negotiations.',
  },
  {
    year: 2025,
    month: 7,
    day: 16,
    planet: 'sun',
    signIndex: 4, // Leo
    type: 'solar_sankranti',
    sanskrit: 'Simha Sankranti',
    desc: 'Sun ingresses into own moolatrikona sign Leo (Simha), commanding leadership presence and moral responsibility.',
  },
  {
    year: 2025,
    month: 8,
    day: 7,
    planet: 'moon',
    signIndex: 10, // Aquarius
    type: 'lunar_eclipse',
    sanskrit: 'Chandra Grahan (Purva Bhadrapada)',
    desc: 'Total Lunar Eclipse falling in early Pisces/late Aquarius, illuminating communal consciousness and mental release.',
  },
  {
    year: 2025,
    month: 8,
    day: 16,
    planet: 'sun',
    signIndex: 5, // Virgo
    type: 'solar_sankranti',
    sanskrit: 'Kanya Sankranti',
    desc: 'Sun ingresses into Virgo (Kanya), demanding thorough operational hygiene and resolution of procedural debts.',
  },
  {
    year: 2025,
    month: 8,
    day: 21,
    planet: 'sun',
    signIndex: 5, // Virgo
    type: 'solar_eclipse',
    sanskrit: 'Surya Grahan (Uttara Phalguni)',
    desc: 'Solar Eclipse in Virgo, calling for discernment, bodily purification, and fulfillment of duties.',
  },
  {
    year: 2025,
    month: 9,
    day: 17,
    planet: 'sun',
    signIndex: 6, // Libra
    type: 'solar_sankranti',
    sanskrit: 'Tula Sankranti',
    desc: 'Sun ingresses into Libra (Tula) in debilitation (Neecha), requiring equity in partnerships and moderation in ambition.',
  },
  {
    year: 2025,
    month: 9,
    day: 18,
    planet: 'jupiter',
    signIndex: 3, // Cancer
    type: 'jupiter_ingress',
    sanskrit: 'Guru Karka Uchcha Pravesha (Atichara)',
    desc: 'Jupiter briefly enters Cancer in accelerated motion into supreme exaltation (Uchcha), offering a rare dharmic blessing.',
  },
  {
    year: 2025,
    month: 10,
    day: 10,
    planet: 'mercury',
    signIndex: 7, // Scorpio
    type: 'mercury_station',
    sanskrit: 'Budha Vrishchika Vakra Sthiti',
    desc: 'Mercury stations retrograde in Scorpio, directing intellect toward forensic auditing and investigation.',
  },
  {
    year: 2025,
    month: 10,
    day: 11,
    planet: 'jupiter',
    signIndex: 3, // Cancer
    type: 'jupiter_station',
    sanskrit: 'Guru Karka Uchcha Vakra Sthiti',
    desc: 'Exalted Jupiter stations retrograde at 0° Cancer, concentrating supreme dharmic power into introspective spiritual wisdom.',
  },
  {
    year: 2025,
    month: 10,
    day: 16,
    planet: 'sun',
    signIndex: 7, // Scorpio
    type: 'solar_sankranti',
    sanskrit: 'Vrishchika Sankranti',
    desc: 'Sun ingresses into Scorpio (Vrishchika), testing fortitude through hidden obstacles and demanding steadfast resolve.',
  },
  {
    year: 2025,
    month: 10,
    day: 28,
    planet: 'saturn',
    signIndex: 11, // Pisces
    type: 'saturn_station',
    sanskrit: 'Shani Meena Marga Gati',
    desc: 'Saturn stations direct in Pisces at 0° sidereal, consolidating spiritual resolve and patient application.',
  },
  {
    year: 2025,
    month: 11,
    day: 16,
    planet: 'sun',
    signIndex: 8, // Sagittarius
    type: 'solar_sankranti',
    sanskrit: 'Dhanu Sankranti',
    desc: 'Sun ingresses into Sagittarius (Dhanu), turning focus toward philosophical inquiry and adherence to righteousness.',
  },

  // ==========================================================================
  // 5. 2026 COMPLETE ASTRONOMICAL MILESTONES (12 Sankrantis + Stations + Eclipses)
  // ==========================================================================
  {
    year: 2026,
    month: 0,
    day: 14,
    planet: 'sun',
    signIndex: 9, // Capricorn
    type: 'solar_sankranti',
    sanskrit: 'Makara Sankranti',
    desc: 'Sun ingresses into Capricorn (Makara), marking Uttarayana and directing vitality into structural karma and discipline.',
  },
  {
    year: 2026,
    month: 0,
    day: 16,
    planet: 'mars',
    signIndex: 9, // Capricorn
    type: 'mars_exaltation',
    sanskrit: 'Mangala Makara Uchcha Sanchara',
    desc: 'Mars enters Capricorn in supreme exaltation, delivering unyielding fortitude, moral courage, and capacity to execute difficult mandates.',
  },
  {
    year: 2026,
    month: 1,
    day: 13,
    planet: 'sun',
    signIndex: 10, // Aquarius
    type: 'solar_sankranti',
    sanskrit: 'Kumbha Sankranti',
    desc: 'Sun ingresses into Aquarius (Kumbha), highlighting civic accountability and collective efforts.',
  },
  {
    year: 2026,
    month: 1,
    day: 17,
    planet: 'sun',
    signIndex: 10, // Aquarius
    type: 'solar_eclipse',
    sanskrit: 'Surya Grahan (Shatabhisha)',
    desc: 'Annular Solar Eclipse in Aquarius, prompting meditation on systemic karma and public obligations.',
  },
  {
    year: 2026,
    month: 1,
    day: 26,
    planet: 'mercury',
    signIndex: 10, // Aquarius
    type: 'mercury_station',
    sanskrit: 'Budha Kumbha Vakra Sthiti',
    desc: 'Mercury stations retrograde in Aquarius, calling for audit of network systems and group communications.',
  },
  {
    year: 2026,
    month: 2,
    day: 3,
    planet: 'moon',
    signIndex: 4, // Leo
    type: 'lunar_eclipse',
    sanskrit: 'Chandra Grahan (Magha)',
    desc: 'Total Lunar Eclipse in Leo, activating deep ancestral contemplation and urging detachment from personal acclaim.',
  },
  {
    year: 2026,
    month: 2,
    day: 11,
    planet: 'jupiter',
    signIndex: 2, // Gemini
    type: 'jupiter_station',
    sanskrit: 'Guru Mithuna Marga Gati',
    desc: 'Jupiter stations direct at 20° Gemini, restoring intellectual progress and fruitful scholarly discussions.',
  },
  {
    year: 2026,
    month: 2,
    day: 15,
    planet: 'sun',
    signIndex: 11, // Pisces
    type: 'solar_sankranti',
    sanskrit: 'Meena Sankranti',
    desc: 'Sun ingresses into Pisces (Meena), fostering solitude, spiritual discernment, and charitable actions.',
  },
  {
    year: 2026,
    month: 3,
    day: 14,
    planet: 'sun',
    signIndex: 0, // Aries
    type: 'solar_sankranti',
    sanskrit: 'Mesha Sankranti',
    desc: 'Sun ingresses into Aries (Mesha) in supreme exaltation (Uchcha), elevating vitality and inaugurating purposeful action.',
  },
  {
    year: 2026,
    month: 4,
    day: 15,
    planet: 'sun',
    signIndex: 1, // Taurus
    type: 'solar_sankranti',
    sanskrit: 'Vrishabha Sankranti',
    desc: 'Sun ingresses into Taurus (Vrishabha), stabilizing material assets and family commitments.',
  },
  {
    year: 2026,
    month: 5,
    day: 1,
    planet: 'jupiter',
    signIndex: 3, // Cancer
    type: 'jupiter_ingress',
    sanskrit: 'Guru Karka Purna Uchcha Sanchara',
    desc: 'Jupiter firmly enters Cancer in exalted dignity for a full year of moral authority, wisdom, and benevolence.',
  },
  {
    year: 2026,
    month: 5,
    day: 15,
    planet: 'sun',
    signIndex: 2, // Gemini
    type: 'solar_sankranti',
    sanskrit: 'Mithuna Sankranti',
    desc: 'Sun ingresses into Gemini (Mithuna), activating trade networks and intellectual studies.',
  },
  {
    year: 2026,
    month: 5,
    day: 29,
    planet: 'mercury',
    signIndex: 3, // Cancer
    type: 'mercury_station',
    sanskrit: 'Budha Karka Vakra Sthiti',
    desc: 'Mercury stations retrograde in Cancer, prioritizing emotional clarity and factual precision over sentiment.',
  },
  {
    year: 2026,
    month: 6,
    day: 16,
    planet: 'sun',
    signIndex: 3, // Cancer
    type: 'solar_sankranti',
    sanskrit: 'Karka Sankranti',
    desc: 'Sun ingresses into Cancer (Karka), beginning Dakshinayana and prioritizing domestic peace and maternal responsibilities.',
  },
  {
    year: 2026,
    month: 6,
    day: 26,
    planet: 'saturn',
    signIndex: 11, // Pisces
    type: 'saturn_station',
    sanskrit: 'Shani Meena Vakra Sthiti',
    desc: 'Saturn stations retrograde in Pisces at 20° sidereal, settling subtle karmic balances and testing endurance.',
  },
  {
    year: 2026,
    month: 7,
    day: 12,
    planet: 'sun',
    signIndex: 3, // Cancer
    type: 'solar_eclipse',
    sanskrit: 'Surya Grahan (Ashlesha)',
    desc: 'Total Solar Eclipse in Cancer, counseling protective retreat, quietude, and deferral of worldly ventures.',
  },
  {
    year: 2026,
    month: 7,
    day: 17,
    planet: 'sun',
    signIndex: 4, // Leo
    type: 'solar_sankranti',
    sanskrit: 'Simha Sankranti',
    desc: 'Sun ingresses into own moolatrikona sign Leo (Simha), bestowing supreme confidence, administrative dignity, and clear focus.',
  },
  {
    year: 2026,
    month: 7,
    day: 28,
    planet: 'moon',
    signIndex: 10, // Aquarius
    type: 'lunar_eclipse',
    sanskrit: 'Chandra Grahan (Dhanishta)',
    desc: 'Partial Lunar Eclipse in Aquarius, clearing psychological obstacles and realigning purpose.',
  },
  {
    year: 2026,
    month: 8,
    day: 17,
    planet: 'sun',
    signIndex: 5, // Virgo
    type: 'solar_sankranti',
    sanskrit: 'Kanya Sankranti',
    desc: 'Sun ingresses into Virgo (Kanya), demanding analytical diligence, service (Seva), and attention to health details.',
  },
  {
    year: 2026,
    month: 9,
    day: 3,
    planet: 'venus',
    signIndex: 6, // Libra
    type: 'venus_station',
    sanskrit: 'Shukra Tula Sva-kshetra Vakra Sthiti',
    desc: 'Venus stations retrograde in own sign Libra at 14° sidereal, demanding rigorous audit of contracts, alliances, and joint assets.',
  },
  {
    year: 2026,
    month: 9,
    day: 17,
    planet: 'sun',
    signIndex: 6, // Libra
    type: 'solar_sankranti',
    sanskrit: 'Tula Sankranti',
    desc: 'Sun ingresses into Libra (Tula) in debilitation (Neecha), necessitating tactful negotiation and moderation in personal demands.',
  },
  {
    year: 2026,
    month: 9,
    day: 24,
    planet: 'mercury',
    signIndex: 6, // Libra
    type: 'mercury_station',
    sanskrit: 'Budha Tula Vakra Sthiti',
    desc: 'Mercury stations retrograde in Libra, requiring careful balancing of legal terms and bilateral agreements.',
  },
  {
    year: 2026,
    month: 9,
    day: 31,
    planet: 'jupiter',
    signIndex: 4, // Leo
    type: 'jupiter_ingress',
    sanskrit: 'Guru Simha Pravesha',
    desc: 'Jupiter enters royal Leo, activating solar authority, civic governance, and high-visibility mandates.',
  },
  {
    year: 2026,
    month: 10,
    day: 13,
    planet: 'venus',
    signIndex: 5, // Virgo
    type: 'venus_station',
    sanskrit: 'Shukra Kanya Marga Gati',
    desc: 'Venus stations direct at 28° Virgo, concluding contractual re-negotiations and resuming forward progress.',
  },
  {
    year: 2026,
    month: 10,
    day: 16,
    planet: 'sun',
    signIndex: 7, // Scorpio
    type: 'solar_sankranti',
    sanskrit: 'Vrishchika Sankranti',
    desc: 'Sun ingresses into Scorpio (Vrishchika), demanding perseverance and silent endurance through complex conditions.',
  },
  {
    year: 2026,
    month: 11,
    day: 5,
    planet: 'rahu',
    signIndex: 9, // Capricorn
    type: 'nodal_ingress',
    sanskrit: 'Rahu-Ketu Makara-Karka Sanchara',
    desc: 'Rahu enters Capricorn and Ketu enters Cancer, shifting karmic focus to institutional ambition, public duty, and emotional detachment.',
  },
  {
    year: 2026,
    month: 11,
    day: 10,
    planet: 'saturn',
    signIndex: 11, // Pisces
    type: 'saturn_station',
    sanskrit: 'Shani Meena Marga Gati',
    desc: 'Saturn stations direct in Pisces at 13° sidereal, providing firm grounding for spiritual discipline and quiet labor.',
  },
  {
    year: 2026,
    month: 11,
    day: 13,
    planet: 'jupiter',
    signIndex: 4, // Leo
    type: 'jupiter_station',
    sanskrit: 'Guru Simha Vakra Sthiti',
    desc: 'Jupiter stations retrograde in Leo at 2° sidereal, requiring review of leadership duties and administrative ethics.',
  },
  {
    year: 2026,
    month: 11,
    day: 16,
    planet: 'sun',
    signIndex: 8, // Sagittarius
    type: 'solar_sankranti',
    sanskrit: 'Dhanu Sankranti',
    desc: 'Sun ingresses into Sagittarius (Dhanu), turning the mind toward dharmic duties and moral counsel.',
  },

  // ==========================================================================
  // 6. 2027 COMPLETE ASTRONOMICAL MILESTONES (12 Sankrantis + Stations + Ingresses)
  // ==========================================================================
  {
    year: 2027,
    month: 0,
    day: 10,
    planet: 'mars',
    signIndex: 4, // Leo
    type: 'mars_station',
    sanskrit: 'Mangala Simha Vakra Sthiti',
    desc: 'Mars stations retrograde in Leo at 16° sidereal, testing executive decisions and cautioning against hasty leadership gambles.',
  },
  {
    year: 2027,
    month: 0,
    day: 14,
    planet: 'sun',
    signIndex: 9, // Capricorn
    type: 'solar_sankranti',
    sanskrit: 'Makara Sankranti',
    desc: 'Sun ingresses into Capricorn (Makara), marking Uttarayana and calling for steadfast labor in professional duty.',
  },
  {
    year: 2027,
    month: 1,
    day: 6,
    planet: 'sun',
    signIndex: 9, // Capricorn
    type: 'solar_eclipse',
    sanskrit: 'Surya Grahan (Shravana)',
    desc: 'Annular Solar Eclipse in Capricorn, requiring patient introspection in civic and institutional duty.',
  },
  {
    year: 2027,
    month: 1,
    day: 13,
    planet: 'sun',
    signIndex: 10, // Aquarius
    type: 'solar_sankranti',
    sanskrit: 'Kumbha Sankranti',
    desc: 'Sun ingresses into Aquarius (Kumbha), activating broader social networks and humanitarian duty.',
  },
  {
    year: 2027,
    month: 1,
    day: 20,
    planet: 'moon',
    signIndex: 4, // Leo
    type: 'lunar_eclipse',
    sanskrit: 'Chandra Grahan (Purva Phalguni)',
    desc: 'Penumbral Lunar Eclipse in Leo, cultivating self-restraint and inner calm.',
  },
  {
    year: 2027,
    month: 2,
    day: 15,
    planet: 'sun',
    signIndex: 11, // Pisces
    type: 'solar_sankranti',
    sanskrit: 'Meena Sankranti',
    desc: 'Sun ingresses into Pisces (Meena), concluding the solar cycle with meditation and non-attachment.',
  },
  {
    year: 2027,
    month: 3,
    day: 1,
    planet: 'mars',
    signIndex: 3, // Cancer
    type: 'mars_station',
    sanskrit: 'Mangala Karka Marga Gati',
    desc: 'Mars stations direct in late Cancer, releasing delayed physical tensions and restoring steady momentum.',
  },
  {
    year: 2027,
    month: 3,
    day: 13,
    planet: 'jupiter',
    signIndex: 3, // Cancer
    type: 'jupiter_station',
    sanskrit: 'Guru Karka Marga Gati',
    desc: 'Exalted Jupiter stations direct in Cancer at 22° sidereal, dispensing enduring blessings of virtue and institutional honor.',
  },
  {
    year: 2027,
    month: 3,
    day: 14,
    planet: 'sun',
    signIndex: 0, // Aries
    type: 'solar_sankranti',
    sanskrit: 'Mesha Sankranti',
    desc: 'Sun ingresses into Aries (Mesha) in supreme exaltation (Uchcha), commanding renewed executive initiative and physical vitality.',
  },
  {
    year: 2027,
    month: 4,
    day: 15,
    planet: 'sun',
    signIndex: 1, // Taurus
    type: 'solar_sankranti',
    sanskrit: 'Vrishabha Sankranti',
    desc: 'Sun ingresses into Taurus (Vrishabha), anchoring financial reserves and domestic duties.',
  },
  {
    year: 2027,
    month: 5,
    day: 2,
    planet: 'saturn',
    signIndex: 0, // Aries
    type: 'saturn_ingress',
    sanskrit: 'Shani Mesha Pravesha',
    desc: 'Saturn enters Aries in debilitated dignity (Neecha), demanding humility, patient endurance of obstacles, and strict adherence to duty without ego.',
  },
  {
    year: 2027,
    month: 5,
    day: 15,
    planet: 'sun',
    signIndex: 2, // Gemini
    type: 'solar_sankranti',
    sanskrit: 'Mithuna Sankranti',
    desc: 'Sun ingresses into Gemini (Mithuna), quickening correspondence, commercial exchange, and intellectual labor.',
  },
  {
    year: 2027,
    month: 5,
    day: 25,
    planet: 'jupiter',
    signIndex: 4, // Leo
    type: 'jupiter_ingress',
    sanskrit: 'Guru Simha Purna Sanchara',
    desc: 'Jupiter enters Leo direct, establishing firm dharmic influence over statecraft, higher education, and institutional policy.',
  },
  {
    year: 2027,
    month: 6,
    day: 17,
    planet: 'sun',
    signIndex: 3, // Cancer
    type: 'solar_sankranti',
    sanskrit: 'Karka Sankranti',
    desc: 'Sun ingresses into Cancer (Karka), beginning Dakshinayana and supporting home life and emotional grounding.',
  },
  {
    year: 2027,
    month: 7,
    day: 2,
    planet: 'sun',
    signIndex: 3, // Cancer
    type: 'solar_eclipse',
    sanskrit: 'Surya Grahan (Pushya)',
    desc: 'Total Solar Eclipse in Cancer, calling for solemn observance, spiritual recitation, and charitable acts (Dana).',
  },
  {
    year: 2027,
    month: 7,
    day: 9,
    planet: 'saturn',
    signIndex: 0, // Aries
    type: 'saturn_station',
    sanskrit: 'Shani Mesha Neecha Vakra Sthiti',
    desc: 'Debilitated Saturn stations retrograde in Aries at 3° sidereal, requiring absolute humility and caution in physical and vocational actions.',
  },
  {
    year: 2027,
    month: 7,
    day: 17,
    planet: 'sun',
    signIndex: 4, // Leo
    type: 'solar_sankranti',
    sanskrit: 'Simha Sankranti',
    desc: 'Sun ingresses into own moolatrikona sign Leo (Simha), commanding royal dignity and institutional governance.',
  },
  {
    year: 2027,
    month: 7,
    day: 17,
    planet: 'moon',
    signIndex: 9, // Capricorn
    type: 'lunar_eclipse',
    sanskrit: 'Chandra Grahan (Makara)',
    desc: 'Penumbral Lunar Eclipse in Capricorn, calling for patient fortitude and detachment from worldly status.',
  },
  {
    year: 2027,
    month: 8,
    day: 17,
    planet: 'sun',
    signIndex: 5, // Virgo
    type: 'solar_sankranti',
    sanskrit: 'Kanya Sankranti',
    desc: 'Sun ingresses into Virgo (Kanya), demanding careful scrutiny of procedures, health routines, and debt reduction.',
  },
  {
    year: 2027,
    month: 9,
    day: 17,
    planet: 'sun',
    signIndex: 6, // Libra
    type: 'solar_sankranti',
    sanskrit: 'Tula Sankranti',
    desc: 'Sun ingresses into Libra (Tula) in debilitation (Neecha), requiring mutual concession in business alliances.',
  },
  {
    year: 2027,
    month: 10,
    day: 16,
    planet: 'sun',
    signIndex: 7, // Scorpio
    type: 'solar_sankranti',
    sanskrit: 'Vrishchika Sankranti',
    desc: 'Sun ingresses into Scorpio (Vrishchika), demanding resilience, internal transformation, and rigorous research.',
  },
  {
    year: 2027,
    month: 10,
    day: 26,
    planet: 'jupiter',
    signIndex: 5, // Virgo
    type: 'jupiter_ingress',
    sanskrit: 'Guru Kanya Pravesha',
    desc: 'Jupiter enters Virgo, bringing philosophical balance to analytical professions, healthcare, and systematic administration.',
  },
  {
    year: 2027,
    month: 11,
    day: 16,
    planet: 'sun',
    signIndex: 8, // Sagittarius
    type: 'solar_sankranti',
    sanskrit: 'Dhanu Sankranti',
    desc: 'Sun ingresses into Sagittarius (Dhanu), illuminating higher education, ethical standards, and dharmic wisdom.',
  },
  {
    year: 2027,
    month: 11,
    day: 24,
    planet: 'saturn',
    signIndex: 11, // Pisces
    type: 'saturn_station',
    sanskrit: 'Shani Meena Marga Gati',
    desc: 'Saturn stations direct in late Pisces at 26° sidereal, completing retrogradation before re-entering Aries.',
  },

  // ==========================================================================
  // 7. 2028 MACRO FUTURE ANCHORS
  // ==========================================================================
  {
    year: 2028,
    month: 0,
    day: 14,
    planet: 'sun',
    signIndex: 9, // Capricorn
    type: 'solar_sankranti',
    sanskrit: 'Makara Sankranti',
    desc: 'Sun ingresses into Capricorn (Makara), marking Uttarayana and directing vitality into disciplined vocational duty.',
  },
  {
    year: 2028,
    month: 1,
    day: 23,
    planet: 'saturn',
    signIndex: 0, // Aries
    type: 'saturn_ingress',
    sanskrit: 'Shani Mesha Sanchara',
    desc: 'Saturn re-enters Aries in debilitation, demanding continued patience and ego-free execution.',
  },
  {
    year: 2028,
    month: 5,
    day: 23,
    planet: 'rahu',
    signIndex: 8, // Sagittarius
    type: 'nodal_ingress',
    sanskrit: 'Rahu-Ketu Dhanu-Mithuna Sanchara',
    desc: 'Rahu enters Sagittarius and Ketu enters Gemini, activating the karmic axis of philosophy, higher learning, and technical communication.',
  },
];

/**
 * Computes applicable life domains multi-dimensionally per classical Parashari Jyotish:
 * - Wealth & Prosperity (Dhana & Labha): Houses 2, 11, 9, 5, 1
 * - Career, Karma & Leadership: Houses 10, 6, 1, 11, 7
 * - Relationships & Alliances (Kalatra & Sukha): Houses 7, 5, 2, 11, 4
 * - Health, Constitution & Endurance (Tanu, Roga & Ayur): Houses 1, 6, 8, 12
 * - Dharma, Purpose & Higher Wisdom: Houses 9, 1, 5, 12, 4
 * Integrated with natural planetary Karakatwa (significators).
 */
function computeApplicableDomains(
  planet: BodyKey,
  houseFromLagna: number,
  houseFromMoon: number,
  isEclipse: boolean
): EventDomain[] {
  const domains = new Set<EventDomain>();

  const housesToCheck = [houseFromLagna, houseFromMoon];

  for (const h of housesToCheck) {
    if ([1, 2, 5, 9, 11].includes(h)) domains.add('wealth');
    if ([1, 6, 7, 10, 11].includes(h)) domains.add('career');
    if ([2, 4, 5, 7, 11].includes(h)) domains.add('love');
    if ([1, 6, 8, 12].includes(h)) domains.add('health');
    if ([1, 4, 5, 9, 12].includes(h)) domains.add('dharma');
  }

  // Graha Karakatwa baseline attributions:
  switch (planet) {
    case 'sun':
      domains.add('career'); // Rajya / Adhikara karaka
      domains.add('dharma'); // Atma karaka
      if ([1, 6, 8, 12].includes(houseFromLagna) || isEclipse) {
        domains.add('health'); // Arogya karaka
      }
      break;
    case 'moon':
      domains.add('health'); // Manas / emotional & somatic constitution
      domains.add('dharma');
      if ([4, 7].includes(houseFromLagna)) domains.add('love');
      break;
    case 'mars':
      domains.add('career'); // Prakrama & executive initiative
      domains.add('health'); // Deha bala / physical vitality
      if ([2, 4, 11].includes(houseFromLagna)) domains.add('wealth'); // Bhumi karaka
      break;
    case 'mercury':
      domains.add('career'); // Vyapar / commerce
      domains.add('wealth'); // Dhana / commercial exchange
      domains.add('dharma'); // Buddhi / analytical discrimination
      break;
    case 'jupiter':
      domains.add('wealth'); // Dhana karaka
      domains.add('dharma'); // Guru / Dharma karaka
      domains.add('career'); // Honor / social status
      break;
    case 'venus':
      domains.add('love'); // Kalatra karaka
      domains.add('wealth'); // Vahana & Sampatti karaka
      break;
    case 'saturn':
      domains.add('career'); // Karma karaka
      domains.add('health'); // Ayush karaka / endurance limits
      domains.add('dharma'); // Vairagya karaka
      break;
    case 'rahu':
    case 'ketu':
      domains.add('dharma'); // Karmic nodal axis
      if ([1, 7].includes(houseFromLagna)) domains.add('love');
      if ([10, 6, 11].includes(houseFromLagna)) domains.add('career');
      if ([2, 11].includes(houseFromLagna)) domains.add('wealth');
      if ([6, 8, 12].includes(houseFromLagna)) domains.add('health');
      break;
  }

  if (isEclipse) {
    domains.add('dharma');
    domains.add('health');
  }

  return Array.from(domains);
}

/**
 * Calculates astronomically validated Vedic astrological milestone events
 * looking forward and backward from the reference date, cross-verified with the user's natal blueprint.
 */
export function calculateHighStakesEvents(
  referenceDate: Date,
  natalBlueprint: NatalChartBlueprint | null,
  options?: EventRadarOptions
): VedicRadarEvent[] {
  const events: VedicRadarEvent[] = [];
  const refTime = referenceDate.getTime();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  const horizonFilter = options?.horizon || 'all';
  const domainFilter = options?.domain || 'all';
  const rangeYears = options?.timeRangeYears ?? 2;
  const maxDeltaDays = rangeYears * 365.25;

  const lagnaSign = natalBlueprint ? natalBlueprint.lagnaSignIndex : 0; // Aries default
  const moonSign = natalBlueprint ? natalBlueprint.moonSignIndex : 3; // Cancer default
  const jupNatal = natalBlueprint?.planets.find((p) => p.key === 'jupiter');
  const satNatal = natalBlueprint?.planets.find((p) => p.key === 'saturn');
  const marsNatal = natalBlueprint?.planets.find((p) => p.key === 'mars');
  const venNatal = natalBlueprint?.planets.find((p) => p.key === 'venus');

  for (const raw of RAW_ASTRONOMICAL_EVENTS) {
    const eventDate = new Date(Date.UTC(raw.year, raw.month, raw.day, 12, 0, 0));
    const eventTime = eventDate.getTime();
    const diffMs = eventTime - refTime;
    const daysFromNow = Math.round(diffMs / ONE_DAY_MS);

    // Apply time horizon filtering
    if (Math.abs(daysFromNow) > maxDeltaDays) continue;
    const horizon: EventHorizon = daysFromNow >= 0 ? 'future' : 'past';
    if (horizonFilter !== 'all' && horizonFilter !== horizon) continue;

    // Calculate house positions relative to native's natal Lagna and Moon
    const houseFromLagna = ((raw.signIndex - lagnaSign + 12) % 12) + 1;
    const houseFromMoon = ((raw.signIndex - moonSign + 12) % 12) + 1;
    const signName = ZODIAC_SIGNS[raw.signIndex].name;
    const isEclipse = raw.type.includes('eclipse');

    // Multi-dimensional applicable domains calculation
    const applicableDomains = computeApplicableDomains(
      raw.planet,
      houseFromLagna,
      houseFromMoon,
      isEclipse
    );

    let domain: EventDomain = 'career';
    let qualityTier: QualityTier = 'CRITICAL_MILESTONE';
    let nature: VedicRadarEvent['nature'] = 'favorable';
    let natalPointTargeted = `House ${houseFromLagna} (${signName})`;
    let classicalMechanism = raw.desc;
    let natalCrossVerification = '';
    let tacticalDirective = '';
    let tacticalAvoid = '';
    let badgeClass = 'bg-cyan-950/80 text-cyan-200 border-cyan-800';

    // ------------------------------------------------------------------------
    // 1. JUPITER TRANSITS & STATIONS
    // ------------------------------------------------------------------------
    if (raw.planet === 'jupiter') {
      if ([1, 5, 9].includes(houseFromLagna)) {
        domain = 'dharma';
        nature = 'favorable';
        qualityTier = 'HIGH_STAKES_BREAKTHROUGH';
        badgeClass = 'bg-emerald-950/90 text-emerald-300 border-emerald-700 shadow-sm';
        natalPointTargeted = `Natal Trikona (House ${houseFromLagna} in ${signName})`;
        classicalMechanism = `Jupiter casts auspicious 5th, 7th, and 9th Drishti across Kendra and Trikona houses, bestowing dharmic protection, wisdom, and the fruition of meritorious past karma (Purva Punya).`;

        if (jupNatal && jupNatal.powerPercentage >= 60) {
          natalCrossVerification = `Natal Jupiter possesses strong dignity (${jupNatal.powerPercentage}% strength in House ${jupNatal.house}, ruling H${jupNatal.housesRuled.join(', ')}). The natal chart possesses constitutional capacity to channel this transit into dharmic fulfillment and enduring respect.`;
        } else {
          natalCrossVerification = `Natal Jupiter possesses moderate baseline strength. While the transit brings auspicious opportunities, procedural discipline and ethical prudence remain necessary.`;
        }
        tacticalDirective = `Engage in virtuous pursuits, undertake higher education or philosophical study, and cultivate honorable associations with teachers and elders.`;
        tacticalAvoid = `Avoid complacency, over-expansion, or neglecting foundational duties during favorable periods.`;
      } else if ([2, 11].includes(houseFromLagna)) {
        domain = 'wealth';
        nature = 'favorable';
        qualityTier = 'HIGH_STAKES_BREAKTHROUGH';
        badgeClass = 'bg-emerald-950/90 text-emerald-300 border-emerald-700';
        natalPointTargeted = `Wealth House ${houseFromLagna} (${signName})`;
        classicalMechanism = `Jupiter transits Dhana (2nd) or Labha (11th) Bhava, supporting ethical wealth accumulation (Dhana Vriddhi), prosperity, and prudent family reserves.`;
        natalCrossVerification = `Stimulates Dhana and Labha Bhavas in accordance with natal 2nd/11th house lords and Jupiter's natural karakatwa for wealth and auspicious gains.`;
        tacticalDirective = `Consolidate resources ethically, allocate funds toward righteous endeavors (Dharma-Dhana), and maintain prudent family reserves.`;
        tacticalAvoid = `Avoid ostentatious expenditure, unrighteous wealth accumulation, or frivolous depletion of reserves.`;
      } else if (houseFromLagna === 7) {
        domain = 'love';
        nature = 'favorable';
        qualityTier = 'HIGH_STAKES_BREAKTHROUGH';
        badgeClass = 'bg-pink-950/90 text-pink-300 border-pink-700';
        natalPointTargeted = `7th House of Alliances (${signName})`;
        classicalMechanism = `Jupiter in the 7th Bhava (Kalatra/Yuvati) casts auspicious 7th Drishti onto the Lagna, elevating vitality, personal clarity, and mutual respect in marital and collaborative alliances.`;
        natalCrossVerification = `Direct aspect on Lagna supports mutual duties and bilateral commitments.`;
        tacticalDirective = `Cultivate honorable and transparent partnerships, formalize committed alliances, and uphold collaborative duties with integrity.`;
        tacticalAvoid = `Avoid entering commitments without clear mutual duties and shared ethical principles.`;
      } else if ([10, 6].includes(houseFromLagna)) {
        domain = 'career';
        nature = 'favorable';
        qualityTier = 'HIGH_STAKES_BREAKTHROUGH';
        badgeClass = 'bg-teal-950/90 text-teal-300 border-teal-700';
        natalPointTargeted = `Karma/Seva Bhava (House ${houseFromLagna} in ${signName})`;
        classicalMechanism = `Jupiter transits House ${houseFromLagna}, infusing dharmic authority, ethical leadership, and capacity to resolve systemic obstacles through wisdom.`;
        natalCrossVerification = `Elevates professional reputation and fulfillment of civic duties aligned with natal 10th house indicators.`;
        tacticalDirective = `Execute professional responsibilities with ethical integrity and mentor junior colleagues.`;
        tacticalAvoid = `Avoid taking unearned credit or neglecting procedural due diligence.`;
      } else {
        domain = 'dharma';
        nature = 'favorable';
        qualityTier = 'KARMIC_TRANSITION';
        badgeClass = 'bg-cyan-950/80 text-cyan-300 border-cyan-800';
        natalPointTargeted = `House ${houseFromLagna} (${signName})`;
        classicalMechanism = `Jupiter transits House ${houseFromLagna}, infusing philosophical discernment and sattvic balance into the affairs of this bhava.`;
        natalCrossVerification = `Harmonizes the bhava in accordance with Jupiter's natural beneficence and prevailing Vimshottari Dasha influences.`;
        tacticalDirective = `Focus on study, moral refinement, and steady fulfillment of house-specific responsibilities.`;
        tacticalAvoid = `Avoid ideological rigidity or disregarding practical realities.`;
      }
    }

    // ------------------------------------------------------------------------
    // 2. SATURN TRANSITS & STATIONS
    // ------------------------------------------------------------------------
    else if (raw.planet === 'saturn') {
      const isSadeSatiRising = raw.signIndex === (moonSign - 1 + 12) % 12;
      const isSadeSatiPeak = raw.signIndex === moonSign;
      const isSadeSatiSetting = raw.signIndex === (moonSign + 1) % 12;
      const isKantakaShani = [4, 10].includes(houseFromLagna);
      const isAshtamaShani = houseFromLagna === 8;

      if (isSadeSatiPeak) {
        domain = 'health';
        nature = 'challenging';
        qualityTier = 'STRUCTURAL_CRUCIBLE';
        badgeClass = 'bg-amber-950/90 text-amber-300 border-amber-700';
        natalPointTargeted = `Janma Chandra (Natal Moon in ${signName})`;
        classicalMechanism = `Janma Shani (Peak Sade Sati): Saturn transits directly over Janma Rashi (Natal Moon). In classical Jyotish, this cultivates mental fortitude through detachment (Vairagya), self-discipline, and patience under karmic testing.`;
        natalCrossVerification =
          satNatal && satNatal.powerPercentage >= 65
            ? `Natal Saturn possesses strong dignity (${satNatal.powerPercentage}%). The native has constitutional fortitude to endure rigorous Saturnian lessons and build lasting character.`
            : `Natal Moon requires grounding and emotional equanimity. Practice patience and avoid mental fatigue or unnecessary despondency.`;
        tacticalDirective = `Adopt steady routines, practice mind-calming disciplines (Pranayama, Shani Shanti), and fulfill duty (Kartavya) without seeking immediate fruit.`;
        tacticalAvoid = `Avoid impulsive emotional reactions, hasty life alterations, and unnecessary conflict under psychological stress.`;
      } else if (isAshtamaShani) {
        domain = 'health';
        nature = 'challenging';
        qualityTier = 'STRUCTURAL_CRUCIBLE';
        badgeClass = 'bg-rose-950/90 text-rose-300 border-rose-800';
        natalPointTargeted = `Ashtama Shani (8th House in ${signName})`;
        classicalMechanism = `Saturn transits the 8th Bhava (Ayur/Randhra) from Lagna. Classical Parashari texts describe this as testing physical endurance, longevity indicators, and patience through unforeseen structural delays.`;
        natalCrossVerification = `Demands rigorous health discipline, prudent physical pacing, and strict avoidance of uncalculated risks.`;
        tacticalDirective = `Maintain regular medical checkups, prioritize physical rest, and avoid speculative financial entanglements.`;
        tacticalAvoid = `Avoid physical recklessness, hasty legal disputes, or hazardous physical exertion.`;
      } else if (isSadeSatiRising || isSadeSatiSetting) {
        domain = isSadeSatiSetting ? 'wealth' : 'career';
        nature = 'transformational';
        qualityTier = 'KARMIC_TRANSITION';
        badgeClass = 'bg-amber-950/80 text-amber-200 border-amber-800';
        natalPointTargeted = `${isSadeSatiRising ? 'Rising' : 'Setting'} Phase of Sade Sati (House ${houseFromMoon} from Moon)`;
        classicalMechanism = `Saturn ${isSadeSatiRising ? 'initiates' : 'concludes'} its 7.5-year Sade Sati cycle relative to the Moon, restructuring life foundations and demanding perseverance.`;
        natalCrossVerification = `Transition phase demanding patience, fulfillment of debts (Rina-vimochana), and steady adherence to duty.`;
        tacticalDirective = `Fulfill outstanding obligations, simplify daily commitments, and maintain disciplined focus on essential responsibilities.`;
        tacticalAvoid = `Avoid resisting necessary restructuring or taking on unmanageable new liabilities.`;
      } else if (isKantakaShani) {
        domain = 'career';
        nature = 'challenging';
        qualityTier = 'STRUCTURAL_CRUCIBLE';
        badgeClass = 'bg-rose-950/90 text-rose-300 border-rose-800';
        natalPointTargeted = `Kantaka Shani (House ${houseFromLagna} from Lagna in ${signName})`;
        classicalMechanism = `Kantaka Shani (Saturn transiting 4th or 10th from Lagna): classical texts describe this as testing endurance, vocational status (Karma Bhava), or domestic peace (Sukha Bhava).`;
        natalCrossVerification = `Demands meticulous integrity and perseverance; ethical conduct shields against adversity.`;
        tacticalDirective = `Focus on thoroughness, uphold ethical standards in career and civic life, and resolve lingering disputes with patience.`;
        tacticalAvoid = `Avoid confrontational disputes with authorities or elders, cutting procedural corners, or hasty career gambles.`;
      } else {
        domain = [1, 6, 12].includes(houseFromLagna) ? 'health' : [2, 11].includes(houseFromLagna) ? 'wealth' : 'career';
        nature = 'transformational';
        qualityTier = raw.type.includes('station') ? 'CRITICAL_MILESTONE' : 'STRUCTURAL_CRUCIBLE';
        badgeClass = 'bg-slate-900 text-slate-200 border-slate-700';
        classicalMechanism = `Saturn transits House ${houseFromLagna}, requiring steady effort, patience, and karmic rectification in the affairs governed by this bhava.`;
        natalCrossVerification = `Demands disciplined responsibility and perseverance.`;
        tacticalDirective = `Apply persistent labor, cultivate modesty, and build enduring foundations through steady, incremental effort.`;
        tacticalAvoid = `Avoid impatience, procrastination, or seeking swift shortcuts where sustained dedication is required.`;
      }
    }

    // ------------------------------------------------------------------------
    // 3. SUN TRANSITS & SANKRANTIS
    // ------------------------------------------------------------------------
    else if (raw.planet === 'sun') {
      if (raw.signIndex === 9) {
        // Makara Sankranti (Capricorn)
        domain = [10, 1, 11].includes(houseFromLagna) ? 'career' : [2, 9].includes(houseFromLagna) ? 'wealth' : 'dharma';
        nature = 'favorable';
        qualityTier = 'CRITICAL_MILESTONE';
        badgeClass = 'bg-amber-950/90 text-amber-200 border-amber-700';
        natalPointTargeted = `House ${houseFromLagna} (${signName}) - Uttarayana Commencement`;
        classicalMechanism = `Sun ingresses into Capricorn (Makara), marking Uttarayana (northern celestial course). Solar transit here activates professional obligations, institutional endurance, and alignment with righteous governance.`;
        natalCrossVerification = `Illuminates House ${houseFromLagna}, focusing vitality and executive capacity on duties governed by this bhava.`;
        tacticalDirective = `Establish structured goals, honor institutional commitments, and direct vital energy toward long-term productivity.`;
        tacticalAvoid = `Avoid complacency, rigid dogmatism, or friction with superiors.`;
      } else if (raw.signIndex === 0) {
        // Mesha Sankranti (Aries Exaltation)
        domain = 'career';
        nature = 'favorable';
        qualityTier = 'HIGH_STAKES_BREAKTHROUGH';
        badgeClass = 'bg-orange-950/90 text-orange-200 border-orange-700';
        natalPointTargeted = `House ${houseFromLagna} (${signName}) - Solar Exaltation (Uchcha)`;
        classicalMechanism = `Sun enters Aries (Mesha) in supreme exaltation (Uchcha Rashi). Natural significator of vitality (Arogya) and authority (Rajya) attains peak dignity, dispelling inertia and invigorating decisive action.`;
        natalCrossVerification = `Elevates confidence and leadership in affairs of House ${houseFromLagna}.`;
        tacticalDirective = `Inaugurate essential projects, assume leadership initiatives with humility, and cultivate physical vigor.`;
        tacticalAvoid = `Avoid hubris, domineering speech, or disregarding counsel of trusted peers.`;
      } else if (raw.signIndex === 3) {
        // Karka Sankranti (Cancer Dakshinayana)
        domain = 'love';
        nature = 'transformational';
        qualityTier = 'CRITICAL_MILESTONE';
        badgeClass = 'bg-sky-950/90 text-sky-200 border-sky-700';
        natalPointTargeted = `House ${houseFromLagna} (${signName}) - Dakshinayana Commencement`;
        classicalMechanism = `Sun ingresses into Cancer (Karka), commencing Dakshinayana (southern celestial course). In classical tradition, solar focus shifts inward toward domestic foundations, family welfare, and emotional equilibrium.`;
        natalCrossVerification = `Stimulates internal reflection and grounding in affairs of House ${houseFromLagna}.`;
        tacticalDirective = `Consolidate family relations, attend to residential matters, and practice devotional study.`;
        tacticalAvoid = `Avoid overextending external ambitions while domestic obligations require attention.`;
      } else if (raw.signIndex === 4) {
        // Simha Sankranti (Leo Moolatrikona)
        domain = 'career';
        nature = 'favorable';
        qualityTier = 'HIGH_STAKES_BREAKTHROUGH';
        badgeClass = 'bg-amber-950/90 text-amber-300 border-amber-600';
        natalPointTargeted = `House ${houseFromLagna} (${signName}) - Solar Swakshetra`;
        classicalMechanism = `Sun traverses own moolatrikona sign Leo (Simha), delivering maximum sovereign authority, clarity of purpose, and administrative fortitude.`;
        natalCrossVerification = `Strengthens natural solar significations across the chart.`;
        tacticalDirective = `Uphold truthfulness in governance, take responsibility for administrative excellence, and protect dependents.`;
        tacticalAvoid = `Avoid self-centered arrogance, prideful confrontation, or impatience.`;
      } else if (raw.signIndex === 6) {
        // Tula Sankranti (Libra Debilitation)
        domain = 'love';
        nature = 'challenging';
        qualityTier = 'STRUCTURAL_CRUCIBLE';
        badgeClass = 'bg-rose-950/80 text-rose-300 border-rose-800';
        natalPointTargeted = `House ${houseFromLagna} (${signName}) - Solar Debilitation (Neecha)`;
        classicalMechanism = `Sun transits Libra (Tula) in debilitation (Neecha Rashi). Classical texts caution against diminished vitality and egoic friction in partnerships and contracts.`;
        natalCrossVerification = `Calls for conscious moderation and procedural fairness in House ${houseFromLagna}.`;
        tacticalDirective = `Cultivate cooperative diplomacy, balance bilateral commitments, and maintain dietary and rest discipline.`;
        tacticalAvoid = `Avoid authoritarian demands in equal partnerships or compromising core ethical standards.`;
      } else {
        domain = [10, 1, 11].includes(houseFromLagna)
          ? 'career'
          : [2, 11].includes(houseFromLagna)
          ? 'wealth'
          : [9, 5].includes(houseFromLagna)
          ? 'dharma'
          : [6, 8, 12].includes(houseFromLagna)
          ? 'health'
          : 'love';
        nature = 'transformational';
        qualityTier = 'KARMIC_TRANSITION';
        badgeClass = 'bg-slate-900 text-slate-200 border-slate-700';
        natalPointTargeted = `House ${houseFromLagna} (${signName}) - Solar Transit`;
        classicalMechanism = raw.desc;
        natalCrossVerification = `Monthly solar ingress activates House ${houseFromLagna} relative to natal Lagna.`;
        tacticalDirective = `Maintain steady attention to the duties of this bhava, verify paperwork, and uphold integrity.`;
        tacticalAvoid = `Avoid erratic habits or neglect of professional duties.`;
      }
    }

    // ------------------------------------------------------------------------
    // 4. MARS INGRESSES & STATIONS
    // ------------------------------------------------------------------------
    else if (raw.planet === 'mars') {
      if (raw.signIndex === 9) {
        // Makara Exaltation
        domain = 'career';
        nature = 'favorable';
        qualityTier = 'HIGH_STAKES_BREAKTHROUGH';
        badgeClass = 'bg-red-950/90 text-red-300 border-red-700';
        natalPointTargeted = `House ${houseFromLagna} (${signName}) - Mars Supreme Exaltation`;
        classicalMechanism = `Mars enters Capricorn (Makara) in supreme exaltation (28° Uchcha). In classical Jyotish, Mars here combines fiery valor (Prakrama) with Saturnian structural discipline, conferring decisive executive execution and ability to overcome opposition.`;
        natalCrossVerification =
          marsNatal && marsNatal.powerPercentage >= 60
            ? `Natal Mars has solid strength (${marsNatal.powerPercentage}%). The native can channel this exalted transit into disciplined technical execution.`
            : `Exalted Mars provides courage and drive, though patience remains essential.`;
        tacticalDirective = `Direct intense energy into technical precision, physical training, and completing rigorous tasks.`;
        tacticalAvoid = `Avoid domineering behavior, aggressive ultimatums, or ruthless competition.`;
      } else if (raw.signIndex === 3) {
        // Karka Debilitation
        domain = 'health';
        nature = 'challenging';
        qualityTier = 'STRUCTURAL_CRUCIBLE';
        badgeClass = 'bg-rose-950/90 text-rose-300 border-rose-800';
        natalPointTargeted = `House ${houseFromLagna} (${signName}) - Mars Debilitation (Neecha)`;
        classicalMechanism = `Mars traverses Cancer (Karka) in debilitation (Neecha). The warrior planet in a watery, lunar sign can lead to emotional volatility, hasty frustration, and physical strain.`;
        natalCrossVerification = `Requires emotional equanimity and careful management of physical stamina in House ${houseFromLagna}.`;
        tacticalDirective = `Practice physical moderation, cool emotional reactivity with mindfulness, and avoid hazardous speed.`;
        tacticalAvoid = `Avoid acting on anger, driving rashly, or provoking avoidable household conflicts.`;
      } else {
        domain = [1, 8, 12, 6].includes(houseFromLagna) ? 'health' : 'career';
        nature = 'transformational';
        qualityTier = 'CRITICAL_MILESTONE';
        badgeClass = 'bg-rose-950/80 text-rose-200 border-rose-700';
        natalPointTargeted = `House ${houseFromLagna} (${signName}) - Mars Stationary Vector`;
        classicalMechanism = raw.desc;
        natalCrossVerification = `Concentrates martial energy upon House ${houseFromLagna}, requiring careful conservation of vitality.`;
        tacticalDirective = `Pace operational efforts methodically, verify equipment and tools, and channel assertiveness constructively.`;
        tacticalAvoid = `Avoid confrontational posturing or reckless haste under pressure.`;
      }
    }

    // ------------------------------------------------------------------------
    // 5. VENUS INGRESSES & STATIONS
    // ------------------------------------------------------------------------
    else if (raw.planet === 'venus') {
      domain = [7, 5, 4, 1].includes(houseFromLagna) ? 'love' : 'wealth';
      nature = raw.type.includes('station') && raw.desc.includes('retrograde') ? 'challenging' : 'favorable';
      qualityTier = 'HIGH_STAKES_BREAKTHROUGH';
      badgeClass = 'bg-pink-950/90 text-pink-300 border-pink-700';
      natalPointTargeted = `House ${houseFromLagna} (${signName}) - Venusian Activation`;
      classicalMechanism = raw.desc;
      natalCrossVerification =
        venNatal && venNatal.powerPercentage >= 60
          ? `Natal Venus possesses dignified standing (${venNatal.powerPercentage}%). Supports bilateral commitments and aesthetic refinement.`
          : `Venusian activation encourages mutual understanding and measured fiscal conduct.`;
      tacticalDirective = `Uphold mutual respect in bilateral commitments, audit shared expenditures, and cultivate aesthetic refinement.`;
      tacticalAvoid = `Avoid superficial charm, reckless luxury purchases, or unverified contractual commitments.`;
    }

    // ------------------------------------------------------------------------
    // 6. MERCURY STATIONS
    // ------------------------------------------------------------------------
    else if (raw.planet === 'mercury') {
      domain = [2, 11, 5].includes(houseFromLagna) ? 'wealth' : [10, 6, 7, 3].includes(houseFromLagna) ? 'career' : 'dharma';
      nature = 'transformational';
      qualityTier = 'CRITICAL_MILESTONE';
      badgeClass = 'bg-emerald-950/80 text-emerald-200 border-emerald-800';
      natalPointTargeted = `House ${houseFromLagna} (${signName}) - Mercury Stationary Vector`;
      classicalMechanism = raw.desc;
      natalCrossVerification = `Prompts review of intellectual projects, trade ledger entries, and agreements in House ${houseFromLagna}.`;
      tacticalDirective = `Re-verify calculations, back up digital data, double-check contracts before signature, and communicate concisely.`;
      tacticalAvoid = `Avoid signing ambiguous agreements, propagating unverified data, or making assumptions in business deals.`;
    }

    // ------------------------------------------------------------------------
    // 7. RAHU-KETU NODAL SHIFTS
    // ------------------------------------------------------------------------
    else if (raw.planet === 'rahu' || raw.planet === 'ketu') {
      domain = [1, 7].includes(houseFromLagna)
        ? 'love'
        : [10, 4].includes(houseFromLagna)
        ? 'career'
        : [2, 8, 11].includes(houseFromLagna)
        ? 'wealth'
        : [6, 12].includes(houseFromLagna)
        ? 'health'
        : 'dharma';
      nature = 'transformational';
      qualityTier = 'KARMIC_TRANSITION';
      badgeClass = 'bg-indigo-950/90 text-indigo-300 border-indigo-800';
      natalPointTargeted = `Nodal Axis Shift: House ${houseFromLagna} (Rahu) & House ${((houseFromLagna + 5) % 12) + 1} (Ketu)`;
      classicalMechanism = `18-month transit of the Chhaya Grahas (Rahu and Ketu). Rahu activates intense worldly desire, innovation, and karmic focus in House ${houseFromLagna}, while Ketu brings Moksha-oriented detachment and spiritual consolidation to House ${((houseFromLagna + 5) % 12) + 1}.`;
      natalCrossVerification = `Activates the natal nodal polarity, shifting karmic lessons into fresh houses of experience.`;
      tacticalDirective = `Channel innovative drives through ethical discernment, while embracing detachment and inner refinement.`;
      tacticalAvoid = `Avoid ungrounded obsessions, deceptive shortcuts, or neglecting ethical principles in pursuit of novelty.`;
    }

    // ------------------------------------------------------------------------
    // 8. ECLIPSES (SOLAR & LUNAR GRAHAN)
    // ------------------------------------------------------------------------
    if (isEclipse) {
      const isLagnaAxis = [1, 7].includes(houseFromLagna);
      const isKarmicZenithAxis = [4, 10].includes(houseFromLagna);
      const isDhanaAxis = [2, 11].includes(houseFromLagna);
      const isHealthAxis = [6, 8, 12].includes(houseFromLagna);

      domain = isLagnaAxis
        ? 'love'
        : isKarmicZenithAxis
        ? 'career'
        : isDhanaAxis
        ? 'wealth'
        : isHealthAxis
        ? 'health'
        : 'dharma';
      nature = 'transformational';
      qualityTier = 'CRITICAL_MILESTONE';
      badgeClass = 'bg-purple-950/90 text-purple-300 border-purple-800';
      natalPointTargeted = `Eclipse Portal: House ${houseFromLagna} in ${signName}`;
      classicalMechanism = `Surya/Chandra Grahan falls in House ${houseFromLagna}. Classical tradition cautions that luminaries are momentarily obscured by the nodal axis (Rahu/Ketu), marking periods of karmic recalibration.`;
      natalCrossVerification = `Directly touches sensitive points relative to natal Lagna and Moon, signaling moments to turn inward rather than initiate external enterprises.`;
      tacticalDirective = `Observe contemplation, practice mantra recitation, and defer major material inaugurations during the eclipse portal.`;
      tacticalAvoid = `Avoid reactive outbursts, irreversible ultimatums, or signing binding commitments during the eclipse window.`;
    }

    // Ensure primary domain is present in applicableDomains array
    if (!applicableDomains.includes(domain)) {
      applicableDomains.unshift(domain);
    }

    // Multi-dimensional domain filtering:
    // Match if filter is 'all', matches primary domain, or is contained in applicable domains
    if (
      domainFilter !== 'all' &&
      domain !== domainFilter &&
      !applicableDomains.includes(domainFilter)
    ) {
      continue;
    }

    // Build the final milestone event
    events.push({
      id: `${raw.planet}-${raw.signIndex}-${raw.year}-${raw.month}-${raw.day}-${raw.type}`,
      type: raw.type,
      title: `${raw.sanskrit} (${signName})`,
      sanskritTitle: raw.sanskrit,
      peakDate: eventDate.toISOString().slice(0, 10),
      peakTimestamp: eventTime,
      horizon,
      daysFromNow,
      domain,
      applicableDomains,
      qualityTier,
      nature,
      transitBody: raw.planet,
      targetHouseFromLagna: houseFromLagna,
      targetHouseFromMoon: houseFromMoon,
      natalPointTargeted,
      classicalMechanism,
      natalCrossVerification,
      tacticalDirective,
      tacticalAvoid,
      badgeClass,
    });
  }

  // Sort events chronologically:
  // For 'past': descending order (most recent first)
  // For 'future' / 'all': ascending order (soonest first)
  if (horizonFilter === 'past') {
    events.sort((a, b) => b.peakTimestamp - a.peakTimestamp);
  } else {
    events.sort((a, b) => a.peakTimestamp - b.peakTimestamp);
  }

  return events;
}
