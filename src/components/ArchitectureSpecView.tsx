import React, { useState } from 'react';
import { 
  Code2, 
  Database, 
  Server, 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const ArchitectureSpecView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const schemaSql = `-- PostgreSQL / Supabase Schema for 3DS Automation Platform (Whop Delivery Edition)

-- 1. Users & Shadow Operators
CREATE TABLE operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  whop_company_id VARCHAR(255) NOT NULL, -- Operator Whop Company ID
  whop_api_key_encrypted TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Creator Leads & Distribution Partners
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID REFERENCES operators(id) ON DELETE CASCADE,
  handle VARCHAR(100) NOT NULL,
  platform VARCHAR(50) NOT NULL, -- 'instagram' | 'tiktok'
  follower_count INTEGER NOT NULL,
  engagement_rate NUMERIC(5, 4), -- e.g. 0.0380 for 3.8%
  business_email VARCHAR(255),
  bio_text TEXT,
  existing_bio_link VARCHAR(500),
  has_own_product BOOLEAN DEFAULT FALSE,
  whop_username VARCHAR(100), -- Creator Whop profile handle for 50/50 split
  whop_affiliate_id VARCHAR(255), -- Generated Whop affiliate code (50% commission)
  status VARCHAR(50) DEFAULT 'discovered', -- 'discovered'|'pitched'|'active'|'declined'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Synthesized Digital Products & Whop Experience Listings
CREATE TABLE digital_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  operator_id UUID REFERENCES operators(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500),
  niche VARCHAR(100) NOT NULL,
  target_problem TEXT NOT NULL,
  base_price_cents INTEGER NOT NULL DEFAULT 2700, -- $27.00
  order_bump_price_cents INTEGER DEFAULT 1700, -- $17.00 fast-action add-on
  operator_split_pct INTEGER NOT NULL DEFAULT 50, -- 50%
  curriculum_json JSONB NOT NULL, -- 4 Modules, checklists, FAQs
  whop_product_id VARCHAR(255) NOT NULL, -- prod_xxxx created via Whop API v5
  whop_plan_id VARCHAR(255) NOT NULL, -- plan_xxxx one-time payment
  whop_checkout_url VARCHAR(500) NOT NULL, -- https://whop.com/checkout/prod_xxx?a=creator_handle
  whop_hub_pass_id VARCHAR(255), -- Experience ID granting PDF & Notion dashboard
  is_live BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Whop Customer Orders & Automated 50/50 Splits
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES digital_products(id),
  creator_id UUID REFERENCES creators(id),
  operator_id UUID REFERENCES operators(id),
  whop_payment_id VARCHAR(255) UNIQUE NOT NULL, -- Whop payment.succeeded id
  gross_amount_cents INTEGER NOT NULL,
  order_bump_included BOOLEAN DEFAULT FALSE,
  whop_fee_cents INTEGER NOT NULL, -- Whop 3% transaction fee
  creator_payout_cents INTEGER NOT NULL, -- 50% automatically credited to Creator Whop wallet
  operator_payout_cents INTEGER NOT NULL, -- 50% automatically credited to Operator Whop wallet
  customer_email VARCHAR(255) NOT NULL,
  whop_membership_id VARCHAR(255) NOT NULL, -- Active Whop customer membership
  delivery_status VARCHAR(50) DEFAULT 'whop_hub_unlocked',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  const workerPipelineCode = `// BullMQ / Node.js Background Pipeline: Autonomous Synthesizer & Whop Provisioner
import { Queue, Worker } from 'bullmq';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

export const synthesisWorker = new Worker('product-synthesis', async (job) => {
  const { creatorId, creatorHandle, creatorName, niche, viralProblem } = job.data;
  
  // 1. Synthesize 4-module actionable digital guide using Gemini 3.8 Flash
  const synthesis = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: \`Act as an elite digital product architect. Create a 24-page actionable protocol solving "\${viralProblem}" for @\${creatorHandle} in \${niche}.
    Include: Title, Subtitle, 4 modules (Diagnosis, 14-Day Protocol, 1-Page Checklist, Top 15 FAQs). Output JSON.\`,
    config: { responseMimeType: 'application/json' }
  });
  const blueprint = JSON.parse(synthesis.text);

  // 2. Programmatically Provision Product on Whop API v5
  const whopProductRes = await fetch(\`https://api.whop.com/api/v5/companies/\${process.env.WHOP_COMPANY_ID}/products\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.WHOP_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: blueprint.productTitle,
      description: blueprint.subtitle,
      visibility: 'visible'
    })
  });
  const whopProduct = await whopProductRes.json();

  // 3. Configure 50% Creator Affiliate Split on Whop
  const affiliateRes = await fetch('https://api.whop.com/api/v5/affiliates', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.WHOP_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      product_id: whopProduct.id,
      commission_percentage: 50,
      affiliate_code: creatorHandle.replace('@', '')
    })
  });

  const checkoutUrl = \`https://whop.com/checkout/\${whopProduct.id}?a=\${creatorHandle.replace('@', '')}\`;
  return { blueprint, whopProductId: whopProduct.id, checkoutUrl };
});`;

  const downloadSpecJson = () => {
    const spec = {
      platform: "3DS Automation Engine (Whop Delivery)",
      version: "2.0.0",
      architecture_type: "Full-Stack Microservices / Whop Creator Hub",
      stages: [
        { name: "Viral Problem Discovery", technology: "Social & Reddit Scraper + Semantic Intent Clustering" },
        { name: "Microcreator Intelligence", technology: "Profile Scraper + Bio Email & Engagement Extraction" },
        { name: "Product Synthesis", technology: "Gemini 3.8 Flash Prompt Chaining + PDFKit & Notion Exporter" },
        { name: "Outreach Automation", technology: "3-Sentence Pitch Script + Instant Whop Preview Link" },
        { name: "Checkout & Split", technology: "Whop API v5 + Automated 50/50 Affiliate Payouts + Whop Hub" }
      ],
      database_schema: schemaSql,
      worker_code: workerPipelineCode
    };

    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '3ds-platform-engineering-spec.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Code2 className="w-4 h-4" /> Engineering &amp; System Architecture
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Build Your Own 3DS Automation Platform
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Complete technical specification for replacing closed webinar tools with an independent, scalable SaaS architecture.
            </p>
          </div>
          <button
            onClick={downloadSpecJson}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Full Spec JSON
          </button>
        </div>
      </div>

      {/* System Architecture Flow Diagram */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" />
            End-to-End System Topology
          </h2>
          <p className="text-xs text-slate-400">
            How data flows through your custom clone from discovery to Stripe deposit
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300/90 leading-loose overflow-x-auto whitespace-pre">
{`+-----------------------+     +------------------------+     +--------------------------+
|  1. DISCOVERY WORKER  |     |  2. CREATOR PROFILER   |     |  3. SYNTHESIS ENGINE     |
|  - Reddit / TikTok    | --> |  - Apify Scraper       | --> |  - Gemini 2.5 Flash      |
|  - Scrapes Acute Pain |     |  - Filters 10k-100k    |     |  - 4 Modules + Checklists|
|  - Clusters Problems  |     |  - Extracts Bio Email  |     |  - Compiles PDF + Mockup |
+-----------------------+     +------------------------+     +--------------------------+
                                                                          |
                                                                          v
+-----------------------+     +------------------------+     +--------------------------+
|  5. STRIPE SPLIT ENG  |     |  CUSTOMER CHECKOUT     |     |  4. OUTREACH AUTOMATOR   |
|  - 50% to Creator Bank| <-- |  - Next.js Mobile Page | <-- |  - Resend / SendGrid API |
|  - 50% to Operator    |     |  - Apple Pay / Card    |     |  - 3-Sentence Pitch      |
|  - Instant S3 Download|     |  - Zero-friction Buy   |     |  - Dynamic Preview Link  |
+-----------------------+     +------------------------+     +--------------------------+`}
        </div>
      </div>

      {/* Database Schema */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              Production Database Schema (PostgreSQL)
            </h2>
            <p className="text-xs text-slate-400">
              Tables required to manage operators, creator partners, synthesized products, and 50/50 payouts
            </p>
          </div>
          <button
            onClick={() => handleCopy(schemaSql, 'schema')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            {copiedSection === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedSection === 'schema' ? 'Copied SQL!' : 'Copy SQL'}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
          <code>{schemaSql}</code>
        </pre>
      </div>

      {/* Background Queue Worker */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              Automated Synthesis Worker Code (Node.js + Gemini API)
            </h2>
            <p className="text-xs text-slate-400">
              The exact BullMQ background worker executing the "Synthesize AI" pipeline clone
            </p>
          </div>
          <button
            onClick={() => handleCopy(workerPipelineCode, 'worker')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            {copiedSection === 'worker' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedSection === 'worker' ? 'Copied Worker!' : 'Copy Worker Code'}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300/90 overflow-x-auto">
          <code>{workerPipelineCode}</code>
        </pre>
      </div>

      {/* Implementation Roadmap Sprints */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            4-Sprint Platform Build Roadmap
          </h2>
          <p className="text-xs text-slate-400">
            Recommended phases for bringing your automated platform to production
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-mono text-amber-400 font-bold">SPRINT 01 (Week 1)</span>
            <h3 className="font-bold text-white text-sm">Synthesis Engine</h3>
            <p className="text-slate-300">
              Build the Gemini prompt chain. Given a creator handle or text input, generate the 4-module digital protocol and generate styled HTML-to-PDF output.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-mono text-blue-400 font-bold">SPRINT 02 (Week 2)</span>
            <h3 className="font-bold text-white text-sm">Preview &amp; Outreach</h3>
            <p className="text-slate-300">
              Deploy public interactive preview pages (e.g. <code>/preview/:slug</code>) displaying chapter 1 and 3D mockups. Automate email draft creation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-mono text-emerald-400 font-bold">SPRINT 03 (Week 3)</span>
            <h3 className="font-bold text-white text-sm">Stripe Connect Engine</h3>
            <p className="text-slate-300">
              Hook up Stripe Connect Express accounts. Create mobile checkout pages with automated 50% application fees and instant download link dispatch.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-mono text-purple-400 font-bold">SPRINT 04 (Week 4)</span>
            <h3 className="font-bold text-white text-sm">Scraper Ingestion</h3>
            <p className="text-slate-300">
              Connect Apify or social scraping actors to automate discovery of 10k-100k creators with high engagement and missing link-in-bio products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
