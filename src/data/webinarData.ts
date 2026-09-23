import { VideoAnalysis } from '../types';

export const WEBINAR_ANALYSES: VideoAnalysis[] = [
  {
    id: 'session-1',
    youtubeId: 'MTZwSjiDg30',
    title: 'Easiest Way to Make Money Online For Beginners (LIVE)',
    speaker: 'Russell Brunson & Iman Gadzhi Ecosystem',
    durationApprox: '1 hr 43 min',
    primaryRole: 'Strategic Context',
    workflowStage: 'Strategic Foundation & Funnel Architecture',
    coreTakeaways: [
      'The "Picks and Shovels" Arbitrage: Content creators have abundant traffic and trust, but over 95% have zero product development skills and flawed monetization funnels.',
      'Funnel Hacking over Reinvention: Rather than guessing what sells, analyze existing top-performing digital assets, deconstruct their value ladder, and adapt the structure for untapped micro-niches.',
      'Scaling via Conversion Architecture: Scaling is not about getting 10x more eyeballs; it is about taking existing traffic and capturing 10x more customer lifetime value (LTV) through upsells, order bumps, and clean checkout flows.',
      'Demand is Never Scarce: You do not need an audience of your own. Traffic already congregates in micro-communities; the operator’s job is merely to bridge existing attention to a hyper-specific solution.'
    ],
    technologiesDemonstrated: [
      {
        name: 'Funnel Hacking / Spy Software',
        category: 'Market Intelligence',
        whatItDoesSpecifically: 'Analyzes competitor sales funnels, detects active Facebook/TikTok ad creatives, extracts landing page copy and checkout order bumps.',
        limitationOrConstraint: 'Commercial tools (AdSpy, ClickFunnels spy) are expensive ($100-$300/mo) and focus on broad dropshipping rather than creator digital products.',
        customCloneAlternative: 'Meta Ad Library API + Playwright scraper to extract competitor landing pages, plus Gemini to classify offer structure.'
      },
      {
        name: 'Funnel Builders (ClickFunnels / Leadpages)',
        category: 'Conversion Flow',
        whatItDoesSpecifically: 'Hosts high-converting 2-step order forms, 1-click upsells (OTO), and order bumps before digital delivery.',
        limitationOrConstraint: 'Heavy bloated page builders with slow mobile load times; cumbersome for simple creator link-in-bio mobile audiences.',
        customCloneAlternative: 'Tailwind + Next.js lightweight mobile-first checkout with Stripe Payment Element supporting 1-click Apple Pay/Google Pay.'
      }
    ],
    detailedBreakdown: `This foundational session frames the entire economic opportunity: why creating digital products for existing creators is the highest-leverage side hustle today. Russell Brunson highlights that most online beginners fail because they spend months trying to generate organic traffic from scratch. Instead, the "picks and shovels" operator approaches creators who already have 10,000 to 100,000 followers and provides the missing monetization engine. The session breaks down the math of how a creator with 50,000 followers can generate $10,000/month by simply offering a $27 digital protocol with an order bump, where the operator and creator split the net profit 50/50.`,
    actionableRules: [
      'Never build an audience first if you want immediate cashflow—borrow attention from creators with existing trust.',
      'Always include an Order Bump ($9 to $17) at checkout—it typically converts at 30-40% and pays for all hosting/tooling costs.',
      'Model proven offers: If an ebook or toolkit is selling in the fitness niche, adapt the psychological architecture to sleep, parenting, or career niches.'
    ],
    quotesAndMetrics: [
      '"Amateurs try to build an audience. Professionals build funnels for people who already have audiences."',
      '"A 1-click upsell can increase average cart value from $17 to $41 without spending a single extra dollar on traffic."'
    ]
  },
  {
    id: 'session-2',
    youtubeId: 'NE-62S4OYCg',
    title: "Let's Start a $373/Day Side Hustle Together (LIVE)",
    speaker: 'Iman Gadzhi & Monetise Team',
    durationApprox: '44 min',
    primaryRole: 'Mindset & Model',
    workflowStage: 'The AI Shadow Operator Business Model',
    coreTakeaways: [
      'The $373/Day Math: $373/day translates to $11,190/month or ~$135,000/year—achieved with just 14 daily sales of a $27 product or 8 sales of a $47 product.',
      'The "Shadow Operator" Identity: You remain 100% behind the scenes. No filming yourself, no TikTok dancing, no public social presence. The creator is the face; you are the silent technical/product architect.',
      'Demolishing Technical Barriers: What used to take a 4-person team (copywriter, graphic designer, web developer, funnel manager) is now executed by a single operator utilizing specialized AI workflows.',
      'Launch Speed as a Competitive Moat: Traditional agencies take 4-6 weeks to launch an offer. AI Shadow Operators launch fully packaged, branded digital products within 48 to 72 hours of partnering.'
    ],
    technologiesDemonstrated: [
      {
        name: 'AI Copy & Prompt Engineering Suites',
        category: 'Content Generation',
        whatItDoesSpecifically: 'Transforms raw domain knowledge and creator transcripts into sales copy, video sales letter (VSL) scripts, and curriculum outlines.',
        limitationOrConstraint: 'Generic ChatGPT outputs often sound robotic, bloated, and full of AI buzzwords if not grounded in creator voice.',
        customCloneAlternative: 'Structured JSON prompt pipeline using Gemini 2.5 Flash with specific negative constraints and creator tone embeddings.'
      },
      {
        name: 'Digital Packaging & Mockup Renderers',
        category: 'Asset Packaging',
        whatItDoesSpecifically: 'Generates 3D e-book covers, iPad/iPhone digital bundle mockups, and printable worksheets.',
        limitationOrConstraint: 'Requires manual Canva or Photoshop templates that take 1-2 hours per product.',
        customCloneAlternative: 'Automated HTML-to-Canvas / SVG 3D CSS mockup generator that renders creator avatar, title, and mockup on the fly.'
      }
    ],
    detailedBreakdown: `Session 2 establishes the target benchmark of $373/day and lays down the operational discipline of the "AI Shadow Operator." It details why traditional agencies fail: they demand monthly retainers ($2k-$5k) from microcreators who cannot afford them. The Shadow Operator flips the script by offering a 100% performance-based partnership: "I will build the product, build the store, handle the delivery, and we split revenue 50/50. You risk $0." Because the operator uses AI to build the product in hours, the downside is zero, while the upside across 2-4 creator partnerships produces $10k+ monthly recurring income.`,
    actionableRules: [
      'Offer zero-risk, performance-only terms: 50% split on net sales removes all friction in creator outreach.',
      'Benchmark your unit economics: Aim for $27-$47 front-end impulse pricing, where customers purchase without needing a phone consultation.',
      'Never ask the creator to create the product: Creators are exhausted by content production; hand them a finished product ready to link.'
    ],
    quotesAndMetrics: [
      '"$373 a day is the freedom threshold. At that point, you never have to work a 9-to-5 job again."',
      '"Creators are attention rich and time poor. If you ask them to write a 50-page book, it will never happen. If you hand them the book, you have a deal."'
    ]
  },
  {
    id: 'session-3',
    youtubeId: 'XmzgbRe9Pkg',
    title: 'Watch Me Build a Profitable Side Hustle in Under 1 Hour (LIVE)',
    speaker: 'Iman Gadzhi',
    durationApprox: '1 hr 14 min',
    primaryRole: 'Core Implementation',
    workflowStage: 'THE 3DS SYSTEM & 3 SWITCHES IMPLEMENTATION',
    coreTakeaways: [
      'The 3DS Framework Core: DEVELOP (AI creates the digital asset), DISTRIBUTE (borrowed microcreator audience), DELIVER (automated checkout and splits), and SCALE (compound across 4-5 creators).',
      'The "3 Switches" Rinse-and-Repeat Creator Distribution Process:',
      '  - Switch 1 (Partner): Filter microcreators with 10k to 100k followers (the "Goldilocks Zone"). Avoid mega-influencers whose DMs are clogged and managed by restrictive talent agencies.',
      '  - Switch 2 (Personalize): Ingest creator profile URL into AI software. The AI extracts recurring video hooks, comment complaints, and author tone, then compiles a tailor-made digital product.',
      '  - Switch 3 (Publish & Deliver): Launch on an automated link-in-bio checkout with instant digital file delivery and automated 50/50 revenue splitting directly to Stripe/bank accounts.',
      'Real Verified Case Studies:',
      '  - Zada: Partnered with a 70k follower parenting creator with a €14 sleep routine ebook; made €11,000 in month 1 and €6,000–€8,000/month consistently.',
      '  - James: Scaled an AI digital fitness & mobility guide from $6k to $19,000 in under 30 days across multiple creators.',
      '  - Gail (Medical Student): Teamed up with a certified pediatrician creator to release a toddler nutrition guide, netting a $13,000 payout and maintaining $10,000/mo across 4 creator partnerships.'
    ],
    technologiesDemonstrated: [
      {
        name: 'Synthesize AI (Monetise Proprietary Software)',
        category: 'Product & Voice Extraction Engine',
        whatItDoesSpecifically: 'Allows operator to paste a creator’s social profile link (Instagram/TikTok), analyzes their top performing content, extracts tone of voice and audience questions, and outputs a complete multi-chapter digital product blueprint and draft in minutes.',
        limitationOrConstraint: 'Locked inside expensive $1,995 Monetise course; closed proprietary system with no open API or custom webhooks.',
        customCloneAlternative: 'Build an open web pipeline: Apify Actor for profile scraping + Gemini 2.5 Flash for content clustering and markdown document compilation.'
      },
      {
        name: 'Automated Creator Outreach Matrix',
        category: 'Deal Flow Engine',
        whatItDoesSpecifically: 'Generates low-friction, value-first DMs and cold emails featuring a pre-built sample of the creator’s product before asking for a call.',
        limitationOrConstraint: 'Manual copy-pasting into Instagram DMs can trigger shadowbans or spam filters.',
        customCloneAlternative: 'Multi-channel email outreach (Instantly / Smartlead) targeting creator business emails found in bios + dynamic screenshot preview links.'
      },
      {
        name: 'Automated Storefront & Split Payouts (Stan Store / Whop / Gumroad)',
        category: 'Checkout & Delivery',
        whatItDoesSpecifically: 'Hosts mobile-optimized landing page, accepts Apple Pay/credit cards, delivers digital download, and automatically splits payout 50/50 to creator and operator.',
        limitationOrConstraint: 'Stan Store charges high monthly fees ($29-$99/mo) and does not offer deep custom branding or API programmability.',
        customCloneAlternative: 'Stripe Connect Custom/Express accounts with automated application fee transfers + Cloudflare R2 secure presigned download links.'
      }
    ],
    detailedBreakdown: `This is the centerpiece implementation session of the entire series. Iman Gadzhi shares his screen and executes the entire workflow live in under 60 minutes. 

First, he demonstrates how to find target microcreators: creators between 10k and 100k followers who have high engagement (3%+ comments-to-views ratio) but have either no link in bio or only an affiliate link making pennies. 

Next, he demonstrates "Synthesize AI": he inputs a creator’s profile URL, and the software extracts the creator's top 5 viral video topics, extracts the audience's repeated questions from comments, and builds a comprehensive 25-page actionable digital product (e.g. "The 14-Day Deep Sleep Reset" or "The Toddler Meal Mastery Blueprint").

Finally, he sets up the distribution engine ("Switch 1, 2, 3"). He shows the exact 3-sentence outreach script that presents the creator with a pre-built mockup and draft: "Hey [Name], I noticed 400 people asked for your exact routine on your pinned video. I turned your methodology into a polished 20-page protocol guide. Take a look here (link). If you like it, we can put it in your bio and split sales 50/50—zero work on your end."`,
    actionableRules: [
      'The "Goldilocks Rule": Always target 10k–100k microcreators. Below 10k lacks volume; above 100k has agency gatekeepers.',
      'Show, Don’t Tell: Never pitch a creator an "idea". Send them a generated 1-page preview of THEIR actual product with THEIR name on it.',
      'Automate the Split: Never manually calculate spreadsheets or wire money at the end of the month. Connect Stripe so payouts hit both accounts automatically on purchase.'
    ],
    quotesAndMetrics: [
      '"If you send a creator an email saying ‘can we get on a call to brainstorm a product?’, they delete it. If you send them: ‘I already made your product, here is chapter 1 and the cover’, they reply in 10 minutes."',
      '"Zada made €11,000 in her very first month with a €14 product because 70,000 people already trusted the creator."'
    ]
  },
  {
    id: 'session-4',
    youtubeId: 'zE6cfSnVWUs',
    title: "If I Wanted To Start an AI Side Hustle in 2026, I'd Do This (LIVE)",
    speaker: 'Iman Gadzhi',
    durationApprox: '1 hr 17 min',
    primaryRole: 'Tooling & Sequence',
    workflowStage: 'The 3DS Click Sequence & Outreach Automation',
    coreTakeaways: [
      'The 3DS Click Sequence: The exact chronological button-clicks required to go from zero to live revenue within 7 days.',
      'Tooling Synergy: Combining "Synthesize AI" for product creation with "ListKit" for high-accuracy creator database scraping (scraping business emails from Instagram/TikTok bios).',
      'The "Build in Silence" Doctrine: Do not announce your business, do not make a personal website, do not incorporate complex entities until your first creator partnership is live and profitable.',
      'The Rule of 30 Outreach: Sending 30 personalized sample pitches guarantees at least 2-3 positive replies, which is all you need to reach $5,000 to $10,000 monthly income.'
    ],
    technologiesDemonstrated: [
      {
        name: 'ListKit / Creator Database Scraper',
        category: 'Lead Generation',
        whatItDoesSpecifically: 'Extracts verified business emails, follower counts, engagement metrics, and niche categories from thousands of creator profiles simultaneously.',
        limitationOrConstraint: 'ListKit is paid subscription ($79-$199/mo) and focused on B2B lead lists rather than social media creator handles.',
        customCloneAlternative: 'Apify "Instagram Profile Scraper" / "TikTok Scraper" exporting directly to a Postgres/Supabase database filtered by engagement rate.'
      },
      {
        name: 'Digital Product Formula Framework',
        category: 'Curriculum & Structure Engine',
        whatItDoesSpecifically: 'A pedagogical template system that structures digital products into 4 core pillars: Diagnosis, Action Plan, Daily Checklist, and Resource Toolkit.',
        limitationOrConstraint: 'Static PDF worksheets requiring manual transcription.',
        customCloneAlternative: 'Dynamic interactive Notion template generator or Next.js customer portal with downloadable PDFs and audio summaries.'
      }
    ],
    detailedBreakdown: `Session 4 provides the operational playbook for executing the 3DS system efficiently. Iman emphasizes that the bottleneck is never product creation (AI solves that in minutes), but disciplined outreach. He walks through the "3DS Click Sequence": (1) Filter 100 creators using ListKit or Instagram search, (2) Run top 20 candidates through Synthesize AI to generate custom preview assets, (3) Send personalized value pitches with the sample product link, (4) Once accepted, hook up the automated store with split payments, and (5) Guide the creator on a simple 3-story launch sequence.`,
    actionableRules: [
      'Focus strictly on high-conversion niches: Health & Wellness (gut health, sleep, postpartum), Productivity & Career, and Hobbies/Skills.',
      'Always extract the creator’s direct business email from their Instagram bio rather than relying solely on Instagram DMs which end up in the "Requests" tab.',
      'Structure all digital products around immediate actionable implementation rather than long theoretical essays.'
    ],
    quotesAndMetrics: [
      '"You don’t need 100 clients. You need 2 good creators. Two creators doing 20 sales a day each will net you over $15,000 every single month."',
      '"The only reason people fail at this is inconsistency in outreach. If you send 5 pitches and stop, you lose. If you send 50, you win."'
    ]
  },
  {
    id: 'session-5',
    youtubeId: 'vybdr-hlalY',
    title: 'This Lazy AI Side Hustle Makes $11,267/Month (LIVE BREAKDOWN)',
    speaker: 'Iman Gadzhi & Special Guests',
    durationApprox: '1 hr 11 min',
    primaryRole: 'Knowledge Synthesis & Pricing',
    workflowStage: 'Viral Problem Discovery & Knowledge Synthesis',
    coreTakeaways: [
      'Curation Over Creation: The world does not need new information; it needs synthesized, curated, noise-free solutions. The solutions already exist in scientific papers, medical journals, and Reddit megathreads.',
      'Identifying "Viral Problems": A viral problem has 3 attributes: (1) High emotional urgency (insomnia, bloating, toddler tantrums, burnout), (2) Repeated in social media comment sections, and (3) Poorly served by generic Google search results.',
      'Pricing Architecture & Impulse Threshold: Pricing digital products between $17 and $47 maximizes conversion because buyers do not need to check their bank account or consult their spouse.',
      'The Backend Monetization Multiplier: Adding an optional $9 monthly community or $47 upsell bundle immediately increases profit margins by 60-80%.'
    ],
    technologiesDemonstrated: [
      {
        name: 'Market Analysis & Viral Hook Scrapers',
        category: 'Trend Discovery',
        whatItDoesSpecifically: 'Scrapes viral social media topics, Reddit discussions, and keyword trends to pinpoint rising consumer frustrations.',
        limitationOrConstraint: 'Scattered across different tools (Google Trends, TikTok Creative Center, Reddit search).',
        customCloneAlternative: 'Unified Reddit + TikTok sentiment scraper using LLM to extract recurring pain point clusters with urgency scores.'
      },
      {
        name: 'Scientific & Public Knowledge Synthesizers',
        category: 'Information Architecture',
        whatItDoesSpecifically: 'Aggregates PubMed studies, clinical guidelines, and expert consensus into digestible 10-step protocols.',
        limitationOrConstraint: 'Requires deep prompting knowledge to avoid hallucinated citations.',
        customCloneAlternative: 'RAG (Retrieval Augmented Generation) pipeline querying PubMed / Semantic Scholar or authoritative knowledge bases.'
      }
    ],
    detailedBreakdown: `The final session delves into the exact mechanics of generating $11,267/month passively. The key insight is that digital product creators waste months trying to write original books from scratch. Instead, high-performing products are concise syntheses of authoritative solutions to acute problems. The session shows how Gail (the medical student) took pediatric sleep and nutrition studies, combined them with the pediatrician creator's warm tone, and created a 22-page "Toddler Sleep & Meal Blueprint" that sold over 800 copies in 30 days at $27 each.`,
    actionableRules: [
      'The shorter and more actionable the product, the higher the completion rate and the lower the refund rate. A 20-page tactical checklist beats a 200-page book every time.',
      'Charge between $27 and $37 for the core guide, and offer a $17 companion workbook/template at the checkout toggle.',
      'Provide the creator with exact 3-part Story scripts: Hook (relatable problem) -> Personal Story -> Call to action with link.'
    ],
    quotesAndMetrics: [
      '"People do not pay for information. They pay for organization, curation, and the elimination of overwhelm."',
      '"A 15-page protocol that solves a mother’s toddler sleep crisis in 3 nights is worth 100 times more than a 400-page textbook."'
    ]
  }
];
