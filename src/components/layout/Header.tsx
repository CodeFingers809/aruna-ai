'use client';

import React from 'react';
import { useAstrology } from '@/context/AstrologyContext';
import { ZODIAC_SIGNS, NAKSHATRAS } from '@/lib/astronomy/constants';
import { DivisionType } from '@/types/astronomy';
import {
  Sparkle,
  SidebarSimple,
  Crosshair,
} from '@phosphor-icons/react';
import { StrategicFocus } from '@/context/AstrologyContext';

interface HeaderProps {
  onToggleLeftSidebar?: () => void;
  onToggleRightSidebar?: () => void;
  isLeftSidebarOpen?: boolean;
  isRightSidebarOpen?: boolean;
}

export function Header({
  onToggleLeftSidebar,
  onToggleRightSidebar,
  isLeftSidebarOpen = true,
  isRightSidebarOpen = true,
}: HeaderProps) {
  const {
    sky,
    displayedBodies,
    currentHora,
    systemMode,
    setSystemMode,
    activeDivisionLens,
    setActiveDivisionLens,
    strategicFocus,
    setStrategicFocus,
    setIsAiWorkspaceOpen,
  } = useAstrology();

  const lagnaSignIndex = Math.floor(sky.ascendantDegree / 30);
  const lagnaSign = ZODIAC_SIGNS[lagnaSignIndex];

  const divisionOptions: DivisionType[] = ['D1', 'D3', 'D7', 'D9', 'D10', 'D12', 'D60'];

  const focusOptions: { id: StrategicFocus; label: string }[] = [
    { id: 'general', label: 'General Timing' },
    { id: 'career', label: 'Career & Enterprise' },
    { id: 'wealth', label: 'Wealth & Capital' },
    { id: 'relationships', label: 'Relationships & Love' },
    { id: 'health', label: 'Health & Vitality' },
    { id: 'family', label: 'Family & Lineage' },
    { id: 'dharma', label: 'Dharma & Solitude' },
  ];

  return (
    <header className="h-13 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between z-30 select-none">
      {/* Brand & Left Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {onToggleLeftSidebar && (
          <button
            onClick={onToggleLeftSidebar}
            className={`p-1.5 rounded transition-colors ${
              isLeftSidebarOpen
                ? 'bg-slate-800 text-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            title="Toggle Left Telemetry Sidebar"
          >
            <SidebarSimple size={16} />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          {/* Elegant Celestial Astrolabe Logo */}
          <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-amber-400 p-[1.5px] shadow-lg flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="12" cy="12" r="9" stroke="currentColor" opacity="0.4" />
                <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#f59e0b" transform="rotate(-30 12 12)" />
                <circle cx="12" cy="12" r="3" fill="#38bdf8" />
              </svg>
            </div>
          </div>
          <div>
            <span className="font-extrabold text-slate-100 text-base tracking-wider">ARUNA AI</span>
          </div>
        </div>
      </div>

      {/* Center: Unified Astrological Telemetry (Lagna + Hora + Sky State Merged) */}
      <div className="hidden md:flex items-center gap-1.5 text-xs bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800 text-slate-300 shadow-inner">
        <span className="text-slate-500 font-medium">Lagna:</span>
        <span className="font-semibold text-cyan-300">
          {lagnaSign.sanskritName} ({Math.floor(sky.ascendantDegree % 30)}°)
        </span>
        <span className="text-slate-600 px-0.5">•</span>
        <span className="text-slate-500 font-medium">Hora:</span>
        <span className="font-semibold text-amber-300 capitalize">{currentHora.planet}</span>
        <span className="text-slate-600 px-0.5">•</span>
        <span className={`font-semibold ${sky.isDaytime ? 'text-amber-400' : 'text-indigo-400'}`}>
          {sky.isDaytime ? 'Day (Sun Above)' : 'Night (Sun Below)'}
        </span>
      </div>

      {/* Right Controls: Focus Domain, Dropdown Lens, AI Workspace, 9 vs 12 Bodies, Sidebar Toggle */}
      <div className="flex items-center gap-2">
        {/* Strategic Focus Lens Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded border border-cyan-800/80 shadow-inner text-xs">
          <Crosshair size={13} className="text-cyan-400 shrink-0" />
          <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Focus:</span>
          <select
            value={strategicFocus}
            onChange={(e) => setStrategicFocus(e.target.value as StrategicFocus)}
            className="bg-transparent text-cyan-300 font-semibold text-xs border-none outline-none cursor-pointer"
            title="Strategic Focus Domain: re-orients all directives, briefings, and AI analyses"
          >
            {focusOptions.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-slate-950 text-slate-100">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Division Lens Selector (Dropdown) */}
        <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800 text-xs">
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Lens:</span>
          <select
            value={activeDivisionLens}
            onChange={(e) => setActiveDivisionLens(e.target.value as DivisionType)}
            className="bg-transparent text-cyan-300 font-mono font-semibold text-xs border-none outline-none cursor-pointer"
            title="Harmonic Division Varga Lens (D1 to D60)"
          >
            {divisionOptions.map((lens) => (
              <option key={lens} value={lens} className="bg-slate-950 text-slate-100 font-mono">
                {lens}
              </option>
            ))}
          </select>
        </div>

        {/* AI Strategic Workspace Trigger */}
        <button
          onClick={() => setIsAiWorkspaceOpen(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs transition-all shadow-md shadow-cyan-950/60"
          title="Open AI Strategic Workspace"
        >
          <Sparkle size={13} weight="fill" />
          <span>AI Strategic Workspace</span>
        </button>

        {/* 9 vs 12 Bodies Toggle */}
        <button
          onClick={() => setSystemMode(systemMode === 'classical' ? 'extended' : 'classical')}
          className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-800 text-xs transition-colors"
          title="Toggle between Classical 9 Grahas and Extended 12 Bodies (Aruna, Varuna, Yama)"
        >
          <Sparkle size={13} className="text-indigo-400" />
          <span className="font-mono text-[11px]">
            {systemMode === 'classical' ? '9 Grahas' : '12 Bodies'}
          </span>
        </button>

        {/* Right Sidebar Toggle */}
        {onToggleRightSidebar && (
          <button
            onClick={onToggleRightSidebar}
            className={`p-1.5 rounded transition-colors ${
              isRightSidebarOpen
                ? 'bg-slate-800 text-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            title="Toggle Right Directives Sidebar"
          >
            <SidebarSimple size={16} className="transform rotate-180" />
          </button>
        )}
      </div>
    </header>
  );
}
