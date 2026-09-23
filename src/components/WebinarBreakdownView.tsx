import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Cpu, 
  Quote, 
  ChevronRight, 
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { WEBINAR_ANALYSES } from '../data/webinarData';

export const WebinarBreakdownView: React.FC = () => {
  const [selectedVideoId, setSelectedVideoId] = useState<string>(WEBINAR_ANALYSES[0].id);

  const activeVideo = WEBINAR_ANALYSES.find(v => v.id === selectedVideoId) || WEBINAR_ANALYSES[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Overview Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" /> Curriculum Breakdown
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              All 5 Webinar Sessions: Key Takeaways &amp; Workflows
            </h1>
          </div>
          <div className="text-xs text-slate-400 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
            <span>Playlist: <strong className="text-indigo-300">PLUHokAA_R9EA</strong></span>
            <span>•</span>
            <span>5 Masterclasses</span>
          </div>
        </div>
        <p className="text-sm sm:text-base text-slate-300 max-w-4xl leading-relaxed">
          Comprehensive synthesis of all 5 video sessions in the AI digital product webinar curriculum. Each session solves a distinct phase of the funnel, from macro-economic funnel strategy to viral problem curation, AI synthesis, cold microcreator outreach, and automated revenue splits.
        </p>
      </div>

      {/* Video Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {WEBINAR_ANALYSES.map((video, idx) => {
          const isSelected = video.id === selectedVideoId;
          const isVideo3 = video.youtubeId === 'XmzgbRe9Pkg';

          return (
            <button
              key={video.id}
              onClick={() => setSelectedVideoId(video.id)}
              className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950/90 border-indigo-500 shadow-lg shadow-indigo-500/20 text-white'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              {isVideo3 && (
                <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-slate-950 uppercase">
                  Live Demo
                </span>
              )}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`font-mono font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
                    Session 0{idx + 1}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {video.durationApprox}
                  </span>
                </div>
                <h4 className="font-semibold text-xs leading-snug line-clamp-2 mb-2 text-white">
                  {video.title}
                </h4>
              </div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-indigo-400/90 flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span>{video.primaryRole}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-indigo-300' : 'text-slate-500'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Session Detail View */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-8">
        {/* Header of Active Session */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                {activeVideo.workflowStage}
              </span>
              <span className="text-xs text-slate-400">
                Speaker: <strong className="text-slate-200">{activeVideo.speaker}</strong>
              </span>
              <span className="text-xs text-slate-400">• Approx. {activeVideo.durationApprox}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {activeVideo.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-600/20 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Watch on YouTube
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>

        {/* Core Takeaways */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Key Strategic Takeaways
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeVideo.coreTakeaways.map((takeaway, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-900/50 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {takeaway}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Narrative Breakdown */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white">
            Detailed Workflow &amp; Operational Narrative
          </h3>
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 leading-relaxed space-y-3">
            <p>{activeVideo.detailedBreakdown}</p>
          </div>
        </div>

        {/* Technologies Used in This Session */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            Technologies Demonstrated in this Session &amp; What They Do
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeVideo.technologiesDemonstrated.map((tech, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-sm font-bold text-white">{tech.name}</h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                      {tech.category}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block mb-0.5">What it does specifically:</span>
                      <p className="text-slate-200">{tech.whatItDoesSpecifically}</p>
                    </div>
                    <div>
                      <span className="text-amber-400/90 font-semibold block mb-0.5">Limitation / Constraint:</span>
                      <p className="text-slate-300">{tech.limitationOrConstraint}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-800/80">
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mb-0.5">
                    <ArrowUpRight className="w-3 h-3" /> Custom Clone Architecture:
                  </span>
                  <p className="text-xs text-slate-300">{tech.customCloneAlternative}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Rules & Quotes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Actionable Rules */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Golden Execution Rules
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {activeVideo.actionableRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quotes & Metrics */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Quote className="w-4 h-4" /> Core Quotes &amp; Economics
            </h4>
            <div className="space-y-2.5">
              {activeVideo.quotesAndMetrics.map((quote, idx) => (
                <blockquote key={idx} className="border-l-2 border-indigo-500 pl-3 italic text-xs text-slate-300">
                  {quote}
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
