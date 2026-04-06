'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CashFlowChart } from '@/components/charts/cashflow-chart';
import {
  DollarSign, TrendingUp, BarChart3, FileText,
  LayoutDashboard, Bot, ArrowRight, X, Briefcase,
} from 'lucide-react';
import { formatCompactCurrency } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  MOCK DATA — realistic $3M general contractor                      */
/* ------------------------------------------------------------------ */
const kpi = { revenue: 2847500, expenses: 2103200, profit: 744300, cash: 487200, ar: 312800, ap: 198400 };

const jobs = [
  { name: 'Riverside Estate Custom Home', contract: 950000, pct: 82, wip: 'Over-Billed', amt: 69000 },
  { name: 'Heritage Park Commercial', contract: 1450000, pct: 77, wip: 'Over-Billed', amt: 141500 },
  { name: 'Mountain View Remodel', contract: 165000, pct: 100, wip: 'Under-Billed', amt: 39500 },
  { name: 'Cedar Heights Addition', contract: 210000, pct: 93, wip: 'Under-Billed', amt: 55300 },
  { name: 'Oakwood Duplex', contract: 380000, pct: 94, wip: 'Over-Billed', amt: 5200 },
];

const cf = [
  { month: 'Jan', inflow: 180000, outflow: 165000 }, { month: 'Feb', inflow: 210000, outflow: 185000 },
  { month: 'Mar', inflow: 245000, outflow: 220000 }, { month: 'Apr', inflow: 290000, outflow: 255000 },
  { month: 'May', inflow: 320000, outflow: 275000 }, { month: 'Jun', inflow: 285000, outflow: 260000 },
  { month: 'Jul', inflow: 310000, outflow: 290000 }, { month: 'Aug', inflow: 275000, outflow: 245000 },
  { month: 'Sep', inflow: 340000, outflow: 295000 }, { month: 'Oct', inflow: 295000, outflow: 270000 },
  { month: 'Nov', inflow: 265000, outflow: 240000 }, { month: 'Dec', inflow: 230000, outflow: 200000 },
];

const invoices = [
  { id: '1', num: 'INV-2024-089', customer: 'Riverside Estate', amount: 47500, due: '2026-04-15', status: 'current', overdue: 0 },
  { id: '2', num: 'INV-2024-087', customer: 'Heritage Park', amount: 125000, due: '2026-03-20', status: 'overdue', overdue: 17 },
  { id: '3', num: 'INV-2024-082', customer: 'Mountain View', amount: 28500, due: '2026-03-01', status: 'overdue', overdue: 36 },
  { id: '4', num: 'INV-2024-078', customer: 'Cedar Heights', amount: 62000, due: '2026-04-20', status: 'current', overdue: 0 },
  { id: '5', num: 'INV-2024-075', customer: 'Oakwood Duplex', amount: 49800, due: '2026-02-20', status: 'overdue', overdue: 45 },
];

const arBuckets = [
  { label: 'Current', amount: 109500, color: '#22c55e' },
  { label: '1–30 Days', amount: 85000, color: '#eab308' },
  { label: '31–60 Days', amount: 68500, color: '#f97316' },
  { label: '61–90 Days', amount: 49800, color: '#ef4444' },
];

const insights = [
  { type: 'win', text: 'Net cash up 26.1% — strong collections building a healthy runway.' },
  { type: 'watch', text: '$82.4K WIP over-billing exposes cash risk at job close.' },
  { type: 'watch', text: 'AR growing faster than revenue — collections lagging billings.' },
];

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'jobs', label: 'Job Costing', icon: Briefcase },
  { id: 'cashflow', label: 'Cash Flow', icon: BarChart3 },
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'advisor', label: 'CFO Advisor', icon: Bot },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                              */
/* ------------------------------------------------------------------ */
export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showBanner, setShowBanner] = useState(true);

  const chartData = cf.map((c) => ({ month: c.month, inflows: c.inflow, outflows: c.outflow, net: c.inflow - c.outflow, isForecast: false }));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      {/* ---- Demo Banner ---- */}
      {showBanner && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-[#6366f1] to-[#a78bfa] px-4 py-2.5 flex items-center justify-between">
          <p className="text-sm text-white font-medium flex items-center gap-2">
            <span className="text-lg">🔍</span>
            <span><strong>Demo Mode</strong> — Sample data from a $3M general contractor.{' '}
              <Link href="/signup" className="underline underline-offset-2 hover:no-underline">Start your free trial →</Link>
            </span>
          </p>
          <button onClick={() => setShowBanner(false)} className="text-white/70 hover:text-white"><X size={18} /></button>
        </div>
      )}

      <div className="flex">
        {/* ---- Sidebar (desktop) ---- */}
        <aside className="hidden md:flex w-56 flex-col border-r border-[#1e1e2e] bg-[#0a0a0f] min-h-screen sticky top-0 py-6 px-3">
          <div className="mb-8 px-3">
            <span className="text-lg font-bold"><span className="text-[#6366f1]">Builder</span><span>CFO</span></span>
            <p className="text-xs text-[#8888a0] mt-0.5">Demo Dashboard</p>
          </div>
          <nav className="flex-1 space-y-1">
            {tabs.map((t) => { const I = t.icon; return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#6366f1]/15 text-[#6366f1]' : 'text-[#8888a0] hover:text-[#e8e8f0] hover:bg-[#1a1a26]'}`}>
                <I size={18} />{t.label}
              </button>
            ); })}
          </nav>
          <div className="mt-auto px-3 pt-6 border-t border-[#1e1e2e]">
            <Link href="/signup" className="block w-full text-center py-2.5 bg-[#6366f1] hover:bg-[#5558e6] text-white rounded-lg text-sm font-semibold transition-colors">Start Free Trial</Link>
            <Link href="/#schedule" className="block w-full text-center py-2 text-[#6366f1] hover:text-[#818cf8] text-sm mt-2">Book a Demo →</Link>
          </div>
        </aside>

        {/* ---- Main ---- */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
          {/* Mobile tabs */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4 -mx-1 px-1">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#6366f1] text-white' : 'bg-[#1a1a26] text-[#8888a0]'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* AI Brief (overview only) */}
          {activeTab === 'overview' && (
            <div className="mb-6 bg-[#12121a] border border-[#2a2a3d] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3"><Bot size={18} className="text-[#6366f1]" /><span className="text-sm font-semibold">AI CFO Brief</span></div>
              <div className="space-y-2">
                {insights.map((ins, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${ins.type === 'win' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#eab308]/20 text-[#eab308]'}`}>{ins.type === 'win' ? 'Win' : 'Watch'}</span>
                    <span className="text-[#b0b0c8]">{ins.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========== OVERVIEW =========== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {([['Revenue (YTD)', kpi.revenue, '+12.3%', true], ['Expenses (YTD)', kpi.expenses, '+8.7%', false], ['Net Cash', kpi.cash, '+26.1%', true], ['Net Profit', kpi.profit, '+18.2%', true]] as const).map(([label, val, chg, pos]) => (
                  <Card key={label} className="bg-[#12121a] border-[#2a2a3d] p-4">
                    <p className="text-[#8888a0] text-sm mb-1">{label}</p>
                    <p className="text-2xl font-bold">{formatCompactCurrency(val)}</p>
                    <p className={`text-xs mt-1 ${pos ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{chg} vs last year</p>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                  <h3 className="text-lg font-semibold mb-4">AR Aging Summary</h3>
                  <div className="space-y-3">
                    {arBuckets.map((b) => (
                      <div key={b.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} /><span className="text-sm text-[#b0b0c8]">{b.label}</span></div>
                        <span className="text-sm font-semibold">{formatCompactCurrency(b.amount)}</span>
                      </div>
                    ))}
                    <div className="border-t border-[#2a2a3d] pt-2 flex justify-between"><span className="text-sm font-semibold">Total AR</span><span className="text-sm font-bold text-[#6366f1]">{formatCompactCurrency(kpi.ar)}</span></div>
                  </div>
                </Card>
                <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                  <h3 className="text-lg font-semibold mb-4">Cash Flow (12 Months)</h3>
                  <CashFlowChart data={chartData} />
                </Card>
              </div>

              <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                <h3 className="text-lg font-semibold mb-4">Active Jobs — WIP Status</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-[#2a2a3d]">
                      <th className="text-left py-3 px-4 text-[#8888a0] font-semibold">Job</th>
                      <th className="text-right py-3 px-4 text-[#8888a0] font-semibold">Contract</th>
                      <th className="text-right py-3 px-4 text-[#8888a0] font-semibold">% Complete</th>
                      <th className="text-right py-3 px-4 text-[#8888a0] font-semibold">WIP Status</th>
                    </tr></thead>
                    <tbody>{jobs.map((j) => (
                      <tr key={j.name} className="border-b border-[#2a2a3d] hover:bg-[#1a1a26]">
                        <td className="py-3 px-4 font-medium">{j.name}</td>
                        <td className="py-3 px-4 text-right">{formatCompactCurrency(j.contract)}</td>
                        <td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-2"><div className="w-16 h-2 bg-[#2a2a3d] rounded-full overflow-hidden"><div className="h-full bg-[#6366f1] rounded-full" style={{ width: `${j.pct}%` }} /></div><span className="text-xs text-[#b0b0c8]">{j.pct}%</span></div></td>
                        <td className="py-3 px-4 text-right"><Badge variant={j.wip === 'Over-Billed' ? 'warning' : 'info'}>{j.wip}: {formatCompactCurrency(j.amt)}</Badge></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* =========== JOB COSTING =========== */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Job Costing Detail</h2>
              {jobs.map((j) => {
                const cost = j.contract * (j.pct / 100) * (j.wip === 'Over-Billed' ? 0.85 : 1.15);
                const margin = ((j.contract - cost) / j.contract) * 100;
                return (
                  <Card key={j.name} className="bg-[#12121a] border-[#2a2a3d] p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div><h3 className="text-lg font-semibold">{j.name}</h3><p className="text-sm text-[#8888a0]">Contract: {formatCompactCurrency(j.contract)}</p></div>
                      <Badge variant={margin > 20 ? 'success' : margin > 10 ? 'warning' : 'danger'}>{margin.toFixed(1)}% margin</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><p className="text-[#8888a0]">Actual Cost</p><p className="text-lg font-bold">{formatCompactCurrency(cost)}</p></div>
                      <div><p className="text-[#8888a0]">% Complete</p><p className="text-lg font-bold">{j.pct}%</p></div>
                      <div><p className="text-[#8888a0]">WIP Status</p><p className={`text-lg font-bold ${j.wip === 'Over-Billed' ? 'text-[#eab308]' : 'text-[#22c55e]'}`}>{j.wip}: {formatCompactCurrency(j.amt)}</p></div>
                      <div><p className="text-[#8888a0]">Gross Margin</p><p className={`text-lg font-bold ${margin > 15 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{margin.toFixed(1)}%</p></div>
                    </div>
                    <div className="mt-4 w-full h-3 bg-[#2a2a3d] rounded-full overflow-hidden"><div className="h-full bg-[#6366f1] rounded-full" style={{ width: `${j.pct}%` }} /></div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* =========== CASH FLOW =========== */}
          {activeTab === 'cashflow' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Cash Flow Analysis</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="bg-[#12121a] border-[#2a2a3d] p-4"><p className="text-sm text-[#8888a0]">Total Inflows (12mo)</p><p className="text-2xl font-bold text-[#22c55e]">{formatCompactCurrency(cf.reduce((s, c) => s + c.inflow, 0))}</p></Card>
                <Card className="bg-[#12121a] border-[#2a2a3d] p-4"><p className="text-sm text-[#8888a0]">Total Outflows (12mo)</p><p className="text-2xl font-bold text-[#ef4444]">{formatCompactCurrency(cf.reduce((s, c) => s + c.outflow, 0))}</p></Card>
                <Card className="bg-[#12121a] border-[#2a2a3d] p-4"><p className="text-sm text-[#8888a0]">Net Cash Flow</p><p className="text-2xl font-bold text-[#6366f1]">{formatCompactCurrency(cf.reduce((s, c) => s + c.inflow - c.outflow, 0))}</p></Card>
              </div>
              <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                <h3 className="text-lg font-semibold mb-4">Monthly Cash Flow</h3>
                <CashFlowChart data={chartData} />
              </Card>
            </div>
          )}

          {/* =========== INVOICES =========== */}
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Outstanding Invoices</h2>
              <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-[#2a2a3d]">
                      <th className="text-left py-3 px-4 text-[#8888a0] font-semibold">Invoice #</th>
                      <th className="text-left py-3 px-4 text-[#8888a0] font-semibold">Customer</th>
                      <th className="text-right py-3 px-4 text-[#8888a0] font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 text-[#8888a0] font-semibold">Due Date</th>
                      <th className="text-left py-3 px-4 text-[#8888a0] font-semibold">Status</th>
                    </tr></thead>
                    <tbody>{invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-[#2a2a3d] hover:bg-[#1a1a26]">
                        <td className="py-3 px-4 font-medium">{inv.num}</td>
                        <td className="py-3 px-4 text-[#b0b0c8]">{inv.customer}</td>
                        <td className="py-3 px-4 text-right font-semibold">{formatCompactCurrency(inv.amount)}</td>
                        <td className="py-3 px-4 text-[#b0b0c8]">{new Date(inv.due).toLocaleDateString()}</td>
                        <td className="py-3 px-4"><Badge variant={inv.status === 'overdue' ? 'danger' : 'success'}>{inv.status === 'overdue' ? `Overdue ${inv.overdue}d` : 'Current'}</Badge></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* =========== CFO ADVISOR =========== */}
          {activeTab === 'advisor' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">AI CFO Advisor</h2>
              <Card className="bg-[#12121a] border-[#2a2a3d] p-6 space-y-5">
                {/* AI message */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#6366f1]/20 flex items-center justify-center flex-shrink-0"><Bot size={16} className="text-[#6366f1]" /></div>
                  <div className="bg-[#1a1a26] border border-[#2a2a3d] rounded-lg p-4 flex-1">
                    <p className="text-sm text-[#b0b0c8] mb-3">Here&apos;s your weekly financial brief:</p>
                    <div className="space-y-2">
                      {insights.map((ins, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${ins.type === 'win' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#eab308]/20 text-[#eab308]'}`}>{ins.type === 'win' ? 'Win' : 'Watch'}</span>
                          <span className="text-[#b0b0c8]">{ins.text}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-[#b0b0c8] mt-3"><strong className="text-[#e8e8f0]">Recommendation:</strong> Focus on collecting the Heritage Park invoice ($125K, 17 days overdue) and review the Mountain View final billing before closing out that job.</p>
                  </div>
                </div>
                {/* User question */}
                <div className="flex gap-3 justify-end">
                  <div className="bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-lg p-4 max-w-md">
                    <p className="text-sm">Am I over-billed on any jobs right now?</p>
                  </div>
                </div>
                {/* AI response */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#6366f1]/20 flex items-center justify-center flex-shrink-0"><Bot size={16} className="text-[#6366f1]" /></div>
                  <div className="bg-[#1a1a26] border border-[#2a2a3d] rounded-lg p-4 flex-1">
                    <p className="text-sm text-[#b0b0c8]">Yes — you have <strong className="text-[#eab308]">$215.7K in total over-billing</strong> across 3 jobs:</p>
                    <ul className="mt-2 space-y-1 text-sm text-[#b0b0c8]">
                      <li>• Heritage Park Commercial: <span className="text-[#eab308] font-semibold">$141.5K over-billed</span></li>
                      <li>• Riverside Estate: <span className="text-[#eab308] font-semibold">$69K over-billed</span></li>
                      <li>• Oakwood Duplex: <span className="text-[#eab308] font-semibold">$5.2K over-billed</span></li>
                    </ul>
                    <p className="text-sm text-[#b0b0c8] mt-2">Heritage Park is the biggest concern — at 77% complete with $141.5K over-billed, you&apos;ll need ~$141.5K in costs with no billing to true this up. Make sure your remaining budget can absorb that.</p>
                  </div>
                </div>
                {/* Disabled input */}
                <div>
                  <input type="text" placeholder="Ask about your job costs, cash flow, WIP..." disabled className="w-full px-4 py-3 bg-[#1a1a26] border border-[#2a2a3d] rounded-lg text-sm text-[#8888a0] cursor-not-allowed" />
                  <p className="text-xs text-[#8888a0] mt-2 text-center"><Link href="/signup" className="text-[#6366f1] hover:underline">Sign up free</Link> to ask your own questions</p>
                </div>
              </Card>
            </div>
          )}

          {/* ---- Bottom CTA ---- */}
          <div className="mt-12 mb-8 text-center bg-gradient-to-r from-[#6366f1]/10 to-[#a78bfa]/10 border border-[#6366f1]/30 rounded-xl p-8">
            <p className="text-xs uppercase tracking-widest text-[#6366f1] mb-2">This is sample data</p>
            <h2 className="text-2xl font-bold mb-2">Ready to see YOUR numbers?</h2>
            <p className="text-[#8888a0] mb-6">Connect QuickBooks and your dashboard populates in under 10 minutes.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="px-6 py-3 bg-[#6366f1] hover:bg-[#5558e6] text-white rounded-lg font-semibold transition-colors flex items-center gap-2">Start Free — No Card Required <ArrowRight size={18} /></Link>
              <Link href="/#schedule" className="px-6 py-3 border border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/10 rounded-lg font-semibold transition-colors">Book a 15-Min Demo</Link>
            </div>
          </div>
        </main>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0a0a0f]/95 backdrop-blur-sm border-t border-[#2a2a3d] px-4 py-3 z-40 flex items-center gap-3">
        <Link href="/signup" className="flex-1 bg-[#6366f1] hover:bg-[#5558e6] text-white text-center py-2.5 rounded-lg text-sm font-semibold transition-colors">Start Free — No Card</Link>
        <Link href="/#schedule" className="flex-1 border border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/10 text-center py-2.5 rounded-lg text-sm font-semibold transition-colors">Book Demo</Link>
      </div>
    </div>
  );
}
