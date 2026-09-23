import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Sparkles, 
  ShoppingBag, 
  Send, 
  BarChart3, 
  Settings,
  Key
} from 'lucide-react';
import { SideMateLogo } from './SideMateLogo';

export type AppTab = 
  | 'discover' 
  | 'creators' 
  | 'product' 
  | 'pricing' 
  | 'outreach' 
  | 'delivery' 
  | 'settings';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  whopLiveConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab,
  whopLiveConnected = false 
}) => {
  const navItems: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'discover', label: '1. Discover Demand', icon: TrendingUp },
    { id: 'creators', label: '2. Find Creators', icon: Users },
    { id: 'product', label: '3. Product Studio', icon: Sparkles },
    { id: 'pricing', label: '4. Whop Store', icon: ShoppingBag },
    { id: 'outreach', label: '5. Pitch & Outreach', icon: Send },
    { id: 'delivery', label: '6. Partner Hub', icon: BarChart3 },
    { id: 'settings', label: 'Whop & DB Setup', icon: Key },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('discover')}
            className="cursor-pointer transition-transform hover:scale-[1.01]"
          >
            <SideMateLogo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Whop Status Indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors cursor-pointer ${
                whopLiveConnected
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${whopLiveConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden sm:inline">Whop:</span>
              <span className="font-semibold">{whopLiveConnected ? 'Live' : 'Sandbox'}</span>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Horizontal Scroll Navigation */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
