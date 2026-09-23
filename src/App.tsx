import React, { useState, useEffect } from 'react';
import { Header, AppTab } from './components/Header';
import { DiscoverDemandView, DemandSignal } from './components/DiscoverDemandView';
import { CreatorScoutView, CreatorProfile } from './components/CreatorScoutView';
import { ProductStudioView, GeneratedProductBlueprint } from './components/ProductStudioView';
import { WhopPricingView } from './components/WhopPricingView';
import { OutreachPitchView } from './components/OutreachPitchView';
import { PartnerDeliveryView } from './components/PartnerDeliveryView';
import { WhopSupabaseIntegrationView } from './components/WhopSupabaseIntegrationView';
import { SideMateLogo } from './components/SideMateLogo';

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('discover');
  
  // Shared Workflow State
  const [selectedDemandSignal, setSelectedDemandSignal] = useState<DemandSignal | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile | null>(null);
  const [generatedBlueprint, setGeneratedBlueprint] = useState<GeneratedProductBlueprint | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');
  const [whopLiveConnected, setWhopLiveConnected] = useState<boolean>(false);

  // Check Whop connection on load
  useEffect(() => {
    fetch('/api/integrations/status')
      .then((res) => res.json())
      .then((data) => {
        if (data?.whop?.connected) {
          setWhopLiveConnected(true);
        }
      })
      .catch((err) => console.log('Status check note:', err.message));
  }, []);

  // Step 1: Discover -> Find Creators
  const handleSelectForCreators = (signal: DemandSignal) => {
    setSelectedDemandSignal(signal);
    setActiveTab('creators');
  };

  // Step 1: Discover -> Direct Product Studio
  const handleSelectForProduct = (signal: DemandSignal) => {
    setSelectedDemandSignal(signal);
    setActiveTab('product');
  };

  // Step 2: Creator Scout -> Product Studio
  const handleSelectCreatorForProduct = (creator: CreatorProfile) => {
    setSelectedCreator(creator);
    setActiveTab('product');
  };

  // Step 3: Product Studio -> Whop Pricing & Store
  const handleProceedToWhop = (blueprint: GeneratedProductBlueprint) => {
    setGeneratedBlueprint(blueprint);
    setActiveTab('pricing');
  };

  // Step 4: Whop Pricing -> Pitch & Outreach
  const handleProceedToPitch = (whopData: { checkoutUrl: string; productTitle: string; price: number }) => {
    setCheckoutUrl(whopData.checkoutUrl);
    setActiveTab('outreach');
  };

  // Step 5: Outreach -> Partner Delivery & Scaling
  const handleProceedToDelivery = () => {
    setActiveTab('delivery');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sleek Header Navigation */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        whopLiveConnected={whopLiveConnected} 
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'discover' && (
          <DiscoverDemandView
            onSelectForCreators={handleSelectForCreators}
            onSelectForProduct={handleSelectForProduct}
          />
        )}

        {activeTab === 'creators' && (
          <CreatorScoutView
            initialDemandSignal={selectedDemandSignal}
            onSelectCreatorForProduct={handleSelectCreatorForProduct}
          />
        )}

        {activeTab === 'product' && (
          <ProductStudioView
            selectedCreator={selectedCreator}
            selectedDemandSignal={selectedDemandSignal}
            onProceedToWhop={handleProceedToWhop}
          />
        )}

        {activeTab === 'pricing' && (
          <WhopPricingView
            blueprint={generatedBlueprint}
            onProceedToPitch={handleProceedToPitch}
            onOpenSettings={() => setActiveTab('settings')}
          />
        )}

        {activeTab === 'outreach' && (
          <OutreachPitchView
            selectedCreator={selectedCreator}
            blueprint={generatedBlueprint}
            checkoutUrl={checkoutUrl}
            onProceedToDelivery={handleProceedToDelivery}
          />
        )}

        {activeTab === 'delivery' && (
          <PartnerDeliveryView />
        )}

        {activeTab === 'settings' && (
          <WhopSupabaseIntegrationView />
        )}
      </main>

      {/* Modern, Minimal Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950 py-6 text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SideMateLogo size="sm" showText={false} />
            <span className="font-semibold text-white">SideMate</span>
            <span>•</span>
            <span className="text-slate-400">Personal Digital Product &amp; Creator Distribution OS</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>Whop API v5 &amp; Automated 50/50 Splits</span>
            <span>•</span>
            <span>AI Curriculum Synthesis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
