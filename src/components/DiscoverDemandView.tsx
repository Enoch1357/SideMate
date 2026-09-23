import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  Flame, 
  DollarSign, 
  FileText, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  RefreshCw,
  Target
} from 'lucide-react';

export interface DemandSignal {
  id: string;
  niche: string;
  viralProblem: string;
  searchVolume: string;
  painIntensity: number;
  willingnessToPay: string;
  recommendedFormat: string;
  suggestedPrice: number;
  orderBumpSuggested: number;
  targetCreatorType: string;
  evidenceKeywords: string[];
  sampleHook: string;
}

interface DiscoverDemandViewProps {
  onSelectForCreators: (signal: DemandSignal) => void;
  onSelectForProduct: (signal: DemandSignal) => void;
}

export const DiscoverDemandView: React.FC<DiscoverDemandViewProps> = ({
  onSelectForCreators,
  onSelectForProduct,
}) => {
  const [signals, setSignals] = useState<DemandSignal[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'parenting', label: 'Parenting & Family' },
    { id: 'physical therapy', label: 'Mobility & Posture' },
    { id: 'freelancing', label: 'Freelance & Business' },
    { id: 'biohacking', label: 'Sleep & Biohacking' },
    { id: 'devops', label: 'Tech & DevOps' },
    { id: 'fitness', label: 'Nutrition & Meal Prep' },
  ];

  const fetchSignals = async (query?: string, category?: string) => {
    setLoading(true);
    try {
      if (query && query.trim()) {
        const res = await fetch('/api/discover-demand', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customQuery: query.trim() }),
        });
        const data = await res.json();
        setSignals(data.signals || []);
      } else {
        const filterNiche = category && category !== 'all' ? category : '';
        const url = filterNiche 
          ? `/api/demand-signals?niche=${encodeURIComponent(filterNiche)}`
          : '/api/demand-signals';
        const res = await fetch(url);
        const data = await res.json();
        setSignals(data.signals || []);
      }
    } catch (err) {
      console.error('Failed to fetch demand signals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals(undefined, activeCategory);
  }, [activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchSignals(searchQuery.trim());
    } else {
      fetchSignals(undefined, activeCategory);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Step 1: Market Demand &amp; Viral Problems</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Discover High-Converting Digital Product Demand
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Scan proven audience pain points with verified search volume and high willingness to pay. Pick a validated problem to scout eligible creators or synthesize directly.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Scan any niche, keyword, or problem..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Scan</span>
            </button>
          </form>
        </div>

        {/* Niche quick pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-5 mt-5 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-500" /> Filters:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSearchQuery('');
                setActiveCategory(cat.id);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeCategory === cat.id && !searchQuery
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Demand Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className="rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700/80 p-5 flex flex-col justify-between transition-all duration-200 group hover:shadow-lg hover:shadow-indigo-950/20"
          >
            <div className="space-y-3.5">
              {/* Top metadata tags */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-md border border-indigo-800/50">
                  {signal.niche}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-800/50 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {signal.searchVolume}
                </span>
              </div>

              {/* Problem Title */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-200 transition-colors leading-snug">
                  {signal.viralProblem}
                </h3>
              </div>

              {/* Sample Hook */}
              <div className="bg-slate-950/70 rounded-lg p-2.5 border border-slate-800/60 text-[11px] text-slate-300 italic">
                "{signal.sampleHook}"
              </div>

              {/* Core metrics grid */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-slate-950/50 rounded-lg p-2 border border-slate-800/50">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>Pain Score</span>
                  </div>
                  <div className="font-bold text-slate-100 text-xs mt-0.5 flex items-center gap-1.5">
                    <span>{signal.painIntensity} / 10</span>
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full" 
                        style={{ width: `${(signal.painIntensity / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/50 rounded-lg p-2 border border-slate-800/50">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-400" />
                    <span>Ideal Price</span>
                  </div>
                  <div className="font-bold text-emerald-300 text-xs mt-0.5">
                    ${signal.suggestedPrice} <span className="text-[10px] text-slate-400 font-normal">+$${signal.orderBumpSuggested} bump</span>
                  </div>
                </div>
              </div>

              {/* Target Format & Target Creator */}
              <div className="space-y-1.5 text-[11px] text-slate-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="font-medium text-slate-200">Format:</span>
                  <span className="text-slate-300">{signal.recommendedFormat}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Users className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-200">Creators:</span>
                  <span className="text-slate-400 line-clamp-1">{signal.targetCreatorType}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectForCreators(signal)}
                className="px-3 py-2 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm shadow-indigo-600/20"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Find Creators</span>
              </button>

              <button
                onClick={() => onSelectForProduct(signal)}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <span>Create Product</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
