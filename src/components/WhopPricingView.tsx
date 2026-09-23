import React, { useState } from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Percent, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw,
  Layers,
  Globe
} from 'lucide-react';
import { GeneratedProductBlueprint } from './ProductStudioView';

interface WhopPricingViewProps {
  blueprint: GeneratedProductBlueprint | null;
  onProceedToPitch: (whopData: { checkoutUrl: string; productTitle: string; price: number }) => void;
  onOpenSettings: () => void;
}

export const WhopPricingView: React.FC<WhopPricingViewProps> = ({
  blueprint,
  onProceedToPitch,
  onOpenSettings,
}) => {
  const [basePrice, setBasePrice] = useState<number>(blueprint?.pricePoint || 27);
  const [includeBump, setIncludeBump] = useState<boolean>(true);
  const [bumpPrice, setBumpPrice] = useState<number>(blueprint?.orderBumpPrice || 17);
  const [operatorSplitPct, setOperatorSplitPct] = useState<number>(50);

  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishedData, setPublishedData] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Split calculation
  const gross = includeBump ? basePrice + bumpPrice : basePrice;
  const whopFee = Number((gross * 0.03).toFixed(2));
  const net = Number((gross - whopFee).toFixed(2));
  const creatorPayout = Number((net * ((100 - operatorSplitPct) / 100)).toFixed(2));
  const operatorPayout = Number((net * (operatorSplitPct / 100)).toFixed(2));

  const handlePublishToWhop = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch('/api/whop/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: blueprint?.productTitle || 'Digital Mastery Protocol',
          price: basePrice,
          orderBumpPrice: includeBump ? bumpPrice : 0,
          creatorHandle: blueprint?.whopConfig?.creatorWhopHandle || 'creator',
        }),
      });

      const data = await res.json();
      setPublishedData(data);
    } catch (err) {
      console.error('Failed to post to Whop:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyCheckout = () => {
    const url = publishedData?.checkoutUrl || `https://whop.com/checkout/prod?a=${blueprint?.whopConfig?.creatorWhopHandle || 'creator'}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2.5">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Step 4: Whop Store Pricing &amp; Automated 50/50 Splits</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Post Products to Whop Store
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Whop acts as your merchant of record, handles customer delivery, and automatically splits 50% revenue directly to the creator's wallet with zero manual accounting.
            </p>
          </div>

          <button
            onClick={onOpenSettings}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors self-start sm:self-auto cursor-pointer"
          >
            Configure Whop Keys
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pricing & Split Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              Pricing &amp; 50/50 Economics
            </h3>

            {/* Target Product Summary */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Product to Publish:</span>
              <div className="font-bold text-white text-sm line-clamp-1">
                {blueprint?.productTitle || 'The 7-Night Sleep Reset Protocol'}
              </div>
              <div className="text-[11px] text-teal-400">
                Partner: {blueprint?.creatorAttribution || 'Partner Creator'}
              </div>
            </div>

            {/* Base Price Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Base Product Price
                </label>
                <span className="text-sm font-bold text-emerald-400 font-mono">${basePrice}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
                {[19, 27, 37, 47].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setBasePrice(p)}
                    className={`py-2 rounded-xl border transition-all cursor-pointer ${
                      basePrice === p
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ${p}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                $27–$37 is the empirical sweet spot for impulse digital purchases.
              </span>
            </div>

            {/* Order Bump Toggle */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBump}
                    onChange={(e) => setIncludeBump(e.target.checked)}
                    className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Include Fast-Action Order Bump (+${bumpPrice})</span>
                </label>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Checklist + Audio walkthrough added to cart with 1 click. Converts 35%+ of buyers.
              </p>
            </div>

            {/* Automated Split Ratio */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Revenue Split Ratio
                </label>
                <span className="text-xs font-mono font-bold text-indigo-400">
                  {100 - operatorSplitPct}% Creator / {operatorSplitPct}% You
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="70"
                step="5"
                value={operatorSplitPct}
                onChange={(e) => setOperatorSplitPct(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>70% Creator</span>
                <span className="font-bold text-white">50/50 Standard</span>
                <span>30% Creator</span>
              </div>
            </div>

            {/* Breakdown Card */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Gross Checkout Total:</span>
                <span className="font-bold text-white font-mono">${gross.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Whop Processing Fee (~3%):</span>
                <span className="font-mono">-${whopFee.toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-800 my-1" />
              <div className="flex justify-between text-teal-400 font-semibold">
                <span>Creator Payout (50%):</span>
                <span className="font-mono">${creatorPayout.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-indigo-300 font-semibold">
                <span>Your Payout (50%):</span>
                <span className="font-mono">${operatorPayout.toFixed(2)}</span>
              </div>
            </div>

            {/* Publish Button */}
            <button
              onClick={handlePublishToWhop}
              disabled={isPublishing}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Configuring on Whop Platform...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-emerald-200" />
                  <span>{publishedData ? 'Update Whop Listing' : 'Publish to Whop Store & Create Split'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Whop Live Link & Customer Delivery Hub Preview */}
        <div className="lg:col-span-7 space-y-4">
          {publishedData ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
              {/* Success Badge */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-emerald-200">
                    Product Live on Whop &amp; 50/50 Affiliate Link Ready!
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Whop has provisioned your product contract with automatic revenue routing. When the creator shares this link, every transaction automatically routes 50% to their wallet.
                  </p>
                </div>
              </div>

              {/* Creator Affiliate Checkout Link Box */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Creator-Specific Whop Checkout Link:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publishedData.checkoutUrl}
                    className="flex-1 bg-slate-950 border border-indigo-900/60 rounded-xl px-3.5 py-2.5 text-xs text-indigo-300 font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyCheckout}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 block">
                  The <code className="text-indigo-400">?a=creator</code> parameter automates the 50/50 revenue split on Stripe/Whop.
                </span>
              </div>

              {/* Customer Access Delivery Hub (What buyer sees) */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-400" />
                    <span>Customer Fulfillment Hub (Automated by Whop)</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                    Instant Access
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Upon payment, Whop grants instant buyer access to this digital delivery hub with zero manual work on your end:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                    <span>PDF Digital Protocol (Mobile &amp; Desktop)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                    <span>Printable 1-Page Routine Checklist</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <span>Interactive Notion Daily Habit Sheet</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>Automated Receipt &amp; Discord / Email Pass</span>
                  </div>
                </div>
              </div>

              {/* Next Step: Pitch Creator */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onProceedToPitch({
                    checkoutUrl: publishedData.checkoutUrl,
                    productTitle: blueprint?.productTitle || 'Digital Protocol',
                    price: basePrice,
                  })}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>Proceed to Pitch Creator with Link</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                Ready to Publish to Whop
              </h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Click <strong>"Publish to Whop Store"</strong> on the left to generate the live checkout page and automated 50/50 revenue split link.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
