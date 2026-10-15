import React, { useMemo } from 'react';
import { CelestialBody, DivisionType } from '@/types/astronomy';
import { ZODIAC_SIGNS } from '@/lib/astronomy/constants';
import { calculateHarmonicDivision } from '@/lib/astronomy/vargas';
import { getWheelHighlights } from '@/lib/astronomy/relationships';
import {
  WHEEL_CX,
  WHEEL_CY,
  HoveredItem,
  getWheelCoordinates,
  getPlanetTrackRadius,
} from './types';
import { VedicRahuIcon, VedicKetuIcon } from './WheelDefinitions';
import { InspectedEntity } from '@/context/AstrologyContext';

interface WheelPlanetsProps {
  displayedBodies: CelestialBody[];
  selectedPlanetKey: string | null;
  setSelectedPlanetKey: (key: any) => void;
  inspectedEntity: InspectedEntity;
  setInspectedEntity: (entity: InspectedEntity) => void;
  hoveredItem: HoveredItem;
  setHoveredItem: (item: HoveredItem) => void;
  activeDivisionLens: DivisionType;
  showSightlines: boolean;
  rotationOffset: number;
}

export function WheelPlanets({
  displayedBodies,
  selectedPlanetKey,
  setSelectedPlanetKey,
  inspectedEntity,
  setInspectedEntity,
  hoveredItem,
  setHoveredItem,
  activeDivisionLens,
  showSightlines,
  rotationOffset,
}: WheelPlanetsProps) {
  const hoveredKey = hoveredItem?.type === 'planet' ? hoveredItem.key : null;
  const highlights = useMemo(() => getWheelHighlights(inspectedEntity), [inspectedEntity]);

  return (
    <g>
      {/* Sightline Rays (Earth Center -> Planet -> Outer Division Arc) */}
      {showSightlines &&
        displayedBodies.map((body) => {
          const isSelected = selectedPlanetKey === body.key || hoveredKey === body.key;
          const pOuter = getWheelCoordinates(body.longitudeSidereal, 445, rotationOffset);
          const pBadge = getWheelCoordinates(body.longitudeSidereal, 458, rotationOffset);
          const divState = calculateHarmonicDivision(body.longitudeSidereal, activeDivisionLens);
          const divSign = ZODIAC_SIGNS[divState.signIndex];

          return (
            <g key={`sightline-ray-${body.key}`}>
              <line
                x1={WHEEL_CX}
                y1={WHEEL_CY}
                x2={pOuter.x}
                y2={pOuter.y}
                stroke={body.color}
                strokeWidth={isSelected ? 2 : 0.6}
                strokeDasharray={isSelected ? 'none' : '2 3'}
                opacity={isSelected ? 0.9 : 0.25}
              />
              {isSelected && (
                <g>
                  {/* Ring intersection point */}
                  <circle cx={pOuter.x} cy={pOuter.y} r="3" fill={body.color} />
                  {/* Destination Harmonic Badge */}
                  <circle
                    cx={pBadge.x}
                    cy={pBadge.y}
                    r="7.5"
                    fill="#020617"
                    stroke={divState.isVargottama ? '#10b981' : body.color}
                    strokeWidth="1.5"
                  />
                  <text
                    x={pBadge.x}
                    y={pBadge.y + 3}
                    fill={divState.isVargottama ? '#6ee7b7' : '#f8fafc'}
                    fontSize="7.5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {divSign.symbol}
                  </text>
                </g>
              )}
            </g>
          );
        })}

      {/* Central Core: Earth Globe with Oceanic & Atmospheric Design */}
      <g>
        {/* Atmosphere Glow */}
        <circle cx={WHEEL_CX} cy={WHEEL_CY} r="48" fill="url(#earthGlow)" />
        {/* Earth Oceanic Sphere */}
        <circle cx={WHEEL_CX} cy={WHEEL_CY} r="36" fill="url(#earthOcean)" stroke="#38bdf8" strokeWidth="1.2" />
        {/* Stylized Continents */}
        <path
          d={`M ${WHEEL_CX - 15} ${WHEEL_CY - 10} 
              Q ${WHEEL_CX - 5} ${WHEEL_CY - 25} ${WHEEL_CX + 10} ${WHEEL_CY - 15} 
              Q ${WHEEL_CX + 25} ${WHEEL_CY - 5} ${WHEEL_CX + 15} ${WHEEL_CY + 15} 
              Q ${WHEEL_CX - 5} ${WHEEL_CY + 25} ${WHEEL_CX - 20} ${WHEEL_CY + 5} Z`}
          fill="#10b981"
          opacity="0.8"
        />
        <circle cx={WHEEL_CX} cy={WHEEL_CY} r="3" fill="#ffffff" />
        <text
          x={WHEEL_CX}
          y={WHEEL_CY - 42}
          fill="#38bdf8"
          fontSize="8.5"
          fontFamily="sans-serif"
          fontWeight="bold"
          textAnchor="middle"
          letterSpacing="1"
        >
          EARTH • BHU
        </text>
      </g>

      {/* Realistic Styled Planets Revolving Around Earth */}
      {displayedBodies.map((body) => {
        const r = getPlanetTrackRadius(body.key);
        const p = getWheelCoordinates(body.longitudeSidereal, r, rotationOffset);
        const isSelected = selectedPlanetKey === body.key;
        const isHovered = hoveredKey === body.key;
        const baseSize = isSelected || isHovered ? 11 : 9;

        const handleClick = () => {
          if (isSelected) {
            setSelectedPlanetKey(null);
            setInspectedEntity(null);
          } else {
            setSelectedPlanetKey(body.key);
            setInspectedEntity({ type: 'planet', id: body.key });
          }
        };

        return (
          <g
            key={`planet-svg-${body.key}`}
            className="cursor-pointer transition-transform duration-200"
            onClick={handleClick}
            onMouseEnter={() => setHoveredItem({ type: 'planet', key: body.key })}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Glow Aura with Friendly (Green) and Enemy (Red) Highlights */}
            {(() => {
              const isFriendlyPlanet = highlights.friendlyPlanets.has(body.key);
              const isEnemyPlanet = highlights.enemyPlanets.has(body.key);

              let auraColor = body.color;
              let auraOpacity = isSelected || isHovered ? 0.45 : 0.15;
              let auraStroke = 'none';

              if (isSelected) {
                auraColor = '#06b6d4';
                auraOpacity = 0.55;
                auraStroke = '#38bdf8';
              } else if (isFriendlyPlanet) {
                auraColor = '#10b981';
                auraOpacity = 0.5;
                auraStroke = '#10b981';
              } else if (isEnemyPlanet) {
                auraColor = '#f43f5e';
                auraOpacity = 0.5;
                auraStroke = '#f43f5e';
              }

              return (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={baseSize + 6}
                  fill={auraColor}
                  stroke={auraStroke}
                  strokeWidth={isFriendlyPlanet || isEnemyPlanet || isSelected ? 1.5 : 0}
                  opacity={auraOpacity}
                />
              );
            })()}

            {/* Realistic Planet Visuals or Vedic Nodes */}
            {body.key === 'sun' && (
              <circle cx={p.x} cy={p.y} r={baseSize} fill="url(#sunGrad)" stroke="#fef08a" strokeWidth="1" />
            )}

            {body.key === 'moon' && (
              <g>
                <circle cx={p.x} cy={p.y} r={baseSize} fill="url(#moonGrad)" stroke="#e2e8f0" strokeWidth="0.8" />
                <circle cx={p.x - 2} cy={p.y - 2} r="1.5" fill="#64748b" opacity="0.6" />
                <circle cx={p.x + 3} cy={p.y + 1} r="2" fill="#64748b" opacity="0.5" />
              </g>
            )}

            {body.key === 'mars' && (
              <g>
                <circle cx={p.x} cy={p.y} r={baseSize} fill="url(#marsGrad)" stroke="#fca5a5" strokeWidth="0.8" />
                <ellipse cx={p.x} cy={p.y - baseSize + 2} rx="3" ry="1" fill="#fef2f2" opacity="0.8" />
              </g>
            )}

            {body.key === 'mercury' && (
              <circle cx={p.x} cy={p.y} r={baseSize} fill="url(#mercuryGrad)" stroke="#6ee7b7" strokeWidth="0.8" />
            )}

            {body.key === 'jupiter' && (
              <g>
                <circle cx={p.x} cy={p.y} r={baseSize + 2} fill="url(#jupiterGrad)" stroke="#fef3c7" strokeWidth="0.8" />
                <circle cx={p.x + 3} cy={p.y + 2} r="2" fill="#ef4444" opacity="0.8" />
              </g>
            )}

            {body.key === 'venus' && (
              <circle cx={p.x} cy={p.y} r={baseSize} fill="url(#venusGrad)" stroke="#fbcfe8" strokeWidth="0.8" />
            )}

            {body.key === 'saturn' && (
              <g>
                <ellipse
                  cx={p.x}
                  cy={p.y}
                  rx={baseSize + 8}
                  ry="3.5"
                  fill="none"
                  stroke="#c7d2fe"
                  strokeWidth="1.8"
                  transform={`rotate(-26, ${p.x}, ${p.y})`}
                  opacity="0.85"
                />
                <circle cx={p.x} cy={p.y} r={baseSize} fill="url(#saturnGrad)" stroke="#e0e7ff" strokeWidth="0.8" />
              </g>
            )}

            {body.key === 'uranus' && (
              <g>
                <ellipse
                  cx={p.x}
                  cy={p.y}
                  rx="2"
                  ry={baseSize + 4}
                  fill="none"
                  stroke="#a5f3fc"
                  strokeWidth="1.2"
                  opacity="0.75"
                />
                <circle cx={p.x} cy={p.y} r={baseSize} fill="url(#uranusGrad)" stroke="#a5f3fc" strokeWidth="0.8" />
              </g>
            )}

            {body.key === 'neptune' && (
              <circle cx={p.x} cy={p.y} r={baseSize} fill="url(#neptuneGrad)" stroke="#93c5fd" strokeWidth="0.8" />
            )}

            {body.key === 'pluto' && (
              <circle cx={p.x} cy={p.y} r={baseSize - 1} fill="url(#plutoGrad)" stroke="#d8b4fe" strokeWidth="0.8" />
            )}

            {/* Authentic Vedic Vector Icons for Rahu & Ketu */}
            {body.key === 'rahu' && (
              <VedicRahuIcon x={p.x} y={p.y} size={baseSize * 2.2} />
            )}

            {body.key === 'ketu' && (
              <VedicKetuIcon x={p.x} y={p.y} size={baseSize * 2.2} />
            )}

            {/* Full Planet Name in Small next to marker */}
            <text
              x={p.x + baseSize + 5}
              y={p.y + 3}
              fill={
                isSelected
                  ? '#38bdf8'
                  : highlights.friendlyPlanets.has(body.key)
                  ? '#6ee7b7'
                  : highlights.enemyPlanets.has(body.key)
                  ? '#fca5a5'
                  : '#e2e8f0'
              }
              fontSize="7.5"
              fontFamily="sans-serif"
              fontWeight={isSelected || highlights.friendlyPlanets.has(body.key) || highlights.enemyPlanets.has(body.key) ? 'bold' : '500'}
            >
              {body.name.split(' ')[0]}
            </text>

            {/* Retrograde (Rx) Indicator Badge */}
            {body.isRetrograde && (
              <text
                x={p.x - baseSize - 7}
                y={p.y + 3}
                fill="#ef4444"
                fontSize="8.5"
                fontWeight="bold"
                fontFamily="serif"
              >
                ℞
              </text>
            )}

            {/* Combustion Badge */}
            {body.isCombust && (
              <circle cx={p.x} cy={p.y - baseSize - 3} r="2" fill="#f59e0b" />
            )}
          </g>
        );
      })}
    </g>
  );
}
