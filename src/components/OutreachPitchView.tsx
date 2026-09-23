import React, { useState } from 'react';
import { 
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  Video, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Share2, 
  ExternalLink,
  ThumbsUp,
  Clock,
  Flame,
  Users
} from 'lucide-react';
import { CreatorProfile } from './CreatorScoutView';
import { GeneratedProductBlueprint } from './ProductStudioView';

interface OutreachPitchViewProps {
  selectedCreator?: CreatorProfile | null;
  blueprint?: GeneratedProductBlueprint | null;
  checkoutUrl?: string;
  onProceedToDelivery: () => void;
}

export const OutreachPitchView: React.FC<OutreachPitchViewProps> = ({
  selectedCreator,
  blueprint,
  checkoutUrl,
  onProceedToDelivery,
}) => {
  const creatorName = selectedCreator?.name || 'Dr. Elena Miller, MD';
  const creatorHandle = selectedCreator?.handle || '@dr.toddler_wellness';
  const productTitle = blueprint?.productTitle || 'The 7-Night Toddler Sleep Reset Protocol';
  const niche = selectedCreator?.niche || 'Parenting & Toddler Health';
  const finalCheckoutUrl = checkoutUrl || `https://whop.com/checkout/prod?a=${creatorHandle.replace('@', '')}`;
  const price = blueprint?.pricePoint || 27;
  const splitShare = Math.round(price * 0.97 * 0.5);

  const [activeTab, setActiveTab] = useState<'dm' | 'loom' | 'email'>('dm');
  const [pipelineStatus, setPipelineStatus] = useState<'ready' | 'pitched' | 'positive' | 'live'>('ready');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // High-converting battle-tested scripts
  const casualDm = `Hey ${creatorName.split(' ')[0]}! Loved your recent breakdown on ${niche.toLowerCase()} — your audience in the comments was desperate for an exact step-by-step solution. I went ahead and built the full digital protocol ("${productTitle}") with an automated Whop checkout pre-split 50/50 to your account. Want me to send over the private preview link so you can take a look?`;

  const loomScript = `Hey ${creatorName.split(' ')[0]}, recorded a quick 60-second screen share for you. I noticed your followers constantly asking for a structured guide, so I built out the complete "${productTitle}" including printable checklists and mobile files. Everything is hosted on Whop with instant automated 50% payouts directly to your Stripe/bank on every sale ($${splitShare} net per order). Would love to send you the preview link if you're open to checking it out!`;

  const partnerEmail = `Subject: Built a custom digital product for your ${creatorHandle} audience (50/50 partnership)

Hi ${creatorName},

I'm a digital product operator specializing in ${niche}. I've been following your content and noticed a massive recurring pain point your followers bring up.

Rather than pitching an idea, I went ahead and built the entire asset: "${productTitle}". It includes the complete curriculum, printable checklists, and an automated Whop checkout page configured with a 50/50 revenue split ($${splitShare} per sale straight to your balance with zero upfront cost or operational work on your end).

If you're open to it, I'd love to share the private preview link with you. If you like it, we can launch it with a simple 3-story sequence; if not, no hard feelings at all.

Best,
Your SideMate Partner`;

  const positiveResponseShareMessage = `Awesome to hear, ${creatorName.split(' ')[0]}! Here is your custom Whop partnership link:

${finalCheckoutUrl}

Every time someone buys through this link, Whop automatically routes 50% ($${splitShare}) directly into your creator balance.

Launch steps are super simple:
1. Review the digital guide and printable checklist (it's already 100% finished).
2. Add the link to your bio or do a quick 2-story sequence explaining the protocol.
3. Whop automatically handles buyer delivery, Discord/hub passes, and your payouts.`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/30 border border-slate-800 p-6 sm:p-7 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2.5">
          <Send className="w-3.5 h-3.5 text-purple-400" />
          <span>Step 5: Creator Pitch &amp; Response Pipeline</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Pitch Creator &amp; Share Whop Link
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Reach out with zero sales pressure. Because you already built the product and set up their 50/50 split, you are handing them free revenue on a silver platter.
        </p>
      </div>

      {/* Pipeline Status Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Outreach Pipeline Stage:</span>
          </span>
          <span className="text-xs font-mono font-bold text-indigo-300">
            Target: {creatorHandle}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
          <button
            onClick={() => setPipelineStatus('ready')}
            className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
              pipelineStatus === 'ready'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            1. Ready to Pitch
          </button>

          <button
            onClick={() => setPipelineStatus('pitched')}
            className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
              pipelineStatus === 'pitched'
                ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            2. DM / Email Sent
          </button>

          <button
            onClick={() => setPipelineStatus('positive')}
            className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
              pipelineStatus === 'positive'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            3. Positive Reply 🎉
          </button>

          <button
            onClick={() => setPipelineStatus('live')}
            className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
              pipelineStatus === 'live'
                ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            4. Link Shared &amp; Live
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3 High-Converting Pitch Scripts */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Select Outreach Format
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('dm')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'dm'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Instagram DM
                </button>
                <button
                  onClick={() => setActiveTab('loom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'loom'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Loom Script
                </button>
                <button
                  onClick={() => setActiveTab('email')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'email'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Email
                </button>
              </div>
            </div>

            {/* Script Display */}
            {activeTab === 'dm' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Casual Instagram / TikTok DM (Highest Response Rate)</span>
                  </span>
                  <button
                    onClick={() => handleCopy(casualDm, 'dm')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedType === 'dm' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'dm' ? 'Copied!' : 'Copy DM Script'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                  {casualDm}
                </div>
                <p className="text-[11px] text-slate-400">
                  Tip: Send this directly to their Instagram DMs. Don't include links in message #1 so Instagram doesn't filter it to request spam.
                </p>
              </div>
            )}

            {activeTab === 'loom' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>60-Second Screen Share Pitch</span>
                  </span>
                  <button
                    onClick={() => handleCopy(loomScript, 'loom')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedType === 'loom' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'loom' ? 'Copied!' : 'Copy Script'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                  {loomScript}
                </div>
                <p className="text-[11px] text-slate-400">
                  Tip: Record a 60-second video scrolling through the curriculum outline you generated in Step 3. Seeing their name on the cover generates 4x higher conversions.
                </p>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-teal-400" />
                    <span>Formal Partnership Email</span>
                  </span>
                  <button
                    onClick={() => handleCopy(partnerEmail, 'email')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedType === 'email' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'email' ? 'Copied!' : 'Copy Email'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                  {partnerEmail}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Positive Response Follow-up & Share Link */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                When Creator Responds Positively
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When they reply with <em>"Yes, send it over!"</em> or <em>"Sounds interesting, how does it work?"</em>, send them this pre-formatted launch message with their 50/50 link:
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-emerald-400">
                  Affiliate Link Handoff Message
                </span>
                <button
                  onClick={() => {
                    handleCopy(positiveResponseShareMessage, 'share');
                    setPipelineStatus('live');
                  }}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedType === 'share' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'share' ? 'Copied!' : 'Copy Handoff'}</span>
                </button>
              </div>

              <div className="text-xs text-slate-200 font-sans whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto pr-1">
                {positiveResponseShareMessage}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="text-white font-semibold block">Fulfillment is 100% Automated</span>
              <span>Whop handles payment processing, customer logins, and deposits your 50% split automatically.</span>
            </div>

            <button
              onClick={onProceedToDelivery}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <span>View Live Partner Delivery &amp; Scaling Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
