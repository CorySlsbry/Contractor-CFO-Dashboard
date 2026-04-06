'use client';

import Link from 'next/link';
import { ChevronRight, Check, HardHat, DollarSign, TrendingUp, FileText, BarChart3 } from 'lucide-react';

const painPoints = [
  { icon: DollarSign, title: 'Subcontractor Cost Overruns', desc: 'When sub invoices come in higher than bids and you don\'t catch it until month-end close, the job margin is already gone.' },
  { icon: TrendingUp, title: 'Multi-Job Cash Flow Gaps', desc: 'Running 5–15 jobs at once means draw timing, retainage, and AP overlap. One delayed payment can cascade across your whole operation.' },
  { icon: FileText, title: 'Inaccurate WIP Reports', desc: 'Your CPA asks for WIP every quarter, but your field progress and QuickBooks numbers never match — so the WIP is always a guess.' },
  { icon: BarChart3, title: 'Retainage Across Dozens of Jobs', desc: 'You have $200K+ in retainage spread across 12 jobs. Without per-job tracking, you can\'t forecast when that cash comes back.' },
];

const features = [
  'Multi-job dashboard — see all active projects in one view',
  'Subcontractor cost tracking: budget vs. actual per trade',
  'Automated WIP schedules synced from QBO + field tools',
  'Retainage tracking and release forecasting per job',
  'Cash flow forecast across all active projects (30/60/90 day)',
  'AR/AP aging by job with draw schedule alignment',
  'QuickBooks Online + Procore / Buildertrend sync',
  'AI CFO advisor that flags at-risk jobs and margin slippage',
];

export default function GeneralContractorsPage() {
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
            <HardHat size={14} className="text-[#6366f1]" />
            <span className="text-xs font-medium text-[#a5b4fc]">Built for General Contractors</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Financial Dashboard for{' '}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#a78bfa] bg-clip-text text-transparent">
              General Contractors
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#b0b0c8] mb-4 max-w-2xl leading-relaxed">
            BuilderCFO gives GCs real-time visibility across every active job — sub costs, WIP, retainage, AR/AP aging, and cash flow forecasts — synced from QuickBooks and your field management tools. Manage 5 jobs or 50. Know your margins in real time.
          </p>
          <p className="text-sm text-[#8888a0] mb-8 max-w-2xl">
            Built by Salisbury Bookkeeping, a fractional controller firm serving general contractors nationwide. 14-day free trial — no credit card required.
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
            Financial Blind Spots That Cost GCs Money
          </h2>
          <p className="text-center text-[#b0b0c8] mb-12 max-w-2xl mx-auto">
            General contractors juggle dozens of subs, multiple active jobs, and draw schedules that never sync with reality. BuilderCFO surfaces the problems before they become losses.
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
            What BuilderCFO Does for General Contractors
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-center">What GC Owners Say</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6">
              <p className="text-[#b0b0c8] italic mb-4">&quot;We were bleeding money on two jobs and had no idea. This dashboard caught it in the first week.&quot;</p>
              <p className="text-[#e8e8f0] font-semibold">Mike J.</p>
              <p className="text-[#8888a0] text-sm">GC Owner — Austin, TX</p>
            </div>
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6">
              <p className="text-[#b0b0c8] italic mb-4">&quot;Running 12 jobs with 40+ subs, I couldn\'t see the full picture until month-end. Now I check the dashboard every Monday morning and know exactly where we stand.&quot;</p>
              <p className="text-[#e8e8f0] font-semibold">Carlos D.</p>
              <p className="text-[#8888a0] text-sm">GC Owner — Houston, TX</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/5 via-transparent to-[#a78bfa]/5 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">See Every Job. Know Every Margin.</h2>
          <p className="text-lg text-[#b0b0c8] mb-8">Join GCs nationwide who use BuilderCFO to track sub costs, forecast cash flow, and protect margins on every project.</p>
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
