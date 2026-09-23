export interface VideoAnalysis {
  id: string;
  youtubeId: string;
  title: string;
  speaker: string;
  durationApprox: string;
  primaryRole: 'Strategic Context' | 'Mindset & Model' | 'Core Implementation' | 'Tooling & Sequence' | 'Knowledge Synthesis & Pricing';
  coreTakeaways: string[];
  workflowStage: string;
  technologiesDemonstrated: {
    name: string;
    category: string;
    whatItDoesSpecifically: string;
    limitationOrConstraint: string;
    customCloneAlternative: string;
  }[];
  detailedBreakdown: string;
  actionableRules: string[];
  quotesAndMetrics: string[];
}

export interface TechStageBreakdown {
  stageNumber: number;
  stageName: string;
  objective: string;
  webinarTech: string;
  whatItDoesSpecifically: string;
  customCloneArchitecture: {
    recommendedStack: string[];
    coreMechanism: string;
    apiEndpoints: string[];
    dataModel: string;
    samplePromptOrCode: string;
  };
}

export interface CreatorPreset {
  id: string;
  handle: string;
  name: string;
  niche: string;
  followerCount: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube Shorts';
  viralProblem: string;
  productType: 'E-Book / Protocol Guide' | 'Notion Operating System' | 'Cheat Sheet & Checklist Kit' | 'Calculator & Meal Planner' | 'Mini-Course Toolkit';
  suggestedPrice: number;
  expectedMonthlySales: number;
  creatorAudienceTone: string;
  samplePostHook: string;
}

export interface WhopProductConfig {
  whopProductId: string;
  companyId: string;
  title: string;
  tagline: string;
  price: number;
  orderBumpPrice: number;
  orderBumpTitle: string;
  operatorSplitPct: number;
  creatorAffiliateSplitPct: number;
  creatorWhopHandle: string;
  whopCheckoutUrl: string;
  whopPreviewSlug: string;
  deliveryFormat: 'Whop Digital Pass' | 'Notion Template + PDF' | 'Whop File Portal';
  whopPerks: string[];
  isLiveSynced: boolean;
}

export interface WhopSaleEvent {
  id: string;
  timestamp: string;
  customerEmail: string;
  productTitle: string;
  grossAmount: number;
  orderBumpIncluded: boolean;
  whopFee: number;
  netAmount: number;
  creatorPayout: number;
  operatorPayout: number;
  deliveryStatus: 'Access Granted' | 'Email Dispatched' | 'Whop Hub Unlocked';
}

export interface GeneratedCurriculumModule {
  moduleNumber: number;
  title: string;
  deliverables: string[];
  summary: string;
  fullContentMarkdown: string;
}

export interface GeneratedProductBlueprint {
  productTitle: string;
  subtitle: string;
  productType: string;
  targetAudience: string;
  viralProblemSolved: string;
  suggestedPricePoint: number;
  orderBumpTitle: string;
  orderBumpPrice: number;
  valueProposition: string;
  curatedModules: GeneratedCurriculumModule[];
  printableChecklist: string[];
  faqItems: { question: string; answer: string }[];
  marketingHook: string;
  personalizedOutreachPitch: string;
  whopConfig: WhopProductConfig;
  engineUsed?: string;
}

