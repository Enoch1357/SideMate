import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  ExternalLink, 
  Layers, 
  RefreshCw, 
  Copy, 
  Check, 
  ShoppingBag, 
  Download, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Eye, 
  BookOpen, 
  Sliders, 
  Wallet,
  FileCheck,
  AlertCircle,
  Key
} from 'lucide-react';
import { PRESET_CREATORS } from '../data/techStackData';
import { CreatorPreset, GeneratedProductBlueprint, WhopSaleEvent } from '../types';

interface LivePrototypeViewProps {
  onOpenIntegrations?: () => void;
}

export const LivePrototypeView: React.FC<LivePrototypeViewProps> = ({ onOpenIntegrations }) => {
  // Creator Input State
  const [selectedCreator, setSelectedCreator] = useState<CreatorPreset>(PRESET_CREATORS[0]);
  const [isCustomCreator, setIsCustomCreator] = useState<boolean>(false);
  const [customHandle, setCustomHandle] = useState<string>('@alex_mobility');
  const [customName, setCustomName] = useState<string>('Alex Rivera');
  const [customNiche, setCustomNiche] = useState<string>('Desk Worker Posture & Mobility');
  const [customProblem, setCustomProblem] = useState<string>('Severe lower back stiffness after 6 hours sitting at desk');
  const [customTone, setCustomTone] = useState<string>('Clear, empathetic, biomechanics-backed, quick routines');

  // Whop Pricing & Split State
  const [basePrice, setBasePrice] = useState<number>(27);
  const [includeOrderBump, setIncludeOrderBump] = useState<boolean>(true);
  const [orderBumpPrice] = useState<number>(17);
  const [operatorSplitPct, setOperatorSplitPct] = useState<number>(50);

  // Prototype Pipeline State
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [blueprint, setBlueprint] = useState<GeneratedProductBlueprint | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTabSub, setActiveTabSub] = useState<'blueprint' | 'whophub' | 'checkout' | 'sales'>('blueprint');

  // Sales Stream State
  const [salesLedger, setSalesLedger] = useState<WhopSaleEvent[]>([]);
  const [isSimulatingSale, setIsSimulatingSale] = useState<boolean>(false);
  const [totalGross, setTotalGross] = useState<number>(0);
  const [totalCreatorPayout, setTotalCreatorPayout] = useState<number>(0);
  const [totalOperatorPayout, setTotalOperatorPayout] = useState<number>(0);

  // Active creator details
  const activeName = isCustomCreator ? customName : selectedCreator.name;
  const activeHandle = isCustomCreator ? customHandle : selectedCreator.handle;
  const activeNiche = isCustomCreator ? customNiche : selectedCreator.niche;
  const activeProblem = isCustomCreator ? customProblem : selectedCreator.viralProblem;

  // Run initial synthesis on mount
  useEffect(() => {
    runSynthesis();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Trigger server-side AI synthesis via /api/synthesize
  const runSynthesis = async () => {
    setIsSynthesizing(true);
    try {
      const res = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorHandle: activeHandle,
          creatorName: activeName,
          niche: activeNiche,
          viralProblem: activeProblem,
          audienceTone: isCustomCreator ? customTone : selectedCreator.creatorAudienceTone,
          pricePoint: basePrice,
          productFormat: 'E-Book Protocol & Whop Digital Hub',
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: GeneratedProductBlueprint = await res.json();
      setBlueprint(data);
    } catch (err: any) {
      console.warn('Synthesis API notice, using resilient fallback blueprint:', err.message);
      // Resilient client-side fallback to prevent blank state
      const cleanHandle = activeHandle.replace('@', '');
      const whopSlug = `whop-${cleanHandle.toLowerCase()}-${Date.now().toString().slice(-4)}`;
      const cleanNiche = activeNiche.split('&')[0].trim();

      setBlueprint({
        productTitle: `The ${cleanNiche} Reset Protocol`,
        subtitle: `A 14-Day Actionable System to eliminate ${activeProblem.toLowerCase()} by ${activeName}`,
        productType: 'E-Book Protocol & Whop Digital Hub',
        targetAudience: `Active followers of ${activeHandle} seeking immediate relief from ${activeProblem}`,
        viralProblemSolved: activeProblem,
        suggestedPricePoint: basePrice,
        orderBumpTitle: 'Audio Walkthrough & Notion Operating Dashboard',
        orderBumpPrice: 17,
        valueProposition: `Built specifically around ${activeName}'s most effective frameworks. Eliminates overthinking by condensing weeks of confusing research into a daily 15-minute checklist.`,
        curatedModules: [
          {
            moduleNumber: 1,
            title: 'Module 1: Diagnosis & Root Cause Analysis',
            deliverables: [
              'Deconstruction of why previous attempts failed',
              'Identifying biological and behavioral triggers',
              'The 3 friction points specific to this audience',
            ],
            summary: 'Deconstructs the root issues causing this problem and removes guilt by explaining the underlying physiological/structural mechanisms.',
            fullContentMarkdown: `### Module 1: Understanding the Root Cause\n\nMost advice tells you to try harder. In reality, the breakdown happens in the first 30 minutes of the morning. When followers ask ${activeHandle} why they feel stuck, the answer is rarely lack of willpower.\n\nIn this module, we audit your baseline habits and eliminate the 3 hidden stressors sabotaging your progress before you even start the day.`,
          },
          {
            moduleNumber: 2,
            title: 'Module 2: The Core 14-Day Step-by-Step Protocol',
            deliverables: [
              'Phased morning and evening sequence',
              'Zero-decision fatigue daily checklists',
              'Target adjustments for high-stress days',
            ],
            summary: 'The primary solution engine. A phased 14-day daily plan with morning and evening protocols designed for immediate compliance.',
            fullContentMarkdown: `### Module 2: The 14-Day Tactical Execution Plan\n\n- **Phase 1 (Days 1–3): Reset.** Strip away non-essential variables.\n- **Phase 2 (Days 4–9): Stabilization.** Lock in the 3 core non-negotiables.\n- **Phase 3 (Days 10–14): Optimization.** Transition from active protocol into an automated, effortless background habit.`,
          },
          {
            moduleNumber: 3,
            title: 'Module 3: 1-Page Printable Action Checklist',
            deliverables: [
              'Refrigerator / Desk printable checklist',
              'Lock-screen mobile wallpaper checklist',
              '5-minute emergency reset routine',
            ],
            summary: 'The highest utility asset for impulse buyers: a single-sheet daily habit tracker to eliminate decision fatigue.',
            fullContentMarkdown: `### Module 3: 1-Page Daily Tracker\n\nKeep this sheet on your refrigerator or lockscreen. Check off the 3 non-negotiables before 10:00 AM. If you stumble, follow the 2-minute recovery drill.`,
          },
          {
            moduleNumber: 4,
            title: 'Module 4: Top 15 Emergency FAQs & Edge Cases',
            deliverables: [
              'Direct answers to top 15 comment objections',
              'Travel & dining-out adjustments',
              'Long-term maintenance guide',
            ],
            summary: 'Answers to the top 15 most frequent follower questions scraped directly from comment threads to prevent refunds and drive word-of-mouth.',
            fullContentMarkdown: `### Module 4: Resolving Real-World Edge Cases\n\n- *What if I work night shifts or travel?* Implement the Time-Shift Buffer Protocol on page 19.\n- *How quickly should I expect noticeable results?* Most report significant improvement within 72 hours of Day 3.\n- *Can I combine this with existing routines?* Yes, this protocol acts as an overlay.`,
          },
        ],
        printableChecklist: [
          'Audit current baseline using the 3-minute diagnostic score',
          'Complete morning non-negotiable sequence (under 12 minutes)',
          'Mid-day hydration & cognitive reset check',
          'Evening wind-down routine eliminating blue light and stimulants',
          'Log daily score in the 1-Page Action Tracker',
        ],
        faqItems: [
          {
            question: `How does this differ from ${activeName}'s free social videos?`,
            answer: 'Social clips share bite-sized tips. This protocol organizes the entire methodology into an interconnected, day-by-day sequence with printable checklists and exact measurements.',
          },
          {
            question: 'How long do I need each day?',
            answer: 'Less than 15 minutes. It is engineered specifically for busy individuals with zero extra time.',
          },
          {
            question: 'How do I access the files on Whop?',
            answer: 'Immediately after checkout, you receive instant access to your private Whop Hub with PDF downloads, Notion dashboard, and mobile access.',
          },
        ],
        marketingHook: `I finally organized the exact 14-day protocol I used to fix "${activeProblem}" into a clean 20-page guide with printable checklists. Grab it via the link in my bio!`,
        personalizedOutreachPitch: `Subject: Built this for your audience (already live on Whop preview!)

Hey ${activeName.split(' ')[0] || 'there'},

I saw your recent video on ${activeNiche} and noticed dozens of comments asking for a structured step-by-step routine to fix "${activeProblem}".

I took your methodology and formatted it into an official 24-page actionable protocol with branded Whop delivery and 3D mockups: https://whop.com/checkout/${whopSlug}?a=${cleanHandle}

If you want to place it in your bio, I'll manage all the Whop tech, digital delivery, and customer service, and Whop automatically splits all revenue 50/50 straight into your account.

Take a peek at the preview link and let me know if you want me to activate the live link!`,
        engineUsed: 'Autonomous Failover Engine',
        whopConfig: {
          whopProductId: `prod_${Math.random().toString(36).substring(2, 10)}`,
          companyId: 'biz_operator_3ds',
          title: `The ${cleanNiche} Reset Protocol`,
          tagline: `Official actionable guide by ${activeName}`,
          price: basePrice,
          orderBumpPrice: 17,
          orderBumpTitle: 'Audio Walkthrough & Notion Operating Dashboard',
          operatorSplitPct: 50,
          creatorAffiliateSplitPct: 50,
          creatorWhopHandle: cleanHandle,
          whopCheckoutUrl: `https://whop.com/checkout/${whopSlug}?a=${cleanHandle}`,
          whopPreviewSlug: whopSlug,
          deliveryFormat: 'Whop Digital Pass',
          whopPerks: [
            'Instant Whop Hub Access',
            'Full PDF Protocol (24 Pages, Mobile-Optimized)',
            'Interactive Daily Notion Habit Tracker',
            'Printable 1-Page Refrigerator Checklist',
            'Direct Access to Monthly Creator Q&A Updates',
          ],
          isLiveSynced: false,
        },
      });
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Trigger simulated sale on Whop
  const triggerWhopSale = async () => {
    setIsSimulatingSale(true);
    try {
      const res = await fetch('/api/whop/simulate-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: blueprint?.productTitle || `${activeNiche} Reset Protocol`,
          price: basePrice,
          includeOrderBump,
          orderBumpPrice,
          creatorName: activeName,
          operatorSplitPct,
        }),
      });

      const data = await res.json();
      if (data.success && data.saleEvent) {
        const newSale: WhopSaleEvent = data.saleEvent;
        setSalesLedger(prev => [newSale, ...prev]);
        setTotalGross(prev => prev + newSale.grossAmount);
        setTotalCreatorPayout(prev => Number((prev + newSale.creatorPayout).toFixed(2)));
        setTotalOperatorPayout(prev => Number((prev + newSale.operatorPayout).toFixed(2)));
      }
    } catch (err) {
      console.error('Sale simulation error', err);
    } finally {
      setIsSimulatingSale(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner: Prototype Overview */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4 text-amber-400" /> Functional Prototype Workbench
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              3DS Platform Engine: Whop Delivery &amp; AI Synthesis
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Complete working prototype of the 3DS pipeline powered by <strong>Whop</strong> for frictionless digital delivery and automated 50/50 creator affiliate revenue splits. Ingest creators, synthesize curriculum with Gemini 3.8 Flash, and simulate Whop checkouts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Delivery Engine: <strong className="text-white">Whop API v5</strong></span>
            </div>
            {onOpenIntegrations && (
              <button
                onClick={onOpenIntegrations}
                className="px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2 transition-all cursor-pointer hover:border-indigo-500/50"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Link Whop &amp; DB</span>
              </button>
            )}
            <button
              onClick={runSynthesis}
              disabled={isSynthesizing}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSynthesizing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isSynthesizing ? 'Synthesizing with Gemini...' : 'Re-Run AI Synthesis'}
            </button>
          </div>
        </div>

        {/* Why Whop Banner Alert */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Zero Creator Tax Friction:</strong>
              Creators don't need complex Stripe Express KYC forms. They accept a Whop affiliate or co-owner link in 30 seconds.
            </div>
          </div>
          <div className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
            <ShoppingBag className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Dedicated Whop Hub:</strong>
              Buyers receive a permanent digital portal with embedded PDF guide reader and Notion trackers on phone or desktop.
            </div>
          </div>
          <div className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
            <Wallet className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Automated 50/50 Splits:</strong>
              Whop automatically routes 50% to Creator Whop balance and 50% to Operator Whop balance. Zero manual bookkeeping.
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Creator Ingestion (Left) + Whop Configuration (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Creator Selection Card (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">Step 1</span>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Target Creator Profile &amp; Viral Pain Point
              </h2>
            </div>
            <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setIsCustomCreator(false)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  !isCustomCreator ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Webinar Presets
              </button>
              <button
                onClick={() => setIsCustomCreator(true)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  isCustomCreator ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Custom Handle
              </button>
            </div>
          </div>

          {!isCustomCreator ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_CREATORS.map(preset => {
                const isSelected = selectedCreator.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedCreator(preset);
                      setBasePrice(preset.suggestedPrice);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-950/90 border-indigo-500 ring-1 ring-indigo-500 text-white'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-indigo-300 font-bold">{preset.handle}</span>
                        <span className="text-[10px] text-slate-400">{preset.followerCount}</span>
                      </div>
                      <h4 className="font-bold text-xs text-white mb-0.5">{preset.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">{preset.niche}</p>
                      <p className="text-[11px] text-slate-300 italic line-clamp-2 bg-slate-900/60 p-2 rounded border border-slate-800/60">
                        "{preset.viralProblem}"
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-semibold">${preset.suggestedPrice} Whop Pass</span>
                      <span className="text-slate-400">{preset.platform}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Creator Handle</label>
                  <input
                    type="text"
                    value={customHandle}
                    onChange={e => setCustomHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="@handle"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Creator Full Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Alex Rivera"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Niche Category</label>
                <input
                  type="text"
                  value={customNiche}
                  onChange={e => setCustomNiche(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Desk Worker Posture & Mobility"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Acute Viral Problem in Comments</label>
                <textarea
                  rows={2}
                  value={customProblem}
                  onChange={e => setCustomProblem(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Severe lower back stiffness after 6 hours sitting at desk"
                />
              </div>
            </div>
          )}
        </div>

        {/* Whop Pricing & Revenue Split Control (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Step 2</span>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                Whop Pricing &amp; Split Settings
              </h2>
            </div>

            <div className="space-y-4">
              {/* Whop Base Price Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Whop Digital Pass Price</span>
                  <span className="text-white font-mono text-sm bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    ${basePrice}.00
                  </span>
                </div>
                <input
                  type="range"
                  min={14}
                  max={77}
                  step={1}
                  value={basePrice}
                  onChange={e => setBasePrice(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>$14 (Impulse)</span>
                  <span>$27 (Sweet Spot)</span>
                  <span>$77 (Bundle)</span>
                </div>
              </div>

              {/* Order Bump Toggle */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Include $17 Whop Order Bump</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      +35% Take
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    1-Click Fast Action Audio Protocol + Notion Tracker
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={includeOrderBump}
                  onChange={e => setIncludeOrderBump(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              {/* 50/50 Split Rule */}
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-indigo-300 flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" /> Whop Affiliate Automated Split:
                  </span>
                  <span className="text-emerald-400 font-mono">50% Creator / 50% You</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Whop automatically pays creator via their Whop wallet. Zero manual invoicing or bank transfers.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Cart Potential:</span>
            <span className="font-mono font-bold text-sm text-emerald-400">
              ${includeOrderBump ? basePrice + orderBumpPrice : basePrice}.00 / order
            </span>
          </div>
        </div>
      </div>

      {/* Main Prototype Interactive Tabs: Blueprint, Whop Hub, Checkout, Live Sales */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        {/* Navigation Bar inside card */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 py-3 gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTabSub('blueprint')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTabSub === 'blueprint'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              1. Synthesized Blueprint (Gemini AI)
            </button>
            <button
              onClick={() => setActiveTabSub('whophub')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTabSub === 'whophub'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              2. Whop Customer Hub Delivery
            </button>
            <button
              onClick={() => setActiveTabSub('checkout')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTabSub === 'checkout'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              3. Whop Checkout &amp; Affiliate Link
            </button>
            <button
              onClick={() => setActiveTabSub('sales')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTabSub === 'sales'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              4. Live Sales &amp; Split Stream ({salesLedger.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(blueprint?.personalizedOutreachPitch || '', 'pitch')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedSection === 'pitch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'pitch' ? 'Copied Pitch!' : 'Copy Whop Pitch'}
            </button>
          </div>
        </div>

        {/* Tab 1: Synthesized Blueprint */}
        {activeTabSub === 'blueprint' && (
          <div className="p-6 sm:p-8 space-y-6">
            {blueprint ? (
              <>
                {/* Header info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                        Synthesized Product Asset
                      </span>
                      {blueprint.engineUsed && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                          {blueprint.engineUsed}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight mt-1">
                      {blueprint.productTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      {blueprint.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Whop Price</span>
                      <span className="text-xl font-black text-white font-mono">${basePrice}.00</span>
                    </div>
                    <div className="text-right pl-3 border-l border-slate-800">
                      <span className="text-[10px] text-emerald-400 uppercase block font-semibold">Creator Split</span>
                      <span className="text-xl font-black text-emerald-400 font-mono">50%</span>
                    </div>
                  </div>
                </div>

                {/* 4 Pillars Curriculum Grid */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    The 4 Core Curriculum Pillars (Delivered in Whop Pass)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blueprint.curatedModules.map((mod, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs text-indigo-300">{mod.title}</h5>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            Pillar 0{mod.moduleNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {mod.summary}
                        </p>
                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Key Deliverables:</span>
                          <ul className="space-y-1">
                            {mod.deliverables.map((del, dIdx) => (
                              <li key={dIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{del}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Printable Checklist & FAQs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> 1-Page Printable Action Checklist Items
                    </h5>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {blueprint.printableChecklist.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded border border-slate-800/60">
                          <span className="w-4 h-4 rounded bg-emerald-950 text-emerald-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Top Audience Objections Handled in Whop Guide
                    </h5>
                    <div className="space-y-2.5">
                      {blueprint.faqItems.map((faq, i) => (
                        <div key={i} className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 space-y-1">
                          <strong className="text-xs text-white block">Q: {faq.question}</strong>
                          <p className="text-xs text-slate-300 leading-relaxed">A: {faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                <p className="text-sm text-slate-300 font-semibold">Generating AI Digital Product Blueprint with Gemini...</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Whop Customer Hub Delivery Simulator */}
        {activeTabSub === 'whophub' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">Customer Experience</span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-indigo-400" />
                  Inside Whop Customer Hub (What Buyers Receive)
                </h3>
                <p className="text-xs text-slate-400">
                  Customers log into Whop with 1 click and access their permanently unlocked deliverables
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 font-mono">
                Status: Active Whop Membership
              </div>
            </div>

            {/* Whop Portal Mockup */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-6 space-y-6">
              {/* Whop Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-base">
                    W
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{blueprint?.productTitle || 'Digital Protocol'}</h4>
                    <span className="text-[11px] text-slate-400">Official Pass by {activeName}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Pass ID: {blueprint?.whopConfig.whopProductId || 'prod_9832fa'}
                </div>
              </div>

              {/* Unlocked Deliverables Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      PDF
                    </div>
                    <h5 className="text-xs font-bold text-white">Full Protocol Guide (24 Pages)</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Complete step-by-step breakdown, diagrams, daily measurements, and troubleshooting.
                    </p>
                  </div>
                  <button 
                    onClick={() => alert('Downloaded sample PDF guide!')}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      NOTION
                    </div>
                    <h5 className="text-xs font-bold text-white">Interactive Notion Operating Dashboard</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      1-Click duplicate template with pre-built habit tracking, daily check-ins, and logs.
                    </p>
                  </div>
                  <button 
                    onClick={() => alert('Opened Notion template duplicator!')}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Duplicate to Notion
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center font-bold text-xs">
                      1-PAGE
                    </div>
                    <h5 className="text-xs font-bold text-white">Printable Refrigerator Checklist</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      High-resolution single sheet summarizing all daily non-negotiables for instant execution.
                    </p>
                  </div>
                  <button 
                    onClick={() => alert('Downloaded 1-page printable checklist!')}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Print Checklist
                  </button>
                </div>
              </div>

              {includeOrderBump && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                      ★
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">Order Bump Unlocked: {blueprint?.orderBumpTitle || 'Audio Walkthrough'}</h5>
                      <span className="text-[11px] text-slate-400">Stream the 12-minute companion walkthrough directly on mobile</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Streaming companion walkthrough audio!')}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold cursor-pointer"
                  >
                    Play Audio
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Whop Checkout & Affiliate Link */}
        {activeTabSub === 'checkout' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">Whop Direct Checkout</span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-400" />
                  Creator Bio Link &amp; 50/50 Affiliate Link
                </h3>
                <p className="text-xs text-slate-400">
                  The high-converting mobile checkout URL placed in the creator’s bio
                </p>
              </div>

              <a
                href={blueprint?.whopConfig.whopCheckoutUrl || '#'}
                target="_blank"
                rel="noreferrer"
                onClick={e => {
                  e.preventDefault();
                  alert(`Whop Checkout Link:\n${blueprint?.whopConfig.whopCheckoutUrl}\n\nWhen clicked by a follower in Instagram/TikTok, opens Apple Pay 1-click checkout with 50% automated split to ${activeHandle}!`);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Test Whop Checkout URL
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Whop Link Preview Box */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                    Generated Whop Checkout Link:
                  </span>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-indigo-300 break-all flex items-center justify-between gap-2">
                    <span>{blueprint?.whopConfig.whopCheckoutUrl || 'https://whop.com/checkout/...'}</span>
                    <button
                      onClick={() => handleCopy(blueprint?.whopConfig.whopCheckoutUrl || '', 'whopurl')}
                      className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
                    >
                      {copiedSection === 'whopurl' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Base Whop Plan:</span>
                    <span className="text-white font-mono font-bold">${basePrice}.00</span>
                  </div>
                  {includeOrderBump && (
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Order Bump (Pre-selected):</span>
                      <span className="text-amber-400 font-mono font-bold">+${orderBumpPrice}.00</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Creator Affiliate Tracking:</span>
                    <span className="text-indigo-400 font-mono">?a={activeHandle.replace('@', '')}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Whop Automated Split:</span>
                    <span className="text-emerald-400 font-mono font-bold">50% to {activeHandle}</span>
                  </div>
                </div>
              </div>

              {/* Outreach Pitch Ready */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-indigo-400" />
                      Ready-to-Send 3-Sentence Creator Pitch
                    </span>
                    <button
                      onClick={() => handleCopy(blueprint?.personalizedOutreachPitch || '', 'pitch-tab3')}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSection === 'pitch-tab3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedSection === 'pitch-tab3' ? 'Copied' : 'Copy Pitch'}
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {blueprint?.personalizedOutreachPitch}
                  </pre>
                </div>
                <div className="text-[11px] text-slate-400">
                  Tip: Send this via Instagram DM or creator's business email. Because the Whop preview is already built, response rate averages 15-20%.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Live Sales & Split Stream Simulator */}
        {activeTabSub === 'sales' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Real-Time Payout Engine</span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Live Whop Sales Stream &amp; 50/50 Ledger
                </h3>
                <p className="text-xs text-slate-400">
                  Simulate live purchases and inspect the automated Whop fee and 50/50 split calculations
                </p>
              </div>

              <button
                onClick={triggerWhopSale}
                disabled={isSimulatingSale}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                {isSimulatingSale ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                {isSimulatingSale ? 'Processing Whop Transaction...' : 'Simulate Live Customer Purchase'}
              </button>
            </div>

            {/* Payout Metric Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Gross Revenue</span>
                <div className="text-2xl font-black text-white font-mono">${totalGross.toFixed(2)}</div>
                <span className="text-[10px] text-slate-500">{salesLedger.length} total orders recorded</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-semibold text-indigo-300 block mb-1">Creator Whop Balance</span>
                <div className="text-2xl font-black text-indigo-300 font-mono">${totalCreatorPayout.toFixed(2)}</div>
                <span className="text-[10px] text-slate-500">Auto-credited to {activeHandle}</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60">
                <span className="text-[11px] font-semibold text-emerald-400 block mb-1">Your Operator Net Payout</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">${totalOperatorPayout.toFixed(2)}</div>
                <span className="text-[10px] text-emerald-300/80">Directly available in your Whop wallet</span>
              </div>
            </div>

            {/* Live Ledger Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Whop Webhook Event Ledger (`payment.succeeded`)
              </h4>

              {salesLedger.length > 0 ? (
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                      <tr>
                        <th className="p-3">Time / ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Gross</th>
                        <th className="p-3">Whop 3%</th>
                        <th className="p-3 text-indigo-300">Creator (50%)</th>
                        <th className="p-3 text-emerald-400">Operator (50%)</th>
                        <th className="p-3">Delivery</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/40 text-slate-300">
                      {salesLedger.map((sale) => (
                        <tr key={sale.id} className="hover:bg-slate-900/60">
                          <td className="p-3">
                            <span className="text-white block font-bold">{sale.timestamp}</span>
                            <span className="text-[10px] text-slate-500">{sale.id}</span>
                          </td>
                          <td className="p-3 text-slate-200">
                            {sale.customerEmail}
                            {sale.orderBumpIncluded && (
                              <span className="ml-1.5 px-1 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300">
                                +Bump
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-bold text-white">${sale.grossAmount.toFixed(2)}</td>
                          <td className="p-3 text-slate-400">-${sale.whopFee.toFixed(2)}</td>
                          <td className="p-3 text-indigo-300 font-bold">${sale.creatorPayout.toFixed(2)}</td>
                          <td className="p-3 text-emerald-400 font-bold">${sale.operatorPayout.toFixed(2)}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                              {sale.deliveryStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                  <p className="text-xs text-slate-400">No simulated sales yet. Click the button above to test the first purchase!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
