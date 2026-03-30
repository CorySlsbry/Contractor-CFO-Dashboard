'use client';

import Link from 'next/link';
import { ChevronRight, Zap, Eye, TrendingUp, Brain, Check, ArrowRight, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LandingTracker } from '@/components/landing-tracker';

type DemoTab = 'overview' | 'ar' | 'ap' | 'wip' | 'retainage' | 'sales';

export default function LandingPage() {
  const [demoTab, setDemoTab] = useState<DemoTab>('overview');
  const [advisorMessages, setAdvisorMessages] = useState<{role: 'user' | 'ai'; text: string}[]>([
    { role: 'user', text: 'My gross margin on the Henderson job dropped from 22% to 14%. What happened?' },
    { role: 'ai', text: 'Looking at the Henderson job cost detail — your framing labor came in at $47,200 vs. the $31,500 budget (GL 3800). That\'s a 50% overage. Two factors: you had 3 change orders that added scope but weren\'t re-estimated, and the framing crew logged 340 hours vs. 220 budgeted. Recommendation: Submit a change order for the added scope ($15,700) and review crew allocation before the drywall phase starts next week.' },
  ]);
  const [advisorInput, setAdvisorInput] = useState('');
  const [rotatingPain, setRotatingPain] = useState(0);
  // GHL inline form handles lead capture natively

  const painPoints = [
    "Are we making money on the Henderson job?",
    "Can I afford to hire another PM?",
    "Why is cash tight when we're billing $200K/month?",
    "Am I over-billed on any jobs right now?",
    "How much retainage is stuck out there?",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingPain((prev) => (prev + 1) % painPoints.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAdvisorDemo = () => {
    if (!advisorInput.trim()) return;
    const userMsg = advisorInput.trim();
    setAdvisorInput('');
    setAdvisorMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setTimeout(() => {
      setAdvisorMessages(prev => [...prev, {
        role: 'ai',
        text: 'Based on your QuickBooks data and job cost reports, I can see the issue. Let me pull the specific GL accounts and give you a breakdown with actionable next steps...'
      }]);
    }, 1200);
  };

  return (
    <div className="bg-[#0a0a0f] text-[#e8e8f0] overflow-x-hidden">
      <LandingTracker />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0a0a0f]/80 backdrop-blur border-b border-[#1e1e2e] z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-3">
            <div className="font-bold text-lg tracking-tight">
              <span className="text-[#6366f1]">Builder</span><span className="text-[#e8e8f0]">CFO</span>
            </div>
            <span className="text-[10px] text-[#8888a0] hidden sm:inline">by <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#6366f1] hover:text-[#818cf8] transition">Salisbury Bookkeeping</a></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#8888a0]">
            <a href="#live-demo" className="hover:text-[#e8e8f0] transition">Demo</a>
            <a href="#cfo-advisor" className="hover:text-[#e8e8f0] transition">CFO Advisor</a>
            <a href="#pricing" className="hover:text-[#e8e8f0] transition">Pricing</a>
            <a href="#faq" className="hover:text-[#e8e8f0] transition">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[#e8e8f0] hover:text-[#6366f1] transition">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded bg-[#6366f1] text-white hover:bg-[#5558d9] transition">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 1 — HERO with dashboard preview + cost math       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="pt-20 pb-6 sm:pt-28 sm:pb-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6366f1]/5 via-transparent to-transparent pointer-events-none" />

        <div className="w-full max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left — copy */}
            <div>
              <p className="text-sm text-[#8888a0] mb-3">
                For contractors who are tired of asking{' '}
                <span className="text-[#ef4444] font-medium">&quot;where did all the money go?&quot;</span>
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#e8e8f0] mb-4 leading-tight">
                See Every Dollar.<br />
                <span className="bg-gradient-to-r from-[#6366f1] to-[#a78bfa] bg-clip-text text-transparent">
                  On Every Job.
                </span><br />
                Right Now.
              </h1>

              <p className="text-base sm:text-lg text-[#b0b0c8] mb-4 leading-relaxed">
                BuilderCFO plugs into your QuickBooks and shows you what&apos;s really going on with your money. No more guessing. No more surprises at job close.
              </p>

              {/* Rotating pain point */}
              <div className="h-8 flex items-center mb-5">
                <p className="text-[#6366f1] font-medium text-sm sm:text-base animate-pulse">
                  &quot;{painPoints[rotatingPain]}&quot;
                </p>
              </div>

              {/* Cost math box */}
              <div className="bg-[#12121a] border border-[#2a2a3d] rounded-lg p-4 mb-6">
                <div className="space-y-1.5 mb-3">
                  <p className="text-sm text-[#8888a0] line-through">Fractional controller: $3,000–$8,000/mo</p>
                  <p className="text-sm text-[#8888a0] line-through">One missed over-billing: $50,000+ at job close</p>
                </div>
                <p className="text-lg font-bold text-[#6366f1]">
                  BuilderCFO: $299/mo. <span className="text-[#22c55e]">With an AI CFO included.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/signup"
                  className="px-6 py-3 rounded-lg font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition inline-flex items-center justify-center gap-2 text-base shadow-lg shadow-[#6366f1]/20"
                >
                  Try It Free for 14 Days <ChevronRight size={18} />
                </Link>
                <a
                  href="#live-demo"
                  className="px-6 py-3 rounded-lg font-semibold text-[#6366f1] border border-[#6366f1]/40 hover:bg-[#6366f1]/10 transition inline-flex items-center justify-center text-base"
                >
                  See It In Action
                </a>
              </div>
              <p className="text-xs text-[#22c55e] mt-3 font-medium">
                No charge for 14 days. Cancel anytime. Seriously.
              </p>
            </div>

            {/* Right — dashboard preview */}
            <div className="hidden lg:block">
              <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4 shadow-2xl">
                {/* Mini KPIs */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: 'Revenue (YTD)', value: '$2.85M', change: '+12.3%', up: true, icon: TrendingUp },
                    { label: 'Net Cash', value: '$744.3K', change: '+26.1%', up: true, icon: Zap },
                    { label: 'WIP Over-Billing', value: '$82.4K', change: '-12.5%', up: true, icon: Eye },
                    { label: 'AR Outstanding', value: '$487.2K', change: '+3.1%', up: false, icon: TrendingUp },
                  ].map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                      <div key={kpi.label} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-3 hover:border-[#6366f1]/40 transition">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] text-[#8888a0] uppercase tracking-wide">{kpi.label}</span>
                          <Icon size={12} className="text-[#6366f1] opacity-50" />
                        </div>
                        <div className="text-xl font-bold text-[#e8e8f0]">{kpi.value}</div>
                        <div className={`text-[10px] font-semibold ${kpi.up ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{kpi.change}</div>
                      </div>
                    );
                  })}
                </div>
                {/* AI Brief */}
                <div className="bg-[#0a0a0f] border border-[#6366f1]/30 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Brain size={12} className="text-[#a5b4fc]" />
                    <span className="text-[9px] font-semibold text-[#a5b4fc] uppercase tracking-wider">AI CFO Advisor</span>
                  </div>
                  <p className="text-[11px] text-[#c8c8d8] leading-relaxed">
                    <span className="text-[#22c55e] font-medium">Win:</span> Net cash up 26.1%.{' '}
                    <span className="text-[#eab308] font-medium">Watch:</span> $82.4K WIP over-billing — cash risk at job close.
                  </p>
                </div>
                {/* WIP bars */}
                <div className="space-y-1.5">
                  {[
                    { name: 'Riverside Estate', pct: 82, status: 'Over-Billed: $69K', color: '#eab308' },
                    { name: 'Heritage Park', pct: 77, status: 'Over-Billed: $141.5K', color: '#eab308' },
                    { name: 'Mountain View', pct: 100, status: 'Under-Billed: $39.5K', color: '#6366f1' },
                  ].map((job) => (
                    <div key={job.name} className="flex items-center gap-2">
                      <span className="text-[10px] text-[#e8e8f0] w-24 truncate">{job.name}</span>
                      <div className="flex-1 h-1.5 bg-[#2a2a3d] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${job.pct >= 100 ? 'bg-[#ef4444]' : 'bg-[#6366f1]'}`} style={{ width: `${Math.min(job.pct, 100)}%` }} />
                      </div>
                      <span className="text-[9px] font-semibold w-28 text-right" style={{ color: job.color }}>{job.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 2 — SCROLL TRIGGER (single proof number)          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#6366f1]/10 via-[#6366f1]/5 to-[#6366f1]/10">
        <div className="w-full max-w-3xl mx-auto text-center">
          <p className="text-5xl sm:text-6xl font-bold text-[#6366f1] mb-3">$140K</p>
          <p className="text-base sm:text-lg text-[#e8e8f0] mb-2">
            caught in over-billing across two jobs. Before job close. In the first week.
          </p>
          <p className="text-sm text-[#8888a0]">
            — Sarah M., CFO, Denver CO
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* LEAD MAGNET — Email capture (before 25% scroll)           */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-[#12121a] border border-[#6366f1]/30 rounded-xl p-5 sm:p-8 text-center shadow-lg shadow-[#6366f1]/5">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Download size={18} className="text-[#6366f1]" />
              <span className="text-xs font-semibold text-[#a5b4fc] uppercase tracking-wider">Free Download</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#e8e8f0] mb-2">
              12 AI Prompts That Save Contractors Real Money
            </h2>
            <p className="text-sm text-[#8888a0] mb-5 max-w-md mx-auto">
              Copy-paste prompts for job costing, WIP, cash flow, retainage, bonding & more. Works with ChatGPT, Claude, or BuilderCFO.
            </p>
            {/* GHL Inline Form */}
            <div className="max-w-lg mx-auto">
              <iframe
                src="https://api.leadconnectorhq.com/widget/form/EW1NZq3b7bQ6esVKfgyE"
                style={{ width: '100%', height: '388px', border: 'none', borderRadius: '3px' }}
                id="inline-EW1NZq3b7bQ6esVKfgyE"
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="BuilderCFO"
                data-height="388"
                data-layout-iframe-id="inline-EW1NZq3b7bQ6esVKfgyE"
                data-form-id="EW1NZq3b7bQ6esVKfgyE"
                title="BuilderCFO"
              />
            </div>
            <p className="text-[10px] text-[#555] mt-3">No spam. Just the PDF. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 3 — COMPRESSED PAIN STRIP                         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { pain: "You check your bank balance to see if you're okay", emoji: "😬", detail: "That's not financial management. That's financial anxiety." },
              { pain: "You don't know if a job made money until it's over", emoji: "🤷", detail: "By then it's too late. The money already left." },
              { pain: "You've been over-billed on a job and didn't catch it", emoji: "💣", detail: "That's a cash bomb. It explodes at job close." },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <p className="text-sm text-[#e8e8f0] font-medium mb-0.5">{item.pain}</p>
                  <p className="text-xs text-[#8888a0]">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 4 — INTERACTIVE DASHBOARD DEMO (moved up)         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8" id="live-demo">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#e8e8f0] mb-2">
              This Is What Your Money Looks Like
            </h2>
            <p className="text-sm text-[#8888a0]">Click the tabs. This is real data from a $3M general contractor.</p>
            {/* Integrations micro-strip */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              {['QuickBooks', 'Procore', 'Buildertrend', 'ServiceTitan', 'Salesforce', 'HubSpot', 'JobNimbus'].map((t) => (
                <span key={t} className="text-[10px] text-[#8888a0] bg-[#12121a] border border-[#1e1e2e] rounded px-2 py-0.5">{t}</span>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#12121a] to-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-3 sm:p-6 shadow-2xl overflow-hidden scroll-mt-24">
            <div className="flex gap-1 mb-4 border-b border-[#2a2a3d] pb-2 overflow-x-auto">
              {([
                { key: 'overview', label: 'Overview' },
                { key: 'ar', label: 'AR by Job' },
                { key: 'ap', label: 'AP by Job' },
                { key: 'wip', label: 'WIP' },
                { key: 'retainage', label: 'Retainage' },
                { key: 'sales', label: 'Sales' },
              ] as { key: DemoTab; label: string }[]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setDemoTab(tab.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-t whitespace-nowrap transition-all cursor-pointer ${
                    demoTab === tab.key
                      ? 'bg-[#6366f1]/15 text-[#a5b4fc] border-b-2 border-[#6366f1]'
                      : 'text-[#8888a0] hover:text-[#e8e8f0]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW TAB ── */}
            {demoTab === 'overview' && (
              <>
                <div className="p-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3d] mb-3">
                  <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-semibold text-[#a5b4fc] uppercase tracking-wider">AI Brief</span></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#22c55e]">▲</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#22c55e]">Win:</span> Net cash up 26.1% — strong collections building a healthy runway</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> AR growing faster than revenue — collections lagging billings</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> $82.4K WIP over-billing exposes cash risk at job close</p></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-4">
                  {[
                    { label: 'Revenue (YTD)', value: '$2.85M', change: '+12.3%', up: true },
                    { label: 'AR Outstanding', value: '$487.2K', change: '+3.1%', up: false },
                    { label: 'AP Outstanding', value: '$312.8K', change: '-8.2%', up: true },
                    { label: 'Net Cash', value: '$744.3K', change: '+26.1%', up: true },
                    { label: 'WIP Over-Billing', value: '$82.4K', change: '-12.5%', up: true },
                    { label: 'Retainage Held', value: '$196.5K', change: '+4.3%', up: false },
                  ].map((kpi) => (
                    <div key={kpi.label} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-3">
                      <div className="text-[#8888a0] text-[10px] uppercase tracking-wide mb-1">{kpi.label}</div>
                      <div className="text-lg font-bold text-[#e8e8f0]">{kpi.value}</div>
                      <div className={`text-[10px] font-semibold ${kpi.up ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{kpi.change}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-4">
                    <div className="text-sm font-semibold text-[#e8e8f0] mb-3">AR Aging Summary</div>
                    <div className="space-y-2">
                      {[
                        { range: 'Current', amount: '$310K', pct: 64, color: '#22c55e' },
                        { range: '1-30 Days', amount: '$85K', pct: 17, color: '#eab308' },
                        { range: '31-60 Days', amount: '$63.5K', pct: 13, color: '#ef9d44' },
                        { range: '61-90 Days', amount: '$28.7K', pct: 6, color: '#ef4444' },
                      ].map((item) => (
                        <div key={item.range} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-[10px] text-[#8888a0] w-16">{item.range}</span>
                          <div className="flex-1 h-1.5 bg-[#2a2a3d] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ backgroundColor: item.color, width: `${item.pct}%` }} />
                          </div>
                          <span className="text-[10px] font-semibold text-[#e8e8f0] w-12 text-right">{item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-4">
                    <div className="text-sm font-semibold text-[#e8e8f0] mb-3">Cash Flow Forecast</div>
                    <div className="flex items-end gap-3 h-28">
                      {[
                        { week: 'W1', inflow: 72, outflow: 55 },
                        { week: 'W2', inflow: 68, outflow: 82 },
                        { week: 'W3', inflow: 65, outflow: 47 },
                        { week: 'W4', inflow: 90, outflow: 76 },
                      ].map((w) => {
                        const isPositive = w.inflow >= w.outflow;
                        return (
                          <div key={w.week} className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full relative h-24 flex items-end justify-center">
                              <div className="absolute bottom-0 left-1 right-1 rounded-t-md" style={{ height: `${Math.max(w.inflow, w.outflow)}%`, backgroundColor: isPositive ? '#14532d' : '#7f1d1d', border: `1.5px solid ${isPositive ? '#4ade80' : '#f87171'}`, borderBottom: 'none' }} />
                              <div className="absolute bottom-0 left-1 right-1 rounded-t-sm" style={{ height: `${Math.min(w.inflow, w.outflow)}%`, backgroundColor: isPositive ? '#7f1d1d' : '#14532d', border: `1.5px solid ${isPositive ? '#f87171' : '#4ade80'}`, borderBottom: 'none' }} />
                              <div className="absolute -top-3.5 left-0 right-0 text-center">
                                <span className="text-[8px] font-bold" style={{ color: isPositive ? '#4ade80' : '#f87171' }}>
                                  {isPositive ? '+' : '-'}{Math.abs(w.inflow - w.outflow)}%
                                </span>
                              </div>
                            </div>
                            <span className="text-[9px] text-[#b0b0c8]">{w.week}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-4 mt-3 justify-center">
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#14532d', border: '1.5px solid #4ade80' }} /><span className="text-[9px] text-[#b0b0c8]">Cash In</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#7f1d1d', border: '1.5px solid #f87171' }} /><span className="text-[9px] text-[#b0b0c8]">Cash Out</span></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-4">
                  <div className="text-sm font-semibold text-[#e8e8f0] mb-3">Active Jobs — WIP Status</div>
                  <div className="space-y-2">
                    {[
                      { name: 'Riverside Estate Custom Home', pct: 82, contract: '$950K', billing: 'Over-Billed', billingAmt: '$69K', billingColor: '#eab308' },
                      { name: 'Heritage Park Commercial', pct: 77, contract: '$1.45M', billing: 'Over-Billed', billingAmt: '$141.5K', billingColor: '#eab308' },
                      { name: 'Mountain View Remodel', pct: 100, contract: '$165K', billing: 'Under-Billed', billingAmt: '$39.5K', billingColor: '#6366f1' },
                      { name: 'Cedar Heights Addition', pct: 93, contract: '$210K', billing: 'Under-Billed', billingAmt: '$55.3K', billingColor: '#6366f1' },
                      { name: 'Oakwood Duplex', pct: 94, contract: '$380K', billing: 'Over-Billed', billingAmt: '$5.2K', billingColor: '#eab308' },
                    ].map((job) => (
                      <div key={job.name} className="flex items-center gap-3">
                        <span className="text-xs text-[#e8e8f0] w-24 sm:w-48 truncate">{job.name}</span>
                        <div className="flex-1 h-1.5 bg-[#2a2a3d] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${job.pct >= 100 ? 'bg-[#ef4444]' : 'bg-[#6366f1]'}`} style={{ width: `${Math.min(job.pct, 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-[#8888a0] w-10">{job.pct}%</span>
                        <span className="hidden sm:block text-[10px] text-[#8888a0] w-14 text-right">{job.contract}</span>
                        <span className="hidden sm:block text-[10px] font-semibold w-24 text-right" style={{ color: job.billingColor }}>
                          {job.billing}: {job.billingAmt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── AR BY JOB TAB ── */}
            {demoTab === 'ar' && (
              <div className="space-y-3">
                <div className="p-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3d]">
                  <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-semibold text-[#a5b4fc] uppercase tracking-wider">AI Brief</span></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#22c55e]">▲</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#22c55e]">Win:</span> 64% of AR is current — solid billing discipline</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> Oakwood Duplex 92 days past due — escalate before write-off</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> Heritage Park $45K at 62 days — contact before dispute</p></div>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3d] text-[10px] sm:text-xs">
                  <span className="text-[#c8c8d8]">Total AR: <span className="font-semibold text-[#e8e8f0]">$487,200</span> · Past Due: <span className="font-semibold text-[#ef4444]">$177,200 (36%)</span> · Current: <span className="font-semibold text-[#22c55e]">$310,000</span></span>
                </div>
                {[
                  { job: 'Oakwood Duplex', customer: 'Oakwood Investments', total: '$28,700', pastDue: '$28,700', items: [
                    { inv: 'INV-2024-133', amount: '$28,700', due: '2023-11-30', days: 92, status: 'Past Due' },
                  ]},
                  { job: 'Heritage Park Commercial', customer: 'Heritage Park LLC', total: '$170,000', pastDue: '$45,000', items: [
                    { inv: 'INV-2024-149', amount: '$45,000', due: '2024-12-15', days: 62, status: 'Past Due' },
                    { inv: 'INV-2024-155', amount: '$125,000', due: '2024-03-05', days: 0, status: 'Current' },
                  ]},
                ].map((group) => (
                  <div key={group.job} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-[#e8e8f0]">{group.job}</div>
                        <div className="text-[10px] text-[#8888a0]">{group.customer}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-[#e8e8f0]">{group.total}</div>
                        {group.pastDue !== '$0' && <div className="text-[10px] text-[#ef4444]">{group.pastDue} past due</div>}
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[10px] sm:text-xs">
                        <thead><tr className="border-b border-[#2a2a3d]">
                          <th className="text-left py-1 text-[#8888a0]">Invoice</th>
                          <th className="text-right py-1 text-[#8888a0]">Amount</th>
                          <th className="text-right py-1 text-[#8888a0]">Due</th>
                          <th className="text-right py-1 text-[#8888a0]">Days</th>
                          <th className="text-right py-1 text-[#8888a0]">Status</th>
                        </tr></thead>
                        <tbody>
                          {group.items.map((item) => (
                            <tr key={item.inv} className={`border-b border-[#2a2a3d]/30 ${item.days > 0 ? 'bg-[#ef4444]/5' : ''}`}>
                              <td className="py-1.5 font-mono">{item.inv}</td>
                              <td className={`py-1.5 text-right font-semibold ${item.days > 0 ? 'text-[#ef4444]' : 'text-[#e8e8f0]'}`}>{item.amount}</td>
                              <td className="py-1.5 text-right text-[#8888a0]">{item.due}</td>
                              <td className={`py-1.5 text-right font-semibold ${item.days > 0 ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>{item.days || '—'}</td>
                              <td className="py-1.5 text-right">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${item.status === 'Past Due' ? 'bg-[#ef4444]/15 text-[#ef4444]' : 'bg-[#22c55e]/15 text-[#22c55e]'}`}>{item.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── AP BY JOB TAB ── */}
            {demoTab === 'ap' && (
              <div className="space-y-3">
                <div className="p-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3d]">
                  <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-semibold text-[#a5b4fc] uppercase tracking-wider">AI Brief</span></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#22c55e]">▲</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#22c55e]">Win:</span> AP down 8.2% — paying vendors on time</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> Rocky Mtn Concrete $35K, 41 days late — lien risk</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> Valley HVAC $45.3K — verify held for punch list</p></div>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3d] text-[10px] sm:text-xs">
                  <span className="text-[#c8c8d8]">Total AP: <span className="font-semibold text-[#e8e8f0]">$296,600</span> · Past Due: <span className="font-semibold text-[#ef4444]">$129,000 (43%)</span> · Current: <span className="font-semibold text-[#22c55e]">$167,600</span></span>
                </div>
                {[
                  { job: 'Riverside Estate Custom Home', total: '$95,700', pastDue: '$53,200', items: [
                    { vendor: 'Rocky Mtn Concrete', bill: 'BILL-4477', amount: '$35,000', days: 41, status: 'Past Due' },
                    { vendor: 'Wasatch Electric Co', bill: 'BILL-4498', amount: '$18,200', days: 31, status: 'Past Due' },
                    { vendor: 'Summit Lumber Supply', bill: 'BILL-4521', amount: '$42,500', days: 0, status: 'Current' },
                  ]},
                ].map((group) => (
                  <div key={group.job} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-semibold text-[#e8e8f0]">{group.job}</div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-[#e8e8f0]">{group.total}</div>
                        <div className="text-[10px] text-[#ef4444]">{group.pastDue} past due</div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[10px] sm:text-xs">
                        <thead><tr className="border-b border-[#2a2a3d]">
                          <th className="text-left py-1 text-[#8888a0]">Vendor</th>
                          <th className="text-left py-1 text-[#8888a0]">Bill #</th>
                          <th className="text-right py-1 text-[#8888a0]">Amount</th>
                          <th className="text-right py-1 text-[#8888a0]">Days</th>
                          <th className="text-right py-1 text-[#8888a0]">Status</th>
                        </tr></thead>
                        <tbody>
                          {group.items.map((item) => (
                            <tr key={item.bill} className={`border-b border-[#2a2a3d]/30 ${item.days > 0 ? 'bg-[#ef4444]/5' : ''}`}>
                              <td className="py-1.5">{item.vendor}</td>
                              <td className="py-1.5 font-mono">{item.bill}</td>
                              <td className={`py-1.5 text-right font-semibold ${item.days > 0 ? 'text-[#ef4444]' : 'text-[#e8e8f0]'}`}>{item.amount}</td>
                              <td className={`py-1.5 text-right font-semibold ${item.days > 0 ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>{item.days || '—'}</td>
                              <td className="py-1.5 text-right">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${item.status === 'Past Due' ? 'bg-[#ef4444]/15 text-[#ef4444]' : 'bg-[#22c55e]/15 text-[#22c55e]'}`}>{item.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── WIP TAB ── */}
            {demoTab === 'wip' && (
              <div className="space-y-3">
                <div className="p-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3d]">
                  <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-semibold text-[#a5b4fc] uppercase tracking-wider">AI Summary</span></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <div className="flex items-start gap-1.5"><span className="text-[#22c55e] text-[10px]">▲</span><p className="text-[10px] text-[#c8c8d8]"><span className="font-medium text-[#22c55e]">Win:</span> Portfolio margin at 18.9% across 5 active jobs</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[#eab308] text-[10px]">▼</span><p className="text-[10px] text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> Cedar Heights is $55K under-billed — submit draw request</p></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Total Contract', value: '$3.16M', color: '' },
                    { label: 'Over-Billed', value: '$215.7K', color: 'text-[#eab308]' },
                    { label: 'Under-Billed', value: '$94.8K', color: 'text-[#6366f1]' },
                    { label: 'Net Position', value: 'Over: $120.9K', color: 'text-[#eab308]' },
                  ].map((m) => (
                    <div key={m.label} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-2.5">
                      <div className="text-[9px] text-[#8888a0] uppercase tracking-wide">{m.label}</div>
                      <div className={`text-sm sm:text-base font-bold mt-0.5 ${m.color || 'text-[#e8e8f0]'}`}>{m.value}</div>
                    </div>
                  ))}
                </div>
                {[
                  { name: 'Riverside Estate Custom Home', pct: 82, contract: '$950K', cost: '$623K', billed: '$710K', overUnder: 'Over-Billed: $69K', color: '#eab308', margin: '20.0%' },
                  { name: 'Mountain View Remodel', pct: 112, contract: '$165K', cost: '$148K', billed: '$125.5K', overUnder: 'Under-Billed: $39.5K', color: '#6366f1', margin: '-10.3%' },
                  { name: 'Heritage Park Commercial', pct: 77, contract: '$1.45M', cost: '$890K', billed: '$975K', overUnder: 'Over-Billed: $141.5K', color: '#eab308', margin: '20.0%' },
                ].map((job) => (
                  <div key={job.name} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-[#e8e8f0]">{job.name}</div>
                        <div className="text-[10px] text-[#8888a0]">Contract: {job.contract}</div>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${job.pct >= 100 ? 'bg-[#ef4444]/15 text-[#ef4444]' : 'bg-[#6366f1]/15 text-[#a5b4fc]'}`}>{job.pct}% Complete</span>
                    </div>
                    <div className="h-2 bg-[#2a2a3d] rounded-full overflow-hidden mb-2">
                      <div className={`h-full rounded-full ${job.pct > 100 ? 'bg-[#ef4444]' : 'bg-[#6366f1]'}`} style={{ width: `${Math.min(job.pct, 100)}%` }} />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px]">
                      <div className="bg-[#1a1a26] rounded p-1.5"><span className="text-[#8888a0]">Cost to Date</span><div className="font-semibold text-[#e8e8f0]">{job.cost}</div></div>
                      <div className="bg-[#1a1a26] rounded p-1.5"><span className="text-[#8888a0]">Billed</span><div className="font-semibold text-[#e8e8f0]">{job.billed}</div></div>
                      <div className="rounded p-1.5" style={{ backgroundColor: job.color + '15' }}><span className="text-[#8888a0]">Billing Status</span><div className="font-semibold" style={{ color: job.color }}>{job.overUnder}</div></div>
                      <div className="bg-[#1a1a26] rounded p-1.5"><span className="text-[#8888a0]">Margin</span><div className={`font-semibold ${job.margin.startsWith('-') ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>{job.margin}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── RETAINAGE TAB ── */}
            {demoTab === 'retainage' && (
              <div className="space-y-3">
                <div className="p-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3d]">
                  <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-semibold text-[#a5b4fc] uppercase tracking-wider">AI Brief</span></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#22c55e]">▲</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#22c55e]">Win:</span> Net retainage $171K in your favor</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> $68.1K overdue for release — file requests now</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> 2 release dates approaching — schedule walk-throughs</p></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Total Held', value: '$223,250', color: 'text-[#22c55e]' },
                    { label: 'Total Overdue', value: '$68,200', color: 'text-[#ef4444]' },
                    { label: 'Total Paid', value: '$116,400', color: 'text-[#6366f1]' },
                    { label: 'Net Position', value: '$171,550', color: 'text-[#6366f1]' },
                  ].map((m) => (
                    <div key={m.label} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-2.5">
                      <div className="text-[9px] text-[#8888a0] uppercase tracking-wide">{m.label}</div>
                      <div className={`text-sm sm:text-base font-bold mt-0.5 ${m.color}`}>{m.value}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-3 overflow-x-auto">
                  <div className="text-xs font-semibold text-[#e8e8f0] mb-2">Retainage by Job</div>
                  <table className="w-full text-[10px] sm:text-xs">
                    <thead><tr className="border-b border-[#2a2a3d]">
                      <th className="text-left py-1 text-[#8888a0]">Job</th>
                      <th className="text-right py-1 text-[#8888a0]">Recv</th>
                      <th className="text-right py-1 text-[#8888a0]">Pay</th>
                      <th className="text-right py-1 text-[#8888a0]">Net</th>
                      <th className="text-right py-1 text-[#8888a0]">Status</th>
                    </tr></thead>
                    <tbody>
                      {[
                        { job: 'Lakeside Office', recv: '$28.5K', pay: '$15.6K', net: '$12.9K', status: 'Overdue', sc: 'bg-[#ef4444]/15 text-[#ef4444]' },
                        { job: 'Westfield Center', recv: '$31.2K', pay: '$18.9K', net: '$12.3K', status: 'Overdue', sc: 'bg-[#ef4444]/15 text-[#ef4444]' },
                        { job: 'Riverside Estate', recv: '$71K', pay: '$38.2K', net: '$32.8K', status: 'Held', sc: 'bg-[#8888a0]/15 text-[#c8c8d8]' },
                        { job: 'Oakwood Duplex', recv: '$35.2K', pay: '$18.5K', net: '$16.7K', status: 'Ready', sc: 'bg-[#22c55e]/15 text-[#22c55e]' },
                      ].map((r) => (
                        <tr key={r.job} className={`border-b border-[#2a2a3d]/30 ${r.status === 'Overdue' ? 'bg-[#ef4444]/5' : ''}`}>
                          <td className="py-1.5 font-medium">{r.job}</td>
                          <td className="py-1.5 text-right text-[#22c55e] font-semibold">{r.recv}</td>
                          <td className="py-1.5 text-right text-[#ef9d44] font-semibold">{r.pay}</td>
                          <td className="py-1.5 text-right text-[#6366f1] font-semibold">{r.net}</td>
                          <td className="py-1.5 text-right"><span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${r.sc}`}>{r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── SALES TAB ── */}
            {demoTab === 'sales' && (
              <div className="space-y-3">
                <div className="p-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3d]">
                  <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-semibold text-[#a5b4fc] uppercase tracking-wider">AI Brief</span></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#22c55e]">▲</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#22c55e]">Win:</span> Team at 73% quota with $10.6M pipeline</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> Westfield $1.25M at 35% — needs strategy session</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> Pipeline top-heavy in proposals — move to negotiation</p></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Total Pipeline', value: '$10.6M', color: '' },
                    { label: 'Won (Quarter)', value: '$78K', color: 'text-[#22c55e]' },
                    { label: 'Avg Deal Size', value: '$272K', color: '' },
                    { label: 'Team Quota', value: '78%', color: 'text-[#eab308]' },
                  ].map((m) => (
                    <div key={m.label} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-2.5">
                      <div className="text-[9px] text-[#8888a0] uppercase tracking-wide">{m.label}</div>
                      <div className={`text-sm sm:text-base font-bold mt-0.5 ${m.color || 'text-[#e8e8f0]'}`}>{m.value}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-3">
                  <div className="text-xs font-semibold text-[#e8e8f0] mb-3">Pipeline Stages</div>
                  <div className="space-y-2">
                    {[
                      { stage: 'Leads', count: 24, value: '$4.2M', pct: 100 },
                      { stage: 'Proposals', count: 8, value: '$2.85M', pct: 68 },
                      { stage: 'Negotiation', count: 4, value: '$1.68M', pct: 40 },
                      { stage: 'Won', count: 3, value: '$1.25M', pct: 30 },
                    ].map((s) => (
                      <div key={s.stage} className="flex items-center gap-2">
                        <span className="text-[10px] text-[#8888a0] w-16 sm:w-20">{s.stage}</span>
                        <div className="flex-1 h-5 bg-[#2a2a3d] rounded-full overflow-hidden">
                          <div className="h-full bg-[#6366f1] rounded-full flex items-center justify-end pr-2" style={{ width: `${s.pct}%` }}>
                            <span className="text-[9px] font-bold text-white">{s.count}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-[#e8e8f0] w-12 text-right">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-[#2a2a3d] text-center">
              <p className="text-[10px] sm:text-xs text-[#8888a0]">
                This is sample data. <Link href="/signup" className="text-[#6366f1] hover:text-[#818cf8] font-medium transition">Start your free trial</Link> to see your real numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 5 — AI CFO ADVISOR                                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#12121a]/50" id="cfo-advisor">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/30 text-[#a5b4fc] text-xs font-semibold mb-4">
                <Brain size={14} /> ON EVERY PLAN — NO EXTRA CHARGE
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#e8e8f0] mb-3">
                Your AI CFO.<br />
                <span className="bg-gradient-to-r from-[#6366f1] to-[#a78bfa] bg-clip-text text-transparent">Never Sleeps. Never Bills You.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#b0b0c8] mb-5 leading-relaxed">
                Ask a question about your money in plain English. Get a real answer with real numbers. No waiting. No digging through QuickBooks. Just answers.
              </p>

              <div className="space-y-2.5">
                {[
                  { q: '"Why did my margin drop on the Henderson job?"', a: 'Points to the exact cost code and crew hours' },
                  { q: '"Can I afford to hire another PM next quarter?"', a: 'Runs the cash flow math using your real AR and backlog' },
                  { q: '"What should I bill this month?"', a: 'Tells you the draw amount per job to stay on schedule' },
                  { q: '"Am I over-billed on any jobs right now?"', a: 'Flags the risk before it blows up at job close' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-3 hover:border-[#6366f1]/40 transition">
                    <p className="text-sm font-medium text-[#e8e8f0] mb-0.5">{item.q}</p>
                    <p className="text-xs text-[#8888a0]">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Advisor Chat Demo */}
            <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#12121a] border-b border-[#2a2a3d]">
                <Brain size={16} className="text-[#6366f1]" />
                <span className="text-sm font-semibold text-[#e8e8f0]">CFO Advisor</span>
                <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-[#22c55e]/15 text-[#22c55e]">Live</span>
              </div>
              <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
                {advisorMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#6366f1] text-white'
                        : 'bg-[#1a1a26] border border-[#2a2a3d] text-[#c8c8d8]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-[#2a2a3d]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={advisorInput}
                    onChange={(e) => setAdvisorInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdvisorDemo()}
                    placeholder="Ask about your job costs, cash flow, WIP..."
                    className="flex-1 bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2 text-xs text-[#e8e8f0] placeholder-[#555] focus:outline-none focus:border-[#6366f1] transition"
                  />
                  <button
                    onClick={handleAdvisorDemo}
                    className="px-3 py-2 bg-[#6366f1] rounded-lg hover:bg-[#5558d9] transition"
                  >
                    <ArrowRight size={14} className="text-white" />
                  </button>
                </div>
                <p className="text-[9px] text-[#555] mt-2 text-center">Go ahead — type a question and see what happens</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 6 — REVIEWS (before pricing)                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e8e8f0] mb-8 text-center">
            Contractors Don&apos;t Lie. Neither Do These Reviews.
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                quote: '"We were bleeding money on two jobs and had no idea. This dashboard caught it in the first week."',
                author: 'Mike J.',
                title: 'GC Owner — Austin, TX',
              },
              {
                quote: '"The AI Advisor told me I was over-billed $140K across two jobs. Caught it before job close."',
                author: 'Sarah M.',
                title: 'CFO — Denver, CO',
              },
              {
                quote: '"We went from guessing on bids to knowing our margins on every job type. Game changer."',
                author: 'Tony R.',
                title: 'Framing Contractor — Salt Lake City, UT',
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-5">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-base">★</span>
                  ))}
                </div>
                <p className="text-[#b0b0c8] italic mb-3 text-sm">{testimonial.quote}</p>
                <div>
                  <p className="text-[#e8e8f0] font-semibold text-sm">{testimonial.author}</p>
                  <p className="text-[#8888a0] text-xs">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 7 — PRICING                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#12121a]/50" id="pricing">
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
            Pick a Plan. Try It Free.
          </h2>
          <p className="text-center text-[#b0b0c8] mb-1">
            14 days free on every plan. No charge until day 15.
          </p>
          <p className="text-center text-[#22c55e] mb-8 text-sm font-medium">
            No contracts. No setup fees. Cancel anytime.
          </p>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {/* Starter */}
            <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-5 sm:p-8 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-1">Starter</h3>
              <p className="text-sm text-[#b0b0c8] mb-5">Solo contractors and small crews</p>
              <div className="mb-5">
                <span className="text-4xl sm:text-5xl font-bold text-white">$299</span>
                <span className="text-[#b0b0c8] ml-2">/mo</span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {[
                  'Real-time financial dashboard',
                  'Job costing & WIP tracking',
                  'Cash flow forecasting (30/60/90 day)',
                  'QuickBooks Online sync',
                  { text: 'AI CFO Advisor — ask anything', highlight: true },
                  'Monthly AI financial brief',
                  'Email support',
                ].map((feature, idx) => {
                  const isHighlight = typeof feature === 'object';
                  const text = isHighlight ? feature.text : feature;
                  return (
                    <li key={idx} className="flex items-center gap-2.5">
                      <Check size={16} className={isHighlight ? 'text-[#22c55e] flex-shrink-0' : 'text-[#6366f1] flex-shrink-0'} />
                      <span className={`text-sm ${isHighlight ? 'text-[#e8e8f0] font-medium' : 'text-[#d0d0e0]'}`}>{text}</span>
                    </li>
                  );
                })}
              </ul>
              <Link href="/signup?plan=basic" className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-[#2a2a3d] hover:bg-[#3a3a4d] transition text-center block">
                Start Free Trial
              </Link>
            </div>

            {/* Professional */}
            <div className="bg-gradient-to-br from-[#6366f1]/10 to-transparent border-2 border-[#6366f1]/60 rounded-xl p-5 sm:p-8 relative flex flex-col shadow-lg shadow-[#6366f1]/10">
              <div className="absolute -top-3 left-6 bg-[#6366f1] text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Professional</h3>
              <p className="text-sm text-[#b0b0c8] mb-5">Growing companies ($1M–$10M)</p>
              <div className="mb-5">
                <span className="text-4xl sm:text-5xl font-bold text-white">$499</span>
                <span className="text-[#b0b0c8] ml-2">/mo</span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {[
                  'Everything in Starter',
                  'Buildertrend + HubSpot + JobNimbus',
                  'Sales pipeline dashboard',
                  { text: 'AI CFO Advisor — unlimited', highlight: true },
                  { text: 'AI Toolkit — 24 construction prompts', highlight: true },
                  { text: 'NAHB Chart of Accounts', highlight: true },
                  'AR/AP aging reports by job',
                  'Priority support',
                ].map((feature, idx) => {
                  const isHighlight = typeof feature === 'object';
                  const text = isHighlight ? feature.text : feature;
                  return (
                    <li key={idx} className="flex items-center gap-2.5">
                      <Check size={16} className={isHighlight ? 'text-[#22c55e] flex-shrink-0' : 'text-[#6366f1] flex-shrink-0'} />
                      <span className={`text-sm ${isHighlight ? 'text-[#e8e8f0] font-medium' : 'text-[#d0d0e0]'}`}>{text}</span>
                    </li>
                  );
                })}
              </ul>
              <Link href="/signup?plan=pro" className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition text-center block">
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-5 sm:p-8 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-1">Enterprise</h3>
              <p className="text-sm text-[#b0b0c8] mb-5">$10M+ with multiple PMs</p>
              <div className="mb-5">
                <span className="text-4xl sm:text-5xl font-bold text-white">$699</span>
                <span className="text-[#b0b0c8] ml-2">/mo</span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {[
                  'Everything in Professional',
                  'Procore + Salesforce + ServiceTitan',
                  'All 7+ integrations included',
                  { text: 'AI CFO Advisor — priority', highlight: true },
                  { text: 'AI Toolkit — all 24 + custom', highlight: true },
                  { text: 'NAHB Chart of Accounts + trades', highlight: true },
                  'Crew utilization tracking',
                  'Quarterly call with Salisbury Bookkeeping',
                  'Dedicated account manager',
                ].map((feature, idx) => {
                  const isHighlight = typeof feature === 'object';
                  const text = isHighlight ? feature.text : feature;
                  return (
                    <li key={idx} className="flex items-center gap-2.5">
                      <Check size={16} className={isHighlight ? 'text-[#22c55e] flex-shrink-0' : 'text-[#6366f1] flex-shrink-0'} />
                      <span className={`text-sm ${isHighlight ? 'text-[#e8e8f0] font-medium' : 'text-[#d0d0e0]'}`}>{text}</span>
                    </li>
                  );
                })}
              </ul>
              <Link href="/signup?plan=enterprise" className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-[#2a2a3d] hover:bg-[#3a3a4d] transition text-center block">
                Start Free Trial
              </Link>
            </div>
          </div>

          {/* Value anchor */}
          <div className="mt-8 bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-5 sm:p-8 max-w-3xl mx-auto text-center">
            <p className="text-sm text-[#8888a0] mb-2">Let&apos;s do the math</p>
            <p className="text-base sm:text-lg text-[#e8e8f0] font-medium mb-1">
              A fractional controller costs $3,000–$8,000/month.
            </p>
            <p className="text-base sm:text-lg text-[#e8e8f0] font-medium mb-1">
              One missed over-billing costs $50K+ at job close.
            </p>
            <p className="text-base sm:text-lg text-[#6366f1] font-bold mb-3">
              BuilderCFO starts at $299/month. With an AI CFO included.
            </p>
            <p className="text-sm text-[#8888a0]">
              You do the math. Actually, BuilderCFO will do the math for you.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 8 — FAQ (4 key questions)                         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8" id="faq">
        <div className="w-full max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e8e8f0] mb-8 text-center">
            Questions? Answers.
          </h2>

          <div className="space-y-5">
            <div>
              <h3 className="text-base font-semibold text-[#e8e8f0] mb-1.5">What is BuilderCFO?</h3>
              <p className="text-[#b0b0c8] text-sm leading-relaxed">
                A financial dashboard made for construction companies. It connects to QuickBooks Online and field tools like Procore, Buildertrend, and ServiceTitan. You see job costs, WIP, cash flow, and AR/AP in one place. Every plan includes an AI CFO Advisor that answers your money questions using your real data.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#e8e8f0] mb-1.5">How much does it cost?</h3>
              <p className="text-[#b0b0c8] text-sm leading-relaxed">
                Starter is $299/month. Professional is $499/month. Enterprise is $699/month. Every plan gets a 14-day free trial and includes the AI CFO Advisor. No setup fees. No contracts. Cancel anytime.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#e8e8f0] mb-1.5">Is my data safe?</h3>
              <p className="text-[#b0b0c8] text-sm leading-relaxed">
                Yes. Your data is encrypted at rest and in transit. The QuickBooks connection is read-only — we can&apos;t touch your books. Payments go through Stripe (PCI compliant).
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#e8e8f0] mb-1.5">Can I cancel anytime?</h3>
              <p className="text-[#b0b0c8] text-sm leading-relaxed">
                Yes. No contracts. No fees. Cancel whenever you want and keep access through the end of your billing period. Start with the 14-day free trial — if you don&apos;t love it, you never pay a dime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 9 — FINAL CTA                                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#12121a]/50">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/5 via-transparent to-[#a78bfa]/5 pointer-events-none" />
        <div className="w-full max-w-3xl mx-auto text-center relative">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e8e8f0] mb-3">
            Your Money. Your Jobs. Finally Clear.
          </h2>
          <p className="text-base text-[#b0b0c8] mb-2">
            14 days free. AI CFO included. Real answers from your real data.
          </p>
          <p className="text-sm text-[#8888a0] mb-6">
            The only risk is not knowing what your numbers are telling you right now.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition text-lg shadow-lg shadow-[#6366f1]/20"
          >
            Start Your Free Trial <ChevronRight size={18} />
          </Link>
          <p className="text-sm text-[#8888a0] mt-4">
            Built by{' '}
            <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#6366f1] hover:text-[#818cf8] transition">
              Salisbury Bookkeeping
            </a>{' '}
            — Fractional Controllers for Construction Companies
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#12121a] border-t border-[#1e1e2e] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <h4 className="text-sm font-semibold text-[#8888a0] mb-3 uppercase">Product</h4>
              <ul className="space-y-1.5 text-sm">
                <li><a href="#live-demo" className="text-[#e8e8f0] hover:text-[#6366f1]">Dashboard Demo</a></li>
                <li><a href="#cfo-advisor" className="text-[#e8e8f0] hover:text-[#6366f1]">CFO Advisor</a></li>
                <li><a href="#pricing" className="text-[#e8e8f0] hover:text-[#6366f1]">Pricing</a></li>
                <li><a href="#faq" className="text-[#e8e8f0] hover:text-[#6366f1]">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#8888a0] mb-3 uppercase">Company</h4>
              <ul className="space-y-1.5 text-sm">
                <li><a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#e8e8f0] hover:text-[#6366f1]">Salisbury Bookkeeping</a></li>
                <li><a href="https://salisburybookkeeping.com/about" target="_blank" rel="noopener noreferrer" className="text-[#e8e8f0] hover:text-[#6366f1]">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#8888a0] mb-3 uppercase">Legal</h4>
              <ul className="space-y-1.5 text-sm">
                <li><a href="#" className="text-[#e8e8f0] hover:text-[#6366f1]">Privacy Policy</a></li>
                <li><a href="#" className="text-[#e8e8f0] hover:text-[#6366f1]">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#8888a0] mb-3 uppercase">Contact</h4>
              <ul className="space-y-1.5 text-sm">
                <li><a href="mailto:cory@salisburybookkeeping.com" className="text-[#e8e8f0] hover:text-[#6366f1]">cory@salisburybookkeeping.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1e1e2e] pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-[#8888a0]">
            <div>© 2026 BuilderCFO. All rights reserved.</div>
            <div className="mt-3 md:mt-0">
              Built by <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#6366f1] hover:text-[#818cf8] transition">Salisbury Bookkeeping</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
