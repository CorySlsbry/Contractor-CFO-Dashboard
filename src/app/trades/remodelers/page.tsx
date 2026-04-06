'use client';

import Link from 'next/link';
import { ChevronRight, Check, Paintbrush, DollarSign, TrendingUp, FileText, BarChart3 } from 'lucide-react';

const painPoints = [
  { icon: DollarSign, title: 'Scope Creep Kills Margins', desc: 'Homeowners add "just one more thing" every week. Without real-time tracking, those extras add up to thousands in unrecovered costs.' },
  { icon: TrendingUp, title: 'Cash Flow Whiplash', desc: 'Remodeling jobs have unpredictable timelines — a 6-week kitchen turns into 10. Your cash flow plan breaks when the schedule slides.' },
  { icon: FileText, title: 'Job Costing Guesswork', desc: 'When you bid a bathroom at $45K and it costs $52K, you need to know why — was it labor, materials, or change orders? Most remodelers can\'t answer that.' },
  { icon: BarChart3, title: 'Seasonal Revenue Swings', desc: 'Leads dry up in winter and flood in spring. Without forecasting, you\'re either scrambling for cash or turning away work.' },
];

const features = [
  'Job-level P&L with change order impact tracking',
  'Scope creep alerts — budget vs. actual in real time',
  'Cash flow forecasting across all active remodels',
  'Material and labor cost tracking per job phase',
  'AR aging — see who owes what and when it\'s late',
  'Seasonal revenue pattern analysis',
  'QuickBooks Online + Buildertrend / JobNimbus sync',
  'AI CFO advisor with margin protection alerts',
];

export default function RemodelersPage() {
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
            <Paintbrush size={14} className="text-[#6366f1]" />
            <span className="text-xs font-medium text-[#a5b4fc]">Built for Remodelers</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Financial Dashboard for{' '}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#a78bfa] bg-clip-text text-transparent">
              Remodeling Contractors
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#b0b0c8] mb-4 max-w-2xl leading-relaxed">
            BuilderCFO shows remodeling contractors exactly where profits go — with real-time job costing, scope creep alerts, cash flow forecasts, and margin tracking synced from QuickBooks. No more finding out a job lost money after it&apos;s done.
          </p>
          <p className="text-sm text-[#8888a0] mb-8 max-w-2xl">
            Built by Salisbury Bookkeeping, a fractional controller firm serving remodelers nationwide. 14-day free trial — no credit card required.
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
            Why Remodelers Lose Money Without Realizing It
          </h2>
          <p className="text-center text-[#b0b0c8] mb-12 max-w-2xl mx-auto">
            Remodeling projects are unpredictable by nature. BuilderCFO turns that uncertainty into clarity with real-time financial tracking.
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
            What BuilderCFO Does for Remodelers
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-center">What Remodelers Say</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6">
              <p className="text-[#b0b0c8] italic mb-4">&quot;The cash flow forecast saved us from a payroll crunch. We moved a draw request up two weeks because of what we saw.&quot;</p>
              <p className="text-[#e8e8f0] font-semibold">Rachel T.</p>
              <p className="text-[#8888a0] text-sm">Remodeling Company Owner — Phoenix, AZ</p>
            </div>
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6">
              <p className="text-[#b0b0c8] italic mb-4">&quot;We had three kitchen remodels running simultaneously. BuilderCFO showed me one was 15% over budget at the halfway point — we caught it before it got worse.&quot;</p>
              <p className="text-[#e8e8f0] font-semibold">Derek P.</p>
              <p className="text-[#8888a0] text-sm">Remodeling Contractor — Minneapolis, MN</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/5 via-transparent to-[#a78bfa]/5 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Stop Finding Out a Job Lost Money After It&apos;s Done</h2>
          <p className="text-lg text-[#b0b0c8] mb-8">BuilderCFO gives remodelers the tools to see job margins in real time — so you can fix problems before they become losses.</p>
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
