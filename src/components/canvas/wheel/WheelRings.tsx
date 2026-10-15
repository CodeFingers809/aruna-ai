import React, { useMemo } from 'react';
import { ZODIAC_SIGNS, NAKSHATRAS, DIVISION_INFO_MAP } from '@/lib/astronomy/constants';
import { calculateHarmonicDivision } from '@/lib/astronomy/vargas';
import { DivisionType, SkyOrientation } from '@/types/astronomy';
import { getWheelHighlights } from '@/lib/astronomy/relationships';
import {
  WHEEL_CX,
  WHEEL_CY,
  HoveredItem,
  getWheelCoordinates,
  getSectorPath,
  getUprightTangentRotation,
} from './types';
import { InspectedEntity } from '@/context/AstrologyContext';

interface WheelRingsProps {
  rotationOffset: number;
  sky: SkyOrientation;
  activeDivisionLens: DivisionType;
  inspectedEntity: InspectedEntity;
  setInspectedEntity: (entity: InspectedEntity) => void;
  hoveredItem: HoveredItem;
  setHoveredItem: (item: HoveredItem) => void;
}

const HOUSE_TAGS: Record<number, string> = {
  1: 'H1 • Self',
  2: 'H2 • Wealth',
  3: 'H3 • Effort',
  4: 'H4 • Home',
  5: 'H5 • Intellect',
  6: 'H6 • Duty',
  7: 'H7 • Union',
  8: 'H8 • Deep',
  9: 'H9 • Dharma',
  10: 'H10 • Career',
  11: 'H11 • Gains',
  12: 'H12 • Release',
};

export function WheelRings({
  rotationOffset,
  sky,
  activeDivisionLens,
  inspectedEntity,
  setInspectedEntity,
  hoveredItem,
  setHoveredItem,
}: WheelRingsProps) {
  const divisionInfo = DIVISION_INFO_MAP[activeDivisionLens] || DIVISION_INFO_MAP.D1;
  const highlights = useMemo(() => getWheelHighlights(inspectedEntity), [inspectedEntity]);

  return (
    <g>
      {/* 1. Concentric Guide Circles & Orbital Tracks */}
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="72" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="88" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="104" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="120" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="136" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="152" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="168" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="184" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="198" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.3" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="210" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.3" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="220" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.3" />

      {/* Main Boundary Rings */}
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="225" fill="none" stroke="#334155" strokeWidth="1.2" opacity="0.7" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="260" fill="none" stroke="#334155" strokeWidth="1.2" opacity="0.7" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="290" fill="none" stroke="#475569" strokeWidth="1.5" opacity="0.8" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="350" fill="none" stroke="#475569" strokeWidth="1.5" opacity="0.8" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="410" fill="none" stroke="#475569" strokeWidth="1.5" opacity="0.8" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="445" fill="none" stroke="#64748b" strokeWidth="1.8" opacity="0.9" />

      {/* 2. House Sectors (Bhava Chakra: r225 to r260) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const houseNum = i + 1;
        const cuspDeg = (sky.ascendantDegree + i * 30) % 360;
        const midDeg = (cuspDeg + 15) % 360;

        const p1 = getWheelCoordinates(cuspDeg, 225, rotationOffset);
        const p2 = getWheelCoordinates(cuspDeg, 260, rotationOffset);
        const pMid = getWheelCoordinates(midDeg, 242, rotationOffset);

        const startDeg = cuspDeg + rotationOffset;
        const endDeg = cuspDeg + 30 + rotationOffset;
        const isSelected = inspectedEntity?.type === 'house' && inspectedEntity.id === houseNum;
        const isHovered = hoveredItem?.type === 'house' && hoveredItem.number === houseNum;
        const isFriendly = highlights.friendlyHouses.has(houseNum);
        const isEnemy = highlights.enemyHouses.has(houseNum);

        let houseFill = 'transparent';
        let houseStroke = 'transparent';
        if (isSelected) {
          houseFill = 'rgba(6, 182, 212, 0.4)';
          houseStroke = '#06b6d4';
        } else if (isFriendly) {
          houseFill = 'rgba(16, 185, 129, 0.28)';
          houseStroke = '#10b981';
        } else if (isEnemy) {
          houseFill = 'rgba(244, 63, 94, 0.28)';
          houseStroke = '#f43f5e';
        } else if (isHovered) {
          houseFill = 'rgba(6, 182, 212, 0.15)';
        }

        const textRot = getUprightTangentRotation(midDeg, rotationOffset);

        return (
          <g
            key={`house-spoke-${houseNum}`}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setInspectedEntity(isSelected ? null : { type: 'house', id: houseNum });
            }}
            onMouseEnter={() => setHoveredItem({ type: 'house', number: houseNum })}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <path
              d={getSectorPath(225, 260, startDeg, endDeg)}
              fill={houseFill}
              stroke={houseStroke}
              strokeWidth={isSelected || isFriendly || isEnemy ? 2 : 1}
              className="transition-colors"
            />
            <line
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={isSelected ? '#38bdf8' : isFriendly ? '#10b981' : isEnemy ? '#f43f5e' : '#475569'}
              strokeWidth={isSelected || isFriendly || isEnemy ? 1.5 : 1}
              strokeDasharray={isSelected || isFriendly || isEnemy ? 'none' : '1 2'}
            />
            <text
              x={pMid.x}
              y={pMid.y + 3}
              fill={isSelected ? '#38bdf8' : isFriendly ? '#6ee7b7' : isEnemy ? '#fca5a5' : '#94a3b8'}
              fontSize="7.5"
              fontFamily="sans-serif"
              fontWeight={isSelected || isFriendly || isEnemy ? 'bold' : '600'}
              textAnchor="middle"
              transform={`rotate(${textRot}, ${pMid.x}, ${pMid.y})`}
            >
              {HOUSE_TAGS[houseNum]}
            </text>
          </g>
        );
      })}

      {/* 3. 360° Degrees Graduation Marks (r260 to r290) */}
      {Array.from({ length: 120 }).map((_, idx) => {
        const deg = idx * 3;
        const isMajor = deg % 30 === 0;
        const isMid = deg % 10 === 0 && !isMajor;
        const rInner = isMajor ? 260 : isMid ? 270 : 278;
        const rOuter = 290;
        const pInner = getWheelCoordinates(deg, rInner, rotationOffset);
        const pOuter = getWheelCoordinates(deg, rOuter, rotationOffset);

        return (
          <line
            key={`degree-tick-${deg}`}
            x1={pInner.x}
            y1={pInner.y}
            x2={pOuter.x}
            y2={pOuter.y}
            stroke={isMajor ? '#94a3b8' : isMid ? '#64748b' : '#334155'}
            strokeWidth={isMajor ? 1.5 : isMid ? 1 : 0.6}
          />
        );
      })}

      {/* 4. 12 Zodiac Signs (r290 to r350) with Upright Tangent Text */}
      {ZODIAC_SIGNS.map((sign) => {
        const midDeg = sign.startDegree + 15;
        const pBorder = getWheelCoordinates(sign.startDegree, 290, rotationOffset);
        const pOuter = getWheelCoordinates(sign.startDegree, 350, rotationOffset);
        const pMid = getWheelCoordinates(midDeg, 320, rotationOffset);

        const startDeg = sign.startDegree + rotationOffset;
        const endDeg = sign.endDegree + rotationOffset;
        const isSelected = inspectedEntity?.type === 'sign' && inspectedEntity.id === sign.index;
        const isHovered = hoveredItem?.type === 'sign' && hoveredItem.index === sign.index;
        const isFriendly = highlights.friendlySigns.has(sign.index);
        const isEnemy = highlights.enemySigns.has(sign.index);

        let signFill = 'transparent';
        let signStroke = 'transparent';
        if (isSelected) {
          signFill = 'rgba(6, 182, 212, 0.35)';
          signStroke = '#06b6d4';
        } else if (isFriendly) {
          signFill = 'rgba(16, 185, 129, 0.25)';
          signStroke = '#10b981';
        } else if (isEnemy) {
          signFill = 'rgba(244, 63, 94, 0.25)';
          signStroke = '#f43f5e';
        } else if (isHovered) {
          signFill = 'rgba(6, 182, 212, 0.15)';
        }

        const textRot = getUprightTangentRotation(midDeg, rotationOffset);

        return (
          <g
            key={`zodiac-sign-${sign.name}`}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setInspectedEntity(isSelected ? null : { type: 'sign', id: sign.index });
            }}
            onMouseEnter={() => setHoveredItem({ type: 'sign', index: sign.index })}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <path
              d={getSectorPath(290, 350, startDeg, endDeg)}
              fill={signFill}
              stroke={signStroke}
              strokeWidth={isSelected || isFriendly || isEnemy ? 2 : 1.5}
              className="transition-colors"
            />
            <line
              x1={pBorder.x}
              y1={pBorder.y}
              x2={pOuter.x}
              y2={pOuter.y}
              stroke={isSelected ? '#38bdf8' : isFriendly ? '#10b981' : isEnemy ? '#f43f5e' : '#334155'}
              strokeWidth={isSelected || isFriendly || isEnemy ? 1.8 : 1.2}
            />
            {/* Glyph and Clear Name */}
            <text
              x={pMid.x}
              y={pMid.y - 4}
              fill={isSelected ? '#38bdf8' : isFriendly ? '#6ee7b7' : isEnemy ? '#fca5a5' : '#f8fafc'}
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
              transform={`rotate(${textRot}, ${pMid.x}, ${pMid.y})`}
            >
              {sign.symbol} {sign.name}
            </text>
            <text
              x={pMid.x}
              y={pMid.y + 8}
              fill={isSelected ? '#a5f3fc' : isFriendly ? '#a7f3d0' : isEnemy ? '#fecaca' : '#cbd5e1'}
              fontSize="7.5"
              fontFamily="sans-serif"
              fontWeight="500"
              textAnchor="middle"
              transform={`rotate(${textRot}, ${pMid.x}, ${pMid.y})`}
            >
              {sign.sanskritName} • {sign.element}
            </text>
          </g>
        );
      })}

      {/* 5. 27 Nakshatras (r350 to r410) with 4 Pada Ticks & Upright Names */}
      {NAKSHATRAS.map((nak) => {
        const midDeg = nak.startDegree + 6.666667;
        const pBorder = getWheelCoordinates(nak.startDegree, 350, rotationOffset);
        const pOuter = getWheelCoordinates(nak.startDegree, 410, rotationOffset);
        const pMid = getWheelCoordinates(midDeg, 380, rotationOffset);

        const startDeg = nak.startDegree + rotationOffset;
        const endDeg = nak.endDegree + rotationOffset;
        const isSelected = inspectedEntity?.type === 'nakshatra' && inspectedEntity.id === nak.index;
        const isHovered = hoveredItem?.type === 'nakshatra' && hoveredItem.index === nak.index;
        const isFriendly = highlights.friendlyNakshatras.has(nak.index);
        const isEnemy = highlights.enemyNakshatras.has(nak.index);

        let nakFill = 'transparent';
        let nakStroke = 'transparent';
        if (isSelected) {
          nakFill = 'rgba(6, 182, 212, 0.35)';
          nakStroke = '#06b6d4';
        } else if (isFriendly) {
          nakFill = 'rgba(16, 185, 129, 0.28)';
          nakStroke = '#10b981';
        } else if (isEnemy) {
          nakFill = 'rgba(244, 63, 94, 0.28)';
          nakStroke = '#f43f5e';
        } else if (isHovered) {
          nakFill = 'rgba(6, 182, 212, 0.12)';
        }

        const textRot = getUprightTangentRotation(midDeg, rotationOffset);

        // 4 Pada subdivisions (each 3°20' = 3.333333°)
        const padaTicks = [1, 2, 3].map((padaNum) => {
          const padaDeg = nak.startDegree + padaNum * 3.333333;
          const pt1 = getWheelCoordinates(padaDeg, 396, rotationOffset);
          const pt2 = getWheelCoordinates(padaDeg, 410, rotationOffset);
          return { padaNum, pt1, pt2 };
        });

        return (
          <g
            key={`nakshatra-${nak.name}`}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setInspectedEntity(isSelected ? null : { type: 'nakshatra', id: nak.index });
            }}
            onMouseEnter={() => setHoveredItem({ type: 'nakshatra', index: nak.index })}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <path
              d={getSectorPath(350, 410, startDeg, endDeg)}
              fill={nakFill}
              stroke={nakStroke}
              strokeWidth={isSelected || isFriendly || isEnemy ? 2 : 1.5}
              className="transition-colors"
            />
            {/* Nakshatra Boundary Line */}
            <line
              x1={pBorder.x}
              y1={pBorder.y}
              x2={pOuter.x}
              y2={pOuter.y}
              stroke={isSelected ? '#38bdf8' : isFriendly ? '#10b981' : isEnemy ? '#f43f5e' : '#475569'}
              strokeWidth={isSelected || isFriendly || isEnemy ? 1.8 : 0.8}
            />
            {/* Pada ticks */}
            {padaTicks.map(({ padaNum, pt1, pt2 }) => (
              <line
                key={`pada-${nak.name}-${padaNum}`}
                x1={pt1.x}
                y1={pt1.y}
                x2={pt2.x}
                y2={pt2.y}
                stroke="#334155"
                strokeWidth="0.6"
              />
            ))}
            {/* Nakshatra Name */}
            <text
              x={pMid.x}
              y={pMid.y + 2}
              fill={isSelected ? '#38bdf8' : isFriendly ? '#6ee7b7' : isEnemy ? '#fca5a5' : '#e2e8f0'}
              fontSize="6.5"
              fontFamily="sans-serif"
              fontWeight={isSelected || isFriendly || isEnemy ? 'bold' : '500'}
              textAnchor="middle"
              transform={`rotate(${textRot}, ${pMid.x}, ${pMid.y})`}
            >
              {nak.name}
            </text>
          </g>
        );
      })}

      {/* 6. Active Harmonic Division Outer Ring (r410 to r445) */}
      {(() => {
        const totalDivisions = 12 * divisionInfo.divisionsPerSign;
        const arcDeg = 360 / totalDivisions;
        const showGlyphs = divisionInfo.divisionsPerSign <= 12;

        return Array.from({ length: totalDivisions }).map((_, divIdx) => {
          const startDeg = divIdx * arcDeg;
          const midDeg = startDeg + arcDeg / 2;
          const divState = calculateHarmonicDivision(midDeg, activeDivisionLens);
          const divSign = ZODIAC_SIGNS[divState.signIndex];

          const p1 = getWheelCoordinates(startDeg, 410, rotationOffset);
          const p2 = getWheelCoordinates(startDeg, 445, rotationOffset);
          const pMid = getWheelCoordinates(midDeg, 427, rotationOffset);

          const elementColors: Record<string, string> = {
            Fire: '#ef4444',
            Earth: '#10b981',
            Air: '#06b6d4',
            Water: '#a855f7',
          };
          const strokeColor = elementColors[divSign.element] || '#06b6d4';
          const isSignBoundary = divIdx % divisionInfo.divisionsPerSign === 0;

          return (
            <g key={`varga-division-${activeDivisionLens}-${divIdx}`}>
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isSignBoundary ? '#94a3b8' : strokeColor}
                strokeWidth={isSignBoundary ? 1.5 : 0.6}
                opacity={isSignBoundary ? 0.9 : 0.45}
              />
              {showGlyphs && (
                <text
                  x={pMid.x}
                  y={pMid.y + 2.5}
                  fill={strokeColor}
                  fontSize={divisionInfo.divisionsPerSign <= 3 ? 9 : 6.5}
                  fontWeight="bold"
                  textAnchor="middle"
                  opacity="0.85"
                >
                  {divSign.symbol}
                </text>
              )}
            </g>
          );
        });
      })()}
    </g>
  );
}
