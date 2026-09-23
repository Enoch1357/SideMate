import React from 'react';
import { 
  Sparkles, 
  Layers, 
  PlayCircle, 
  Cpu, 
  Sliders, 
  Code2, 
  Zap,
  ShoppingBag,
  Key,
  Database
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'prototype' | 'video3' | 'webinars' | 'tech' | 'architecture' | 'integrations';
  setActiveTab: (tab: 'prototype' | 'video3' | 'webinars' | 'tech' | 'architecture' | 'integrations') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  3DS Automator
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                  Whop Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                AI Digital Products &amp; Whop Creator Distribution OS
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('prototype')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'prototype'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Whop Prototype</span>
              <span className="hidden md:inline-block px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-300 rounded font-black">
                LIVE
              </span>
            </button>

            <button
              onClick={() => setActiveTab('integrations')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'integrations'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Key className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Whop &amp; DB Setup</span>
              <span className="sm:hidden">Integrations</span>
            </button>

            <button
              onClick={() => setActiveTab('video3')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'video3'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Video 3: Live Masterclass</span>
              <span className="sm:hidden">Video 3</span>
            </button>

            <button
              onClick={() => setActiveTab('webinars')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'webinars'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">All 5 Sessions</span>
              <span className="sm:hidden">Webinars</span>
            </button>

            <button
              onClick={() => setActiveTab('tech')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'tech'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span className="hidden sm:inline">Tech &amp; Whop Clones</span>
              <span className="sm:hidden">Tech</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'architecture'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline">Whop System Spec</span>
              <span className="sm:hidden">Spec</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
