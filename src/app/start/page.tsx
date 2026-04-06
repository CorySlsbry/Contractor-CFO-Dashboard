'use client';

import Link from 'next/link';
import { ChevronRight, Check, Play } from 'lucide-react';

/**
 * /start — Shortened landing page for paid traffic (Google Ads, Facebook Ads).
 * Structure: Hero + Demo CTA + 3 Testimonials + Pricing + Final CTA.
 * No FAQ, no comparison table, no integration grid — cold traffic needs speed.
 */
export default function PaidTrafficPage() {
  return (
    <div className="bg-[#0a0a0f] text-[#e8e8f0] min-h-screen">
      {/* Nav — minimal */}
      <nav className="fixed top-0 w-full bg-[#0a0a0f]/80 backdrop-blur border-b border-[#1e1e2e] z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <Link href="/" className="font-bold text-lg tracking-tight">
            <span className="text-[#6366f1]">Builder</span><span className="text-[#e8e8f0]">CFO</span>
          </Link>
          <Link href="/signup" className="text-sm px-4 py-1.5 rounded bg-[#6366f1] text-white hover:bg-[#5558d9] transition">
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero — Straight to the point */}
      <section className="pt-20 pb-10 sm:pt-28 sm:pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6366f1]/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            See Where Every Dollar Goes{' '}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#a78bfa] bg-clip-text text-transparent">
              On Every Job
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#b0b0c8] mb-8 max-w-xl mx-auto">
            Real-time financial dashboard for contractors. Job costing, WIP, cash flow, and AR/AP — synced from QuickBooks in 2 minutes. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Link href="/signup" className="px-8 py-3 rounded font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition inline-flex items-center justify-center gap-2">
              Start Free — No Card Required <ChevronRight size={18} />
            </Link>
            <Link href="/demo" className="px-8 py-3 rounded font-semibold text-[#6366f1] border border-[#6366f1] hover:bg-[#6366f1]/10 transition inline-flex items-center justify-center gap-2">
              <Play size={16} /> Watch Demo
            </Link>
          </div>
          <p className="text-xs text-[#8888a0]">14-day free trial. Cancel anytime. Plans from $199/mo.</p>
        </div>
      </section>

      {/* Quick Value Props — 3 columns */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { stat: '2 min', label: 'Setup Time', sub: 'Connect QuickBooks and see data instantly' },
            { stat: '$199', label: '/month starting', sub: 'vs. $150K+ for a full-time CFO' },
            { stat: 'Real-time', label: 'Job Visibility', sub: 'WIP, margins, cash flow — always current' },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6">
              <div className="text-3xl font-bold text-[#6366f1] mb-1">{item.stat}</div>
              <div className="text-sm font-semibold text-[#e8e8f0] mb-1">{item.label}</div>
              <div className="text-xs text-[#8888a0]">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Testimonials */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#12121a]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-8 text-center">Trusted by Contractors Nationwide</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                quote: '"We were bleeding money on two jobs and had no idea. This dashboard caught it in the first week."',
                author: 'Mike J.', title: 'GC Owner — Austin, TX',
              },
              {
                quote: '"The cash flow forecast saved us from a payroll crunch. We moved a draw request up two weeks."',
                author: 'Rachel T.', title: 'Remodeler — Phoenix, AZ',
              },
              {
                quote: '"I can finally see retainage, AR aging, and job profitability in one place instead of digging through QuickBooks."',
                author: 'David C.', title: 'Custom Builder — Nashville, TN',
              },
            ].map((t, idx) => (
              <div key={idx} className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-5">
                <p className="text-[#b0b0c8] italic text-sm mb-3">{t.quote}</p>
                <p className="text-[#e8e8f0] font-semibold text-sm">{t.author}</p>
                <p className="text-[#8888a0] text-xs">{t.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compact Pricing */}
      <section className="py-12 px-4 sm:px-6 lg:px-8" id="pricing">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">Simple Pricing. No Surprises.</h2>
          <p className="text-center text-[#8888a0] mb-8 text-sm">Every plan includes a 14-day free trial. No credit card required.</p>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                name: 'Starter', price: '$199', features: ['Financial dashboard', 'Job costing & WIP', 'Cash flow forecasting', 'QuickBooks sync'],
                plan: 'basic', highlight: false,
              },
              {
                name: 'Professional', price: '$399', features: ['Everything in Starter', 'Buildertrend + HubSpot', 'AI CFO advisor', 'Priority support'],
                plan: 'pro', highlight: true,
              },
              {
                name: 'Enterprise', price: '$599', features: ['Everything in Pro', 'Procore + Salesforce', 'Quarterly strategy call', 'Dedicated manager'],
                plan: 'enterprise', highlight: false,
              },
            ].map((tier, idx) => (
              <div key={idx} className={`rounded-xl p-6 flex flex-col ${tier.highlight ? 'bg-gradient-to-br from-[#6366f1]/10 to-transparent border-2 border-[#6366f1]/60 relative' : 'bg-[#12121a] border border-[#2a2a3d]'}`}>
                {tier.highlight && (
                  <div className="absolute -top-2.5 left-4 bg-[#6366f1] text-white text-[10px] font-bold px-3 py-0.5 rounded-full">POPULAR</div>
                )}
                <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">{tier.price}</span>
                  <span className="text-sm text-[#8888a0]">/mo</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check size={14} className="text-[#6366f1] flex-shrink-0" />
                      <span className="text-[#d0d0e0]">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/signup?plan=${tier.plan}`}
                  className={`w-full py-2.5 rounded-lg font-semibold text-center block text-sm transition ${tier.highlight ? 'bg-[#6366f1] text-white hover:bg-[#5558d9]' : 'bg-[#2a2a3d] text-white hover:bg-[#3a3a4d]'}`}
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/5 via-transparent to-[#a78bfa]/5 pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Your Financials. Your Jobs. One Dashboard.
          </h2>
          <p className="text-[#b0b0c8] mb-6">
            Connect QuickBooks in 2 minutes. See every job&apos;s margin, cash position, and AR aging instantly.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-3 rounded font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition">
            Start Your Free Trial <ChevronRight size={18} />
          </Link>
          <p className="text-xs text-[#8888a0] mt-3">No credit card. No contracts. Cancel anytime.</p>
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
