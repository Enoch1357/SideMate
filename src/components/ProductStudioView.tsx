import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  FileText, 
  BookOpen, 
  CheckSquare, 
  Layers, 
  Download, 
  Copy, 
  Check, 
  ArrowRight, 
  RefreshCw, 
  Headphones,
  Palette,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import { CreatorProfile } from './CreatorScoutView';
import { DemandSignal } from './DiscoverDemandView';
import type {
  ProductFormat,
  ProductResource,
  PrintableChecklist,
  BlueprintCoverDesign,
  BlueprintOrderBump,
  ExpertSource,
  NotionTemplate,
  AudioWalkthrough,
} from '../types';

export interface GeneratedCurriculumPillar {
  pillarNumber: number;
  title: string;
  objective: string;
  keyActionItem: string;
  fullContentMarkdown: string;
  illustrationPrompt?: string;
  resources?: ProductResource[];
}

export interface GeneratedProductBlueprint {
  productTitle: string;
  subtitle: string;
  creatorAttribution: string;
  formatType: string;
  pricePoint: number;
  orderBumpTitle: string;
  orderBumpPrice: number;
  pillars: GeneratedCurriculumPillar[];
  /** Flattened checklist items for the legacy checklist UI. */
  printableChecklist: string[];
  faqItems: { question: string; answer: string }[];
  marketingHook: string;
  personalizedOutreachPitch: string;
  whopConfig?: any;
  engineUsed?: string;

  // ---- Enhanced (Stage 3) fields, carried through for rich preview + PDF ----
  productSubtitle?: string;
  tagline?: string;
  targetAudience?: string;
  coreProblemSolved?: string;
  primaryFormat?: ProductFormat;
  includedFormats?: ProductFormat[];
  price?: number;
  coverDesign?: BlueprintCoverDesign;
  printableChecklistData?: PrintableChecklist;
  notionTemplate?: NotionTemplate;
  audioWalkthrough?: AudioWalkthrough;
  orderBump?: BlueprintOrderBump;
  expertSources?: ExpertSource[];
}

/** Flatten an enhanced PrintableChecklist (or legacy string[]) into display strings. */
const flattenChecklist = (raw: any): string[] => {
  if (Array.isArray(raw?.printableChecklistItems) && raw.printableChecklistItems.length > 0) {
    return raw.printableChecklistItems.map((x: any) => String(x));
  }
  if (Array.isArray(raw?.printableChecklist) && raw.printableChecklist.length > 0) {
    return raw.printableChecklist.map((x: any) => String(x));
  }
  const cl = raw?.printableChecklist || raw?.printableChecklistData;
  if (cl && Array.isArray(cl.sections)) {
    const flat: string[] = [];
    cl.sections.forEach((s: any) =>
      (s.items || []).forEach((it: any) => flat.push(String(it?.text ?? it)))
    );
    if (flat.length > 0) return flat;
  }
  return [];
};

export const normalizeBlueprint = (
  raw: any,
  defaults?: { creatorName?: string; creatorHandle?: string; productFormat?: string; pricePoint?: number }
): GeneratedProductBlueprint | null => {
  if (!raw || typeof raw !== 'object') return null;

  let pillars: GeneratedCurriculumPillar[] = [];
  if (Array.isArray(raw.pillars) && raw.pillars.length > 0) {
    pillars = raw.pillars.map((p: any, idx: number) => ({
      pillarNumber: p.pillarNumber || idx + 1,
      title: p.title || `Pillar 0${idx + 1}`,
      objective: p.objective || 'Immediate core transformation',
      keyActionItem: p.keyActionItem || 'Execute daily non-negotiable step',
      fullContentMarkdown: p.fullContentMarkdown || p.summary || '',
    }));
  } else if (Array.isArray(raw.curatedModules) && raw.curatedModules.length > 0) {
    pillars = raw.curatedModules.map((m: any, idx: number) => ({
      pillarNumber: m.pillarNumber || m.moduleNumber || idx + 1,
      title: m.title || `Pillar 0${idx + 1}`,
      objective: m.objective || m.summary || 'Immediate core transformation',
      keyActionItem: m.keyActionItem || (Array.isArray(m.deliverables) && m.deliverables[0]) || 'Execute daily non-negotiable step',
      fullContentMarkdown: m.fullContentMarkdown || m.summary || '',
    }));
  }

  if (pillars.length === 0) {
    pillars = [
      {
        pillarNumber: 1,
        title: 'Core Diagnosis & Root Cause',
        objective: 'Identify key constraints and eliminate hidden friction triggers',
        keyActionItem: 'Complete the 3-minute baseline audit',
        fullContentMarkdown: 'Audit baseline habits and isolate root triggers before beginning the daily protocol.',
      },
      {
        pillarNumber: 2,
        title: 'The Core Execution Protocol',
        objective: 'Execute high-impact daily routine with zero decision fatigue',
        keyActionItem: 'Lock in morning and evening sequence non-negotiables',
        fullContentMarkdown: 'Step-by-step phased execution plan designed for rapid, noticeable transformation.',
      },
      {
        pillarNumber: 3,
        title: '1-Page Daily Action Checklist',
        objective: 'Eliminate overthinking with single-sheet compliance tracker',
        keyActionItem: 'Check off morning non-negotiables before 10:00 AM',
        fullContentMarkdown: 'Keep this 1-page tracker sheet on your refrigerator or lockscreen to maintain daily compliance.',
      },
      {
        pillarNumber: 4,
        title: 'Emergency Troubleshooting & FAQs',
        objective: 'Navigate disruptions and schedule edge cases without falling off',
        keyActionItem: 'Use 2-minute reset drill during high-stress disruptions',
        fullContentMarkdown: 'Direct answers to top audience objections and emergency protocols for travel and schedule shifts.',
      },
    ];
  }

  let printableChecklist = flattenChecklist(raw);
  if (printableChecklist.length === 0) {
    printableChecklist = [
      'Complete 3-minute diagnostic assessment',
      'Execute morning non-negotiable sequence',
      'Midday consistency and hydration check',
      'Evening wind-down routine',
      'Record completion in 1-page action tracker',
    ];
  }

  const creatorName = raw.creatorAttribution || raw.creatorName || defaults?.creatorName || 'Partner Creator';
  const formatType = raw.formatType || raw.productType || defaults?.productFormat || 'Actionable PDF Guide';
  const pricePoint = Number(raw.pricePoint ?? raw.suggestedPricePoint ?? raw.price ?? defaults?.pricePoint ?? 27);

  // The enhanced checklist object (with sections/fillable fields), if provided.
  const printableChecklistData: PrintableChecklist | undefined =
    raw.printableChecklistData ||
    (raw.printableChecklist && !Array.isArray(raw.printableChecklist) && Array.isArray(raw.printableChecklist.sections)
      ? raw.printableChecklist
      : undefined);

  return {
    productTitle: raw.productTitle || 'The Actionable Reset Protocol',
    subtitle: raw.subtitle || raw.productSubtitle || 'A 14-Day Structured System for Rapid Transformation',
    creatorAttribution: creatorName,
    formatType,
    pricePoint,
    orderBumpTitle: raw.orderBumpTitle || raw.orderBump?.title || 'Audio Walkthrough & Notion Dashboard',
    orderBumpPrice: Number(raw.orderBumpPrice ?? raw.orderBump?.price ?? 17),
    pillars,
    printableChecklist,
    faqItems: Array.isArray(raw.faqItems) ? raw.faqItems : [],
    marketingHook: raw.marketingHook || raw.tagline || '',
    personalizedOutreachPitch: raw.personalizedOutreachPitch || '',
    whopConfig: raw.whopConfig || null,
    engineUsed: raw.engineUsed,

    // ---- Enhanced passthrough fields ----
    productSubtitle: raw.productSubtitle || raw.subtitle,
    tagline: raw.tagline,
    targetAudience: raw.targetAudience,
    coreProblemSolved: raw.coreProblemSolved,
    primaryFormat: raw.primaryFormat,
    includedFormats: Array.isArray(raw.includedFormats) ? raw.includedFormats : undefined,
    price: Number(raw.price ?? pricePoint),
    coverDesign: raw.coverDesign,
    printableChecklistData,
    notionTemplate: raw.notionTemplate,
    audioWalkthrough: raw.audioWalkthrough,
    orderBump: raw.orderBump,
    expertSources: Array.isArray(raw.expertSources) ? raw.expertSources : undefined,
  };
};

// The five supported product formats, shown as toggle-chips.
const FORMAT_OPTIONS: Array<{ token: ProductFormat; label: string; icon: any; desc: string }> = [
  { token: 'pdf_guide', label: 'PDF Guide', icon: FileText, desc: 'Step-by-step actionable protocol' },
  { token: 'ebook', label: 'Ebook', icon: BookOpen, desc: 'Comprehensive deep-dive curriculum' },
  { token: 'checklist', label: 'Checklist', icon: CheckSquare, desc: 'Printable quick-reference sheet' },
  { token: 'notion_template', label: 'Notion Template', icon: Layers, desc: 'Interactive workspace hub' },
  { token: 'audio_walkthrough', label: 'Audio Walkthrough', icon: Headphones, desc: 'Guided narrated companion' },
];

const FORMAT_TOKEN_LABELS: Record<ProductFormat, string> = {
  pdf_guide: 'PDF Guide',
  ebook: 'Ebook',
  checklist: 'Printable Checklist',
  notion_template: 'Notion Template',
  audio_walkthrough: 'Audio Walkthrough',
};

// Map legacy display labels (or tokens) to a ProductFormat token.
function labelToFormatToken(input?: string): ProductFormat {
  if (!input) return 'pdf_guide';
  const key = input.trim().toLowerCase();
  const map: Record<string, ProductFormat> = {
    'actionable pdf guide': 'pdf_guide',
    'pdf guide': 'pdf_guide',
    'pdf': 'pdf_guide',
    'pdf_guide': 'pdf_guide',
    'full ebook': 'ebook',
    'full digital ebook': 'ebook',
    'ebook': 'ebook',
    'printable checklist': 'checklist',
    'printable checklist & routine': 'checklist',
    'checklist': 'checklist',
    'interactive notion hub': 'notion_template',
    'notion digital hub': 'notion_template',
    'notion template': 'notion_template',
    'notion_template': 'notion_template',
    'notion': 'notion_template',
    'audio walkthrough': 'audio_walkthrough',
    'audio_walkthrough': 'audio_walkthrough',
    'audio': 'audio_walkthrough',
  };
  return map[key] || 'pdf_guide';
}

interface ProductStudioViewProps {
  selectedCreator?: CreatorProfile | null;
  selectedDemandSignal?: DemandSignal | null;
  savedData?: {
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
  onUpdateStudioData?: (data: {
    creatorName: string;
    creatorHandle: string;
    niche: string;
    viralProblem: string;
    productFormat: string;
    includedFormats?: ProductFormat[];
    pricePoint: number;
    blueprint: GeneratedProductBlueprint | null;
    activePillarIndex: number;
  }) => void;
  onProceedToWhop: (blueprint: GeneratedProductBlueprint) => void;
  onBackToCreators?: () => void;
}

export const ProductStudioView: React.FC<ProductStudioViewProps> = ({
  selectedCreator,
  selectedDemandSignal,
  savedData,
  onUpdateStudioData,
  onProceedToWhop,
  onBackToCreators,
}) => {
  // Inputs with robust fallback hierarchy (savedData -> selectedCreator -> selectedDemandSignal -> defaults)
  const [creatorName, setCreatorName] = useState(
    savedData?.creatorName || selectedCreator?.name || 'Dr. Elena Miller, MD'
  );
  const [creatorHandle, setCreatorHandle] = useState(
    savedData?.creatorHandle || selectedCreator?.handle || '@dr.toddler_wellness'
  );
  const [niche, setNiche] = useState(
    savedData?.niche || selectedCreator?.niche || selectedDemandSignal?.niche || 'Parenting & Toddler Health'
  );
  const [viralProblem, setViralProblem] = useState(
    savedData?.viralProblem ||
    selectedCreator?.audiencePain || 
    selectedDemandSignal?.viralProblem || 
    'Toddler 2-year sleep regression and frequent 3 AM night waking'
  );
  const [productFormat, setProductFormat] = useState<ProductFormat>(
    labelToFormatToken(
      savedData?.productFormat ||
      selectedCreator?.recommendedFormat || selectedDemandSignal?.recommendedFormat || 'pdf_guide'
    )
  );
  const [addOnFormats, setAddOnFormats] = useState<ProductFormat[]>(
    Array.isArray((savedData as any)?.includedFormats)
      ? ((savedData as any).includedFormats as ProductFormat[]).filter((f) => f !== productFormat)
      : []
  );
  const [pricePoint, setPricePoint] = useState<number>(
    savedData?.pricePoint ||
    selectedCreator?.suggestedPrice || selectedDemandSignal?.suggestedPrice || 27
  );

  // Studio State
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [blueprint, setBlueprint] = useState<GeneratedProductBlueprint | null>(() => 
    savedData?.blueprint ? normalizeBlueprint(savedData.blueprint, { creatorName, creatorHandle, productFormat, pricePoint }) : null
  );
  const [activePillarIndex, setActivePillarIndex] = useState<number>(
    savedData?.activePillarIndex || 0
  );
  const [copiedText, setCopiedText] = useState(false);

  // Step-by-step progress messages while generating
  const PROGRESS_MESSAGES = [
    'Synthesizing expert insights...',
    'Structuring content pillars...',
    'Building checklist...',
    'Finalizing blueprint...',
  ];

  useEffect(() => {
    if (isGenerating) {
      setProgressStep(0);
      progressTimer.current = setInterval(() => {
        setProgressStep((s) => (s + 1) % PROGRESS_MESSAGES.length);
      }, 2000);
    } else if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
      }
    };
  }, [isGenerating]);

  // Sync blueprint if savedData changes in session
  useEffect(() => {
    if (savedData?.blueprint) {
      setBlueprint(normalizeBlueprint(savedData.blueprint, { creatorName, creatorHandle, productFormat, pricePoint }));
    }
  }, [savedData?.blueprint]);

  // Sync to workflow session whenever studio state changes
  const notifyUpdate = (overrides?: Partial<{
    creatorName: string;
    creatorHandle: string;
    niche: string;
    viralProblem: string;
    productFormat: string;
    includedFormats: ProductFormat[];
    pricePoint: number;
    blueprint: GeneratedProductBlueprint | null;
    activePillarIndex: number;
  }>) => {
    if (!onUpdateStudioData) return;
    onUpdateStudioData({
      creatorName,
      creatorHandle,
      niche,
      viralProblem,
      productFormat,
      includedFormats: [productFormat, ...addOnFormats],
      pricePoint,
      blueprint,
      activePillarIndex,
      ...overrides,
    });
  };

  const toggleAddOn = (token: ProductFormat) => {
    if (token === productFormat) return; // primary can't be an add-on
    setAddOnFormats((prev) =>
      prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setPdfError(null);
    try {
      const includedFormats = Array.from(new Set<ProductFormat>([productFormat, ...addOnFormats]));
      const res = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorHandle,
          creatorName,
          niche,
          viralProblem,
          productFormat,
          includedFormats,
          pricePoint,
        }),
      });

      const data = await res.json();
      const normalized = normalizeBlueprint(data, { creatorName, creatorHandle, productFormat, pricePoint });
      setBlueprint(normalized);
      setActivePillarIndex(0);
      notifyUpdate({ blueprint: normalized, activePillarIndex: 0 });
    } catch (err) {
      console.error('Failed to generate product blueprint:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!blueprint) return;
    let fullDoc = `# ${blueprint.productTitle}\n## ${blueprint.subtitle}\nBy ${blueprint.creatorAttribution}\n\n`;
    fullDoc += `### Target Audience Hook\n${blueprint.marketingHook}\n\n---\n\n`;
    (blueprint.pillars || []).forEach((p) => {
      fullDoc += `## Pillar ${p.pillarNumber}: ${p.title}\n*Objective:* ${p.objective}\n*Action Item:* ${p.keyActionItem}\n\n${p.fullContentMarkdown}\n\n---\n\n`;
    });
    fullDoc += `## Printable Checklist\n`;
    (blueprint.printableChecklist || []).forEach((c) => {
      fullDoc += `- [ ] ${c}\n`;
    });
    navigator.clipboard.writeText(fullDoc);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (!blueprint) return;
    setIsDownloadingPdf(true);
    setPdfError(null);
    try {
      const res = await fetch('/api/generate-product-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprint,
          creatorName,
          creatorHandle,
          accentColor: blueprint.coverDesign?.accentColor,
        }),
      });
      if (!res.ok) throw new Error(`PDF request failed with status ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeTitle = (blueprint.productTitle || 'product-blueprint')
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
      a.download = `${safeTitle || 'product-blueprint'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download product PDF:', err);
      setPdfError('PDF generation failed. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-6 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap mb-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Step 3: AI Product Studio &amp; Curriculum Builder</span>
          </div>
          {onBackToCreators && (
            <button
              onClick={onBackToCreators}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              ← Back to Creators
            </button>
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Create Personalized Digital Products
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Synthesize full Ebooks, Actionable PDF Guides, Printable Checklists, and Notion Systems personalized for your partner creator. You do 100% of the build so they have zero friction to say yes.
        </p>
      </div>

      {/* Configuration & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Creator and Format Config */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              Creator Personalization
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Partner Creator
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Creator Name"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={creatorHandle}
                  onChange={(e) => setCreatorHandle(e.target.value)}
                  placeholder="@handle"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Niche &amp; Category
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Pediatric Sleep"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Target Audience Problem
              </label>
              <textarea
                rows={2}
                value={viralProblem}
                onChange={(e) => setViralProblem(e.target.value)}
                placeholder="Specific problem to solve..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-2">
                Primary Product Format
              </label>
              <div className="flex flex-wrap gap-1.5">
                {FORMAT_OPTIONS.map((f) => {
                  const Icon = f.icon;
                  const isSelected = productFormat === f.token;
                  return (
                    <button
                      key={f.token}
                      type="button"
                      title={f.desc}
                      onClick={() => {
                        setProductFormat(f.token);
                        setAddOnFormats((prev) => prev.filter((t) => t !== f.token));
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-950/70 border-indigo-600 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span>{f.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">
                {FORMAT_OPTIONS.find((f) => f.token === productFormat)?.desc}
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-2">
                Bundle Add-On Formats <span className="text-slate-600 font-normal">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {FORMAT_OPTIONS.filter((f) => f.token !== productFormat).map((f) => {
                  const Icon = f.icon;
                  const isOn = addOnFormats.includes(f.token);
                  return (
                    <button
                      key={f.token}
                      type="button"
                      title={f.desc}
                      onClick={() => toggleAddOn(f.token)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                        isOn
                          ? 'bg-teal-950/60 border-teal-600 text-teal-100 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isOn ? 'text-teal-400' : 'text-slate-500'}`} />
                      <span>{f.label}</span>
                      {isOn && <Check className="w-3 h-3 text-teal-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-slate-400">
                  Ideal Suggested Price
                </label>
                <span className="text-xs font-bold text-emerald-400">${pricePoint}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
                {[19, 27, 37, 47].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPricePoint(p)}
                    className={`py-1.5 rounded-lg border transition-all cursor-pointer ${
                      pricePoint === p
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ${p}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{PROGRESS_MESSAGES[progressStep]}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{blueprint ? 'Regenerate Product' : 'Generate Digital Product'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Generated Product Blueprint & Live Preview */}
        <div className="lg:col-span-8">
          {blueprint ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
              {/* Product Header Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-semibold">
                      {blueprint.formatType || FORMAT_TOKEN_LABELS[productFormat]}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                      Suggested Price: ${blueprint.pricePoint || pricePoint}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-[10px]">
                      50/50 Split Ready
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {blueprint.productTitle}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {blueprint.subtitle}
                  </p>
                  <p className="text-[11px] text-teal-400 mt-1 font-medium">
                    Personalized for: {blueprint.creatorAttribution} ({creatorHandle})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyMarkdown}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                    title="Copy Markdown"
                  >
                    {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedText ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5 disabled:opacity-50"
                    title="Download Formatted PDF"
                  >
                    {isDownloadingPdf ? (
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 text-indigo-400" />
                    )}
                    <span>{isDownloadingPdf ? 'Building PDF…' : 'PDF'}</span>
                  </button>

                  <button
                    onClick={() => onProceedToWhop(blueprint)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <span>Post to Whop Store</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {pdfError && (
                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/60 text-[11px] text-red-300">
                  {pdfError}
                </div>
              )}

              {/* Included Formats Summary */}
              {(() => {
                const included = Array.from(new Set<ProductFormat>([productFormat, ...addOnFormats]));
                return (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Included:</span>
                    {included.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700 text-[10px] font-semibold">
                        {FORMAT_TOKEN_LABELS[t]}
                      </span>
                    ))}
                  </div>
                );
              })()}

              {/* Cover Design Preview */}
              {blueprint.coverDesign && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-fuchsia-400">Cover Design Concept</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-14 h-14 rounded-lg border border-slate-700 shrink-0"
                      style={{ backgroundColor: blueprint.coverDesign.accentColor || '#6366f1' }}
                      title={blueprint.coverDesign.accentColor}
                    />
                    <div className="space-y-0.5">
                      {blueprint.coverDesign.headline && (
                        <div className="text-sm font-bold text-white leading-snug">{blueprint.coverDesign.headline}</div>
                      )}
                      {blueprint.coverDesign.subheadline && (
                        <div className="text-xs text-slate-300">{blueprint.coverDesign.subheadline}</div>
                      )}
                      {Array.isArray(blueprint.coverDesign.styleKeywords) && blueprint.coverDesign.styleKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {blueprint.coverDesign.styleKeywords.map((kw, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800/70 text-slate-400 border border-slate-700/70 text-[9px]">
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Marketing Hook Banner */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Creator's Story / Bio Hook:
                </span>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "{blueprint.marketingHook}"
                </p>
              </div>

              {/* 4 Curriculum Pillars Tabs */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Structured Core Curriculum (4 Pillars)</span>
                  <span className="text-[10px] text-slate-500">Click to inspect lessons</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {(blueprint.pillars || []).map((pillar, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePillarIndex(idx)}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        activePillarIndex === idx
                          ? 'bg-indigo-950/80 border-indigo-600 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-indigo-400 font-bold">
                        Pillar 0{pillar.pillarNumber}
                      </div>
                      <div className="text-xs font-semibold line-clamp-1 mt-0.5">
                        {pillar.title}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Active Pillar Details Card */}
                {blueprint.pillars && blueprint.pillars[activePillarIndex] && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-sm text-white">
                        Pillar {blueprint.pillars[activePillarIndex].pillarNumber}: {blueprint.pillars[activePillarIndex].title}
                      </h5>
                      <span className="text-[11px] text-indigo-400 font-mono">
                        Objective: {blueprint.pillars[activePillarIndex].objective}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-900/50 text-xs text-indigo-200">
                      <strong>Immediate Action Item:</strong> {blueprint.pillars[activePillarIndex].keyActionItem}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      {blueprint.pillars[activePillarIndex].fullContentMarkdown}
                    </p>
                  </div>
                )}
              </div>

              {/* Printable Checklist Section */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-teal-400" />
                    <span>Printable 1-Page Checklist / Routine Sheet</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {(blueprint.printableChecklist || []).length} action items
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {(blueprint.printableChecklist || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                      <input type="checkbox" className="rounded accent-teal-500 w-3.5 h-3.5" defaultChecked={idx === 0} />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expert Sources / Resource Directory */}
              {Array.isArray(blueprint.expertSources) && blueprint.expertSources.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-sky-400" />
                    <h4 className="text-xs font-bold text-white">Expert Sources &amp; Resource Directory</h4>
                  </div>
                  <div className="space-y-1.5">
                    {(blueprint.expertSources || []).map((src, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs">
                        <div className="font-semibold text-slate-200">
                          {src.domain}
                          {Array.isArray(src.credentialTypes) && src.credentialTypes.length > 0 && (
                            <span className="text-slate-500 font-normal"> — {src.credentialTypes.join(', ')}</span>
                          )}
                        </div>
                        {src.keyInsightSynthesized && (
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{src.keyInsightSynthesized}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Bump & Next Step */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-slate-950 to-indigo-950/30 border border-emerald-800/40">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    High-Converting Order Bump Configured
                  </span>
                  <div className="text-xs font-bold text-white">
                    {blueprint.orderBumpTitle} (+${blueprint.orderBumpPrice || 17})
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Typically adds 30-40% extra revenue per transaction with zero fulfillment friction.
                  </p>
                </div>

                <button
                  onClick={() => onProceedToWhop(blueprint)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
                >
                  <span>Post to Whop Store &amp; Setup 50/50 Splits</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[420px] rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                Personalized Product Preview
              </h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Click <strong>"Generate Digital Product"</strong> to synthesize the full Ebook, Actionable PDF, Printable Checklist, and pricing structure for {creatorName}.
              </p>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer mt-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Synthesize Now</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
