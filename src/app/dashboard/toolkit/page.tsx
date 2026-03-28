'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
  Sparkles,
  Lock,
  Copy,
  Check,
  Search,
  DollarSign,
  ClipboardList,
  TrendingUp,
  Calculator,
  FileText,
  Users,
  Briefcase,
  HardHat,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

// ─── Plan gating ───────────────────────────────────────────────
interface SubscriptionInfo {
  plan: 'basic' | 'pro' | 'enterprise';
  includesAiToolkit: boolean;
}

// ─── Prompt definitions ────────────────────────────────────────
interface Prompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  icon: React.ComponentType<any>;
  tags: string[];
}

const CATEGORIES = [
  { key: 'all', label: 'All Prompts' },
  { key: 'bookkeeping', label: 'Bookkeeping' },
  { key: 'cfo', label: 'CFO & Finance' },
  { key: 'job-costing', label: 'Job Costing' },
  { key: 'cash-flow', label: 'Cash Flow' },
  { key: 'tax', label: 'Tax & Compliance' },
  { key: 'pm-software', label: 'PM Software' },
  { key: 'client-comms', label: 'Client Comms' },
];

const PROMPTS: Prompt[] = [
  // ── Bookkeeping ──
  {
    id: 'bk-1',
    title: 'Monthly Close Checklist',
    description: 'Generate a complete month-end close checklist for a construction company.',
    prompt: `Create a detailed month-end close checklist for a construction company doing $[REVENUE] in annual revenue. Include: bank reconciliations, credit card reconciliations, AR/AP aging review, WIP adjustments, retainage reconciliation, payroll accruals, subcontractor 1099 tracking, equipment depreciation, job cost review, and financial statement preparation. Format as a numbered checklist with responsible party and deadline columns.`,
    category: 'bookkeeping',
    icon: ClipboardList,
    tags: ['month-end', 'close', 'reconciliation'],
  },
  {
    id: 'bk-2',
    title: 'Chart of Accounts Setup',
    description: 'Construction-specific chart of accounts optimized for job costing.',
    prompt: `Design a chart of accounts for a [TRADE TYPE] construction company (e.g., general contractor, electrical, plumbing, HVAC) using QuickBooks Online. Include: income accounts broken out by service type, COGS accounts for materials/labor/subs/equipment, overhead expense accounts, and balance sheet accounts including retainage receivable, retainage payable, WIP asset, and overbilling liability. Use 4-digit account numbers with logical groupings.`,
    category: 'bookkeeping',
    icon: FileText,
    tags: ['chart of accounts', 'setup', 'QuickBooks'],
  },
  {
    id: 'bk-3',
    title: 'Bank Reconciliation Troubleshooter',
    description: 'Diagnose and resolve common bank reconciliation discrepancies.',
    prompt: `I have a bank reconciliation discrepancy of $[AMOUNT] for [MONTH/YEAR] in my construction company's operating account. The bank statement balance is $[BANK BALANCE] and QuickBooks shows $[QB BALANCE]. Walk me through a systematic troubleshooting process: check for outstanding checks, deposits in transit, duplicate entries, uncleared transactions from prior months, bank fees not recorded, and common construction-specific issues like draw deposits posted to wrong accounts or retainage releases not recorded.`,
    category: 'bookkeeping',
    icon: Calculator,
    tags: ['reconciliation', 'troubleshooting', 'bank'],
  },
  {
    id: 'bk-4',
    title: 'Subcontractor Pay App Processor',
    description: 'Process and verify subcontractor pay applications against budget.',
    prompt: `Help me process a subcontractor pay application. The sub is [SUB NAME] on project [PROJECT NAME]. Contract amount: $[CONTRACT]. Previous billings: $[PREV BILLED]. This pay app: $[CURRENT BILLING]. Retainage rate: [RETAINAGE %]. Verify the math, calculate retainage withheld, net amount due, remaining contract balance, and percent complete. Flag any potential issues like overbilling or billing ahead of schedule.`,
    category: 'bookkeeping',
    icon: DollarSign,
    tags: ['pay app', 'subcontractor', 'billing'],
  },

  // ── CFO & Finance ──
  {
    id: 'cfo-1',
    title: 'WIP Schedule Builder',
    description: 'Build a Work-in-Progress schedule with over/under billing analysis.',
    prompt: `Create a WIP (Work-in-Progress) schedule for my construction company. I have [NUMBER] active jobs. For each job, I need columns for: contract amount, approved change orders, revised contract, estimated total cost, costs to date, estimated cost to complete, percent complete (cost method), earned revenue, actual billings to date, over/under billing, and gross profit. Also explain what actions I should take for jobs that are significantly overbilled (>10%) or underbilled (>10%).`,
    category: 'cfo',
    icon: TrendingUp,
    tags: ['WIP', 'over/under billing', 'percentage of completion'],
  },
  {
    id: 'cfo-2',
    title: 'Financial Health Scorecard',
    description: 'Analyze key financial ratios and benchmarks for construction companies.',
    prompt: `Analyze my construction company's financial health using these numbers: Revenue: $[REVENUE], Gross Profit: $[GP], Net Profit: $[NP], Total Assets: $[ASSETS], Total Liabilities: $[LIABILITIES], Current Assets: $[CA], Current Liabilities: $[CL], AR Balance: $[AR], AP Balance: $[AP], Backlog: $[BACKLOG]. Calculate and benchmark against industry standards: gross margin, net margin, current ratio, debt-to-equity, AR days, AP days, backlog-to-revenue ratio, and working capital. Give me a letter grade (A-F) for each metric.`,
    category: 'cfo',
    icon: TrendingUp,
    tags: ['ratios', 'benchmarks', 'financial health'],
  },
  {
    id: 'cfo-3',
    title: 'Bonding Capacity Estimator',
    description: 'Estimate your surety bonding capacity based on financial statements.',
    prompt: `Estimate my construction company's bonding capacity. Working Capital: $[WC], Net Worth: $[NW], Annual Revenue: $[REV], Largest Completed Job: $[LARGEST JOB], Bank Line of Credit: $[LOC], Current Backlog: $[BACKLOG]. Using standard surety underwriting formulas (10x working capital for aggregate, individual job limits based on net worth), calculate my estimated single job limit and aggregate program. Also list the top 5 things I can do to increase my bonding capacity.`,
    category: 'cfo',
    icon: Briefcase,
    tags: ['bonding', 'surety', 'capacity'],
  },
  {
    id: 'cfo-4',
    title: 'Overhead Rate Calculator',
    description: 'Calculate and optimize your overhead allocation rate.',
    prompt: `Calculate my construction company's overhead rate. Total annual overhead costs: $[OVERHEAD] (include office rent, admin salaries, insurance, vehicles, software, etc.). Total direct labor hours: [HOURS]. Total direct labor cost: $[LABOR COST]. Total revenue: $[REVENUE]. Calculate overhead rate as: percentage of direct labor cost, per direct labor hour, and percentage of revenue. Compare to industry benchmarks for [TRADE TYPE] contractors and recommend whether my overhead is too high, too low, or on target.`,
    category: 'cfo',
    icon: Calculator,
    tags: ['overhead', 'allocation', 'rate'],
  },

  // ── Job Costing ──
  {
    id: 'jc-1',
    title: 'Job Cost Variance Analyzer',
    description: 'Identify and explain variances between estimated and actual job costs.',
    prompt: `Analyze the job cost variance for project [PROJECT NAME]. Original estimate: Materials $[EST MAT], Labor $[EST LABOR], Subcontractors $[EST SUBS], Equipment $[EST EQUIP], Other $[EST OTHER]. Actual costs to date: Materials $[ACT MAT], Labor $[ACT LABOR], Subcontractors $[ACT SUBS], Equipment $[ACT EQUIP], Other $[ACT OTHER]. Project is [PERCENT]% complete. Identify which cost codes are over/under budget, calculate the estimated cost at completion for each category, project the final gross margin, and recommend corrective actions for any overruns.`,
    category: 'job-costing',
    icon: ClipboardList,
    tags: ['variance', 'budget', 'cost codes'],
  },
  {
    id: 'jc-2',
    title: 'Change Order Tracker & Profitability',
    description: 'Track change orders and their impact on job profitability.',
    prompt: `Help me organize and analyze change orders for project [PROJECT NAME]. Original contract: $[ORIGINAL]. List of change orders: [DESCRIBE EACH CO — number, description, amount, status (pending/approved/denied)]. For each approved CO, break down the estimated cost vs. the CO amount to show the profit impact. Calculate the new revised contract total, total approved COs as a percentage of original contract, and the cumulative impact on job margin. Flag any pending COs that need follow-up.`,
    category: 'job-costing',
    icon: FileText,
    tags: ['change orders', 'profitability', 'tracking'],
  },
  {
    id: 'jc-3',
    title: 'Labor Burden Calculator',
    description: 'Calculate fully burdened labor rates including all employer costs.',
    prompt: `Calculate the fully burdened labor rate for my construction employees. Base hourly wage: $[WAGE]. I need to factor in: FICA (7.65%), FUTA, SUTA rate of [SUTA %], workers' comp rate of $[WC RATE] per $100, general liability insurance allocation, health insurance at $[HEALTH] per employee/month, 401k match of [401K %], PTO/holiday pay for [PTO DAYS] days, and any other benefits. Calculate the total burden as a percentage and the fully loaded hourly rate. I'm in [STATE].`,
    category: 'job-costing',
    icon: Users,
    tags: ['labor', 'burden', 'hourly rate'],
  },

  // ── Cash Flow ──
  {
    id: 'cf-1',
    title: '13-Week Cash Flow Forecast',
    description: 'Build a rolling 13-week cash flow projection for your business.',
    prompt: `Build a 13-week rolling cash flow forecast for my construction company. Current cash balance: $[CASH]. Expected weekly collections from AR: $[WEEKLY AR]. Weekly payroll: $[PAYROLL]. Monthly overhead paid weekly: $[OVERHEAD/4]. Expected sub payments by week: [LIST MAJOR SUB PAYMENTS]. Material purchases expected: [LIST MAJOR MATERIAL BUYS]. Upcoming draw/progress billing dates and amounts: [LIST DRAWS]. Line of credit available: $[LOC]. Format as a week-by-week table showing beginning balance, inflows, outflows, net change, and ending balance. Flag any weeks where cash goes negative.`,
    category: 'cash-flow',
    icon: DollarSign,
    tags: ['forecast', '13-week', 'projection'],
  },
  {
    id: 'cf-2',
    title: 'Draw Schedule Optimizer',
    description: 'Optimize your progress billing schedule to maximize cash flow.',
    prompt: `Help me optimize my draw/progress billing schedule. I have [NUMBER] active projects. For each project, here's the current billing cadence and terms: [LIST PROJECTS WITH BILLING FREQUENCY AND PAYMENT TERMS]. My major cash outflows are: payroll every [FREQUENCY], sub payments on [TERMS], and materials on [TERMS]. Analyze the timing gaps between when I pay costs and when I collect draws. Recommend a billing strategy that minimizes the cash conversion cycle and reduces the need for line of credit draws.`,
    category: 'cash-flow',
    icon: TrendingUp,
    tags: ['billing', 'draws', 'timing'],
  },

  // ── Tax & Compliance ──
  {
    id: 'tax-1',
    title: '1099 Season Prep Checklist',
    description: 'Prepare for 1099-NEC filing for all subcontractors and vendors.',
    prompt: `Create a complete 1099-NEC preparation checklist for my construction company. I paid [NUMBER] subcontractors this year. Walk me through: verifying W-9s are on file for all subs paid over $600, running a payment report by vendor for the calendar year, identifying payments that need 1099 reporting vs. those exempt (corporations, credit card payments), reconciling 1099 totals to the general ledger, and the filing deadlines and penalties for late filing. Also flag common construction-specific issues like joint check payments and backcharges.`,
    category: 'tax',
    icon: FileText,
    tags: ['1099', 'compliance', 'subcontractors'],
  },
  {
    id: 'tax-2',
    title: 'Construction Tax Deduction Finder',
    description: 'Identify commonly missed tax deductions for construction businesses.',
    prompt: `Review my construction company's expenses and identify potentially missed tax deductions. My company is a [ENTITY TYPE] doing [REVENUE] in revenue. Trade: [TRADE TYPE]. Number of employees: [EMPLOYEES]. Vehicles: [NUMBER]. Equipment owned: [LIST MAJOR EQUIPMENT]. I want you to go through every major construction-specific deduction category: Section 179 and bonus depreciation on equipment, vehicle deductions (actual vs. mileage), home office, cell phones, tool allowances, safety equipment, training and certifications, per diem for travel jobs, R&D tax credit for new construction methods, and de minimis safe harbor elections.`,
    category: 'tax',
    icon: DollarSign,
    tags: ['deductions', 'tax savings', 'Section 179'],
  },

  // ── PM Software ──
  {
    id: 'pm-1',
    title: 'Buildertrend to QuickBooks Mapping',
    description: 'Map Buildertrend cost codes to QuickBooks chart of accounts.',
    prompt: `Create a mapping document between Buildertrend cost codes and QuickBooks Online chart of accounts for a [TRADE TYPE] construction company. My Buildertrend cost codes are organized by: [LIST YOUR BT COST CODE STRUCTURE]. My QuickBooks COGS accounts include: [LIST YOUR QB COGS ACCOUNTS]. Create a complete mapping table showing which BT cost code maps to which QB account, flag any gaps where a BT code doesn't have a QB match, and recommend any new accounts or cost codes that should be created for clean reconciliation between the two systems.`,
    category: 'pm-software',
    icon: HardHat,
    tags: ['Buildertrend', 'QuickBooks', 'mapping'],
  },
  {
    id: 'pm-2',
    title: 'PM Software Selection Matrix',
    description: 'Compare construction PM software options based on your needs.',
    prompt: `Help me evaluate construction project management software for my company. Company details: [TRADE TYPE], [NUMBER] employees, [REVENUE] annual revenue, currently using [CURRENT SOFTWARE]. My must-have features: [LIST]. Nice-to-have features: [LIST]. Budget: $[BUDGET]/month. Compare Buildertrend, Procore, CoConstruct, Jobber, ServiceTitan, and JobNimbus across: price, ease of use, accounting integration (especially QuickBooks), mobile app quality, scheduling, estimating, client portal, change order management, and reporting. Score each 1-5 and give me a clear recommendation.`,
    category: 'pm-software',
    icon: HardHat,
    tags: ['software', 'comparison', 'evaluation'],
  },
  {
    id: 'pm-3',
    title: 'Daily Log Template Generator',
    description: 'Create standardized daily log templates for field documentation.',
    prompt: `Create a comprehensive daily construction log template for [PROJECT TYPE] projects. Include sections for: date, weather conditions (temp, wind, precipitation), crew on site (by company/trade with headcount and hours), equipment on site, work performed today (by area/phase), materials received and installed quantities, visitors and inspections, safety incidents or near-misses, delays and causes, photos required, subcontractor coordination notes, and any issues/RFIs needed. Format it to be mobile-friendly for field use.`,
    category: 'pm-software',
    icon: ClipboardList,
    tags: ['daily log', 'field', 'documentation'],
  },

  // ── Client Comms ──
  {
    id: 'cc-1',
    title: 'Progress Update Email',
    description: 'Draft a professional project progress update for your client.',
    prompt: `Draft a professional project progress update email to my client for project [PROJECT NAME]. Current status: [PERCENT]% complete. Work completed this period: [DESCRIBE WORK]. Work planned for next period: [DESCRIBE NEXT WORK]. Budget status: [ON TRACK / OVER / UNDER] — original contract $[ORIGINAL], approved COs $[COs], current revised contract $[REVISED], billed to date $[BILLED]. Schedule status: [ON TIME / BEHIND / AHEAD] — original completion [DATE], current projected completion [DATE]. Any issues or decisions needed from client: [LIST]. Keep the tone professional, transparent, and reassuring.`,
    category: 'client-comms',
    icon: Users,
    tags: ['email', 'progress', 'client update'],
  },
  {
    id: 'cc-2',
    title: 'Change Order Proposal Letter',
    description: 'Write a professional change order proposal with cost breakdown.',
    prompt: `Draft a change order proposal letter for project [PROJECT NAME]. Change description: [DESCRIBE THE CHANGE]. Reason for change: [CLIENT REQUESTED / UNFORESEEN CONDITION / DESIGN ERROR / CODE REQUIREMENT]. Cost breakdown: materials $[MAT], labor [HOURS] hours at $[RATE], subcontractor $[SUB], equipment $[EQUIP], markup [PERCENT]%. Schedule impact: [DAYS] additional days. Include professional language about how the original contract scope did not include this work, reference the applicable contract clause for changes, and request written approval before work begins.`,
    category: 'client-comms',
    icon: FileText,
    tags: ['change order', 'proposal', 'letter'],
  },
];

export default function ToolkitPage() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch('/api/stripe/subscription');
        const data = await res.json();
        if (data.success) {
          setSubscription(data.data);
        }
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, []);

  const handleCopy = (id: string, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPrompts = PROMPTS.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // ─── Plan gate: Basic plan sees upgrade CTA ───
  if (!loading && subscription && !subscription.includesAiToolkit) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#6366f1]/10 flex items-center justify-center mx-auto mb-6">
          <Lock size={32} className="text-[#6366f1]" />
        </div>
        <h1 className="text-2xl font-bold text-[#e8e8f0] mb-3">
          AI Toolkit — Pro & Enterprise
        </h1>
        <p className="text-[#8888a0] mb-8 max-w-md mx-auto">
          Unlock {PROMPTS.length} battle-tested prompts built for construction bookkeepers,
          CFOs, and project managers. Upgrade your plan to access the full library.
        </p>
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition"
        >
          Upgrade Plan
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#e8e8f0] flex items-center gap-2">
            <Sparkles size={24} className="text-[#6366f1]" />
            AI Toolkit
          </h1>
          <p className="text-sm text-[#8888a0] mt-1">
            {PROMPTS.length} productivity prompts for construction bookkeepers, CFOs & project managers
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888a0]" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] text-[#e8e8f0] placeholder-[#8888a0] text-sm focus:outline-none focus:border-[#6366f1] transition"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeCategory === cat.key
                ? 'bg-[#6366f1] text-white'
                : 'bg-[#12121a] border border-[#1e1e2e] text-[#8888a0] hover:text-[#e8e8f0] hover:border-[#3a3a4d]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-xs text-[#8888a0]">
        Showing {filteredPrompts.length} of {PROMPTS.length} prompts
      </p>

      {/* Prompt Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredPrompts.map((prompt) => {
          const Icon = prompt.icon;
          const isExpanded = expandedId === prompt.id;
          const isCopied = copiedId === prompt.id;

          return (
            <Card
              key={prompt.id}
              className="bg-[#12121a] border-[#1e1e2e] hover:border-[#3a3a4d] transition-all duration-200 overflow-hidden"
            >
              <div className="p-4">
                {/* Card Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[#6366f1]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#e8e8f0] leading-snug">
                      {prompt.title}
                    </h3>
                    <p className="text-xs text-[#8888a0] mt-0.5 line-clamp-2">
                      {prompt.description}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[#6366f1]/5 text-[#8888a0] border border-[#1e1e2e]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Expandable Prompt Preview */}
                {isExpanded && (
                  <div className="mb-3 p-3 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] max-h-48 overflow-y-auto">
                    <pre className="text-xs text-[#b0b0c8] whitespace-pre-wrap font-sans leading-relaxed">
                      {prompt.prompt}
                    </pre>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : prompt.id)}
                    className="flex-1 text-xs font-medium py-2 rounded-lg transition bg-[#0a0a0f] border border-[#1e1e2e] text-[#8888a0] hover:text-[#e8e8f0] hover:border-[#3a3a4d]"
                  >
                    {isExpanded ? 'Collapse' : 'View Prompt'}
                  </button>
                  <button
                    onClick={() => handleCopy(prompt.id, prompt.prompt)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition bg-[#6366f1] text-white hover:bg-[#5558d9]"
                  >
                    {isCopied ? (
                      <>
                        <Check size={14} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-16">
          <Search size={40} className="text-[#2a2a3d] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">No prompts found</h3>
          <p className="text-sm text-[#8888a0]">
            Try a different search term or category.
          </p>
        </div>
      )}

      {/* Footer Note */}
      <div className="text-center py-6 border-t border-[#1e1e2e]">
        <p className="text-xs text-[#8888a0]">
          Copy any prompt and paste it into the <Link href="/dashboard/advisor" className="text-[#6366f1] hover:underline">CFO Advisor</Link>, ChatGPT, or your favorite AI tool.
          <br />
          Replace the [BRACKETED] placeholders with your actual numbers.
        </p>
      </div>
    </div>
  );
}
