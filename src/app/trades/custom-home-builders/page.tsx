'use client';

import Link from 'next/link';
import { ChevronRight, Check, Home, DollarSign, TrendingUp, FileText, BarChart3, Shield } from 'lucide-react';

const painPoints = [
  { icon: DollarSign, title: 'Change Order Chaos', desc: 'Homeowner upgrades and allowance overages eat margins when they\'re not tracked in real time against the original budget.' },
  { icon: TrendingUp, title: 'Draw Schedule Gaps', desc: 'You\'re fronting material costs for weeks because draws don\'t align with when expenses actually hit. Cash flow suffers.' },
  { icon: FileText, title: 'WIP Schedule Blind Spots', desc: 'Your percentage-of-completion numbers are off because field progress and QuickBooks rarely agree.' },
  { icon: BarChart3, title: 'Retainage Trapped Cash', desc: '5–10% of every contract is sitting in retainage. Without tracking it per-job, you can\'t forecast when it\'s coming.' },
];

const features = [
  'Job-level P&L with change order tracking',
  'Automated WIP schedules (% complete vs. % billed)',
  'Draw schedule alignment — see gaps before they hit cash',
  'Retainage tracking per job with release forecasting',
  'Cash flow forecast: 30/60/90-day rolling view',
  'Allowance tracking — budget vs. actual per selection',
  'QuickBooks Online sync (read-only, AES-256 encrypted)',
  'AI CFO advisor that flags margin erosion and over-billing',
];

export default function CustomHomeBuildersPage() {
  return (
    <div className="bg-[#0a0a0f] text-[#e8e8f0] min-h-screen">
      {/* Nav */}
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

      {/* Hero */}
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6366f1]/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-full px-4 py-1.5 mb-6">
            <Home size={14} className="text-[#6366f1]" />
            <span className="text-xs font-medium text-[#a5b4fc]">Built for Custom Home Builders</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Financial Dashboard for{' '}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#a78bfa] bg-clip-text text-transparent">
              Custom Home Builders
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#b0b0c8] mb-4 max-w-2xl leading-relaxed">
            BuilderCFO gives custom home builders real-time visibility into job-level profitability, WIP schedules, draw alignment, and change order impact — synced directly from QuickBooks Online. Stop guessing on margins. Start seeing every dollar on every home.
          </p>
          <p className="text-sm text-[#8888a0] mb-8 max-w-2xl">
            Built by Salisbury Bookkeeping, a fractional controller firm that serves custom home builders nationwide. Plans start at $199/mo with a 14-day free trial — no credit card required.
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

      {/* Pain Points */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            The Financial Challenges Custom Home Builders Face
          </h2>
          <p className="text-center text-[#b0b0c8] mb-12 max-w-2xl mx-auto">
            Every custom home is unique — and so are its cost overruns. BuilderCFO catches these issues before they become profit leaks.
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

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#12121a]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-center">
            What BuilderCFO Does for Custom Home Builders
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

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-center">
            What Custom Home Builders Say
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6">
              <p className="text-[#b0b0c8] italic mb-4">&quot;We had a $2.4M custom home where allowance overages were eating the margin. BuilderCFO flagged it at 40% completion — we adjusted the draw schedule and saved the project.&quot;</p>
              <p className="text-[#e8e8f0] font-semibold">Jason W.</p>
              <p className="text-[#8888a0] text-sm">Custom Home Builder — Park City, UT</p>
            </div>
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6">
              <p className="text-[#b0b0c8] italic mb-4">&quot;I used to wait until a home was 90% done to find out my margins were off. Now I see it week by week. The WIP tracking alone is worth 10x the subscription.&quot;</p>
              <p className="text-[#e8e8f0] font-semibold">Megan S.</p>
              <p className="text-[#8888a0] text-sm">Custom Home Builder — Boise, ID</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/5 via-transparent to-[#a78bfa]/5 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Stop Guessing on Custom Home Margins
          </h2>
          <p className="text-lg text-[#b0b0c8] mb-8">
            BuilderCFO shows you exactly where every dollar goes on every home — from foundation to final walkthrough.
          </p>
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

      {/* Sticky Mobile CTA */}
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
