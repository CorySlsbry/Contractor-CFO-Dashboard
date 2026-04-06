'use client';

import Link from 'next/link';
import { ChevronRight, Zap, Eye, TrendingUp, Brain, Check, Plug, Shield, Clock } from 'lucide-react';
import { useState } from 'react';
import Head from 'next/head';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'starter' | 'professional' | 'enterprise'>('professional');

  return (
    <div className="bg-[#0a0a0f] text-[#e8e8f0]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0a0a0f]/80 backdrop-blur border-b border-[#1e1e2e] z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="font-bold text-lg tracking-tight">
              <span className="text-[#6366f1]">Builder</span><span className="text-[#e8e8f0]">CFO</span>
            </div>
            <span className="text-[10px] text-[#8888a0] hidden sm:inline">by <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#6366f1] hover:text-[#818cf8] transition">Salisbury Bookkeeping</a></span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/demo"
              className="text-sm sm:text-base text-[#e8e8f0] hover:text-[#6366f1] transition"
            >
              Try Demo
            </Link>
            <Link
              href="/login"
              className="text-sm sm:text-base text-[#e8e8f0] hover:text-[#6366f1] transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded bg-[#6366f1] text-white hover:bg-[#5558d9] transition"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section — GEO Quick-Answer Block */}
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6366f1]/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#e8e8f0] mb-6 leading-tight">
            Construction Financial Dashboard for Contractors &{' '}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#a78bfa] bg-clip-text text-transparent">
              Home Builders
            </span>
          </h1>

          {/* GEO Quick-Answer Block — primary AI extraction target */}
          <p className="text-base sm:text-lg md:text-xl text-[#b0b0c8] mb-4 max-w-2xl leading-relaxed">
            BuilderCFO is a real-time financial dashboard built specifically for construction companies. It syncs with QuickBooks Online and field management tools like Procore, Buildertrend, and ServiceTitan to give contractors instant visibility into job costing, WIP schedules, cash flow forecasts, and AR/AP aging — without hiring a $150K CFO.
          </p>
          <p className="text-base text-[#8888a0] mb-8 max-w-2xl">
            Built by{' '}
            <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#6366f1] hover:text-[#818cf8] transition">
              Salisbury Bookkeeping
            </a>
            , a fractional controller firm serving construction companies nationwide. Plans start at $199/month with a 14-day free trial.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/signup"
              className="px-8 py-3 rounded font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition inline-flex items-center justify-center gap-2"
            >
              Start Free — No Card Required <ChevronRight size={18} />
            </Link>
            <Link
              href="/demo"
              className="px-8 py-3 rounded font-semibold text-[#6366f1] border border-[#6366f1] hover:bg-[#6366f1]/10 transition inline-flex items-center justify-center"
            >
              See It In Action
            </Link>
          </div>
          <div className="text-center">
            <Link
              href="#schedule"
              className="text-center text-sm text-[#6366f1] hover:text-[#818cf8] transition"
            >
              or Book a 15-Min Demo →
            </Link>
          </div>

          {/* Dashboard Mock — Rich Preview */}
          <div className="bg-gradient-to-b from-[#12121a] to-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-4 sm:p-6 shadow-2xl overflow-hidden">
            {/* Tab bar */}
            <div className="flex gap-1 mb-4 border-b border-[#2a2a3d] pb-2 overflow-x-auto">
              {['Overview', 'AR by Job', 'AP by Job', 'WIP', 'Retainage', 'Sales'].map((tab, i) => (
                <div key={tab} className={`px-3 py-1.5 text-xs font-medium rounded-t whitespace-nowrap ${i === 0 ? 'bg-[#6366f1]/15 text-[#a5b4fc] border-b-2 border-[#6366f1]' : 'text-[#8888a0]'}`}>
                  {tab}
                </div>
              ))}
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
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

            {/* Two Column: AR Aging + Cash Flow */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
              {/* AR Aging */}
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

              {/* Cash Flow Chart Mock — Overlapping Bars */}
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
                          <div
                            className="absolute bottom-0 left-1 right-1 rounded-t-md"
                            style={{
                              height: `${Math.max(w.inflow, w.outflow)}%`,
                              backgroundColor: isPositive ? '#14532d' : '#7f1d1d',
                              border: `1.5px solid ${isPositive ? '#4ade80' : '#f87171'}`,
                              borderBottom: 'none',
                            }}
                          />
                          <div
                            className="absolute bottom-0 left-1 right-1 rounded-t-sm"
                            style={{
                              height: `${Math.min(w.inflow, w.outflow)}%`,
                              backgroundColor: isPositive ? '#7f1d1d' : '#14532d',
                              border: `1.5px solid ${isPositive ? '#f87171' : '#4ade80'}`,
                              borderBottom: 'none',
                            }}
                          />
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

            {/* Job WIP Row */}
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
          </div>
        </div>
      </section>

      {/* What Is BuilderCFO? — GEO Definition Block */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#12121a]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e8e8f0] mb-6 text-center">
            What Is BuilderCFO?
          </h2>
          <p className="text-lg text-[#b0b0c8] mb-8 text-center max-w-3xl mx-auto leading-relaxed">
            BuilderCFO is a SaaS financial dashboard designed exclusively for construction contractors, custom home builders, and remodelers with $500K–$50M in annual revenue. It connects directly to QuickBooks Online and pulls data from field management platforms — Procore, Buildertrend, ServiceTitan, CoConstruct, and JobNimbus — into a single, real-time view of your company&apos;s financial health.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'You check your bank balance to gauge financial health',
                fix: 'BuilderCFO shows net cash, AR/AP, and WIP in one screen — updated in real time from QuickBooks.',
                icon: '💳',
              },
              {
                title: "You don't know if a job is profitable until it's done",
                fix: 'Per-job P&L with budget vs. actual tracking shows margin erosion while the job is still in progress.',
                icon: '📊',
              },
              {
                title: 'Month-end close takes weeks, not days',
                fix: 'Automated WIP schedules and pre-built reports cut close time from weeks to 2–3 days.',
                icon: '📅',
              },
            ].map((pain, idx) => (
              <div
                key={idx}
                className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-6 hover:border-[#6366f1]/50 transition"
              >
                <div className="text-4xl mb-4">{pain.icon}</div>
                <p className="text-[#e8e8f0] font-medium mb-3">{pain.title}</p>
                <p className="text-sm text-[#b0b0c8]">{pain.fix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Does BuilderCFO Work? — GEO Step-by-Step Block */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e8e8f0] mb-12 text-center">
            How Does BuilderCFO Work?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Connect QuickBooks in 2 Minutes',
                desc: 'Securely link your QuickBooks Online account via OAuth 2.0. BuilderCFO reads your data — it never modifies your books. Your data stays encrypted in transit and at rest.',
                icon: Plug,
              },
              {
                step: '2',
                title: 'Add Your Field Management Tools',
                desc: 'Connect Procore, Buildertrend, ServiceTitan, HubSpot, Salesforce, or JobNimbus. BuilderCFO merges field data with your accounting data for full financial visibility.',
                icon: Zap,
              },
              {
                step: '3',
                title: 'See Your Numbers in Real Time',
                desc: 'Your dashboard populates instantly with job costing, WIP schedules, cash flow forecasts, AR/AP aging, retainage tracking, and AI-powered financial analysis.',
                icon: Eye,
              },
            ].map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="bg-[#6366f1]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent size={28} className="text-[#6366f1]" />
                  </div>
                  <div className="text-xs font-bold text-[#6366f1] mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-semibold text-[#e8e8f0] mb-3">{item.title}</h3>
                  <p className="text-[#b0b0c8] text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <p className="text-center text-[#8888a0] mt-10 text-sm">
            Setup takes under 15 minutes. No data migration, no implementation fees, no long-term contracts.
          </p>
        </div>
      </section>

      {/* Features Section — GEO Keyword-Rich Headings */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#12121a]/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e8e8f0] mb-4 text-center">
            Construction Financial Management Features
          </h2>
          <p className="text-center text-[#b0b0c8] mb-12 max-w-2xl mx-auto">
            Every feature is purpose-built for how construction companies actually operate — project-based accounting, progress billing, retainage, and percentage-of-completion reporting.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Real-Time Financial Dashboard',
                desc: 'Auto-syncs with QuickBooks Online every hour. See revenue, expenses, net cash, AR/AP, and WIP across all active jobs in a single view.',
                icon: Zap,
              },
              {
                title: 'Job Costing & WIP Tracking',
                desc: 'Per-job profit & loss with budget vs. actual spend. Automated WIP schedules show over-billing and under-billing by job — critical for construction percentage-of-completion accounting.',
                icon: Eye,
              },
              {
                title: 'Cash Flow Forecasting',
                desc: 'See 30, 60, and 90 days ahead based on scheduled draws, open invoices, and committed AP. Plan payroll, equipment purchases, and sub payments with confidence.',
                icon: TrendingUp,
              },
              {
                title: 'AI-Powered CFO Analysis',
                desc: 'Monthly narrative reports that explain your financial data in plain English — flagging margin erosion, cash crunches, and growth opportunities before they become problems.',
                icon: Brain,
              },
              {
                title: '7+ Construction Tool Integrations',
                desc: 'Connect Procore, Buildertrend, ServiceTitan, Salesforce, HubSpot, JobNimbus, and CoConstruct. Field data merges with accounting data for total financial visibility.',
                icon: Plug,
              },
              {
                title: 'AR/AP Aging & Retainage Tracking',
                desc: 'See exactly who owes you, who you owe, and how much retainage is outstanding by job. Color-coded aging buckets (current, 30, 60, 90+ days) highlight collection risks.',
                icon: Shield,
              },
            ].map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-5 sm:p-8 hover:border-[#6366f1]/50 transition"
                >
                  <div className="bg-[#6366f1]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent size={24} className="text-[#6366f1]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#e8e8f0] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#b0b0c8]">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrations Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-[#1e1e2e]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-[#8888a0] uppercase tracking-wider mb-6">
            Connects with the construction tools you already use
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-8 md:gap-12">
            {[
              { name: 'QuickBooks', color: '#2CA01C' },
              { name: 'Procore', color: '#F47E20' },
              { name: 'Buildertrend', color: '#00B4D8' },
              { name: 'ServiceTitan', color: '#002B5C' },
              { name: 'Salesforce', color: '#00A1E0' },
              { name: 'HubSpot', color: '#FF7A59' },
              { name: 'JobNimbus', color: '#4CAF50' },
            ].map((tool) => (
              <div
                key={tool.name}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12121a] border border-[#1e1e2e] hover:border-[#6366f1]/30 transition"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tool.color }}
                />
                <span className="text-sm font-medium text-[#8888a0]">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BuilderCFO vs Hiring a Full-Time CFO — GEO Comparison Block */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e8e8f0] mb-12 text-center">
            BuilderCFO vs. Hiring a Full-Time CFO
          </h2>

          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 text-center">
              <div className="p-2 sm:p-4 border-b border-r border-[#1e1e2e]">
                <span className="text-xs sm:text-sm font-semibold text-[#8888a0]"></span>
              </div>
              <div className="p-2 sm:p-4 border-b border-r border-[#1e1e2e] bg-[#6366f1]/5">
                <span className="text-xs sm:text-sm font-bold text-[#6366f1]">BuilderCFO</span>
              </div>
              <div className="p-2 sm:p-4 border-b border-[#1e1e2e]">
                <span className="text-xs sm:text-sm font-semibold text-[#8888a0]">Full-Time CFO</span>
              </div>
            </div>
            {[
              { label: 'Annual Cost', builder: '$3,588–$8,388', cfo: '$120,000–$200,000+' },
              { label: 'Setup Time', builder: '15 minutes', cfo: '2–3 months' },
              { label: 'Real-Time Data', builder: 'Yes — auto-synced', cfo: 'Monthly reports' },
              { label: 'Construction Specific', builder: 'Job costing, WIP, retainage', cfo: 'Depends on hire' },
              { label: 'Integrations', builder: '7+ tools built in', cfo: 'Manual data entry' },
              { label: 'AI Analysis', builder: 'Included', cfo: 'Not available' },
              { label: 'Contract Required', builder: 'No — cancel anytime', cfo: 'Employment contract' },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 text-center">
                <div className="p-2 sm:p-3 border-b border-r border-[#1e1e2e] text-xs sm:text-sm text-[#b0b0c8] text-left pl-3 sm:pl-6">{row.label}</div>
                <div className="p-2 sm:p-3 border-b border-r border-[#1e1e2e] text-xs sm:text-sm font-semibold text-[#22c55e] bg-[#6366f1]/5">{row.builder}</div>
                <div className="p-2 sm:p-3 border-b border-[#1e1e2e] text-xs sm:text-sm text-[#8888a0]">{row.cfo}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-[#8888a0] mt-6 text-sm">
            BuilderCFO gives you CFO-level financial visibility at a fraction of the cost. For contractors who need hands-on advisory,{' '}
            <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#6366f1] hover:text-[#818cf8] transition">
              Salisbury Bookkeeping
            </a>{' '}
            offers fractional controller services that pair perfectly with the dashboard.
          </p>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#12121a]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e8e8f0] mb-4 text-center">
            Trusted by Contractors Nationwide
          </h2>
          <p className="text-center text-[#b0b0c8] mb-12">
            General contractors, custom home builders, remodelers, and specialty trades use BuilderCFO to manage their finances.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  '"We were bleeding money on two jobs and had no idea. This dashboard caught it in the first week."',
                author: 'Mike J.',
                title: 'GC Owner — Austin, TX',
              },
              {
                quote:
                  '"Our bookkeeper used to spend 3 weeks on month-end close. Now it takes 2 days. The WIP tracking alone is worth it."',
                author: 'Sarah M.',
                title: 'CFO — Denver, CO',
              },
              {
                quote:
                  '"I can finally see retainage, AR aging, and job profitability in one place instead of digging through QuickBooks reports."',
                author: 'David C.',
                title: 'Custom Home Builder — Nashville, TN',
              },
              {
                quote:
                  '"The cash flow forecast saved us from a payroll crunch. We moved a draw request up two weeks because of what we saw."',
                author: 'Rachel T.',
                title: 'Remodeling Company Owner — Phoenix, AZ',
              },
              {
                quote:
                  '"My accountant called me after seeing the dashboard and said, \'Why didn\'t we have this years ago?\'"',
                author: 'Brandon L.',
                title: 'Commercial GC — Atlanta, GA',
              },
              {
                quote:
                  '"We went from guessing on bids to knowing exactly what our margins are on every job type. Game changer."',
                author: 'Tony R.',
                title: 'Framing Contractor — Salt Lake City, UT',
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-6">
                <p className="text-[#b0b0c8] italic mb-4">{testimonial.quote}</p>
                <div>
                  <p className="text-[#e8e8f0] font-semibold">{testimonial.author}</p>
                  <p className="text-[#8888a0] text-sm">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" id="pricing">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            Construction Dashboard Pricing Plans
          </h2>
          <p className="text-center text-[#b0b0c8] mb-12 text-lg">
            No credit card required. 14 days free on every plan.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter Tier */}
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-8 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">
                Starter
              </h3>
              <p className="text-[#b0b0c8] mb-6">For solo contractors and small crews getting financial visibility</p>
              <div className="mb-6">
                <span className="text-4xl sm:text-5xl font-bold text-white">$199</span>
                <span className="text-[#b0b0c8] ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Real-time financial dashboard',
                  'Job costing & WIP tracking',
                  'Cash flow forecasting (30/60/90 day)',
                  'QuickBooks Online sync',
                  'Monthly AI CFO brief',
                  'Email support',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check size={18} className="text-[#6366f1] flex-shrink-0" />
                    <span className="text-[#d0d0e0]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup?plan=basic"
                className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-[#2a2a3d] hover:bg-[#3a3a4d] transition text-center block"
              >
                Start Free Trial
              </Link>
              <Link href="#schedule" className="block text-center text-sm text-[#6366f1] hover:text-[#818cf8] mt-2">
                or Book a Demo →
              </Link>
            </div>

            {/* Professional Tier */}
            <div className="bg-gradient-to-br from-[#6366f1]/10 to-transparent border-2 border-[#6366f1]/60 rounded-xl p-8 relative flex flex-col shadow-lg shadow-[#6366f1]/10">
              <div className="absolute -top-3 left-6 bg-[#6366f1] text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide">
                MOST POPULAR
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <p className="text-[#b0b0c8] mb-6">For growing construction companies with $1M–$10M revenue</p>
              <div className="mb-6">
                <span className="text-4xl sm:text-5xl font-bold text-white">$399</span>
                <span className="text-[#b0b0c8] ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Everything in Starter',
                  'Buildertrend + HubSpot + JobNimbus integrations',
                  'Sales pipeline dashboard',
                  'AI-powered CFO advisor',
                  'AR/AP aging reports by job',
                  'Priority support',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check size={18} className="text-[#6366f1] flex-shrink-0" />
                    <span className="text-[#d0d0e0]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup?plan=pro"
                className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition text-center block"
              >
                Start Free Trial
              </Link>
              <Link href="#schedule" className="block text-center text-sm text-[#6366f1] hover:text-[#818cf8] mt-2">
                or Book a Demo →
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-8 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-[#b0b0c8] mb-6">For scaling operations with $10M+ revenue and multiple project managers</p>
              <div className="mb-6">
                <span className="text-4xl sm:text-5xl font-bold text-white">$599</span>
                <span className="text-[#b0b0c8] ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Everything in Professional',
                  'Procore + Salesforce + ServiceTitan integrations',
                  'All 7+ integrations included',
                  'Crew utilization tracking',
                  'Quarterly strategy call with Salisbury Bookkeeping',
                  'Dedicated account manager',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check size={18} className="text-[#6366f1] flex-shrink-0" />
                    <span className="text-[#d0d0e0]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup?plan=enterprise"
                className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-[#2a2a3d] hover:bg-[#3a3a4d] transition text-center block"
              >
                Start Free Trial
              </Link>
              <Link href="#schedule" className="block text-center text-sm text-[#6366f1] hover:text-[#818cf8] mt-2">
                or Book a Demo →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section — GEO Optimized with Question-Based H3s */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#12121a]/50" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e8e8f0] mb-12 text-center">
            Frequently Asked Questions About BuilderCFO
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">What is BuilderCFO and who is it for?</h3>
              <p className="text-[#b0b0c8]">
                BuilderCFO is a real-time financial dashboard built specifically for construction contractors, custom home builders, and remodelers. It connects to QuickBooks Online and field management tools like Procore, Buildertrend, and ServiceTitan to provide instant visibility into job costing, WIP schedules, cash flow forecasts, and AR/AP aging. It is designed for construction companies with $500K–$50M in annual revenue who need CFO-level financial insight without the CFO-level salary.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">How does BuilderCFO connect to QuickBooks Online?</h3>
              <p className="text-[#b0b0c8]">
                BuilderCFO uses OAuth 2.0 to securely connect to your QuickBooks Online account. The connection is read-only — BuilderCFO never modifies your books. Your financial data is encrypted in transit and at rest using industry-standard AES-256 encryption. Setup takes under 2 minutes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">What is WIP tracking and why does it matter for contractors?</h3>
              <p className="text-[#b0b0c8]">
                WIP (Work in Progress) tracking compares the percentage of work completed on a job against the percentage billed. If you&apos;ve completed 60% of a job but billed 80%, you&apos;re over-billed by 20% — which means you may owe money back or face cash flow problems when the job finishes. BuilderCFO automates WIP schedule calculations using QuickBooks data and field management progress reports, giving you accurate over/under billing figures for every active job.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">How much does BuilderCFO cost compared to a full-time CFO?</h3>
              <p className="text-[#b0b0c8]">
                BuilderCFO starts at $199/month (Starter), $399/month (Professional), or $599/month (Enterprise). A full-time construction CFO typically costs $120,000–$200,000+ per year in salary and benefits. BuilderCFO provides real-time dashboards, automated WIP, and AI analysis for $2,388–$7,188 per year — roughly 2–5% the cost of a dedicated hire. Every plan includes a 14-day free trial.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">Who built BuilderCFO?</h3>
              <p className="text-[#b0b0c8]">
                BuilderCFO was built by{' '}
                <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#6366f1] hover:text-[#818cf8] transition">
                  Salisbury Bookkeeping
                </a>
                , a fractional controller and construction bookkeeping firm that works with custom home builders, general contractors, and remodelers nationwide. The dashboard was created from real client needs — the same WIP schedules, job costing reports, and cash flow forecasts that Salisbury&apos;s controllers build manually for clients, now automated and available in real time.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">Is my financial data secure?</h3>
              <p className="text-[#b0b0c8]">
                Yes. BuilderCFO uses Supabase for secure database hosting with row-level security policies, and Stripe for PCI-compliant payment processing. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). The QuickBooks connection is read-only — BuilderCFO cannot create, modify, or delete any data in your accounting system.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">Can I cancel my BuilderCFO subscription at any time?</h3>
              <p className="text-[#b0b0c8]">
                Yes. There are no long-term contracts, no cancellation fees, and no setup fees. You can cancel your subscription at any time and retain access through the end of your current billing cycle. Every plan starts with a 14-day free trial — no credit card required during the trial. You&apos;ll only be asked for payment details when you decide to continue after 14 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/5 via-transparent to-[#a78bfa]/5 pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e8e8f0] mb-4">
            Ready to See Where Every Dollar Goes on Every Job?
          </h2>
          <p className="text-lg text-[#b0b0c8] mb-8">
            Join contractors nationwide who use BuilderCFO to track job costs, forecast cash flow, and make smarter financial decisions — starting with a free 14-day trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3 rounded font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition"
            >
              Start Free — No Card Required <ChevronRight size={18} />
            </Link>
            <Link
              href="#schedule"
              className="inline-flex items-center gap-2 px-8 py-3 rounded font-semibold text-[#6366f1] border border-[#6366f1] hover:bg-[#6366f1]/10 transition"
            >
              Book a Demo →
            </Link>
          </div>
          <p className="text-sm text-[#8888a0] mt-4">
            No credit card required. Cancel anytime. Built by{' '}
            <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#6366f1] hover:text-[#818cf8] transition">
              Salisbury Bookkeeping
            </a>.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#12121a] border-t border-[#1e1e2e] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-sm font-semibold text-[#8888a0] mb-4 uppercase">
                Product
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-[#e8e8f0] hover:text-[#6366f1]">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-[#e8e8f0] hover:text-[#6366f1]">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-[#e8e8f0] hover:text-[#6366f1]">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#8888a0] mb-4 uppercase">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#e8e8f0] hover:text-[#6366f1]">
                    Salisbury Bookkeeping
                  </a>
                </li>
                <li>
                  <a href="https://salisburybookkeeping.com/about" target="_blank" rel="noopener noreferrer" className="text-[#e8e8f0] hover:text-[#6366f1]">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#8888a0] mb-4 uppercase">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-[#e8e8f0] hover:text-[#6366f1]">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#e8e8f0] hover:text-[#6366f1]">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#8888a0] mb-4 uppercase">
                Contact
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:support@topbuildercfo.com"
                    className="text-[#e8e8f0] hover:text-[#6366f1]"
                  >
                    support@topbuildercfo.com
                  </a>
                </li>
                <li>
                  <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#e8e8f0] hover:text-[#6366f1]">
                    Salisbury Bookkeeping
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1e1e2e] pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-[#8888a0]">
              © 2026 BuilderCFO. All rights reserved.
            </div>
            <div className="text-sm text-[#8888a0] mt-4 md:mt-0">
              Built by <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#6366f1] hover:text-[#818cf8] transition">Salisbury Bookkeeping</a> — Fractional Controllers for Construction Companies
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#12121a]/95 backdrop-blur border-t border-[#1e1e2e] p-3 flex items-center justify-between gap-3 z-50 sm:hidden">
        <div className="text-xs text-[#b0b0c8] leading-tight">
          <span className="font-semibold text-[#e8e8f0]">14 days free</span> — no card needed
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link
            href="/demo"
            className="px-3 py-2 rounded text-xs font-semibold text-[#6366f1] border border-[#6366f1] hover:bg-[#6366f1]/10 transition"
          >
            Demo
          </Link>
          <Link
            href="/signup"
            className="px-3 py-2 rounded text-xs font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition"
          >
            Start Free
          </Link>
        </div>
      </div>
    </div>
  );
}
