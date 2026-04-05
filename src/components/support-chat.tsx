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
  HelpCircle,
} from 'lucide-react';

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
    keywords: ['setup', 'start', 'begin', 'get started', 'onboard', 'first time', 'new'],
    answer: `Welcome to BuilderCFO! Here's how to get started:\n\n1. **Connect QuickBooks Online** — Go to Integrations in the sidebar and click "Connect QBO"\n2. **Sync your data** — Hit "Sync with QBO" in the top navigation bar\n3. **Explore your dashboard** — Overview shows your key financial metrics at a glance\n4. **Set up job costing** — Go to Job Costing to track project profitability\n5. **Review cash flow** — The Cash Flow page shows inflows, outflows, and net position\n\nNeed hands-on help? Book a setup call with Cory using the button below.`,
  },
  {
    keywords: ['quickbooks', 'qbo', 'integrate', 'integration', 'connect', 'sync', 'disconnect'],
    answer: `**QuickBooks Online Integration:**\n\n1. Navigate to **Integrations** in the sidebar\n2. Click **"Connect QuickBooks Online"**\n3. Sign in to QBO and authorize BuilderCFO\n4. Return to the dashboard and click **"Sync with QBO"** in the top bar\n\nYour data syncs on demand — just click "Sync with QBO" anytime to pull the latest. BuilderCFO reads your Chart of Accounts, invoices, bills, and transactions directly from QBO.\n\nIf you manage multiple companies, you can connect multiple QBO accounts and switch between them using the client selector in the top bar.`,
  },
  {
    keywords: ['job', 'costing', 'project', 'profitability', 'margin', 'job cost'],
    answer: `**Job Costing in BuilderCFO:**\n\nThe Job Costing page pulls your QBO class/customer data to show profitability per project:\n\n• **Revenue vs. Cost** — See gross margin per job\n• **Profitability %** — Identify your most and least profitable projects\n• **Filtering** — Use the location filter to view jobs by location\n\nTo get the most out of job costing, make sure your QBO transactions are assigned to the correct **Customer** or **Class** — that's how BuilderCFO maps them to jobs.\n\nTip: Consistent QBO coding = better BuilderCFO data.`,
  },
  {
    keywords: ['cash flow', 'cashflow', 'cash', 'flow', 'inflow', 'outflow', 'receivable', 'payable'],
    answer: `**Cash Flow Dashboard:**\n\nThe Cash Flow page shows your money movement over time:\n\n• **Inflows** (green bars) — Customer payments and deposits\n• **Outflows** (red bars) — Vendor payments and expenses\n• **Net Cash Flow** — The difference, shown as a line\n\nData is pulled directly from QBO and grouped by month. Use the date range selector to zoom in or out.\n\nIf numbers look off, try syncing with QBO using the "Sync" button in the top bar — this ensures you have the latest data.`,
  },
  {
    keywords: ['invoice', 'invoices', 'billing', 'ar', 'accounts receivable', 'outstanding', 'overdue'],
    answer: `**Invoices & Accounts Receivable:**\n\nThe Invoices page shows all open, paid, and overdue invoices from QBO:\n\n• **Outstanding** — Invoices not yet paid\n• **Overdue** — Past due invoices (highlighted in red)\n• **Paid** — Recently collected invoices\n\nInvoice data flows directly from QuickBooks Online. To update invoice status, make changes in QBO and then sync BuilderCFO.\n\nFor collections questions or help with AR workflows, reach out to Cory directly.`,
  },
  {
    keywords: ['report', 'reports', 'financial', 'p&l', 'profit', 'loss', 'income', 'balance sheet', 'statement'],
    answer: `**Financial Reports:**\n\nThe Reports page includes:\n\n• **Profit & Loss** — Revenue, COGS, gross profit, operating expenses, and net income\n• **Cash Flow Summary** — Period-over-period cash position\n• **Job Profitability** — Which projects made money\n\nAll reports pull live data from your QBO sync. You can filter by date range and location.\n\nNeed a custom report or want to export to Excel? Reach out to Cory — that's a common request we can help with.`,
  },
  {
    keywords: ['location', 'locations', 'multi-location', 'multiple', 'branch', 'division', 'office'],
    answer: `**Multi-Location Support:**\n\nBuilderCFO supports construction companies with multiple locations or divisions:\n\n• Use the **Location Filter** in the sidebar to view data for a specific location\n• Locations are mapped from QBO **Classes** or **Departments**\n• Switch between "All Locations" and a specific location anytime\n\nTo set up location tracking, make sure your QBO transactions are coded to the correct Class/Department. BuilderCFO will automatically pick them up on the next sync.\n\nFor a multi-entity setup (separate QBO files), connect each QBO account separately and use the client switcher in the top bar.`,
  },
  {
    keywords: ['cfo', 'advisor', 'ai', 'advice', 'recommend', 'suggest', 'insight', 'analysis'],
    answer: `**CFO Advisor (AI-Powered):**\n\nThe CFO Advisor page uses AI to analyze your financial data and provide:\n\n• **Key insights** — What's trending up or down\n• **Recommendations** — Action items based on your financials\n• **Q&A** — Ask specific questions about your business finances\n\nThe advisor is powered by Anthropic's Claude and reads your synced QBO data. The more data you have synced, the better the insights.\n\nFor strategic CFO-level questions or planning sessions, book time with Cory using the calendar link below.`,
  },
  {
    keywords: ['settings', 'setting', 'account', 'profile', 'password', 'email', 'change', 'update'],
    answer: `**Account Settings:**\n\nGo to **Settings** in the sidebar to:\n\n• Update your profile name and company info\n• Change your notification preferences\n• Manage connected integrations\n• Update your password\n\nFor billing or subscription changes, reach out to Cory directly at cory@salisburybookkeeping.com.`,
  },
  {
    keywords: ['price', 'pricing', 'cost', 'plan', 'subscription', 'pay', 'billing', 'trial', 'fee'],
    answer: `**Pricing & Subscriptions:**\n\nBuilderCFO is offered as part of Salisbury Bookkeeping's fractional CFO and bookkeeping services for construction companies.\n\nFor pricing details, custom packages, or to discuss what plan fits your business, reach out directly:\n\n• **Email:** cory@salisburybookkeeping.com\n• **Book a call:** Use the calendar link below\n\nCory will walk you through options based on your company size and needs.`,
  },
  {
    keywords: ['help', 'support', 'problem', 'issue', 'error', 'broken', 'not working', 'bug', 'wrong'],
    answer: `**Getting Support:**\n\nIf something isn't working right, here are the fastest ways to get help:\n\n1. **Sync first** — Many data issues resolve after a fresh QBO sync\n2. **Check QBO coding** — Missing data often means transactions aren't coded to a customer/class in QBO\n3. **Email Cory** — cory@salisburybookkeeping.com for anything urgent\n4. **Book a call** — Use the calendar below to schedule troubleshooting time\n\nWhen reaching out, it helps to include: what page you're on, what you expected to see, and what you're seeing instead.`,
  },
  {
    keywords: ['contact', 'reach', 'talk', 'speak', 'human', 'person', 'cory', 'salisbury'],
    answer: `**Contacting the Team:**\n\nBuilderCFO is built and supported by **Cory at Salisbury Bookkeeping** — a fractional CFO firm specializing in construction companies.\n\n• **Email:** cory@salisburybookkeeping.com\n• **Schedule a call:** Use the calendar button below\n\nTypical response time is within one business day. For urgent issues, email is the fastest path.`,
  },
];

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Hi! I'm the BuilderCFO support assistant. I can help you with:\n\n• Getting set up and connecting QBO\n• Understanding dashboard features\n• Job costing, cash flow, and reports\n• Multi-location setup\n• Anything else about BuilderCFO\n\nWhat can I help you with today?`,
  timestamp: new Date(),
};

const QUICK_QUESTIONS = [
  'How do I connect QuickBooks?',
  'How does job costing work?',
  'How do I set up multiple locations?',
  'What reports are available?',
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

  return `I'm not sure I have a specific answer for that, but I'm happy to help!\n\nFor detailed questions, the fastest path is to reach out directly:\n\n• **Email Cory:** cory@salisburybookkeeping.com\n• **Book a call:** Use the calendar button below\n\nOr try rephrasing your question — I know about setup, QBO integration, job costing, cash flow, reports, and more.`;
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  const formatContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/•\s/g, '• ');
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {i < lines.length - 1 && <br />}
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
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, scrollToBottom]);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, isTyping, open, scrollToBottom]);

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

      // Simulate realistic typing delay (600–1400ms)
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

  const handleQuickQuestion = (q: string) => {
    sendMessage(q);
  };

  return (
    <>
      {/* Chat Panel */}
      <div
        className={`fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] transition-all duration-300 origin-bottom-right ${
          open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ maxHeight: 'calc(100vh - 120px)' }}
      >
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          style={{ height: '520px' }}
        >
          {/* Header */}
          <div className="bg-[#6366f1] px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm">BuilderCFO Support</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-[#22c55e] rounded-full" />
                  <span className="text-white/80 text-xs">Online · Usually replies instantly</span>
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

          {/* Quick Actions */}
          <div className="border-b border-[#2a2a3d] px-3 py-2.5 flex gap-2 flex-shrink-0">
            <a
              href="mailto:cory@salisburybookkeeping.com"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1a1a26] hover:bg-[#22222e] border border-[#2a2a3d] hover:border-[#6366f1] rounded-lg text-xs font-medium text-[#e8e8f0] transition-all duration-150"
            >
              <Mail size={13} className="text-[#6366f1]" />
              Email Cory
            </a>
            <a
              href="https://calendly.com/salisburybookkeeping"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1a1a26] hover:bg-[#22222e] border border-[#2a2a3d] hover:border-[#6366f1] rounded-lg text-xs font-medium text-[#e8e8f0] transition-all duration-150"
            >
              <Calendar size={13} className="text-[#6366f1]" />
              Book a Call
            </a>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (shown after welcome only) */}
          {messages.length === 1 && !isTyping && (
            <div className="px-3 pb-2 flex flex-wrap gap-2 flex-shrink-0">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
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
        </div>
      </div>

      {/* Floating Bubble Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#6366f1] hover:bg-[#818cf8] rounded-full shadow-lg shadow-[#6366f1]/30 hover:shadow-[#6366f1]/50 transition-all duration-200 hover:scale-105 active:scale-95 group"
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
