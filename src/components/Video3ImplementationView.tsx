import React, { useState } from 'react';
import { 
  Play, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle,
  Zap,
  ArrowRight,
  Target
} from 'lucide-react';
import { WEBINAR_ANALYSES } from '../data/webinarData';

export const Video3ImplementationView: React.FC = () => {
  const video3 = WEBINAR_ANALYSES.find(v => v.youtubeId === 'XmzgbRe9Pkg') || WEBINAR_ANALYSES[2];
  const [copiedScript, setCopiedScript] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<'zada' | 'james' | 'gail'>('zada');

  const pitchScript = `Subject: Built this for your audience (already done!)

Hey [Creator Name],

I noticed on your pinned reel about [Specific Topic/Routine] that hundreds of followers were asking for your exact step-by-step framework.

I took your methodology and compiled it into a clean, 22-page actionable protocol guide with your branding and layout: [Link to 1-Page Interactive Preview]

If you'd like to put this in your bio, I'll handle all the checkout tech, customer support, and hosting, and we split all sales 50/50 straight to your Stripe/bank account.

Take a quick look at the preview and let me know if you want me to turn on the live checkout link!`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner with Spotlight on Video 3 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> High-Priority Session: Video 3
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-200 border border-indigo-700/50 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {video3.durationApprox}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
              Live Screen Implementation Masterclass
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            {video3.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-4xl leading-relaxed mb-6">
            In this pivotal session, Iman Gadzhi shares his screen to construct a complete digital product business live in under 60 minutes. This is the exact technical and operational blueprint behind the <strong className="text-indigo-300">3DS System</strong> (Develop, Distribute, Deliver, Scale) and the <strong className="text-indigo-300">3 Switches</strong> creator distribution engine.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`https://www.youtube.com/watch?v=${video3.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-600/30 transition-all"
            >
              <Play className="w-4 h-4 fill-current" /> Open Session on YouTube
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
            <div className="text-xs text-slate-400">
              YouTube ID: <code className="text-indigo-300 font-mono bg-slate-800 px-2 py-1 rounded">{video3.youtubeId}</code>
            </div>
          </div>
        </div>
      </div>

      {/* The 3DS System Architecture */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-indigo-400" />
              The 3DS Execution Engine
            </h2>
            <p className="text-sm text-slate-400">
              The four chronological phases executed in the live walkthrough
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 relative group hover:border-indigo-500/50 transition-all">
            <div className="w-8 h-8 rounded-lg bg-indigo-900/50 text-indigo-400 flex items-center justify-center font-bold text-sm mb-3">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-1">DEVELOP</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">AI Product Synthesis</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Operator inputs creator profile into AI. The system identifies high-performing content themes, extracts tone of voice, and compiles a comprehensive 20-30 page actionable protocol guide, checklist, or template.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
              ⚡ Executed in ~15 minutes via Synthesize AI
            </div>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 relative group hover:border-indigo-500/50 transition-all">
            <div className="w-8 h-8 rounded-lg bg-blue-900/50 text-blue-400 flex items-center justify-center font-bold text-sm mb-3">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-1">DISTRIBUTE</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">Borrowed Audience Leverage</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instead of building an audience, target microcreators (10k–100k followers). Offer a 50/50 revenue split. The creator already owns audience trust; the operator supplies the monetized asset.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
              🎯 10k–100k "Goldilocks Zone" microcreators
            </div>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 relative group hover:border-indigo-500/50 transition-all">
            <div className="w-8 h-8 rounded-lg bg-emerald-900/50 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-1">DELIVER</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">Autonomous Store &amp; Split</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mobile-optimized checkout link deployed in creator bio. Instant digital delivery via email upon purchase. Stripe automatically routes 50% to creator and 50% to operator with zero manual calculations.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
              💳 Automated 50/50 split at payment intent
            </div>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 relative group hover:border-indigo-500/50 transition-all">
            <div className="w-8 h-8 rounded-lg bg-purple-900/50 text-purple-400 flex items-center justify-center font-bold text-sm mb-3">
              04
            </div>
            <h3 className="text-lg font-bold text-white mb-1">SCALE</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">Creator Compounding</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Rinse and repeat with 3 to 5 creators across non-competing niches. Introduce order bumps ($17 companion toolkit) and recurring backend memberships to multiply average customer order value.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
              🚀 Scaling from $3k to $15k+ monthly net
            </div>
          </div>
        </div>
      </div>

      {/* The 3 Switches Deep-Dive */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" /> Live Walkthrough Methodology
          </div>
          <h2 className="text-2xl font-bold text-white">
            The "3 Switches" Rinse-and-Repeat Creator Process
          </h2>
          <p className="text-sm text-slate-400">
            The three operational switches Iman triggers on stream to launch the business
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Switch 1 */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Switch 1
                </span>
                <span className="text-xs text-slate-400 font-mono">TARGETING</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Partner with Microcreators</h3>
              <ul className="text-xs text-slate-300 space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>10k to 100k Followers:</strong> Avoid mega-creators whose DMs are managed by talent agencies and managers who reject cold deals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>High Engagement:</strong> Comment-to-view ratio above 2-3%. Audience actively asks questions in comment sections.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Unmonetized Link in Bio:</strong> Either no bio link at all, or a generic Linktree with low-paying Amazon affiliate links.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              💡 <em>"A creator with 50,000 engaged followers is an untapped goldmine with zero monetization infrastructure."</em>
            </div>
          </div>

          {/* Switch 2 */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Switch 2
                </span>
                <span className="text-xs text-slate-400 font-mono">SYNTHESIS</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Personalize the AI Product</h3>
              <ul className="text-xs text-slate-300 space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Profile Ingestion:</strong> Ingest top 5-10 viral reels/videos to extract vocabulary, tone, and core lessons.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Actionable 4-Pillar Format:</strong> Diagnosis → Protocol Routine → Daily Checklist → Resource Toolkit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Visual Mockup Generation:</strong> Create 3D book cover and iPad mockup with creator’s name and photo.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              💡 <em>"Never ask them to write a book. Present them with chapter 1 already written in their voice."</em>
            </div>
          </div>

          {/* Switch 3 */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Switch 3
                </span>
                <span className="text-xs text-slate-400 font-mono">AUTOMATION</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Publish &amp; Split Delivery</h3>
              <ul className="text-xs text-slate-300 space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>1-Click Checkout:</strong> Mobile-first page with Apple Pay, Google Pay, and Stripe credit cards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Automated 50/50 Routing:</strong> Stripe Connect handles splitting the funds on transaction completion.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Instant Fulfillment:</strong> Customer receives instant download link and access portal email immediately.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              💡 <em>"Zero manual accounting. Funds deposit directly into both the creator’s and operator’s bank accounts."</em>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Live Case Studies from the Stream */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Verified Case Studies Analyzed on Stream
          </h2>
          <p className="text-sm text-slate-400">
            Real student results broken down line-by-line during the live session
          </p>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setSelectedCaseStudy('zada')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedCaseStudy === 'zada'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Case 1: Zada (€11,000 Month 1)
          </button>
          <button
            onClick={() => setSelectedCaseStudy('james')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedCaseStudy === 'james'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Case 2: James ($6,000 → $19,000 Jump)
          </button>
          <button
            onClick={() => setSelectedCaseStudy('gail')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedCaseStudy === 'gail'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Case 3: Gail ($13,000 Pediatrician Payout)
          </button>
        </div>

        {selectedCaseStudy === 'zada' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 text-lg">
                  €11k
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Zada's Parenting Ebook Partnership</h3>
                  <p className="text-xs text-slate-400">Niche: Parenting &amp; Infant Bedtime Routine | Creator: 70,000 Followers</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Zada identified a parenting creator whose video on infant night-waking had over 400,000 views and hundreds of desperate parent comments. Using AI synthesis, she created a clean, 24-page sleep routine protocol titled "The 7-Day Gentle Sleep Solution" priced at just <strong>€14</strong>. 
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Product Price:</span>
                  <span className="font-semibold text-white">€14.00</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Month 1 Units Sold:</span>
                  <span className="font-semibold text-white">~785 copies</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Month 1 Gross Revenue:</span>
                  <span className="font-semibold text-emerald-400 font-mono">€11,000</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Ongoing Recurring Revenue:</span>
                  <span className="font-semibold text-indigo-300 font-mono">€6,000 – €8,000 / month</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Key Takeaway for Your Platform</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                At €14, parent friction is near zero. The creator did not need to run webinars or sales calls—just posted 3 Instagram Stories with a link sticker, and the audience purchased on impulse.
              </p>
              <div className="p-2.5 rounded bg-indigo-950/40 border border-indigo-800 text-[11px] text-indigo-200">
                ✅ Low ticket ($14-$27) + high trust audience = instant cashflow.
              </div>
            </div>
          </div>
        )}

        {selectedCaseStudy === 'james' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-300 text-lg">
                  $19k
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">James's Mobility &amp; Posture Scaling Model</h3>
                  <p className="text-xs text-slate-400">Niche: Desk Ergonomics &amp; Spine Health | Multiple Microcreator Partners</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                James proved the "compounding" scale phase of the 3DS system. After achieving $6,000/month with his initial physical therapist partner, he took the exact same backend engine and partnered with two additional mobility coaches (35k and 52k followers), scaling gross monthly revenue to <strong>$19,000</strong> within 30 days.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Starting Monthly Run Rate:</span>
                  <span className="font-semibold text-white">$6,000 / mo</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Scaling Strategy:</span>
                  <span className="font-semibold text-white">Replicated offer across 3 creators</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">30-Day Scaled Revenue:</span>
                  <span className="font-semibold text-emerald-400 font-mono">$19,000 / mo</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Average Order Bump:</span>
                  <span className="font-semibold text-indigo-300">+$17 Video Exercise Demo Vault (35% uptake)</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Key Takeaway for Your Platform</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Once a product architecture works for one creator in a niche, you can clone and re-skin it for 4 other non-competing creators in the same niche within 48 hours.
              </p>
              <div className="p-2.5 rounded bg-indigo-950/40 border border-indigo-800 text-[11px] text-indigo-200">
                ✅ Product assets are reusable across multiple creator partnerships.
              </div>
            </div>
          </div>
        )}

        {selectedCaseStudy === 'gail' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300 text-lg">
                  $13k
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Gail (Medical Student) Pediatrician Partnership</h3>
                  <p className="text-xs text-slate-400">Niche: Toddler Nutrition &amp; Picky Eating | Creator: Board-Certified Pediatrician</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Gail was a busy medical student who had zero time to create social media content. She reached out to a practicing pediatrician with 55k followers who was overwhelmed with questions about toddler feeding. Gail synthesized clinical pediatric guidelines and the doctor's videos into a 28-page toolkit priced at $27 with a $15 meal-plan order bump.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Initial Launch Payout:</span>
                  <span className="font-semibold text-emerald-400 font-mono">$13,000 (Her 50% cut: $6,500)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Time Spent by Creator:</span>
                  <span className="font-semibold text-white">~30 minutes reviewing &amp; posting Stories</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Current Scaled Portfolio:</span>
                  <span className="font-semibold text-white">4 creator partnerships in wellness</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Ongoing Monthly Income:</span>
                  <span className="font-semibold text-emerald-400 font-mono">$10,000 / month passive</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Key Takeaway for Your Platform</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Professionals (doctors, lawyers, CPAs, engineers) have extreme credibility but zero time. They are the easiest creators to sign because they don't want to code or manage a Shopify store.
              </p>
              <div className="p-2.5 rounded bg-indigo-950/40 border border-indigo-800 text-[11px] text-indigo-200">
                ✅ Licensed professionals are ideal high-trust creator targets.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* The 1-Hour Live Stopwatch Breakdown */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            The 60-Minute Live Implementation Timeline
          </h2>
          <p className="text-xs text-slate-400">
            How Iman Gadzhi structures the 1-hour live stream build
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-amber-400 font-mono text-xs font-bold mb-1">00:00 - 15:00</div>
            <div className="font-bold text-white text-sm mb-1">Creator &amp; Problem Scout</div>
            <p className="text-xs text-slate-300">
              Searches Instagram/TikTok for 10k-80k creators. Checks comment sections for recurring questions. Checks bio for missing link.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-indigo-400 font-mono text-xs font-bold mb-1">15:00 - 35:00</div>
            <div className="font-bold text-white text-sm mb-1">Synthesize AI Generation</div>
            <p className="text-xs text-slate-300">
              Inputs creator link into software. Generates curriculum outline, 4 modules, daily action checklists, and 3D cover art.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-blue-400 font-mono text-xs font-bold mb-1">35:00 - 45:00</div>
            <div className="font-bold text-white text-sm mb-1">Interactive Preview Setup</div>
            <p className="text-xs text-slate-300">
              Uploads chapter 1 preview to a shareable link. Configures 3D mockup displaying creator name and branded color palette.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-emerald-400 font-mono text-xs font-bold mb-1">45:00 - 60:00</div>
            <div className="font-bold text-white text-sm mb-1">Pitch &amp; Split Link Ready</div>
            <p className="text-xs text-slate-300">
              Sends 3-sentence email/DM with sample preview. Prepares Stripe Connect 50/50 store ready for the creator to drop into their bio.
            </p>
          </div>
        </div>
      </div>

      {/* The Exact Proven Outreach Script */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/60 border border-indigo-500/30 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Target className="w-4 h-4" /> The Proven High-Converting Script
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              The 3-Sentence "Value First" Creator Pitch
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Used in the live demo to get instant responses from microcreators
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(pitchScript)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-all"
          >
            {copiedScript ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copiedScript ? 'Copied to Clipboard!' : 'Copy Script'}
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
          {pitchScript}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <strong className="text-slate-200">1. Specific Validation:</strong> References their exact pinned reel and follower pain points.
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <strong className="text-slate-200">2. Tangible Proof:</strong> Includes a live preview of the actual finished product upfront.
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <strong className="text-slate-200">3. Zero-Risk Terms:</strong> 50/50 automated split; operator handles 100% of tech and support.
          </div>
        </div>
      </div>
    </div>
  );
};
