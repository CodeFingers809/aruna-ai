'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useAstrology } from '@/context/AstrologyContext';
import { WHEEL_VIEWBOX, HoveredItem } from './wheel/types';
import { WheelDefinitions } from './wheel/WheelDefinitions';
import { WheelRings } from './wheel/WheelRings';
import { WheelAspects } from './wheel/WheelAspects';
import { WheelPlanets } from './wheel/WheelPlanets';
import { WheelHoverTooltip } from './wheel/WheelHoverTooltip';
import { HarmonicDivisionStrip } from './wheel/HarmonicDivisionStrip';

export function CelestialWheel() {
  const {
    displayedBodies,
    sky,
    aspects,
    wheelOrientation,
    activeDivisionLens,
    selectedPlanetKey,
    setSelectedPlanetKey,
    inspectedEntity,
    setInspectedEntity,
  } = useAstrology();

  const [hoveredItem, setHoveredItem] = useState<HoveredItem>(null);
  const [showAspects, setShowAspects] = useState<boolean>(true);
  const [showSightlines, setShowSightlines] = useState<boolean>(true);

  // Zoom and Pan states
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSpaceHeld, setIsSpaceHeld] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; panX: number; panY: number }>({
    mouseX: 0,
    mouseY: 0,
    panX: 0,
    panY: 0,
  });

  // Space key down / up detection for space-only panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsSpaceHeld(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpaceHeld(false);
        setIsDragging(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3.0, Math.round((prev + 0.25) * 100) / 100));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.75, Math.round((prev - 0.25) * 100) / 100));
  };

  const handleResetZoomPan = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isSpaceHeld) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isSpaceHeld) return;
    e.preventDefault();
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel rotation angle so that the top (12 o'clock / -90°)
  // corresponds to the Zenith/Midheaven (MC) in 'sky' mode,
  // or to the Ascendant (East / 180°) in 'ascendant' mode.
  const rotationOffset = useMemo(() => {
    if (wheelOrientation === 'sky') {
      return -sky.zenithDegree - 90;
    } else {
      return -sky.ascendantDegree + 180;
    }
  }, [wheelOrientation, sky.zenithDegree, sky.ascendantDegree]);

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full h-full p-2 select-none overflow-hidden ${
        isSpaceHeld ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Controls: Zoom buttons, Space pan indicator, Aspect toggles */}
      <HarmonicDivisionStrip
        showAspects={showAspects}
        setShowAspects={setShowAspects}
        showSightlines={showSightlines}
        setShowSightlines={setShowSightlines}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoomPan={handleResetZoomPan}
        isSpaceHeld={isSpaceHeld}
      />

      {/* Main Celestial SVG Canvas with Zoom & Space Pan Transform */}
      <div className="relative flex items-center justify-center w-full flex-1 max-w-[880px] max-h-[880px] overflow-visible">
        <svg
          viewBox={WHEEL_VIEWBOX}
          className="w-full h-full aspect-square overflow-visible drop-shadow-2xl"
        >
          {/* Shaders, Gradients & Custom Vedic Rahu/Ketu Vectors */}
          <WheelDefinitions />

          {/* Canvas Transform Group for Space Pan & Button Zoom */}
          <g
            transform={`translate(${pan.x}, ${pan.y}) translate(550, 550) scale(${zoom}) translate(-550, -550)`}
          >
            {/* Concentric Guide Rings, Houses, Signs, Nakshatras & Harmonic Divisions */}
            <WheelRings
              rotationOffset={rotationOffset}
              sky={sky}
              activeDivisionLens={activeDivisionLens}
              inspectedEntity={inspectedEntity}
              setInspectedEntity={setInspectedEntity}
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
            />

            {/* Dynamic Aspects & Horizon Axis Line */}
            <WheelAspects
              displayedBodies={displayedBodies}
              aspects={aspects}
              showAspects={showAspects}
              selectedPlanetKey={selectedPlanetKey}
              hoveredItem={hoveredItem}
              wheelOrientation={wheelOrientation}
              sky={sky}
              rotationOffset={rotationOffset}
            />

            {/* Central Earth Globe & Realistic Revolving Planets with Vedic Nodes */}
            <WheelPlanets
              displayedBodies={displayedBodies}
              selectedPlanetKey={selectedPlanetKey}
              setSelectedPlanetKey={setSelectedPlanetKey}
              inspectedEntity={inspectedEntity}
              setInspectedEntity={setInspectedEntity}
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
              activeDivisionLens={activeDivisionLens}
              showSightlines={showSightlines}
              rotationOffset={rotationOffset}
            />
          </g>
        </svg>

        {/* Lightweight Non-blocking Hover Tooltip (Never overlaps center or sidebar) */}
        {!isSpaceHeld && (
          <WheelHoverTooltip
            hoveredItem={hoveredItem}
            displayedBodies={displayedBodies}
            ascendantDegree={sky.ascendantDegree}
          />
        )}
      </div>
    </div>
  );
}
