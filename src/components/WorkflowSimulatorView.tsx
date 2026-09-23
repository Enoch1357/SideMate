import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  DollarSign, 
  Users, 
  FileText, 
  Send, 
  CheckCircle2, 
  TrendingUp, 
  Share2, 
  Copy, 
  Check, 
  RefreshCw,
  BookOpen,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { PRESET_CREATORS } from '../data/techStackData';
import { CreatorPreset, GeneratedProductBlueprint } from '../types';

export const WorkflowSimulatorView: React.FC = () => {
  const [selectedCreator, setSelectedCreator] = useState<CreatorPreset>(PRESET_CREATORS[0]);
  const [customHandle, setCustomHandle] = useState('');
  const [customNiche, setCustomNiche] = useState('');
  const [customProblem, setCustomProblem] = useState('');
  const [customFollowers, setCustomFollowers] = useState('50,000');
  const [customTone, setCustomTone] = useState('Empathetic, clear, and action-oriented');
  const [isCustom, setIsCustom] = useState(false);

  const [pricePoint, setPricePoint] = useState<number>(selectedCreator.suggestedPrice);
  const [estimatedMonthlySales, setEstimatedMonthlySales] = useState<number>(selectedCreator.expectedMonthlySales);
  const [operatorSplitPct, setOperatorSplitPct] = useState<number>(50);

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedPitch, setCopiedPitch] = useState(false);

  // Synchronize when preset changes
  const handleSelectPreset = (preset: CreatorPreset) => {
    setIsCustom(false);
    setSelectedCreator(preset);
    setPricePoint(preset.suggestedPrice);
    setEstimatedMonthlySales(preset.expectedMonthlySales);
  };

  // Run the simulation generator
  const runSynthesizePipeline = () => {
    setIsGenerating(true);
    setActiveStep(1);

    setTimeout(() => {
      setActiveStep(2);
    }, 600);

    setTimeout(() => {
      setActiveStep(3);
    }, 1200);

    setTimeout(() => {
      setActiveStep(4);
      setIsGenerating(false);
    }, 1800);
  };

  // Generate dynamic blueprint based on creator attributes
  const currentCreatorName = isCustom ? (customHandle || '@new_creator') : selectedCreator.name;
  const currentCreatorHandle = isCustom ? (customHandle || '@new_creator') : selectedCreator.handle;
  const currentNiche = isCustom ? (customNiche || 'Wellness & Health') : selectedCreator.niche;
  const currentProblem = isCustom ? (customProblem || 'Overwhelm and lack of structured guidance') : selectedCreator.viralProblem;
  const currentTone = isCustom ? customTone : selectedCreator.creatorAudienceTone;

  // Economic calculations
  const grossMonthly = pricePoint * estimatedMonthlySales;
  const creatorShare = Math.round(grossMonthly * ((100 - operatorSplitPct) / 100));
  const operatorShare = Math.round(grossMonthly * (operatorSplitPct / 100));

  const pitchText = `Subject: Built this for your audience (already done!)

Hey ${currentCreatorName.split(' ')[0] || 'there'},

I noticed on your pinned video about ${currentNiche} that dozens of followers were desperate for a structured step-by-step routine to fix "${currentProblem}".

I turned your methodology into a clean, 22-page actionable protocol guide with your branding and layout: https://3ds-automator.app/preview/${encodeURIComponent(currentCreatorHandle.replace('@', ''))}

If you'd like to put this in your bio, I'll handle all the checkout tech, customer support, and delivery, and we split all sales ${100 - operatorSplitPct}/${operatorSplitPct} straight to your bank account.

Take a quick look at the preview and let me know if you want me to turn on the live checkout link!`;

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sliders className="w-4 h-4" /> Live Execution Workbench
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          3DS Workflow Automation Simulator
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-4xl leading-relaxed">
          Test the automated 3DS pipeline in real time. Ingest a creator profile, trigger the simulated <strong>Synthesize AI</strong> extraction engine, generate a complete digital product blueprint, inspect the personalized outreach script, and model the automated revenue split economics.
        </p>
      </div>

      {/* Step 1: Ingestion & Selection */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-900 text-indigo-300 text-xs font-bold flex items-center justify-center">
                1
              </span>
              Creator Profile Ingestion (Switch 1 &amp; 2)
            </h2>
            <p className="text-xs text-slate-400">
              Select a verified creator archetype from the webinar case studies or input your own
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustom(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !isCustom ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Webinar Archetypes
            </button>
            <button
              onClick={() => setIsCustom(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isCustom ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Custom Creator URL
            </button>
          </div>
        </div>

        {!isCustom ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESET_CREATORS.map(creator => {
              const isSelected = selectedCreator.id === creator.id;
              return (
                <button
                  key={creator.id}
                  onClick={() => handleSelectPreset(creator)}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-500 ring-1 ring-indigo-500 text-white'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-indigo-300">{creator.handle}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {creator.followerCount}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-white mb-1">{creator.name}</div>
                    <div className="text-xs text-slate-400 mb-2">{creator.niche}</div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                      "{creator.viralProblem}"
                    </p>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-semibold">${creator.suggestedPrice} Target</span>
                    <span className="text-slate-400">{creator.platform}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Creator Handle or URL</label>
              <input
                type="text"
                placeholder="@username or tiktok.com/@handle"
                value={customHandle}
                onChange={e => setCustomHandle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Niche Category</label>
              <input
                type="text"
                placeholder="e.g., Postpartum Fitness, Plant-based Nutrition"
                value={customNiche}
                onChange={e => setCustomNiche(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Follower Count</label>
              <input
                type="text"
                placeholder="e.g., 45,000"
                value={customFollowers}
                onChange={e => setCustomFollowers(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Acute Viral Problem in Comments</label>
              <input
                type="text"
                placeholder="e.g., Exhausted parents dealing with 2-year sleep regression"
                value={customProblem}
                onChange={e => setCustomProblem(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Creator Tone of Voice</label>
              <input
                type="text"
                placeholder="e.g., Compassionate, authoritative, reassuring"
                value={customTone}
                onChange={e => setCustomTone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Trigger Synthesize Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400">
            Selected Profile: <strong className="text-white">{currentCreatorName}</strong> ({currentCreatorHandle}) — {currentNiche}
          </div>
          <button
            onClick={runSynthesizePipeline}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-300" />}
            {isGenerating ? 'Synthesizing Digital Product...' : 'Run "Synthesize AI" Pipeline'}
          </button>
        </div>
      </div>

      {/* Step 2: Synthesis Engine Progress & Output */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-900 text-indigo-300 text-xs font-bold flex items-center justify-center">
              2
            </span>
            Synthesized Digital Product Blueprint
          </h2>
          <p className="text-xs text-slate-400">
            The multi-module actionable protocol generated by analyzing the creator's voice and audience questions
          </p>
        </div>

        {/* Pipeline Execution Stages */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
            activeStep >= 1 ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>1. Profile Ingested</span>
          </div>
          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
            activeStep >= 2 ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>2. Tone Extracted</span>
          </div>
          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
            activeStep >= 3 ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>3. Curriculum Built</span>
          </div>
          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
            activeStep >= 4 ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>4. Packaging Ready</span>
          </div>
        </div>

        {/* Product Blueprint Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cover Mockup Card */}
          <div className="p-5 rounded-xl bg-gradient-to-b from-slate-950 to-indigo-950/40 border border-slate-800 flex flex-col justify-between text-center relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-full aspect-[4/5] rounded-xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 flex flex-col justify-between shadow-2xl relative">
                <div className="text-[10px] uppercase font-bold tracking-widest text-indigo-300">
                  OFFICIAL CREATOR PROTOCOL
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-tight mb-2">
                    The {currentNiche.split('&')[0]} Reset Blueprint
                  </h3>
                  <p className="text-xs text-indigo-200">
                    A 14-Day Actionable System by {currentCreatorName}
                  </p>
                </div>
                <div className="pt-4 border-t border-indigo-500/20 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Digital Guide + Notion Kit</span>
                  <span className="font-bold text-white">${pricePoint}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400">Target Problem Solved:</span>
                <p className="text-xs text-slate-200 font-semibold mt-0.5">{currentProblem}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-medium">
              ✨ 3D Mockup Asset Generated for Creator Bio
            </div>
          </div>

          {/* Module Breakdown */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Core Curriculum Architecture (The 4 Pillars)
            </h3>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-indigo-300">Module 1: Diagnosis &amp; Root Cause Analysis</span>
                  <span className="text-[10px] font-mono text-slate-500">Pages 1–5</span>
                </div>
                <p className="text-xs text-slate-300">
                  Deconstructs why traditional approaches fail. Identifies the primary friction points and emotional triggers specific to the creator’s audience.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-indigo-300">Module 2: The Core Step-by-Step Daily Protocol</span>
                  <span className="text-[10px] font-mono text-slate-500">Pages 6–16</span>
                </div>
                <p className="text-xs text-slate-300">
                  The primary solution engine. A phased 14-day routine eliminating decision fatigue with precise morning/evening routines and rules of thumb.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-indigo-300">Module 3: 1-Page Printable Action Checklist</span>
                  <span className="text-[10px] font-mono text-slate-500">Pages 17–19</span>
                </div>
                <p className="text-xs text-slate-300">
                  The highest value asset for impulse buyers: a single-sheet daily habit tracker to hang on the fridge or keep on the phone lockscreen.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-indigo-300">Module 4: Emergency FAQs &amp; Edge Cases</span>
                  <span className="text-[10px] font-mono text-slate-500">Pages 20–24</span>
                </div>
                <p className="text-xs text-slate-300">
                  Answers to the top 15 most frequent follower questions scraped directly from comment threads. Reduces refunds and boosts customer retention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Personalized Outreach Generator */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-900 text-indigo-300 text-xs font-bold flex items-center justify-center">
                3
              </span>
              Personalized 3-Sentence Creator Pitch
            </h2>
            <p className="text-xs text-slate-400">
              The exact outreach email/DM loaded with the preview link and 50/50 terms
            </p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(pitchText);
              setCopiedPitch(true);
              setTimeout(() => setCopiedPitch(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedPitch ? 'Copied Pitch!' : 'Copy Pitch Script'}
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
          {pitchText}
        </div>
      </div>

      {/* Step 4: Revenue & Split Economics Calculator */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-900 text-indigo-300 text-xs font-bold flex items-center justify-center">
              4
            </span>
            Automated 50/50 Revenue Split Modeler
          </h2>
          <p className="text-xs text-slate-400">
            Simulate the unit economics per creator partnership and forecast portfolio scale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Product Price Point</span>
                <span className="text-indigo-300 font-mono">${pricePoint}</span>
              </div>
              <input
                type="range"
                min={14}
                max={97}
                step={1}
                value={pricePoint}
                onChange={e => setPricePoint(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$14 (Zada low-ticket)</span>
                <span>$27 (Standard)</span>
                <span>$97 (Bundle)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Monthly Units Sold</span>
                <span className="text-indigo-300 font-mono">{estimatedMonthlySales} copies</span>
              </div>
              <input
                type="range"
                min={50}
                max={1500}
                step={25}
                value={estimatedMonthlySales}
                onChange={e => setEstimatedMonthlySales(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>50 / mo (Conservative)</span>
                <span>400 / mo (Average)</span>
                <span>1500 / mo (Viral)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Your Operator Cut</span>
                <span className="text-emerald-400 font-mono">{operatorSplitPct}%</span>
              </div>
              <input
                type="range"
                min={30}
                max={70}
                step={5}
                value={operatorSplitPct}
                onChange={e => setOperatorSplitPct(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>30%</span>
                <span>50% (Standard 3DS)</span>
                <span>70%</span>
              </div>
            </div>
          </div>

          {/* Outcome Metric Cards */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400">Gross Monthly Volume</span>
              <div className="text-2xl font-black text-white font-mono my-2">
                ${grossMonthly.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500">
                {estimatedMonthlySales} sales @ ${pricePoint}
              </span>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs font-semibold text-indigo-300">Creator Auto-Payout</span>
              <div className="text-2xl font-black text-indigo-300 font-mono my-2">
                ${creatorShare.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500">
                {100 - operatorSplitPct}% deposited via Stripe Connect
              </span>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-950 border border-emerald-600/30 flex flex-col justify-between">
              <span className="text-xs font-semibold text-emerald-400">Your Monthly Net Take-Home</span>
              <div className="text-2xl font-black text-emerald-400 font-mono my-2">
                ${operatorShare.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-300/80">
                From just 1 active creator partnership
              </span>
            </div>

            {/* Scaling Multiplier Row */}
            <div className="sm:col-span-3 p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <strong className="text-white block mb-0.5">Scale Projection (James &amp; Gail Model):</strong>
                <span className="text-slate-400">
                  Scaling this single blueprint across 3 non-competing creators in this niche:
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-mono font-bold text-emerald-400">
                  ${(operatorShare * 3).toLocaleString()} / month
                </span>
                <span className="text-[10px] text-slate-500 block">(${(operatorShare * 3 * 12).toLocaleString()} / year)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
