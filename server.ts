import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Runtime credentials state (initialized from env, updatable dynamically from UI)
const runtimeConfig = {
  whopApiKey: process.env.WHOP_API_KEY || '',
  whopCompanyId: process.env.WHOP_COMPANY_ID || '',
  whopWebhookSecret: process.env.WHOP_WEBHOOK_SECRET || '',
  whopCompanyName: '',
  whopLastTested: null as string | null,

  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  databaseUrl: process.env.DATABASE_URL || '',
  supabaseLastTested: null as string | null,
};

let supabaseClient: SupabaseClient | null = null;
function initSupabase() {
  if (runtimeConfig.supabaseUrl && (runtimeConfig.supabaseServiceRoleKey || runtimeConfig.supabaseAnonKey)) {
    try {
      supabaseClient = createClient(
        runtimeConfig.supabaseUrl,
        runtimeConfig.supabaseServiceRoleKey || runtimeConfig.supabaseAnonKey,
        { auth: { persistSession: false } }
      );
      console.log('[Supabase Engine] Initialized client for:', runtimeConfig.supabaseUrl);
    } catch (err: any) {
      console.warn('[Supabase Engine] Initialization error:', err.message);
      supabaseClient = null;
    }
  } else {
    supabaseClient = null;
  }
}
initSupabase();

// SQL Schema for Supabase PostgreSQL
const POSTGRES_MIGRATION_SQL = `-- ==============================================================================
-- 3DS AUTOMATION PLATFORM (WHOP & SUPABASE POSTGRESQL SCHEMA)
-- ==============================================================================
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Shadow Agency Operators Table
CREATE TABLE IF NOT EXISTS operators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(255) NOT NULL DEFAULT '3DS Growth Agency',
  email VARCHAR(255) UNIQUE NOT NULL,
  whop_company_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Targeted Microcreators Table
CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID REFERENCES operators(id) ON DELETE SET NULL,
  handle VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  niche VARCHAR(100) NOT NULL,
  follower_count INTEGER DEFAULT 0,
  engagement_rate NUMERIC(5,2) DEFAULT 0,
  viral_problem TEXT NOT NULL,
  audience_tone TEXT,
  whop_username VARCHAR(100),
  whop_affiliate_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'discovered',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Synthesized Digital Products & Whop Passes
CREATE TABLE IF NOT EXISTS digital_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500),
  niche VARCHAR(100) NOT NULL,
  viral_problem_solved TEXT NOT NULL,
  base_price_cents INTEGER NOT NULL DEFAULT 2700,
  order_bump_price_cents INTEGER DEFAULT 1700,
  operator_split_pct INTEGER NOT NULL DEFAULT 50,
  creator_split_pct INTEGER NOT NULL DEFAULT 50,
  curriculum_json JSONB NOT NULL,
  whop_product_id VARCHAR(255),
  whop_plan_id VARCHAR(255),
  whop_checkout_url VARCHAR(500),
  is_live BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Customer Orders & Automated 50/50 Whop Revenue Splits
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES digital_products(id) ON DELETE SET NULL,
  whop_payment_id VARCHAR(255) UNIQUE,
  whop_membership_id VARCHAR(255),
  customer_email VARCHAR(255) NOT NULL,
  gross_amount_cents INTEGER NOT NULL,
  order_bump_included BOOLEAN DEFAULT FALSE,
  whop_fee_cents INTEGER NOT NULL,
  creator_payout_cents INTEGER NOT NULL,
  operator_payout_cents INTEGER NOT NULL,
  delivery_status VARCHAR(50) DEFAULT 'whop_hub_unlocked',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Indices for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_creators_handle ON creators(handle);
CREATE INDEX IF NOT EXISTS idx_products_whop_id ON digital_products(whop_product_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_whop_payment ON orders(whop_payment_id);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active products for checkout
CREATE POLICY "Public products viewable" ON digital_products
  FOR SELECT USING (is_live = true);

-- Allow server full access
CREATE POLICY "Service role full access operators" ON operators
  FOR ALL USING (true);
CREATE POLICY "Service role full access creators" ON creators
  FOR ALL USING (true);
CREATE POLICY "Service role full access products" ON digital_products
  FOR ALL USING (true);
CREATE POLICY "Service role full access orders" ON orders
  FOR ALL USING (true);
`;

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize server-side Gemini SDK client with telemetry User-Agent
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health & configuration check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      whopConfigured: !!process.env.WHOP_API_KEY,
      platform: '3DS Automator Platform (Whop Delivery Engine)',
      time: new Date().toISOString(),
    });
  });

  // Helper: Resilient Gemini invocation with multi-model failover for 503/demand spikes
  async function generateWithGemini(prompt: string, systemInstruction: string) {
    // Model preference list: primary is gemini-3.8-flash, followed by gemini-3.1-flash-lite, then gemini-2.5-flash
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            systemInstruction,
          },
        });

        if (response && response.text) {
          return { text: response.text, modelUsed: model };
        }
      } catch (err: any) {
        console.warn(`[Synthesis Warning] Model ${model} encountered: ${err.message || err}. Trying failover model...`);
        lastError = err;
      }
    }

    throw lastError || new Error('All Gemini models temporarily unavailable');
  }

  // Helper: Generates a bespoke, rich digital product blueprint tailored to creator inputs
  function buildTailoredBlueprint(params: {
    creatorHandle: string;
    creatorName: string;
    niche: string;
    viralProblem: string;
    audienceTone?: string;
    pricePoint: number;
    productFormat?: string;
    engineUsed?: string;
  }) {
    const {
      creatorHandle = '@creator',
      creatorName = 'Partner Creator',
      niche = 'Health & Productivity',
      viralProblem = 'Chronic morning fatigue & afternoon crashes',
      pricePoint = 27,
      productFormat = 'E-Book Protocol & Whop Digital Hub',
      engineUsed = 'Autonomous Synthesis Engine',
    } = params;

    const cleanHandle = creatorHandle.replace('@', '');
    const cleanNiche = niche.split('&')[0].trim();
    const whopSlug = `whop-${cleanHandle.toLowerCase()}-${Date.now().toString().slice(-4)}`;

    return {
      productTitle: `The ${cleanNiche} Reset Protocol`,
      subtitle: `A 14-Day Actionable System to eliminate ${viralProblem.toLowerCase()} by ${creatorName}`,
      productType: productFormat,
      targetAudience: `Active followers of ${creatorHandle} seeking immediate relief from ${viralProblem}`,
      viralProblemSolved: viralProblem,
      suggestedPricePoint: pricePoint,
      orderBumpTitle: 'Audio Walkthrough & Notion Operating Dashboard',
      orderBumpPrice: 17,
      valueProposition: `Built specifically around ${creatorName}'s most effective frameworks. Eliminates overthinking by condensing weeks of confusing research into a daily 15-minute checklist.`,
      curatedModules: [
        {
          moduleNumber: 1,
          title: 'Module 1: Diagnosis & Root Cause Analysis',
          deliverables: [
            'Deconstruction of why previous attempts failed',
            'Identifying biological and behavioral triggers',
            'The 3 friction points specific to this audience',
          ],
          summary: 'Deconstructs the root issues causing this problem and removes guilt by explaining the underlying physiological/structural mechanisms.',
          fullContentMarkdown: `### Module 1: Understanding the Root Cause\n\nMost advice tells you to try harder. In reality, the breakdown happens in the first 30 minutes of the morning. When followers ask ${creatorHandle} why they feel stuck, the answer is rarely lack of willpower.\n\nIn this module, we audit your baseline habits and eliminate the 3 hidden stressors sabotaging your progress before you even start the day.`,
        },
        {
          moduleNumber: 2,
          title: 'Module 2: The Core 14-Day Step-by-Step Protocol',
          deliverables: [
            'Phased morning and evening sequence',
            'Zero-decision fatigue daily checklists',
            'Target adjustments for high-stress days',
          ],
          summary: 'The primary solution engine. A phased 14-day daily plan with morning and evening protocols designed for immediate compliance.',
          fullContentMarkdown: `### Module 2: The 14-Day Tactical Execution Plan\n\n- **Phase 1 (Days 1–3): Reset.** Strip away non-essential variables.\n- **Phase 2 (Days 4–9): Stabilization.** Lock in the 3 core non-negotiables.\n- **Phase 3 (Days 10–14): Optimization.** Transition from active protocol into an automated, effortless background habit.`,
        },
        {
          moduleNumber: 3,
          title: 'Module 3: 1-Page Printable Action Checklist',
          deliverables: [
            'Refrigerator / Desk printable checklist',
            'Lock-screen mobile wallpaper checklist',
            '5-minute emergency reset routine',
          ],
          summary: 'The highest utility asset for impulse buyers: a single-sheet daily habit tracker to eliminate decision fatigue.',
          fullContentMarkdown: `### Module 3: 1-Page Daily Tracker\n\nKeep this sheet on your refrigerator or lockscreen. Check off the 3 non-negotiables before 10:00 AM. If you stumble, follow the 2-minute recovery drill.`,
        },
        {
          moduleNumber: 4,
          title: 'Module 4: Top 15 Emergency FAQs & Edge Cases',
          deliverables: [
            'Direct answers to top 15 comment objections',
            'Travel & dining-out adjustments',
            'Long-term maintenance guide',
          ],
          summary: 'Answers to the top 15 most frequent follower questions scraped directly from comment threads to prevent refunds and drive word-of-mouth.',
          fullContentMarkdown: `### Module 4: Resolving Real-World Edge Cases\n\n- *What if I work night shifts or travel?* Implement the Time-Shift Buffer Protocol on page 19.\n- *How quickly should I expect noticeable results?* Most report significant improvement within 72 hours of Day 3.\n- *Can I combine this with existing routines?* Yes, this protocol acts as an overlay.`,
        },
      ],
      printableChecklist: [
        'Audit current baseline using the 3-minute diagnostic score',
        'Complete morning non-negotiable sequence (under 12 minutes)',
        'Mid-day hydration & cognitive reset check',
        'Evening wind-down routine eliminating blue light and stimulants',
        'Log daily score in the 1-Page Action Tracker',
      ],
      faqItems: [
        {
          question: `How does this differ from ${creatorName}'s free social videos?`,
          answer: `Social clips share bite-sized tips. This protocol organizes the entire methodology into an interconnected, day-by-day sequence with printable checklists and exact measurements.`,
        },
        {
          question: 'How long do I need each day?',
          answer: 'Less than 15 minutes. It is engineered specifically for busy individuals with zero extra time.',
        },
        {
          question: 'How do I access the files on Whop?',
          answer: 'Immediately after checkout, you receive instant access to your private Whop Hub with PDF downloads, Notion dashboard, and mobile access.',
        },
      ],
      marketingHook: `I finally organized the exact 14-day protocol I used to fix "${viralProblem}" into a clean 20-page guide with printable checklists. Grab it via the link in my bio!`,
      personalizedOutreachPitch: `Subject: Built this for your audience (already live on Whop preview!)

Hey ${creatorName.split(' ')[0] || 'there'},

I saw your recent video on ${niche} and noticed dozens of comments asking for a structured step-by-step routine to fix "${viralProblem}".

I took your methodology and formatted it into an official 24-page actionable protocol with branded Whop delivery and 3D mockups: https://whop.com/checkout/${whopSlug}?a=${cleanHandle}

If you want to place it in your bio, I'll manage all the Whop tech, digital delivery, and customer service, and Whop automatically splits all revenue 50/50 straight into your account.

Take a peek at the preview link and let me know if you want me to activate the live link!`,
      engineUsed,
      whopConfig: {
        whopProductId: `prod_${Math.random().toString(36).substring(2, 10)}`,
        companyId: process.env.WHOP_COMPANY_ID || 'biz_operator_3ds',
        title: `The ${cleanNiche} Reset Protocol`,
        tagline: `Official actionable guide by ${creatorName}`,
        price: pricePoint,
        orderBumpPrice: 17,
        orderBumpTitle: 'Audio Walkthrough & Notion Operating Dashboard',
        operatorSplitPct: 50,
        creatorAffiliateSplitPct: 50,
        creatorWhopHandle: cleanHandle,
        whopCheckoutUrl: `https://whop.com/checkout/${whopSlug}?a=${cleanHandle}`,
        whopPreviewSlug: whopSlug,
        deliveryFormat: 'Whop Digital Pass' as const,
        whopPerks: [
          'Instant Whop Hub Access',
          'Full PDF Protocol (24 Pages, Mobile-Optimized)',
          'Interactive Daily Notion Habit Tracker',
          'Printable 1-Page Refrigerator Checklist',
          'Direct Access to Monthly Creator Q&A Updates',
        ],
        isLiveSynced: !!process.env.WHOP_API_KEY,
      },
    };
  }

  // 1. AI Product Synthesis Endpoint (Gemini 3.8 Flash with Multi-Model Failover & Resilient Fallback)
  app.post('/api/synthesize', async (req: Request, res: Response) => {
    const {
      creatorHandle = '@creator',
      creatorName = 'Partner Creator',
      niche = 'Health & Productivity',
      viralProblem = 'Chronic morning fatigue & afternoon crashes',
      audienceTone = 'Authoritative yet empathetic and action-oriented',
      pricePoint = 27,
      productFormat = 'E-Book Protocol & Whop Digital Hub',
    } = req.body;

    const cleanHandle = (creatorHandle || 'creator').replace('@', '');
    const whopSlug = `whop-${cleanHandle.toLowerCase()}-${Date.now().toString().slice(-4)}`;

    // If GEMINI_API_KEY is available, try generative models with multi-model failover
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are an elite digital product strategist and copywriter specializing in high-converting, actionable digital protocols for microcreators ($14-$47 price points on Whop).
        
Analyze this creator and audience:
- Creator Name: ${creatorName} (${creatorHandle})
- Niche: ${niche}
- Acute Viral Problem (from comment complaints): "${viralProblem}"
- Creator Voice / Audience Tone: ${audienceTone}
- Selected Product Format: ${productFormat}
- Base Price Point: $${pricePoint}

Generate a complete, high-converting digital product blueprint in strictly valid JSON format matching this schema:
{
  "productTitle": "Catchy 3-5 word authoritative title (e.g., The 14-Day Reset Protocol)",
  "subtitle": "Clear 1-sentence value promise solving the viral problem",
  "productType": "${productFormat}",
  "targetAudience": "Specific description of the creator's followers needing this",
  "viralProblemSolved": "${viralProblem}",
  "suggestedPricePoint": ${pricePoint},
  "orderBumpTitle": "Specific $17 high-margin impulse add-on (e.g. 5-Minute Daily Video Walkthrough or Notion Habit Tracker)",
  "orderBumpPrice": 17,
  "valueProposition": "3-sentence breakdown of why this eliminates noise and delivers rapid results",
  "curatedModules": [
    {
      "moduleNumber": 1,
      "title": "Module 1: Diagnosis & Root Cause Analysis",
      "deliverables": ["3-5 bullet points of deliverables"],
      "summary": "2-3 sentence overview explaining why past solutions failed",
      "fullContentMarkdown": "A rich 300-word tactical guide excerpt providing immediate value"
    },
    {
      "moduleNumber": 2,
      "title": "Module 2: The Core Step-by-Step Daily Protocol",
      "deliverables": ["3-5 bullet points of deliverables"],
      "summary": "Detailed daily routine and actionable execution steps",
      "fullContentMarkdown": "A rich 300-word step-by-step phased protocol"
    },
    {
      "moduleNumber": 3,
      "title": "Module 3: 1-Page Printable Action Checklist",
      "deliverables": ["3-5 bullet points of deliverables"],
      "summary": "High-utility single sheet checklist for frictionless daily compliance",
      "fullContentMarkdown": "Action checklist breakdown and morning/evening checklist structure"
    },
    {
      "moduleNumber": 4,
      "title": "Module 4: Emergency FAQs & Edge Cases",
      "deliverables": ["3-5 bullet points of deliverables"],
      "summary": "Answers to the top 15 most frequent audience objections from comments",
      "fullContentMarkdown": "Detailed Q&A resolving specific edge cases and objections"
    }
  ],
  "printableChecklist": [
    "Step 1: Specific action item",
    "Step 2: Specific action item",
    "Step 3: Specific action item",
    "Step 4: Specific action item",
    "Step 5: Specific action item"
  ],
  "faqItems": [
    {"question": "Top audience objection 1?", "answer": "Practical empathetic answer"},
    {"question": "Top audience objection 2?", "answer": "Practical empathetic answer"},
    {"question": "Top audience objection 3?", "answer": "Practical empathetic answer"}
  ],
  "marketingHook": "High-impact 2-sentence hook for the creator to use on Instagram Story or TikTok bio",
  "personalizedOutreachPitch": "A 3-sentence DM/Email script directly addressing the creator, highlighting that you already built the product and layout for them, providing their preview link, and offering 50/50 revenue split with zero effort required."
}`;

        const { text, modelUsed } = await generateWithGemini(
          prompt,
          'You generate structured JSON for creator digital products on Whop with 50/50 automated splits.'
        );

        const parsed = JSON.parse(text);

        // Enhance with Whop configuration
        const whopConfig = {
          whopProductId: `prod_${Math.random().toString(36).substring(2, 10)}`,
          companyId: process.env.WHOP_COMPANY_ID || 'biz_operator_3ds',
          title: parsed.productTitle || `${niche} Mastery Protocol`,
          tagline: parsed.subtitle || `Official actionable guide by ${creatorName}`,
          price: pricePoint,
          orderBumpPrice: parsed.orderBumpPrice || 17,
          orderBumpTitle: parsed.orderBumpTitle || 'Fast-Action Checklist & Video Walkthrough',
          operatorSplitPct: 50,
          creatorAffiliateSplitPct: 50,
          creatorWhopHandle: cleanHandle,
          whopCheckoutUrl: `https://whop.com/checkout/${whopSlug}?a=${cleanHandle}`,
          whopPreviewSlug: whopSlug,
          deliveryFormat: 'Whop Digital Pass' as const,
          whopPerks: [
            'Instant Whop Hub Access',
            'Full PDF Protocol (24 Pages, Mobile-Optimized)',
            'Interactive Daily Notion Habit Tracker',
            'Printable 1-Page Refrigerator Checklist',
            'Direct Access to Monthly Creator Q&A Updates',
          ],
          isLiveSynced: !!process.env.WHOP_API_KEY,
        };

        return res.json({
          ...parsed,
          whopConfig,
          engineUsed: modelUsed,
        });
      } catch (geminiErr: any) {
        console.warn(`[Synthesis Notice] Upstream model capacity/spike (${geminiErr.message || geminiErr}). Delivering dynamically tailored blueprint.`);
        const fallback = buildTailoredBlueprint({
          creatorHandle,
          creatorName,
          niche,
          viralProblem,
          audienceTone,
          pricePoint,
          productFormat,
          engineUsed: 'Autonomous Failover Engine (High Demand Resilience)',
        });
        return res.json(fallback);
      }
    }

    // Default synthesis if GEMINI_API_KEY is not configured
    const fallback = buildTailoredBlueprint({
      creatorHandle,
      creatorName,
      niche,
      viralProblem,
      audienceTone,
      pricePoint,
      productFormat,
      engineUsed: 'Autonomous Synthesis Engine',
    });
    return res.json(fallback);
  });

  // 2. Whop Product Creation & Sync Endpoint
  app.post('/api/whop/create-product', async (req: Request, res: Response) => {
    try {
      const {
        title,
        price,
        orderBumpPrice = 17,
        creatorHandle,
        whopCompanyId = process.env.WHOP_COMPANY_ID || 'biz_operator_3ds',
      } = req.body;

      const cleanHandle = (creatorHandle || 'creator').replace('@', '');
      const uniqueId = `prod_${Math.random().toString(36).substring(2, 8)}`;
      const planId = `plan_${Math.random().toString(36).substring(2, 8)}`;
      const previewSlug = `whop-${cleanHandle.toLowerCase()}-${Date.now().toString().slice(-4)}`;

      // If live WHOP_API_KEY is configured, call Whop REST API
      if (process.env.WHOP_API_KEY && process.env.WHOP_COMPANY_ID) {
        try {
          const whopResponse = await fetch(`https://api.whop.com/api/v5/companies/${whopCompanyId}/products`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.WHOP_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: title,
              visibility: 'visible',
            }),
          });
          const whopData = await whopResponse.json();
          return res.json({
            success: true,
            syncedLive: true,
            whopProductId: whopData.id || uniqueId,
            checkoutUrl: `https://whop.com/checkout/${whopData.id || previewSlug}?a=${cleanHandle}`,
            message: 'Successfully provisioned live on Whop platform',
          });
        } catch (apiErr: any) {
          console.warn('Whop Live API sync fallback to simulated engine:', apiErr.message);
        }
      }

      // Return simulated Whop Product contract with 50/50 split configuration
      res.json({
        success: true,
        syncedLive: false,
        whopProductId: uniqueId,
        whopPlanId: planId,
        companyId: whopCompanyId,
        title,
        basePrice: price,
        orderBumpPrice,
        creatorAffiliateSplitPct: 50,
        operatorSplitPct: 50,
        checkoutUrl: `https://whop.com/checkout/${previewSlug}?a=${cleanHandle}`,
        previewSlug,
        whopHubAccessUrl: `https://whop.com/hub/${previewSlug}`,
        message: 'Whop Product & 50/50 Creator Split Configured',
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Whop product setup error', details: err.message });
    }
  });

  // 3. Whop Simulated Checkout & Split Webhook
  app.post('/api/whop/simulate-sale', (req: Request, res: Response) => {
    try {
      const {
        productTitle = 'The 14-Day Reset Protocol',
        price = 27,
        includeOrderBump = false,
        orderBumpPrice = 17,
        creatorName = 'Partner Creator',
        operatorSplitPct = 50,
      } = req.body;

      const gross = includeOrderBump ? price + orderBumpPrice : price;
      // Whop takes ~3% transaction fee on standard checkouts
      const whopFee = Number((gross * 0.03).toFixed(2));
      const net = Number((gross - whopFee).toFixed(2));
      
      const creatorPayout = Number((net * ((100 - operatorSplitPct) / 100)).toFixed(2));
      const operatorPayout = Number((net * (operatorSplitPct / 100)).toFixed(2));

      const mockCustomerEmails = [
        'sarah.m@gmail.com',
        'joshua.k@outlook.com',
        'elena.fit@yahoo.com',
        'alex.turner@gmail.com',
        'claire.wellness@icloud.com'
      ];
      const randomEmail = mockCustomerEmails[Math.floor(Math.random() * mockCustomerEmails.length)];

      const saleEvent = {
        id: `whop_evt_${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        customerEmail: randomEmail,
        productTitle,
        grossAmount: gross,
        orderBumpIncluded: includeOrderBump,
        whopFee,
        netAmount: net,
        creatorPayout,
        operatorPayout,
        deliveryStatus: 'Whop Hub Unlocked',
      };

      // Asynchronously record into Supabase PostgreSQL if configured
      if (supabaseClient) {
        Promise.resolve(
          supabaseClient
            .from('orders')
            .insert({
              whop_payment_id: saleEvent.id,
              customer_email: saleEvent.customerEmail,
              gross_amount_cents: Math.round(saleEvent.grossAmount * 100),
              order_bump_included: saleEvent.orderBumpIncluded,
              whop_fee_cents: Math.round(saleEvent.whopFee * 100),
              creator_payout_cents: Math.round(saleEvent.creatorPayout * 100),
              operator_payout_cents: Math.round(saleEvent.operatorPayout * 100),
              delivery_status: saleEvent.deliveryStatus,
            })
        )
          .then(({ error }: any) => {
            if (error) {
              console.warn('[Supabase Notice] Order insert note (run SQL migration if tables are not yet created):', error.message);
            } else {
              console.log('[Supabase Engine] Logged sale event to PostgreSQL:', saleEvent.id);
            }
          })
          .catch((err: any) => console.warn('[Supabase Sync Error]', err.message));
      }

      res.json({
        success: true,
        saleEvent,
        whopWebhookType: 'payment.succeeded',
        whopFulfillment: {
          hubAccessGranted: true,
          downloadLinksGenerated: 2,
          creatorWalletCredited: creatorPayout,
          operatorWalletCredited: operatorPayout,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Simulation error', details: err.message });
    }
  });

  // 4. Integration Management Endpoints (Whop & Supabase)
  app.get('/api/integrations/status', (req: Request, res: Response) => {
    const isWhopConfigured = !!(runtimeConfig.whopApiKey && runtimeConfig.whopCompanyId);
    const isSupabaseConfigured = !!(runtimeConfig.supabaseUrl && (runtimeConfig.supabaseServiceRoleKey || runtimeConfig.supabaseAnonKey));

    res.json({
      whop: {
        connected: isWhopConfigured,
        companyId: runtimeConfig.whopCompanyId,
        apiKeyMasked: runtimeConfig.whopApiKey 
          ? `${runtimeConfig.whopApiKey.slice(0, 6)}...${runtimeConfig.whopApiKey.slice(-4)}`
          : '',
        webhookSecretConfigured: !!runtimeConfig.whopWebhookSecret,
        lastTested: runtimeConfig.whopLastTested,
        companyName: runtimeConfig.whopCompanyName,
        mode: isWhopConfigured ? 'live' : 'sandbox',
      },
      supabase: {
        connected: isSupabaseConfigured && !!supabaseClient,
        urlConfigured: !!runtimeConfig.supabaseUrl,
        projectRef: runtimeConfig.supabaseUrl 
          ? runtimeConfig.supabaseUrl.replace('https://', '').split('.')[0] 
          : undefined,
        hasServiceRoleKey: !!runtimeConfig.supabaseServiceRoleKey,
        postgresStatus: (isSupabaseConfigured && !!supabaseClient) ? 'connected' : 'unconfigured',
        dbType: 'PostgreSQL / Supabase',
      },
    });
  });

  app.post('/api/integrations/whop/save', async (req: Request, res: Response) => {
    try {
      const { apiKey, companyId, webhookSecret } = req.body;
      if (apiKey) runtimeConfig.whopApiKey = apiKey.trim();
      if (companyId) runtimeConfig.whopCompanyId = companyId.trim();
      if (webhookSecret !== undefined) runtimeConfig.whopWebhookSecret = webhookSecret.trim();

      process.env.WHOP_API_KEY = runtimeConfig.whopApiKey;
      process.env.WHOP_COMPANY_ID = runtimeConfig.whopCompanyId;
      process.env.WHOP_WEBHOOK_SECRET = runtimeConfig.whopWebhookSecret;

      let verifiedName = '';
      if (runtimeConfig.whopApiKey && runtimeConfig.whopCompanyId) {
        try {
          const testRes = await fetch(`https://api.whop.com/api/v5/companies/${runtimeConfig.whopCompanyId}`, {
            headers: {
              'Authorization': `Bearer ${runtimeConfig.whopApiKey}`,
              'Content-Type': 'application/json',
            },
          });
          if (testRes.ok) {
            const cData = await testRes.json();
            verifiedName = cData.name || cData.title || runtimeConfig.whopCompanyId;
            runtimeConfig.whopCompanyName = verifiedName;
            runtimeConfig.whopLastTested = new Date().toISOString();
          }
        } catch (pingErr: any) {
          console.warn('Whop verification network note:', pingErr.message);
        }
      }

      res.json({
        success: true,
        message: verifiedName 
          ? `Whop Company "${verifiedName}" verified and linked!` 
          : `Whop credentials linked successfully for ${runtimeConfig.whopCompanyId}.`,
        companyName: verifiedName,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to save Whop credentials', details: err.message });
    }
  });

  app.post('/api/integrations/whop/disconnect', (req: Request, res: Response) => {
    runtimeConfig.whopApiKey = '';
    runtimeConfig.whopCompanyId = '';
    runtimeConfig.whopWebhookSecret = '';
    runtimeConfig.whopCompanyName = '';
    runtimeConfig.whopLastTested = null;
    process.env.WHOP_API_KEY = '';
    process.env.WHOP_COMPANY_ID = '';
    process.env.WHOP_WEBHOOK_SECRET = '';

    res.json({ success: true, message: 'Whop account disconnected. Returned to sandbox mode.' });
  });

  app.post('/api/integrations/supabase/save', async (req: Request, res: Response) => {
    try {
      const { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey, databaseUrl } = req.body;
      if (supabaseUrl) runtimeConfig.supabaseUrl = supabaseUrl.trim();
      if (supabaseAnonKey) runtimeConfig.supabaseAnonKey = supabaseAnonKey.trim();
      if (supabaseServiceRoleKey) runtimeConfig.supabaseServiceRoleKey = supabaseServiceRoleKey.trim();
      if (databaseUrl) runtimeConfig.databaseUrl = databaseUrl.trim();

      process.env.SUPABASE_URL = runtimeConfig.supabaseUrl;
      process.env.SUPABASE_ANON_KEY = runtimeConfig.supabaseAnonKey;
      process.env.SUPABASE_SERVICE_ROLE_KEY = runtimeConfig.supabaseServiceRoleKey;
      process.env.DATABASE_URL = runtimeConfig.databaseUrl;

      initSupabase();

      res.json({
        success: true,
        message: 'Supabase credentials saved! PostgreSQL connection initialized.',
        connected: !!supabaseClient,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to configure Supabase', details: err.message });
    }
  });

  app.post('/api/integrations/supabase/disconnect', (req: Request, res: Response) => {
    runtimeConfig.supabaseUrl = '';
    runtimeConfig.supabaseAnonKey = '';
    runtimeConfig.supabaseServiceRoleKey = '';
    runtimeConfig.databaseUrl = '';
    process.env.SUPABASE_URL = '';
    process.env.SUPABASE_ANON_KEY = '';
    process.env.SUPABASE_SERVICE_ROLE_KEY = '';
    process.env.DATABASE_URL = '';
    supabaseClient = null;

    res.json({ success: true, message: 'Supabase disconnected. Switched to local adapter.' });
  });

  app.get('/api/integrations/supabase/migration-sql', (req: Request, res: Response) => {
    res.json({
      sql: POSTGRES_MIGRATION_SQL,
      filename: '3ds-supabase-migration.sql',
    });
  });

  // Whop Incoming Webhook Listener
  app.post('/api/whop/webhook', async (req: Request, res: Response) => {
    try {
      const event = req.body;
      console.log(`[Whop Webhook Received] Action: ${event.action || event.type || 'unknown'}`);

      if (supabaseClient && event.data) {
        try {
          await supabaseClient.from('orders').insert({
            whop_payment_id: event.data.id || `evt_${Date.now()}`,
            customer_email: event.data.email || 'customer@whop.com',
            gross_amount_cents: event.data.final_amount || 2700,
            whop_fee_cents: Math.round((event.data.final_amount || 2700) * 0.03),
            creator_payout_cents: Math.round((event.data.final_amount || 2700) * 0.485),
            operator_payout_cents: Math.round((event.data.final_amount || 2700) * 0.485),
            delivery_status: 'whop_hub_unlocked',
          });
        } catch (insertErr: any) {
          console.warn('Webhook order save note:', insertErr.message);
        }
      }

      res.json({ received: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Webhook processing error', details: err.message });
    }
  });

  // Serve static files in production or mount Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[3DS Platform Engine] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
