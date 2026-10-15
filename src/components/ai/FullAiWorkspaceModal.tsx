'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAstrology, ChatMessage } from '@/context/AstrologyContext';
import { ZODIAC_SIGNS } from '@/lib/astronomy/constants';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { KundliChart } from '@/components/common/KundliChart';
import { getAspectSynthesis } from '@/lib/astronomy/dispositors';
import {
  Sparkle,
  Copy,
  PaperPlaneTilt,
  ArrowsIn,
  Warning,
  Compass,
  Eye,
  Check,
  ArrowCounterClockwise,
  ArrowDown,
} from '@phosphor-icons/react';

interface FullAiWorkspaceModalProps {
  onClose: () => void;
  aiResponse?: string | null;
  aiLoading?: boolean;
  aiError?: string | null;
  onRunQuery?: (query?: string) => Promise<void>;
  aiModel?: string;
}

function cleanMessageText(text: string): string {
  if (!text) return '';
  return text.replace(/\[SPOTLIGHT:\s*[^\]]+\]\n?/gi, '').trim();
}

function extractSpotlightKeys(
  text: string,
  bodies: Array<{ key: string; name: string; sanskritName: string }>
): string[] {
  if (!text) return [];
  const match = text.match(/\[SPOTLIGHT:\s*([^\]]+)\]/i);
  if (match && match[1]) {
    const parsed = match[1]
      .split(',')
      .map((p) => p.trim().toLowerCase())
      .filter((k) => bodies.some((b) => b.key === k));
    if (parsed.length > 0) return parsed;
  }
  const mentioned = bodies
    .filter((b) => {
      const regex = new RegExp(`\\b(${b.name}|${b.sanskritName})\\b`, 'i');
      return regex.test(text);
    })
    .map((b) => b.key);
  return mentioned.slice(0, 3);
}

function formatTime(timestamp?: number): string {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function FullAiWorkspaceModal({
  onClose,
  aiResponse: propAiResponse,
  aiLoading: propAiLoading,
  aiError: propAiError,
  onRunQuery,
  aiModel: propAiModel,
}: FullAiWorkspaceModalProps) {
  const {
    displayedBodies,
    aspects,
    sky,
    chartEnergy,
    strategicFocus,
    activeDasha,
    chatMessages,
    setChatMessages,
    sendChatMessage,
    clearChat,
    aiLoading: contextAiLoading,
    aiError: contextAiError,
    aiResponse: contextAiResponse,
    aiModel: contextAiModel,
  } = useAstrology();

  const isLoading = propAiLoading !== undefined ? propAiLoading : contextAiLoading;
  const currentError = propAiError !== undefined ? propAiError : contextAiError;
  const currentModel = propAiModel || contextAiModel || 'gemini-3.8-flash';

  const [inputQuery, setInputQuery] = useState('');
  const [highlightedPlanetKey, setHighlightedPlanetKey] = useState<string | null>(
    activeDasha.mahadasha.lord || 'jupiter'
  );
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize chat history if opened with a pre-existing aiResponse but empty messages
  useEffect(() => {
    const initialText = propAiResponse || contextAiResponse;
    if (chatMessages.length === 0 && initialText) {
      const spotlights = extractSpotlightKeys(initialText, displayedBodies);
      setChatMessages([
        {
          id: `msg-init-${Date.now()}`,
          role: 'assistant',
          content: initialText,
          timestamp: Date.now(),
          model: currentModel,
          spotlightKeys: spotlights,
        },
      ]);
    }
  }, [
    propAiResponse,
    contextAiResponse,
    chatMessages.length,
    displayedBodies,
    currentModel,
    setChatMessages,
  ]);

  // Extract spotlighted planets from the latest assistant message
  const latestAssistantMessage = useMemo(() => {
    for (let i = chatMessages.length - 1; i >= 0; i--) {
      if (chatMessages[i].role === 'assistant') {
        return chatMessages[i];
      }
    }
    return null;
  }, [chatMessages]);

  const activeSpotlightKeys = useMemo(() => {
    if (!latestAssistantMessage) {
      const fallbackText = propAiResponse || contextAiResponse;
      if (!fallbackText) return [];
      return extractSpotlightKeys(fallbackText, displayedBodies);
    }
    if (
      latestAssistantMessage.spotlightKeys &&
      latestAssistantMessage.spotlightKeys.length > 0
    ) {
      return latestAssistantMessage.spotlightKeys;
    }
    return extractSpotlightKeys(latestAssistantMessage.content, displayedBodies);
  }, [latestAssistantMessage, propAiResponse, contextAiResponse, displayedBodies]);

  // When activeSpotlightKeys updates, automatically highlight the primary spotlighted planet
  useEffect(() => {
    if (activeSpotlightKeys.length > 0) {
      setHighlightedPlanetKey(activeSpotlightKeys[0]);
    }
  }, [activeSpotlightKeys]);

  // Auto-scroll to bottom on new messages or loading change
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [chatMessages, isLoading]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    setShowScrollBottom(!isNearBottom);
  };

  // Quick prompt suggestions tailored to strategicFocus & follow-up deep dives
  const focusQueries: Record<string, string[]> = {
    career: [
      'Assess 10th house karmic activations and leadership milestones.',
      'Analyze Saturn & Mars transit pressure on professional growth.',
      'How does my D9 Navamsha support this vocational path?',
      'What remedies does BPHS recommend for Saturn transit?',
    ],
    wealth: [
      'Evaluate 2nd and 11th Dhana Bhavas for liquidity and reserves.',
      'Which planetary periods offer maximal asset preservation?',
      'Identify critical financial risk dates based on active transits.',
      'Explain the Vimshottari timing for capital allocation.',
    ],
    relationships: [
      'Analyze 7th house partnerships, Venusian alignment, and alliances.',
      'Evaluate transits impacting commitment and emotional clarity.',
      'How does Darakaraka (DK) dignity influence this cycle?',
      'What remedies does BPHS recommend for 7th house alignment?',
    ],
    health: [
      'Evaluate 1st, 6th and 8th Bhavas vitality and physical constitution.',
      'Identify peak stress windows and circadian recovery pacing.',
      'Analyze Sun and Mars vitality metrics for stamina recovery.',
      'What remedial Devanagari mantras does Parashara recommend?',
    ],
    family: [
      'Assess Matrukaraka (MK) and 4th house domestic sanctuary.',
      'Analyze generational assets and 2nd house lineage alignment.',
      'Identify timing windows for domestic transitions.',
      'What Vedic protocols support family harmony during this transit?',
    ],
    dharma: [
      'Assess Atmakaraka (AK) and 9th/12th house soul mission.',
      'Examine spiritual initiation windows and contemplative study.',
      'Analyze Jupiter transit influence on ethical alignment.',
      'What authentic Devanagari mantras are recommended for my Dasha?',
    ],
    general: [
      'Cross-verify active transits against my natal blueprint.',
      'Which house is experiencing maximum karmic transformation right now?',
      'Explain the active Vimshottari Mahadasha and Antardasha timing.',
      'What remedies does BPHS recommend for this planetary cycle?',
    ],
  };

  const currentQueries = focusQueries[strategicFocus] || focusQueries.general;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text || isLoading) return;
    setInputQuery('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    if (sendChatMessage) {
      await sendChatMessage(text);
    } else if (onRunQuery) {
      await onRunQuery(text);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputQuery(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    const clean = cleanMessageText(text);
    navigator.clipboard.writeText(clean);
    setCopiedMessageId(id);
    setTimeout(() => {
      setCopiedMessageId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  // Selected planet details for the telemetry sidebar
  const selectedBody =
    displayedBodies.find(
      (b) =>
        b.key === highlightedPlanetKey ||
        b.name.toLowerCase() === highlightedPlanetKey?.toLowerCase()
    ) || displayedBodies[0];

  const selectedEnergy = chartEnergy.planetEnergies.find(
    (p) => p.planet === selectedBody.key
  );

  const selectedAspects = aspects
    .filter((a) => a.body1 === selectedBody.key || a.body2 === selectedBody.key)
    .map((a) => {
      const partnerKey = a.body1 === selectedBody.key ? a.body2 : a.body1;
      const partner = displayedBodies.find((b) => b.key === partnerKey);
      const synthesis = partner
        ? getAspectSynthesis(a, selectedBody, partner)
        : a.description;
      return { aspect: a, partner, synthesis };
    });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col select-text overflow-hidden animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-slate-800 bg-slate-950 px-4 sm:px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-950/50">
            <Sparkle size={18} weight="fill" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
                Aruna AI Planetary Intelligence
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold uppercase tracking-wider">
                {currentModel}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 uppercase font-semibold">
                {strategicFocus}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Multi-Turn Conversational Intelligence • KaTeX Degrees • Devanagari Mantras • Natal Cross-Verification
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {chatMessages.length > 0 && (
            <button
              onClick={clearChat}
              disabled={isLoading}
              className="text-xs bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5 transition-colors"
              title="Reset conversation thread"
            >
              <ArrowCounterClockwise size={14} />
              <span>New Chat</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="text-xs bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-cyan-900/40"
            title="Exit Full-Page AI Workspace"
          >
            <ArrowsIn size={14} weight="bold" />
            <span>✕ Exit</span>
          </button>
        </div>
      </header>

      {/* Main Split: Conversational Chat on Left, Interactive Kundli Chart on Right */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ============================================================== */}
        {/* LEFT PANE: MULTI-TURN CONVERSATIONAL CHAT INTERFACE            */}
        {/* ============================================================== */}
        <section className="w-full lg:w-[70%] h-full flex flex-col bg-slate-950 border-r border-slate-800/80 overflow-hidden relative">
          {/* AI Chart Spotlight Bar */}
          {activeSpotlightKeys.length > 0 ? (
            <div className="p-2 sm:px-4 bg-slate-950/90 border-b border-cyan-900/60 flex items-center justify-between gap-2 overflow-x-auto flex-shrink-0 text-xs z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-bold text-cyan-300 flex items-center gap-1.5 flex-shrink-0">
                  <Sparkle size={13} className="text-cyan-400 animate-pulse" />
                  AI Chart Spotlight:
                </span>
                <div className="flex items-center gap-1.5 flex-nowrap">
                  {activeSpotlightKeys.map((key) => {
                    const body = displayedBodies.find((b) => b.key === key);
                    if (!body) return null;
                    const isSelected = highlightedPlanetKey === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setHighlightedPlanetKey(key)}
                        className={`px-2.5 py-1 rounded text-[10.5px] font-medium flex items-center gap-1.5 border transition-all flex-shrink-0 ${
                          isSelected
                            ? 'bg-cyan-950 text-cyan-200 border-cyan-500 font-bold shadow-md shadow-cyan-900/40 ring-1 ring-cyan-500/30'
                            : 'bg-slate-900/80 text-slate-300 hover:text-cyan-200 border-slate-800'
                        }`}
                        title={`Click to inspect ${body.name} in Kundli chakra`}
                      >
                        <span style={{ color: body.color }} className="font-bold">
                          {body.symbol}
                        </span>
                        <span>{body.name}</span>
                        <span className="text-[9px] text-cyan-400/80 font-mono">
                          H{body.house}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <span className="text-[9.5px] text-slate-400 hidden md:inline">
                Illuminating key Grahas from conversational telemetry
              </span>
            </div>
          ) : (
            <div className="p-2 sm:px-4 bg-slate-950/90 border-b border-slate-800/80 flex items-center gap-2 text-xs text-slate-400 flex-shrink-0">
              <Eye size={13} className="text-cyan-400/70" />
              <span className="text-[10px]">
                AI Chart Spotlight automatically illuminates key Grahas during analysis.
              </span>
            </div>
          )}

          {/* Scrollable Message Thread */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"
          >
            {/* Empty State: Prompt Starter */}
            {chatMessages.length === 0 && !isLoading && !currentError && (
              <div className="max-w-2xl mx-auto py-12 sm:py-16 text-center space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
                  <Sparkle size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-100 tracking-tight">
                    Conversational Vedic Planetary Intelligence
                  </h3>
                  <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                    Ask any question regarding your natal blueprint, real-time Gochara transits,
                    Vimshottari Dasha periods, and classical Parashari Shadbala Virupas. All
                    answers retain conversational memory across turns.
                  </p>
                </div>
                <div className="pt-2 flex flex-col items-center gap-2 max-w-xl mx-auto">
                  <span className="text-[10.5px] uppercase font-bold text-cyan-400/90 tracking-wider">
                    Recommended Inquiries ({strategicFocus.toUpperCase()}):
                  </span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentQueries.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/80 text-cyan-200 text-xs transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {currentError && (
              <div className="p-4 bg-red-950/30 border border-red-900/60 rounded-xl text-red-300 text-xs leading-relaxed space-y-1.5 animate-in fade-in duration-200">
                <span className="font-bold flex items-center gap-1.5 text-sm">
                  <Warning size={16} /> AI Telemetry Error
                </span>
                <p>{currentError}</p>
              </div>
            )}

            {/* Render Conversational Messages */}
            {chatMessages.map((msg) => {
              const isUser = msg.role === 'user';

              if (isUser) {
                return (
                  <div
                    key={msg.id}
                    className="flex flex-col items-end space-y-1 animate-in fade-in duration-200"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mr-1 font-mono">
                      <span>Query</span>
                      <span>•</span>
                      <span>{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className="bg-slate-900/90 border border-cyan-800/70 text-slate-100 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] sm:max-w-[75%] shadow-md text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              // Assistant message
              return (
                <div
                  key={msg.id}
                  className="flex flex-col items-start space-y-2 animate-in fade-in duration-200 w-full"
                >
                  <div className="flex items-center justify-between w-full max-w-[96%] px-1 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300 shadow-sm">
                        <Sparkle size={12} weight="fill" />
                      </div>
                      <span className="font-semibold text-cyan-300 text-xs">
                        Aruna AI Telemetry
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono uppercase">
                        {msg.model || currentModel}
                      </span>
                      <span>•</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {msg.spotlightKeys && msg.spotlightKeys.length > 0 && (
                        <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400">
                          <span className="text-cyan-400 font-mono text-[9.5px]">
                            Spotlight:
                          </span>
                          {msg.spotlightKeys.map((k) => (
                            <button
                              key={k}
                              onClick={() => setHighlightedPlanetKey(k)}
                              className="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-cyan-300 capitalize text-[9.5px]"
                              title={`Inspect ${k} in Kundli chart`}
                            >
                              {k}
                            </button>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="text-[11px] text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-800 px-2.5 py-1 rounded border border-slate-800 flex items-center gap-1 transition-colors"
                        title="Copy this response"
                      >
                        {copiedMessageId === msg.id ? (
                          <>
                            <Check size={12} className="text-emerald-400" />
                            <span className="text-emerald-400 text-[10px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl rounded-tl-sm p-4 sm:p-6 w-full max-w-[96%] shadow-lg space-y-3 select-text">
                    <MarkdownRenderer content={cleanMessageText(msg.content)} />
                  </div>
                </div>
              );
            })}

            {/* Active Thinking / Synthesis Bubble */}
            {isLoading && (
              <div className="flex flex-col items-start space-y-2 max-w-[96%] animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-xs text-cyan-300 px-1">
                  <div className="w-5 h-5 rounded-md bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300">
                    <Sparkle size={12} className="animate-spin text-cyan-400" />
                  </div>
                  <span className="font-semibold text-xs">Aruna AI Telemetry</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono uppercase">
                    {currentModel}
                  </span>
                </div>
                <div className="bg-slate-900/50 border border-cyan-900/60 rounded-2xl rounded-tl-sm p-4 w-full flex items-center gap-3 text-cyan-300 shadow-md">
                  <div className="flex space-x-1 shrink-0">
                    <div
                      className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                  <div className="text-xs text-slate-300">
                    <span className="font-semibold text-cyan-200 block">
                      Synthesizing multi-turn celestial telemetry with {currentModel}...
                    </span>
                    <span className="text-slate-500 text-[10.5px]">
                      Cross-referencing Janma Kundli, Gochara transits, and classical Parashari Virupas.
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Floating Scroll to Bottom Button */}
          {showScrollBottom && (
            <button
              onClick={() => scrollToBottom(true)}
              className="absolute bottom-36 right-6 z-20 p-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-lg transition-all animate-in fade-in"
              title="Scroll to bottom"
            >
              <ArrowDown size={16} weight="bold" />
            </button>
          )}

          {/* Quick Follow-up Chips Row (above input) */}
          <div className="p-2 sm:px-4 bg-slate-900/50 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto flex-shrink-0 z-10">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex-shrink-0">
              Follow-ups:
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {currentQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-200 text-[10.5px] transition-colors whitespace-nowrap flex-shrink-0 disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Interactive Query Bar with Multi-line Textarea */}
          <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800/80 flex-shrink-0 z-10">
            <div className="max-w-4xl mx-auto flex items-end gap-2">
              <div className="flex-1 bg-slate-900 border border-slate-800 focus-within:border-cyan-500 rounded-xl transition-colors overflow-hidden">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  placeholder={`Ask ${currentModel} anything about your ${strategicFocus} timing, transits, or remedies... (Enter to send, Shift+Enter for newline)`}
                  value={inputQuery}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="w-full bg-transparent px-3.5 py-2.5 text-slate-100 text-xs sm:text-sm outline-none resize-none placeholder:text-slate-600 max-h-36 overflow-y-auto leading-relaxed"
                />
              </div>

              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputQuery.trim()}
                className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm shadow-md shadow-cyan-950/40 h-[42px]"
                title="Send message"
              >
                <PaperPlaneTilt size={16} weight="bold" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* RIGHT PANE: 30% INTERACTIVE CHART & PLANETARY TELEMETRY ONLY   */}
        {/* ============================================================== */}
        <section className="w-full lg:w-[30%] h-full flex flex-col bg-slate-900/70 p-4 overflow-y-auto space-y-4 flex-shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Compass size={15} className="text-cyan-400" />
              Planetary Kundli Chakra
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Asc: {sky.ascendantDegree.toFixed(1)}°
            </span>
          </div>

          {/* Interactive Vedic Kundli Chart */}
          <div className="flex justify-center">
            <KundliChart
              title="Vedic Kundli Chakra"
              lagnaSignIndex={Math.floor(sky.ascendantDegree / 30)}
              planets={displayedBodies}
              size={360}
              highlightedPlanetKey={highlightedPlanetKey}
              onSelectPlanet={(planetKey) => setHighlightedPlanetKey(planetKey)}
              className="w-full border-cyan-900/40"
            />
          </div>

          {/* Highlighted Planet Card */}
          {selectedBody && (
            <div className="p-3 bg-slate-950/90 border border-cyan-800/60 rounded-xl space-y-2 text-xs shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl" style={{ color: selectedBody.color }}>
                    {selectedBody.symbol}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-100">
                        {selectedBody.name}
                      </span>
                      <span className="text-cyan-400 text-[10px] font-mono">
                        ({selectedBody.sanskritName})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      House {selectedBody.house} •{' '}
                      {ZODIAC_SIGNS[selectedBody.signIndex].name} (
                      {selectedBody.signDegree.toFixed(2)}°)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 capitalize font-medium">
                  {selectedBody.dignity}
                </span>
              </div>

              {selectedEnergy && (
                <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-800/60 text-[10px]">
                  <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Virupas:</span>
                    <span className="text-cyan-300 font-mono font-bold">
                      {selectedEnergy.totalVirupas} V
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Strength Ratio:</span>
                    <span
                      className={`font-mono font-bold ${
                        selectedEnergy.shadbalaRatio >= 1
                          ? 'text-emerald-300'
                          : 'text-amber-300'
                      }`}
                    >
                      {(selectedEnergy.shadbalaRatio * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Aspects Received */}
              {selectedAspects.length > 0 && (
                <div className="pt-1.5 border-t border-slate-800/60 space-y-1">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">
                    Aspects & Drishti Received ({selectedAspects.length}):
                  </span>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {selectedAspects.map(({ aspect, partner }, i) => (
                      <div
                        key={i}
                        className="text-[9.5px] text-slate-300 flex items-center justify-between bg-slate-900/60 px-2 py-1 rounded"
                      >
                        <span>
                          {aspect.type} with {partner?.name}
                        </span>
                        <span className="text-slate-500 font-mono">
                          ±{aspect.orb.toFixed(1)}°
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Compact Telemetry of all 9 Grahas */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              All Celestial Bodies (Click to Spotlight):
            </span>
            <div className="space-y-1">
              {displayedBodies.map((b) => {
                const isSelected =
                  highlightedPlanetKey === b.key ||
                  highlightedPlanetKey === b.name.toLowerCase();
                const energy = chartEnergy.planetEnergies.find(
                  (p) => p.planet === b.key
                );

                return (
                  <button
                    key={b.key}
                    onClick={() => setHighlightedPlanetKey(b.key)}
                    className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between text-[11px] ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-600 text-white shadow-sm ring-1 ring-cyan-500/30'
                        : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ color: b.color }} className="font-bold text-sm">
                        {b.symbol}
                      </span>
                      <div>
                        <span className="font-semibold">{b.name}</span>
                        <span className="text-[9.5px] text-slate-400 ml-1.5">
                          H{b.house} in{' '}
                          {ZODIAC_SIGNS[b.signIndex].name.substring(0, 3)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-cyan-300">
                        {b.signDegree.toFixed(1)}°
                      </div>
                      {energy && (
                        <div
                          className={`text-[9px] font-mono ${
                            energy.shadbalaRatio >= 1
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {(energy.shadbalaRatio * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
