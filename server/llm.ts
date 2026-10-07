/**
 * server/llm.ts — OpenRouter LLM Engine for Stage 3 Product Studio
 * ----------------------------------------------------------------------------
 * Uses the OpenAI-compatible SDK pointed at OpenRouter to synthesize a rich,
 * expert-grade digital product blueprint. If OPENROUTER_API_KEY is not set,
 * a fully fleshed-out demo blueprint (Sleep & Recovery niche) is returned so
 * the Product Studio remains genuinely useful in sandbox / fallback mode.
 *
 * SECURITY: The API key is read exclusively from process.env.OPENROUTER_API_KEY.
 * It is never hardcoded, logged, or returned to the client.
 */

import OpenAI from 'openai';
import type {
  EnhancedProductBlueprint,
  ProductFormat,
} from '../src/types/index.ts';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const PRIMARY_MODEL = 'anthropic/claude-sonnet-4-5';
const FALLBACK_MODEL = 'anthropic/claude-3-5-sonnet';

export interface GenerateBlueprintParams {
  creatorName?: string;
  creatorHandle?: string;
  niche?: string;
  viralProblem?: string;
  audienceTone?: string;
  audienceSize?: string;
  pricePoint?: number;
  /** Selected primary product format (frontend label or ProductFormat token). */
  productFormat?: string;
  /** Optional additional formats to include. */
  includedFormats?: ProductFormat[];
}

/* ----------------------------------------------------------------------------
 * Format normalization helpers
 * --------------------------------------------------------------------------*/

const FORMAT_LABEL_MAP: Record<string, ProductFormat> = {
  'actionable pdf guide': 'pdf_guide',
  'pdf guide': 'pdf_guide',
  'pdf': 'pdf_guide',
  'full ebook': 'ebook',
  'full digital ebook': 'ebook',
  'ebook': 'ebook',
  'printable checklist': 'checklist',
  'printable checklist & routine': 'checklist',
  'checklist': 'checklist',
  'interactive notion hub': 'notion_template',
  'notion digital hub': 'notion_template',
  'notion template': 'notion_template',
  'notion': 'notion_template',
  'audio walkthrough': 'audio_walkthrough',
  'audio': 'audio_walkthrough',
};

export function normalizeFormat(input?: string): ProductFormat {
  if (!input) return 'pdf_guide';
  const key = input.trim().toLowerCase();
  if (FORMAT_LABEL_MAP[key]) return FORMAT_LABEL_MAP[key];
  // Direct token match
  const tokens: ProductFormat[] = [
    'pdf_guide',
    'ebook',
    'checklist',
    'notion_template',
    'audio_walkthrough',
  ];
  if (tokens.includes(key as ProductFormat)) return key as ProductFormat;
  return 'pdf_guide';
}

/* ----------------------------------------------------------------------------
 * Prompt engineering
 * --------------------------------------------------------------------------*/

const SYSTEM_PROMPT = `You are a senior product architect and expert content synthesizer specializing in high-value digital products for creator economies. You have deep knowledge across health sciences, behavioral psychology, productivity systems, and instructional design. Your task is to synthesize the best evidence-based insights from multiple expert domains into a single comprehensive, actionable digital product that delivers genuine transformation — not surface-level advice.

QUALITY STANDARDS:
- Every recommendation must reflect actual expert consensus, not generic advice
- Content should feel like it was written by a domain expert, not an AI assistant
- Use specific, concrete action steps with measurable outcomes
- Include the "why" behind every recommendation (the mechanism, not just the prescription)
- Write in second person ("you") with a warm, encouraging but evidence-backed tone
- Avoid ALL of these words and phrases: "game-changing", "revolutionary", "unlock", "leverage", "dive deep", "it's important to note", "in today's world"
- Each pillar should synthesize insights from at least 3 different expert perspectives

OUTPUT FORMAT:
- You MUST return ONLY valid JSON. No markdown fences, no commentary before or after.
- The JSON must exactly match the GeneratedProductBlueprint schema described in the user prompt.
- Every pillar's fullContentMarkdown must be 400-600 words of genuinely useful, expert-synthesized content.`;

function buildUserPrompt(p: GenerateBlueprintParams): string {
  const {
    creatorName = 'Partner Creator',
    creatorHandle = '@creator',
    niche = 'Health & Productivity',
    viralProblem = 'Chronic fatigue and poor recovery',
    audienceTone = 'Authoritative yet empathetic and action-oriented',
    audienceSize = 'Micro-creator (10k–100k engaged followers)',
    pricePoint = 27,
    productFormat = 'pdf_guide',
    includedFormats = [],
  } = p;

  const primaryFormat = normalizeFormat(productFormat);
  const allFormats = Array.from(
    new Set<ProductFormat>([primaryFormat, ...includedFormats.map(normalizeFormat)])
  );

  return `Create a complete, expert-grade digital product blueprint for the following creator and audience.

CREATOR & DEMAND SIGNAL:
- Creator: ${creatorName} (${creatorHandle})
- Niche: ${niche}
- Acute problem (from audience demand signals): "${viralProblem}"
- Creator voice / audience tone: ${audienceTone}
- Audience size & engagement: ${audienceSize}
- Selected primary format: ${primaryFormat}
- All included formats: ${allFormats.join(', ')}
- Target price: $${pricePoint}

Return STRICTLY valid JSON matching this exact schema (no extra keys, no missing keys):

{
  "productTitle": "string — authoritative 3-6 word title",
  "productSubtitle": "string — one clear value promise",
  "tagline": "string — punchy marketing tagline",
  "targetAudience": "string — who this is for",
  "coreProblemSolved": "string — the transformation delivered",
  "primaryFormat": "${primaryFormat}",
  "includedFormats": ${JSON.stringify(allFormats)},
  "price": ${pricePoint},
  "coverDesign": {
    "headline": "string",
    "subheadline": "string",
    "accentColor": "#RRGGBB hex",
    "styleKeywords": ["3-5 style words"],
    "coverImagePrompt": "string — detailed prompt for AI cover image"
  },
  "pillars": [
    {
      "pillarNumber": 1,
      "title": "string",
      "objective": "string — one sentence outcome",
      "keyActionItem": "string — single most important action",
      "fullContentMarkdown": "string — 400-600 words of expert content in markdown",
      "illustrationPrompt": "string — prompt for a section illustration",
      "resources": [
        { "title": "string", "url": "https://...", "description": "string" }
      ]
    }
    // EXACTLY 4 pillars
  ],
  "printableChecklist": {
    "title": "string",
    "subtitle": "string",
    "sections": [
      {
        "sectionTitle": "string",
        "items": [
          { "text": "string", "fillableField": "My target: ___", "isRequired": true }
        ]
      }
    ]
  },
  "orderBump": {
    "title": "string",
    "description": "string",
    "price": 17,
    "format": "one of ${allFormats.join('|')}",
    "valueProposition": "string"
  },
  "expertSources": [
    {
      "domain": "string — e.g. Sleep Science",
      "credentialTypes": ["MD", "PhD"],
      "keyInsightSynthesized": "string"
    }
    // 3-4 sources
  ]
}

Requirements:
- EXACTLY 4 pillars, each with 400-600 words of genuinely expert content in fullContentMarkdown.
- The checklist must have 2-4 sections with 4-6 items each.
- Provide 3-4 expertSources spanning distinct domains.
- accentColor should thematically match the niche (e.g. deep indigo for sleep, forest green for nutrition).
- Return ONLY the JSON object.`;
}

/* ----------------------------------------------------------------------------
 * Main generator
 * --------------------------------------------------------------------------*/

export async function generateProductBlueprint(
  params: GenerateBlueprintParams
): Promise<EnhancedProductBlueprint> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  // Sandbox / fallback mode — no key configured.
  if (!apiKey) {
    return buildDemoBlueprint(params);
  }

  const client = new OpenAI({
    apiKey,
    baseURL: OPENROUTER_BASE_URL,
    defaultHeaders: {
      // OpenRouter attribution headers (optional but recommended).
      'HTTP-Referer': process.env.APP_URL || 'https://sidemate.ai.studio',
      'X-Title': 'SideMate Product Studio',
    },
  });

  const userPrompt = buildUserPrompt(params);
  const modelsToTry = [PRIMARY_MODEL, FALLBACK_MODEL];
  let lastError: unknown = null;

  for (const model of modelsToTry) {
    try {
      const completion = await client.chat.completions.create({
        model,
        temperature: 0.7,
        max_tokens: 8000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      });

      const raw = completion.choices?.[0]?.message?.content;
      if (!raw) throw new Error('Empty completion from model');

      const parsed = JSON.parse(stripJsonFences(raw));
      return finalizeBlueprint(parsed, params, model);
    } catch (err) {
      lastError = err;
      // Try next model in cascade.
      continue;
    }
  }

  // If all models fail, fall back to the rich demo blueprint rather than erroring.
  console.warn(
    '[llm] OpenRouter generation failed, returning demo blueprint:',
    lastError instanceof Error ? lastError.message : String(lastError)
  );
  return buildDemoBlueprint(params);
}

function stripJsonFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

/**
 * Ensures a model-produced object conforms to EnhancedProductBlueprint with
 * defensive fallbacks for any missing fields.
 */
function finalizeBlueprint(
  parsed: Partial<EnhancedProductBlueprint>,
  params: GenerateBlueprintParams,
  model: string
): EnhancedProductBlueprint {
  const demo = buildDemoBlueprint(params);
  const primaryFormat = normalizeFormat(params.productFormat);

  const pillars =
    Array.isArray(parsed.pillars) && parsed.pillars.length > 0
      ? parsed.pillars.map((pl, idx) => ({
          pillarNumber: pl.pillarNumber || idx + 1,
          title: pl.title || demo.pillars[idx]?.title || `Pillar ${idx + 1}`,
          objective: pl.objective || 'Deliver a concrete, measurable outcome',
          keyActionItem: pl.keyActionItem || 'Complete the core action for this pillar',
          fullContentMarkdown: pl.fullContentMarkdown || demo.pillars[idx]?.fullContentMarkdown || '',
          illustrationPrompt: pl.illustrationPrompt || demo.pillars[idx]?.illustrationPrompt,
          resources: Array.isArray(pl.resources) ? pl.resources : demo.pillars[idx]?.resources,
        }))
      : demo.pillars;

  return {
    productTitle: parsed.productTitle || demo.productTitle,
    productSubtitle: parsed.productSubtitle || demo.productSubtitle,
    tagline: parsed.tagline || demo.tagline,
    targetAudience: parsed.targetAudience || demo.targetAudience,
    coreProblemSolved: parsed.coreProblemSolved || demo.coreProblemSolved,
    primaryFormat: (parsed.primaryFormat as ProductFormat) || primaryFormat,
    includedFormats:
      Array.isArray(parsed.includedFormats) && parsed.includedFormats.length > 0
        ? parsed.includedFormats
        : demo.includedFormats,
    price: typeof parsed.price === 'number' ? parsed.price : demo.price,
    coverDesign: parsed.coverDesign || demo.coverDesign,
    pillars,
    printableChecklist: parsed.printableChecklist || demo.printableChecklist,
    notionTemplate: parsed.notionTemplate || demo.notionTemplate,
    audioWalkthrough: parsed.audioWalkthrough || demo.audioWalkthrough,
    orderBump: parsed.orderBump || demo.orderBump,
    expertSources:
      Array.isArray(parsed.expertSources) && parsed.expertSources.length > 0
        ? parsed.expertSources
        : demo.expertSources,
    creatorAttribution: params.creatorName || demo.creatorAttribution,
    engineUsed: `OpenRouter · ${model}`,
    curatedModules: pillars,
  };
}

/* ----------------------------------------------------------------------------
 * Rich demo blueprint (Sleep & Recovery) — the sandbox experience.
 * This is intentionally thorough: 4 fully-written pillars, complete checklist,
 * order bump, expert sources, notion template, and audio walkthrough.
 * --------------------------------------------------------------------------*/

export function buildDemoBlueprint(
  params: GenerateBlueprintParams = {}
): EnhancedProductBlueprint {
  const creatorName = params.creatorName || 'Dr. Elena Miller, MD';
  const price = params.pricePoint || 27;
  const primaryFormat = normalizeFormat(params.productFormat || 'pdf_guide');
  const includedFormats = Array.from(
    new Set<ProductFormat>([
      primaryFormat,
      'checklist',
      ...(params.includedFormats || []),
    ])
  );

  return {
    productTitle: 'The Deep Sleep Reset',
    productSubtitle:
      'A 14-Day Evidence-Based System to Fall Asleep Faster, Stay Asleep, and Wake Up Recovered',
    tagline: 'Stop fighting your biology. Start working with it.',
    targetAudience:
      'Busy adults who lie awake at night, wake repeatedly, or drag through their days despite "sleeping" 7–8 hours — and who are tired of generic advice like "just avoid screens."',
    coreProblemSolved:
      'Persistent difficulty falling and staying asleep, and the daytime fatigue, brain fog, and mood swings that follow from fragmented, low-quality sleep.',
    primaryFormat,
    includedFormats,
    price,
    coverDesign: {
      headline: 'The Deep Sleep Reset',
      subheadline: '14 Days to the Recovered, Clear-Headed Mornings You Forgot Were Possible',
      accentColor: '#4F46E5',
      styleKeywords: ['clean', 'calming', 'scientific', 'premium', 'nocturnal'],
      coverImagePrompt:
        'A serene, minimalist book cover: a softly glowing moon over gentle indigo gradient waves suggesting brainwaves, subtle constellation dots, premium matte texture, calming and trustworthy, no text, editorial health-brand aesthetic',
    },
    pillars: [
      {
        pillarNumber: 1,
        title: 'Diagnose Your Sleep — The Root-Cause Audit',
        objective:
          'Pinpoint the specific biological and behavioral drivers keeping you awake so you stop guessing and start fixing the right thing.',
        keyActionItem:
          'Complete the 3-night Sleep Baseline Log (bedtime, latency, wake-ups, wake time, and a 1–10 morning recovery score).',
        fullContentMarkdown: `Most people treating their sleep problems are treating the wrong problem. You cut caffeine, you buy the expensive mattress, you put your phone away — and still you lie there. That's because insomnia and non-restorative sleep are rarely one problem. They're usually a stack of three or four small mismatches between your behavior and your biology, and until you identify *which* ones apply to you, generic advice is a lottery.

This pillar is your diagnostic. Sleep researchers describe healthy sleep across four measurable dimensions, and you'll score yourself on each: **latency** (how long it takes to fall asleep — under 20 minutes is healthy), **efficiency** (time asleep divided by time in bed — you want above 85%), **continuity** (number and length of night wakings), and **timing** (whether your sleep window matches your internal clock, or *chronotype*).

Start with the 3-night Baseline Log included on the next page. For three consecutive nights, record the time you got into bed, your best estimate of how long it took to fall asleep, how many times you woke, your final wake time, and a morning recovery score from 1 to 10. Do not try to change anything yet — you are gathering evidence, not performing.

Here's why this matters mechanistically. Two systems govern sleep. The first is your **circadian rhythm**, a roughly 24-hour clock in your brain's suprachiasmatic nucleus that is set primarily by light. The second is **sleep pressure**, driven by a molecule called adenosine that accumulates the longer you're awake. Good sleep happens when high sleep pressure meets an open circadian window. When you nap at 5pm, you dump sleep pressure. When you sleep in until 10am on weekends, you shift your clock. When you scroll in bright light at 11pm, you delay the melatonin release that signals night. Each of these is a *different* fix.

As you review your log, map your results against the four common patterns: (1) **Onset difficulty** — long latency, usually a racing mind or a delayed clock; (2) **Maintenance difficulty** — frequent wakings, often tied to alcohol, temperature, or blood-sugar dips; (3) **Early waking** — you're up at 4am and can't return, frequently an advanced clock or elevated cortisol; and (4) **Non-restorative sleep** — normal duration but you wake unrefreshed, commonly a sign of fragmented deep sleep from noise, warmth, or undiagnosed breathing issues.

Circle the pattern that fits you best. If two fit, note both. This single act of naming your pattern is what makes the rest of this system work: the protocols in Pillar 2 are tagged to these exact patterns, so you'll apply the interventions proven to move *your* numbers — not someone else's. If your log reveals loud snoring, gasping, or witnessed pauses in breathing, flag it now: that warrants a conversation with a physician about a sleep study, because no behavioral protocol substitutes for treating sleep apnea.`,
        illustrationPrompt:
          'A clean infographic-style illustration of a person sleeping with four labeled quadrants floating above representing latency, efficiency, continuity, and timing, calm indigo palette',
        resources: [
          {
            title: 'Consensus Sleep Diary (National Sleep Foundation)',
            url: 'https://www.thensf.org/sleep-diary/',
            description: 'A validated, printable sleep diary format used in clinical research.',
          },
          {
            title: 'AASM — When to See a Sleep Specialist',
            url: 'https://sleepeducation.org/',
            description: 'Guidance on red-flag symptoms like apnea that need medical evaluation.',
          },
        ],
      },
      {
        pillarNumber: 2,
        title: 'The Core Protocol — Your Nightly Wind-Down Engine',
        objective:
          'Install a repeatable pre-sleep and in-bed routine that shortens the time to fall asleep and reduces night wakings within the first week.',
        keyActionItem:
          'Set a fixed wake time and build the 60-minute "power-down runway" tonight.',
        fullContentMarkdown: `If Pillar 1 was the diagnosis, this is the treatment — and it starts with the single most powerful lever in all of sleep science: a **fixed wake time, seven days a week**. Not bedtime. Wake time. Your circadian clock anchors to when you get up and see light, not when you close your eyes. Pick a wake time you can honor even on weekends (a 30–60 minute weekend drift is the maximum before you re-scramble your clock), and hold it for the full 14 days. Within days, your body begins releasing melatonin at a consistent hour, and falling asleep stops being a negotiation.

Next, build your **60-minute power-down runway**. Sleep is a descent, not a switch, and the biggest mistake people make is going from full stimulation to lights-out in ninety seconds. Divide the hour into three 20-minute blocks. In the first block, finish anything that requires decisions or screens — this is your hard stop for work and doom-scrolling. In the second, dim the lights to under 50% and do something low-stakes and analog: dishes, a shower, laying out tomorrow's clothes, light stretching. Warm showers help through a clever mechanism — the subsequent drop in skin temperature mimics the body's natural pre-sleep cooling and accelerates sleep onset. In the third block, get into bed and do something deliberately boring or calming: paper book, breathing, a body scan.

For **onset difficulty** (your Pillar 1 pattern), add paced breathing: inhale for 4 counts, exhale for 6. The extended exhale activates your parasympathetic nervous system and measurably lowers heart rate. If your mind races, keep a notepad by the bed and do a 5-minute "brain dump" of tomorrow's worries before you lie down — externalizing the list stops the mental rehearsal loop.

For **maintenance difficulty**, address the three most common wake-up triggers. Alcohol fragments the second half of the night even when it helps you fall asleep, so cap intake and stop at least three hours before bed. Keep the room cool — 65–68°F (18–20°C) is the researched sweet spot, because core temperature must fall for deep sleep to consolidate. And avoid going to bed either hungry or overly full; a small protein-and-fat snack can prevent the blood-sugar dip that spikes cortisol at 3am.

The hardest but most important rule is the **quarter-hour rule**: if you're awake for more than about 20 minutes — falling asleep *or* mid-night — get out of bed. Go somewhere dim, do something calm, and return only when sleepy. This feels counterproductive, but it's the core of the most effective insomnia treatment (CBT-I). Lying in bed frustrated teaches your brain that bed is a place of anxious wakefulness. Getting up protects the mental association between your bed and sleep. Within a week or two, that association re-forms and the wakings shorten on their own.

Run this protocol every night for 14 days. Consistency, not perfection, is what retrains the system.`,
        illustrationPrompt:
          'A three-stage timeline illustration of an evening wind-down routine over 60 minutes, warm-to-cool color transition from lamp light to deep night, minimalist icons',
        resources: [
          {
            title: 'CBT-I Overview (Sleep Foundation)',
            url: 'https://www.sleepfoundation.org/insomnia/treatment/cognitive-behavioral-therapy-insomnia',
            description: 'Explains the stimulus-control and quarter-hour techniques used here.',
          },
          {
            title: 'Light, Temperature & the Circadian Clock',
            url: 'https://www.cdc.gov/niosh/emres/longhourstraining/clock.html',
            description: 'Primer on how light and temperature set your internal clock.',
          },
        ],
      },
      {
        pillarNumber: 3,
        title: 'Daytime Levers — What You Do at Noon Decides How You Sleep',
        objective:
          'Use light, movement, caffeine, and meal timing during the day to build the sleep pressure and clock stability that make nights effortless.',
        keyActionItem:
          'Get 10 minutes of outdoor light within 30 minutes of waking, and set a caffeine cutoff 8–10 hours before bed.',
        fullContentMarkdown: `Great sleep is built during the day, not just at night. Three daytime inputs — light, caffeine, and movement — do more to determine your night than almost anything you do after sunset, and most people get all three slightly wrong.

Start with **morning light**. Within 30 minutes of waking, get outside for 10 minutes (or 20 on an overcast day). Outdoor light, even under clouds, is many times brighter than indoor lighting, and this early signal is what firmly anchors your circadian clock and sets a timer for melatonin release roughly 14–16 hours later. This is the mechanism that quietly fixes both trouble falling asleep and early-morning waking. If you're up before sunrise, use bright indoor light or a 10,000-lux light box, then get real sunlight once it's available. Pair this with your fixed wake time from Pillar 2 and you've built the two strongest anchors in the entire system.

Next, **caffeine timing** — the lever people most underestimate. Caffeine has a half-life of roughly five to six hours, meaning a 2pm coffee still has a quarter of its dose circulating at midnight, silently blocking the adenosine receptors that create the feeling of sleepiness. You may fall asleep anyway, but caffeine measurably reduces deep, restorative sleep even when it doesn't delay onset. Set a hard cutoff 8–10 hours before your target bedtime. If you sleep at 11pm, your last caffeine is around 1–3pm. Most people who make only this one change report deeper, more continuous sleep within days.

**Movement** is the third lever, and it works two ways. Physical activity increases the depth and quantity of slow-wave (deep) sleep, the stage most responsible for physical recovery and feeling refreshed. Aim for at least 20–30 minutes of movement daily — even brisk walking counts. Timing matters at the edges: vigorous exercise in the last hour before bed can raise core temperature and adrenaline enough to delay sleep for some people, so keep intense training earlier and reserve gentle stretching or a walk for the evening.

Two more daytime factors deserve attention. **Napping**: if you nap, keep it under 20 minutes and before 3pm, because longer or later naps discharge the sleep pressure you need for the night. If you have onset or maintenance difficulty, cut naps entirely for the 14 days. **Meal timing**: finishing large meals at least three hours before bed lets digestion settle and prevents reflux and blood-sugar swings from fragmenting your night.

Think of your day as charging a battery. Morning light sets the clock, staying awake and active all day builds sleep pressure, and cutting caffeine early keeps that pressure from leaking away. Do these consistently and by nightfall your body is genuinely ready for sleep — instead of wired, under-tired, and confused about what time it is. These levers cost nothing, take minutes, and compound: the effect on night three is bigger than night one, and by day fourteen they run on autopilot.`,
        illustrationPrompt:
          'A daytime-to-night infographic showing a sun path with icons for morning light, a coffee cup with a cutoff clock, and a walking figure, warm daylight palette transitioning to indigo',
        resources: [
          {
            title: 'Caffeine and Sleep (Sleep Foundation)',
            url: 'https://www.sleepfoundation.org/nutrition/caffeine-and-sleep',
            description: 'Evidence on caffeine half-life and its effect on sleep architecture.',
          },
          {
            title: 'Exercise and Sleep Quality',
            url: 'https://www.sleepfoundation.org/physical-activity/exercise-and-sleep',
            description: 'How and when to move for deeper slow-wave sleep.',
          },
        ],
      },
      {
        pillarNumber: 4,
        title: 'Troubleshooting, Travel & Making It Permanent',
        objective:
          'Handle the real-world disruptions — bad nights, travel, shift work, and setbacks — so a single rough night never spirals back into chronic insomnia.',
        keyActionItem:
          'Learn the "one bad night" reset rule and pre-commit to your non-negotiable two anchors.',
        fullContentMarkdown: `By now you have a working system. This final pillar makes it durable, because the difference between people who fix their sleep for two weeks and people who fix it for good is how they handle disruption. Life will hand you a red-eye flight, a sick child, a stressful deadline, and a glass of wine too many. The goal isn't to avoid every bad night — it's to keep one bad night from becoming ten.

**The one-bad-night reset rule.** After a poor night, your instinct is to compensate: sleep in, nap hard, go to bed at 8pm, mainline coffee. Every one of these makes the *next* night worse by scrambling your clock and dumping sleep pressure. Instead, do the opposite — hold your fixed wake time no matter what, get your morning light, and resist the long nap. You'll be tired that day, but that accumulated sleep pressure means you'll fall asleep faster and deeper the following night. One bad night, handled correctly, self-corrects in 24 hours. The panic response is what turns it chronic.

**Travel and jet lag.** Before you fly, shift your schedule 30–60 minutes per day toward your destination's time zone. On arrival, adopt local meal and light timing immediately — eat when locals eat, and get outdoor light in the morning at your destination (or avoid it in the evening if you're flying west to east). Use light strategically: morning light advances your clock, evening light delays it. For short trips of one to two days, it can be better to stay on home time than to fully adjust.

**Shift work.** If you work nights, your two anchors still apply, just inverted: protect a consistent sleep window, and control light — wear sunglasses on the commute home so morning light doesn't wake your clock, and make your sleep room as dark and cool as possible. Blackout curtains and a white-noise machine become non-negotiable, not luxuries.

**When to seek help.** If you've run this protocol faithfully for the full 14 days and your latency, wakings, or morning recovery score haven't improved, that's useful information, not failure. Persistent insomnia despite good behavior, or any signs of sleep apnea (loud snoring, gasping, witnessed breathing pauses, morning headaches), warrant a professional evaluation. Behavioral tools are powerful, but they don't treat an underlying medical condition — and a proper diagnosis is itself a relief.

**Making it permanent.** You don't need to run all fourteen protocols forever. Identify your **two non-negotiable anchors** — for almost everyone that's the fixed wake time and morning light — and protect those unconditionally. Everything else becomes a dial you turn up when sleep slips and relax when it's solid. Keep the checklist somewhere visible for the first month, then trust the habits. Sleep is not a nightly performance you have to win; it's a system you set up once and maintain lightly. You now have that system — the same evidence-based framework used in clinical sleep programs, translated into steps you can actually run. Your job from here is simple: protect the anchors, respect the levers, and let your biology do what it already knows how to do.`,
        illustrationPrompt:
          'A calm illustration of an airplane, a moon, and a checklist icon connected by a dotted line, suggesting resilience and routine, indigo and soft teal palette',
        resources: [
          {
            title: 'Jet Lag Management (Sleep Foundation)',
            url: 'https://www.sleepfoundation.org/travel-and-sleep/jet-lag',
            description: 'Light and schedule strategies for crossing time zones.',
          },
          {
            title: 'Shift Work and Sleep',
            url: 'https://www.cdc.gov/niosh/work-hour-training-for-nurses/longhours/mod7/09.html',
            description: 'Practical protection strategies for non-standard schedules.',
          },
        ],
      },
    ],
    printableChecklist: {
      title: 'The Deep Sleep Daily Checklist',
      subtitle: 'Print it. Keep it by your bed. Check the boxes for 14 days straight.',
      sections: [
        {
          sectionTitle: 'Morning Anchors',
          items: [
            { text: 'Woke at my fixed wake time', fillableField: 'My wake time: ____', isRequired: true },
            { text: 'Got 10 minutes of outdoor light within 30 min of waking', isRequired: true },
            { text: 'Moved my body for at least 20 minutes today', isRequired: false },
            { text: 'Logged last night\u2019s recovery score (1\u201310)', fillableField: 'Score: ____', isRequired: true },
          ],
        },
        {
          sectionTitle: 'Daytime Levers',
          items: [
            { text: 'Had my last caffeine before the cutoff', fillableField: 'My cutoff: ____', isRequired: true },
            { text: 'No nap after 3pm (or no nap at all this cycle)', isRequired: false },
            { text: 'Finished my last big meal 3+ hours before bed', isRequired: true },
            { text: 'Kept alcohol capped and stopped 3+ hours before bed', isRequired: false },
          ],
        },
        {
          sectionTitle: 'The Wind-Down Runway',
          items: [
            { text: 'Hard stop on screens/work 60 min before bed', isRequired: true },
            { text: 'Dimmed lights below 50% for the last hour', isRequired: true },
            { text: 'Set bedroom temperature to 65\u201368\u00b0F (18\u201320\u00b0C)', isRequired: true },
            { text: 'Did 5 minutes of paced breathing or a brain-dump', isRequired: false },
            { text: 'Applied the quarter-hour rule if awake >20 min', isRequired: true },
          ],
        },
      ],
    },
    notionTemplate: {
      title: 'The Deep Sleep Reset — Notion Command Center',
      description:
        'A ready-to-duplicate Notion workspace to run and track your 14-day reset, log nightly data, and visualize your recovery trend.',
      databases: [
        {
          name: 'Nightly Sleep Log',
          properties: [
            { name: 'Date', type: 'date', description: 'The night being logged' },
            { name: 'Bedtime', type: 'text', description: 'Time you got into bed' },
            { name: 'Latency (min)', type: 'number', description: 'Estimated minutes to fall asleep' },
            { name: 'Night Wakings', type: 'number', description: 'Number of times you woke' },
            { name: 'Wake Time', type: 'text', description: 'Your fixed wake time' },
            { name: 'Recovery Score', type: 'number', description: 'Morning refreshed rating 1\u201310' },
            { name: 'Pattern Tag', type: 'select', description: 'Onset / Maintenance / Early / Non-restorative' },
          ],
        },
        {
          name: 'Habit Tracker',
          properties: [
            { name: 'Date', type: 'date', description: 'Day of the reset' },
            { name: 'Morning Light', type: 'checkbox', description: 'Got outdoor light on time' },
            { name: 'Caffeine Cutoff', type: 'checkbox', description: 'Stayed under the cutoff' },
            { name: 'Wind-Down', type: 'checkbox', description: 'Completed the 60-min runway' },
            { name: 'Fixed Wake', type: 'checkbox', description: 'Held the fixed wake time' },
          ],
        },
      ],
      pages: [
        {
          title: 'Start Here — Your 14-Day Plan',
          content:
            'An overview page linking the diagnostic, the daily checklist, and both databases, with a checklist for setting your two non-negotiable anchors.',
          icon: '\ud83c\udf19',
        },
        {
          title: 'My Root-Cause Diagnosis',
          content:
            'A template page to record your Pillar 1 pattern and the specific protocols you\u2019ll prioritize.',
          icon: '\ud83d\udd0d',
        },
      ],
    },
    audioWalkthrough: {
      title: 'The Deep Sleep Reset — Guided Audio Companion',
      totalDurationMinutes: 42,
      tracks: [
        {
          trackNumber: 1,
          title: 'Welcome & How to Use This System',
          durationMinutes: 6,
          script:
            'Welcome. If you\u2019re listening to this, you\u2019re probably tired \u2014 not just physically, but tired of trying things that don\u2019t work. Over the next 14 days we\u2019re going to change that, and we\u2019re going to do it with your biology instead of against it. Here\u2019s how to use what you have in front of you...',
          keyPoints: [
            'Why generic sleep advice fails',
            'The two systems: circadian rhythm and sleep pressure',
            'How to run the 14-day plan',
          ],
        },
        {
          trackNumber: 2,
          title: 'The 10-Minute Wind-Down (Play This in Bed)',
          durationMinutes: 12,
          script:
            'Let\u2019s begin to slow everything down. Settle into a comfortable position and let your weight sink into the mattress. We\u2019ll start with a breath: in through the nose for four counts, and out slowly for six...',
          keyPoints: [
            'Paced 4-6 breathing',
            'Progressive body scan',
            'Letting go of the day',
          ],
        },
        {
          trackNumber: 3,
          title: 'When You Wake at 3AM — The Reset',
          durationMinutes: 10,
          script:
            'It\u2019s the middle of the night and you\u2019re awake. First, don\u2019t panic \u2014 waking briefly is normal. If it\u2019s been more than twenty minutes, we\u2019re going to get up together and reset, gently...',
          keyPoints: [
            'The quarter-hour rule in practice',
            'Calming a racing mind',
            'Returning to bed only when sleepy',
          ],
        },
        {
          trackNumber: 4,
          title: 'Morning Momentum — Starting the Day Right',
          durationMinutes: 14,
          script:
            'Good morning. However last night went, this is the moment that sets up tonight. Let\u2019s get your clock anchored with light and movement...',
          keyPoints: [
            'The morning light habit',
            'Holding your fixed wake time after a bad night',
            'Building sleep pressure through the day',
          ],
        },
      ],
    },
    orderBump: {
      title: 'The Deep Sleep Audio Companion + Notion Command Center',
      description:
        'The complete 4-track guided audio system (play the wind-down right in bed) plus the duplicate-ready Notion workspace to track your 14-day reset and see your recovery trend climb.',
      price: 17,
      format: 'audio_walkthrough',
      valueProposition:
        'The guide teaches the system; the audio and tracker make you actually run it. Buyers who add this finish the 14 days at far higher rates \u2014 and finishing is what changes your sleep.',
    },
    expertSources: [
      {
        domain: 'Sleep Medicine',
        credentialTypes: ['MD', 'Board-Certified Sleep Specialist'],
        keyInsightSynthesized:
          'Fixed wake time and stimulus control (the quarter-hour rule) are the highest-yield behavioral interventions in clinical insomnia treatment (CBT-I).',
      },
      {
        domain: 'Circadian Neuroscience',
        credentialTypes: ['PhD'],
        keyInsightSynthesized:
          'Morning outdoor light anchors the circadian clock and times evening melatonin release, addressing both onset and early-waking patterns.',
      },
      {
        domain: 'Behavioral Psychology',
        credentialTypes: ['PhD', 'Licensed Clinical Psychologist'],
        keyInsightSynthesized:
          'Externalizing worries (the pre-bed brain-dump) and protecting the bed\u2013sleep association reduce the conditioned arousal that maintains chronic insomnia.',
      },
      {
        domain: 'Exercise Physiology',
        credentialTypes: ['PhD', 'Certified Practitioner'],
        keyInsightSynthesized:
          'Daily movement increases slow-wave sleep depth, while late vigorous exercise and elevated core temperature can delay onset in sensitive individuals.',
      },
    ],
    creatorAttribution: creatorName,
    engineUsed: 'SideMate Demo Engine (Sleep & Recovery)',
    curatedModules: undefined,
  };
}
