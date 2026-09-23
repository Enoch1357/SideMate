import React, { useState } from 'react';
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
  DollarSign, 
  Eye, 
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';
import { CreatorProfile } from './CreatorScoutView';
import { DemandSignal } from './DiscoverDemandView';

export interface GeneratedCurriculumPillar {
  pillarNumber: number;
  title: string;
  objective: string;
  keyActionItem: string;
  fullContentMarkdown: string;
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
  printableChecklist: string[];
  faqItems: { question: string; answer: string }[];
  marketingHook: string;
  personalizedOutreachPitch: string;
  whopConfig?: any;
  engineUsed?: string;
}

interface ProductStudioViewProps {
  selectedCreator?: CreatorProfile | null;
  selectedDemandSignal?: DemandSignal | null;
  onProceedToWhop: (blueprint: GeneratedProductBlueprint) => void;
}

export const ProductStudioView: React.FC<ProductStudioViewProps> = ({
  selectedCreator,
  selectedDemandSignal,
  onProceedToWhop,
}) => {
  // Inputs
  const [creatorName, setCreatorName] = useState(selectedCreator?.name || 'Dr. Elena Miller, MD');
  const [creatorHandle, setCreatorHandle] = useState(selectedCreator?.handle || '@dr.toddler_wellness');
  const [niche, setNiche] = useState(selectedCreator?.niche || selectedDemandSignal?.niche || 'Parenting & Toddler Health');
  const [viralProblem, setViralProblem] = useState(
    selectedCreator?.audiencePain || 
    selectedDemandSignal?.viralProblem || 
    'Toddler 2-year sleep regression and frequent 3 AM night waking'
  );
  const [productFormat, setProductFormat] = useState<string>(
    selectedCreator?.recommendedFormat || selectedDemandSignal?.recommendedFormat || 'Actionable PDF Guide'
  );
  const [pricePoint, setPricePoint] = useState<number>(
    selectedCreator?.suggestedPrice || selectedDemandSignal?.suggestedPrice || 27
  );

  // Studio State
  const [isGenerating, setIsGenerating] = useState(false);
  const [blueprint, setBlueprint] = useState<GeneratedProductBlueprint | null>(null);
  const [activePillarIndex, setActivePillarIndex] = useState<number>(0);
  const [copiedText, setCopiedText] = useState(false);

  const formats = [
    { id: 'Actionable PDF Guide', label: 'Actionable PDF Guide', icon: FileText, desc: 'Step-by-step 20-page protocol' },
    { id: 'Full Ebook', label: 'Full Digital Ebook', icon: BookOpen, desc: 'Comprehensive deep-dive curriculum' },
    { id: 'Printable Checklist', label: 'Printable Checklist & Routine', icon: CheckSquare, desc: 'Quick-reference action sheet' },
    { id: 'Interactive Notion Hub', label: 'Notion Digital Hub', icon: Layers, desc: 'Interactive workspace template' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorHandle,
          creatorName,
          niche,
          viralProblem,
          productFormat,
          pricePoint,
        }),
      });

      const data = await res.json();
      setBlueprint(data);
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
    blueprint.pillars.forEach((p) => {
      fullDoc += `## Pillar ${p.pillarNumber}: ${p.title}\n*Objective:* ${p.objective}\n*Action Item:* ${p.keyActionItem}\n\n${p.fullContentMarkdown}\n\n---\n\n`;
    });
    fullDoc += `## Printable Checklist\n`;
    blueprint.printableChecklist.forEach((c) => {
      fullDoc += `- [ ] ${c}\n`;
    });
    navigator.clipboard.writeText(fullDoc);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (!blueprint) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${blueprint.productTitle}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1e293b; }
            h1 { font-size: 28px; margin-bottom: 4px; color: #0f172a; }
            .subtitle { font-size: 16px; color: #475569; margin-bottom: 24px; }
            .author { font-size: 14px; font-weight: bold; color: #4338ca; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
            .pillar { margin-bottom: 32px; page-break-inside: avoid; }
            .pillar h2 { font-size: 20px; color: #1e293b; border-bottom: 2px solid #e0e7ff; padding-bottom: 6px; }
            .checklist { background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 32px; }
            .checklist li { margin-bottom: 8px; list-style-type: none; }
          </style>
        </head>
        <body>
          <h1>${blueprint.productTitle}</h1>
          <div class="subtitle">${blueprint.subtitle}</div>
          <div class="author">Created in collaboration with ${blueprint.creatorAttribution}</div>
          
          ${blueprint.pillars.map(p => `
            <div class="pillar">
              <h2>Pillar ${p.pillarNumber}: ${p.title}</h2>
              <p><strong>Key Action Item:</strong> ${p.keyActionItem}</p>
              <p>${p.fullContentMarkdown.replace(/\n/g, '<br/>')}</p>
            </div>
          `).join('')}

          <div class="checklist">
            <h2>Daily Implementation Checklist</h2>
            <ul>
              ${blueprint.printableChecklist.map(item => `<li>[ ] ${item}</li>`).join('')}
            </ul>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-6 sm:p-7 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Step 3: AI Product Studio &amp; Curriculum Builder</span>
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
                Digital Product Format
              </label>
              <div className="space-y-1.5">
                {formats.map((f) => {
                  const Icon = f.icon;
                  const isSelected = productFormat === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setProductFormat(f.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-600 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <div>
                          <div className="text-xs font-semibold">{f.label}</div>
                          <div className="text-[10px] text-slate-500">{f.desc}</div>
                        </div>
                      </div>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
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
                  <span>Synthesizing Product with AI...</span>
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
                      {blueprint.formatType || productFormat}
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
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                    title="Download Formatted PDF"
                  >
                    <Download className="w-4 h-4 text-indigo-400" />
                    <span>PDF</span>
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
                  {blueprint.pillars.map((pillar, idx) => (
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
                {blueprint.pillars[activePillarIndex] && (
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
                    {blueprint.printableChecklist.length} action items
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {blueprint.printableChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                      <input type="checkbox" className="rounded accent-teal-500 w-3.5 h-3.5" defaultChecked={idx === 0} />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

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
