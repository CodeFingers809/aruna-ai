import React from 'react';
import { CelestialBody } from '@/types/astronomy';
import { ZODIAC_SIGNS, NAKSHATRAS } from '@/lib/astronomy/constants';
import { getSignDetail, getHouseDetail, getNakshatraDetail } from '@/lib/astronomy/dispositors';
import { HoveredItem } from './types';

interface WheelHoverTooltipProps {
  hoveredItem: HoveredItem;
  displayedBodies: CelestialBody[];
  ascendantDegree: number;
}

export function WheelHoverTooltip({
  hoveredItem,
  displayedBodies,
  ascendantDegree,
}: WheelHoverTooltipProps) {
  if (!hoveredItem) return null;

  if (hoveredItem.type === 'planet') {
    const body = displayedBodies.find((b) => b.key === hoveredItem.key);
    if (!body) return null;

    return (
      <div className="absolute top-4 left-4 z-20 pointer-events-none bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3 shadow-2xl shadow-cyan-950/40 max-w-xs animate-in fade-in duration-150">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base" style={{ color: body.color }}>
              {body.symbol}
            </span>
            <span className="font-bold text-slate-100 text-xs">{body.name}</span>
            <span className="text-slate-400 text-[10px]">({body.sanskritName})</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 font-semibold uppercase">
            {body.dignity}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
          <div className="text-slate-400">Position:</div>
          <div className="text-slate-200 font-mono text-right">
            {body.signDegree.toFixed(2)}° in {ZODIAC_SIGNS[body.signIndex].name}
          </div>
          <div className="text-slate-400">House:</div>
          <div className="text-slate-200 font-mono text-right">House {body.house}</div>
          <div className="text-slate-400">Nakshatra:</div>
          <div className="text-slate-200 font-mono text-right">
            {NAKSHATRAS[body.nakshatraIndex]?.name} (P{body.pada})
          </div>
          {body.isRetrograde && (
            <div className="col-span-2 text-rose-400 font-semibold pt-1">
              ℞ Retrograde (Vakri Motion)
            </div>
          )}
          {body.isCombust && (
            <div className="col-span-2 text-amber-400 font-semibold">
              ✦ Combust (Surya Astha)
            </div>
          )}
        </div>
        <div className="mt-2 pt-1 border-t border-slate-800/80 text-[9px] text-cyan-400/80 italic text-center">
          Click to inspect full Parashari analysis in Right Sidebar
        </div>
      </div>
    );
  }

  if (hoveredItem.type === 'sign') {
    const detail = getSignDetail(hoveredItem.index, displayedBodies);
    return (
      <div className="absolute top-4 left-4 z-20 pointer-events-none bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3 shadow-2xl shadow-cyan-950/40 max-w-xs animate-in fade-in duration-150">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
            <span className="text-cyan-400">{detail.sign.symbol}</span>
            <span>{detail.sign.name}</span>
            <span className="text-slate-400 text-[10px]">({detail.sign.sanskritName})</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 font-semibold">
            {detail.sign.element} • {detail.sign.modality}
          </span>
        </div>
        <div className="space-y-1 text-[10px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Sign Lord:</span>
            <span className="text-slate-200 font-semibold" style={{ color: detail.lord.color }}>
              {detail.lord.symbol} {detail.lord.name} ({detail.lord.sanskritName})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Lord Transit:</span>
            <span className="text-cyan-300 font-mono">House {detail.lordHouse}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Residing Bodies:</span>
            <span className="text-slate-200">
              {detail.residentBodies.length > 0
                ? detail.residentBodies.map((b) => b.name.split(' ')[0]).join(', ')
                : 'None'}
            </span>
          </div>
        </div>
        <div className="mt-2 pt-1 border-t border-slate-800/80 text-[9px] text-cyan-400/80 italic text-center">
          Click to inspect friendly & enemy signs in Right Sidebar
        </div>
      </div>
    );
  }

  if (hoveredItem.type === 'house') {
    const detail = getHouseDetail(hoveredItem.number, ascendantDegree, displayedBodies);
    return (
      <div className="absolute top-4 left-4 z-20 pointer-events-none bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3 shadow-2xl shadow-cyan-950/40 max-w-xs animate-in fade-in duration-150">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
            <span className="text-cyan-400 font-mono">H{detail.houseNumber}</span>
            <span>House {detail.houseNumber}</span>
            <span className="text-slate-400 text-[10px]">(Bhava {detail.houseNumber})</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 font-semibold">
            {detail.classification}
          </span>
        </div>
        <div className="space-y-1 text-[10px]">
          <div className="text-slate-300 line-clamp-2">{detail.domain}</div>
          <div className="flex justify-between pt-1">
            <span className="text-slate-400">Lord:</span>
            <span className="text-slate-200 font-semibold" style={{ color: detail.lord.color }}>
              {detail.lord.symbol} {detail.lord.name} (in H{detail.lordHouse})
            </span>
          </div>
        </div>
        <div className="mt-2 pt-1 border-t border-slate-800/80 text-[9px] text-cyan-400/80 italic text-center">
          Click to inspect full house dynamics in Right Sidebar
        </div>
      </div>
    );
  }

  if (hoveredItem.type === 'nakshatra') {
    const detail = getNakshatraDetail(hoveredItem.index, displayedBodies);
    return (
      <div className="absolute top-4 left-4 z-20 pointer-events-none bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3 shadow-2xl shadow-cyan-950/40 max-w-xs animate-in fade-in duration-150">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
            <span className="text-cyan-400">✦</span>
            <span>{detail.nakshatra.name}</span>
            <span className="text-slate-400 text-[10px]">#{detail.nakshatra.index + 1}</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 font-semibold">
            Deity: {detail.deity}
          </span>
        </div>
        <div className="space-y-1 text-[10px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Lord:</span>
            <span className="text-slate-200 font-semibold" style={{ color: detail.lord.color }}>
              {detail.lord.symbol} {detail.lord.name} (H{detail.lordHouse})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Celestial Arc:</span>
            <span className="text-slate-300 font-mono">
              {detail.nakshatra.startDegree.toFixed(1)}° – {detail.nakshatra.endDegree.toFixed(1)}°
            </span>
          </div>
        </div>
        <div className="mt-2 pt-1 border-t border-slate-800/80 text-[9px] text-cyan-400/80 italic text-center">
          Click to inspect Tarabala & allies in Right Sidebar
        </div>
      </div>
    );
  }

  return null;
}
