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

/* ============================================================================
 * Stage 3 — Product Studio: Unified Enhanced Blueprint Schema
 * ----------------------------------------------------------------------------
 * The interfaces below power the enhanced Product Studio. They support all five
 * product formats and resolve the historical pillars/curatedModules mismatch.
 * Existing types above are preserved for backward compatibility with other views.
 * ==========================================================================*/

export type ProductFormat =
  | 'pdf_guide'
  | 'ebook'
  | 'checklist'
  | 'notion_template'
  | 'audio_walkthrough';

export interface ProductResource {
  title: string;
  url: string;
  description: string;
}

export interface ProductPillar {
  pillarNumber: number;
  title: string;
  objective: string;
  keyActionItem: string;
  /** Rich, expert-synthesized content (400-600 words per pillar). */
  fullContentMarkdown: string;
  /** Prompt for generating a relevant illustration for this section. */
  illustrationPrompt?: string;
  /** Useful, credible expert resources related to this pillar. */
  resources?: ProductResource[];
}

export interface ChecklistItem {
  text: string;
  /** e.g., "My target: ___" for fillable/printable versions. */
  fillableField?: string;
  isRequired: boolean;
}

export interface ChecklistSection {
  sectionTitle: string;
  items: ChecklistItem[];
}

export interface PrintableChecklist {
  title: string;
  subtitle: string;
  sections: ChecklistSection[];
}

export interface NotionDatabaseProperty {
  name: string;
  type: string;
  description: string;
}

export interface NotionDatabase {
  name: string;
  properties: NotionDatabaseProperty[];
}

export interface NotionPage {
  title: string;
  content: string;
  icon: string;
}

export interface NotionTemplate {
  title: string;
  description: string;
  databases: NotionDatabase[];
  pages: NotionPage[];
}

export interface AudioTrack {
  trackNumber: number;
  title: string;
  durationMinutes: number;
  /** Full narration script, natural spoken language. */
  script: string;
  keyPoints: string[];
}

export interface AudioWalkthrough {
  title: string;
  totalDurationMinutes: number;
  tracks: AudioTrack[];
}

export interface BlueprintCoverDesign {
  headline: string;
  subheadline: string;
  /** Hex accent color used to theme the PDF and preview UI. */
  accentColor: string;
  /** e.g., ["clean", "professional", "warm", "scientific"]. */
  styleKeywords: string[];
  /** Prompt for AI cover image generation. */
  coverImagePrompt: string;
}

export interface BlueprintOrderBump {
  title: string;
  description: string;
  price: number;
  format: ProductFormat;
  valueProposition: string;
}

export interface ExpertSource {
  domain: string; // e.g., "Sleep Science", "Physical Therapy"
  credentialTypes: string[]; // e.g., ["MD", "PhD", "Certified Practitioner"]
  keyInsightSynthesized: string;
}

/**
 * Unified enhanced blueprint returned by the OpenRouter LLM engine (server/llm.ts).
 * Includes legacy-compatible fields so existing views continue to function.
 */
export interface EnhancedProductBlueprint {
  // Core identity
  productTitle: string;
  productSubtitle: string;
  tagline: string;
  targetAudience: string;
  coreProblemSolved: string;

  // Format configuration
  primaryFormat: ProductFormat;
  includedFormats: ProductFormat[];

  // Pricing
  price: number;

  // Cover design
  coverDesign: BlueprintCoverDesign;

  // Core content pillars (4 expert pillars)
  pillars: ProductPillar[];

  // Additional product assets
  printableChecklist?: PrintableChecklist;
  notionTemplate?: NotionTemplate;
  audioWalkthrough?: AudioWalkthrough;

  // Order bump
  orderBump?: BlueprintOrderBump;

  // Expert synthesis metadata
  expertSources: ExpertSource[];

  // Attribution / meta
  creatorAttribution?: string;
  engineUsed?: string;

  // Legacy compatibility (alias for pillars)
  curatedModules?: ProductPillar[];
}

