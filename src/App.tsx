import React, { useState, useEffect, useCallback } from 'react';
import { Header, AppTab } from './components/Header';
import { DiscoverDemandView, DemandSignal } from './components/DiscoverDemandView';
import { CreatorScoutView, CreatorProfile } from './components/CreatorScoutView';
import { ProductStudioView, GeneratedProductBlueprint } from './components/ProductStudioView';
import { WhopPricingView } from './components/WhopPricingView';
import { OutreachPitchView } from './components/OutreachPitchView';
import { PartnerDeliveryView } from './components/PartnerDeliveryView';
import { WhopSupabaseIntegrationView } from './components/WhopSupabaseIntegrationView';
import { WorkflowStepperBar } from './components/WorkflowStepperBar';
import { SideMateLogo } from './components/SideMateLogo';
import { 
  WorkflowSession, 
  loadWorkflowSession, 
  saveWorkflowSession, 
  clearWorkflowSession 
} from './utils/workflowStorage';

const VALID_TABS: AppTab[] = ['discover', 'creators', 'product', 'pricing', 'outreach', 'delivery', 'settings'];

export function App() {
  // Load persistent session from localStorage on initial render
  const [session, setSession] = useState<WorkflowSession>(() => {
    const loaded = loadWorkflowSession();
    // Check if URL hash specifies a tab
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashTab = window.location.hash.replace('#', '') as AppTab;
      if (VALID_TABS.includes(hashTab)) {
        return { 
          ...loaded, 
          currentStage: hashTab,
          activeTab: hashTab 
        };
      }
    }
    return {
      ...loaded,
      activeTab: loaded.currentStage
    };
  });

  const [whopLiveConnected, setWhopLiveConnected] = useState<boolean>(false);

  // Sync session changes directly to localStorage
  const updateSession = useCallback((updates: Partial<WorkflowSession>) => {
    setSession((prev) => {
      const nextSession: WorkflowSession = {
        ...prev,
        ...updates,
        currentStage: updates.currentStage || updates.activeTab || prev.currentStage,
        activeTab: updates.activeTab || updates.currentStage || prev.activeTab || prev.currentStage,
        lastSaved: Date.now(),
        lastUpdated: Date.now(),
      };
      saveWorkflowSession(nextSession);
      return nextSession;
    });
  }, []);

  // Handle tab switching and sync with URL hash
  const handleTabChange = useCallback((newTab: AppTab) => {
    setSession((prev) => {
      const nextSession: WorkflowSession = {
        ...prev,
        previousStage: prev.currentStage !== newTab ? prev.currentStage : prev.previousStage,
        currentStage: newTab,
        activeTab: newTab,
        lastSaved: Date.now(),
        lastUpdated: Date.now(),
      };
      saveWorkflowSession(nextSession);
      return nextSession;
    });

    if (typeof window !== 'undefined') {
      window.location.hash = newTab;
    }
  }, []);

  // Reset workflow session back to clean initial state
  const handleResetWorkflow = useCallback(() => {
    const cleanSession = clearWorkflowSession();
    setSession({
      ...cleanSession,
      activeTab: cleanSession.currentStage
    });
    if (typeof window !== 'undefined') {
      window.location.hash = 'discover';
    }
  }, []);

  // Browser navigation (back / forward buttons) support via hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hashTab = window.location.hash.replace('#', '') as AppTab;
      if (VALID_TABS.includes(hashTab) && hashTab !== session.currentStage) {
        setSession((prev) => {
          const next: WorkflowSession = { 
            ...prev, 
            currentStage: hashTab,
            activeTab: hashTab, 
            lastSaved: Date.now(),
            lastUpdated: Date.now() 
          };
          saveWorkflowSession(next);
          return next;
        });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [session.currentStage]);

  // Check Whop connection on initial load
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
    updateSession({
      selectedDemandSignal: signal,
      currentStage: 'creators',
      activeTab: 'creators',
      previousStage: 'discover',
      creatorNicheFilter: signal.niche,
    });
    if (typeof window !== 'undefined') window.location.hash = 'creators';
  };

  // Step 1: Discover -> Direct Product Studio
  const handleSelectForProduct = (signal: DemandSignal) => {
    updateSession({
      selectedDemandSignal: signal,
      currentStage: 'product',
      activeTab: 'product',
      previousStage: 'discover',
      productStudioData: {
        ...session.productStudioData,
        viralProblem: signal.viralProblem,
        niche: signal.niche,
        pricePoint: signal.suggestedPrice || session.productStudioData.pricePoint,
      },
    });
    if (typeof window !== 'undefined') window.location.hash = 'product';
  };

  // Step 2: Creator Scout -> Product Studio
  const handleSelectCreatorForProduct = (creator: CreatorProfile) => {
    updateSession({
      selectedCreator: creator,
      currentStage: 'product',
      activeTab: 'product',
      previousStage: 'creators',
      productStudioData: {
        ...session.productStudioData,
        creatorName: creator.name,
        creatorHandle: creator.handle,
        niche: creator.niche,
        viralProblem: session.selectedDemandSignal?.viralProblem || session.productStudioData.viralProblem,
      },
    });
    if (typeof window !== 'undefined') window.location.hash = 'product';
  };

  // Step 3: Product Studio -> Whop Pricing & Store
  const handleProceedToWhop = (blueprint: GeneratedProductBlueprint) => {
    updateSession({
      generatedBlueprint: blueprint,
      currentStage: 'pricing',
      activeTab: 'pricing',
      previousStage: 'product',
      whopPricingData: {
        ...session.whopPricingData,
        basePrice: blueprint.pricePoint,
        bumpPrice: blueprint.orderBumpPrice || session.whopPricingData.bumpPrice,
      },
    });
    if (typeof window !== 'undefined') window.location.hash = 'pricing';
  };

  // Step 4: Whop Pricing -> Pitch & Outreach
  const handleProceedToPitch = (whopData: { checkoutUrl: string; productTitle: string; price: number }) => {
    updateSession({
      checkoutUrl: whopData.checkoutUrl,
      currentStage: 'outreach',
      activeTab: 'outreach',
      previousStage: 'pricing',
      whopPricingData: {
        ...session.whopPricingData,
        checkoutUrl: whopData.checkoutUrl,
        basePrice: whopData.price,
      },
    });
    if (typeof window !== 'undefined') window.location.hash = 'outreach';
  };

  // Step 5: Outreach -> Partner Delivery & Scaling
  const handleProceedToDelivery = () => {
    updateSession({
      currentStage: 'delivery',
      activeTab: 'delivery',
      previousStage: 'outreach',
    });
    if (typeof window !== 'undefined') window.location.hash = 'delivery';
  };

  const activeStage = session.currentStage || session.activeTab || 'discover';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sleek Header Navigation */}
      <Header 
        activeTab={activeStage} 
        setActiveTab={handleTabChange} 
        whopLiveConnected={whopLiveConnected} 
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Step-by-Step Workflow Navigation & Session Status Bar */}
        <WorkflowStepperBar
          currentStage={activeStage}
          session={session}
          onNavigateStage={handleTabChange}
          onResetWorkflow={handleResetWorkflow}
        />

        {/* Step 1: Demand Discovery */}
        {activeStage === 'discover' && (
          <DiscoverDemandView
            savedSignals={session.savedDemandSignals}
            onSignalsChange={(signals) => updateSession({ savedDemandSignals: signals })}
            initialSearchQuery={session.discoverSearch}
            initialCategory={session.discoverCategory}
            selectedSignalId={session.selectedDemandSignal?.id}
            onFiltersChange={(query, cat) => updateSession({
              discoverSearch: query,
              discoverCategory: cat,
            })}
            onSelectForCreators={handleSelectForCreators}
            onSelectForProduct={handleSelectForProduct}
          />
        )}

        {/* Step 2: Creator Scout */}
        {activeStage === 'creators' && (
          <CreatorScoutView
            initialDemandSignal={session.selectedDemandSignal}
            selectedCreator={session.selectedCreator}
            savedCreators={session.savedCreators}
            onCreatorsChange={(creators) => updateSession({ savedCreators: creators })}
            customCreators={session.customCreators}
            initialNicheFilter={session.creatorNicheFilter}
            initialSearchQuery={session.creatorSearch}
            onAddCustomCreator={(newCreator) => updateSession({
              customCreators: [newCreator, ...session.customCreators],
            })}
            onFiltersChange={(niche, query) => updateSession({
              creatorNicheFilter: niche,
              creatorSearch: query,
            })}
            onSelectCreatorForProduct={handleSelectCreatorForProduct}
            onBack={() => handleTabChange('discover')}
          />
        )}

        {/* Step 3: Product Studio */}
        {activeStage === 'product' && (
          <ProductStudioView
            selectedCreator={session.selectedCreator}
            selectedDemandSignal={session.selectedDemandSignal}
            savedData={session.productStudioData}
            onUpdateStudioData={(studioData) => updateSession({
              productStudioData: studioData,
              generatedBlueprint: studioData.blueprint || session.generatedBlueprint,
            })}
            onProceedToWhop={handleProceedToWhop}
            onBackToCreators={() => handleTabChange('creators')}
          />
        )}

        {/* Step 4: Whop Pricing & 50/50 Splits */}
        {activeStage === 'pricing' && (
          <WhopPricingView
            blueprint={session.productStudioData?.blueprint || session.generatedBlueprint || null}
            savedPricingData={session.whopPricingData}
            onUpdatePricingData={(pricingData) => updateSession({
              whopPricingData: pricingData,
              checkoutUrl: pricingData.checkoutUrl || session.checkoutUrl,
            })}
            onProceedToPitch={handleProceedToPitch}
            onOpenSettings={() => handleTabChange('settings')}
            onBackToStudio={() => handleTabChange('product')}
          />
        )}

        {/* Step 5: Creator Pitch & Outreach */}
        {activeStage === 'outreach' && (
          <OutreachPitchView
            selectedCreator={session.selectedCreator}
            blueprint={session.productStudioData?.blueprint || session.generatedBlueprint}
            checkoutUrl={session.whopPricingData?.checkoutUrl || session.checkoutUrl}
            savedOutreachData={session.outreachData}
            onUpdateOutreachData={(outreachData) => updateSession({ outreachData })}
            onProceedToDelivery={handleProceedToDelivery}
            onBackToWhop={() => handleTabChange('pricing')}
          />
        )}

        {/* Step 6: Partner Distribution & Delivery */}
        {activeStage === 'delivery' && (
          <PartnerDeliveryView
            savedDeliveryData={session.deliveryData}
            onUpdateDeliveryData={(deliveryData) => updateSession({ deliveryData })}
            onBackToOutreach={() => handleTabChange('outreach')}
          />
        )}

        {/* Platform Settings & Integration Hub */}
        {activeStage === 'settings' && (
          <WhopSupabaseIntegrationView
            onBack={() => handleTabChange(session.previousStage || 'discover')}
          />
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
