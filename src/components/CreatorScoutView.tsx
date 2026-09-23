import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Plus, 
  X, 
  ExternalLink,
  Zap,
  Tag,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { DemandSignal } from './DiscoverDemandView';

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  platform: string;
  niche: string;
  followers: string;
  engagementRate: string;
  audiencePain: string;
  monetizationStatus: string;
  eligibilityScore: number;
  avatarUrl: string;
  recommendedProduct: string;
  recommendedFormat: string;
  suggestedPrice: number;
}

interface CreatorScoutViewProps {
  initialDemandSignal?: DemandSignal | null;
  onSelectCreatorForProduct: (creator: CreatorProfile) => void;
  onDirectPitchCreator?: (creator: CreatorProfile) => void;
}

export const CreatorScoutView: React.FC<CreatorScoutViewProps> = ({
  initialDemandSignal,
  onSelectCreatorForProduct,
}) => {
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNicheFilter, setActiveNicheFilter] = useState(
    initialDemandSignal?.niche || 'all'
  );

  // Custom Creator Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [customHandle, setCustomHandle] = useState('');
  const [customName, setCustomName] = useState('');
  const [customNiche, setCustomNiche] = useState(initialDemandSignal?.niche || 'Health & Wellness');
  const [customFollowers, setCustomFollowers] = useState('35K');
  const [customAudiencePain, setCustomAudiencePain] = useState(initialDemandSignal?.viralProblem || '');

  const fetchCreators = async (niche?: string, query?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (niche && niche !== 'all') params.append('niche', niche);
      if (query && query.trim()) params.append('query', query.trim());

      const res = await fetch(`/api/creators/scout?${params.toString()}`);
      const data = await res.json();
      setCreators(data.creators || []);
    } catch (err) {
      console.error('Failed to scout creators:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators(activeNicheFilter, searchQuery);
  }, [activeNicheFilter]);

  const handleAddCustomCreator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHandle.trim()) return;

    const newCreator: CreatorProfile = {
      id: `custom_${Date.now()}`,
      name: customName.trim() || customHandle.replace('@', ''),
      handle: customHandle.startsWith('@') ? customHandle.trim() : `@${customHandle.trim()}`,
      platform: 'TikTok / Instagram',
      niche: customNiche,
      followers: customFollowers,
      engagementRate: '5.2%',
      audiencePain: customAudiencePain || 'Seeking structured step-by-step guidance from creator',
      monetizationStatus: 'No active digital products in bio',
      eligibilityScore: 95,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face`,
      recommendedProduct: `${customNiche} Mastery Blueprint`,
      recommendedFormat: 'Actionable PDF Guide + Checklist',
      suggestedPrice: 27,
    };

    setCreators([newCreator, ...creators]);
    setShowAddModal(false);
    setCustomHandle('');
    setCustomName('');
    onSelectCreatorForProduct(newCreator);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-teal-950/30 border border-slate-800 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-2.5">
              <Users className="w-3.5 h-3.5 text-teal-400" />
              <span>Step 2: Microcreator Scouting &amp; Distribution Partners</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Scout High-Engagement Microcreators
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Find creators with 10k–150k followers who have high engagement and unmonetized audiences asking questions. Personalize a digital product for them to launch with zero effort on a 50/50 split.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm shadow-teal-600/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Creator</span>
            </button>
          </div>
        </div>

        {/* Selected Problem Notice (if navigated from Step 1) */}
        {initialDemandSignal && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-slate-300">
                Targeting Demand: <strong className="text-white">{initialDemandSignal.viralProblem}</strong> ({initialDemandSignal.niche})
              </span>
            </div>
            <button
              onClick={() => setActiveNicheFilter('all')}
              className="text-[11px] text-indigo-300 hover:text-white underline cursor-pointer"
            >
              View all creators
            </button>
          </div>
        )}

        {/* Search & Quick Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-5 mt-5 border-t border-slate-800/80">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creator name, @handle, or niche..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveNicheFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeNicheFilter === 'all'
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-800/70 text-slate-300 hover:text-white'
              }`}
            >
              All Niches
            </button>
            <button
              onClick={() => setActiveNicheFilter('Parenting')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeNicheFilter.includes('Parenting')
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-800/70 text-slate-300 hover:text-white'
              }`}
            >
              Parenting
            </button>
            <button
              onClick={() => setActiveNicheFilter('Physical Therapy')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeNicheFilter.includes('Physical Therapy')
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-800/70 text-slate-300 hover:text-white'
              }`}
            >
              Mobility
            </button>
            <button
              onClick={() => setActiveNicheFilter('Freelancing')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeNicheFilter.includes('Freelancing')
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-800/70 text-slate-300 hover:text-white'
              }`}
            >
              Business
            </button>
            <button
              onClick={() => setActiveNicheFilter('Nutrition')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeNicheFilter.includes('Nutrition')
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-800/70 text-slate-300 hover:text-white'
              }`}
            >
              Fitness
            </button>
          </div>
        </div>
      </div>

      {/* Creator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {creators.map((creator) => (
          <div
            key={creator.id}
            className="rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700/80 p-5 flex flex-col justify-between transition-all duration-200 group hover:shadow-lg hover:shadow-teal-950/20"
          >
            <div className="space-y-4">
              {/* Profile Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={creator.avatarUrl}
                    alt={creator.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-teal-200 transition-colors leading-snug">
                      {creator.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="font-mono text-teal-400">{creator.handle}</span>
                      <span>•</span>
                      <span>{creator.platform}</span>
                    </div>
                  </div>
                </div>

                <div className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-[10px] font-mono font-bold text-emerald-300 flex items-center gap-1 shrink-0">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{creator.eligibilityScore}% Match</span>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Follower Base</span>
                  <span className="font-bold text-white text-xs">{creator.followers}</span>
                  <span className="text-[10px] text-emerald-400 block font-mono mt-0.5">
                    {creator.engagementRate} eng.
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Niche Category</span>
                  <span className="font-bold text-slate-200 text-xs line-clamp-1">{creator.niche}</span>
                  <span className="text-[10px] text-indigo-400 block font-mono mt-0.5">50/50 Ready</span>
                </div>
              </div>

              {/* Audience Pain Point */}
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/60 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" /> Audience Question/Pain:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{creator.audiencePain}"
                </p>
              </div>

              {/* Current Monetization Status */}
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Monetization gap: <strong className="text-slate-200">{creator.monetizationStatus}</strong></span>
              </div>
            </div>

            {/* Action */}
            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <button
                onClick={() => onSelectCreatorForProduct(creator)}
                className="w-full px-3 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-teal-600/20"
              >
                <span>Create Personalized Product</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Creator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-white text-base">Add Target Microcreator</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomCreator} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Creator Social Handle (e.g. @dr.mobility)
                </label>
                <input
                  type="text"
                  required
                  value={customHandle}
                  onChange={(e) => setCustomHandle(e.target.value)}
                  placeholder="@handle"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Full Name / Display Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Marcus Vance, DPT"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Niche
                  </label>
                  <input
                    type="text"
                    value={customNiche}
                    onChange={(e) => setCustomNiche(e.target.value)}
                    placeholder="e.g. Posture / PT"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Follower Count
                  </label>
                  <input
                    type="text"
                    value={customFollowers}
                    onChange={(e) => setCustomFollowers(e.target.value)}
                    placeholder="e.g. 45K"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Audience Problem / Comment Pain
                </label>
                <textarea
                  rows={2}
                  value={customAudiencePain}
                  onChange={(e) => setCustomAudiencePain(e.target.value)}
                  placeholder="What are their followers desperately asking for in the comments?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-all shadow-md shadow-teal-600/30"
                >
                  Add &amp; Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
