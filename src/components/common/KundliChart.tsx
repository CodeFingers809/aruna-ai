import React, { useState } from 'react';
import { BodyKey, CelestialBody } from '@/types/astronomy';
import { ZODIAC_SIGNS } from '@/lib/astronomy/constants';

export interface ChartDemonstrationPlanet {
  key?: BodyKey;
  name: string;
  symbol: string;
  signIndex: number; // 0 to 11
  degree?: number;
  house?: number;
  isRetrograde?: boolean;
  color?: string;
}

interface KundliChartProps {
  title?: string;
  lagnaSignIndex: number; // 0 = Aries, 1 = Taurus, etc.
  planets: (CelestialBody | ChartDemonstrationPlanet)[];
  styleMode?: 'north' | 'south';
  size?: number; // SVG px width/height
  className?: string;
  highlightedPlanetKey?: string | null;
  onSelectPlanet?: (planetKey: string) => void;
}

export function KundliChart({
  title = 'Vedic Kundli Chakra',
  lagnaSignIndex = 0,
  planets,
  styleMode: initialMode = 'north',
  size = 380,
  className = '',
  highlightedPlanetKey = null,
  onSelectPlanet,
}: KundliChartProps) {
  const [styleMode, setStyleMode] = useState<'north' | 'south'>(initialMode);

  // Group planets by signIndex (0 to 11)
  const planetsBySign = Array.from({ length: 12 }, () => [] as (CelestialBody | ChartDemonstrationPlanet)[]);
  planets.forEach((p) => {
    const sIdx = p.signIndex >= 0 && p.signIndex < 12 ? p.signIndex : 0;
    planetsBySign[sIdx].push(p);
  });

  // Calculate sign for each house in North Indian chart
  // House 1 has sign: lagnaSignIndex
  // House h (1-indexed) has sign: (lagnaSignIndex + h - 1) % 12
  const houseSigns = Array.from({ length: 12 }, (_, h) => (lagnaSignIndex + h) % 12);

  return (
    <div className={`flex flex-col items-center bg-slate-950/80 border border-slate-800 rounded-xl p-3 select-none ${className}`}>
      {/* Title & Style Toggle */}
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">{title}</span>
          <span className="text-[10px] text-cyan-400 font-mono">
            Lagna: {ZODIAC_SIGNS[lagnaSignIndex]?.name} ({lagnaSignIndex + 1})
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-[10px]">
          <button
            onClick={() => setStyleMode('north')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              styleMode === 'north'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            North Indian
          </button>
          <button
            onClick={() => setStyleMode('south')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              styleMode === 'south'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            South Indian
          </button>
        </div>
      </div>

      {/* SVG Canvas for Kundli */}
      {styleMode === 'north' ? (
        <NorthIndianDiamondKundli
          size={size}
          lagnaSignIndex={lagnaSignIndex}
          houseSigns={houseSigns}
          planetsBySign={planetsBySign}
          highlightedPlanetKey={highlightedPlanetKey}
          onSelectPlanet={onSelectPlanet}
        />
      ) : (
        <SouthIndianGridKundli
          size={size}
          lagnaSignIndex={lagnaSignIndex}
          planetsBySign={planetsBySign}
          highlightedPlanetKey={highlightedPlanetKey}
          onSelectPlanet={onSelectPlanet}
        />
      )}
    </div>
  );
}

/**
 * North Indian Diamond Chart (Fixed Houses, Moving Signs)
 * House 1 is always the Top Center Diamond.
 */
function NorthIndianDiamondKundli({
  size,
  lagnaSignIndex,
  houseSigns,
  planetsBySign,
  highlightedPlanetKey,
  onSelectPlanet,
}: {
  size: number;
  lagnaSignIndex: number;
  houseSigns: number[];
  planetsBySign: (CelestialBody | ChartDemonstrationPlanet)[][];
  highlightedPlanetKey?: string | null;
  onSelectPlanet?: (planetKey: string) => void;
}) {
  const S = 400; // Reference viewBox size
  const half = S / 2;

  // Text anchor positions for the 12 houses (1 to 12)
  const houseCoords: Record<number, { cx: number; cy: number }> = {
    1: { cx: half, cy: half * 0.55 },        // H1: Top Diamond (Lagna)
    2: { cx: half * 0.5, cy: half * 0.28 },   // H2: Top Left Triangle
    3: { cx: half * 0.28, cy: half * 0.5 },   // H3: Left Top Triangle
    4: { cx: half * 0.55, cy: half },        // H4: Left Diamond
    5: { cx: half * 0.28, cy: half * 1.5 },   // H5: Bottom Left Triangle
    6: { cx: half * 0.5, cy: half * 1.72 },   // H6: Bottom Left Inner
    7: { cx: half, cy: half * 1.45 },        // H7: Bottom Diamond
    8: { cx: half * 1.5, cy: half * 1.72 },   // H8: Bottom Right Inner
    9: { cx: half * 1.72, cy: half * 1.5 },   // H9: Bottom Right Triangle
    10: { cx: half * 1.45, cy: half },       // H10: Right Diamond
    11: { cx: half * 1.72, cy: half * 0.5 },  // H11: Top Right Triangle
    12: { cx: half * 1.5, cy: half * 0.28 },  // H12: Top Right Inner
  };

  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full max-w-[420px] aspect-square">
      {/* Outer Border */}
      <rect x="2" y="2" width={S - 4} height={S - 4} fill="#030712" stroke="#334155" strokeWidth="2" />

      {/* Diagonal lines */}
      <line x1="2" y1="2" x2={S - 2} y2={S - 2} stroke="#475569" strokeWidth="1.5" />
      <line x1="2" y1={S - 2} x2={S - 2} y2="2" stroke="#475569" strokeWidth="1.5" />

      {/* Inner Central Diamond */}
      <polygon
        points={`${half},2 2,${half} ${half},${S - 2} ${S - 2},${half}`}
        fill="none"
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Highlight Lagna Diamond (H1) subtly */}
      <polygon
        points={`${half},2 ${half * 0.5},${half * 0.5} ${half},${half} ${half * 1.5},${half * 0.5}`}
        fill="rgba(6, 182, 212, 0.08)"
      />

      {/* Render Each House: Sign Number & Occupying Planets */}
      {Array.from({ length: 12 }).map((_, idx) => {
        const houseNum = idx + 1;
        const signIdx = houseSigns[idx];
        const signNum = signIdx + 1; // 1 to 12
        const pos = houseCoords[houseNum];
        const residing = planetsBySign[signIdx] || [];

        return (
          <g key={`north-h-${houseNum}`}>
            {/* Sign Number Badge in Top of House */}
            <text
              x={pos.cx}
              y={pos.cy - 18}
              fill="#94a3b8"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              {signNum}
            </text>

            {/* Lagna indicator in House 1 */}
            {houseNum === 1 && (
              <text
                x={pos.cx}
                y={pos.cy - 30}
                fill="#38bdf8"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                letterSpacing="1"
              >
                LAGNA
              </text>
            )}

            {/* Planets inside House */}
            {residing.length > 0 ? (
              <g>
                {residing.map((p, pIdx) => {
                  const yOffset = pos.cy - 2 + pIdx * 14;
                  const isMatch =
                    highlightedPlanetKey &&
                    (p.key === highlightedPlanetKey ||
                      p.name.toLowerCase().includes(highlightedPlanetKey.toLowerCase()));

                  return (
                    <g
                      key={`p-${houseNum}-${pIdx}`}
                      className="cursor-pointer"
                      onClick={() => onSelectPlanet?.(p.key || p.name.toLowerCase())}
                    >
                      {isMatch && (
                        <rect
                          x={pos.cx - 38}
                          y={yOffset - 11}
                          width={76}
                          height={15}
                          rx={4}
                          fill="rgba(6, 182, 212, 0.4)"
                          stroke="#22d3ee"
                          strokeWidth="1.2"
                        />
                      )}
                      <text
                        x={pos.cx}
                        y={yOffset}
                        fill={isMatch ? '#67e8f9' : p.color || '#38bdf8'}
                        fontSize={isMatch ? '10.5' : '9.5'}
                        fontFamily="sans-serif"
                        fontWeight={isMatch ? '800' : 'bold'}
                        textAnchor="middle"
                        className="hover:brightness-125 transition-all"
                      >
                        {p.symbol} {p.name.split(' ')[0].substring(0, 3)}
                        {'signDegree' in p && typeof p.signDegree === 'number'
                          ? ` ${p.signDegree.toFixed(0)}°`
                          : ''}
                      </text>
                    </g>
                  );
                })}
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * South Indian Grid Chart (Fixed Signs, Clockwise)
 * 4x4 Grid with merged 2x2 central void.
 */
function SouthIndianGridKundli({
  size,
  lagnaSignIndex,
  planetsBySign,
  highlightedPlanetKey,
  onSelectPlanet,
}: {
  size: number;
  lagnaSignIndex: number;
  planetsBySign: (CelestialBody | ChartDemonstrationPlanet)[][];
  highlightedPlanetKey?: string | null;
  onSelectPlanet?: (planetKey: string) => void;
}) {
  const S = 400;
  const cellSize = S / 4;

  // Grid coordinates (col, row: 0 to 3) for each sign (0 = Aries ... 11 = Pisces)
  const SIGN_GRID_CELLS: Record<number, { col: number; row: number }> = {
    11: { col: 0, row: 0 }, // Pisces (12)
    0: { col: 1, row: 0 },  // Aries (1)
    1: { col: 2, row: 0 },  // Taurus (2)
    2: { col: 3, row: 0 },  // Gemini (3)
    3: { col: 3, row: 1 },  // Cancer (4)
    4: { col: 3, row: 2 },  // Leo (5)
    5: { col: 3, row: 3 },  // Virgo (6)
    6: { col: 2, row: 3 },  // Libra (7)
    7: { col: 1, row: 3 },  // Scorpio (8)
    8: { col: 0, row: 3 },  // Sagittarius (9)
    9: { col: 0, row: 2 },  // Capricorn (10)
    10: { col: 0, row: 1 }, // Aquarius (11)
  };

  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full max-w-[420px] aspect-square">
      {/* Background & Outer border */}
      <rect x="2" y="2" width={S - 4} height={S - 4} fill="#030712" stroke="#334155" strokeWidth="2" />

      {/* Grid Lines */}
      {/* Horizontal */}
      <line x1="0" y1={cellSize} x2={S} y2={cellSize} stroke="#475569" strokeWidth="1.5" />
      <line x1="0" y1={cellSize * 2} x2={cellSize} y2={cellSize * 2} stroke="#475569" strokeWidth="1.5" />
      <line x1={cellSize * 3} y1={cellSize * 2} x2={S} y2={cellSize * 2} stroke="#475569" strokeWidth="1.5" />
      <line x1="0" y1={cellSize * 3} x2={S} y2={cellSize * 3} stroke="#475569" strokeWidth="1.5" />

      {/* Vertical */}
      <line x1={cellSize} y1="0" x2={cellSize} y2={S} stroke="#475569" strokeWidth="1.5" />
      <line x1={cellSize * 2} y1="0" x2={cellSize * 2} y2={cellSize} stroke="#475569" strokeWidth="1.5" />
      <line x1={cellSize * 2} y1={cellSize * 3} x2={cellSize * 2} y2={S} stroke="#475569" strokeWidth="1.5" />
      <line x1={cellSize * 3} y1="0" x2={cellSize * 3} y2={S} stroke="#475569" strokeWidth="1.5" />

      {/* Central Void Text */}
      <text
        x={S / 2}
        y={S / 2 - 8}
        fill="#38bdf8"
        fontSize="12"
        fontWeight="bold"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="1"
      >
        SOUTH INDIAN
      </text>
      <text
        x={S / 2}
        y={S / 2 + 12}
        fill="#64748b"
        fontSize="9"
        fontFamily="sans-serif"
        textAnchor="middle"
      >
        Fixed Sign Chakra
      </text>

      {/* Render 12 Sign Cells */}
      {Array.from({ length: 12 }).map((_, signIdx) => {
        const cell = SIGN_GRID_CELLS[signIdx];
        const x = cell.col * cellSize;
        const y = cell.row * cellSize;
        const sign = ZODIAC_SIGNS[signIdx];
        const residing = planetsBySign[signIdx] || [];
        const isLagna = signIdx === lagnaSignIndex;

        return (
          <g key={`south-cell-${signIdx}`}>
            {/* Highlight Lagna cell */}
            {isLagna && (
              <rect
                x={x + 2}
                y={y + 2}
                width={cellSize - 4}
                height={cellSize - 4}
                fill="rgba(6, 182, 212, 0.12)"
              />
            )}

            {/* Sign Name Header in small in cell top corner */}
            <text
              x={x + 6}
              y={y + 14}
              fill="#64748b"
              fontSize="8.5"
              fontFamily="sans-serif"
              fontWeight="600"
            >
              {sign.symbol} {sign.name.substring(0, 3)}
            </text>

            {/* Lagna marker */}
            {isLagna && (
              <text
                x={x + cellSize - 8}
                y={y + 14}
                fill="#38bdf8"
                fontSize="9"
                fontWeight="bold"
                textAnchor="end"
              >
                ASC / Lagna
              </text>
            )}

            {/* Residing planets */}
            {residing.map((p, pIdx) => {
              const py = y + 32 + pIdx * 14;
              const isMatch =
                highlightedPlanetKey &&
                (p.key === highlightedPlanetKey ||
                  p.name.toLowerCase().includes(highlightedPlanetKey.toLowerCase()));

              return (
                <g
                  key={`sp-${signIdx}-${pIdx}`}
                  className="cursor-pointer"
                  onClick={() => onSelectPlanet?.(p.key || p.name.toLowerCase())}
                >
                  {isMatch && (
                    <rect
                      x={x + 6}
                      y={py - 10}
                      width={cellSize - 12}
                      height={14}
                      rx={3}
                      fill="rgba(6, 182, 212, 0.4)"
                      stroke="#22d3ee"
                      strokeWidth="1.2"
                    />
                  )}
                  <text
                    x={x + 10}
                    y={py}
                    fill={isMatch ? '#67e8f9' : p.color || '#38bdf8'}
                    fontSize={isMatch ? '10' : '9.5'}
                    fontFamily="sans-serif"
                    fontWeight={isMatch ? '800' : 'bold'}
                  >
                    {p.symbol} {p.name.split(' ')[0].substring(0, 3)}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
