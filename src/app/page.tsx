'use client';

import Link from 'next/link';
import { ChevronRight, Zap, Eye, TrendingUp, Brain, Check, Plug } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'starter' | 'professional' | 'enterprise'>('professional');

  return (
    <div className="bg-[#0a0a0f] text-[#e8e8f0]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0a0a0f]/80 backdrop-blur border-b border-[#1e1e2e] z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="text-sm font-semibold text-[#8888a0]">
            SALISBURY BOOKKEEPING
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-[#e8e8f0] hover:text-[#6366f1] transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded bg-[#6366f1] text-white hover:bg-[#5558d9] transition"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#6366f1]/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          <h1 className="text-5xl sm:text-6xl font-bold text-[#e8e8f0] mb-6 leading-tight">
            Your Construction Company's{' '}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#a78bfa] bg-clip-text text-transparent">
              Financial Command Center
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#b0b0c8] mb-8 max-w-2xl leading-relaxed">
            Real-time dashboards that turn your QuickBooks data into actionable
            insights. Know exactly where every dollar goes on every job —
            without hiring a $150K CFO.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/signup"
              className="px-8 py-3 rounded font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition inline-flex items-center justify-center gap-2"
            >
              Start Free Trial <ChevronRight size={18} />
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 rounded font-semibold text-[#6366f1] border border-[#6366f1] hover:bg-[#6366f1]/10 transition inline-flex items-center justify-center"
            >
              See It In Action
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

              {/* Cash Flow Chart Mock */}
              <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-4">
                <div className="text-sm font-semibold text-[#e8e8f0] mb-3">Cash Flow Forecast</div>
                <div className="flex items-end gap-2 h-24">
                  {[
                    { week: 'W1', inflow: 72, outflow: 55 },
                    { week: 'W2', inflow: 82, outflow: 68 },
                    { week: 'W3', inflow: 65, outflow: 47 },
                    { week: 'W4', inflow: 90, outflow: 76 },
                  ].map((w) => (
                    <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-0.5 items-end h-20">
                        <div className="flex-1 rounded-t" style={{ height: `${w.inflow}%`, backgroundColor: '#22c55e', opacity: 0.7 }} />
                        <div className="flex-1 rounded-t" style={{ height: `${w.outflow}%`, backgroundColor: '#ef4444', opacity: 0.5 }} />
                      </div>
                      <span className="text-[9px] text-[#8888a0]">{w.week}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-2 justify-center">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#22c55e]" /><span className="text-[9px] text-[#8888a0]">Cash In</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#ef4444]" /><span className="text-[9px] text-[#8888a0]">Cash Out</span></div>
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
                    <span className="text-xs text-[#e8e8f0] w-48 truncate">{job.name}</span>
                    <div className="flex-1 h-1.5 bg-[#2a2a3d] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${job.pct >= 100 ? 'bg-[#ef4444]' : 'bg-[#6366f1]'}`} style={{ width: `${Math.min(job.pct, 100)}%` }} />
                    </div>
                    <span className="text-[10px] text-[#8888a0] w-10">{job.pct}%</span>
                    <span className="text-[10px] text-[#8888a0] w-14 text-right">{job.contract}</span>
                    <span className="text-[10px] font-semibold w-24 text-right" style={{ color: job.billingColor }}>
                      {job.billing}: {job.billingAmt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#12121a]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-[#e8e8f0] mb-12 text-center">
            Sound familiar?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'You check your bank balance to gauge financial health',
                icon: '💳',
              },
              {
                title:
                  "You don't know if a job is profitable until it's done",
                icon: '📊',
              },
              {
                title: 'Month-end close takes weeks, not days',
                icon: '📅',
              },
            ].map((pain, idx) => (
              <div
                key={idx}
                className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-6 hover:border-[#6366f1]/50 transition"
              >
                <div className="text-4xl mb-4">{pain.icon}</div>
                <p className="text-[#e8e8f0] font-medium">{pain.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-[#e8e8f0] mb-12 text-center">
            Everything you need to run your numbers
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Real-Time Financial Dashboard',
                desc: 'Auto-syncs with QuickBooks. See your complete financial picture in real-time.',
                icon: Zap,
              },
              {
                title: 'Job Costing Visibility',
                desc: 'Per-job P&L, budget vs actual spend. Know exactly where money is going.',
                icon: Eye,
              },
              {
                title: 'Cash Flow Forecasting',
                desc: 'See 30/60/90 days ahead. Plan payroll and equipment purchases with confidence.',
                icon: TrendingUp,
              },
              {
                title: 'AI-Powered CFO Brief',
                desc: 'Monthly narrative analysis that explains your numbers and flags opportunities.',
                icon: Brain,
              },
              {
                title: '7+ Integrations',
                desc: 'Connect Procore, Buildertrend, ServiceTitan, Salesforce, HubSpot, JobNimbus — all in one dashboard.',
                icon: Plug,
              },
              {
                title: 'Unified Sales Pipeline',
                desc: 'Pull CRM deals into your financial view. See pipeline alongside cash flow and job costs.',
                icon: TrendingUp,
              },
            ].map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-8 hover:border-[#6366f1]/50 transition"
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
            Connects with the tools you already use
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
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

      {/* Social Proof Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#12121a]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-[#e8e8f0] mb-12 text-center">
            Trusted by contractors nationwide
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">
            Simple, transparent pricing
          </h2>
          <p className="text-center text-[#b0b0c8] mb-12 text-lg">
            14-day free trial on every plan. No credit card required.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter Tier */}
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-8 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">
                Starter
              </h3>
              <p className="text-[#b0b0c8] mb-6">For solo contractors getting organized</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$299</span>
                <span className="text-[#b0b0c8] ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Financial dashboard',
                  'Job costing & WIP tracking',
                  'Cash flow forecasting',
                  'QuickBooks Online sync',
                  'Monthly CFO brief',
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
              <p className="text-[#b0b0c8] mb-6">For growing construction companies</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$499</span>
                <span className="text-[#b0b0c8] ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Everything in Starter',
                  'Buildertrend + HubSpot + JobNimbus',
                  'Sales pipeline dashboard',
                  'AI-powered CFO advisor',
                  'AR/AP aging reports',
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
              <p className="text-[#b0b0c8] mb-6">For scaling operations</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$699</span>
                <span className="text-[#b0b0c8] ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Everything in Professional',
                  'Procore + Salesforce + ServiceTitan',
                  'All 7+ integrations included',
                  'Crew utilization tracking',
                  'Quarterly strategy call',
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

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#12121a]/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-[#e8e8f0] mb-12 text-center">
            Frequently asked questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'How does it connect to QuickBooks?',
                a: 'We use OAuth 2.0 to securely connect to your QuickBooks account. We only read your data—we never modify anything. Connection is fast and your data stays encrypted.',
              },
              {
                q: 'How long does setup take?',
                a: 'Under 15 minutes. Connect QuickBooks, invite your team, and start exploring your data. No data migration required.',
              },
              {
                q: 'Is my financial data secure?',
                a: 'Yes. Your data is encrypted in transit and at rest. We use Supabase for secure database hosting and Stripe for payment processing. Both are SOC 2 compliant.',
              },
              {
                q: 'Can my accountant or bookkeeper access it too?',
                a: 'Yes. Invite unlimited users and assign roles (admin, analyst, viewer). Your team stays aligned without sharing passwords.',
              },
              {
                q: 'What if I want to cancel?',
                a: 'Cancel anytime. No contracts, no cancellation fees. You keep access until your billing cycle ends.',
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-6 group cursor-pointer"
              >
                <summary className="flex items-center justify-between font-semibold text-[#e8e8f0]">
                  {faq.q}
                  <span className="ml-4 transition group-open:rotate-180">
                    <ChevronRight size={20} />
                  </span>
                </summary>
                <p className="mt-4 text-[#b0b0c8]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/5 via-transparent to-[#a78bfa]/5 pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-4xl font-bold text-[#e8e8f0] mb-4">
            Ready to take control of your numbers?
          </h2>
          <p className="text-lg text-[#b0b0c8] mb-8">
            Join hundreds of contractors nationwide who are making smarter
            financial decisions with Contractor CFO Dashboard.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3 rounded font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition"
          >
            Start Free Trial <ChevronRight size={18} />
          </Link>
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
                  <a href="#" className="text-[#e8e8f0] hover:text-[#6366f1]">
                    Pricing
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
                  <a href="#" className="text-[#e8e8f0] hover:text-[#6366f1]">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#e8e8f0] hover:text-[#6366f1]">
                    Blog
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
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#e8e8f0] hover:text-[#6366f1]">
                    Terms
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
                    href="mailto:support@contractorcfo.com"
                    className="text-[#e8e8f0] hover:text-[#6366f1]"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1e1e2e] pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-[#8888a0]">
              © 2024 Salisbury Bookkeeping. All rights reserved.
            </div>
            <div className="text-sm text-[#8888a0] mt-4 md:mt-0">
              Powered by Salisbury Bookkeeping
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
