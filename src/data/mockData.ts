// ===== RESEARCH DATA =====
export const researchSummary = {
  niche: 'The AI fraud detection fintech space is rapidly maturing (~$38B market by 2027). Content landscape dominated by enterprise vendors — mid-market severely underserved.',
  opportunity: "Massive gap in practical, ROI-focused content for mid-market financial institutions. No one owns the 'AI fraud detection made accessible' narrative.",
  direction: 'Three pillars: 1) ROI & Implementation Guides, 2) Compliance & Regulatory (PCI DSS, SOX), 3) Technology Comparisons & Buyer Guides',
}

export interface TopicKeywords {
  primary: { kw: string; vol: string; diff: number; potential: string }
  secondary: { kw: string; vol: string; diff: number; rel: string }[]
  lsi: string[]
  entity: string[]
  questions: string[]
}

export interface TopicCompetitor {
  level: string
  dominant: string
  avgLen: string
  top: { domain: string; approach: string; strengths: string[]; weaknesses: string[]; quality: string }[]
  gaps: { gap: string; impact: string; action: string }[]
  strategy: { angle: string; timeline: string; confidence: number }
}

export interface Topic {
  id: number
  title: string
  primary_keyword: string
  intent: string
  stage: string
  difficulty: string
  volume: string
  cluster: string
  format: string
  why: string
  angle: string
  serp: string[]
  keywords: TopicKeywords
  competitor: TopicCompetitor
}

export const topics: Topic[] = [
  {
    id: 1, title: 'AI Fraud Detection ROI: Real Numbers from Mid-Size Banks', primary_keyword: 'AI fraud detection ROI', intent: 'commercial', stage: 'consideration', difficulty: 'medium', volume: '800-1,200', cluster: 'ROI & Business Case', format: 'case study', why: 'Decision-makers search this when evaluating vendors. Competitors have generic ROI pages but none with mid-market data — clear gap.', angle: 'Real anonymized data from 3 mid-size implementations', serp: ['featured_snippet', 'people_also_ask'],
    keywords: { primary: { kw: 'AI fraud detection ROI', vol: '800-1,200', diff: 42, potential: 'high' }, secondary: [{ kw: 'fraud detection cost savings', vol: '400-700', diff: 35, rel: 'high' }, { kw: 'AI anti-fraud return on investment', vol: '200-400', diff: 28, rel: 'high' }], lsi: ['false positive reduction', 'chargeback prevention', 'real-time scoring'], entity: ['PCI DSS', 'Featurespace', 'NICE Actimize'], questions: ['How much does AI fraud detection save banks?', 'What is the ROI of implementing AI?'] },
    competitor: { level: 'medium', dominant: 'whitepapers & case studies', avgLen: '2,500 words', top: [{ domain: 'featurespace.com', approach: 'Enterprise-focused case studies with Fortune 500 banks', strengths: ['Strong brand authority', 'Real data points'], weaknesses: ['No mid-market focus', 'Gated content'], quality: 'excellent' }], gaps: [{ gap: 'No mid-market bank ROI data in top 20 results', impact: 'high', action: 'Create the definitive mid-market ROI guide with real numbers' }], strategy: { angle: 'Ungated, data-rich ROI analysis for 100-5000 employee banks', timeline: '1-3 months', confidence: 8 } },
  },
  {
    id: 2, title: 'PCI DSS 4.0 and AI: What Your Fraud Team Needs to Know', primary_keyword: 'PCI DSS 4.0 AI fraud detection', intent: 'informational', stage: 'awareness', difficulty: 'low', volume: '1,500-2,500', cluster: 'Compliance & Regulatory', format: 'ultimate guide', why: 'PCI DSS 4.0 enforcement deadline is driving massive search interest. Nobody connects it specifically to AI fraud detection.', angle: 'Practical compliance checklist mapping PCI DSS 4.0 requirements to AI', serp: ['featured_snippet', 'people_also_ask'],
    keywords: { primary: { kw: 'PCI DSS 4.0 AI fraud detection', vol: '1,500-2,500', diff: 28, potential: 'high' }, secondary: [{ kw: 'PCI DSS 4.0 compliance checklist', vol: '2,000-3,500', diff: 35, rel: 'high' }, { kw: 'PCI DSS machine learning requirements', vol: '300-600', diff: 18, rel: 'high' }], lsi: ['transaction monitoring requirements', 'risk assessment automation', 'security controls'], entity: ['PCI SSC', 'Visa', 'Mastercard', 'SOX', 'GLBA'], questions: ['Does PCI DSS 4.0 require AI?', 'How does AI help with PCI DSS compliance?'] },
    competitor: { level: 'low', dominant: 'generic PCI guides', avgLen: '1,800 words', top: [{ domain: 'pcisecuritystandards.org', approach: 'Official documentation — technical and dense', strengths: ['Authoritative source'], weaknesses: ['Not actionable', 'No AI connection'], quality: 'good' }], gaps: [{ gap: 'No content connecting PCI DSS 4.0 to AI fraud detection tools', impact: 'high', action: 'Own the intersection of PCI DSS 4.0 + AI fraud detection' }], strategy: { angle: 'First practical guide bridging PCI DSS 4.0 compliance with AI implementation', timeline: '1-3 months', confidence: 9 } },
  },
  {
    id: 3, title: 'Featurespace vs Feedzai vs Sift: AI Fraud Detection Compared', primary_keyword: 'AI fraud detection comparison', intent: 'commercial', stage: 'decision', difficulty: 'medium', volume: '600-900', cluster: 'Buyer Guides', format: 'comparison', why: 'High-intent commercial query. No comprehensive unbiased comparison exists in top results.', angle: 'Neutral third-party comparison with scoring matrix across 8 criteria', serp: ['featured_snippet'],
    keywords: { primary: { kw: 'AI fraud detection comparison', vol: '600-900', diff: 45, potential: 'high' }, secondary: [{ kw: 'Featurespace vs Feedzai', vol: '300-500', diff: 30, rel: 'high' }], lsi: ['real-time scoring', 'false positive rate', 'integration APIs'], entity: ['Featurespace', 'Feedzai', 'Sift', 'NICE Actimize'], questions: ['Which AI fraud detection is best?', 'How do fraud detection vendors compare?'] },
    competitor: { level: 'medium', dominant: 'vendor landing pages', avgLen: '1,500 words', top: [{ domain: 'g2.com', approach: 'User review aggregation', strengths: ['Social proof'], weaknesses: ['No technical depth', 'Pay-to-play'], quality: 'good' }], gaps: [{ gap: 'No technical, criteria-based comparison exists', impact: 'high', action: 'Create definitive technical comparison with scoring matrix' }], strategy: { angle: 'Independent criteria-based evaluation buyers actually trust', timeline: '3-6 months', confidence: 7 } },
  },
  {
    id: 5, title: 'Real-Time Payment Fraud Detection: Architecture Guide for FedNow', primary_keyword: 'real-time payment fraud detection', intent: 'informational', stage: 'awareness', difficulty: 'low', volume: '2,000-3,500', cluster: 'Technology Guides', format: 'ultimate guide', why: "FedNow launch creating massive demand. First-mover advantage — most content is still about batch processing.", angle: 'Technical architecture blueprint specifically for FedNow instant payment screening', serp: ['featured_snippet', 'people_also_ask'],
    keywords: { primary: { kw: 'real-time payment fraud detection', vol: '2,000-3,500', diff: 32, potential: 'high' }, secondary: [{ kw: 'FedNow fraud detection', vol: '800-1,500', diff: 18, rel: 'high' }, { kw: 'instant payment fraud prevention', vol: '600-1,000', diff: 25, rel: 'high' }], lsi: ['sub-second scoring', 'streaming analytics', 'event-driven architecture', 'API latency'], entity: ['FedNow', 'Federal Reserve', 'ISO 20022', 'Kafka'], questions: ['How fast does fraud detection need to be for instant payments?', 'What architecture supports real-time fraud scoring?'] },
    competitor: { level: 'low', dominant: 'news articles', avgLen: '1,200 words', top: [{ domain: 'federalreserve.gov', approach: 'Official FedNow docs', strengths: ['Authoritative'], weaknesses: ['No fraud detection specifics'], quality: 'basic' }], gaps: [{ gap: 'No technical architecture guide for FedNow fraud detection exists', impact: 'high', action: 'Create the first comprehensive guide' }], strategy: { angle: 'First-mover technical guide for an emerging mandatory requirement', timeline: '1-3 months', confidence: 9 } },
  },
]

export const strategy = {
  quickWins: [2, 5],
  strongest: [2, 5, 1],
  longTerm: [3],
  order: [5, 2, 1, 3],
  reasoning: 'Start with FedNow (#5) — low competition, high volume, first-mover. Then PCI DSS (#2) for compliance authority. ROI case study (#1) for conversion. Comparison (#3) captures bottom-funnel once brand is established.',
}

// ===== CONTENT BRIEFS =====
export interface EeatDimension {
  score: number
  label: string
  feedback: string
}

export interface ContentBrief {
  id: string
  title: string
  keyword: string
  status: string
  eeat: number
  words: number
  author: string
  created: string
  cluster: string
  publishedOn?: string
  scheduledFor?: string
  outline: { sections: { heading: string; type: string }[] }
  article: { excerpt: string; content: string }
  eeatBreakdown: Record<string, EeatDimension>
  meta: { title: string; description: string; og_title: string; faq: { q: string; a: string }[] }
}

export const contentBriefs: ContentBrief[] = [
  {
    id: 'cb-001', title: 'AI Fraud Detection ROI: Real Numbers from Mid-Size Banks', keyword: 'AI fraud detection ROI', status: 'draft', eeat: 7.2, words: 1680, author: 'Jordan Kim', created: 'Feb 26, 2026', cluster: 'ROI & Business Case',
    outline: { sections: [{ heading: 'The True Cost of Fraud for Mid-Size Banks', type: 'h2' }, { heading: 'How AI Changes the ROI Equation', type: 'h2' }, { heading: 'Real Implementation Numbers: 3 Case Studies', type: 'h2' }, { heading: 'Building Your ROI Business Case', type: 'h2' }, { heading: 'FAQ: AI Fraud Detection ROI', type: 'h2' }] },
    article: { excerpt: "Mid-size banks face a paradox: fraud losses are rising while budgets for prevention remain flat. The answer for many has been AI-powered fraud detection — but what does the ROI actually look like?", content: "## The True Cost of Fraud for Mid-Size Banks\n\nFraud costs the average mid-size bank between $2.4M and $8.7M annually when you factor in direct losses, investigation costs, customer churn, and regulatory compliance overhead.\n\n## How AI Changes the ROI Equation\n\nTraditional rule-based fraud systems require constant manual tuning and average a 30–40% false positive rate. AI models learn from transaction patterns in real time, reducing false positives to under 8% while catching 94% of fraudulent transactions." },
    eeatBreakdown: { experience: { score: 6.5, label: 'Experience', feedback: 'Add first-person implementation insights or customer quotes. Anonymized case study data would boost this score.' }, expertise: { score: 7.8, label: 'Expertise', feedback: 'Strong technical depth on AI mechanisms. Consider adding author credentials or citing peer-reviewed studies.' }, authority: { score: 7.0, label: 'Authoritativeness', feedback: 'Good use of industry entities. Add backlink-worthy stats and reference regulatory bodies directly.' }, trust: { score: 7.4, label: 'Trustworthiness', feedback: 'Content is balanced. Add a methodology section for the case studies to increase transparency.' } },
    meta: { title: 'AI Fraud Detection ROI: Real Data from Mid-Size Banks [2026]', description: 'Discover real ROI numbers from 3 mid-size bank AI fraud detection implementations. Includes cost breakdown, timelines, and a CFO-ready business case template.', og_title: 'AI Fraud Detection ROI Calculator & Case Studies', faq: [{ q: 'How long to see ROI from AI fraud detection?', a: 'Most mid-size banks see measurable ROI within 6–9 months, with full payback in 12–18 months.' }] },
  },
  {
    id: 'cb-002', title: 'PCI DSS 4.0 and AI: What Your Fraud Team Needs to Know', keyword: 'PCI DSS 4.0 AI fraud detection', status: 'pending_approval', eeat: 8.3, words: 2140, author: 'Jordan Kim', created: 'Feb 24, 2026', cluster: 'Compliance & Regulatory',
    outline: { sections: [{ heading: 'PCI DSS 4.0: What Changed and Why It Matters', type: 'h2' }, { heading: 'Mapping AI Capabilities to PCI DSS 4.0 Requirements', type: 'h2' }, { heading: 'Implementation Checklist for Compliance Teams', type: 'h2' }, { heading: 'Common Compliance Pitfalls', type: 'h2' }, { heading: 'Building a Compliant AI Fraud Stack', type: 'h2' }] },
    article: { excerpt: "PCI DSS 4.0 enforcement began March 31, 2025. Most compliance guides treat it as a checkbox exercise — this one shows exactly how AI fraud detection maps to the new requirements.", content: "## PCI DSS 4.0: What Changed and Why It Matters\n\nThe Payment Card Industry Data Security Standard version 4.0 introduces 64 new requirements compared to v3.2.1. For fraud teams, the most impactful changes relate to continuous monitoring (Requirement 10.7), targeted risk analysis (Requirement 12.3), and automated threat detection." },
    eeatBreakdown: { experience: { score: 8.1, label: 'Experience', feedback: 'Excellent use of specific PCI DSS requirement numbers. Real-world compliance scenarios add strong practical credibility.' }, expertise: { score: 8.5, label: 'Expertise', feedback: 'Deep regulatory knowledge is evident. Consider adding QSA perspective or quote.' }, authority: { score: 8.2, label: 'Authoritativeness', feedback: 'References PCI SSC, Visa, and Mastercard directly. Link to official PCI SSC documentation.' }, trust: { score: 8.4, label: 'Trustworthiness', feedback: 'Well-balanced coverage of requirements. Includes important disclaimer about consulting QSAs.' } },
    meta: { title: 'PCI DSS 4.0 & AI Fraud Detection: Complete Compliance Guide [2026]', description: 'Learn how AI fraud detection maps to PCI DSS 4.0 requirements. Practical checklist, implementation timeline, and compliance pitfalls to avoid.', og_title: 'PCI DSS 4.0 AI Compliance Guide for Fraud Teams', faq: [{ q: 'Does PCI DSS 4.0 require AI for fraud detection?', a: 'PCI DSS 4.0 does not mandate AI specifically, but its continuous monitoring requirements are most efficiently met with AI-powered systems.' }] },
  },
  {
    id: 'cb-003', title: 'Featurespace vs Feedzai vs Sift: AI Fraud Detection Compared', keyword: 'AI fraud detection comparison', status: 'published', eeat: 8.1, words: 2380, author: 'Jordan Kim', created: 'Feb 20, 2026', publishedOn: 'Feb 22, 2026', cluster: 'Buyer Guides',
    outline: { sections: [{ heading: 'Evaluation Criteria', type: 'h2' }, { heading: 'Featurespace Deep Dive', type: 'h2' }, { heading: 'Feedzai Analysis', type: 'h2' }, { heading: 'Sift Review', type: 'h2' }, { heading: 'Scoring Matrix', type: 'h2' }] },
    article: { excerpt: "After analyzing 3 leading AI fraud detection platforms across 8 evaluation criteria, here's what mid-market banks actually need to know.", content: '' },
    eeatBreakdown: { experience: { score: 8.0, label: 'Experience', feedback: 'Strong practical evaluation criteria. Consider adding demo experience notes.' }, expertise: { score: 8.2, label: 'Expertise', feedback: 'Technical scoring matrix is excellent. Well-researched across all platforms.' }, authority: { score: 7.9, label: 'Authoritativeness', feedback: 'Independent perspective is a strength. Add methodology transparency section.' }, trust: { score: 8.3, label: 'Trustworthiness', feedback: 'Balanced across all vendors with clear scoring criteria.' } },
    meta: { title: 'Featurespace vs Feedzai vs Sift (2026): Unbiased Comparison', description: 'Independent comparison of 3 top AI fraud detection platforms across 8 criteria. Scoring matrix and mid-market recommendation included.', og_title: 'AI Fraud Detection Platform Comparison 2026', faq: [] },
  },
  {
    id: 'cb-004', title: 'Real-Time Payment Fraud Detection: Architecture Guide for FedNow', keyword: 'real-time payment fraud detection', status: 'scheduled', scheduledFor: 'Mar 5, 2026', eeat: 7.6, words: 1950, author: 'Jordan Kim', created: 'Feb 27, 2026', cluster: 'Technology Guides',
    outline: { sections: [{ heading: "FedNow's Fraud Challenge", type: 'h2' }, { heading: 'Architecture Blueprint', type: 'h2' }, { heading: 'Sub-Second Scoring Requirements', type: 'h2' }, { heading: 'Integration Patterns', type: 'h2' }] },
    article: { excerpt: "FedNow requires fraud decisions in under 1 second. Most existing fraud detection architectures weren't built for this constraint. Here's the technical blueprint.", content: '' },
    eeatBreakdown: { experience: { score: 7.2, label: 'Experience', feedback: 'Add specific latency benchmarks from real FedNow integrations. Architecture diagrams would strengthen this score.' }, expertise: { score: 8.0, label: 'Expertise', feedback: 'Excellent technical depth on streaming analytics. Strong use of Kafka and ISO 20022 references.' }, authority: { score: 7.5, label: 'Authoritativeness', feedback: 'Reference Federal Reserve FedNow documentation directly.' }, trust: { score: 7.7, label: 'Trustworthiness', feedback: 'Technically accurate content. Add performance benchmarks with testing methodology.' } },
    meta: { title: 'FedNow Real-Time Fraud Detection Architecture Guide [2026]', description: 'Technical blueprint for sub-second fraud detection on FedNow instant payments. Streaming architecture and latency optimization guide.', og_title: 'FedNow Fraud Detection: Real-Time Architecture', faq: [] },
  },
]

// ===== CALENDAR DATA =====
export const calendarItems = [
  { id: 1, title: 'AI Fraud ROI Article', type: 'blog', status: 'in_progress', day: 0, color: '#6366f1' },
  { id: 2, title: 'PCI DSS 4.0 Guide', type: 'blog', status: 'approval', day: 1, color: '#f59e0b' },
  { id: 3, title: 'LinkedIn: FedNow Fraud', type: 'linkedin', status: 'scheduled', day: 1, color: '#3b82f6' },
  { id: 4, title: 'Featurespace vs Feedzai', type: 'blog', status: 'published', day: 2, color: '#10b981' },
  { id: 5, title: 'Twitter: PCI DSS Tips', type: 'twitter', status: 'scheduled', day: 3, color: '#3b82f6' },
  { id: 6, title: 'False Positives Playbook', type: 'blog', status: 'planning', day: 4, color: '#8b5cf6' },
  { id: 7, title: 'FedNow Architecture', type: 'blog', status: 'scheduled', day: 4, color: '#10b981' },
  { id: 8, title: 'LinkedIn: ROI Stats', type: 'linkedin', status: 'planning', day: 6, color: '#6366f1' },
  { id: 9, title: 'Vendor Comparison Script', type: 'video', status: 'planning', day: 7, color: '#ec4899' },
  { id: 10, title: 'Monthly SEO Report', type: 'report', status: 'planning', day: 9, color: '#f59e0b' },
]

// ===== IMAGE PROMPTS DATA =====
export const imagePromptsData = [
  {
    images: [
      { type: 'Featured Image', prompt: 'A sleek dark-mode dashboard showing real-time fraud detection analytics for a mid-size bank. Left panel: transaction risk scores flowing in as a live stream. Center: AI neural network visualization with glowing nodes. Right: ROI metrics showing $2.4M saved. Deep navy background with electric blue accents. Photorealistic 3D render.', placement: 'Article hero / blog thumbnail', format: '1200\u00D7630px' },
      { type: 'Section Illustration', prompt: "Infographic: Two side-by-side bars \u2014 traditional rule-based fraud (40% false positives, red) vs AI fraud detection (7%, green). Clean flat design with bank icon and AI brain icon. White background, modern typography.", placement: "Under 'How AI Changes the ROI Equation'", format: '800\u00D7450px' },
      { type: 'Social Share Card', prompt: "LinkedIn post graphic: Dark navy background, bold white headline 'AI Fraud Detection ROI: Real Numbers'. Stat callouts: '$2.4M avg savings', '94% detection rate', '6-9 month payback'. Modern, professional, high contrast.", placement: 'LinkedIn & OG image', format: '1200\u00D7628px' },
    ],
  },
  {
    images: [
      { type: 'Featured Image', prompt: 'Compliance shield with PCI DSS 4.0 badge overlaid on an AI circuit board pattern. Dark gradient background, navy to slate. Shield glows blue-white. Lock icons and checkmarks orbit the shield. Corporate compliance aesthetic.', placement: 'Article hero', format: '1200\u00D7630px' },
      { type: 'Checklist Graphic', prompt: "Clean flat infographic: 'PCI DSS 4.0 AI Compliance Checklist'. 5 items with green checkmarks and small icons. White background, professional font, blue/green color scheme. Simple, printable style.", placement: 'Under compliance checklist section', format: '800\u00D7600px' },
    ],
  },
]

// ===== HELPER FUNCTIONS =====
export const intentColor = (i: string) =>
  ({ informational: '#3b82f6', commercial: '#f59e0b', transactional: '#10b981' }[i] || '#64748b')
export const stageColor = (s: string) =>
  ({ awareness: '#818cf8', consideration: '#f59e0b', decision: '#10b981' }[s] || '#64748b')
export const diffColor = (d: string) =>
  ({ low: '#10b981', medium: '#f59e0b', high: '#ef4444' }[d] || '#64748b')
export const diffNum = (d: string) => ({ low: -1, medium: 0, high: 1 }[d] ?? 0)

// ===== NOTIFICATIONS =====
export const notifs = [
  { id: 1, text: "EEAT Score improved to 8.3 for 'AI Fraud Detection'", time: '2m ago', type: 'success' },
  { id: 2, text: "Decay Alert: 'React Native 2025' dropped 3 positions", time: '15m ago', type: 'warning' },
  { id: 3, text: 'New content approved by Sarah Chen', time: '1h ago', type: 'info' },
  { id: 4, text: 'Daily priorities generated — 2 urgent actions', time: '3h ago', type: 'alert' },
]
