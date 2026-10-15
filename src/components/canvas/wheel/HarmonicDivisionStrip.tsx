'use client';

import React from 'react';
import { MagnifyingGlassPlus, MagnifyingGlassMinus, ArrowsClockwise, Hand } from '@phosphor-icons/react';

interface HarmonicDivisionStripProps {
  showAspects: boolean;
  setShowAspects: React.Dispatch<React.SetStateAction<boolean>>;
  showSightlines: boolean;
  setShowSightlines: React.Dispatch<React.SetStateAction<boolean>>;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoomPan: () => void;
  isSpaceHeld: boolean;
}

export function HarmonicDivisionStrip({
  showAspects,
  setShowAspects,
  showSightlines,
  setShowSightlines,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoomPan,
  isSpaceHeld,
}: HarmonicDivisionStripProps) {
  return (
    <div className="w-full max-w-5xl px-4 pt-1 pb-1.5 flex items-center justify-between gap-3 text-xs z-10 select-none">
      {/* Left: Interactive Canvas Controls (Zoom In, Zoom Out, Reset, Space Pan Indicator) */}
      <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1 rounded-lg border border-slate-800 shadow-md">
        <button
          onClick={onZoomIn}
          disabled={zoom >= 3.0}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
          title="Zoom In (+25%)"
        >
          <MagnifyingGlassPlus size={14} weight="bold" />
        </button>

        <span className="font-mono text-[11px] text-cyan-300 px-1 font-semibold">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={onZoomOut}
          disabled={zoom <= 0.75}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
          title="Zoom Out (-25%)"
        >
          <MagnifyingGlassMinus size={14} weight="bold" />
        </button>

        <div className="w-[1px] h-3.5 bg-slate-800 mx-0.5" />

        <button
          onClick={onResetZoomPan}
          className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-mono"
          title="Reset Zoom & Pan (1:1)"
        >
          <ArrowsClockwise size={12} />
          <span>Reset</span>
        </button>

        <div className="w-[1px] h-3.5 bg-slate-800 mx-0.5" />

        <div
          className={`px-2 py-0.5 rounded text-[10.5px] font-medium flex items-center gap-1 transition-all ${
            isSpaceHeld
              ? 'bg-amber-950/80 text-amber-300 border border-amber-800 animate-pulse'
              : 'text-slate-500'
          }`}
          title="Hold Spacebar to pan the canvas"
        >
          <Hand size={12} />
          <span>{isSpaceHeld ? 'Panning (Drag)' : 'Hold Space to Pan'}</span>
        </div>
      </div>

      {/* Right: Aspect Lines & Sightline Rays Toggles */}
      <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-lg border border-slate-800 shadow-md">
        <button
          onClick={() => setShowAspects((prev) => !prev)}
          className={`px-2.5 py-1 rounded text-xs transition-colors font-medium ${
            showAspects
              ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Aspect Lines
        </button>
        <button
          onClick={() => setShowSightlines((prev) => !prev)}
          className={`px-2.5 py-1 rounded text-xs transition-colors font-medium ${
            showSightlines
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Sightline Rays
        </button>
      </div>
    </div>
  );
}
