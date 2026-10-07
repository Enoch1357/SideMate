import { DemandSignal } from '../components/DiscoverDemandView';
import { CreatorProfile } from '../components/CreatorScoutView';
import { GeneratedProductBlueprint } from '../components/ProductStudioView';
import type { ProductFormat } from '../types';
import { AppTab } from '../components/Header';

export interface WorkflowSession {
  currentStage: AppTab;
  activeTab?: AppTab;
  previousStage: AppTab | null;
  selectedDemandSignal: DemandSignal | null;
  selectedCreator: CreatorProfile | null;
  generatedBlueprint?: GeneratedProductBlueprint | null;
  checkoutUrl?: string;
  customCreators: CreatorProfile[];
  savedDemandSignals: DemandSignal[];
  savedCreators: CreatorProfile[];
  
  // Discover Demand Filters
  discoverCategory: string;
  discoverSearch: string;

  // Creator Scout Filters
  creatorNicheFilter: string;
  creatorSearch: string;

  // Product Studio State
  productStudioData: {
    creatorName: string;
    creatorHandle: string;
    niche: string;
    viralProblem: string;
    productFormat: string;
    includedFormats?: ProductFormat[];
    pricePoint: number;
    blueprint: GeneratedProductBlueprint | null;
    activePillarIndex: number;
  };

  // Whop Pricing State
  whopPricingData: {
    basePrice: number;
    includeBump: boolean;
    bumpPrice: number;
    operatorSplitPct: number;
    publishedData: {
      success: boolean;
      productId: string;
      checkoutUrl: string;
      contractType: string;
      pricing: {
        basePrice: number;
        orderBumpPrice: number;
        grossTotal: number;
        whopProcessingFee: number;
        netRevenue: number;
        creatorPayout: number;
        operatorPayout: number;
      };
      splitRules: {
        creatorSharePercent: number;
        operatorSharePercent: number;
        payoutSchedule: string;
        autoRouteEnabled: boolean;
      };
    } | null;
    checkoutUrl: string;
  };

  // Outreach Pitch State
  outreachData: {
    activeTab: 'dm' | 'loom' | 'email';
    pipelineStatus: 'ready' | 'pitched' | 'positive' | 'live';
  };

  // Delivery & Hub State
  deliveryData: {
    salesEvents: Array<{
      id: string;
      timestamp: string;
      customerEmail: string;
      productTitle: string;
      creatorHandle: string;
      grossAmount: number;
      orderBump: boolean;
      whopFee: number;
      creatorPayout: number;
      operatorPayout: number;
      deliveryStatus: string;
    }>;
    partnerCount: number;
    dailySalesPerPartner: number;
  };

  lastSaved: number;
  lastUpdated?: number;
}

export const DEFAULT_WORKFLOW_SESSION: WorkflowSession = {
  currentStage: 'discover',
  previousStage: null,
  selectedDemandSignal: null,
  selectedCreator: null,
  customCreators: [],
  savedDemandSignals: [],
  savedCreators: [],
  discoverCategory: 'all',
  discoverSearch: '',
  creatorNicheFilter: 'all',
  creatorSearch: '',
  productStudioData: {
    creatorName: '',
    creatorHandle: '',
    niche: '',
    viralProblem: '',
    productFormat: 'Actionable PDF Guide',
    includedFormats: [],
    pricePoint: 27,
    blueprint: null,
    activePillarIndex: 0,
  },
  whopPricingData: {
    basePrice: 27,
    includeBump: true,
    bumpPrice: 17,
    operatorSplitPct: 50,
    publishedData: null,
    checkoutUrl: '',
  },
  outreachData: {
    activeTab: 'dm',
    pipelineStatus: 'ready',
  },
  deliveryData: {
    salesEvents: [],
    partnerCount: 3,
    dailySalesPerPartner: 2,
  },
  lastSaved: Date.now(),
};

const STORAGE_KEY = 'sidemate_workflow_session_v3';

export function loadWorkflowSession(): WorkflowSession {
  try {
    // Check sessionStorage first, then fallback to localStorage
    const saved = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to guarantee all fields exist even if schema evolved
      return {
        ...DEFAULT_WORKFLOW_SESSION,
        ...parsed,
        productStudioData: {
          ...DEFAULT_WORKFLOW_SESSION.productStudioData,
          ...(parsed.productStudioData || {}),
        },
        whopPricingData: {
          ...DEFAULT_WORKFLOW_SESSION.whopPricingData,
          ...(parsed.whopPricingData || {}),
        },
        outreachData: {
          ...DEFAULT_WORKFLOW_SESSION.outreachData,
          ...(parsed.outreachData || {}),
        },
        deliveryData: {
          ...DEFAULT_WORKFLOW_SESSION.deliveryData,
          ...(parsed.deliveryData || {}),
        },
      };
    }
  } catch (err) {
    console.warn('Failed to parse saved workflow session:', err);
  }
  return DEFAULT_WORKFLOW_SESSION;
}

export function saveWorkflowSession(session: WorkflowSession): void {
  try {
    const updated = {
      ...session,
      lastSaved: Date.now(),
    };
    const serialized = JSON.stringify(updated);
    sessionStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('Failed to save workflow session:', err);
  }
}

export function clearWorkflowSession(): WorkflowSession {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear workflow session:', err);
  }
  return { ...DEFAULT_WORKFLOW_SESSION, lastSaved: Date.now() };
}
