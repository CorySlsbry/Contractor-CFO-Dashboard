'use client';

import Link from 'next/link';
import { ChevronRight, Zap, Eye, TrendingUp, Brain, Check, Plug, Shield, Clock, Crown, MessageSquare, UserCheck, DollarSign, AlertTriangle, TrendingDown, Gift } from 'lucide-react';
import { useState } from 'react';
import Head from 'next/head';
import ReferralModal from '@/components/ReferralModal';
import WhiteGloveBookingModal from '@/components/WhiteGloveBookingModal';
import TopAnnouncementBanner from '@/components/marketing/top-announcement-banner';
import SecurityTrustBar from '@/components/marketing/security-trust-bar';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'starter' | 'professional' | 'enterprise'>('professional');
  const [referralOpen, setReferralOpen] = useState(false);
  const [referralPlan, setReferralPlan] = useState<{ plan: string; planName: string }>({
    plan: 'pro',
    planName: 'Professional',
  });
  const [whiteGloveOpen, setWhiteGloveOpen] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'jobcosting' | 'cashflow' | 'arap' | 'wip' | 'retainage'>('overview');

  const openReferral = (plan: string, planName: string) => {
    setReferralPlan({ plan, planName });
    setReferralOpen(true);
  };

  return (
    <div className="bg-[#0a0a0f] text-[#e8e8f0]">
      <TopAnnouncementBanner />

      {/* Navigation */}
      <nav className="fixed top-[32px] sm:top-[36px] w-full bg-[#0a0a0f]/80 backdrop-blur border-b border-[#1e1e2e] z-50">
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
            <button
              onClick={() => openReferral('pro', 'Professional')}
              className="text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded bg-[#6366f1] text-white hover:bg-[#5558d9] transition"
            >
              Start Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-12 sm:pt-36 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6366f1]/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          {/* Social proof bar */}
          <div className="inline-flex items-center gap-2 bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-full px-4 py-1.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <p className="text-xs sm:text-sm text-[#d0d0e0] tracking-wide">
              Built by{' '}
              <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#a5b4fc] hover:text-[#c7d2fe] font-semibold transition">
                Salisbury Bookkeeping
              </a>
              {' '}&mdash; fractional CFO &amp; developer who&rsquo;ve managed the books for construction companies
            </p>
          </div>

          <SecurityTrustBar />

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#e8e8f0] mb-6 leading-tight">
            You&rsquo;re Busy Building. Who&rsquo;s Watching{' '}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#a78bfa] bg-clip-text text-transparent">
              Your Money
            </span>
            ?
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-[#d0d0e0] mb-8 max-w-2xl leading-relaxed">
            The CFO dashboard that shows construction contractors exactly{' '}
            <span className="text-[#f87171] font-medium">where cash is leaking</span>, which jobs{' '}
            <span className="text-[#4ade80] font-medium">actually make money</span>, and what&rsquo;s coming next&nbsp;&mdash; before it&rsquo;s too late.
          </p>

          {/* Pain strip */}
          <div className="mb-8 max-w-2xl bg-[#f87171]/5 border border-[#f87171]/20 rounded-lg p-4">
            <p className="text-sm font-semibold text-[#f87171] mb-3">Sound familiar?</p>
            <div className="space-y-2.5">
              {[
                'You finished a job and aren\'t sure if you actually made money on it',
                'Your bookkeeper\'s reports are weeks late \u2014 and you still can\'t read them',
                'You\'ve been surprised by a cash shortfall at least once this year',
                'You\'re pricing new bids off gut feel instead of real job cost data',
              ].map((pain) => (
                <div key={pain} className="flex items-start gap-2.5">
                  <AlertTriangle size={15} className="text-[#f87171] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[#e8e8f0]">{pain}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={() => openReferral('pro', 'Professional')}
              className="px-8 py-3 rounded-lg font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition inline-flex items-center justify-center gap-2 shadow-lg shadow-[#6366f1]/25"
            >
              Start 14-Day Free Trial <ChevronRight size={18} />
            </button>
            <Link
              href="/demo"
              className="px-8 py-3 rounded-lg font-semibold text-[#6366f1] border border-[#6366f1] hover:bg-[#6366f1]/10 transition inline-flex items-center justify-center"
            >
              See It In Action
            </Link>
          </div>

          {/* Trust badge row */}
          <div className="mb-8 max-w-2xl bg-[#22c55e]/5 border border-[#22c55e]/20 rounded-lg p-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2.5 mb-3">
              <span className="flex items-center gap-1.5 text-xs text-[#e8e8f0] font-medium">
                <Shield size={14} className="text-[#22c55e]" /> 30-Day Money-Back Guarantee
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#e8e8f0] font-medium">
                <MessageSquare size={14} className="text-[#22c55e]" /> Direct Developer Access
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#e8e8f0] font-medium">
                <Clock size={14} className="text-[#22c55e]" /> Live in 10 Minutes
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#e8e8f0] font-medium">
                <Check size={14} className="text-[#22c55e]" /> Cancel Anytime
              </span>
            </div>
            <p className="text-sm text-[#4ade80] font-semibold">
              14-day free trial + 30-day money-back guarantee = 44 days to decide risk-free.
            </p>
            {/* Referral offer callout */}
            <button
              onClick={() => openReferral('pro', 'Professional')}
              className="mt-3 flex items-center gap-2 bg-gradient-to-r from-[#6366f1]/10 to-[#a78bfa]/10 border border-[#6366f1]/30 rounded-lg px-4 py-2.5 hover:border-[#6366f1]/60 transition group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center flex-shrink-0">
                <Gift size={14} className="text-[#a5b4fc]" />
              </div>
              <span className="text-xs text-[#b0b0c8] group-hover:text-[#e8e8f0] transition">
                <span className="font-semibold text-[#a5b4fc]">Refer 2 friends → get 20% off.</span>{' '}
                They get 20% off too. Click to unlock.
              </span>
              <ChevronRight size={14} className="text-[#6366f1] flex-shrink-0" />
            </button>
          </div>

          {/* GEO paragraph — AI crawler target */}
          <p className="text-sm text-[#8888a0] mb-12 max-w-2xl leading-relaxed">
            BuilderCFO is a real-time financial dashboard built specifically for construction companies. It syncs with QuickBooks Online and field management tools like Procore, Buildertrend, and ServiceTitan to give contractors instant visibility into job costing, WIP schedules, cash flow forecasts, and AR/AP aging&nbsp;&mdash; without hiring a $150K CFO. Plans start at $299/month with a 14-day free trial. Credit card required.
          </p>

          {/* Live Dashboard Preview */}
          <div className="text-[10px] uppercase tracking-widest text-[#8888a0] mb-2">Live Dashboard Preview</div>
          <div className="bg-gradient-to-b from-[#12121a] to-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-4 sm:p-6 shadow-2xl overflow-hidden">
            {/* Dashboard Tab bar */}
            <div className="flex gap-1 mb-4 border-b border-[#2a2a3d] pb-2 overflow-x-auto">
              {([
                { key: 'overview', label: 'Overview' },
                { key: 'jobcosting', label: 'Job Costing' },
                { key: 'cashflow', label: 'Cash Flow' },
                { key: 'arap', label: 'AR/AP' },
                { key: 'wip', label: 'WIP' },
                { key: 'retainage', label: 'Retainage' },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setDashboardTab(tab.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-t whitespace-nowrap transition-colors ${
                    dashboardTab === tab.key
                      ? 'bg-[#6366f1]/15 text-[#a5b4fc] border-b-2 border-[#6366f1]'
                      : 'text-[#8888a0] hover:text-[#b0b0c8]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* === OVERVIEW TAB === */}
            {dashboardTab === 'overview' && (
              <div>
                {/* Win & Watch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#0a0a0f] border-l-2 border-[#22c55e] rounded-r-lg px-3 py-2" style={{ backgroundColor: 'rgba(34,197,94,0.05)' }}>
                    <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
                    <p className="text-xs text-[#e8e8f0] mt-0.5">Net cash position up 26.1% &mdash; strongest quarter in 12 months</p>
                  </div>
                  <div className="bg-[#0a0a0f] border-l-2 border-[#eab308] rounded-r-lg px-3 py-2" style={{ backgroundColor: 'rgba(234,179,8,0.05)' }}>
                    <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
                    <p className="text-xs text-[#e8e8f0] mt-0.5">AR aging over 60 days crept up 8% &mdash; follow up on 3 invoices</p>
                  </div>
                </div>
                {/* KPI Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { label: 'Revenue (YTD)', value: '$2.85M', change: '+12.3%', up: true },
                    { label: 'AR Outstanding', value: '$487.2K', change: '+3.1%', up: false },
                    { label: 'AP Outstanding', value: '$312.8K', change: '-8.2%', up: true },
                    { label: 'Net Cash', value: '$744.3K', change: '+26.1%', up: true },
                    { label: 'WIP Over-Billing', value: '$82.4K', change: '-12.5%', up: true },
                    { label: 'Retainage Held', value: '$196.5K', change: '+4.3%', up: false },
                  ].map((kpi) => (
                    <div key={kpi.label} className={`bg-[#0a0a0f] rounded-lg p-3 border-l-2 ${kpi.up ? 'border-[#22c55e]' : 'border-[#ef4444]'}`} style={{ borderTop: '1px solid #2a2a3d', borderRight: '1px solid #2a2a3d', borderBottom: '1px solid #2a2a3d' }}>
                      <div className="text-[#b0b0c8] text-[10px] uppercase tracking-wide mb-1">{kpi.label}</div>
                      <div className="text-lg font-bold text-white">{kpi.value}</div>
                      <div className={`text-xs font-bold ${kpi.up ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>{kpi.change}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* === JOB COSTING TAB === */}
            {dashboardTab === 'jobcosting' && (
              <div>
                {/* Win & Watch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#0a0a0f] border-l-2 border-[#22c55e] rounded-r-lg px-3 py-2" style={{ backgroundColor: 'rgba(34,197,94,0.05)' }}>
                    <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
                    <p className="text-xs text-[#e8e8f0] mt-0.5">Riverside Estate running 4.2% above estimated margin</p>
                  </div>
                  <div className="bg-[#0a0a0f] border-l-2 border-[#eab308] rounded-r-lg px-3 py-2" style={{ backgroundColor: 'rgba(234,179,8,0.05)' }}>
                    <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
                    <p className="text-xs text-[#e8e8f0] mt-0.5">Heritage Park labor costs 18% over budget &mdash; review subcontractor billing</p>
                  </div>
                </div>
                {/* Job Profitability Table */}
                <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-4 overflow-x-auto">
                  <div className="text-sm font-semibold text-[#e8e8f0] mb-3">Job Profitability</div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-[#8888a0] text-[10px] uppercase tracking-wide border-b border-[#2a2a3d]">
                        <th className="text-left pb-2 pr-4">Job Name</th>
                        <th className="text-right pb-2 pr-4">Contract Value</th>
                        <th className="text-right pb-2 pr-4">Costs to Date</th>
                        <th className="text-right pb-2 pr-4">Gross Margin</th>
                        <th className="text-right pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Riverside Estate Custom Home', contract: '$950,000', costs: '$689,350', margin: '27.4%', marginGood: true, status: 'On Track', statusColor: '#22c55e' },
                        { name: 'Heritage Park Commercial', contract: '$1,450,000', costs: '$1,182,100', margin: '18.5%', marginGood: false, status: 'Over Budget', statusColor: '#ef4444' },
                        { name: 'Mountain View Remodel', contract: '$165,000', costs: '$127,050', margin: '23.0%', marginGood: true, status: 'Complete', statusColor: '#8888a0' },
                        { name: 'Cedar Heights Addition', contract: '$210,000', costs: '$155,400', margin: '26.0%', marginGood: true, status: 'On Track', statusColor: '#22c55e' },
                        { name: 'Oakwood Duplex', contract: '$380,000', costs: '$296,400', margin: '22.0%', marginGood: true, status: 'On Track', statusColor: '#22c55e' },
                      ].map((job) => (
                        <tr key={job.name} className="border-b border-[#2a2a3d]/50">
                          <td className="py-2 pr-4 text-[#e8e8f0] whitespace-nowrap">{job.name}</td>
                          <td className="py-2 pr-4 text-right text-[#b0b0c8]">{job.contract}</td>
                          <td className="py-2 pr-4 text-right text-[#b0b0c8]">{job.costs}</td>
                          <td className={`py-2 pr-4 text-right font-bold ${job.marginGood ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>{job.margin}</td>
                          <td className="py-2 text-right font-semibold whitespace-nowrap" style={{ color: job.statusColor }}>{job.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* === CASH FLOW TAB === */}
            {dashboardTab === 'cashflow' && (
              <div>
                {/* Win & Watch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#0a0a0f] border-l-2 border-[#22c55e] rounded-r-lg px-3 py-2" style={{ backgroundColor: 'rgba(34,197,94,0.05)' }}>
                    <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
                    <p className="text-xs text-[#e8e8f0] mt-0.5">Positive cash flow projected for next 4 weeks</p>
                  </div>
                  <div className="bg-[#0a0a0f] border-l-2 border-[#eab308] rounded-r-lg px-3 py-2" style={{ backgroundColor: 'rgba(234,179,8,0.05)' }}>
                    <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
                    <p className="text-xs text-[#e8e8f0] mt-0.5">Week 2 outflows exceed inflows by $14K &mdash; payment due to lumber supplier</p>
                  </div>
                </div>
                {/* Cash Flow Chart */}
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
            )}

            {/* === AR/AP TAB === */}
            {dashboardTab === 'arap' && (
              <div>
                {/* Win & Watch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#0a0a0f] border-l-2 border-[#22c55e] rounded-r-lg px-3 py-2" style={{ backgroundColor: 'rgba(34,197,94,0.05)' }}>
                    <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
                    <p className="text-xs text-[#e8e8f0] mt-0.5">87% of receivables are current or under 30 days</p>
                  </div>
                  <div className="bg-[#0a0a0f] border-l-2 border-[#eab308] rounded-r-lg px-3 py-2" style={{ backgroundColor: 'rgba(234,179,8,0.05)' }}>
                    <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
                    <p className="text-xs text-[#e8e8f0] mt-0.5">$28.7K sitting at 61-90 days &mdash; Heritage Park retainage hold</p>
                  </div>
                </div>
                {/* AR Aging + AP Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
                    <div className="text-sm font-semibold text-[#e8e8f0] mb-3">AP Summary</div>
                    <div className="space-y-3">
                      {[
                        { label: 'Total AP Outstanding', value: '$312.8K', warn: false },
                        { label: 'Due This Week', value: '$47.2K', warn: false },
                        { label: 'Overdue', value: '$18.9K', warn: true },
                        { label: 'Top Vendor (Pacific Lumber)', value: '$68.4K', warn: false },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="text-[10px] text-[#b0b0c8]">{item.label}</span>
                          <span className={`text-xs font-bold ${item.warn ? 'text-[#f87171]' : 'text-[#e8e8f0]'}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* === WIP TAB === */}
            {dashboardTab === 'wip' && (
              <div>
                {/* Win & Watch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#0a0a0f] border-l-2 border-[#22c55e] rounded-r-lg px-3 py-2" style={{ backgroundColor: 'rgba(34,197,94,0.05)' }}>
                    <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
                    <p className="text-xs text-[#e8e8f0] mt-0.5">Overall WIP variance within 3% &mdash; solid cost control</p>
                  </div>
                  <div className="bg-[#0a0a0f] border-l-2 border-[#eab308] rounded-r-lg px-3 py-2" style={{ backgroundColor: 'rgba(234,179,8,0.05)' }}>
                    <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
                    <p className="text-xs text-[#e8e8f0] mt-0.5">Mountain View Remodel is 100% complete but $39.5K under-billed</p>
                  </div>
                </div>
                {/* Active Jobs WIP Table */}
                <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-4">
                  <div className="text-sm font-semibold text-[#e8e8f0] mb-3">Active Jobs &mdash; WIP Status</div>
                  <div className="space-y-2">
                    {[
                      { name: 'Riverside Estate Custom Home', pct: 82, contract: '$950K', billing: 'Over-Billed', billingAmt: '$69K', billingColor: '#eab308' },
                      { name: 'Heritage Park Commercial', pct: 77, contract: '$1.45M', billing: 'Over-Billed', billingAmt: '$141.5K', billingColor: '#f87171' },
                      { name: 'Mountain View Remodel', pct: 100, contract: '$165K', billing: 'Under-Billed', billingAmt: '$39.5K', billingColor: '#f87171' },
                      { name: 'Cedar Heights Addition', pct: 93, contract: '$210K', billing: 'Under-Billed', billingAmt: '$55.3K', billingColor: '#f87171' },
                      { name: 'Oakwood Duplex', pct: 94, contract: '$380K', billing: 'Over-Billed', billingAmt: '$5.2K', billingColor: '#4ade80' },
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
            )}

            {/* === RETAINAGE TAB === */}
            {dashboardTab === 'retainage' && (
              <div>
                {/* Win & Watch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#0a0a0f] border-l-2 border-[#22c55e] rounded-r-lg px-3 py-2" style={{ backgroundColor: 'rgba(34,197,94,0.05)' }}>
                    <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
                    <p className="text-xs text-[#e8e8f0] mt-0.5">$82K in retainage eligible for release this month</p>
                  </div>
                  <div className="bg-[#0a0a0f] border-l-2 border-[#eab308] rounded-r-lg px-3 py-2" style={{ backgroundColor: 'rgba(234,179,8,0.05)' }}>
                    <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
                    <p className="text-xs text-[#e8e8f0] mt-0.5">2 GCs holding retainage past contractual release date</p>
                  </div>
                </div>
                {/* Retainage Tracking Table */}
                <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-4 overflow-x-auto">
                  <div className="text-sm font-semibold text-[#e8e8f0] mb-3">Retainage Tracking</div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-[#8888a0] text-[10px] uppercase tracking-wide border-b border-[#2a2a3d]">
                        <th className="text-left pb-2 pr-4">Job Name</th>
                        <th className="text-right pb-2 pr-4">Retainage Held</th>
                        <th className="text-right pb-2 pr-4">% of Contract</th>
                        <th className="text-right pb-2 pr-4">Eligible Date</th>
                        <th className="text-right pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Riverside Estate Custom Home', held: '$47,500', pctContract: '5.0%', eligible: 'May 2026', status: 'Eligible', statusColor: '#22c55e' },
                        { name: 'Heritage Park Commercial', held: '$72,500', pctContract: '5.0%', eligible: 'Jul 2026', status: 'Pending', statusColor: '#eab308' },
                        { name: 'Mountain View Remodel', held: '$8,250', pctContract: '5.0%', eligible: 'Apr 2026', status: 'Overdue', statusColor: '#ef4444' },
                        { name: 'Cedar Heights Addition', held: '$31,500', pctContract: '15.0%', eligible: 'Jun 2026', status: 'Eligible', statusColor: '#22c55e' },
                        { name: 'Oakwood Duplex', held: '$36,750', pctContract: '9.7%', eligible: 'Apr 2026', status: 'Overdue', statusColor: '#ef4444' },
                      ].map((job) => (
                        <tr key={job.name} className="border-b border-[#2a2a3d]/50">
                          <td className="py-2 pr-4 text-[#e8e8f0] whitespace-nowrap">{job.name}</td>
                          <td className="py-2 pr-4 text-right text-[#b0b0c8]">{job.held}</td>
                          <td className="py-2 pr-4 text-right text-[#b0b0c8]">{job.pctContract}</td>
                          <td className="py-2 pr-4 text-right text-[#b0b0c8]">{job.eligible}</td>
                          <td className="py-2 text-right font-semibold whitespace-nowrap" style={{ color: job.statusColor }}>{job.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
                icon: DollarSign,
              },
              {
                title: "You don't know if a job is profitable until it's done",
                fix: 'Per-job P&L with budget vs. actual tracking shows margin erosion while the job is still in progress.',
                icon: TrendingDown,
              },
              {
                title: 'Month-end close takes weeks, not days',
                fix: 'Automated WIP schedules and pre-built reports cut close time from weeks to 2–3 days.',
                icon: Clock,
              },
            ].map((pain, idx) => {
              const PainIcon = pain.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-6 hover:border-[#6366f1]/50 transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#f87171]/10 border border-[#f87171]/30 flex items-center justify-center mb-4">
                    <PainIcon size={20} className="text-[#f87171]" />
                  </div>
                  <p className="text-[#f87171] font-semibold mb-3">{pain.title}</p>
                  <div className="flex items-start gap-2">
                    <Check size={14} className="text-[#22c55e] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#4ade80]">{pain.fix}</p>
                  </div>
                </div>
              );
            })}
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
              { label: 'Annual Cost', builder: '$3,588–$8,388', cfo: '$120,000–$200,000+', cfoRed: true },
              { label: 'Setup Time', builder: '15 minutes', cfo: '2–3 months', cfoRed: true },
              { label: 'Real-Time Data', builder: 'Yes — auto-synced', cfo: 'Monthly reports', cfoRed: true },
              { label: 'Construction Specific', builder: 'Job costing, WIP, retainage', cfo: 'Depends on hire', cfoRed: false },
              { label: 'Integrations', builder: '7+ tools built in', cfo: 'Manual data entry', cfoRed: true },
              { label: 'AI Analysis', builder: 'Included', cfo: 'Not available', cfoRed: true },
              { label: 'Contract Required', builder: 'No — cancel anytime', cfo: 'Employment contract', cfoRed: true },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 text-center">
                <div className="p-2 sm:p-3 border-b border-r border-[#1e1e2e] text-xs sm:text-sm text-[#e8e8f0] text-left pl-3 sm:pl-6 font-medium">{row.label}</div>
                <div className="p-2 sm:p-3 border-b border-r border-[#1e1e2e] text-xs sm:text-sm font-semibold text-[#4ade80] bg-[#22c55e]/5">{row.builder}</div>
                <div className={`p-2 sm:p-3 border-b border-[#1e1e2e] text-xs sm:text-sm ${row.cfoRed ? 'text-[#f87171] font-medium' : 'text-[#8888a0]'}`}>{row.cfo}</div>
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
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            Construction Dashboard Pricing Plans
          </h2>
          <p className="text-center text-[#b0b0c8] mb-4 text-lg">
            14 days free on every plan. Credit card required to start trial.
          </p>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6366f1]/15 to-[#a78bfa]/15 border border-[#6366f1]/40 rounded-full px-4 py-1.5 text-sm text-[#c7d2fe]">
              <span className="text-lg">🎁</span>
              Refer 2 friends at checkout → <span className="font-semibold text-white">20% off your plan</span> + 20% off theirs
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Starter Tier */}
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-7 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">
                Starter
              </h3>
              <p className="text-sm text-[#b0b0c8] mb-5">For solo contractors and small crews getting financial visibility</p>
              <div className="mb-5">
                <span className="text-4xl font-bold text-white">$199</span>
                <span className="text-[#b0b0c8] ml-1 text-sm">/month</span>
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
                {[
                  'Real-time financial dashboard',
                  'Job costing & WIP tracking',
                  'Cash flow forecasting (30/60/90 day)',
                  'QuickBooks Online sync',
                  'Monthly AI CFO brief',
                  'Email support',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check size={16} className="text-[#6366f1] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#d0d0e0]">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => openReferral('basic', 'Starter')}
                className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-[#2a2a3d] hover:bg-[#3a3a4d] transition text-center block"
              >
                Start Free Trial
              </button>
              <Link href="#schedule" className="block text-center text-xs text-[#6366f1] hover:text-[#818cf8] mt-2">
                or Book a Demo →
              </Link>
            </div>

            {/* Professional Tier */}
            <div className="bg-gradient-to-br from-[#6366f1]/10 to-transparent border-2 border-[#6366f1]/60 rounded-xl p-7 relative flex flex-col shadow-lg shadow-[#6366f1]/10">
              <div className="absolute -top-3 left-6 bg-[#6366f1] text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide">
                MOST POPULAR
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
              <p className="text-sm text-[#b0b0c8] mb-5">For growing construction companies with $1M–$10M revenue</p>
              <div className="mb-5">
                <span className="text-4xl font-bold text-white">$299</span>
                <span className="text-[#b0b0c8] ml-1 text-sm">/month</span>
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
                {[
                  'Everything in Starter',
                  'Buildertrend + HubSpot + JobNimbus integrations',
                  'Sales pipeline dashboard',
                  'AI-powered CFO advisor',
                  'AR/AP aging reports by job',
                  'Direct access to the developer for suggestions, features & bug fixes',
                  'Priority support',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check size={16} className="text-[#6366f1] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#d0d0e0]">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => openReferral('pro', 'Professional')}
                className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition text-center block"
              >
                Start Free Trial
              </button>
              <Link href="#schedule" className="block text-center text-xs text-[#6366f1] hover:text-[#818cf8] mt-2">
                or Book a Demo →
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-7 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-sm text-[#b0b0c8] mb-5">For scaling operations with $10M+ revenue and multiple project managers</p>
              <div className="mb-5">
                <span className="text-4xl font-bold text-white">$399</span>
                <span className="text-[#b0b0c8] ml-1 text-sm">/month</span>
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
                {[
                  'Everything in Professional',
                  'Procore + Salesforce + ServiceTitan integrations',
                  'All 7+ integrations included',
                  'Crew utilization tracking',
                  'Quarterly strategy call with Salisbury Bookkeeping',
                  'Dedicated account manager',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check size={16} className="text-[#6366f1] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#d0d0e0]">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => openReferral('enterprise', 'Enterprise')}
                className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-[#2a2a3d] hover:bg-[#3a3a4d] transition text-center block"
              >
                Start Free Trial
              </button>
              <Link href="#schedule" className="block text-center text-xs text-[#6366f1] hover:text-[#818cf8] mt-2">
                or Book a Demo →
              </Link>
            </div>

            {/* White Glove Tier */}
            <div className="bg-gradient-to-br from-[#a78bfa]/15 via-[#6366f1]/10 to-transparent border-2 border-[#a78bfa]/60 rounded-xl p-7 relative flex flex-col shadow-xl shadow-[#a78bfa]/10">
              <div className="absolute -top-3 left-6 bg-gradient-to-r from-[#a78bfa] to-[#6366f1] text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide inline-flex items-center gap-1">
                <Crown size={12} /> WHITE GLOVE
              </div>

              <h3 className="text-xl font-bold text-white mb-2">White Glove</h3>
              <p className="text-sm text-[#b0b0c8] mb-5">Done-for-you fractional controller for $10M+ builders who want zero lift</p>
              <div className="mb-5">
                <span className="text-4xl font-bold text-white">$1,499</span>
                <span className="text-[#b0b0c8] ml-1 text-sm">/month</span>
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
                {[
                  'Everything in Enterprise',
                  'Dedicated fractional controller',
                  'Weekly strategy & cash flow call',
                  'Monthly CFO-level financial review',
                  'Custom KPI reports & board packages',
                  'Priority integration setup (white-glove)',
                  'Direct Slack line to your controller',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check size={16} className="text-[#a78bfa] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#d0d0e0]">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setWhiteGloveOpen(true)}
                className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#a78bfa] to-[#6366f1] hover:opacity-90 transition text-center block"
              >
                Talk to Our Team
              </button>
              <button
                type="button"
                onClick={() => setWhiteGloveOpen(true)}
                className="block w-full text-center text-xs text-[#a5b4fc] hover:text-[#c4b5fd] mt-2"
              >
                or Book a 15-Min Intro Call →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Modal (Starter / Pro / Enterprise) */}
      <ReferralModal
        isOpen={referralOpen}
        onClose={() => setReferralOpen(false)}
        plan={referralPlan.plan}
        planName={referralPlan.planName}
      />

      {/* White Glove Booking Modal */}
      <WhiteGloveBookingModal
        isOpen={whiteGloveOpen}
        onClose={() => setWhiteGloveOpen(false)}
      />

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
                BuilderCFO starts at $199/month (Starter), $299/month (Professional), $399/month (Enterprise), or $1,499/month (White Glove — done-for-you fractional controller). A full-time construction CFO typically costs $120,000–$200,000+ per year in salary and benefits. BuilderCFO self-serve plans run $2,388–$4,788 per year — roughly 2–4% the cost of a dedicated hire. White Glove delivers a dedicated fractional controller with weekly strategy calls for a fraction of a full-time CFO. Every plan includes a 14-day free trial (credit card required), and if you refer 2 friends at checkout you get 20% off your subscription (and so do they). Professional plans and above include direct access to the developer for feature suggestions and quick bug fixes.
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
                Yes. There are no long-term contracts, no cancellation fees, and no setup fees. You can cancel your subscription at any time and retain access through the end of your current billing cycle. Every plan starts with a 14-day free trial — a credit card is required to start the trial, but you won&apos;t be charged until the trial ends.
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
            <button
              onClick={() => openReferral('pro', 'Professional')}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition shadow-lg shadow-[#6366f1]/25"
            >
              Start 14-Day Free Trial <ChevronRight size={18} />
            </button>
            <Link
              href="#schedule"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-[#6366f1] border border-[#6366f1] hover:bg-[#6366f1]/10 transition"
            >
              Book a Demo →
            </Link>
          </div>
          <p className="text-sm text-[#8888a0] mt-4">
            14-day free trial. Cancel anytime. Built by{' '}
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
                    href="mailto:cory@salisburybookkeeping.com"
                    className="text-[#e8e8f0] hover:text-[#6366f1]"
                  >
                    cory@salisburybookkeeping.com
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
          <span className="font-semibold text-[#e8e8f0]">14 days free</span> — cancel anytime
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
