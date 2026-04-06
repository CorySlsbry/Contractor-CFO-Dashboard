'use client';

import Link from 'next/link';
import { ChevronRight, Check, Building2, DollarSign, TrendingUp, FileText, BarChart3 } from 'lucide-react';

const painPoints = [
  { icon: DollarSign, title: 'Carrying Cost Blindness', desc: 'Every month a spec home sits unsold, you\'re burning interest, insurance, HOA, and utilities. Most builders don\'t track true carrying cost per unit.' },
  { icon: TrendingUp, title: 'Multi-Lot Cash Flow Complexity', desc: 'When you have 4 specs in different stages — one in framing, one in drywall, one listed, one closing — your cash flow model needs to span all of them simultaneously.' },
  { icon: FileText, title: 'Margin Erosion by Phase', desc: 'Your lumber package came in $18K over budget but you won\'t know until the house is framed. By then it\'s too late to adjust the sales price.' },
  { icon: BarChart3, title: 'Construction Loan Draw Timing', desc: 'Banks fund draws based on completion milestones, but your expenses don\'t wait. Misalignment between draws and payables creates cash crunches.' },
];

const features = [
  'Per-unit P&L for every spec home in your portfolio',
  'Carrying cost tracking: interest, insurance, HOA, utilities per unit',
  'Construction loan draw alignment — expenses vs. funded draws',
  'Phase-level cost tracking: foundation, frame, rough-in, finish',
  'Cash flow forecast across all active specs (30/60/90 day)',
  'Break-even and margin analysis per lot',
  'QuickBooks Online sync with lot-level job costing',
  'AI CFO advisor that flags lots with eroding margins',
];

export default function SpecBuildersPage() {
  return (
    <div className="bg-[#0a0a0f] text-[#e8e8f0] min-h-screen">
      <nav className="fixed top-0 w-full bg-[#0a0a0f]/80 backdrop-blur border-b border-[#1e1e2e] z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-lg tracking-tight">
            <span className="text-[#6366f1]">Builder</span><span className="text-[#e8e8f0]">CFO</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/demo" className="text-sm text-[#e8e8f0] hover:text-[#6366f1] transition">Try Demo</Link>
            <Link href="/signup" className="text-sm px-4 py-2 rounded bg-[#6366f1] text-white hover:bg-[#5558d9] transition">Start Free</Link>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-12 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6366f1]/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-full px-4 py-1.5 mb-6">
            <Building2 size={14} className="text-[#6366f1]" />
            <span className="text-xs font-medium text-[#a5b4fc]">Built for Spec Builders</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Financial Dashboard for{' '}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#a78bfa] bg-clip-text text-transparent">
              Spec Home Builders
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#b0b0c8] mb-4 max-w-2xl leading-relaxed">
            BuilderCFO gives spec builders real-time visibility into per-lot profitability, carrying costs, construction loan draw alignment, and phase-level cost tracking — synced from QuickBooks Online. Know your margin on every lot before the house is listed.
          </p>
          <p className="text-sm text-[#8888a0] mb-8 max-w-2xl">
            Built by Salisbury Bookkeeping, a fractional controller firm serving home builders nationwide. 14-day free trial — no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Link href="/signup" className="px-8 py-3 rounded font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition inline-flex items-center justify-center gap-2">
              Start Free — No Card Required <ChevronRight size={18} />
            </Link>
            <Link href="/demo" className="px-8 py-3 rounded font-semibold text-[#6366f1] border border-[#6366f1] hover:bg-[#6366f1]/10 transition inline-flex items-center justify-center">
              See It In Action
            </Link>
          </div>
          <Link href="/#schedule" className="text-sm text-[#6366f1] hover:text-[#818cf8] transition">
            or Book a 15-Min Demo →
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            Financial Risks Spec Builders Can&apos;t Afford to Miss
          </h2>
          <p className="text-center text-[#b0b0c8] mb-12 max-w-2xl mx-auto">
            Spec building is capital-intensive. Every week a home sits unsold or every budget overrun erodes the margin you priced in at land acquisition. BuilderCFO keeps you ahead of it.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {painPoints.map((point, idx) => (
              <div key={idx} className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6">
                <point.icon size={24} className="text-[#6366f1] mb-3" />
                <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                <p className="text-[#b0b0c8] text-sm">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#12121a]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-center">
            What BuilderCFO Does for Spec Builders
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-4">
                <Check size={18} className="text-[#6366f1] flex-shrink-0 mt-0.5" />
                <span className="text-[#d0d0e0]">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-center">What Spec Builders Say</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6">
              <p className="text-[#b0b0c8] italic mb-4">&quot;I had 6 specs going at once and no idea which ones were profitable until closing. BuilderCFO shows me the per-lot margin in real time — I caught a framing overrun before it snowballed.&quot;</p>
              <p className="text-[#e8e8f0] font-semibold">Travis H.</p>
              <p className="text-[#8888a0] text-sm">Spec Builder — Raleigh, NC</p>
            </div>
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6">
              <p className="text-[#b0b0c8] italic mb-4">&quot;The carrying cost tracker changed everything. I realized a spec that sat listed for 4 months was costing $3,200/month in holding costs I wasn\'t factoring into my pricing.&quot;</p>
              <p className="text-[#e8e8f0] font-semibold">Andrea M.</p>
              <p className="text-[#8888a0] text-sm">Spec Builder — San Antonio, TX</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/5 via-transparent to-[#a78bfa]/5 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Know Your Per-Lot Margin Before You List</h2>
          <p className="text-lg text-[#b0b0c8] mb-8">BuilderCFO gives spec builders the financial clarity to build profitably — from land acquisition through closing day.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-3 rounded font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition">
              Start Free — No Card Required <ChevronRight size={18} />
            </Link>
            <Link href="/demo" className="inline-flex items-center gap-2 px-8 py-3 rounded font-semibold text-[#6366f1] border border-[#6366f1] hover:bg-[#6366f1]/10 transition">
              Try the Demo
            </Link>
          </div>
          <p className="text-sm text-[#8888a0] mt-4">14-day free trial. No credit card required. Cancel anytime.</p>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-[#12121a]/95 backdrop-blur border-t border-[#1e1e2e] p-3 flex items-center justify-between gap-3 z-50 sm:hidden">
        <div className="text-xs text-[#b0b0c8] leading-tight">
          <span className="font-semibold text-[#e8e8f0]">14 days free</span> — no card needed
        </div>
        <Link href="/signup" className="px-4 py-2 rounded text-xs font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition flex-shrink-0">
          Start Free
        </Link>
      </div>
    </div>
  );
}
