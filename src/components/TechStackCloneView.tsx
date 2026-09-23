import React, { useState } from 'react';
import { 
  Cpu, 
  Code2, 
  Database, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Server, 
  Copy, 
  Check, 
  ShieldAlert, 
  Zap 
} from 'lucide-react';
import { TECH_STAGES } from '../data/techStackData';

export const TechStackCloneView: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeStage = TECH_STAGES.find(s => s.stageNumber === selectedStage) || TECH_STAGES[0];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Cpu className="w-4 h-4" /> Technical Architecture Blueprint
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          Technologies Breakdown &amp; Custom Clone Engineering Specs
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-4xl leading-relaxed">
          The webinar relies on proprietary tools like <em>Synthesize AI</em> and <em>ListKit</em> bundled inside expensive course programs. Below is the precise functional breakdown of what each technology does under the hood, accompanied by an open-source, production-ready blueprint to engineer your own automated platform.
        </p>
      </div>

      {/* Stage Navigator Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {TECH_STAGES.map(stage => {
          const isSelected = stage.stageNumber === selectedStage;
          return (
            <button
              key={stage.stageNumber}
              onClick={() => setSelectedStage(stage.stageNumber)}
              className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950 border-indigo-500 shadow-lg shadow-indigo-500/20 text-white'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                  <span className={`font-bold ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`}>
                    STAGE 0{stage.stageNumber}
                  </span>
                </div>
                <h4 className="text-xs font-bold leading-snug line-clamp-2 text-white">
                  {stage.stageName}
                </h4>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[120px]">{stage.webinarTech.split('+')[0]}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Stage Detail Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-8">
        {/* Title and Objective */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
              Stage 0{activeStage.stageNumber}
            </span>
            <span className="text-xs text-slate-400">Core Objective:</span>
            <span className="text-xs text-emerald-400 font-semibold">{activeStage.objective}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {activeStage.stageName}
          </h2>
        </div>

        {/* Commercial Tool vs Custom Clone Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Commercial / Webinar Tech */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Webinar Technology</span>
                <h3 className="text-base font-bold text-white">{activeStage.webinarTech}</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Proprietary / Paid
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                What it does specifically:
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeStage.whatItDoesSpecifically}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/40 text-xs text-red-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <div>
                <strong>Why you shouldn't be locked into it:</strong> Most webinar tools are walled gardens with closed APIs, manual export limitations, and mandatory high monthly subscription retainers.
              </div>
            </div>
          </div>

          {/* Custom Clone Architecture */}
          <div className="rounded-xl bg-slate-950/80 border border-indigo-500/30 p-5 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl -z-0"></div>
            <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">Custom Architecture</span>
                <h3 className="text-base font-bold text-white">Your Automated Clone Spec</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Open &amp; Scalable
              </span>
            </div>

            <div className="relative z-10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Recommended Technology Stack:
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {activeStage.customCloneArchitecture.recommendedStack.map((tech, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-900 text-slate-200 border border-slate-800">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Core Autonomous Mechanism:
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeStage.customCloneArchitecture.coreMechanism}
              </p>
            </div>
          </div>
        </div>

        {/* API Endpoints & Interfaces */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              REST API Endpoints to Implement
            </h3>
            <span className="text-xs text-slate-500 font-mono">Backend Route Contract</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeStage.customCloneArchitecture.apiEndpoints.map((endpoint, i) => {
              const [method, ...rest] = endpoint.split(' ');
              const path = rest.join(' ');
              return (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2.5 font-mono text-xs">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    method === 'GET' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                    method === 'POST' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {method}
                  </span>
                  <span className="text-slate-200 truncate">{path}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Model & Sample Code / Prompt */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Model */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                Database Schema / TypeScript Interface
              </h4>
              <button
                onClick={() => handleCopy(activeStage.customCloneArchitecture.dataModel, `data-${activeStage.stageNumber}`)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedCode === `data-${activeStage.stageNumber}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCode === `data-${activeStage.stageNumber}` ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <code>{activeStage.customCloneArchitecture.dataModel}</code>
            </pre>
          </div>

          {/* Sample Implementation Code or Prompt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Prompt / Execution Implementation Snippet
              </h4>
              <button
                onClick={() => handleCopy(activeStage.customCloneArchitecture.samplePromptOrCode, `code-${activeStage.stageNumber}`)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedCode === `code-${activeStage.stageNumber}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCode === `code-${activeStage.stageNumber}` ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300/90 overflow-x-auto whitespace-pre-wrap">
              <code>{activeStage.customCloneArchitecture.samplePromptOrCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
