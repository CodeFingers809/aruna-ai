'use client';

import React, { useState, useEffect } from 'react';
import { AstrologyProvider } from '@/context/AstrologyContext';
import { Header } from '@/components/layout/Header';
import { LeftSidebar } from '@/components/sidebar/LeftSidebar';
import { RightSidebar } from '@/components/sidebar/RightSidebar';
import { CelestialWheel } from '@/components/canvas/CelestialWheel';
import { TimeControls } from '@/components/canvas/TimeControls';

import { useAstrology } from '@/context/AstrologyContext';
import { FullAiWorkspaceModal } from '@/components/ai/FullAiWorkspaceModal';

function MainAppShell() {
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const {
    isAiWorkspaceOpen,
    setIsAiWorkspaceOpen,
    aiResponse,
    aiLoading,
    aiError,
    aiModel,
    runAiAnalysis,
  } = useAstrology();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Telemetry Header */}
      <Header
        onToggleLeftSidebar={() => setIsLeftOpen((prev) => !prev)}
        onToggleRightSidebar={() => setIsRightOpen((prev) => !prev)}
        isLeftSidebarOpen={isLeftOpen}
        isRightSidebarOpen={isRightOpen}
      />

      {/* Main Interactive Stage */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Telemetry Sidebar */}
        {isLeftOpen && <LeftSidebar />}

        {/* Center: Geocentric Celestial Mechanics Canvas & Time Machine */}
        <main className="flex-1 flex flex-col items-center justify-between overflow-hidden relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950">
          <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
            <CelestialWheel />
          </div>
          <TimeControls />
        </main>

        {/* Right Directives & Timing Sidebar */}
        {isRightOpen && <RightSidebar />}
      </div>

      {/* Full-Page AI Strategic Workspace (Full View) */}
      {isAiWorkspaceOpen && (
        <FullAiWorkspaceModal
          onClose={() => setIsAiWorkspaceOpen(false)}
          aiResponse={aiResponse}
          aiLoading={aiLoading}
          aiError={aiError}
          onRunQuery={runAiAnalysis}
          aiModel={aiModel}
        />
      )}
    </div>
  );
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 items-center justify-center select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-amber-400 p-[2px] shadow-lg flex items-center justify-center animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="12" cy="12" r="9" stroke="currentColor" opacity="0.4" />
                <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#f59e0b" transform="rotate(-30 12 12)" />
                <circle cx="12" cy="12" r="3" fill="#38bdf8" />
              </svg>
            </div>
          </div>
          <span className="font-extrabold text-slate-100 text-sm tracking-widest">ARUNA AI</span>
        </div>
      </div>
    );
  }

  return (
    <AstrologyProvider>
      <MainAppShell />
    </AstrologyProvider>
  );
}
