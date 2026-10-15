import { BodyKey, ZodiacSign, Nakshatra, DivisionInfo, DivisionType } from '@/types/astronomy';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { index: 0, name: 'Aries', sanskritName: 'Mesha', symbol: '\u2648\uFE0E', element: 'Fire', modality: 'Cardinal', ruler: 'mars', startDegree: 0, endDegree: 30 },
  { index: 1, name: 'Taurus', sanskritName: 'Vrishabha', symbol: '\u2649\uFE0E', element: 'Earth', modality: 'Fixed', ruler: 'venus', startDegree: 30, endDegree: 60 },
  { index: 2, name: 'Gemini', sanskritName: 'Mithuna', symbol: '\u264A\uFE0E', element: 'Air', modality: 'Mutable', ruler: 'mercury', startDegree: 60, endDegree: 90 },
  { index: 3, name: 'Cancer', sanskritName: 'Karka', symbol: '\u264B\uFE0E', element: 'Water', modality: 'Cardinal', ruler: 'moon', startDegree: 90, endDegree: 120 },
  { index: 4, name: 'Leo', sanskritName: 'Simha', symbol: '\u264C\uFE0E', element: 'Fire', modality: 'Fixed', ruler: 'sun', startDegree: 120, endDegree: 150 },
  { index: 5, name: 'Virgo', sanskritName: 'Kanya', symbol: '\u264D\uFE0E', element: 'Earth', modality: 'Mutable', ruler: 'mercury', startDegree: 150, endDegree: 180 },
  { index: 6, name: 'Libra', sanskritName: 'Tula', symbol: '\u264E\uFE0E', element: 'Air', modality: 'Cardinal', ruler: 'venus', startDegree: 180, endDegree: 210 },
  { index: 7, name: 'Scorpio', sanskritName: 'Vrishchika', symbol: '\u264F\uFE0E', element: 'Water', modality: 'Fixed', ruler: 'mars', startDegree: 210, endDegree: 240 },
  { index: 8, name: 'Sagittarius', sanskritName: 'Dhanu', symbol: '\u2650\uFE0E', element: 'Fire', modality: 'Mutable', ruler: 'jupiter', startDegree: 240, endDegree: 270 },
  { index: 9, name: 'Capricorn', sanskritName: 'Makara', symbol: '\u2651\uFE0E', element: 'Earth', modality: 'Fixed', ruler: 'saturn', startDegree: 270, endDegree: 300 },
  { index: 10, name: 'Aquarius', sanskritName: 'Kumbha', symbol: '\u2652\uFE0E', element: 'Air', modality: 'Fixed', ruler: 'saturn', startDegree: 300, endDegree: 330 },
  { index: 11, name: 'Pisces', sanskritName: 'Meena', symbol: '\u2653\uFE0E', element: 'Water', modality: 'Mutable', ruler: 'jupiter', startDegree: 330, endDegree: 360 },
];

export const NAKSHATRAS: Nakshatra[] = [
  { index: 0, name: 'Ashwini', lord: 'ketu', deity: 'Ashvins', symbol: 'Horse Head', startDegree: 0, endDegree: 13.333333, padas: [{ pada: 1, navamshaSignIndex: 0 }, { pada: 2, navamshaSignIndex: 1 }, { pada: 3, navamshaSignIndex: 2 }, { pada: 4, navamshaSignIndex: 3 }] },
  { index: 1, name: 'Bharani', lord: 'venus', deity: 'Yama', symbol: 'Yoni / Vessel', startDegree: 13.333333, endDegree: 26.666667, padas: [{ pada: 1, navamshaSignIndex: 4 }, { pada: 2, navamshaSignIndex: 5 }, { pada: 3, navamshaSignIndex: 6 }, { pada: 4, navamshaSignIndex: 7 }] },
  { index: 2, name: 'Krittika', lord: 'sun', deity: 'Agni', symbol: 'Razor / Flame', startDegree: 26.666667, endDegree: 40.0, padas: [{ pada: 1, navamshaSignIndex: 8 }, { pada: 2, navamshaSignIndex: 9 }, { pada: 3, navamshaSignIndex: 10 }, { pada: 4, navamshaSignIndex: 11 }] },
  { index: 3, name: 'Rohini', lord: 'moon', deity: 'Brahma / Prajapati', symbol: 'Chariot / Cart', startDegree: 40.0, endDegree: 53.333333, padas: [{ pada: 1, navamshaSignIndex: 0 }, { pada: 2, navamshaSignIndex: 1 }, { pada: 3, navamshaSignIndex: 2 }, { pada: 4, navamshaSignIndex: 3 }] },
  { index: 4, name: 'Mrigashira', lord: 'mars', deity: 'Soma', symbol: 'Deer Head', startDegree: 53.333333, endDegree: 66.666667, padas: [{ pada: 1, navamshaSignIndex: 4 }, { pada: 2, navamshaSignIndex: 5 }, { pada: 3, navamshaSignIndex: 6 }, { pada: 4, navamshaSignIndex: 7 }] },
  { index: 5, name: 'Ardra', lord: 'rahu', deity: 'Rudra', symbol: 'Teardrop / Diamond', startDegree: 66.666667, endDegree: 80.0, padas: [{ pada: 1, navamshaSignIndex: 8 }, { pada: 2, navamshaSignIndex: 9 }, { pada: 3, navamshaSignIndex: 10 }, { pada: 4, navamshaSignIndex: 11 }] },
  { index: 6, name: 'Punarvasu', lord: 'jupiter', deity: 'Aditi', symbol: 'Bow & Quiver', startDegree: 80.0, endDegree: 93.333333, padas: [{ pada: 1, navamshaSignIndex: 0 }, { pada: 2, navamshaSignIndex: 1 }, { pada: 3, navamshaSignIndex: 2 }, { pada: 4, navamshaSignIndex: 3 }] },
  { index: 7, name: 'Pushya', lord: 'saturn', deity: 'Brihaspati', symbol: 'Cow Udder / Lotus', startDegree: 93.333333, endDegree: 106.666667, padas: [{ pada: 1, navamshaSignIndex: 4 }, { pada: 2, navamshaSignIndex: 5 }, { pada: 3, navamshaSignIndex: 6 }, { pada: 4, navamshaSignIndex: 7 }] },
  { index: 8, name: 'Ashlesha', lord: 'mercury', deity: 'Sarpas (Serpents)', symbol: 'Coiled Serpent', startDegree: 106.666667, endDegree: 120.0, padas: [{ pada: 1, navamshaSignIndex: 8 }, { pada: 2, navamshaSignIndex: 9 }, { pada: 3, navamshaSignIndex: 10 }, { pada: 4, navamshaSignIndex: 11 }] },
  { index: 9, name: 'Magha', lord: 'ketu', deity: 'Pitris (Ancestors)', symbol: 'Royal Throne', startDegree: 120.0, endDegree: 133.333333, padas: [{ pada: 1, navamshaSignIndex: 0 }, { pada: 2, navamshaSignIndex: 1 }, { pada: 3, navamshaSignIndex: 2 }, { pada: 4, navamshaSignIndex: 3 }] },
  { index: 10, name: 'Purva Phalguni', lord: 'venus', deity: 'Bhaga', symbol: 'Front Hammock', startDegree: 133.333333, endDegree: 146.666667, padas: [{ pada: 1, navamshaSignIndex: 4 }, { pada: 2, navamshaSignIndex: 5 }, { pada: 3, navamshaSignIndex: 6 }, { pada: 4, navamshaSignIndex: 7 }] },
  { index: 11, name: 'Uttara Phalguni', lord: 'sun', deity: 'Aryaman', symbol: 'Back Hammock', startDegree: 146.666667, endDegree: 160.0, padas: [{ pada: 1, navamshaSignIndex: 8 }, { pada: 2, navamshaSignIndex: 9 }, { pada: 3, navamshaSignIndex: 10 }, { pada: 4, navamshaSignIndex: 11 }] },
  { index: 12, name: 'Hasta', lord: 'moon', deity: 'Savitr', symbol: 'Open Hand', startDegree: 160.0, endDegree: 173.333333, padas: [{ pada: 1, navamshaSignIndex: 0 }, { pada: 2, navamshaSignIndex: 1 }, { pada: 3, navamshaSignIndex: 2 }, { pada: 4, navamshaSignIndex: 3 }] },
  { index: 13, name: 'Chitra', lord: 'mars', deity: 'Tvashtar / Vishwakarma', symbol: 'Bright Jewel', startDegree: 173.333333, endDegree: 186.666667, padas: [{ pada: 1, navamshaSignIndex: 4 }, { pada: 2, navamshaSignIndex: 5 }, { pada: 3, navamshaSignIndex: 6 }, { pada: 4, navamshaSignIndex: 7 }] },
  { index: 14, name: 'Swati', lord: 'rahu', deity: 'Vayu', symbol: 'Young Shoot', startDegree: 186.666667, endDegree: 200.0, padas: [{ pada: 1, navamshaSignIndex: 8 }, { pada: 2, navamshaSignIndex: 9 }, { pada: 3, navamshaSignIndex: 10 }, { pada: 4, navamshaSignIndex: 11 }] },
  { index: 15, name: 'Vishakha', lord: 'jupiter', deity: 'Indragni', symbol: 'Triumphal Arch', startDegree: 200.0, endDegree: 213.333333, padas: [{ pada: 1, navamshaSignIndex: 0 }, { pada: 2, navamshaSignIndex: 1 }, { pada: 3, navamshaSignIndex: 2 }, { pada: 4, navamshaSignIndex: 3 }] },
  { index: 16, name: 'Anuradha', lord: 'saturn', deity: 'Mitra', symbol: 'Staff / Lotus', startDegree: 213.333333, endDegree: 226.666667, padas: [{ pada: 1, navamshaSignIndex: 4 }, { pada: 2, navamshaSignIndex: 5 }, { pada: 3, navamshaSignIndex: 6 }, { pada: 4, navamshaSignIndex: 7 }] },
  { index: 17, name: 'Jyeshtha', lord: 'mercury', deity: 'Indra', symbol: 'Circular Amulet', startDegree: 226.666667, endDegree: 240.0, padas: [{ pada: 1, navamshaSignIndex: 8 }, { pada: 2, navamshaSignIndex: 9 }, { pada: 3, navamshaSignIndex: 10 }, { pada: 4, navamshaSignIndex: 11 }] },
  { index: 18, name: 'Mula', lord: 'ketu', deity: 'Nirriti', symbol: 'Tied Roots', startDegree: 240.0, endDegree: 253.333333, padas: [{ pada: 1, navamshaSignIndex: 0 }, { pada: 2, navamshaSignIndex: 1 }, { pada: 3, navamshaSignIndex: 2 }, { pada: 4, navamshaSignIndex: 3 }] },
  { index: 19, name: 'Purva Ashadha', lord: 'venus', deity: 'Apas (Waters)', symbol: 'Elephant Tusk / Winnow', startDegree: 253.333333, endDegree: 266.666667, padas: [{ pada: 1, navamshaSignIndex: 4 }, { pada: 2, navamshaSignIndex: 5 }, { pada: 3, navamshaSignIndex: 6 }, { pada: 4, navamshaSignIndex: 7 }] },
  { index: 20, name: 'Uttara Ashadha', lord: 'sun', deity: 'Vishwadevas', symbol: 'Small Bed', startDegree: 266.666667, endDegree: 280.0, padas: [{ pada: 1, navamshaSignIndex: 8 }, { pada: 2, navamshaSignIndex: 9 }, { pada: 3, navamshaSignIndex: 10 }, { pada: 4, navamshaSignIndex: 11 }] },
  { index: 21, name: 'Shravana', lord: 'moon', deity: 'Vishnu', symbol: 'Three Footprints / Ear', startDegree: 280.0, endDegree: 293.333333, padas: [{ pada: 1, navamshaSignIndex: 0 }, { pada: 2, navamshaSignIndex: 1 }, { pada: 3, navamshaSignIndex: 2 }, { pada: 4, navamshaSignIndex: 3 }] },
  { index: 22, name: 'Dhanishta', lord: 'mars', deity: 'Eight Vasus', symbol: 'Flute / Drum', startDegree: 293.333333, endDegree: 306.666667, padas: [{ pada: 1, navamshaSignIndex: 4 }, { pada: 2, navamshaSignIndex: 5 }, { pada: 3, navamshaSignIndex: 6 }, { pada: 4, navamshaSignIndex: 7 }] },
  { index: 23, name: 'Shatabhisha', lord: 'rahu', deity: 'Varuna', symbol: 'Empty Circle / 100 Healers', startDegree: 306.666667, endDegree: 320.0, padas: [{ pada: 1, navamshaSignIndex: 8 }, { pada: 2, navamshaSignIndex: 9 }, { pada: 3, navamshaSignIndex: 10 }, { pada: 4, navamshaSignIndex: 11 }] },
  { index: 24, name: 'Purva Bhadrapada', lord: 'jupiter', deity: 'Aja Ekapada', symbol: 'Front of Funeral Cot', startDegree: 320.0, endDegree: 333.333333, padas: [{ pada: 1, navamshaSignIndex: 0 }, { pada: 2, navamshaSignIndex: 1 }, { pada: 3, navamshaSignIndex: 2 }, { pada: 4, navamshaSignIndex: 3 }] },
  { index: 25, name: 'Uttara Bhadrapada', lord: 'saturn', deity: 'Ahirbudhnya', symbol: 'Back of Funeral Cot', startDegree: 333.333333, endDegree: 346.666667, padas: [{ pada: 1, navamshaSignIndex: 4 }, { pada: 2, navamshaSignIndex: 5 }, { pada: 3, navamshaSignIndex: 6 }, { pada: 4, navamshaSignIndex: 7 }] },
  { index: 26, name: 'Revati', lord: 'mercury', deity: 'Pushan', symbol: 'Fish / Pair of Fish', startDegree: 346.666667, endDegree: 360.0, padas: [{ pada: 1, navamshaSignIndex: 8 }, { pada: 2, navamshaSignIndex: 9 }, { pada: 3, navamshaSignIndex: 10 }, { pada: 4, navamshaSignIndex: 11 }] },
];

export const DIVISION_INFO_MAP: Record<DivisionType, DivisionInfo> = {
  D1: {
    type: 'D1',
    name: 'Rasi',
    sanskritName: 'Rāśi',
    divisionsPerSign: 1,
    arcSpanMinutes: 1800, // 30°
    description: 'Primary chart. Physical environment and tangible reality.',
    physicalGeometry: '30° arc of the celestial ecliptic (1/12th of the sky).',
  },
  D2: {
    type: 'D2',
    name: 'Hora',
    sanskritName: 'Horā',
    divisionsPerSign: 2,
    arcSpanMinutes: 900, // 15°
    description: 'Wealth, resource accumulation, and circadian vitality.',
    physicalGeometry: '15° arc (1/24th of the sky), dividing each constellation into Solar/Lunar halves.',
  },
  D3: {
    type: 'D3',
    name: 'Drekkana',
    sanskritName: 'Drekkāṇa',
    divisionsPerSign: 3,
    arcSpanMinutes: 600, // 10°
    description: 'Energy, courage, skill mastery, siblings, and operational initiative.',
    physicalGeometry: '10° decan arc (1/36th of the sky).',
  },
  D7: {
    type: 'D7',
    name: 'Saptamsha',
    sanskritName: 'Saptāṁśa',
    divisionsPerSign: 7,
    arcSpanMinutes: 257.1428, // 4°17'08"
    description: 'Creative fruitfulness, generative output, and legacy.',
    physicalGeometry: '4°17\'08" arc (1/84th of the sky).',
  },
  D9: {
    type: 'D9',
    name: 'Navamsha',
    sanskritName: 'Navāṁśa',
    divisionsPerSign: 9,
    arcSpanMinutes: 200, // 3°20'
    description: 'Inner structural stamina, dharma, long-term integrity, and core strength.',
    physicalGeometry: '3°20\' arc (1/108th of the sky; exactly one Nakshatra Pada).',
  },
  D10: {
    type: 'D10',
    name: 'Dashamsha',
    sanskritName: 'Daśāṁśa',
    divisionsPerSign: 10,
    arcSpanMinutes: 180, // 3°00'
    description: 'Career output, executive leadership, public work, and professional impact.',
    physicalGeometry: '3°00\' arc (1/120th of the sky).',
  },
  D12: {
    type: 'D12',
    name: 'Dwadashamsha',
    sanskritName: 'Dvādaśāṁśa',
    divisionsPerSign: 12,
    arcSpanMinutes: 150, // 2°30'
    description: 'Heritage, ancestral conditioning, and foundational roots.',
    physicalGeometry: '2°30\' arc (1/144th of the sky).',
  },
  D60: {
    type: 'D60',
    name: 'Shashtiamsha',
    sanskritName: 'Ṣaṣṭyāṁśa',
    divisionsPerSign: 60,
    arcSpanMinutes: 30, // 0°30'
    description: 'Micro-structural discernment and fine-scale karmic balance.',
    physicalGeometry: '0°30\' arc (1/720th of the sky; micro-frequency harmonics).',
  },
};

export const CELESTIAL_BODY_CONFIG: Record<
  BodyKey,
  {
    name: string;
    sanskritName: string;
    symbol: string;
    color: string;
    category: 'classical' | 'outer';
    meanSpeed: number; // approximate degrees per day
  }
> = {
  sun: { name: 'Sun', sanskritName: 'Surya', symbol: '☉\uFE0E', color: '#f59e0b', category: 'classical', meanSpeed: 0.9856 },
  moon: { name: 'Moon', sanskritName: 'Chandra', symbol: '☽\uFE0E', color: '#e2e8f0', category: 'classical', meanSpeed: 13.176 },
  mars: { name: 'Mars', sanskritName: 'Mangala', symbol: '♂\uFE0E', color: '#ef4444', category: 'classical', meanSpeed: 0.524 },
  mercury: { name: 'Mercury', sanskritName: 'Budha', symbol: '☿\uFE0E', color: '#10b981', category: 'classical', meanSpeed: 1.383 },
  jupiter: { name: 'Jupiter', sanskritName: 'Guru', symbol: '♃\uFE0E', color: '#fbbf24', category: 'classical', meanSpeed: 0.083 },
  venus: { name: 'Venus', sanskritName: 'Shukra', symbol: '♀\uFE0E', color: '#ec4899', category: 'classical', meanSpeed: 1.2 },
  saturn: { name: 'Saturn', sanskritName: 'Shani', symbol: '♄\uFE0E', color: '#6366f1', category: 'classical', meanSpeed: 0.033 },
  rahu: { name: 'Rahu', sanskritName: 'Rahu', symbol: '☊\uFE0E', color: '#8b5cf6', category: 'classical', meanSpeed: -0.053 },
  ketu: { name: 'Ketu', sanskritName: 'Ketu', symbol: '☋\uFE0E', color: '#94a3b8', category: 'classical', meanSpeed: -0.053 },
  uranus: { name: 'Aruna / Uranus', sanskritName: 'Aruna', symbol: '♅\uFE0E', color: '#06b6d4', category: 'outer', meanSpeed: 0.0117 },
  neptune: { name: 'Varuna / Neptune', sanskritName: 'Varuna', symbol: '♆\uFE0E', color: '#3b82f6', category: 'outer', meanSpeed: 0.0059 },
  pluto: { name: 'Yama / Pluto', sanskritName: 'Yama', symbol: '♇\uFE0E', color: '#a855f7', category: 'outer', meanSpeed: 0.004 },
};
