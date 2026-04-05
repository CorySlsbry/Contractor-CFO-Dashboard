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
} from 'lucide-react';
import { BookingCalendar } from '@/components/booking-calendar';

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

const KNOWLEDGE_BASE: KBEntry[] = [
  {
    keywords: ['setup', 'start', 'begin', 'get started', 'onboard', 'first time', 'new', 'how do i use'],
    answer: `Welcome to BuilderCFO! Here's how to get started:\n\n1. **Connect QuickBooks Online** — Go to Integrations in the sidebar and click "Connect QBO"\n2. **Sync your data** — Hit "Sync with QBO" in the top navigation bar\n3. **Explore your dashboard** — Overview shows your key financial metrics at a glance\n4. **Set up job costing** — Go to Job Costing to track project profitability\n5. **Review cash flow** — The Cash Flow page shows inflows, outflows, and net position\n\nNeed a walkthrough? Book a setup call using the button above.`,
  },
  {
    keywords: ['quickbooks', 'qbo', 'integrate', 'integration', 'connect', 'sync', 'disconnect', 'authorize'],
    answer: `**QuickBooks Online Integration:**\n\n1. Navigate to **Integrations** in the sidebar\n2. Click **"Connect QuickBooks Online"**\n3. Sign in to QBO and authorize BuilderCFO\n4. Return to the dashboard and click **"Sync with QBO"** in the top bar\n\nYour data syncs on demand — just click "Sync with QBO" anytime to pull the latest. BuilderCFO reads your Chart of Accounts, invoices, bills, and transactions directly from QBO.\n\nIf you manage multiple companies, you can connect multiple QBO accounts and switch between them using the client selector in the top bar.`,
  },
  {
    keywords: ['buildertrend', 'builder trend', 'procore', 'corecon', 'sage', 'foundation', 'viewpoint', 'construction software', 'third party', '3rd party'],
    answer: `**Third-Party Construction Software:**\n\nBuilderCFO is purpose-built around **QuickBooks Online** as the financial data source. It does not currently integrate directly with Buildertrend, Procore, or other project management platforms.\n\nHere's how most clients handle this:\n\n• Use **Buildertrend/Procore** for project management, scheduling, and field operations\n• Use **QBO** as the accounting system of record (many connect Buildertrend → QBO)\n• Use **BuilderCFO** to get CFO-level financial insights from that QBO data\n\nIf you're syncing Buildertrend to QBO, BuilderCFO will automatically pick up that data on your next sync. Questions about setting that up? Book a call and we can walk through your workflow.`,
  },
  {
    keywords: ['job', 'costing', 'project', 'profitability', 'margin', 'job cost', 'wip', 'work in progress'],
    answer: `**Job Costing in BuilderCFO:**\n\nThe Job Costing page pulls your QBO class/customer data to show profitability per project:\n\n• **Revenue vs. Cost** — See gross margin per job\n• **Profitability %** — Identify your most and least profitable projects\n• **Visual breakdown** — Bar charts ranked by margin\n• **Location filter** — View jobs by location or division\n\nTo get the most out of job costing, make sure your QBO transactions are assigned to the correct **Customer** or **Class** — that's how BuilderCFO maps them to jobs.\n\nTip: Consistent QBO coding = better BuilderCFO data.`,
  },
  {
    keywords: ['cash flow', 'cashflow', 'cash', 'flow', 'inflow', 'outflow', 'receivable', 'payable', 'burn', 'runway'],
    answer: `**Cash Flow Dashboard:**\n\nThe Cash Flow page shows your money movement over time:\n\n• **Inflows** (green) — Customer payments and deposits\n• **Outflows** (red) — Vendor payments and expenses\n• **Net Cash Flow** — The difference between the two\n• **Period comparison** — View by month, quarter, or custom range\n\nData is pulled directly from QBO and grouped by month. If numbers look off, hit "Sync with QBO" in the top bar to pull the latest data.`,
  },
  {
    keywords: ['invoice', 'invoices', 'billing', 'ar', 'accounts receivable', 'outstanding', 'overdue', 'collect', 'past due'],
    answer: `**Invoices & Accounts Receivable:**\n\nThe Invoices page shows all open, paid, and overdue invoices from QBO:\n\n• **Outstanding** — Invoices awaiting payment\n• **Overdue** — Past due invoices (highlighted)\n• **Paid** — Recently collected invoices\n• **Aging summary** — See 30/60/90-day buckets\n\nInvoice data flows directly from QuickBooks Online. To update invoice status, make changes in QBO and then sync BuilderCFO.`,
  },
  {
    keywords: ['report', 'reports', 'financial', 'p&l', 'profit', 'loss', 'income', 'balance sheet', 'statement', 'export', 'print'],
    answer: `**Financial Reports:**\n\nThe Reports page includes:\n\n• **Profit & Loss** — Revenue, COGS, gross profit, operating expenses, and net income\n• **Cash Flow Summary** — Period-over-period cash position\n• **Job Profitability** — Which projects made (and lost) money\n• **Date range filters** — Pick any period to analyze\n\nAll reports pull live data from your QBO sync. Need a custom export or additional report format? Reach out and we can help build that out.`,
  },
  {
    keywords: ['location', 'locations', 'multi-location', 'multiple', 'branch', 'division', 'office', 'region', 'territory'],
    answer: `**Multi-Location Support:**\n\nBuilderCFO supports construction companies with multiple locations or divisions:\n\n• Use the **Location Filter** in the sidebar to view data for a specific location\n• Locations are mapped from QBO **Classes** or **Departments**\n• "All Locations" shows your full company view\n• Switch between locations anytime without reloading\n\nTo set up location tracking, make sure your QBO transactions are coded to the correct Class/Department — BuilderCFO picks them up automatically on sync.\n\nFor a multi-entity setup (separate QBO files), connect each QBO account separately and use the client switcher in the top bar.`,
  },
  {
    keywords: ['cfo', 'advisor', 'ai', 'advice', 'recommend', 'suggest', 'insight', 'analysis', 'assistant', 'intelligence'],
    answer: `**CFO Advisor (AI-Powered):**\n\nThe CFO Advisor page uses AI to analyze your financial data and provide:\n\n• **Key insights** — What's trending up or down in your financials\n• **Recommendations** — Actionable items based on your numbers\n• **Natural language Q&A** — Ask specific questions about your business\n• **Risk flags** — Potential issues worth your attention\n\nThe advisor is powered by Anthropic's Claude and reads your synced QBO data. The more complete your QBO data, the better the insights.\n\nFor strategic CFO-level planning beyond what the AI can offer, book a call and we can review your numbers together.`,
  },
  {
    keywords: ['overview', 'dashboard', 'home', 'summary', 'kpi', 'metric', 'widget', 'card'],
    answer: `**Overview Dashboard:**\n\nThe main Overview page gives you a real-time financial snapshot:\n\n• **Revenue** — Total income for the selected period\n• **Expenses** — Total outflows\n• **Net Profit** — Bottom line\n• **Cash Balance** — Current liquidity position\n• **Accounts Receivable** — What you're owed\n• **Accounts Payable** — What you owe\n• **Top Jobs** — Highest-value active projects\n• **Recent Invoices** — Latest billing activity\n\nAll figures update every time you sync with QBO.`,
  },
  {
    keywords: ['settings', 'setting', 'account', 'profile', 'password', 'change', 'update', 'notification', 'preference'],
    answer: `**Account Settings:**\n\nGo to **Settings** in the sidebar to:\n\n• Update your profile name and company info\n• Manage connected QBO integrations\n• Configure notification preferences\n• Update your password\n\nFor billing or subscription changes, use the Email Us button above to reach our team directly.`,
  },
  {
    keywords: ['price', 'pricing', 'cost', 'plan', 'subscription', 'pay', 'billing', 'trial', 'fee', 'how much'],
    answer: `**Pricing & Subscriptions:**\n\nBuilderCFO is offered as part of Salisbury Bookkeeping's fractional CFO and bookkeeping services for construction companies.\n\nFor pricing details, custom packages, or to discuss what plan fits your business:\n\n• **Email us** using the button above\n• **Book a discovery call** — We'll walk you through options based on your company size and needs`,
  },
  {
    keywords: ['sync', 'pull', 'refresh', 'update', 'data', 'stale', 'old', 'not updating', 'latest'],
    answer: `**Syncing Your Data:**\n\nBuildercFO syncs on demand — it doesn't automatically refresh in the background.\n\nTo pull the latest data from QBO:\n1. Click **"Sync with QBO"** in the top navigation bar\n2. Wait for the sync to complete (usually a few seconds)\n3. The page will reload with fresh data\n\nIf data still looks off after syncing, check that your QBO transactions are properly coded to customers/classes. That's the most common reason for missing data.`,
  },
  {
    keywords: ['help', 'support', 'problem', 'issue', 'error', 'broken', 'not working', 'bug', 'wrong', 'missing', 'incorrect'],
    answer: `**Getting Support:**\n\nIf something isn't working right:\n\n1. **Sync first** — Most data issues resolve after a fresh QBO sync\n2. **Check QBO coding** — Missing data usually means transactions aren't assigned to a customer/class in QBO\n3. **Email us** — Use the button above for anything urgent\n4. **Book a call** — We can troubleshoot together over screen share\n\nWhen reaching out, it helps to include: what page you're on, what you expected to see, and what you're actually seeing.`,
  },
  {
    keywords: ['contact', 'reach', 'talk', 'speak', 'human', 'person', 'cory', 'salisbury', 'team', 'who'],
    answer: `**Contacting the Team:**\n\nBuilderCFO is built and supported by **Salisbury Bookkeeping** — a fractional CFO firm specializing in construction companies.\n\nUse the **Email Us** button above to send a message, or **Book a Call** to schedule time directly on our calendar.\n\nTypical response time is within one business day.`,
  },
  {
    keywords: ['client', 'clients', 'switch', 'multiple company', 'companies', 'multi-company', 'entity'],
    answer: `**Managing Multiple Clients / Companies:**\n\nIf you're an accountant or bookkeeper managing multiple construction companies:\n\n• Use the **client selector** in the top navigation bar to switch between companies\n• Each company has its own QBO connection and data\n• Connect additional companies via **Integrations → Connect QBO**\n• Location filters apply within each company's data\n\nAll client data is kept separate and secure.`,
  },
];

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Hi! I'm the BuilderCFO support assistant. I can help you with:\n\n• Getting set up and connecting QBO\n• Understanding dashboard features\n• Job costing, cash flow, and reports\n• Multi-location and multi-client setup\n• Integrations and third-party software\n\nWhat can I help you with today?`,
  timestamp: new Date(),
};

const QUICK_QUESTIONS = [
  'How do I connect QuickBooks?',
  'How does job costing work?',
  'Does it work with Buildertrend?',
  'How do I set up multiple locations?',
];

function findAnswer(input: string): string {
  const normalized = input.toLowerCase();
  let bestMatch: KBEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    const score = entry.keywords.reduce((acc, kw) => {
      return acc + (normalized.includes(kw.toLowerCase()) ? 1 : 0);
    }, 0);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.answer;
  }

  return `I don't have a specific answer for that, but I'm happy to help!\n\nFor detailed questions, the fastest path is:\n\n• **Email us** using the button above\n• **Book a call** — we can walk through anything over screen share\n\nOr try rephrasing — I know about setup, QBO integration, job costing, cash flow, reports, Buildertrend compatibility, and more.`;
}

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

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
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
      if (!showCalendar) setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, showCalendar, scrollToBottom]);

  useEffect(() => {
    if (open && !showCalendar) scrollToBottom();
  }, [messages, isTyping, open, showCalendar, scrollToBottom]);

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
          style={{ height: showCalendar ? 'auto' : '540px', maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Header */}
          <div className="bg-[#6366f1] px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              {showCalendar && (
                <button
                  onClick={() => setShowCalendar(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white mr-1"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                {showCalendar ? <Calendar size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
              </div>
              <div>
                <div className="font-semibold text-white text-sm">
                  {showCalendar ? 'Book a Call' : 'BuilderCFO Support'}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-[#22c55e] rounded-full" />
                  <span className="text-white/80 text-xs">
                    {showCalendar ? '30-minute scope call · Mountain Time' : 'Online · Usually replies instantly'}
                  </span>
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

          {showCalendar ? (
            /* ── Calendar View ── */
            <div className="flex-1 overflow-y-auto p-4">
              <BookingCalendar />
            </div>
          ) : (
            <>
              {/* Quick Actions */}
              <div className="border-b border-[#2a2a3d] px-3 py-2.5 flex gap-2 flex-shrink-0">
                <a
                  href="mailto:cory@salisburybookkeeping.com"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1a1a26] hover:bg-[#22222e] border border-[#2a2a3d] hover:border-[#6366f1] rounded-lg text-xs font-medium text-[#e8e8f0] transition-all duration-150"
                >
                  <Mail size={13} className="text-[#6366f1]" />
                  Email Us
                </a>
                <button
                  onClick={() => setShowCalendar(true)}
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
