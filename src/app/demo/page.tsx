'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CashFlowChart } from '@/components/charts/cashflow-chart';
import {
  DollarSign, TrendingUp, BarChart3, FileText,
  LayoutDashboard, Bot, ArrowRight, ArrowUpRight, ArrowDownRight,
  X, Briefcase, Shield, Users, Target, CheckCircle2,
  Hammer, Plug, Settings, Menu, Bell, RefreshCw, MapPin, LogOut, Bug, Brain,
} from 'lucide-react';
import { formatCompactCurrency } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════
   DEMO LOCATIONS & CONFIG
   ═══════════════════════════════════════════════════════ */

const DEMO_LOCATIONS = [
  { id: 'slc', name: 'Main Office', city: 'Salt Lake City', state: 'UT' },
  { id: 'sv', name: 'South Valley Division', city: 'Draper', state: 'UT' },
  { id: 'pc', name: 'Park City Operations', city: 'Park City', state: 'UT' },
];

type LocKey = 'slc' | 'sv' | 'pc';
const LOC_SHARE: Record<LocKey, number> = { slc: 0.54, sv: 0.28, pc: 0.18 };

/* ═══════════════════════════════════════════════════════
   MOCK DATA — realistic $3M custom home builder
   ═══════════════════════════════════════════════════════ */

const INVOICES = [
  { id: '1', num: 'INV-2026-0147', customer: 'Riverside Estate — Draw #6', amount: 142500, due: '2026-04-18', status: 'sent', overdue: 0, loc: 'slc' },
  { id: '2', num: 'INV-2026-0143', customer: 'Cedar Heights Addition', amount: 63000, due: '2026-04-05', status: 'overdue', overdue: 7, loc: 'sv' },
  { id: '3', num: 'INV-2026-0139', customer: 'Heritage Park Commercial — Draw #9', amount: 218750, due: '2026-03-28', status: 'overdue', overdue: 15, loc: 'slc' },
  { id: '4', num: 'INV-2026-0135', customer: 'Oakwood Duplex — Final', amount: 95000, due: '2026-04-22', status: 'sent', overdue: 0, loc: 'sv' },
  { id: '5', num: 'INV-2026-0131', customer: 'Mountain View Remodel — Retainage Release', amount: 8250, due: '2026-04-01', status: 'overdue', overdue: 11, loc: 'pc' },
  { id: '6', num: 'INV-2026-0128', customer: 'Riverside Estate — Draw #5', amount: 142500, due: '2026-03-15', status: 'paid', overdue: 0, loc: 'slc' },
  { id: '7', num: 'INV-2026-0124', customer: 'Heritage Park Commercial — Draw #8', amount: 218750, due: '2026-03-01', status: 'paid', overdue: 0, loc: 'slc' },
  { id: '8', num: 'INV-2026-0121', customer: 'Cedar Heights Addition — Draw #3', amount: 42000, due: '2026-02-20', status: 'paid', overdue: 0, loc: 'sv' },
  { id: '9', num: 'INV-2026-0117', customer: 'Oakwood Duplex — Draw #7', amount: 57000, due: '2026-02-10', status: 'paid', overdue: 0, loc: 'sv' },
  { id: '10', num: 'INV-2026-0112', customer: 'Silverado Ranch Custom Home', amount: 185000, due: '2026-04-30', status: 'draft', overdue: 0, loc: 'pc' },
  { id: '11', num: 'INV-2026-0108', customer: 'Mountain View Remodel — Final', amount: 16500, due: '2026-01-25', status: 'paid', overdue: 0, loc: 'pc' },
  { id: '12', num: 'INV-2026-0104', customer: 'Heritage Park Commercial — Draw #7', amount: 218750, due: '2026-01-15', status: 'paid', overdue: 0, loc: 'slc' },
];

const CASH_FLOW = [
  { month: 'May', inflow: 295000, outflow: 278000, net: 17000 },
  { month: 'Jun', inflow: 342000, outflow: 310000, net: 32000 },
  { month: 'Jul', inflow: 285000, outflow: 298000, net: -13000 },
  { month: 'Aug', inflow: 368000, outflow: 325000, net: 43000 },
  { month: 'Sep', inflow: 310000, outflow: 287000, net: 23000 },
  { month: 'Oct', inflow: 275000, outflow: 302000, net: -27000 },
  { month: 'Nov', inflow: 412000, outflow: 345000, net: 67000 },
  { month: 'Dec', inflow: 198000, outflow: 256000, net: -58000 },
  { month: 'Jan', inflow: 325000, outflow: 289000, net: 36000 },
  { month: 'Feb', inflow: 387000, outflow: 318000, net: 69000 },
  { month: 'Mar', inflow: 445000, outflow: 372000, net: 73000 },
  { month: 'Apr', inflow: 358000, outflow: 315000, net: 43000 },
];

const WIP_JOBS = [
  { name: 'Riverside Estate Custom Home', contract: 950000, costsToDate: 689350, billedToDate: 712500, pct: 82, margin: 27.4, billing: 'Over-Billed' as const, variance: 23150, status: 'Active' as const, loc: 'slc' },
  { name: 'Heritage Park Commercial', contract: 1450000, costsToDate: 1182100, billedToDate: 1312500, pct: 77, margin: 18.5, billing: 'Over-Billed' as const, variance: 130400, status: 'Active' as const, loc: 'slc' },
  { name: 'Cedar Heights Addition', contract: 210000, costsToDate: 155400, billedToDate: 147000, pct: 93, margin: 26.0, billing: 'Under-Billed' as const, variance: -8400, status: 'Active' as const, loc: 'sv' },
  { name: 'Oakwood Duplex', contract: 380000, costsToDate: 296400, billedToDate: 304000, pct: 94, margin: 22.0, billing: 'Over-Billed' as const, variance: 7600, status: 'Active' as const, loc: 'sv' },
  { name: 'Silverado Ranch Custom Home', contract: 1120000, costsToDate: 112000, billedToDate: 56000, pct: 12, margin: 24.8, billing: 'Under-Billed' as const, variance: -56000, status: 'Active' as const, loc: 'pc' },
  { name: 'Mountain View Remodel', contract: 165000, costsToDate: 127050, billedToDate: 165000, pct: 100, margin: 23.0, billing: 'Fully Billed' as const, variance: 0, status: 'Complete' as const, loc: 'pc' },
];

const RETAINAGE = [
  { job: 'Riverside Estate Custom Home', held: 47500, pct: 5.0, eligible: 'May 2026', status: 'Eligible' as const, gc: 'Owner-Direct', loc: 'slc' },
  { job: 'Heritage Park Commercial', held: 72500, pct: 5.0, eligible: 'Jul 2026', status: 'Pending' as const, gc: 'Summit Development', loc: 'slc' },
  { job: 'Mountain View Remodel', held: 8250, pct: 5.0, eligible: 'Apr 2026', status: 'Overdue' as const, gc: 'Parkside Homes', loc: 'pc' },
  { job: 'Cedar Heights Addition', held: 31500, pct: 15.0, eligible: 'Jun 2026', status: 'Eligible' as const, gc: 'Owner-Direct', loc: 'sv' },
  { job: 'Oakwood Duplex', held: 36750, pct: 9.7, eligible: 'Apr 2026', status: 'Overdue' as const, gc: 'Crestline Properties', loc: 'sv' },
  { job: 'Silverado Ranch Custom Home', held: 5600, pct: 0.5, eligible: 'Dec 2026', status: 'Pending' as const, gc: 'Owner-Direct', loc: 'pc' },
];

const SALES_REPS = [
  { name: 'Jake Morrison', role: 'Senior Estimator', pipeline: 2850000, wonYTD: 1330000, lostYTD: 420000, closeRate: 76, avgDeal: 332500, proposals: 4, calls: 47, meetings: 12, loc: 'slc' },
  { name: 'Rachel Torres', role: 'Business Development', pipeline: 1920000, wonYTD: 890000, lostYTD: 310000, closeRate: 74, avgDeal: 222500, proposals: 6, calls: 63, meetings: 18, loc: 'sv' },
  { name: 'Marcus Webb', role: 'Estimator', pipeline: 1150000, wonYTD: 540000, lostYTD: 280000, closeRate: 66, avgDeal: 180000, proposals: 3, calls: 38, meetings: 9, loc: 'pc' },
];

const SALES_PIPELINE = [
  { project: 'Aspen Ridge Spec Home', client: 'Internal Build', value: 875000, stage: 'Proposal Sent', prob: 90, close: 'Apr 2026', rep: 'Jake Morrison', loc: 'slc' },
  { project: 'Lakewood Office Renovation', client: 'Lakewood Medical Group', value: 420000, stage: 'Negotiation', prob: 75, close: 'May 2026', rep: 'Rachel Torres', loc: 'sv' },
  { project: 'Summit View Custom Home', client: 'Thompson Family', value: 1100000, stage: 'Qualification', prob: 40, close: 'Jun 2026', rep: 'Jake Morrison', loc: 'slc' },
  { project: 'Parkside Townhomes Ph.2', client: 'Crestline Properties', value: 2200000, stage: 'Proposal Sent', prob: 60, close: 'Jul 2026', rep: 'Rachel Torres', loc: 'sv' },
  { project: 'Downtown Loft Conversion', client: 'Metro Living LLC', value: 650000, stage: 'Discovery', prob: 25, close: 'Aug 2026', rep: 'Marcus Webb', loc: 'pc' },
  { project: 'Highland Ranch Addition', client: 'Garcia Family', value: 195000, stage: 'Verbal Commit', prob: 95, close: 'Apr 2026', rep: 'Marcus Webb', loc: 'pc' },
  { project: 'Willow Creek Remodel', client: 'Nguyen Family', value: 310000, stage: 'Proposal Sent', prob: 55, close: 'May 2026', rep: 'Rachel Torres', loc: 'sv' },
  { project: 'Valley Industrial Warehouse', client: 'West Valley Logistics', value: 1800000, stage: 'Discovery', prob: 20, close: 'Sep 2026', rep: 'Jake Morrison', loc: 'slc' },
];

/* ═══════════════════════════════════════════════════════
   NAV ITEMS — matches actual dashboard sidebar
   ═══════════════════════════════════════════════════════ */

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'wip', label: 'Job Costing', icon: Hammer },
  { id: 'cashflow', label: 'Cash Flow', icon: TrendingUp },
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'sales', label: 'Reports', icon: BarChart3 },
  { id: 'advisor', label: 'CFO Advisor', icon: Brain },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'settings', label: 'Settings', icon: Settings },
];

/* Win/Watch per location */
const WIN_WATCH: Record<string, { win: string; watch: string }> = {
  all:  { win: 'Net cash position up 26.1% \u2014 strongest quarter in 12 months.', watch: 'AR aging over 60 days crept up 8% \u2014 follow up on 3 invoices.' },
  slc:  { win: 'Riverside Estate on track \u2014 82% complete with 27.4% margin.', watch: 'Heritage Park Draw #9 is 15 days overdue ($218.7K) \u2014 escalate to PM.' },
  sv:   { win: 'Cedar Heights at 93% complete \u2014 wrapping up ahead of schedule.', watch: 'Cedar Heights under-billed by $8.4K \u2014 submit catch-up draw request.' },
  pc:   { win: 'Silverado Ranch just started \u2014 strong 24.8% margin projected.', watch: 'Mountain View retainage release is 11 days past eligible date.' },
};

/* Helpers */
const fmt = (n: number) => '$' + n.toLocaleString('en-US');
const fmtPct = (n: number) => n.toFixed(1) + '%';

function getCashFlowData(locId: string | null) {
  if (!locId) return CASH_FLOW.map(m => ({ month: m.month, inflows: m.inflow, outflows: m.outflow, net: m.net, isForecast: false }));
  const share = LOC_SHARE[locId as LocKey] || 1;
  const outShare = share + 0.02;
  return CASH_FLOW.map(m => {
    const inf = Math.round(m.inflow * share);
    const outf = Math.round(m.outflow * outShare);
    return { month: m.month, inflows: inf, outflows: outf, net: inf - outf, isForecast: false };
  });
}

function getOverviewKPIs(locId: string | null) {
  const base = [
    { label: 'Revenue (YTD)', value: 2854200, change: '+12.3%', up: true, icon: DollarSign, ic: 'text-indigo-500' },
    { label: 'Expenses (YTD)', value: 2109900, change: '+6.8%', up: false, icon: TrendingUp, ic: 'text-orange-500' },
    { label: 'Accounts Receivable', value: 528500, change: '+3.1%', up: false, icon: FileText, ic: 'text-yellow-500' },
    { label: 'Accounts Payable', value: 312800, change: '-8.2%', up: true, icon: FileText, ic: 'text-blue-500' },
    { label: 'Cash Balance', value: 487250, change: '+26.1%', up: true, icon: DollarSign, ic: 'text-green-500' },
    { label: 'Net Profit', value: 744300, change: '+18.7%', up: true, icon: TrendingUp, ic: 'text-emerald-500' },
  ];
  if (!locId) return base;
  const share = LOC_SHARE[locId as LocKey] || 1;
  return base.map(k => ({ ...k, value: Math.round(k.value * share) }));
}

function getARAging(locId: string | null) {
  if (!locId) return [
    { label: 'Current', amount: 310000, pct: 64, color: '#22c55e' },
    { label: '1-30 Days', amount: 85000, pct: 17, color: '#eab308' },
    { label: '31-60 Days', amount: 63500, pct: 13, color: '#f97316' },
    { label: '61-90 Days', amount: 28700, pct: 6, color: '#ef4444' },
  ];
  const share = LOC_SHARE[locId as LocKey] || 1;
  return [
    { label: 'Current', amount: Math.round(310000 * share), pct: 64, color: '#22c55e' },
    { label: '1-30 Days', amount: Math.round(85000 * share), pct: 17, color: '#eab308' },
    { label: '31-60 Days', amount: Math.round(63500 * share), pct: 13, color: '#f97316' },
    { label: '61-90 Days', amount: Math.round(28700 * share), pct: 6, color: '#ef4444' },
  ];
}

/* ═══════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showBanner, setShowBanner] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [wipSubTab, setWipSubTab] = useState<'wip' | 'retainage'>('wip');

  const sidebarOpen = !sidebarCollapsed;
  const selectedLocation = DEMO_LOCATIONS.find(l => l.id === selectedLocationId);
  const bannerH = showBanner ? 40 : 0;

  /* Filtered data */
  const fInvoices = selectedLocationId ? INVOICES.filter(i => i.loc === selectedLocationId) : INVOICES;
  const fWIP = selectedLocationId ? WIP_JOBS.filter(j => j.loc === selectedLocationId) : WIP_JOBS;
  const fRetainage = selectedLocationId ? RETAINAGE.filter(r => r.loc === selectedLocationId) : RETAINAGE;
  const fReps = selectedLocationId ? SALES_REPS.filter(r => r.loc === selectedLocationId) : SALES_REPS;
  const fPipeline = selectedLocationId ? SALES_PIPELINE.filter(d => d.loc === selectedLocationId) : SALES_PIPELINE;
  const chartData = getCashFlowData(selectedLocationId);
  const kpis = getOverviewKPIs(selectedLocationId);
  const arAging = getARAging(selectedLocationId);
  const ww = WIN_WATCH[selectedLocationId || 'all'];
  const locKey = selectedLocationId || 'all';

  const isActive = (id: string) => activeTab === id;

  const handleNav = (id: string) => {
    if (['locations', 'integrations', 'settings'].includes(id)) return;
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  /* ─── Sidebar JSX (shared between desktop & mobile) ─── */
  const renderNav = (collapsed: boolean) => (
    <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.id);
        const disabled = ['locations', 'integrations', 'settings'].includes(item.id);
        return (
          <button key={item.id} onClick={() => handleNav(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              active ? 'bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20'
                : disabled ? 'text-[#4a4a5d] cursor-not-allowed'
                : 'text-[#8888a0] hover:text-[#e8e8f0] hover:bg-[#2a2a3d]'
            }`}>
            <Icon size={20} />
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && disabled && <span className="ml-auto text-[9px] text-[#4a4a5d] bg-[#1a1a26] px-1.5 py-0.5 rounded">Pro</span>}
          </button>
        );
      })}
    </nav>
  );

  const renderLocationFilter = (collapsed: boolean) => (
    <div className="border-t border-[#2a2a3d] pt-3 px-3 pb-3">
      {!collapsed && (
        <div className="pb-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8888a0]">Location Filter</span>
        </div>
      )}
      <button
        onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-[#1a1a26] border border-[#2a2a3d] rounded-lg text-sm hover:border-[#6366f1] transition-colors"
      >
        <MapPin size={14} className="text-[#6366f1] flex-shrink-0" />
        {!collapsed && <span className="text-[#e8e8f0] truncate text-xs">{selectedLocation?.name ?? 'All Locations'}</span>}
        {!collapsed && (
          <svg className={`w-3 h-3 text-[#8888a0] ml-auto transition-transform ${locationDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
    </div>
  );

  const renderUserProfile = (collapsed: boolean) => (
    <div className="border-t border-[#2a2a3d] p-3 space-y-2">
      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${!collapsed ? 'bg-[#1a1a26]' : ''}`}>
        <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center font-semibold text-sm flex-shrink-0">CM</div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">Cory Mitchell</div>
            <div className="text-xs text-[#8888a0] truncate">Wasatch Custom Homes</div>
          </div>
        )}
      </div>
      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#8888a0] hover:text-[#f59e0b] hover:bg-[#f59e0b]/10 transition-all duration-200">
        <Bug size={20} />{!collapsed && <span>Report a Bug</span>}
      </button>
      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#8888a0] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all duration-200">
        <LogOut size={20} />{!collapsed && <span>Sign Out</span>}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0] flex flex-col">
      {/* ════════════ Demo Banner ════════════ */}
      {showBanner && (
        <div className="h-10 shrink-0 sticky top-0 z-[60] bg-gradient-to-r from-[#6366f1] to-[#a78bfa] px-4 flex items-center justify-between">
          <p className="text-sm text-white font-medium flex items-center gap-2">
            <span className="text-base">&#128270;</span>
            <span><strong>Demo Mode</strong> &mdash; Sample data for a $3M custom home builder.{' '}
              <Link href="/signup" className="underline underline-offset-2 hover:no-underline">Start your free trial &rarr;</Link>
            </span>
          </p>
          <button onClick={() => setShowBanner(false)} className="text-white/70 hover:text-white"><X size={18} /></button>
        </div>
      )}

      <div className="flex flex-1 relative">
        {/* ════════════ Desktop Sidebar ════════════ */}
        <div
          className={`hidden lg:flex fixed left-0 z-40 transition-all duration-300 flex-col ${sidebarOpen ? 'w-64' : 'w-20'} bg-[#12121a] border-r border-[#2a2a3d]`}
          style={{ top: bannerH, height: `calc(100vh - ${bannerH}px)` }}
        >
          {/* Logo */}
          <div className="h-16 border-b border-[#2a2a3d] flex items-center justify-center px-4 cursor-pointer"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarOpen ? (
              <div className="font-bold text-lg tracking-tight">
                <span className="text-[#6366f1]">Builder</span><span className="text-[#e8e8f0]">CFO</span>
                <div className="text-[10px] text-[#8888a0] font-normal">by Salisbury Bookkeeping</div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[#6366f1] flex items-center justify-center font-bold text-sm">BC</div>
            )}
          </div>
          {renderNav(!sidebarOpen)}
          {renderLocationFilter(!sidebarOpen)}
          {renderUserProfile(!sidebarOpen)}
        </div>

        {/* ════════════ Mobile Slide-Over ════════════ */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-72 z-50 bg-[#12121a] border-r border-[#2a2a3d] flex flex-col lg:hidden animate-in slide-in-from-left duration-200"
              style={{ top: bannerH, height: `calc(100vh - ${bannerH}px)` }}
            >
              <div className="h-16 border-b border-[#2a2a3d] flex items-center justify-between px-4">
                <div className="font-bold text-lg tracking-tight">
                  <span className="text-[#6366f1]">Builder</span><span className="text-[#e8e8f0]">CFO</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-[#2a2a3d] rounded-lg text-[#8888a0]"><X size={20} /></button>
              </div>
              {renderNav(false)}
              {renderLocationFilter(false)}
              {renderUserProfile(false)}
            </div>
          </>
        )}

        {/* ════════════ Location Dropdown (floating) ════════════ */}
        {locationDropdownOpen && (
          <>
            <div className="fixed inset-0 z-[45]" onClick={() => setLocationDropdownOpen(false)} />
            <div className="fixed z-[46] w-56 bg-[#1a1a26] border border-[#2a2a3d] rounded-lg shadow-xl py-1 max-h-64 overflow-y-auto"
              style={{ left: sidebarOpen ? 76 : 24, bottom: 140 }}
            >
              <button
                onClick={() => { setSelectedLocationId(null); setLocationDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedLocationId === null ? 'bg-[#6366f1]/20 text-[#6366f1]' : 'text-[#e8e8f0] hover:bg-[#2a2a3d]'}`}
              >All Locations</button>
              {DEMO_LOCATIONS.map((loc) => (
                <button key={loc.id}
                  onClick={() => { setSelectedLocationId(loc.id); setLocationDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${loc.id === selectedLocationId ? 'bg-[#6366f1]/20 text-[#6366f1]' : 'text-[#e8e8f0] hover:bg-[#2a2a3d]'}`}
                >
                  <div className="font-medium truncate">{loc.name}</div>
                  <div className="text-xs text-[#8888a0] mt-0.5">{loc.city}, {loc.state}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ════════════ Main Content ════════════ */}
        <div className={`flex-1 flex flex-col w-full transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          {/* ──── Top Bar ──── */}
          <div className="h-14 sm:h-16 border-b border-[#2a2a3d] bg-[#12121a] flex items-center justify-between px-4 sm:px-6 sticky z-30"
            style={{ top: bannerH }}
          >
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-1.5 hover:bg-[#2a2a3d] rounded-lg text-[#8888a0] hover:text-[#e8e8f0] transition">
                <Menu size={22} />
              </button>
              <h1 className="text-lg sm:text-xl font-bold shrink-0">Dashboard</h1>

              {/* Company Selector */}
              <div className="relative hidden sm:block">
                <button onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a26] border border-[#2a2a3d] rounded-lg text-sm hover:border-[#6366f1] transition-colors"
                >
                  <span className="text-[#e8e8f0] max-w-[160px] truncate">Wasatch Custom Homes</span>
                  <svg className={`w-4 h-4 text-[#8888a0] transition-transform ${clientDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {clientDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setClientDropdownOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-64 bg-[#1a1a26] border border-[#2a2a3d] rounded-lg shadow-xl z-50 py-1">
                      <button className="w-full text-left px-4 py-2.5 text-sm bg-[#6366f1]/20 text-[#6366f1]" onClick={() => setClientDropdownOpen(false)}>
                        <div className="font-medium">Wasatch Custom Homes</div>
                        <div className="text-xs text-[#8888a0] mt-0.5">QBO Connected</div>
                      </button>
                      <div className="border-t border-[#2a2a3d] mt-1 pt-1">
                        <span className="block px-4 py-2.5 text-sm text-[#4a4a5d] cursor-not-allowed">+ Connect New QBO Company</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Top-bar Location Selector */}
              <div className="relative hidden md:block">
                <button onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a26] border border-[#2a2a3d] rounded-lg text-sm hover:border-[#6366f1] transition-colors"
                >
                  <MapPin size={14} className="text-[#6366f1] flex-shrink-0" />
                  <span className="text-[#e8e8f0] max-w-[140px] truncate">{selectedLocation?.name ?? 'All Locations'}</span>
                  <svg className={`w-4 h-4 text-[#8888a0] transition-transform ${locationDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {locationDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLocationDropdownOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-56 bg-[#1a1a26] border border-[#2a2a3d] rounded-lg shadow-xl z-50 py-1 max-h-64 overflow-y-auto">
                      <button onClick={() => { setSelectedLocationId(null); setLocationDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedLocationId === null ? 'bg-[#6366f1]/20 text-[#6366f1]' : 'text-[#e8e8f0] hover:bg-[#2a2a3d]'}`}
                      >All Locations</button>
                      {DEMO_LOCATIONS.map((loc) => (
                        <button key={loc.id}
                          onClick={() => { setSelectedLocationId(loc.id); setLocationDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${loc.id === selectedLocationId ? 'bg-[#6366f1]/20 text-[#6366f1]' : 'text-[#e8e8f0] hover:bg-[#2a2a3d]'}`}
                        >
                          <div className="font-medium truncate">{loc.name}</div>
                          <div className="text-xs text-[#8888a0] mt-0.5">{loc.city}, {loc.state}</div>
                        </button>
                      ))}
                      <div className="border-t border-[#2a2a3d] mt-1 pt-1">
                        <span className="block px-4 py-2.5 text-sm text-[#4a4a5d] cursor-not-allowed">Manage Locations</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="hidden lg:flex items-center gap-2 text-sm text-[#8888a0]">
                <span>Last synced:</span>
                <span className="text-[#22c55e]">12 minutes ago</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a26] border border-[#2a2a3d] rounded-lg text-sm text-[#8888a0] hover:border-[#6366f1] transition-colors">
                <RefreshCw size={16} />
                <span className="hidden sm:inline">Sync with QBO</span>
              </button>
              <button className="p-2 hover:bg-[#2a2a3d] rounded-lg transition-colors text-[#8888a0] hover:text-[#e8e8f0] relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full" />
              </button>
            </div>
          </div>

          {/* ──── Content Area ──── */}
          <div className="flex-1 overflow-auto bg-[#0a0a0f]">
            <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">

              {/* ═══════════════ OVERVIEW ═══════════════ */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#0d1f0d] border-l-2 border-[#22c55e] rounded-r-lg px-4 py-3">
                      <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
                      <p className="text-sm text-[#e8e8f0] mt-0.5">{ww.win}</p>
                    </div>
                    <div className="bg-[#1f1a0d] border-l-2 border-[#eab308] rounded-r-lg px-4 py-3">
                      <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
                      <p className="text-sm text-[#e8e8f0] mt-0.5">{ww.watch}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                    {kpis.map((kpi) => {
                      const Icon = kpi.icon;
                      return (
                        <Card key={kpi.label} className={`bg-[#12121a] border-[#2a2a3d] p-4 border-l-2 ${kpi.up ? '!border-l-green-500' : '!border-l-red-500'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[#8888a0] text-[11px]">{kpi.label}</p>
                            <Icon className={`w-4 h-4 ${kpi.ic}`} />
                          </div>
                          <p className="text-xl font-bold">{formatCompactCurrency(kpi.value)}</p>
                          <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${kpi.up ? 'text-green-400' : 'text-red-400'}`}>
                            {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {kpi.change}
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                      <h3 className="text-lg font-semibold mb-4">AR Aging Summary</h3>
                      <div className="space-y-3">
                        {arAging.map((b) => (
                          <div key={b.label} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} /><span className="text-sm text-[#b0b0c8]">{b.label}</span></div>
                              <span className="text-sm font-semibold" style={{ color: b.color }}>{fmt(b.amount)}</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#2a2a3d] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ backgroundColor: b.color, width: `${b.pct}%` }} />
                            </div>
                          </div>
                        ))}
                        <div className="border-t border-[#2a2a3d] pt-2 flex justify-between">
                          <span className="text-sm font-semibold">Total AR</span>
                          <span className="text-sm font-bold text-[#6366f1]">{fmt(arAging.reduce((s, b) => s + b.amount, 0))}</span>
                        </div>
                      </div>
                    </Card>
                    <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                      <h3 className="text-lg font-semibold mb-4">Cash Flow (12 Months)</h3>
                      <CashFlowChart data={chartData} />
                    </Card>
                  </div>

                  <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                    <h3 className="text-lg font-semibold mb-4">Outstanding Invoices</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-[#2a2a3d]">
                          <th className="text-left py-3 px-4 text-[#8888a0] font-semibold">Invoice #</th>
                          <th className="text-left py-3 px-4 text-[#8888a0] font-semibold">Customer</th>
                          <th className="text-right py-3 px-4 text-[#8888a0] font-semibold">Amount</th>
                          <th className="text-left py-3 px-4 text-[#8888a0] font-semibold">Due Date</th>
                          <th className="text-left py-3 px-4 text-[#8888a0] font-semibold">Status</th>
                        </tr></thead>
                        <tbody>{fInvoices.slice(0, 8).map((inv) => (
                          <tr key={inv.id} className="border-b border-[#2a2a3d] hover:bg-[#1a1a26]">
                            <td className="py-3 px-4 font-mono text-xs">{inv.num}</td>
                            <td className="py-3 px-4 text-[#b0b0c8]">{inv.customer}</td>
                            <td className="py-3 px-4 text-right font-semibold">{fmt(inv.amount)}</td>
                            <td className="py-3 px-4 text-[#b0b0c8]">{new Date(inv.due).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              <Badge variant={inv.status === 'overdue' ? 'danger' : inv.status === 'paid' ? 'success' : 'info'}>
                                {inv.status === 'overdue' ? `Overdue ${inv.overdue}d` : inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                              </Badge>
                            </td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </Card>

                  <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                    <h3 className="text-lg font-semibold mb-4">Active Jobs &mdash; WIP Status</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-[#2a2a3d]">
                          <th className="text-left py-3 px-4 text-[#8888a0] font-semibold">Job</th>
                          <th className="text-right py-3 px-4 text-[#8888a0] font-semibold">Contract</th>
                          <th className="text-center py-3 px-4 text-[#8888a0] font-semibold">% Complete</th>
                          <th className="text-right py-3 px-4 text-[#8888a0] font-semibold">Est. Margin</th>
                          <th className="text-right py-3 px-4 text-[#8888a0] font-semibold">Billing Status</th>
                        </tr></thead>
                        <tbody>{fWIP.map((j) => {
                          const marginColor = j.margin >= 22 ? 'text-[#22c55e]' : j.margin >= 18 ? 'text-[#eab308]' : 'text-[#ef4444]';
                          const billingColor = j.billing === 'Over-Billed' ? 'text-[#eab308]' : j.billing === 'Under-Billed' ? 'text-[#ef4444]' : 'text-[#22c55e]';
                          return (
                            <tr key={j.name} className="border-b border-[#2a2a3d] hover:bg-[#1a1a26]">
                              <td className="py-3 px-4 font-medium whitespace-nowrap">{j.name}</td>
                              <td className="py-3 px-4 text-right text-[#b0b0c8]">{fmt(j.contract)}</td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-16 h-2 bg-[#2a2a3d] rounded-full overflow-hidden"><div className={`h-full rounded-full ${j.pct >= 100 ? 'bg-[#22c55e]' : 'bg-[#6366f1]'}`} style={{ width: `${Math.min(j.pct, 100)}%` }} /></div>
                                  <span className="text-xs text-[#b0b0c8]">{j.pct}%</span>
                                </div>
                              </td>
                              <td className={`py-3 px-4 text-right font-bold ${marginColor}`}>{fmtPct(j.margin)}</td>
                              <td className={`py-3 px-4 text-right font-semibold whitespace-nowrap ${billingColor}`}>{j.billing}{j.variance !== 0 && ` ${fmt(Math.abs(j.variance))}`}</td>
                            </tr>
                          );
                        })}</tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ═══════════════ INVOICES ═══════════════ */}
              {activeTab === 'invoices' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#0d1f0d] border-l-2 border-[#22c55e] rounded-r-lg px-4 py-3">
                      <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
                      <p className="text-sm text-[#e8e8f0] mt-0.5">{fInvoices.filter(i => i.status === 'paid').length} of {fInvoices.length} invoices fully paid &mdash; {fmt(fInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0))} collected.</p>
                    </div>
                    <div className="bg-[#1f1a0d] border-l-2 border-[#eab308] rounded-r-lg px-4 py-3">
                      <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
                      <p className="text-sm text-[#e8e8f0] mt-0.5">{fInvoices.filter(i => i.status === 'overdue').length} overdue invoice{fInvoices.filter(i => i.status === 'overdue').length !== 1 ? 's' : ''} totaling {fmt(fInvoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0))}.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Current', amount: fInvoices.filter(i => i.status === 'sent' || i.status === 'draft').reduce((s, i) => s + i.amount, 0), border: 'border-l-green-500', color: 'text-green-400' },
                      { label: '1-30 Days', amount: fInvoices.filter(i => i.overdue > 0 && i.overdue <= 30).reduce((s, i) => s + i.amount, 0), border: 'border-l-yellow-500', color: 'text-yellow-400' },
                      { label: '31-60 Days', amount: 0, border: 'border-l-orange-500', color: 'text-orange-400' },
                      { label: '61-90 Days', amount: fInvoices.filter(i => i.overdue > 7).reduce((s, i) => s + i.amount, 0), border: 'border-l-red-500', color: 'text-red-400' },
                    ].map((b) => (
                      <Card key={b.label} className={`bg-[#12121a] border-[#2a2a3d] p-4 border-l-2 ${b.border}`}>
                        <p className="text-xs text-[#8888a0] mb-1">{b.label}</p>
                        <p className={`text-lg font-bold ${b.amount > 0 ? b.color : 'text-gray-600'}`}>{b.amount > 0 ? fmt(b.amount) : '$0'}</p>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">All Invoices</h3>
                      <div className="flex gap-4 text-sm">
                        <span className="text-[#8888a0]">Total: <span className="text-white font-medium">{fmt(fInvoices.reduce((s, i) => s + i.amount, 0))}</span></span>
                        <span className="text-[#8888a0]">Overdue: <span className="text-red-400 font-medium">{fInvoices.filter(i => i.status === 'overdue').length}</span></span>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-[#2a2a3d]">
                          <th className="text-left py-3 px-4 text-[#8888a0] font-semibold">Invoice #</th>
                          <th className="text-left py-3 px-4 text-[#8888a0] font-semibold">Customer</th>
                          <th className="text-right py-3 px-4 text-[#8888a0] font-semibold">Amount</th>
                          <th className="text-left py-3 px-4 text-[#8888a0] font-semibold">Due Date</th>
                          <th className="text-left py-3 px-4 text-[#8888a0] font-semibold">Status</th>
                          <th className="text-right py-3 px-4 text-[#8888a0] font-semibold">Days Overdue</th>
                        </tr></thead>
                        <tbody>{fInvoices.map((inv) => (
                          <tr key={inv.id} className="border-b border-[#2a2a3d] hover:bg-[#1a1a26]">
                            <td className="py-3 px-4 font-mono text-xs">{inv.num}</td>
                            <td className="py-3 px-4 text-[#b0b0c8]">{inv.customer}</td>
                            <td className="py-3 px-4 text-right font-semibold">{fmt(inv.amount)}</td>
                            <td className="py-3 px-4 text-[#b0b0c8]">{new Date(inv.due).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              <Badge variant={inv.status === 'overdue' ? 'danger' : inv.status === 'paid' ? 'success' : inv.status === 'sent' ? 'info' : 'default'}>
                                {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">{inv.overdue > 0 ? <span className="text-red-400 font-semibold">{inv.overdue} days</span> : <span className="text-gray-500">&mdash;</span>}</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ═══════════════ CASH FLOW ═══════════════ */}
              {activeTab === 'cashflow' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#0d1f0d] border-l-2 border-[#22c55e] rounded-r-lg px-4 py-3">
                      <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
                      <p className="text-sm text-[#e8e8f0] mt-0.5">Net positive cash flow for 3 of the last 4 months.</p>
                    </div>
                    <div className="bg-[#1f1a0d] border-l-2 border-[#eab308] rounded-r-lg px-4 py-3">
                      <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
                      <p className="text-sm text-[#e8e8f0] mt-0.5">December was -$58K &mdash; plan draws around holiday slowdowns.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(() => {
                      const d = chartData;
                      const totalIn = d.reduce((s, m) => s + m.inflows, 0);
                      const totalOut = d.reduce((s, m) => s + m.outflows, 0);
                      const netCF = totalIn - totalOut;
                      const avgNet = Math.round(netCF / 12);
                      return [
                        { label: 'Total Cash In (12mo)', value: totalIn, change: '+14.2%', up: true },
                        { label: 'Total Cash Out (12mo)', value: totalOut, change: '+8.1%', up: false },
                        { label: 'Net Cash Flow', value: netCF, change: '+42.3%', up: true },
                        { label: 'Avg Monthly Net', value: avgNet, change: '+18.9%', up: true },
                      ].map((kpi) => (
                        <Card key={kpi.label} className={`bg-[#12121a] border-[#2a2a3d] p-4 border-l-2 ${kpi.up ? '!border-l-green-500' : '!border-l-red-500'}`}>
                          <p className="text-xs text-[#8888a0] mb-1">{kpi.label}</p>
                          <p className="text-lg font-bold text-white">{fmt(kpi.value)}</p>
                          <p className={`text-xs font-semibold ${kpi.up ? 'text-green-400' : 'text-red-400'}`}>{kpi.change}</p>
                        </Card>
                      ));
                    })()}
                  </div>

                  <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                    <h3 className="text-lg font-semibold mb-4">Monthly Cash Flow &mdash; Last 12 Months</h3>
                    <CashFlowChart data={chartData} />
                  </Card>

                  <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                    <h3 className="text-lg font-semibold mb-4">Monthly Breakdown</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-[#2a2a3d]">
                          <th className="text-left py-3 px-4 text-[#8888a0] font-semibold">Month</th>
                          <th className="text-right py-3 px-4 text-[#8888a0] font-semibold">Cash In</th>
                          <th className="text-right py-3 px-4 text-[#8888a0] font-semibold">Cash Out</th>
                          <th className="text-right py-3 px-4 text-[#8888a0] font-semibold">Net</th>
                          <th className="text-right py-3 px-4 text-[#8888a0] font-semibold">Margin</th>
                        </tr></thead>
                        <tbody>{chartData.map((cf) => {
                          const margin = cf.inflows > 0 ? ((cf.net / cf.inflows) * 100) : 0;
                          const pos = cf.net >= 0;
                          return (
                            <tr key={cf.month} className="border-b border-[#2a2a3d] hover:bg-[#1a1a26]">
                              <td className="py-3 px-4 font-medium">{cf.month}</td>
                              <td className="py-3 px-4 text-right text-green-400">{fmt(cf.inflows)}</td>
                              <td className="py-3 px-4 text-right text-red-400">{fmt(cf.outflows)}</td>
                              <td className={`py-3 px-4 text-right font-bold ${pos ? 'text-green-400' : 'text-red-400'}`}>{pos ? '+' : ''}{fmt(cf.net)}</td>
                              <td className={`py-3 px-4 text-right font-medium ${pos ? 'text-green-400' : 'text-red-400'}`}>{margin.toFixed(1)}%</td>
                            </tr>
                          );
                        })}</tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ═══════════════ JOB COSTING (WIP + RETAINAGE) ═══════════════ */}
              {activeTab === 'wip' && (
                <div className="space-y-6">
                  {/* Sub-tabs */}
                  <div className="flex gap-1 bg-[#12121a] border border-[#2a2a3d] rounded-lg p-1 w-fit">
                    <button onClick={() => setWipSubTab('wip')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${wipSubTab === 'wip' ? 'bg-[#6366f1] text-white' : 'text-[#8888a0] hover:text-[#e8e8f0]'}`}>
                      WIP Schedule
                    </button>
                    <button onClick={() => setWipSubTab('retainage')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${wipSubTab === 'retainage' ? 'bg-[#6366f1] text-white' : 'text-[#8888a0] hover:text-[#e8e8f0]'}`}>
                      Retainage
                    </button>
                  </div>

                  {wipSubTab === 'wip' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-[#0d1f0d] border-l-2 border-[#22c55e] rounded-r-lg px-4 py-3">
                          <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
                          <p className="text-sm text-[#e8e8f0] mt-0.5">Overall WIP variance within 3% &mdash; solid cost control across active jobs.</p>
                        </div>
                        <div className="bg-[#1f1a0d] border-l-2 border-[#eab308] rounded-r-lg px-4 py-3">
                          <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
                          <p className="text-sm text-[#e8e8f0] mt-0.5">Heritage Park is over-billed by $130.4K &mdash; review estimated costs to complete.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: 'Active Jobs', value: String(fWIP.filter(j => j.status === 'Active').length), sub: `${fWIP.filter(j => j.status === 'Complete').length} Complete` },
                          { label: 'Total Backlog', value: fmt(fWIP.reduce((s, j) => s + j.contract, 0)), sub: `${fWIP.length} contracts` },
                          { label: 'Over-Billed', value: fmt(fWIP.filter(j => j.variance > 0).reduce((s, j) => s + j.variance, 0)), sub: 'Liability' },
                          { label: 'Under-Billed', value: fmt(Math.abs(fWIP.filter(j => j.variance < 0).reduce((s, j) => s + j.variance, 0))), sub: 'Asset' },
                        ].map((kpi) => (
                          <Card key={kpi.label} className="bg-[#12121a] border-[#2a2a3d] p-4">
                            <p className="text-xs text-[#8888a0] mb-1">{kpi.label}</p>
                            <p className="text-lg font-bold text-white">{kpi.value}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{kpi.sub}</p>
                          </Card>
                        ))}
                      </div>

                      <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                        <h3 className="text-lg font-semibold mb-4">WIP Schedule &mdash; Active Jobs</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead><tr className="border-b border-[#2a2a3d]">
                              <th className="text-left py-3 px-3 text-[#8888a0] font-semibold">Job Name</th>
                              <th className="text-right py-3 px-3 text-[#8888a0] font-semibold">Contract</th>
                              <th className="text-right py-3 px-3 text-[#8888a0] font-semibold">Costs to Date</th>
                              <th className="text-right py-3 px-3 text-[#8888a0] font-semibold">Billed to Date</th>
                              <th className="text-center py-3 px-3 text-[#8888a0] font-semibold">% Complete</th>
                              <th className="text-right py-3 px-3 text-[#8888a0] font-semibold">Est. Margin</th>
                              <th className="text-right py-3 px-3 text-[#8888a0] font-semibold">Billing Status</th>
                              <th className="text-left py-3 px-3 text-[#8888a0] font-semibold">Status</th>
                            </tr></thead>
                            <tbody>{fWIP.map((j) => {
                              const billingColor = j.billing === 'Over-Billed' ? 'text-[#eab308]' : j.billing === 'Under-Billed' ? 'text-[#ef4444]' : 'text-[#22c55e]';
                              const marginColor = j.margin >= 22 ? 'text-[#22c55e]' : j.margin >= 18 ? 'text-[#eab308]' : 'text-[#ef4444]';
                              return (
                                <tr key={j.name} className="border-b border-[#2a2a3d] hover:bg-[#1a1a26]">
                                  <td className="py-3 px-3 font-medium whitespace-nowrap">{j.name}</td>
                                  <td className="py-3 px-3 text-right text-[#b0b0c8]">{fmt(j.contract)}</td>
                                  <td className="py-3 px-3 text-right text-[#b0b0c8]">{fmt(j.costsToDate)}</td>
                                  <td className="py-3 px-3 text-right text-[#b0b0c8]">{fmt(j.billedToDate)}</td>
                                  <td className="py-3 px-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <div className="w-16 h-1.5 bg-[#2a2a3d] rounded-full overflow-hidden"><div className={`h-full rounded-full ${j.pct >= 100 ? 'bg-[#22c55e]' : 'bg-[#6366f1]'}`} style={{ width: `${Math.min(j.pct, 100)}%` }} /></div>
                                      <span className="text-xs text-[#b0b0c8]">{j.pct}%</span>
                                    </div>
                                  </td>
                                  <td className={`py-3 px-3 text-right font-bold ${marginColor}`}>{fmtPct(j.margin)}</td>
                                  <td className={`py-3 px-3 text-right font-semibold whitespace-nowrap ${billingColor}`}>{j.billing}{j.variance !== 0 && ` ${fmt(Math.abs(j.variance))}`}</td>
                                  <td className="py-3 px-3"><Badge variant={j.status === 'Active' ? 'info' : 'success'}>{j.status}</Badge></td>
                                </tr>
                              );
                            })}</tbody>
                          </table>
                        </div>
                      </Card>
                    </>
                  )}

                  {wipSubTab === 'retainage' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-[#0d1f0d] border-l-2 border-[#22c55e] rounded-r-lg px-4 py-3">
                          <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
                          <p className="text-sm text-[#e8e8f0] mt-0.5">{fmt(fRetainage.filter(r => r.status === 'Eligible').reduce((s, r) => s + r.held, 0))} in retainage eligible for release &mdash; submit requests.</p>
                        </div>
                        <div className="bg-[#1f1a0d] border-l-2 border-[#eab308] rounded-r-lg px-4 py-3">
                          <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
                          <p className="text-sm text-[#e8e8f0] mt-0.5">{fRetainage.filter(r => r.status === 'Overdue').length} GC{fRetainage.filter(r => r.status === 'Overdue').length !== 1 ? 's' : ''} holding retainage past contractual release date.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: 'Total Retainage Held', value: fmt(fRetainage.reduce((s, r) => s + r.held, 0)), color: 'text-white' },
                          { label: 'Eligible for Release', value: fmt(fRetainage.filter(r => r.status === 'Eligible').reduce((s, r) => s + r.held, 0)), color: 'text-green-400' },
                          { label: 'Pending', value: fmt(fRetainage.filter(r => r.status === 'Pending').reduce((s, r) => s + r.held, 0)), color: 'text-yellow-400' },
                          { label: 'Overdue', value: fmt(fRetainage.filter(r => r.status === 'Overdue').reduce((s, r) => s + r.held, 0)), color: 'text-red-400' },
                        ].map((kpi) => (
                          <Card key={kpi.label} className="bg-[#12121a] border-[#2a2a3d] p-4">
                            <p className="text-xs text-[#8888a0] mb-1">{kpi.label}</p>
                            <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</p>
                          </Card>
                        ))}
                      </div>

                      <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                        <h3 className="text-lg font-semibold mb-4">Retainage Tracking</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead><tr className="border-b border-[#2a2a3d]">
                              <th className="text-left py-3 px-3 text-[#8888a0] font-semibold">Job Name</th>
                              <th className="text-left py-3 px-3 text-[#8888a0] font-semibold">GC / Owner</th>
                              <th className="text-right py-3 px-3 text-[#8888a0] font-semibold">Retainage Held</th>
                              <th className="text-right py-3 px-3 text-[#8888a0] font-semibold">% of Contract</th>
                              <th className="text-right py-3 px-3 text-[#8888a0] font-semibold">Eligible Date</th>
                              <th className="text-left py-3 px-3 text-[#8888a0] font-semibold">Status</th>
                            </tr></thead>
                            <tbody>{fRetainage.map((r) => (
                              <tr key={r.job} className="border-b border-[#2a2a3d] hover:bg-[#1a1a26]">
                                <td className="py-3 px-3 font-medium whitespace-nowrap">{r.job}</td>
                                <td className="py-3 px-3 text-[#b0b0c8]">{r.gc}</td>
                                <td className="py-3 px-3 text-right font-medium">{fmt(r.held)}</td>
                                <td className="py-3 px-3 text-right text-[#b0b0c8]">{fmtPct(r.pct)}</td>
                                <td className="py-3 px-3 text-right text-[#b0b0c8]">{r.eligible}</td>
                                <td className="py-3 px-3"><Badge variant={r.status === 'Eligible' ? 'success' : r.status === 'Overdue' ? 'danger' : 'warning'}>{r.status}</Badge></td>
                              </tr>
                            ))}</tbody>
                          </table>
                        </div>
                      </Card>
                    </>
                  )}
                </div>
              )}

              {/* ═══════════════ SALES / REPORTS ═══════════════ */}
              {activeTab === 'sales' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#0d1f0d] border-l-2 border-[#22c55e] rounded-r-lg px-4 py-3">
                      <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
                      <p className="text-sm text-[#e8e8f0] mt-0.5">{fmt(fReps.reduce((s, r) => s + r.wonYTD, 0))} won YTD across {fReps.length} rep{fReps.length !== 1 ? 's' : ''}.</p>
                    </div>
                    <div className="bg-[#1f1a0d] border-l-2 border-[#eab308] rounded-r-lg px-4 py-3">
                      <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
                      <p className="text-sm text-[#e8e8f0] mt-0.5">{fmt(fReps.reduce((s, r) => s + r.lostYTD, 0))} in lost deals YTD &mdash; review Discovery-stage drop-offs.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { label: 'Total Pipeline', value: fmt(fPipeline.reduce((s, d) => s + d.value, 0)), sub: `${fPipeline.length} active deals`, icon: Target, ic: 'text-indigo-400' },
                      { label: 'Won YTD', value: fmt(fReps.reduce((s, r) => s + r.wonYTD, 0)), sub: `${fReps.length} rep${fReps.length !== 1 ? 's' : ''}`, icon: CheckCircle2, ic: 'text-green-400' },
                      { label: 'Avg Close Rate', value: fReps.length ? (fReps.reduce((s, r) => s + r.closeRate, 0) / fReps.length).toFixed(0) + '%' : '0%', sub: 'Team average', icon: TrendingUp, ic: 'text-blue-400' },
                      { label: 'Avg Deal Size', value: fReps.length ? fmt(Math.round(fReps.reduce((s, r) => s + r.avgDeal, 0) / fReps.length)) : '$0', sub: 'All reps', icon: DollarSign, ic: 'text-yellow-400' },
                      { label: 'Weighted Pipeline', value: fmt(Math.round(fPipeline.reduce((s, d) => s + d.value * (d.prob / 100), 0))), sub: 'Probability-adjusted', icon: Target, ic: 'text-purple-400' },
                    ].map((kpi) => {
                      const Icon = kpi.icon;
                      return (
                        <Card key={kpi.label} className="bg-[#12121a] border-[#2a2a3d] p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[11px] text-[#8888a0]">{kpi.label}</p>
                            <Icon className={`w-4 h-4 ${kpi.ic}`} />
                          </div>
                          <p className="text-lg font-bold text-white">{kpi.value}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{kpi.sub}</p>
                        </Card>
                      );
                    })}
                  </div>

                  <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                    <h3 className="text-lg font-semibold mb-4">Sales Rep Performance</h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {fReps.map((rep) => (
                        <div key={rep.name} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-semibold">{rep.name}</p>
                              <p className="text-xs text-gray-500">{rep.role}</p>
                            </div>
                            <div className={`text-lg font-bold ${rep.closeRate >= 70 ? 'text-green-400' : rep.closeRate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {rep.closeRate}%
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs"><span className="text-[#8888a0]">Pipeline</span><span className="text-white font-medium">{fmt(rep.pipeline)}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-[#8888a0]">Won YTD</span><span className="text-green-400 font-medium">{fmt(rep.wonYTD)}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-[#8888a0]">Lost YTD</span><span className="text-red-400 font-medium">{fmt(rep.lostYTD)}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-[#8888a0]">Avg Deal Size</span><span className="text-white font-medium">{fmt(rep.avgDeal)}</span></div>
                          </div>
                          <div className="border-t border-[#2a2a3d] pt-2 grid grid-cols-3 gap-2 text-center">
                            <div><p className="text-lg font-bold text-white">{rep.proposals}</p><p className="text-[10px] text-gray-500">Proposals</p></div>
                            <div><p className="text-lg font-bold text-white">{rep.calls}</p><p className="text-[10px] text-gray-500">Calls MTD</p></div>
                            <div><p className="text-lg font-bold text-white">{rep.meetings}</p><p className="text-[10px] text-gray-500">Meetings</p></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="bg-[#12121a] border-[#2a2a3d] p-6">
                    <h3 className="text-lg font-semibold mb-4">Active Pipeline</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-[#2a2a3d]">
                          <th className="text-left py-3 px-3 text-[#8888a0] font-semibold">Project</th>
                          <th className="text-left py-3 px-3 text-[#8888a0] font-semibold">Client</th>
                          <th className="text-right py-3 px-3 text-[#8888a0] font-semibold">Value</th>
                          <th className="text-left py-3 px-3 text-[#8888a0] font-semibold">Stage</th>
                          <th className="text-center py-3 px-3 text-[#8888a0] font-semibold">Probability</th>
                          <th className="text-right py-3 px-3 text-[#8888a0] font-semibold">Weighted</th>
                          <th className="text-left py-3 px-3 text-[#8888a0] font-semibold">Est. Close</th>
                          <th className="text-left py-3 px-3 text-[#8888a0] font-semibold">Rep</th>
                        </tr></thead>
                        <tbody>{fPipeline.map((d) => {
                          const w = d.value * (d.prob / 100);
                          const sc = d.prob >= 80 ? 'text-green-400' : d.prob >= 50 ? 'text-yellow-400' : d.prob >= 30 ? 'text-orange-400' : 'text-red-400';
                          const sb = d.prob >= 80 ? 'bg-green-400/10' : d.prob >= 50 ? 'bg-yellow-400/10' : d.prob >= 30 ? 'bg-orange-400/10' : 'bg-red-400/10';
                          const bc = d.prob >= 80 ? 'bg-green-500' : d.prob >= 50 ? 'bg-yellow-500' : d.prob >= 30 ? 'bg-orange-500' : 'bg-red-500';
                          return (
                            <tr key={d.project} className="border-b border-[#2a2a3d] hover:bg-[#1a1a26]">
                              <td className="py-3 px-3 font-medium whitespace-nowrap">{d.project}</td>
                              <td className="py-3 px-3 text-[#b0b0c8]">{d.client}</td>
                              <td className="py-3 px-3 text-right font-medium">{fmt(d.value)}</td>
                              <td className="py-3 px-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${sc} ${sb}`}>{d.stage}</span></td>
                              <td className="py-3 px-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-12 h-1.5 bg-[#2a2a3d] rounded-full overflow-hidden"><div className={`h-full rounded-full ${bc}`} style={{ width: `${d.prob}%` }} /></div>
                                  <span className={`text-xs font-semibold ${sc}`}>{d.prob}%</span>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-right text-[#8888a0]">{fmt(w)}</td>
                              <td className="py-3 px-3 text-[#b0b0c8]">{d.close}</td>
                              <td className="py-3 px-3 text-[#b0b0c8] whitespace-nowrap">{d.rep}</td>
                            </tr>
                          );
                        })}</tbody>
                        <tfoot><tr className="border-t-2 border-[#3a3a4d]">
                          <td className="py-3 px-3 font-semibold" colSpan={2}>Total</td>
                          <td className="py-3 px-3 text-right font-bold">{fmt(fPipeline.reduce((s, d) => s + d.value, 0))}</td>
                          <td className="py-3 px-3" colSpan={2}></td>
                          <td className="py-3 px-3 text-right font-bold">{fmt(Math.round(fPipeline.reduce((s, d) => s + d.value * (d.prob / 100), 0)))}</td>
                          <td className="py-3 px-3" colSpan={2}></td>
                        </tr></tfoot>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ═══════════════ CFO ADVISOR ═══════════════ */}
              {activeTab === 'advisor' && (
                <div className="space-y-6">
                  <Card className="bg-[#12121a] border-[#2a2a3d] p-6 space-y-5">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#6366f1]/20 flex items-center justify-center flex-shrink-0"><Bot size={16} className="text-[#6366f1]" /></div>
                      <div className="bg-[#1a1a26] border border-[#2a2a3d] rounded-lg p-4 flex-1">
                        <p className="text-sm text-[#b0b0c8] mb-3">Here&apos;s your weekly financial brief for Wasatch Custom Homes{selectedLocation ? ` (${selectedLocation.name})` : ''}:</p>
                        <div className="space-y-2">
                          {[
                            { type: 'win', text: 'Net cash up 26.1% \u2014 strong collections building a healthy runway.' },
                            { type: 'win', text: `${fmt(fReps.reduce((s, r) => s + r.wonYTD, 0))} won YTD \u2014 pipeline is healthy.` },
                            { type: 'watch', text: 'Heritage Park Draw #9 is 15 days overdue at $218.7K \u2014 escalate.' },
                            { type: 'watch', text: '$130.4K over-billing on Heritage Park exposes cash risk at close.' },
                          ].map((ins, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${ins.type === 'win' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#eab308]/20 text-[#eab308]'}`}>{ins.type === 'win' ? 'Win' : 'Watch'}</span>
                              <span className="text-[#b0b0c8]">{ins.text}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-[#b0b0c8] mt-3"><strong className="text-[#e8e8f0]">Recommendation:</strong> Collect the Heritage Park Draw #9 ($218.7K) immediately and review estimated costs to complete on that job before the over-billing becomes a cash shortfall at project close. Also submit retainage release requests for the ${fmt(fRetainage.filter(r => r.status === 'Eligible').reduce((s, r) => s + r.held, 0))} eligible this month.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <div className="bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-lg p-4 max-w-md">
                        <p className="text-sm">Which of my sales reps is underperforming?</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#6366f1]/20 flex items-center justify-center flex-shrink-0"><Bot size={16} className="text-[#6366f1]" /></div>
                      <div className="bg-[#1a1a26] border border-[#2a2a3d] rounded-lg p-4 flex-1">
                        <p className="text-sm text-[#b0b0c8]">Looking at your sales team performance:</p>
                        <ul className="mt-2 space-y-1 text-sm text-[#b0b0c8]">
                          <li>&bull; <strong>Jake Morrison</strong> (76% close rate) and <strong>Rachel Torres</strong> (74%) are both strong.</li>
                          <li>&bull; <strong className="text-[#eab308]">Marcus Webb</strong> has a <span className="text-[#eab308] font-semibold">66% close rate</span> and the lowest won YTD ($540K).</li>
                          <li>&bull; Marcus&apos;s pipeline is $1.15M but heavily weighted toward Discovery-stage deals (low probability).</li>
                        </ul>
                        <p className="text-sm text-[#b0b0c8] mt-2"><strong className="text-[#e8e8f0]">Suggestion:</strong> Schedule a pipeline review with Marcus to move Discovery-stage deals forward or disqualify them. His call volume (38/month) is lower than Rachel&apos;s (63) &mdash; increasing outreach activity could improve his conversion.</p>
                      </div>
                    </div>
                    <div>
                      <input type="text" placeholder="Ask about your job costs, cash flow, WIP, sales pipeline..." disabled className="w-full px-4 py-3 bg-[#1a1a26] border border-[#2a2a3d] rounded-lg text-sm text-[#8888a0] cursor-not-allowed" />
                      <p className="text-xs text-[#8888a0] mt-2 text-center"><Link href="/signup" className="text-[#6366f1] hover:underline">Sign up free</Link> to ask your own questions</p>
                    </div>
                  </Card>
                </div>
              )}

              {/* ═══════════════ PLACEHOLDER TABS ═══════════════ */}
              {['locations', 'integrations', 'settings'].includes(activeTab) && (
                <div className="flex items-center justify-center py-20">
                  <Card className="bg-[#12121a] border-[#2a2a3d] p-8 text-center max-w-md">
                    <div className="w-12 h-12 rounded-lg bg-[#6366f1]/10 flex items-center justify-center mx-auto mb-4">
                      {activeTab === 'locations' ? <MapPin size={24} className="text-[#6366f1]" /> : activeTab === 'integrations' ? <Plug size={24} className="text-[#6366f1]" /> : <Settings size={24} className="text-[#6366f1]" />}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{activeTab === 'locations' ? 'Locations' : activeTab === 'integrations' ? 'Integrations' : 'Settings'}</h3>
                    <p className="text-sm text-[#8888a0] mb-4">Available when you start your free trial. Manage {activeTab === 'locations' ? 'your job locations and divisions' : activeTab === 'integrations' ? 'QuickBooks, payroll, and CRM connections' : 'team access, preferences, and billing'}.</p>
                    <Link href="/signup" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6366f1] hover:bg-[#5558e6] text-white rounded-lg text-sm font-semibold transition-colors">
                      Start Free Trial <ArrowRight size={16} />
                    </Link>
                  </Card>
                </div>
              )}

              {/* ──── Bottom CTA ──── */}
              <div className="mt-12 mb-8 text-center bg-gradient-to-r from-[#6366f1]/10 to-[#a78bfa]/10 border border-[#6366f1]/30 rounded-xl p-8">
                <p className="text-xs uppercase tracking-widest text-[#6366f1] mb-2">This is sample data</p>
                <h2 className="text-2xl font-bold mb-2">Ready to see YOUR numbers?</h2>
                <p className="text-[#8888a0] mb-6">Connect QuickBooks and your dashboard populates in under 10 minutes.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/signup" className="px-6 py-3 bg-[#6366f1] hover:bg-[#5558e6] text-white rounded-lg font-semibold transition-colors flex items-center gap-2">Start 14-Day Free Trial <ArrowRight size={18} /></Link>
                  <Link href="/#schedule" className="px-6 py-3 border border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/10 rounded-lg font-semibold transition-colors">Book a 15-Min Demo</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-[#0a0a0f]/95 backdrop-blur-sm border-t border-[#2a2a3d] px-4 py-3 z-40 flex items-center gap-3">
        <Link href="/signup" className="flex-1 bg-[#6366f1] hover:bg-[#5558e6] text-white text-center py-2.5 rounded-lg text-sm font-semibold transition-colors">Start Free Trial</Link>
        <Link href="/#schedule" className="flex-1 border border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/10 text-center py-2.5 rounded-lg text-sm font-semibold transition-colors">Book Demo</Link>
      </div>
    </div>
  );
}
