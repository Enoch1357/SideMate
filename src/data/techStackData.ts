import { TechStageBreakdown, CreatorPreset, GeneratedProductBlueprint } from '../types';

export const TECH_STAGES: TechStageBreakdown[] = [
  {
    stageNumber: 1,
    stageName: 'Viral Problem & Market Demand Discovery',
    objective: 'Pinpoint acute, emotionally charged consumer problems with high search demand and active social media chatter.',
    webinarTech: 'TikTok Creative Center + Google Trends + Reddit Megathreads + Proprietary Niche Checkers',
    whatItDoesSpecifically: 'Monitors trending hashtags, rising search queries, and comment sections across Reddit and TikTok. Filters topics where users frequently post questions like "How do I fix...", "Does anyone have a routine for...", or "What is the best way to..."',
    customCloneArchitecture: {
      recommendedStack: ['Node.js / Python Fastify', 'Reddit JSON API', 'Apify TikTok Search Actor', 'Gemini 2.5 Flash'],
      coreMechanism: 'Query top 20 lifestyle, wellness, and career subreddits (e.g., r/Parenting, r/Supplements, r/Productivity). Feed top 100 upvoted self-posts into Gemini with a prompt to cluster recurring unaddressed pain points and score their commercial purchase urgency (1-100).',
      apiEndpoints: [
        'GET /api/v1/discovery/trending-problems?niche=parenting',
        'POST /api/v1/discovery/cluster-pain-points'
      ],
      dataModel: `interface ProblemCluster {
  id: string;
  niche: string;
  problemStatement: string;
  urgencyScore: number; // 1-100
  sampleRedditPosts: string[];
  suggestedDigitalProductFormats: ('Protocol Guide' | 'Checklist' | 'Notion Template')[];
  estimatedImpulsePrice: number;
}`,
      samplePromptOrCode: `// LLM Prompt to extract acute problems:
"You are a consumer psychologist. Analyze these 50 forum posts from Reddit and TikTok comments. Identify the top 3 persistent 'acute pain points' where users feel frustrated, exhausted, or confused. For each, output: (1) Problem description, (2) Emotional triggers, (3) The ideal 1-sitting digital solution format, (4) Recommended price point ($17-$47). Output as strict JSON."`
    }
  },
  {
    stageNumber: 2,
    stageName: 'Microcreator Discovery & Audience Intelligence',
    objective: 'Identify creators in the 10,000–100,000 follower "Goldilocks zone" with high engagement and an unmonetized audience.',
    webinarTech: 'ListKit + Instagram Graph Scraping + TikTok Creator Marketplace',
    whatItDoesSpecifically: 'Queries creator databases by follower tier (10k-100k), filters by engagement rate (>2.5%), extracts bio links (checking if they lack their own digital product), and pulls the creator business email and recent post transcripts.',
    customCloneArchitecture: {
      recommendedStack: ['PostgreSQL / Supabase', 'Apify Instagram Profile Scraper', 'BullMQ Queue Worker', 'Cheerio / Regex'],
      coreMechanism: 'Scheduled scraper scrapes targeted hashtags (e.g. #pediatrician, #guthealthcoach). Parses creator bio for public business email and existing link-in-bio (Linktree, Beacons). Flags creators with high engagement who are either unmonetized or only have low-yield Amazon affiliate links.',
      apiEndpoints: [
        'GET /api/v1/creators/search?niche=health&minFollowers=10000&maxFollowers=100000',
        'POST /api/v1/creators/enrich-profile',
        'POST /api/v1/creators/score-monetization-readiness'
      ],
      dataModel: `interface CreatorLead {
  id: string;
  handle: string;
  platform: 'instagram' | 'tiktok';
  followerCount: number;
  engagementRate: number;
  businessEmail: string | null;
  existingBioLink: string | null;
  hasOwnProduct: boolean;
  readinessScore: number; // calculated 0-100
  topVideoHooks: string[];
}`,
      samplePromptOrCode: `// Automated monetization readiness filter:
function isPrimeCandidate(creator: CreatorLead): boolean {
  const inFollowerRange = creator.followerCount >= 10000 && creator.followerCount <= 100000;
  const hasStrongEngagement = creator.engagementRate >= 0.025; // 2.5%+
  const isUnmonetized = !creator.hasOwnProduct; // No Stan Store / Whop / Kajabi currently
  return inFollowerRange && hasStrongEngagement && isUnmonetized;
}`
    }
  },
  {
    stageNumber: 3,
    stageName: 'AI Product Synthesis Engine ("Synthesize AI" Clone)',
    objective: 'Transform creator content, transcripts, and domain knowledge into a fully structured, ready-to-sell digital product in minutes.',
    webinarTech: 'Synthesize AI (Iman Gadzhi Monetise proprietary tool)',
    whatItDoesSpecifically: 'Takes a creator’s profile URL or sample transcripts, analyzes their communication style, maps their core frameworks into a 4-part structure (Diagnosis, Protocol, Action Checklist, FAQs), and generates full chapter drafts, worksheets, and cover mockups.',
    customCloneArchitecture: {
      recommendedStack: ['Node.js TypeScript', '@google/genai (Gemini 2.5 Flash)', 'Puppeteer / PDFKit', 'Tailwind to PDF template'],
      coreMechanism: 'A 3-step prompt chain: (1) Voice Ingestion: Extract creator vocabulary, phrases, and posture from top 5 reel captions. (2) Curriculum Architecture: Generate 4-module outline with actionable exercises. (3) Full Draft Generation: Generate pristine markdown with callout boxes, daily routines, and implementation checklists.',
      apiEndpoints: [
        'POST /api/v1/synthesize/extract-voice',
        'POST /api/v1/synthesize/generate-outline',
        'POST /api/v1/synthesize/compile-product-pdf'
      ],
      dataModel: `interface DigitalProductSynthesis {
  id: string;
  creatorId: string;
  title: string;
  subtitle: string;
  productType: 'Protocol Guide' | 'Cheat Sheet Bundle' | 'Notion Template';
  price: number;
  modules: {
    number: number;
    title: string;
    actionSteps: string[];
    contentMarkdown: string;
  }[];
  pdfDownloadUrl?: string;
  samplePreviewChapterUrl: string;
}`,
      samplePromptOrCode: `// Step 2 & 3 Synthesis Prompt:
"You are a master digital curriculum architect. Using the extracted tone of voice and top recurring video lessons of @\${creatorHandle}, generate a comprehensive 20-page actionable protocol titled '\${title}'. 
Structure rules:
- No academic fluff or filler text.
- Use step-by-step numbered daily protocols.
- Include a 1-page printable checklist summarizing the entire routine.
- Maintain the creator's encouraging, authoritative tone. Output valid JSON with full module markdown."`
    }
  },
  {
    stageNumber: 4,
    stageName: 'Automated Creator Outreach & Sample Pitch Generator',
    objective: 'Secure 50/50 partnership agreements with microcreators by presenting a completed, branded preview upfront.',
    webinarTech: 'Cold DM Sequence + Automated Mockup Preview Link + 3-Sentence Value Script',
    whatItDoesSpecifically: 'Generates hyper-personalized cold outreach messages that link directly to a live, interactive 1-page preview of the product already created in their name, making acceptance a zero-friction "yes".',
    customCloneArchitecture: {
      recommendedStack: ['SendGrid / Resend API', 'Dynamic Preview Landing Page', 'PostgreSQL Lead Tracker', 'Automated Contract Signature API'],
      coreMechanism: 'When a product draft is generated, the system creates a secret preview link (e.g. app.com/preview/drtoddler-sleep). Sends an email or Instagram DM draft: "Hey [Name], I turned your viral routine into a 22-page actionable guide. Here is your preview link: [Link]. If you like it, we can put it in your bio tomorrow and split all sales 50/50. I handle all tech, customer service, and hosting."',
      apiEndpoints: [
        'POST /api/v1/outreach/generate-pitch',
        'POST /api/v1/outreach/send-email',
        'GET /api/v1/preview/:shareToken'
      ],
      dataModel: `interface OutreachCampaign {
  id: string;
  creatorId: string;
  pitchSubject: string;
  pitchBody: string;
  previewToken: string;
  sentAt?: string;
  status: 'drafted' | 'sent' | 'opened' | 'preview_viewed' | 'agreed';
  splitAgreedPct: number; // default 50
}`,
      samplePromptOrCode: `// The Exact Proven 3-Sentence Webinar Pitch Script:
"Subject: Built this for your audience (already done!)
Hey \${creatorName},
I noticed on your pinned reel about \${topic} that hundreds of followers were asking for a step-by-step breakdown.
I took your exact methodology and compiled it into a clean, 20-page protocol guide with your branding: \${previewUrl}
If you'd like to put this in your bio, I'll handle all the checkout tech, customer support, and delivery, and we split sales 50/50 straight to your bank account.
Take a look at the preview and let me know if you want me to turn on the store link!"`
    }
  },
  {
    stageNumber: 5,
    stageName: 'Whop Storefront, Digital Hub Delivery & Automated 50/50 Splits',
    objective: 'Handle mobile-first customer checkout, instant Whop Hub digital delivery, and automated 50/50 revenue sharing directly to Whop wallets without manual accounting or chargeback headaches.',
    webinarTech: 'Whop (Preferred & Selected Delivery Platform)',
    whatItDoesSpecifically: 'Creates digital product passes, gates PDF guides & Notion templates in the Whop Hub, generates high-converting mobile checkout links with Apple Pay, and automatically splits net earnings 50/50 between creator and operator using Whop Affiliates or Co-Owner revenue shares.',
    customCloneArchitecture: {
      recommendedStack: ['Whop API v5 / SDK', 'Whop Hub Customer Portal', 'Whop Affiliate Engine (50% Auto-Split)', 'Whop Webhooks (`payment.succeeded`)'],
      coreMechanism: 'Whop eliminates the friction of raw Stripe Connect where creators dread filling out merchant/tax questionnaires. Instead, the creator receives a Whop Co-Owner or 50% Affiliate link. When a customer buys ($27 + optional $17 bump), Whop takes standard processing (~3%), instantly unlocks the customer’s Whop Hub portal, and deposits 50% directly into the Creator’s Whop balance and 50% into the Operator’s Whop balance.',
      apiEndpoints: [
        'POST https://api.whop.com/api/v5/companies/:company_id/products',
        'POST https://api.whop.com/api/v5/plans',
        'POST https://api.whop.com/api/v5/affiliates',
        'POST /api/whop/webhook (listener for payment.succeeded)'
      ],
      dataModel: `interface WhopProductListing {
  id: string; // prod_xxxxx
  companyId: string;
  name: string;
  visibility: 'visible' | 'unlisted';
  plan: {
    id: string; // plan_xxxxx
    price: number; // e.g. $27.00
    billingPeriod: 'one_time';
    orderBumpPrice?: number; // e.g. $17.00
  };
  splitConfig: {
    creatorWhopUser: string;
    affiliateSplitPct: 50; // 50% automated
    operatorSplitPct: 50;
  };
  experiences: {
    fileDownload: string; // 24-page PDF Protocol
    notionTemplateUrl: string; // 1-page tracker
    hubCommunityChat: boolean;
  };
}`,
      samplePromptOrCode: `// Whop API v5 Product & 50/50 Split Provisioning:
const product = await fetch('https://api.whop.com/api/v5/companies/' + WHOP_COMPANY_ID + '/products', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + process.env.WHOP_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: blueprint.productTitle,
    description: blueprint.subtitle,
    experiences: ['exp_files_hub', 'exp_notion_access']
  })
});

// Configure 50% creator affiliate split
const affiliateLink = await fetch('https://api.whop.com/api/v5/affiliates', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + process.env.WHOP_API_KEY },
  body: JSON.stringify({
    product_id: product.id,
    commission_percentage: 50,
    affiliate_code: creator.handle.replace('@', '')
  })
});
// Checkout URL: https://whop.com/checkout/\${product.id}?a=\${creator.handle}`
    }
  }
];

export const PRESET_CREATORS: CreatorPreset[] = [
  {
    id: 'creator-pediatrician',
    handle: '@dr.toddler_wellness',
    name: 'Dr. Elena Miller, MD',
    niche: 'Pediatric Care & Toddler Sleep',
    followerCount: '68,400',
    platform: 'Instagram',
    viralProblem: 'Toddler 2-year sleep regression, night wakings, and parental burnout.',
    productType: 'E-Book / Protocol Guide',
    suggestedPrice: 27,
    expectedMonthlySales: 350,
    creatorAudienceTone: 'Compassionate, evidence-based, practical, reassuring for exhausted parents.',
    samplePostHook: '"If your toddler is waking up at 3:00 AM screaming, stop doing this one common bedtime mistake."'
  },
  {
    id: 'creator-guthealth',
    handle: '@guthealth_sam',
    name: 'Samira Chen',
    niche: 'Digestive Wellness & Bloating',
    followerCount: '44,200',
    platform: 'TikTok',
    viralProblem: 'Chronic post-meal bloating, brain fog, and confusion around low-FODMAP diets.',
    productType: 'Cheat Sheet & Checklist Kit',
    suggestedPrice: 19,
    expectedMonthlySales: 480,
    creatorAudienceTone: 'Relatable, science-simplified, energetic, zero BS.',
    samplePostHook: '"Here are the 4 pantry staples secretly causing your 4:00 PM stomach bloat."'
  },
  {
    id: 'creator-productivity',
    handle: '@notion_flow_alex',
    name: 'Alex Rivera',
    niche: 'Freelance & Student Productivity',
    followerCount: '85,000',
    platform: 'YouTube Shorts',
    viralProblem: 'Disorganized daily task paralysis, chaotic notes, and inability to stick to project deadlines.',
    productType: 'Notion Operating System',
    suggestedPrice: 37,
    expectedMonthlySales: 320,
    creatorAudienceTone: 'Minimalist, hyper-organized, aesthetic, high-efficiency.',
    samplePostHook: '"I stopped using 10 different productivity apps and replaced them with this 1 daily command center."'
  },
  {
    id: 'creator-mobility',
    handle: '@desk_mobility_coach',
    name: 'Marcus Vance, DPT',
    niche: 'Physical Therapy & Office Ergonomics',
    followerCount: '32,100',
    platform: 'Instagram',
    viralProblem: 'Lower back stiffness and neck pain from 8+ hours of daily desk work.',
    productType: 'E-Book / Protocol Guide',
    suggestedPrice: 24,
    expectedMonthlySales: 290,
    creatorAudienceTone: 'Anatomical clarity, actionable 5-minute fixes, motivating.',
    samplePostHook: '"Do these 3 seated decompression stretches every afternoon to eliminate lower back spasms."'
  }
];
