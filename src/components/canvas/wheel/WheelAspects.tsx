import React from 'react';
import { Aspect, CelestialBody, SkyOrientation } from '@/types/astronomy';
import {
  WHEEL_CX,
  WHEEL_CY,
  HoveredItem,
  getWheelCoordinates,
  getPlanetTrackRadius,
} from './types';

interface WheelAspectsProps {
  displayedBodies: CelestialBody[];
  aspects: Aspect[];
  showAspects: boolean;
  selectedPlanetKey: string | null;
  hoveredItem: HoveredItem;
  wheelOrientation: 'sky' | 'ascendant';
  sky: SkyOrientation;
  rotationOffset: number;
}

export function WheelAspects({
  displayedBodies,
  aspects,
  showAspects,
  selectedPlanetKey,
  hoveredItem,
  wheelOrientation,
  sky,
  rotationOffset,
}: WheelAspectsProps) {
  const horizonEast = getWheelCoordinates(sky.ascendantDegree, 445, rotationOffset);
  const horizonWest = getWheelCoordinates(sky.descendantDegree, 445, rotationOffset);

  const hoveredKey = hoveredItem?.type === 'planet' ? hoveredItem.key : null;

  return (
    <g>
      {/* Dynamic Aspect Chords */}
      {showAspects &&
        aspects.map((aspect, idx) => {
          const b1 = displayedBodies.find((b) => b.key === aspect.body1);
          const b2 = displayedBodies.find((b) => b.key === aspect.body2);
          if (!b1 || !b2) return null;

          const r1 = getPlanetTrackRadius(b1.key);
          const r2 = getPlanetTrackRadius(b2.key);
          const p1 = getWheelCoordinates(b1.longitudeSidereal, r1, rotationOffset);
          const p2 = getWheelCoordinates(b2.longitudeSidereal, r2, rotationOffset);

          let strokeColor = '#38bdf8';
          if (aspect.type === 'trine') strokeColor = '#10b981';
          else if (aspect.type === 'opposition') strokeColor = '#ef4444';
          else if (aspect.type === 'square') strokeColor = '#f59e0b';
          else if (aspect.type === 'conjunction') strokeColor = '#fbbf24';
          else if (aspect.type === 'drishti') strokeColor = '#a855f7';

          const isHighlighted =
            selectedPlanetKey === b1.key ||
            selectedPlanetKey === b2.key ||
            hoveredKey === b1.key ||
            hoveredKey === b2.key;

          return (
            <line
              key={`aspect-chord-${idx}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={strokeColor}
              strokeWidth={isHighlighted ? 2.5 : 0.8}
              strokeDasharray={aspect.type === 'drishti' ? '3 3' : 'none'}
              opacity={isHighlighted ? 0.95 : 0.25}
            />
          );
        })}

      {/* Local Horizon Axis Line (East Lagna <-> West Descendant) */}
      {wheelOrientation === 'sky' && (
        <g>
          <line
            x1={horizonEast.x}
            y1={horizonEast.y}
            x2={horizonWest.x}
            y2={horizonWest.y}
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.65"
          />
          {/* East (Lagna) Label dynamically positioned on Eastern Horizon */}
          <g transform={`translate(${horizonEast.x > WHEEL_CX ? horizonEast.x - 75 : horizonEast.x + 5}, ${horizonEast.y - 8})`}>
            <rect x="-4" y="-10" width="70" height="15" fill="#020617" rx="3" opacity="0.85" stroke="#38bdf8" strokeWidth="0.8" />
            <text fill="#38bdf8" fontSize="8.5" fontFamily="sans-serif" fontWeight="bold">
              EAST • Lagna
            </text>
          </g>
          {/* West (Descendant) Label dynamically positioned on Western Horizon */}
          <g transform={`translate(${horizonWest.x < WHEEL_CX ? horizonWest.x + 5 : horizonWest.x - 75}, ${horizonWest.y - 8})`}>
            <rect x="-4" y="-10" width="70" height="15" fill="#020617" rx="3" opacity="0.85" stroke="#94a3b8" strokeWidth="0.8" />
            <text fill="#94a3b8" fontSize="8.5" fontFamily="sans-serif" fontWeight="bold">
              WEST • Desc
            </text>
          </g>
        </g>
      )}
    </g>
  );
}
