'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Mail,
  Calendar,
  ChevronDown,
  Bot,
  User,
  ArrowLeft,
  Check,
  Loader2,
} from 'lucide-react';
import { BookingCalendar } from '@/components/booking-calendar';

/* ─────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────── */

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface KBEntry {
  keywords: string[];
  answer: string;
}

/* ─────────────────────────────────────────────────────────────
   Knowledge Base — trained on topbuildercfo.com,
   salisburybookkeeping.com, and the integrations codebase
   ───────────────────────────────────────────────────────────── */

const KNOWLEDGE_BASE: KBEntry[] = [
  // ── Getting Started ──
  {
    keywords: ['setup', 'start', 'begin', 'get started', 'onboard', 'first time', 'new', 'how do i use', 'how does it work', 'how to'],
    answer: `Welcome to BuilderCFO! Setup takes under 5 minutes:\n\n1. **Connect QuickBooks Online** — Go to Integrations and click "Connect QBO"\n2. **Connect your PM tool** — We also integrate with Buildertrend, Procore, ServiceTitan, HubSpot, Salesforce, and JobNimbus\n3. **Sync your data** — Hit "Sync with QBO" in the top bar\n4. **Explore your dashboard** — Revenue, cash flow, job costing, WIP, and AR/AP populate automatically\n\nYour QBO connection is **read-only** — BuilderCFO cannot modify your accounting data. All data is encrypted (AES-256 at rest, TLS 1.3 in transit).\n\nWant us to set it up for you? That's included free — just book a call above.`,
  },
  // ── Integrations — General ──
  {
    keywords: ['integrate', 'integration', 'integrations', 'connect', 'tools', 'software', 'platform', 'what do you connect'],
    answer: `**BuilderCFO integrates with 7+ platforms:**\n\n**Accounting:**\n• **QuickBooks Online** — P&L, balance sheet, invoices, bills, cash flow\n\n**Project & Field Management:**\n• **Procore** — Project budgets, cost codes, change orders, pay apps\n• **Buildertrend** — Job costs, budgets, change orders, schedules, daily logs\n• **ServiceTitan** — Service jobs, invoices, technician performance (HVAC/plumbing/electrical)\n\n**CRM & Sales:**\n• **Salesforce** — Leads, contacts, opportunities, pipeline\n• **HubSpot** — Contacts, deals, pipeline, email tracking\n• **JobNimbus** — Contacts, jobs, estimates, invoices (roofing/exterior)\n\nAll integrations sync automatically and map to a unified view. Go to **Integrations** in the sidebar to connect.`,
  },
  // ── QuickBooks ──
  {
    keywords: ['quickbooks', 'qbo', 'accounting', 'chart of accounts', 'authorize', 'oauth'],
    answer: `**QuickBooks Online Integration:**\n\n1. Go to **Integrations** in the sidebar\n2. Click **"Connect QuickBooks Online"**\n3. Sign in to QBO and authorize BuilderCFO (read-only access via OAuth 2.0)\n4. Click **"Sync with QBO"** in the top bar\n\nBuilderCFO pulls your Chart of Accounts, invoices, bills, transactions, and customer/class data directly from QBO. We recommend using the **NAHB Chart of Accounts** for construction — ask us and we can help set that up.\n\nManage multiple companies? Connect each QBO file separately and use the client selector in the top bar.`,
  },
  // ── Buildertrend ──
  {
    keywords: ['buildertrend', 'builder trend', 'bt'],
    answer: `**Buildertrend Integration:**\n\nYes — BuilderCFO integrates directly with Buildertrend! Here's what syncs:\n\n• **Jobs/Projects** — All your active Buildertrend projects\n• **Budgets** — Budget items per job\n• **Change Orders** — Tracked and mapped to financials\n• **Schedules** — Milestone tracking\n• **Daily Logs** — Weather, notes, crew counts\n\nTo connect: Go to **Integrations** → click **Buildertrend** → enter your API key (or we can set up CSV import if you don't have API access).\n\nBuildertrend data combines with your QBO financials to give you a complete picture — field data + accounting in one dashboard.`,
  },
  // ── Procore ──
  {
    keywords: ['procore', 'pro core'],
    answer: `**Procore Integration:**\n\nBuildercFO integrates directly with Procore via OAuth 2.0. Here's what syncs:\n\n• **Project Budgets** — Full budget data per project\n• **Cost Codes** — Detailed cost code tracking\n• **Change Orders** — Mapped to your financial data\n• **Commitments** — Subcontract and PO tracking\n• **Pay Applications** — Draw/billing progress\n\nTo connect: Go to **Integrations** → click **Procore** → authorize via OAuth.\n\nProcore data merges with QBO to show true project profitability — field costs + booked revenue in one view.`,
  },
  // ── Salesforce ──
  {
    keywords: ['salesforce', 'sfdc', 'crm'],
    answer: `**Salesforce Integration:**\n\nBuilderCFO connects to Salesforce to bring your sales pipeline into the financial dashboard:\n\n• **Contacts** — Synced with account associations\n• **Opportunities** — Mapped as deals with stage and probability\n• **Pipeline** — Full pipeline visibility alongside financials\n• **Activities** — Tasks, calls, and meetings\n\nTo connect: Go to **Integrations** → click **Salesforce** → authorize via OAuth 2.0. Sandbox environments are supported.\n\nSalesforce is available on the **Pro tier** and above.`,
  },
  // ── HubSpot ──
  {
    keywords: ['hubspot', 'hub spot'],
    answer: `**HubSpot Integration:**\n\nBuilderCFO integrates with HubSpot to unify your CRM with financials:\n\n• **Contacts** — With lifecycle stage mapping\n• **Deals** — Pipeline stage, probability, and value\n• **Activities** — Calls, emails, meetings\n• **Email Tracking** — Engagement data\n\nTo connect: Go to **Integrations** → click **HubSpot** → authorize via OAuth or enter a Private App token.\n\nAvailable on the **Essential tier** and above.`,
  },
  // ── ServiceTitan ──
  {
    keywords: ['servicetitan', 'service titan', 'hvac', 'plumbing', 'electrical', 'trade'],
    answer: `**ServiceTitan Integration:**\n\nPurpose-built for HVAC, plumbing, and electrical contractors. BuilderCFO syncs:\n\n• **Service Jobs** — Full job data with cost tracking\n• **Invoices** — Billing and collection data\n• **Customers** — Contact records\n• **Technician Performance** — Tech-level metrics\n• **Estimates** — Quote data\n\nTo connect: Go to **Integrations** → click **ServiceTitan** → enter your Tenant ID and authorize via OAuth.\n\nAvailable on the **Pro tier** and above.`,
  },
  // ── JobNimbus ──
  {
    keywords: ['jobnimbus', 'job nimbus', 'roofing', 'storm', 'restoration', 'exterior'],
    answer: `**JobNimbus Integration:**\n\nDesigned for roofing, exterior, and storm restoration contractors. BuilderCFO syncs:\n\n• **Contacts** — Phone, email, company data\n• **Jobs** — Mapped as both deals and projects\n• **Estimates & Invoices** — Full billing data\n• **Tasks** — Activity tracking\n\nTo connect: Go to **Integrations** → click **JobNimbus** → enter your API key.\n\nAvailable on the **Essential tier** and above.`,
  },
  // ── Job Costing ──
  {
    keywords: ['job', 'costing', 'project', 'profitability', 'margin', 'job cost', 'wip', 'work in progress', 'over-billing', 'under-billing', 'overbilling'],
    answer: `**Job Costing & WIP Tracking:**\n\nThe Job Costing page shows real-time profitability per project:\n\n• **Revenue vs. Cost** — Gross margin per job\n• **WIP Schedule** — Automated over/under-billing detection\n• **Profitability %** — Ranked from highest to lowest margin\n• **Budget vs. Actual** — When connected to Procore or Buildertrend\n• **Location filter** — View by division or branch\n\nThis is where BuilderCFO catches costly surprises. One client found **$140K in over-billing** across two jobs in their first week — money that would have been a cash bomb at closeout.\n\nMake sure QBO transactions are coded to the correct **Customer** or **Class** — that's how BuilderCFO maps them to jobs.`,
  },
  // ── Cash Flow ──
  {
    keywords: ['cash flow', 'cashflow', 'cash', 'flow', 'inflow', 'outflow', 'forecast', 'burn', 'runway', 'liquidity'],
    answer: `**Cash Flow Forecasting:**\n\nThe Cash Flow page gives you 30/60/90-day visibility:\n\n• **Inflows** (green) — Customer payments and deposits\n• **Outflows** (red) — Vendor payments and expenses\n• **Net Cash Flow** — The difference, trended over time\n• **Forecast** — Where your cash position is headed\n\nOne of our clients cut their AR by **21 days** (52 → 31) after using the cash flow dashboard to prioritize collections. As they put it: "Knowing cash position 2 months out changed everything."`,
  },
  // ── Invoices & AR ──
  {
    keywords: ['invoice', 'invoices', 'billing', 'ar', 'accounts receivable', 'outstanding', 'overdue', 'collect', 'past due', 'aging', 'retainage'],
    answer: `**Invoices, AR Aging & Retainage:**\n\nThe Invoices page shows all open, paid, and overdue invoices:\n\n• **Outstanding** — Invoices awaiting payment\n• **Overdue** — Past-due invoices highlighted\n• **Aging buckets** — Current, 30, 60, 90+ days\n• **Retainage tracking** — Money held by GCs across multiple projects\n\nOne electrical subcontractor recovered **$34K in forgotten retainage** in Q1 using the retainage view — money that 8 different GCs owed but nobody was actively tracking.`,
  },
  // ── Reports ──
  {
    keywords: ['report', 'reports', 'financial', 'p&l', 'profit', 'loss', 'income', 'balance sheet', 'statement', 'export', 'print'],
    answer: `**Financial Reports:**\n\n• **Profit & Loss** — Revenue, COGS, gross profit, operating expenses, net income\n• **Cash Flow Summary** — Period-over-period cash position\n• **Job Profitability** — Which projects made (and lost) money\n• **AR/AP Aging** — Collections and payables by age bucket\n• **WIP Schedule** — Over/under-billing across all jobs\n\nAll reports pull live data from your synced integrations. Filter by date range or location.`,
  },
  // ── Overview Dashboard ──
  {
    keywords: ['overview', 'dashboard', 'home', 'summary', 'kpi', 'metric', 'widget', 'card', 'snapshot'],
    answer: `**Overview Dashboard:**\n\nYour real-time financial snapshot:\n\n• **Revenue (YTD)** — Total income with trend\n• **Net Cash** — Current liquidity\n• **WIP Over-Billing** — Flagged when above threshold\n• **AR Outstanding** — What you're owed\n• **AP Outstanding** — What you owe\n• **Retainage Held** — Money held across projects\n• **Top Jobs** — Highest-value active projects\n• **Cash Flow Forecast** — 30/60/90 day outlook\n\nAll figures update every time you sync.`,
  },
  // ── Multi-Location ──
  {
    keywords: ['location', 'locations', 'multi-location', 'multiple', 'branch', 'division', 'office', 'region', 'territory'],
    answer: `**Multi-Location Support:**\n\nBuilderCFO supports construction companies with multiple locations or divisions:\n\n• **Location Filter** in the sidebar — view data for a specific branch\n• Locations map from QBO **Classes** or **Departments**\n• "All Locations" shows the company-wide view\n• Switch locations anytime without reloading\n\nFor multi-entity setups (separate QBO files), connect each account separately and use the client switcher.\n\nIdeal for companies with $500K–$50M in revenue across multiple offices.`,
  },
  // ── CFO Advisor ──
  {
    keywords: ['cfo', 'advisor', 'ai', 'advice', 'recommend', 'suggest', 'insight', 'analysis', 'intelligence'],
    answer: `**AI CFO Advisor:**\n\nAsk financial questions in plain English and get specific answers:\n\n• "Why did my margin drop on the Henderson job?"\n• "Am I over-billed on any jobs right now?"\n• "What's my cash position in 60 days?"\n\nThe AI pulls your QBO data, job costs, and WIP numbers to give actionable recommendations — not generic advice.\n\n**Starter** gets a monthly AI CFO brief. **Professional** and up get unlimited access.\n\nFor strategic planning beyond AI, book a quarterly strategy call (included in Enterprise, or available separately through Salisbury Bookkeeping).`,
  },
  // ── Pricing ──
  {
    keywords: ['price', 'pricing', 'cost', 'plan', 'subscription', 'pay', 'billing', 'trial', 'fee', 'how much', 'tier', 'starter', 'professional', 'enterprise'],
    answer: `**BuilderCFO Pricing:**\n\n**Starter — $199/mo**\n• Financial dashboard, job costing, WIP, cash flow\n• QuickBooks sync\n• Monthly AI CFO brief\n• Email support\n\n**Professional — $399/mo** (Most Popular)\n• Everything in Starter\n• Buildertrend, HubSpot, JobNimbus integrations\n• Sales pipeline dashboard\n• Unlimited AI CFO Advisor\n• AR/AP aging by job\n• Priority support\n\n**Enterprise — $599/mo**\n• Everything in Professional\n• Procore, Salesforce, ServiceTitan integrations\n• Quarterly strategy call with Salisbury Bookkeeping\n• Dedicated account manager\n\n**All plans:** 14-day free trial, 30-day money-back guarantee, no contracts, no setup fees, cancel anytime.`,
  },
  // ── Syncing ──
  {
    keywords: ['sync', 'pull', 'refresh', 'update', 'data', 'stale', 'old', 'not updating', 'latest'],
    answer: `**Syncing Your Data:**\n\nBuilderCFO syncs on demand:\n\n1. Click **"Sync with QBO"** in the top navigation bar\n2. Wait for the sync to complete (usually a few seconds)\n3. The page reloads with fresh data\n\nAll connected integrations (Procore, Buildertrend, etc.) sync together.\n\nIf data looks off after syncing, the most common cause is transactions in QBO that aren't assigned to a **Customer** or **Class** — that's how BuilderCFO maps data to jobs and locations.`,
  },
  // ── Support / Issues ──
  {
    keywords: ['help', 'support', 'problem', 'issue', 'error', 'broken', 'not working', 'bug', 'wrong', 'missing', 'incorrect'],
    answer: `**Getting Support:**\n\n1. **Sync first** — Most data issues resolve after a fresh sync\n2. **Check QBO coding** — Missing data usually means transactions aren't assigned to a customer/class in QBO\n3. **Email us** — Use the "Email Us" button above\n4. **Book a call** — We can screen share and troubleshoot together\n\nWhen reaching out, include: what page you're on, what you expected to see, and what you're actually seeing. Typical response time is within one business day.`,
  },
  // ── Contact / Salisbury ──
  {
    keywords: ['contact', 'reach', 'talk', 'speak', 'human', 'person', 'cory', 'salisbury', 'team', 'who', 'founded', 'company', 'about'],
    answer: `**About BuilderCFO:**\n\nBuilderCFO is built by **Salisbury Bookkeeping**, a fractional CFO firm founded by **Cory and Jennifer Salisbury** in Eagle Mountain, Utah.\n\nSalisbury Bookkeeping specializes exclusively in construction — general contractors, specialty trades, builders, and remodelers with $500K–$10M in annual revenue. The dashboard automates the same WIP schedules, job costing reports, and cash flow forecasts that Salisbury's controllers build manually for clients.\n\n• **QuickBooks ProAdvisor Certified**\n• **NAHB Member**\n• **Procore Network Partner**\n• **5.0-star rating** from verified reviews\n\nUse the buttons above to email us or book a call.`,
  },
  // ── Multi-Client ──
  {
    keywords: ['client', 'clients', 'switch', 'multiple company', 'companies', 'multi-company', 'entity', 'accountant', 'bookkeeper'],
    answer: `**Managing Multiple Clients / Companies:**\n\nIf you're an accountant or bookkeeper managing multiple construction companies:\n\n• Use the **client selector** in the top bar to switch between companies\n• Each company has its own QBO connection and integration data\n• Connect additional companies via **Integrations → Connect QBO**\n• Location filters apply within each company's data\n\nAll client data is kept separate and secure with row-level security.`,
  },
  // ── Settings ──
  {
    keywords: ['settings', 'setting', 'account', 'profile', 'password', 'change', 'update', 'notification', 'preference'],
    answer: `**Account Settings:**\n\nGo to **Settings** in the sidebar to:\n\n• Update your profile name and company info\n• Manage connected integrations\n• Configure notification preferences\n• Update your password\n\nFor billing or subscription changes, use the "Email Us" button above.`,
  },
  // ── Security / Data ──
  {
    keywords: ['security', 'secure', 'data', 'privacy', 'encryption', 'safe', 'read-only', 'access'],
    answer: `**Security & Data Privacy:**\n\n• **Read-only access** — BuilderCFO cannot create, modify, or delete data in your accounting system\n• **OAuth 2.0** — Industry-standard authentication for QBO, Procore, Salesforce, and HubSpot\n• **AES-256 encryption** at rest\n• **TLS 1.3 encryption** in transit\n• **Row-level security** — Each client's data is isolated\n• **Supabase** — Secure PostgreSQL hosting\n• **Stripe** — PCI-compliant payment processing\n\nYour financial data is never shared, sold, or used for any purpose other than powering your dashboard.`,
  },
  // ── What BuilderCFO is / value ──
  {
    keywords: ['what is', 'what does', 'explain', 'tell me about', 'buildercfo', 'builder cfo', 'value', 'why', 'benefit', 'roi', 'return'],
    answer: `**What is BuilderCFO?**\n\nBuilderCFO is a real-time financial dashboard built exclusively for construction companies. It connects to QuickBooks Online and field management tools (Buildertrend, Procore, ServiceTitan) to automate:\n\n• Job costing with budget vs. actual\n• WIP schedules and over/under-billing detection\n• Cash flow forecasting (30/60/90 day)\n• AR/AP aging and retainage tracking\n• AI-powered CFO insights\n\n**Real results from contractors:**\n• $140K in over-billing caught before job close\n• $34K in forgotten retainage recovered in Q1\n• $8K in unbilled change orders found in 60 days\n• 21-day improvement in collections\n\nPlans start at **$199/mo** with a 14-day free trial. Compare that to a fractional controller at $3K–$8K/mo or a full-time CFO at $120K+/yr.`,
  },
  // ── Who is it for ──
  {
    keywords: ['who', 'for whom', 'target', 'type of company', 'contractor', 'builder', 'remodeler', 'sub', 'subcontractor', 'general contractor', 'gc'],
    answer: `**Who is BuilderCFO for?**\n\nBuilderCFO is built for construction companies with $500K–$50M in annual revenue:\n\n• **Custom home builders** tracking 5–15 active jobs\n• **General contractors** managing subs and retainage\n• **Remodelers** billing by phase or draw schedule\n• **Electrical, plumbing & HVAC subs** with retainage across multiple GCs\n• **Spec builders** managing lender draws\n• **Roofing & exterior** contractors (via JobNimbus integration)\n• **Multi-location companies** with multiple branches or divisions\n\nIf you use QuickBooks Online and want real-time visibility into where the money is going, BuilderCFO was built for you.`,
  },
  // ── NAHB / Chart of Accounts ──
  {
    keywords: ['nahb', 'chart of accounts', 'coa', 'account structure', 'account setup'],
    answer: `**NAHB Chart of Accounts:**\n\nBuilderCFO supports the **NAHB (National Association of Home Builders) Chart of Accounts**, which is the industry standard for construction bookkeeping.\n\nIf you're not already using a construction-specific COA in QBO, we can help you set one up — it's included with your subscription.\n\nThe NAHB COA is included on **Professional** and **Enterprise** plans (with trade-specific extensions on Enterprise).`,
  },
  // ── Fractional CFO / Bookkeeping Services ──
  {
    keywords: ['bookkeeping', 'fractional', 'controller', 'service', 'services', 'managed', 'done for you', 'outsource'],
    answer: `**Salisbury Bookkeeping Services:**\n\nBeyond the BuilderCFO dashboard, Salisbury Bookkeeping offers hands-on fractional CFO services:\n\n• **Essentials ($500–$1,500/mo)** — NAHB COA setup, job costing, monthly reporting, quarterly strategy calls\n• **Financial Command Center ($1,500–$4,000/mo)** — Full system implementation, QBO + PM integration, 13-week cash flow forecasting, weekly job cost reviews\n• **Rapid Recovery ($4,000/mo)** — Priority implementation, weekly owner calls, AR collection support, bonding/financing prep\n\nAll services include QuickBooks setup and integration with Buildertrend, Procore, or your PM tool of choice.\n\nStart with a **free 30-minute Profit Leak Finder** assessment — book a call above.`,
  },
];

/* ─────────────────────────────────────────────────────────────
   Defaults
   ───────────────────────────────────────────────────────────── */

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Hi! I'm the BuilderCFO support assistant. I can help with:\n\n• Setup & connecting QuickBooks, Buildertrend, Procore, and more\n• Dashboard features — job costing, WIP, cash flow, AR/AP\n• Integrations (we connect 7+ platforms)\n• Pricing, plans, and Salisbury Bookkeeping services\n\nWhat can I help you with?`,
  timestamp: new Date(),
};

const QUICK_QUESTIONS = [
  'What integrations do you support?',
  'How does job costing work?',
  'How do I connect Buildertrend?',
  'What are the pricing plans?',
];

/* ─────────────────────────────────────────────────────────────
   Answer Matching
   ───────────────────────────────────────────────────────────── */

function findAnswer(input: string): string {
  const normalized = input.toLowerCase();
  let bestMatch: KBEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        // Longer keywords are more specific → worth more
        score += 1 + (kw.length > 8 ? 1 : 0);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.answer;
  }

  return `I'm not sure I have a specific answer for that — but I can help!\n\nHere are some things I know about:\n• **Integrations** — QBO, Buildertrend, Procore, Salesforce, HubSpot, ServiceTitan, JobNimbus\n• **Features** — Job costing, WIP, cash flow, AR/AP, AI advisor, reports\n• **Pricing** — Starter ($199), Professional ($399), Enterprise ($599)\n• **Salisbury Bookkeeping** — Fractional CFO services for contractors\n\nOr use the buttons above to **email us** or **book a call** — we'll get back to you within one business day.`;
}

/* ─────────────────────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────────────────────── */

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  const formatContent = (text: string) => {
    return text.split('\n').map((line, i, arr) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {i < arr.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-[#6366f1]' : 'bg-[#22222e] border border-[#2a2a3d]'
        }`}
      >
        {isUser ? <User size={14} /> : <Bot size={14} className="text-[#6366f1]" />}
      </div>
      <div
        className={`max-w-[78%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-[#6366f1] text-white rounded-br-sm'
            : 'bg-[#1a1a26] border border-[#2a2a3d] text-[#e8e8f0] rounded-bl-sm'
        }`}
      >
        {formatContent(message.content)}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-[#22222e] border border-[#2a2a3d] flex items-center justify-center flex-shrink-0">
        <Bot size={14} className="text-[#6366f1]" />
      </div>
      <div className="bg-[#1a1a26] border border-[#2a2a3d] px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 bg-[#6366f1] rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-[#6366f1] rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 bg-[#6366f1] rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Email Form (replaces the broken mailto: link)
   ───────────────────────────────────────────────────────────── */

function EmailForm({ onBack, onSent }: { onBack: () => void; onSent: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `[Support Chat Email]\n\nFrom: ${name || 'Not provided'}\nReply-to: ${email || 'Not provided'}\n\n${message.trim()}`,
          userName: name || 'Chat User',
          companyName: 'via Support Chat',
        }),
      });
      setSent(true);
      setTimeout(() => {
        onSent();
      }, 2500);
    } catch {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="w-12 h-12 rounded-full bg-[#22c55e]/15 flex items-center justify-center mb-4">
          <Check size={24} className="text-[#22c55e]" />
        </div>
        <h3 className="text-base font-bold text-[#e8e8f0] mb-1">Message Sent!</h3>
        <p className="text-sm text-[#8888a0]">
          We'll reply to {email || 'you'} within one business day.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <p className="text-xs text-[#8888a0] mb-1">
        Send us a message and we'll reply within one business day.
      </p>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-[#1a1a26] border border-[#2a2a3d] focus:border-[#6366f1] rounded-xl px-3 py-2 text-sm text-[#e8e8f0] placeholder-[#555] outline-none transition-colors"
      />
      <input
        type="email"
        placeholder="Your email (so we can reply)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-[#1a1a26] border border-[#2a2a3d] focus:border-[#6366f1] rounded-xl px-3 py-2 text-sm text-[#e8e8f0] placeholder-[#555] outline-none transition-colors"
      />
      <textarea
        placeholder="How can we help?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        className="w-full bg-[#1a1a26] border border-[#2a2a3d] focus:border-[#6366f1] rounded-xl px-3 py-2.5 text-sm text-[#e8e8f0] placeholder-[#555] outline-none transition-colors resize-none"
        autoFocus
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || sending}
        className="w-full px-4 py-2.5 bg-[#6366f1] hover:bg-[#818cf8] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
      >
        {sending ? (
          <><Loader2 size={15} className="animate-spin" /> Sending...</>
        ) : (
          <><Send size={15} /> Send Message</>
        )}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────────────────────── */

type PanelView = 'chat' | 'calendar' | 'email';

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<PanelView>('chat');
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (open) {
      scrollToBottom();
      setUnread(0);
      if (view === 'chat') setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, view, scrollToBottom]);

  useEffect(() => {
    if (open && view === 'chat') scrollToBottom();
  }, [messages, isTyping, open, view, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
      setIsTyping(true);

      const delay = 600 + Math.random() * 800;
      await new Promise((r) => setTimeout(r, delay));

      const answer = findAnswer(trimmed);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, assistantMsg]);

      if (!open) setUnread((n) => n + 1);
    },
    [open]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const headerTitles: Record<PanelView, string> = {
    chat: 'BuilderCFO Support',
    calendar: 'Book a Call',
    email: 'Email Us',
  };

  const headerSubtitles: Record<PanelView, string> = {
    chat: 'Online · Usually replies instantly',
    calendar: '30-minute scope call · Mountain Time',
    email: 'We reply within one business day',
  };

  return (
    <>
      {/* Chat Panel */}
      <div
        className={`fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] transition-all duration-300 origin-bottom-right ${
          open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ maxHeight: 'calc(100vh - 120px)' }}
      >
        <div
          className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          style={{ height: view === 'chat' ? '540px' : 'auto', maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Header */}
          <div className="bg-[#6366f1] px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              {view !== 'chat' && (
                <button
                  onClick={() => setView('chat')}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white mr-1"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                {view === 'calendar' ? (
                  <Calendar size={18} className="text-white" />
                ) : view === 'email' ? (
                  <Mail size={18} className="text-white" />
                ) : (
                  <Bot size={18} className="text-white" />
                )}
              </div>
              <div>
                <div className="font-semibold text-white text-sm">{headerTitles[view]}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-[#22c55e] rounded-full" />
                  <span className="text-white/80 text-xs">{headerSubtitles[view]}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {view === 'calendar' ? (
            <div className="flex-1 overflow-y-auto p-4">
              <BookingCalendar />
            </div>
          ) : view === 'email' ? (
            <EmailForm onBack={() => setView('chat')} onSent={() => setView('chat')} />
          ) : (
            <>
              {/* Quick Actions */}
              <div className="border-b border-[#2a2a3d] px-3 py-2.5 flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setView('email')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1a1a26] hover:bg-[#22222e] border border-[#2a2a3d] hover:border-[#6366f1] rounded-lg text-xs font-medium text-[#e8e8f0] transition-all duration-150"
                >
                  <Mail size={13} className="text-[#6366f1]" />
                  Email Us
                </button>
                <button
                  onClick={() => setView('calendar')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1a1a26] hover:bg-[#22222e] border border-[#2a2a3d] hover:border-[#6366f1] rounded-lg text-xs font-medium text-[#e8e8f0] transition-all duration-150"
                >
                  <Calendar size={13} className="text-[#6366f1]" />
                  Book a Call
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length === 1 && !isTyping && (
                <div className="px-3 pb-2 flex flex-wrap gap-2 flex-shrink-0">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-2.5 py-1.5 bg-[#1a1a26] hover:bg-[#22222e] border border-[#2a2a3d] hover:border-[#6366f1] rounded-full text-[#c8c8e0] hover:text-[#e8e8f0] transition-all duration-150"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="border-t border-[#2a2a3d] px-3 py-3 flex-shrink-0">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 bg-[#1a1a26] border border-[#2a2a3d] focus:border-[#6366f1] rounded-xl px-3 py-2 text-sm text-[#e8e8f0] placeholder-[#8888a0] outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="w-9 h-9 flex items-center justify-center bg-[#6366f1] hover:bg-[#818cf8] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors flex-shrink-0"
                  >
                    <Send size={15} className="text-white" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating Bubble Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#6366f1] hover:bg-[#818cf8] rounded-full shadow-lg shadow-[#6366f1]/30 hover:shadow-[#6366f1]/50 transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Open support chat"
      >
        <div className="relative">
          {open ? (
            <X size={20} className="text-white" />
          ) : (
            <MessageCircle size={20} className="text-white" />
          )}
          {!open && unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </div>
        <span className="text-white font-medium text-sm pr-0.5">
          {open ? 'Close' : 'Support'}
        </span>
      </button>
    </>
  );
}
