'use client';

import Link from 'next/link';
import { ChevronRight, Zap, Eye, TrendingUp, Brain, Check } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'essential' | 'pro'>('essential');

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

          <p className="text-lg sm:text-xl text-[#8888a0] mb-8 max-w-2xl leading-relaxed">
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

          {/* Dashboard Mock */}
          <div className="bg-gradient-to-b from-[#12121a] to-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-8 shadow-2xl overflow-hidden">
            <div className="aspect-video bg-[#1e1e2e] rounded flex items-center justify-center">
              <div className="text-center">
                <div className="grid grid-cols-3 gap-4 mb-6 w-full">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-[#0a0a0f] border border-[#2a2a3a] rounded p-4 text-left"
                    >
                      <div className="text-[#8888a0] text-xs mb-2">
                        Metric {i}
                      </div>
                      <div className="text-2xl font-bold text-[#6366f1]">
                        $45.2K
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-32 bg-gradient-to-r from-[#6366f1]/20 to-[#a78bfa]/20 rounded flex items-center justify-center border border-[#2a2a3a]">
                  <span className="text-[#8888a0]">Dashboard Preview</span>
                </div>
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

          <div className="grid md:grid-cols-2 gap-8">
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
                  <p className="text-[#8888a0]">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#12121a]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-[#e8e8f0] mb-12 text-center">
            Trusted by contractors across the Wasatch Front
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  '"We finally understand our job margins. This paid for itself in the first month."',
                author: 'Mike Johnson',
                title: 'Owner, Johnson Construction',
              },
              {
                quote:
                  '"Our accountant loves this. Month-end close went from 4 weeks to 3 days."',
                author: 'Sarah Miller',
                title: 'CFO, Miller & Sons Builders',
              },
              {
                quote:
                  '"This is what our QuickBooks data should have looked like all along."',
                author: 'David Chen',
                title: 'Owner, Chen Development Group',
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-6">
                <p className="text-[#8888a0] italic mb-4">{testimonial.quote}</p>
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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-[#e8e8f0] mb-12 text-center">
            Simple, transparent pricing
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Essential Tier */}
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-8">
              <h3 className="text-2xl font-bold text-[#e8e8f0] mb-2">
                Essential
              </h3>
              <p className="text-[#8888a0] mb-6">For growing construction companies</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-[#e8e8f0]">$497</span>
                <span className="text-[#8888a0] ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Financial dashboard',
                  'Job costing',
                  'Cash flow forecasting',
                  'Monthly CFO brief',
                  'Email support',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check size={20} className="text-[#6366f1]" />
                    <span className="text-[#e8e8f0]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="w-full px-4 py-3 rounded font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition text-center block"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-br from-[#6366f1]/10 to-transparent border border-[#6366f1]/50 rounded-lg p-8 relative">
              <div className="absolute -top-3 left-6 bg-[#6366f1] text-white text-xs font-semibold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>

              <h3 className="text-2xl font-bold text-[#e8e8f0] mb-2">Pro</h3>
              <p className="text-[#8888a0] mb-6">For scaling operations</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-[#e8e8f0]">$697</span>
                <span className="text-[#8888a0] ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Essential',
                  'Sales pipeline dashboard',
                  'Crew utilization tracking',
                  'Custom integrations',
                  'Priority support',
                  'Quarterly strategy call',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check size={20} className="text-[#6366f1]" />
                    <span className="text-[#e8e8f0]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="w-full px-4 py-3 rounded font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] transition text-center block"
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
                <p className="mt-4 text-[#8888a0]">{faq.a}</p>
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
          <p className="text-lg text-[#8888a0] mb-8">
            Join construction companies across Utah who are making smarter
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
