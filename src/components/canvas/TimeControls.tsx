'use client';

import React, { useState } from 'react';
import { useAstrology, TimeUnit } from '@/context/AstrologyContext';
import {
  Play,
  Pause,
  ArrowCounterClockwise,
  CaretLeft,
  CaretRight,
  CaretDoubleLeft,
  CaretDoubleRight,
  MapPin,
  Clock,
  Compass,
  Crosshair,
  Sliders,
  MagnifyingGlass,
} from '@phosphor-icons/react';
import { searchCities, CityData } from '@/lib/astronomy/cities';

export function TimeControls() {
  const {
    currentDate,
    setCurrentDate,
    userLocation,
    setUserLocation,
    autoDetectLocation,
    isDetectingLocation,
    isPlaying,
    togglePlayback,
    speedMultiplier,
    setSpeedMultiplier,
    arrowMultiplierAmount,
    setArrowMultiplierAmount,
    arrowMultiplierUnit,
    setArrowMultiplierUnit,
    stepTime,
    resetToNow,
    isLiveSync,
    setIsLiveSync,
    wheelOrientation,
    setWheelOrientation,
  } = useAstrology();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showArrowConfig, setShowArrowConfig] = useState(false);
  const [modalCityQuery, setModalCityQuery] = useState('');

  const modalSearchResults = searchCities(modalCityQuery);

  const handleCitySelect = (city: CityData) => {
    setUserLocation({
      latitude: city.latitude,
      longitude: city.longitude,
      altitude: 0,
      cityName: `${city.name}, ${city.country}`,
      timezone: city.timezone,
    });
    setShowLocationModal(false);
  };

  // Speed Presets - 1mo/s removed per user directive; capped to max 1d/s
  const speedPresets = [
    { label: '1m/s', speed: 60 },
    { label: '10m/s', speed: 600 },
    { label: '1h/s', speed: 3600 },
    { label: '1d/s', speed: 86400 },
  ];

  const handleSpeedSelect = (speed: number) => {
    if (isPlaying && speedMultiplier === speed) {
      // If already playing at this speed, pause it (make static)
      togglePlayback();
    } else {
      // Set speed and ensure active movement
      setSpeedMultiplier(speed);
      if (!isPlaying) {
        togglePlayback();
      }
    }
  };

  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // ISO format with seconds for datetime-local
  const dateFormatted = isMounted
    ? new Date(
        currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 19)
    : '';

  return (
    <div className="w-full bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-4 py-2 flex flex-col gap-2 z-20 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Time Display & Reset */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-300 font-mono bg-slate-900 px-2.5 py-1 rounded border border-slate-800 shadow-inner">
            <Clock size={14} className="text-cyan-400" />
            <input
              type="datetime-local"
              step="1"
              value={dateFormatted}
              suppressHydrationWarning
              onChange={(e) => {
                const val = e.target.value;
                if (val) setCurrentDate(new Date(val));
              }}
              className="bg-transparent text-slate-200 border-none outline-none cursor-pointer text-xs"
            />
            <span
              suppressHydrationWarning
              className="text-[10px] text-cyan-300/80 font-mono hidden sm:inline font-semibold border-l border-slate-800 pl-1.5"
            >
              {isMounted ? currentDate.toLocaleTimeString() : '--:--:--'}
            </span>
          </div>

          <button
            onClick={resetToNow}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded transition-colors font-medium border border-slate-700/60"
            title="Snap back to current moment"
          >
            <ArrowCounterClockwise size={13} />
            <span>Now</span>
          </button>

          <button
            onClick={() => setIsLiveSync(!isLiveSync)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all font-medium border text-[11px] ${
              isLiveSync
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800 shadow-sm shadow-emerald-950/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
            title="Continuous real-time synchronization with current clock"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLiveSync ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
              }`}
            />
            <span>{isLiveSync ? 'Live Sync' : 'Sync Off'}</span>
          </button>
        </div>

        {/* Center: Stepping, Arrow Key Controls, and Speed Presets */}
        <div className="flex items-center gap-2">
          {/* Step Backwards */}
          <div className="flex items-center gap-0.5 bg-slate-900 p-0.5 rounded border border-slate-800">
            <button
              onClick={() => stepTime(-1, 'years', true)}
              className="p-1 hover:bg-slate-800 text-slate-300 rounded transition-colors"
              title="-1 Year"
            >
              <CaretDoubleLeft size={13} />
            </button>
            <button
              onClick={() => stepTime(-1, 'months', true)}
              className="px-1.5 py-0.5 hover:bg-slate-800 text-slate-300 rounded font-mono text-[10px]"
              title="-1 Month"
            >
              -1M
            </button>
            <button
              onClick={() => stepTime(-1, 'days', true)}
              className="px-1.5 py-0.5 hover:bg-slate-800 text-slate-300 rounded font-mono text-[10px]"
              title="-1 Day"
            >
              -1D
            </button>
            <button
              onClick={() => stepTime(-arrowMultiplierAmount, arrowMultiplierUnit, true)}
              className="p-1 hover:bg-slate-800 text-cyan-300 rounded transition-colors font-bold"
              title={`Step Back (← Arrow Key: -${arrowMultiplierAmount} ${arrowMultiplierUnit})`}
            >
              <CaretLeft size={14} />
            </button>
          </div>

          {/* Play / Pause Toggle Button */}
          <button
            onClick={togglePlayback}
            className={`flex items-center justify-center p-2.5 rounded-full transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 ring-2 ring-amber-400/30'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 ring-2 ring-cyan-400/30'
            }`}
            title={isPlaying ? 'Pause Motion (Make Static)' : 'Start Smooth Planetary Revolution (Spacebar)'}
          >
            {isPlaying ? <Pause size={14} weight="bold" /> : <Play size={14} weight="bold" />}
          </button>

          {/* Step Forwards */}
          <div className="flex items-center gap-0.5 bg-slate-900 p-0.5 rounded border border-slate-800">
            <button
              onClick={() => stepTime(arrowMultiplierAmount, arrowMultiplierUnit, true)}
              className="p-1 hover:bg-slate-800 text-cyan-300 rounded transition-colors font-bold"
              title={`Step Forward (→ Arrow Key: +${arrowMultiplierAmount} ${arrowMultiplierUnit})`}
            >
              <CaretRight size={14} />
            </button>
            <button
              onClick={() => stepTime(1, 'days', true)}
              className="px-1.5 py-0.5 hover:bg-slate-800 text-slate-300 rounded font-mono text-[10px]"
              title="+1 Day"
            >
              +1D
            </button>
            <button
              onClick={() => stepTime(1, 'months', true)}
              className="px-1.5 py-0.5 hover:bg-slate-800 text-slate-300 rounded font-mono text-[10px]"
              title="+1 Month"
            >
              +1M
            </button>
            <button
              onClick={() => stepTime(1, 'years', true)}
              className="p-1 hover:bg-slate-800 text-slate-300 rounded transition-colors"
              title="+1 Year"
            >
              <CaretDoubleRight size={13} />
            </button>
          </div>

          {/* Speed Presets (Auto-activates motion on click) */}
          <div className="flex items-center gap-1 bg-slate-900 px-1 py-0.5 rounded border border-slate-800 text-[10px] font-mono">
            {speedPresets.map((sp) => {
              const isActive = isPlaying && speedMultiplier === sp.speed;
              return (
                <button
                  key={sp.label}
                  onClick={() => handleSpeedSelect(sp.speed)}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={`Play at ${sp.label} (Click again to pause)`}
                >
                  {sp.label}
                </button>
              );
            })}
          </div>

          {/* Arrow Key Multiplier Config Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowArrowConfig((prev) => !prev)}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-800 font-mono text-[10px]"
              title="Configure Arrow Key Multiplier"
            >
              <Sliders size={12} className="text-cyan-400" />
              <span>
                Key: {arrowMultiplierAmount}
                {arrowMultiplierUnit === 'minutes'
                  ? 'm'
                  : arrowMultiplierUnit === 'hours'
                  ? 'h'
                  : arrowMultiplierUnit === 'days'
                  ? 'd'
                  : arrowMultiplierUnit === 'months'
                  ? 'M'
                  : 'y'}
              </span>
            </button>

            {showArrowConfig && (
              <div className="absolute bottom-9 left-0 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl flex flex-col gap-2 z-30 min-w-[190px]">
                <span className="text-slate-400 font-medium text-[10px]">Arrow Key Step Size</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 5, 10, 15, 30].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setArrowMultiplierAmount(amt)}
                      className={`flex-1 py-0.5 rounded text-[10px] font-mono ${
                        arrowMultiplierAmount === amt
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {amt}x
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px]">
                  {(['minutes', 'hours', 'days', 'months', 'years'] as TimeUnit[]).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => {
                        setArrowMultiplierUnit(unit);
                        setShowArrowConfig(false);
                      }}
                      className={`capitalize py-1 px-1 rounded text-center ${
                        arrowMultiplierUnit === unit
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: GPS Auto-Detect, Location, and Wheel Orientation */}
        <div className="flex items-center gap-2">
          {/* Automatic GPS Location Button */}
          <button
            onClick={autoDetectLocation}
            disabled={isDetectingLocation}
            className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-800 transition-colors"
            title="Auto-detect current GPS location"
          >
            <Crosshair
              size={13}
              className={`text-cyan-400 ${isDetectingLocation ? 'animate-spin' : ''}`}
            />
            <span className="text-[10px]">GPS</span>
          </button>

          {/* Wheel Orientation Toggle */}
          <button
            onClick={() => setWheelOrientation(wheelOrientation === 'sky' ? 'ascendant' : 'sky')}
            className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-800 transition-colors"
            title="Toggle between Sky View (Zenith Top) and Classic Ascendant View (East Left)"
          >
            <Compass size={13} className="text-cyan-400" />
            <span>{wheelOrientation === 'sky' ? 'Sky View' : 'Ascendant View'}</span>
          </button>

          {/* City / Location Trigger */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-800 transition-colors"
            title="Change observer location"
          >
            <MapPin size={13} className="text-cyan-400" />
            <span className="truncate max-w-[130px] font-medium">{userLocation.cityName}</span>
          </button>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 shrink-0">
              <h3 className="font-semibold text-slate-100 flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-cyan-400" />
                Select Observer Location
              </h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-slate-400 hover:text-slate-200 font-bold p-1 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3.5 flex-1 overflow-y-auto min-h-0">
              <button
                onClick={autoDetectLocation}
                disabled={isDetectingLocation}
                className="w-full flex items-center justify-center gap-2 bg-cyan-950/80 border border-cyan-800 text-cyan-300 py-2 rounded-lg font-medium hover:bg-cyan-900/60 transition-colors shrink-0"
              >
                <Crosshair size={16} className={isDetectingLocation ? 'animate-spin' : ''} />
                <span>{isDetectingLocation ? 'Detecting GPS...' : 'Auto-Detect via GPS'}</span>
              </button>

              <div className="space-y-2">
                <span className="text-slate-400 font-medium text-[11px] block">
                  Search Observer City / Location
                </span>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 focus-within:border-cyan-700">
                  <MagnifyingGlass size={14} className="text-cyan-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Type city or country (e.g. London, New Delhi, New York)..."
                    value={modalCityQuery}
                    onChange={(e) => setModalCityQuery(e.target.value)}
                    className="w-full bg-transparent border-none text-slate-200 outline-none text-xs"
                  />
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1 pt-1 pr-1">
                  {modalSearchResults.map((c) => (
                    <button
                      key={`${c.name}-${c.country}`}
                      onClick={() => handleCitySelect(c)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors border flex items-center justify-between ${
                        userLocation.cityName.includes(c.name)
                          ? 'bg-cyan-950/70 border-cyan-700 text-cyan-200 font-medium'
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-slate-100">{c.name}</span>
                        <span className="text-slate-400 text-[10px] ml-1.5 font-normal">{c.country}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{c.timezone}</span>
                    </button>
                  ))}
                  {modalSearchResults.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No matching cities found in database
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end px-4 py-3 border-t border-slate-800 shrink-0 bg-slate-900/90">
              <button
                onClick={() => setShowLocationModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
