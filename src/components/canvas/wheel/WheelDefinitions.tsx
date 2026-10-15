import React from 'react';

/**
 * SVG Definitions for Celestial Wheel:
 * - Planetary radial gradient shaders
 * - Atmospheric glow filters
 * - Vedic SVG glyphs for Rahu (severed serpent head) and Ketu (moksha serpent tail & dhwaja flag)
 */
export function WheelDefinitions() {
  return (
    <defs>
      {/* Planetary Gradients */}
      <radialGradient id="sunGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="40%" stopColor="#f59e0b" />
        <stop offset="90%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </radialGradient>

      <radialGradient id="moonGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#e2e8f0" />
        <stop offset="85%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#64748b" />
      </radialGradient>

      <radialGradient id="marsGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fecaca" />
        <stop offset="45%" stopColor="#ef4444" />
        <stop offset="85%" stopColor="#b91c1c" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </radialGradient>

      <radialGradient id="mercuryGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#a7f3d0" />
        <stop offset="50%" stopColor="#10b981" />
        <stop offset="85%" stopColor="#047857" />
        <stop offset="100%" stopColor="#064e3b" />
      </radialGradient>

      <radialGradient id="jupiterGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="35%" stopColor="#f59e0b" />
        <stop offset="70%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </radialGradient>

      <radialGradient id="venusGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fdf2f8" />
        <stop offset="45%" stopColor="#f472b6" />
        <stop offset="85%" stopColor="#db2777" />
        <stop offset="100%" stopColor="#9d174d" />
      </radialGradient>

      <radialGradient id="saturnGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#e0e7ff" />
        <stop offset="50%" stopColor="#818cf8" />
        <stop offset="85%" stopColor="#4f46e5" />
        <stop offset="100%" stopColor="#312e81" />
      </radialGradient>

      <radialGradient id="uranusGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#cffafe" />
        <stop offset="50%" stopColor="#06b6d4" />
        <stop offset="85%" stopColor="#0891b2" />
        <stop offset="100%" stopColor="#164e63" />
      </radialGradient>

      <radialGradient id="neptuneGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#dbeafe" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="85%" stopColor="#1d4ed8" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </radialGradient>

      <radialGradient id="plutoGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#f3e8ff" />
        <stop offset="50%" stopColor="#a855f7" />
        <stop offset="85%" stopColor="#7e22ce" />
        <stop offset="100%" stopColor="#581c87" />
      </radialGradient>

      {/* Earth Center Gradients */}
      <radialGradient id="earthOcean" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="45%" stopColor="#0284c7" />
        <stop offset="85%" stopColor="#0369a1" />
        <stop offset="100%" stopColor="#075985" />
      </radialGradient>

      <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(56, 189, 248, 0.4)" />
        <stop offset="60%" stopColor="rgba(14, 165, 233, 0.15)" />
        <stop offset="100%" stopColor="rgba(2, 6, 23, 0)" />
      </radialGradient>

      {/* Soft Drop Shadow Filter for Badges */}
      <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.7" />
      </filter>
    </defs>
  );
}

/**
 * Authentic Vedic Vector Representation for Rahu:
 * Swarbhanu's Crowned Severed Serpent Head with flared hood, third eye, and eclipse fangs.
 */
export function VedicRahuIcon({ x, y, size = 18 }: { x: number; y: number; size?: number }) {
  const half = size / 2;
  return (
    <g transform={`translate(${x - half}, ${y - half})`} className="pointer-events-none">
      {/* Midnight aura */}
      <circle cx={half} cy={half} r={half + 3} fill="#4338ca" opacity="0.35" />
      {/* Base serpent head background */}
      <circle cx={half} cy={half} r={half} fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.2" />
      
      {/* Cobra hood & Crown crest */}
      <path
        d={`M ${half * 0.3} ${half * 0.9} 
            C ${half * 0.3} ${half * 0.4}, ${half * 0.6} ${half * 0.25}, ${half} ${half * 0.2} 
            C ${half * 1.4} ${half * 0.25}, ${half * 1.7} ${half * 0.4}, ${half * 1.7} ${half * 0.9}
            C ${half * 1.5} ${half * 1.4}, ${half * 1.2} ${half * 1.6}, ${half} ${half * 1.8}
            C ${half * 0.8} ${half * 1.6}, ${half * 0.5} ${half * 1.4}, ${half * 0.3} ${half * 0.9} Z`}
        fill="#312e81"
        stroke="#c7d2fe"
        strokeWidth="0.8"
      />
      {/* Crown spike */}
      <polygon
        points={`${half},${half * 0.05} ${half * 0.85},${half * 0.3} ${half * 1.15},${half * 0.3}`}
        fill="#fbbf24"
      />
      {/* Piercing Third Eye */}
      <ellipse cx={half} cy={half * 0.65} rx={half * 0.12} ry={half * 0.18} fill="#ef4444" />
      {/* Left and Right Cobra Eyes */}
      <circle cx={half * 0.72} cy={half * 0.88} r={half * 0.1} fill="#fbbf24" />
      <circle cx={half * 1.28} cy={half * 0.88} r={half * 0.1} fill="#fbbf24" />
      {/* Swarbhanu Eclipse Fangs / Mouth */}
      <path
        d={`M ${half * 0.75} ${half * 1.25} Q ${half} ${half * 1.4} ${half * 1.25} ${half * 1.25}`}
        stroke="#e0e7ff"
        strokeWidth="0.8"
        fill="none"
      />
    </g>
  );
}

/**
 * Authentic Vedic Vector Representation for Ketu:
 * The Mystical Serpent Tail ending in the cosmic Dhwaja (flag of spiritual Moksha).
 */
export function VedicKetuIcon({ x, y, size = 18 }: { x: number; y: number; size?: number }) {
  const half = size / 2;
  return (
    <g transform={`translate(${x - half}, ${y - half})`} className="pointer-events-none">
      {/* Smoke & ashes aura */}
      <circle cx={half} cy={half} r={half + 3} fill="#475569" opacity="0.35" />
      {/* Base container */}
      <circle cx={half} cy={half} r={half} fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.2" />

      {/* Serpentine tail curve */}
      <path
        d={`M ${half * 0.5} ${half * 1.7} 
            C ${half * 0.2} ${half * 1.3}, ${half * 0.4} ${half * 0.9}, ${half * 0.8} ${half * 0.8}
            C ${half * 1.2} ${half * 0.7}, ${half * 1.4} ${half * 0.4}, ${half * 1.1} ${half * 0.15}`}
        stroke="#94a3b8"
        strokeWidth={size * 0.14}
        strokeLinecap="round"
        fill="none"
      />
      {/* Dhwaja (Vedic Victory Flag of Moksha) mounted at upper pole */}
      <polygon
        points={`${half * 1.1},${half * 0.15} ${half * 1.8},${half * 0.4} ${half * 1.1},${half * 0.7}`}
        fill="#f59e0b"
        stroke="#fef3c7"
        strokeWidth="0.6"
      />
      {/* Mystic Inner Flame / Bindu of Liberation */}
      <circle cx={half * 0.75} cy={half * 1.2} r={half * 0.18} fill="#38bdf8" />
    </g>
  );
}
