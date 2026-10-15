import { BodyKey } from '@/types/astronomy';
import { ZODIAC_SIGNS, NAKSHATRAS } from '@/lib/astronomy/constants';

export interface VedicRelationship {
  friends: BodyKey[];
  enemies: BodyKey[];
  neutrals: BodyKey[];
}

// Classical Naisargika Sambandha (Permanent Vedic Planetary Friendships per Brihat Parashara Hora Shastra)
export const NAISARGIKA_PLANETARY_RELATIONSHIPS: Record<BodyKey, VedicRelationship> = {
  sun: {
    friends: ['moon', 'mars', 'jupiter'],
    enemies: ['venus', 'saturn', 'rahu', 'ketu'],
    neutrals: ['mercury', 'uranus', 'neptune', 'pluto'],
  },
  moon: {
    friends: ['sun', 'mercury'],
    enemies: ['rahu', 'ketu'], // Moon has no direct planetary enemies classically, except eclipse nodes
    neutrals: ['mars', 'jupiter', 'venus', 'saturn', 'uranus', 'neptune', 'pluto'],
  },
  mars: {
    friends: ['sun', 'moon', 'jupiter', 'ketu'],
    enemies: ['mercury', 'rahu'],
    neutrals: ['venus', 'saturn', 'uranus', 'neptune', 'pluto'],
  },
  mercury: {
    friends: ['sun', 'venus', 'rahu'],
    enemies: ['moon'],
    neutrals: ['mars', 'jupiter', 'saturn', 'ketu', 'uranus', 'neptune', 'pluto'],
  },
  jupiter: {
    friends: ['sun', 'moon', 'mars'],
    enemies: ['mercury', 'venus'],
    neutrals: ['saturn', 'rahu', 'ketu', 'uranus', 'neptune', 'pluto'],
  },
  venus: {
    friends: ['mercury', 'saturn', 'rahu', 'ketu'],
    enemies: ['sun', 'moon'],
    neutrals: ['mars', 'jupiter', 'uranus', 'neptune', 'pluto'],
  },
  saturn: {
    friends: ['mercury', 'venus', 'rahu'],
    enemies: ['sun', 'moon', 'mars'],
    neutrals: ['jupiter', 'ketu', 'uranus', 'neptune', 'pluto'],
  },
  rahu: {
    friends: ['venus', 'saturn', 'mercury'],
    enemies: ['sun', 'moon', 'mars'],
    neutrals: ['jupiter', 'ketu', 'uranus', 'neptune', 'pluto'],
  },
  ketu: {
    friends: ['mars', 'venus', 'saturn'],
    enemies: ['sun', 'moon'],
    neutrals: ['mercury', 'jupiter', 'rahu', 'uranus', 'neptune', 'pluto'],
  },
  uranus: {
    friends: ['mercury', 'saturn', 'rahu'],
    enemies: ['sun'],
    neutrals: ['moon', 'mars', 'jupiter', 'venus', 'ketu', 'neptune', 'pluto'],
  },
  neptune: {
    friends: ['moon', 'jupiter', 'venus'],
    enemies: ['saturn'],
    neutrals: ['sun', 'mars', 'mercury', 'rahu', 'ketu', 'uranus', 'pluto'],
  },
  pluto: {
    friends: ['mars', 'ketu'],
    enemies: ['venus', 'moon'],
    neutrals: ['sun', 'mercury', 'jupiter', 'saturn', 'rahu', 'uranus', 'neptune'],
  },
};

// Classical Nakshatra Lords in Vimshottari Order
export const NAKSHATRA_LORDS: BodyKey[] = [
  'ketu',    // 0: Ashwini
  'venus',   // 1: Bharani
  'sun',     // 2: Krittika
  'moon',    // 3: Rohini
  'mars',    // 4: Mrigashira
  'rahu',    // 5: Ardra
  'jupiter', // 6: Punarvasu
  'saturn',  // 7: Pushya
  'mercury', // 8: Ashlesha
  'ketu',    // 9: Magha
  'venus',   // 10: Purva Phalguni
  'sun',     // 11: Uttara Phalguni
  'moon',    // 12: Hasta
  'mars',    // 13: Chitra
  'rahu',    // 14: Swati
  'jupiter', // 15: Vishakha
  'saturn',  // 16: Anuradha
  'mercury', // 17: Jyeshtha
  'ketu',    // 18: Mula
  'venus',   // 19: Purva Ashadha
  'sun',     // 20: Uttara Ashadha
  'moon',    // 21: Shravana
  'mars',    // 22: Dhanishta
  'rahu',    // 23: Shatabhisha
  'jupiter', // 24: Purva Bhadrapada
  'saturn',  // 25: Uttara Bhadrapada
  'mercury', // 26: Revati
];

export interface SignRelationship {
  signIndex: number;
  friendlySigns: number[]; // Green highlight
  enemySigns: number[]; // Red highlight
  neutralSigns: number[];
  friendlyPlanets: BodyKey[];
  enemyPlanets: BodyKey[];
}

/**
 * Calculates Vedic Friendly and Inimical Signs based on:
 * 1. Sign Lord relationships (Naisargika Sambandha)
 * 2. Trikona (1st, 5th, 9th) natural allied element harmonic trines (Friendly)
 * 3. Shadashtaka (6th / 8th) friction and inimical houses (Inimical / Enemy)
 * 4. Kendras (4th, 7th, 10th) dynamic tension (Functional Allies / Neutral)
 */
export function getVedicSignRelationships(signIndex: number): SignRelationship {
  const friendlySigns: number[] = [];
  const enemySigns: number[] = [];
  const neutralSigns: number[] = [];

  const sign = ZODIAC_SIGNS[signIndex];
  const lordKey = sign.ruler as BodyKey;
  const lordRels = NAISARGIKA_PLANETARY_RELATIONSHIPS[lordKey] || {
    friends: [],
    enemies: [],
    neutrals: [],
  };

  for (let i = 0; i < 12; i++) {
    if (i === signIndex) continue;
    const distance = ((i - signIndex + 12) % 12) + 1; // 1 to 12

    // Trikona signs (5th and 9th from self) share identical element = pure friends
    if (distance === 5 || distance === 9) {
      friendlySigns.push(i);
    }
    // Upachaya 3rd and 11th = friends/allies in growth
    else if (distance === 3 || distance === 11) {
      friendlySigns.push(i);
    }
    // Shadashtaka (6th and 8th from self) = acute friction / inimical enemy signs
    else if (distance === 6 || distance === 8) {
      enemySigns.push(i);
    }
    // 2nd and 12th = mixed financial / release tension
    else if (distance === 2 || distance === 12) {
      neutralSigns.push(i);
    }
    // Kendras (4th, 7th, 10th) = powerful partners with distinct agendas
    else if (distance === 4 || distance === 7 || distance === 10) {
      neutralSigns.push(i);
    } else {
      neutralSigns.push(i);
    }
  }

  return {
    signIndex,
    friendlySigns,
    enemySigns,
    neutralSigns,
    friendlyPlanets: lordRels.friends,
    enemyPlanets: lordRels.enemies,
  };
}

/**
 * Calculates Nakshatra relationships based on Navatara Chakra:
 * (Janma, Sampat, Vipat, Kshema, Pratyak, Sadhana, Naidhana, Mitra, Param Mitra)
 */
export function getNakshatraTarabala(
  sourceNakIndex: number,
  targetNakIndex: number
): {
  type: 'sampat' | 'kshema' | 'sadhana' | 'mitra' | 'param_mitra' | 'vipat' | 'pratyak' | 'naidhana' | 'janma';
  isFriendly: boolean;
  isEnemy: boolean;
  title: string;
} {
  const distance = ((targetNakIndex - sourceNakIndex + 27) % 27) + 1; // 1 to 27
  const tara = (distance - 1) % 9; // 0 to 8

  switch (tara) {
    case 1: // 2nd: Sampat (Wealth / Prosperity)
      return { type: 'sampat', isFriendly: true, isEnemy: false, title: 'Sampat (Prosperity & Wealth)' };
    case 3: // 4th: Kshema (Well-being & Comfort)
      return { type: 'kshema', isFriendly: true, isEnemy: false, title: 'Kshema (Well-being & Fortification)' };
    case 5: // 6th: Sadhana (Achievement & Success)
      return { type: 'sadhana', isFriendly: true, isEnemy: false, title: 'Sadhana (Realization & Mastery)' };
    case 7: // 8th: Mitra (Friendly Ally)
      return { type: 'mitra', isFriendly: true, isEnemy: false, title: 'Mitra (Harmonious Friend)' };
    case 8: // 9th: Param Mitra (Supreme Ally)
      return { type: 'param_mitra', isFriendly: true, isEnemy: false, title: 'Param Mitra (Supreme Strategic Ally)' };
    case 2: // 3rd: Vipat (Misfortune / Danger)
      return { type: 'vipat', isFriendly: false, isEnemy: true, title: 'Vipat (Friction & Obstacles)' };
    case 4: // 5th: Pratyak (Opposition & Obstruction)
      return { type: 'pratyak', isFriendly: false, isEnemy: true, title: 'Pratyak (Obstruction & Rivalry)' };
    case 6: // 7th: Naidhana / Vadh (Destruction / Severe friction)
      return { type: 'naidhana', isFriendly: false, isEnemy: true, title: 'Naidhana (Severe Inimical Friction)' };
    default: // Janma (Self)
      return { type: 'janma', isFriendly: false, isEnemy: false, title: 'Janma (Core Birth Alignment)' };
  }
}

export interface NakshatraDeepRelationships {
  nakIndex: number;
  lord: BodyKey;
  friendlyNakshatras: number[];
  enemyNakshatras: number[];
  friendlyPlanets: BodyKey[];
  enemyPlanets: BodyKey[];
  friendlySigns: number[];
  enemySigns: number[];
  favorableHouses: number[];
  frictionHouses: number[];
}

/**
 * Calculates complete multi-dimensional relationships for a Nakshatra:
 * Friendly & enemy nakshatras, planets, signs, and houses.
 */
export function getNakshatraDeepRelationships(nakIndex: number): NakshatraDeepRelationships {
  const lord = NAKSHATRA_LORDS[nakIndex] || 'saturn';
  const lordRels = NAISARGIKA_PLANETARY_RELATIONSHIPS[lord] || {
    friends: ['sun', 'jupiter'],
    enemies: ['mars'],
    neutrals: [],
  };

  const friendlyNakshatras: number[] = [];
  const enemyNakshatras: number[] = [];

  for (let i = 0; i < 27; i++) {
    if (i === nakIndex) continue;
    const tb = getNakshatraTarabala(nakIndex, i);
    if (tb.isFriendly) friendlyNakshatras.push(i);
    else if (tb.isEnemy) enemyNakshatras.push(i);
  }

  // Signs containing this nakshatra
  const nak = NAKSHATRAS[nakIndex];
  const startSign = Math.floor(nak.startDegree / 30);
  const endSign = Math.floor(nak.endDegree / 30);
  const homeSigns = startSign === endSign ? [startSign] : [startSign, endSign];

  // Friendly signs = home signs, their trines (5th/9th), and signs ruled by nakshatra lord & friendly planets
  const friendlySignsSet = new Set<number>();
  homeSigns.forEach((s) => {
    friendlySignsSet.add(s);
    friendlySignsSet.add((s + 4) % 12); // 5th from sign
    friendlySignsSet.add((s + 8) % 12); // 9th from sign
  });

  // Enemy signs = 6th and 8th from home signs
  const enemySignsSet = new Set<number>();
  homeSigns.forEach((s) => {
    enemySignsSet.add((s + 5) % 12); // 6th from sign
    enemySignsSet.add((s + 7) % 12); // 8th from sign
  });
  // Remove home signs if overlapped
  friendlySignsSet.forEach((s) => enemySignsSet.delete(s));

  // Favorable houses: Kendras & Trikonas (1, 4, 5, 7, 9, 10, 11)
  const favorableHouses = [1, 4, 5, 7, 9, 10, 11];
  // Friction houses: Dusthanas (6, 8, 12)
  const frictionHouses = [6, 8, 12];

  return {
    nakIndex,
    lord,
    friendlyNakshatras,
    enemyNakshatras,
    friendlyPlanets: lordRels.friends,
    enemyPlanets: lordRels.enemies,
    friendlySigns: Array.from(friendlySignsSet),
    enemySigns: Array.from(enemySignsSet),
    favorableHouses,
    frictionHouses,
  };
}

export interface WheelHighlights {
  friendlySigns: Set<number>;
  enemySigns: Set<number>;
  friendlyNakshatras: Set<number>;
  enemyNakshatras: Set<number>;
  friendlyHouses: Set<number>;
  enemyHouses: Set<number>;
  friendlyPlanets: Set<BodyKey>;
  enemyPlanets: Set<BodyKey>;
}

/**
 * Computes exact sets of friendly (GREEN) and enemy (RED) elements
 * to highlight dynamically on the Celestial Wheel canvas.
 */
export function getWheelHighlights(
  inspectedEntity: { type: 'planet' | 'sign' | 'house' | 'nakshatra'; id: any } | null
): WheelHighlights {
  const empty: WheelHighlights = {
    friendlySigns: new Set(),
    enemySigns: new Set(),
    friendlyNakshatras: new Set(),
    enemyNakshatras: new Set(),
    friendlyHouses: new Set(),
    enemyHouses: new Set(),
    friendlyPlanets: new Set(),
    enemyPlanets: new Set(),
  };

  if (!inspectedEntity) return empty;

  if (inspectedEntity.type === 'sign') {
    const rels = getVedicSignRelationships(inspectedEntity.id);
    return {
      friendlySigns: new Set(rels.friendlySigns),
      enemySigns: new Set(rels.enemySigns),
      friendlyNakshatras: new Set(),
      enemyNakshatras: new Set(),
      friendlyHouses: new Set(rels.friendlySigns.map((s) => s + 1)),
      enemyHouses: new Set(rels.enemySigns.map((s) => s + 1)),
      friendlyPlanets: new Set(rels.friendlyPlanets),
      enemyPlanets: new Set(rels.enemyPlanets),
    };
  }

  if (inspectedEntity.type === 'nakshatra') {
    const deep = getNakshatraDeepRelationships(inspectedEntity.id);
    return {
      friendlySigns: new Set(deep.friendlySigns),
      enemySigns: new Set(deep.enemySigns),
      friendlyNakshatras: new Set(deep.friendlyNakshatras),
      enemyNakshatras: new Set(deep.enemyNakshatras),
      friendlyHouses: new Set(deep.favorableHouses),
      enemyHouses: new Set(deep.frictionHouses),
      friendlyPlanets: new Set(deep.friendlyPlanets),
      enemyPlanets: new Set(deep.enemyPlanets),
    };
  }

  if (inspectedEntity.type === 'house') {
    const h = inspectedEntity.id; // 1 to 12
    const friendlyHouses = new Set<number>();
    const enemyHouses = new Set<number>();

    // Trikonas (5th & 9th from house) and Kendras (4th, 7th, 10th)
    friendlyHouses.add((((h - 1 + 4) % 12) + 1)); // 5th from house
    friendlyHouses.add((((h - 1 + 8) % 12) + 1)); // 9th from house
    friendlyHouses.add((((h - 1 + 10) % 12) + 1)); // 11th from house

    // Dusthanas (6th & 8th from house)
    enemyHouses.add((((h - 1 + 5) % 12) + 1)); // 6th from house
    enemyHouses.add((((h - 1 + 7) % 12) + 1)); // 8th from house

    return {
      friendlySigns: new Set(Array.from(friendlyHouses).map((num) => num - 1)),
      enemySigns: new Set(Array.from(enemyHouses).map((num) => num - 1)),
      friendlyNakshatras: new Set(),
      enemyNakshatras: new Set(),
      friendlyHouses,
      enemyHouses,
      friendlyPlanets: new Set(),
      enemyPlanets: new Set(),
    };
  }

  if (inspectedEntity.type === 'planet') {
    const key = inspectedEntity.id as BodyKey;
    const pRels = NAISARGIKA_PLANETARY_RELATIONSHIPS[key];
    if (!pRels) return empty;

    // Friendly signs: signs ruled by friends
    const friendlySigns = new Set<number>();
    const enemySigns = new Set<number>();

    ZODIAC_SIGNS.forEach((s) => {
      if (pRels.friends.includes(s.ruler as BodyKey)) friendlySigns.add(s.index);
      if (pRels.enemies.includes(s.ruler as BodyKey)) enemySigns.add(s.index);
    });

    return {
      friendlySigns,
      enemySigns,
      friendlyNakshatras: new Set(),
      enemyNakshatras: new Set(),
      friendlyHouses: new Set(Array.from(friendlySigns).map((s) => s + 1)),
      enemyHouses: new Set(Array.from(enemySigns).map((s) => s + 1)),
      friendlyPlanets: new Set(pRels.friends),
      enemyPlanets: new Set(pRels.enemies),
    };
  }

  return empty;
}
