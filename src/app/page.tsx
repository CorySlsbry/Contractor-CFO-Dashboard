'use client';

import Link from 'next/link';
import { ChevronRight, Zap, Eye, TrendingUp, Brain, Check, Plug, Shield, Clock } from 'lucide-react';
import { useState } from 'react';
import Head from 'next/head';
import { LandingTracker } from '@/components/landing-tracker';

type DemoTab = 'overview' | 'ar' | 'ap' | 'wip' | 'retainage' | 'sales';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'starter' | 'professional' | 'enterprise'>('professional');
  const [demoTab, setDemoTab] = useState<DemoTab>('overview');

  return (
    <div className="bg-[#0a0a0f] text-[#e8e8f0]">
      <LandingTracker />
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
              href="/login"
              className="text-sm sm:text-base text-[#e8e8f0] hover:text-[#6366f1] transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded bg-[#6366f1] text-white hover:bg-[#5558d9] transition"
            >
              Start Free Trial
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
            BuilderCFO is a real-time financial dashboard built specifically for construction companies. It syncs with QuickBooks Online and field management tools like Procore, Buildertrend, and ServiceTitan so contractors, CFOs, and controllers can visualize job costing, WIP schedules, cash flow forecasts, and AR/AP aging — all in one place, updated in real time.
          </p>
          <p className="text-base text-[#8888a0] mb-8 max-w-2xl">
            Built by{' '}
            <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#6366f1] hover:text-[#818cf8] transition">
              Salisbury Bookkeeping
            </a>
            , a fractional controller firm serving construction companies nationwide. Plans start at $299/month with a 14-day free trial.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/signup"
              className="px-8 py-3 rounded font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition inline-flex items-center justify-center gap-2"
            >
              Start 14-Day Free Trial <ChevronRight size={18} />
            </Link>
            <a
              href="#live-demo"
              className="px-8 py-3 rounded font-semibold text-[#6366f1] border border-[#6366f1] hover:bg-[#6366f1]/10 transition inline-flex items-center justify-center"
            >
              See It In Action
            </a>
          </div>

          {/* Interactive Dashboard Demo */}
          <div id="live-demo" className="bg-gradient-to-b from-[#12121a] to-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-4 sm:p-6 shadow-2xl overflow-hidden scroll-mt-24">
            {/* Interactive Tab bar */}
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
                {/* AI Brief */}
                <div className="p-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3d] mb-3">
                  <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-semibold text-[#a5b4fc] uppercase tracking-wider">AI Brief</span></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#22c55e]">▲</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#22c55e]">Win:</span> Net cash up 26.1% — strong collections building a healthy runway</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> AR growing faster than revenue — collections lagging billings</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> $82.4K WIP over-billing exposes cash risk at job close</p></div>
                  </div>
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

                  {/* Cash Flow */}
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

                {/* WIP Summary */}
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
                {/* AI Brief */}
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
                  { job: 'Mountain View Remodel', customer: 'Jennifer Pratt', total: '$50,500', pastDue: '$18,500', items: [
                    { inv: 'INV-2024-147', amount: '$18,500', due: '2024-01-10', days: 36, status: 'Past Due' },
                    { inv: 'INV-2024-151', amount: '$32,000', due: '2024-02-28', days: 0, status: 'Current' },
                  ]},
                ].map((group) => (
                  <div key={group.job} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-[#e8e8f0]">{group.job}</div>
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
                {/* AI Brief */}
                <div className="p-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3d]">
                  <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-semibold text-[#a5b4fc] uppercase tracking-wider">AI Brief</span></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#22c55e]">▲</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#22c55e]">Win:</span> AP down 8.2% — paying vendors on time without overextending</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> Rocky Mtn Concrete $35K, 41 days late — lien risk on Riverside</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> Valley HVAC $45.3K — verify held for punch list, not missed</p></div>
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
                  { job: 'Cedar Heights Addition', total: '$37,500', pastDue: '$22,000', items: [
                    { vendor: 'Apex Roofing', bill: 'BILL-4488', amount: '$22,000', days: 38, status: 'Past Due' },
                    { vendor: 'Quality Drywall Inc', bill: 'BILL-4550', amount: '$15,500', days: 0, status: 'Current' },
                  ]},
                ].map((group) => (
                  <div key={group.job} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs sm:text-sm font-semibold text-[#e8e8f0]">{group.job}</div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-[#e8e8f0]">{group.total}</div>
                        {group.pastDue !== '$0' && <div className="text-[10px] text-[#ef4444]">{group.pastDue} past due</div>}
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
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
                {/* AI Brief */}
                <div className="p-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3d]">
                  <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-semibold text-[#a5b4fc] uppercase tracking-wider">AI Brief</span></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#22c55e]">▲</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#22c55e]">Win:</span> Net retainage $171K in your favor — protecting cash flow</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> $68.1K overdue for release across 3 jobs — file requests now</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> 2 retainage release dates approaching — schedule walk-throughs</p></div>
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
                      <th className="text-right py-1 text-[#8888a0]">Receivable</th>
                      <th className="text-right py-1 text-[#8888a0]">Payable</th>
                      <th className="text-right py-1 text-[#8888a0]">Net</th>
                      <th className="text-right py-1 text-[#8888a0]">Status</th>
                    </tr></thead>
                    <tbody>
                      {[
                        { job: 'Lakeside Office Park', recv: '$28,500', pay: '$15,600', net: '$12,900', status: 'Overdue', statusColor: 'bg-[#ef4444]/15 text-[#ef4444]' },
                        { job: 'Westfield Community Center', recv: '$31,200', pay: '$18,900', net: '$12,300', status: 'Overdue', statusColor: 'bg-[#ef4444]/15 text-[#ef4444]' },
                        { job: 'Mountain View Remodel', recv: '$12,550', pay: '$7,400', net: '$5,150', status: 'Due Soon', statusColor: 'bg-[#eab308]/15 text-[#eab308]' },
                        { job: 'Riverside Estate Custom Home', recv: '$71,000', pay: '$38,200', net: '$32,800', status: 'Held', statusColor: 'bg-[#8888a0]/15 text-[#c8c8d8]' },
                        { job: 'Oakwood Duplex', recv: '$35,200', pay: '$18,500', net: '$16,700', status: 'Ready', statusColor: 'bg-[#22c55e]/15 text-[#22c55e]' },
                        { job: 'Pinnacle Tower Interiors', recv: '$65,200', pay: '$42,100', net: '$23,100', status: 'Paid', statusColor: 'bg-[#6366f1]/15 text-[#a5b4fc]' },
                      ].map((r) => (
                        <tr key={r.job} className={`border-b border-[#2a2a3d]/30 ${r.status === 'Overdue' ? 'bg-[#ef4444]/5' : ''}`}>
                          <td className="py-1.5 font-medium">{r.job}</td>
                          <td className="py-1.5 text-right text-[#22c55e] font-semibold">{r.recv}</td>
                          <td className="py-1.5 text-right text-[#ef9d44] font-semibold">{r.pay}</td>
                          <td className="py-1.5 text-right text-[#6366f1] font-semibold">{r.net}</td>
                          <td className="py-1.5 text-right"><span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${r.statusColor}`}>{r.status}</span></td>
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
                {/* AI Brief */}
                <div className="p-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3d]">
                  <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-semibold text-[#a5b4fc] uppercase tracking-wider">AI Brief</span></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#22c55e]">▲</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#22c55e]">Win:</span> Team at 73% quota with $10.6M pipeline — on track to close strong</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> Westfield $1.25M at 35% probability — needs strategy session</p></div>
                    <div className="flex items-start gap-1.5"><span className="text-[10px] text-[#eab308]">▼</span><p className="text-[10px] sm:text-xs text-[#c8c8d8]"><span className="font-medium text-[#eab308]">Watch:</span> Pipeline top-heavy in proposals — focus on moving to negotiation</p></div>
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

                {/* Sales Pipeline Funnel */}
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

                {/* Top Deals */}
                <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-3 overflow-x-auto">
                  <div className="text-xs font-semibold text-[#e8e8f0] mb-2">Active Deals</div>
                  <table className="w-full text-[10px] sm:text-xs">
                    <thead><tr className="border-b border-[#2a2a3d]">
                      <th className="text-left py-1 text-[#8888a0]">Project</th>
                      <th className="text-right py-1 text-[#8888a0]">Value</th>
                      <th className="text-center py-1 text-[#8888a0]">Prob</th>
                      <th className="text-right py-1 text-[#8888a0]">Stage</th>
                    </tr></thead>
                    <tbody>
                      {[
                        { name: 'Silverstone Commercial', value: '$620K', prob: 85, stage: 'Negotiation', stageColor: 'bg-[#eab308]/15 text-[#eab308]' },
                        { name: 'Meadow Creek Townhomes', value: '$890K', prob: 60, stage: 'Proposal', stageColor: 'bg-[#6366f1]/15 text-[#a5b4fc]' },
                        { name: 'Summit Ridge Custom', value: '$445K', prob: 90, stage: 'Negotiation', stageColor: 'bg-[#eab308]/15 text-[#eab308]' },
                        { name: 'Lakewood Kitchen & Bath', value: '$78K', prob: 95, stage: 'Won', stageColor: 'bg-[#22c55e]/15 text-[#22c55e]' },
                      ].map((d) => (
                        <tr key={d.name} className="border-b border-[#2a2a3d]/30">
                          <td className="py-1.5 font-medium">{d.name}</td>
                          <td className="py-1.5 text-right font-semibold">{d.value}</td>
                          <td className="py-1.5 text-center">
                            <div className="flex items-center gap-1 justify-center">
                              <div className="w-10 h-1 bg-[#2a2a3d] rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${d.prob >= 80 ? 'bg-[#22c55e]' : d.prob >= 50 ? 'bg-[#eab308]' : 'bg-[#ef9d44]'}`} style={{ width: `${d.prob}%` }} />
                              </div>
                              <span>{d.prob}%</span>
                            </div>
                          </td>
                          <td className="py-1.5 text-right"><span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${d.stageColor}`}>{d.stage}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CTA under demo */}
            <div className="mt-4 pt-3 border-t border-[#2a2a3d] text-center">
              <p className="text-[10px] sm:text-xs text-[#8888a0]">
                This is sample data. <Link href="/signup" className="text-[#6366f1] hover:text-[#818cf8] font-medium transition">Start your free trial</Link> to see your real numbers.
              </p>
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
                title: 'AI-Powered Financial Analysis',
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

      {/* Who Is BuilderCFO For? — Audience Block */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e8e8f0] mb-4 text-center">
            Built for the People Who Build
          </h2>
          <p className="text-center text-[#b0b0c8] mb-12 max-w-2xl mx-auto">
            Whether you&apos;re running jobs in the field, managing the books, or advising on financial strategy — BuilderCFO gives you the real-time visibility you need to make better decisions.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                role: 'Contractors & Builders',
                desc: 'See job profitability, cash flow, and WIP status across every active project — updated in real time. Know exactly where your money is on every job, every day, so you can make decisions faster.',
                items: ['General contractors', 'Custom home builders', 'Remodelers & renovators', 'Commercial contractors'],
                icon: '🏗️',
                border: '#6366f1',
              },
              {
                role: 'Specialty Trades',
                desc: 'Track retainage owed to you, manage sub payments, and see AR aging by project. Purpose-built for how trade contractors actually get paid — progress billing, retainage, and change orders.',
                items: ['Electricians & plumbers', 'HVAC contractors', 'Concrete & framing', 'Roofing & drywall'],
                icon: '⚡',
                border: '#22c55e',
              },
              {
                role: 'CFOs & Controllers',
                desc: 'Automate the WIP schedules, job cost reports, and cash flow forecasts you&apos;re already building manually. Spend less time pulling data and more time advising your clients or leadership team.',
                items: ['Fractional CFOs', 'Construction controllers', 'Accounting firms', 'Bookkeeping teams'],
                icon: '📊',
                border: '#eab308',
              },
            ].map((persona, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border rounded-xl p-6 sm:p-8 hover:shadow-lg transition"
                style={{ borderColor: persona.border + '40' }}
              >
                <div className="text-4xl mb-4">{persona.icon}</div>
                <h3 className="text-xl font-bold text-[#e8e8f0] mb-3">{persona.role}</h3>
                <p className="text-[#b0b0c8] text-sm mb-4 leading-relaxed">{persona.desc}</p>
                <div className="space-y-1.5">
                  {persona.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: persona.border }} />
                      <span className="text-sm text-[#8888a0]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-[#8888a0] mt-8 text-sm">
            Need hands-on bookkeeping or fractional controller support alongside the dashboard?{' '}
            <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#6366f1] hover:text-[#818cf8] transition">
              Salisbury Bookkeeping
            </a>{' '}
            works with construction companies nationwide.
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
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
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
            14-day free trial on every plan. Enter a card to start — you won&apos;t be charged until day 15.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter Tier */}
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-8 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">
                Starter
              </h3>
              <p className="text-[#b0b0c8] mb-6">For solo contractors and small crews getting financial visibility</p>
              <div className="mb-6">
                <span className="text-4xl sm:text-5xl font-bold text-white">$299</span>
                <span className="text-[#b0b0c8] ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Real-time financial dashboard',
                  'Job costing & WIP tracking',
                  'Cash flow forecasting (30/60/90 day)',
                  'QuickBooks Online sync',
                  'AI Bookkeeper Toolkit included',
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
            </div>

            {/* Professional Tier */}
            <div className="bg-gradient-to-br from-[#6366f1]/10 to-transparent border-2 border-[#6366f1]/60 rounded-xl p-8 relative flex flex-col shadow-lg shadow-[#6366f1]/10">
              <div className="absolute -top-3 left-6 bg-[#6366f1] text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide">
                MOST POPULAR
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <p className="text-[#b0b0c8] mb-6">For growing construction companies with $1M–$10M revenue</p>
              <div className="mb-6">
                <span className="text-4xl sm:text-5xl font-bold text-white">$499</span>
                <span className="text-[#b0b0c8] ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Everything in Starter',
                  'Buildertrend + HubSpot + JobNimbus integrations',
                  'Sales pipeline dashboard',
                  'AI Bookkeeper Toolkit included',
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
            </div>

            {/* Enterprise Tier */}
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-8 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-[#b0b0c8] mb-6">For scaling operations with $10M+ revenue and multiple project managers</p>
              <div className="mb-6">
                <span className="text-4xl sm:text-5xl font-bold text-white">$699</span>
                <span className="text-[#b0b0c8] ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Everything in Professional',
                  'Procore + Salesforce + ServiceTitan integrations',
                  'All 7+ integrations included',
                  'Advanced AI Bookkeeper features',
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
                BuilderCFO is a real-time financial dashboard built specifically for construction contractors, custom home builders, and remodelers. It connects to QuickBooks Online and field management tools like Procore, Buildertrend, and ServiceTitan to provide instant visibility into job costing, WIP schedules, cash flow forecasts, and AR/AP aging. Whether you&apos;re the owner, a fractional CFO, or a controller — BuilderCFO gives you real-time financial visibility to make faster, more confident decisions.
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
              <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">How much does BuilderCFO cost?</h3>
              <p className="text-[#b0b0c8]">
                BuilderCFO starts at $299/month (Starter), $499/month (Professional), or $699/month (Enterprise). Every plan includes a 14-day free trial — you enter a card upfront but are not charged until day 15. Whether you&apos;re a contractor tracking your own numbers, a specialty trade managing retainage, or a CFO overseeing multiple clients, BuilderCFO provides real-time dashboards, automated WIP schedules, and AI analysis so you can spend less time pulling data and more time acting on it.
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
                Yes. There are no long-term contracts, no cancellation fees, and no setup fees. You can cancel your subscription at any time and retain access through the end of your current billing cycle. Every plan starts with a 14-day free trial — you enter a card upfront but are not charged until day 15.
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
            Join contractors, CFOs, and controllers nationwide who use BuilderCFO to visualize job costs, forecast cash flow, and make smarter financial decisions — starting with a free 14-day trial.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3 rounded font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition"
          >
            Start 14-Day Free Trial <ChevronRight size={18} />
          </Link>
          <p className="text-sm text-[#8888a0] mt-4">
            No charge for 14 days. Cancel anytime. Built by{' '}
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
              © 2025 BuilderCFO. All rights reserved.
            </div>
            <div className="text-sm text-[#8888a0] mt-4 md:mt-0">
              Built by <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="text-[#6366f1] hover:text-[#818cf8] transition">Salisbury Bookkeeping</a> — Fractional Controllers for Construction Companies
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
