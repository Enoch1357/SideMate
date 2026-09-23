/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { LivePrototypeView } from './components/LivePrototypeView';
import { Video3ImplementationView } from './components/Video3ImplementationView';
import { WebinarBreakdownView } from './components/WebinarBreakdownView';
import { TechStackCloneView } from './components/TechStackCloneView';
import { ArchitectureSpecView } from './components/ArchitectureSpecView';
import { WhopSupabaseIntegrationView } from './components/WhopSupabaseIntegrationView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'prototype' | 'video3' | 'webinars' | 'tech' | 'architecture' | 'integrations'>('prototype');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'prototype' && <LivePrototypeView onOpenIntegrations={() => setActiveTab('integrations')} />}
        {activeTab === 'integrations' && <WhopSupabaseIntegrationView />}
        {activeTab === 'video3' && <Video3ImplementationView />}
        {activeTab === 'webinars' && <WebinarBreakdownView />}
        {activeTab === 'tech' && <TechStackCloneView />}
        {activeTab === 'architecture' && <ArchitectureSpecView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">3DS Automator Platform</span>
            <span>•</span>
            <span>AI Digital Product &amp; Whop Creator Distribution OS</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Whop API v5 &amp; Automated 50/50 Splits</span>
            <span>•</span>
            <span>Gemini 3.8 Flash Synthesis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
