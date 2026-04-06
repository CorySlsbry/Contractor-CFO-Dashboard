'use client';

import Link from 'next/link';
import { ChevronRight, Check, Zap, DollarSign, TrendingUp, FileText, BarChart3 } from 'lucide-react';

const painPoints = [
  { icon: DollarSign, title: 'Material Price Volatility', desc: 'Copper and electrical supply prices fluctuate weekly. A bid from 30 days ago may already be underwater by the time you start the job.' },
  { icon: TrendingUp, title: 'T&M vs. Fixed-Price Confusion', desc: 'Running both T&M service calls and fixed-price contract work in the same QuickBooks file makes it impossible to see real job margins.' },
  { icon: FileText, title: 'Prevailing Wage Tracking', desc: 'Government and commercial jobs require certified payroll. If labor costs aren\'t split correctly, you\'re either overbilling or eating the difference.' },
  { icon: BarChart3, title: 'Cash Tied Up in Retainage', desc: 'On commercial work, 5–10% retainage on every progress bill means hundreds of thousands sitting idle. You need to forecast when it releases.' },
];

const features = [
  'Job-level P&L for T&M and fixed-price contracts',
  'Material cost tracking: budget vs. actual per job',
  'Automated WIP schedules for commercial projects',
  'Retainage tracking with release date forecasting',
  'Cash flow forecast across all active jobs (30/60/90 day)',
  'AR/AP aging by project and by customer',
  'QuickBooks Online + ServiceTitan sync',
  'AI CFO advisor that flags margin erosion on active jobs',
];

export default function ElectricalContractorsPage() {
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
            <Zap size={14} className="text-[#6366f1]" />
            <span className="text-xs font-medium text-[#a5b4fc]">Built for Electrical Contractors</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Financial Dashboard for{' '}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#a78bfa] bg-clip-text text-transparent">
              Electrical Contractors
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#b0b0c8] mb-4 max-w-2xl leading-relaxed">
            BuilderCFO gives electrical contractors real-time visibility into job profitability across T&M and fixed-price work — with material cost tracking, WIP schedules, and cash flow forecasting synced from QuickBooks and ServiceTitan.
          </p>
          <p className="text-sm text-[#8888a0] mb-8 max-w-2xl">
            Built by Salisbury Bookkeeping, a fractional controller firm serving specialty trades nationwide. 14-day free trial — no credit card required.
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
            Financial Challenges Electrical Contractors Face
          </h2>
          <p className="text-center text-[#b0b0c8] mb-12 max-w-2xl mx-auto">
            Between material price swings, mixed billing models, and commercial retainage, electrical contractors have unique financial blind spots. BuilderCFO makes them visible.
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
            What BuilderCFO Does for Electrical Contractors
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-center">What Electrical Contractors Say</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6">
              <p className="text-[#b0b0c8] italic mb-4">&quot;We run 30+ jobs — half T&M, half fixed-price. Before BuilderCFO, I had no idea which type was actually more profitable. Turns out our T&M work was carrying the company.&quot;</p>
              <p className="text-[#e8e8f0] font-semibold">Robert K.</p>
              <p className="text-[#8888a0] text-sm">Electrical Contractor — Charlotte, NC</p>
            </div>
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6">
              <p className="text-[#b0b0c8] italic mb-4">&quot;Copper prices jumped 18% mid-project. The dashboard showed the margin impact in real time — we filed a change order before it was too late.&quot;</p>
              <p className="text-[#e8e8f0] font-semibold">Lisa M.</p>
              <p className="text-[#8888a0] text-sm">Electrical Contractor — Tampa, FL</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/5 via-transparent to-[#a78bfa]/5 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Know Your Margins on Every Job</h2>
          <p className="text-lg text-[#b0b0c8] mb-8">BuilderCFO gives electrical contractors the financial visibility to price smarter, collect faster, and protect every dollar of margin.</p>
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
