import { NextRequest, NextResponse } from 'next/server';

interface RequestMessage {
  role: 'user' | 'model' | 'assistant';
  content: string;
}

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

const VALID_GRAHA_KEYS = new Set([
  'sun',
  'moon',
  'mars',
  'mercury',
  'jupiter',
  'venus',
  'saturn',
  'rahu',
  'ketu',
]);

/**
 * Builds a strictly alternating user/model contents array for Gemini API.
 */
function buildGeminiContents(
  messages?: RequestMessage[],
  prompt?: string
): GeminiContent[] {
  const normalized: Array<{ role: 'user' | 'model'; text: string }> = [];

  if (messages && Array.isArray(messages) && messages.length > 0) {
    for (const msg of messages) {
      const text = (msg.content || '').trim();
      if (!text) continue;
      const role: 'user' | 'model' =
        msg.role === 'model' || msg.role === 'assistant' ? 'model' : 'user';
      normalized.push({ role, text });
    }
  }

  // If a prompt is explicitly passed and is not duplicate of the last user turn, append it
  if (prompt && prompt.trim()) {
    const trimmedPrompt = prompt.trim();
    const lastMsg = normalized[normalized.length - 1];
    if (!lastMsg || lastMsg.role !== 'user' || lastMsg.text !== trimmedPrompt) {
      normalized.push({ role: 'user', text: trimmedPrompt });
    }
  }

  // Default fallback if no messages or prompt provided
  if (normalized.length === 0) {
    normalized.push({
      role: 'user',
      text: 'Provide a comprehensive planetary timing assessment based on active transits, Vimshottari Dasha, and natal blueprint.',
    });
  }

  // Ensure conversation starts with 'user'
  while (normalized.length > 0 && normalized[0].role !== 'user') {
    normalized.shift();
  }

  if (normalized.length === 0) {
    normalized.push({
      role: 'user',
      text: prompt?.trim() || 'Provide a planetary timing assessment.',
    });
  }

  // Collapse consecutive same-role turns into single turns to satisfy Gemini API constraints
  const collapsed: GeminiContent[] = [];
  for (const item of normalized) {
    const last = collapsed[collapsed.length - 1];
    if (last && last.role === item.role) {
      last.parts[0].text += `\n\n${item.text}`;
    } else {
      collapsed.push({ role: item.role, parts: [{ text: item.text }] });
    }
  }

  // Ensure conversation ends with 'user' (the current prompt)
  if (collapsed.length > 0 && collapsed[collapsed.length - 1].role !== 'user') {
    collapsed.push({
      role: 'user',
      parts: [
        {
          text:
            prompt?.trim() ||
            'Continue the analysis with real-time transit telemetry.',
        },
      ],
    });
  }

  return collapsed;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      messages,
      userApiKey,
      celestialContext,
      strategicFocus,
    } = body;

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'No GEMINI_API_KEY found in .env. Please configure your key in .env.',
        },
        { status: 401 }
      );
    }

    const domain = (
      strategicFocus ||
      celestialContext?.strategicFocus ||
      'general'
    ).toUpperCase();

    const systemInstruction = `You are Aruna AI's High-Precision Planetary Timing Intelligence Engine powered by Gemini 3.8 Flash.
Your analytical foundation is traditional Jyotish and Vedic astronomical timing telemetry (Brihat Parashara Hora Shastra, Jaimini Upadesha Sutras, Varahamihira).
Your operational principle is ZERO SPECULATION, ZERO SUPERSTITION, PURE RIGOROUS TIMING: WHAT TO DO, WHEN TO DO IT, AND HOW TO EXECUTE.

CURRENT OPERATIONAL FOCUS DOMAIN: ${domain}
All analysis, mandates, restraints, and execution protocols MUST be deeply aligned and concentrated upon this selected domain:
- If CAREER: Focus primarily on vocational authority, Amatyakaraka (AmK), D10 Dashamsha, 10th/6th house mechanics, institutional dynamics, stakeholder alignment, and leadership milestones.
- If WEALTH: Focus primarily on capital allocation, liquid reserves, 2nd/11th/9th house activations, risk-adjusted ROI, and cash-flow audits.
- If RELATIONSHIPS: Focus primarily on Darakaraka (DK), 7th house alliances, contractual reciprocity, emotional clarity, and boundary negotiations.
- If HEALTH: Focus primarily on biological vitality, circadian rhythms, 1st/6th/8th house stress load, and nervous system recovery pacing.
- If FAMILY: Focus primarily on domestic sanctuaries, Matrukaraka (MK), 4th/2nd house lineage assets, and generational alignment.
- If DHARMA: Focus primarily on soul mission, Atmakaraka (AK), 9th/12th house alignment, contemplative study, and ethical integrity.
- If GENERAL: Provide an all-round macro-to-micro timing evaluation across all domains.

FORMATTING & RIGOROUS STANDARDS:
1. Standard GitHub Flavored Markdown (GFM).
2. AI CHART SPOTLIGHT: When introducing key Grahas or when answering questions where specific planets take center stage, specify 1 to 3 primary Grahas to illuminate on the interactive Kundli chakra at the very beginning of your response in this exact format:
   [SPOTLIGHT: planet_key1, planet_key2]
   (Valid keys: sun, moon, mars, mercury, jupiter, venus, saturn, rahu, ketu). The interactive chart will automatically highlight these Grahas.
3. CRITICAL VEDIC LAW — NATAL CROSS-VERIFICATION (Janma vs Gochara):
   Transit weather (Gochara) cannot deliver what the Natal Kundli (Janma) does not authorize. You MUST cross-verify active transits against the user's natal chart. If a transit planet appears exalted or favorable in the sky, but is weak, combust, debilitated, or ruling a dusthana in the natal chart, explicitly warn that the apparent favorability is modulated, delayed, or deceptive. Conversely, a challenging transit (e.g. Saturn or Mars) with a strong natal foundation yields friction-hardened executive mastery.
4. MANTRAS IN AUTHENTIC DEVANAGARI SANSKRIT ONLY (देवनागरी संस्कृत):
   Whenever remedial vibrations, Beej mantras, or shlokas are referenced, they MUST be written in authentic DEVANAGARI script (देवनागरी लिपि, e.g. ॐ शं शनैश्चराय नमः॥, ॐ नमो भगवते वासुदेवाय॥, ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः॥, ॐ नमः शिवाय॥). DO NOT provide only romanized transliterations.
5. MATHEMATICAL & CELESTIAL DEGREE NOTATION (KaTeX):
   Format exact celestial degrees, minutes, and aspects using KaTeX math notation (e.g. $13^\\circ05'$, $90^\\circ$ Kendra square, $120^\\circ$ Trikona trine, $\\text{Virupas} \\ge 390$).
   CRITICAL FORMATTING INSTRUCTION FOR LATEX & TIMELINES: NEVER enclose LaTeX math ($...$ or $$...$$) or degree notations inside markdown code blocks (\`\`\` or \`). Always format timing phases, milestones, protocols, and breakdowns as standard Markdown headings, blockquotes, bullet lists, or tables. This ensures KaTeX mathematical symbols render smoothly and dynamically for the user.
6. SHADBALA SCOPE & BASELINES:
   Classical Shadbala is strictly evaluated for the 7 classical physical grahas (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) with classical Virupa baselines (Sun: 390, Moon: 360, Mars: 300, Mercury: 420, Jupiter: 390, Venus: 330, Saturn: 300). Never compute or rank Shadbala for Rahu, Ketu, Uranus, Neptune, or Pluto.
7. MULTI-TURN CONVERSATIONAL CONTINUITY:
   You are engaged in an ongoing, interactive consultation. Retain full context of earlier questions, natal placements, and transit configurations. For follow-up questions, dive straight into the specific mechanism requested without repeating generic introductions.
8. UNHURRIED DEPTH & EXPANSIVE GENERATION:
   You have an expanded token budget (up to 8,192 tokens). Provide exhaustive, highly articulated, multi-phase technical breakdowns. Elaborate on all active Gochara transits, Vimshottari Antardasha/Pratyantardasha transitions, specific calendar milestones, and explicit planetary strength metrics without rushing or cutting explanations short.
9. TONE & STYLE:
   Maintain a sober, authoritative, reference-manual style. State astronomical positions, Dignities, and Parashari values factually. Structure comprehensive analyses into clear sections (Overview, Active Grahas Table, Operational Mandates, Friction Points & Hazards, Timing Windows).`;

    const telemetryContextString = celestialContext
      ? `ACTIVE CELESTIAL TELEMETRY & NATAL BLUEPRINT:\n${JSON.stringify(
          celestialContext,
          null,
          2
        )}`
      : '';

    const geminiContents = buildGeminiContents(messages, prompt);

    // Query Gemini API with fallback models
    const models = [
      'gemini-3.8-flash',
      'gemini-3.7-flash',
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3-flash-preview',
      'gemini-2.5-flash',
    ];

    let responseText = '';
    let usedModel = '';
    let lastError = '';

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // Attempt request with system_instruction
        let res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [
                {
                  text: `${systemInstruction}\n\n${telemetryContextString}`,
                },
              ],
            },
            contents: geminiContents,
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 8192,
            },
          }),
        });

        // If HTTP 400 (e.g. system_instruction schema rejection in certain environments), fallback to prepending into first user message
        if (!res.ok && res.status === 400) {
          const fallbackContents = geminiContents.map((c, i) => {
            if (i === 0 && c.role === 'user') {
              return {
                ...c,
                parts: [
                  {
                    text: `${systemInstruction}\n\n${telemetryContextString}\n\n---\n\n${c.parts[0].text}`,
                  },
                ],
              };
            }
            return c;
          });

          res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: fallbackContents,
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 8192,
              },
            }),
          });
        }

        if (res.ok) {
          const data = await res.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            responseText = candidateText;
            usedModel = model;
            break;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          lastError = errData.error?.message || `HTTP ${res.status}`;
        }
      } catch (err: any) {
        lastError = err.message || 'Network error';
      }
    }

    if (!responseText) {
      return NextResponse.json(
        {
          error: `Gemini API call failed: ${
            lastError ||
            'Unable to connect to Gemini API. Please verify your GEMINI_API_KEY in .env.'
          }`,
        },
        { status: 502 }
      );
    }

    // Extract spotlighted graha keys
    const spotlightMatch = responseText.match(/\[SPOTLIGHT:\s*([^\]]+)\]/i);
    let spotlightKeys: string[] = [];
    if (spotlightMatch && spotlightMatch[1]) {
      spotlightKeys = spotlightMatch[1]
        .split(',')
        .map((p) => p.trim().toLowerCase())
        .filter((k) => VALID_GRAHA_KEYS.has(k));
    }

    return NextResponse.json({
      model: usedModel,
      analysis: responseText,
      spotlightKeys,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/analyze:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error processing AI analysis.',
      },
      { status: 500 }
    );
  }
}
