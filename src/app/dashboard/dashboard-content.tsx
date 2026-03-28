'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCompactCurrency } from '@/lib/utils';
import { useChartTheme } from '@/components/chart-theme-provider';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Users,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
} from 'lucide-react';

// ── Tab Navigation ──────────────────────────────────────
type TabKey = 'overview' | 'ar' | 'ap' | 'wip' | 'retainage' | 'sales';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'ar', label: 'AR by Job' },
  { key: 'ap', label: 'AP by Job' },
  { key: 'wip', label: 'WIP Tracking' },
  { key: 'retainage', label: 'Retainage' },
  { key: 'sales', label: 'Sales' },
];

// ── Mock Data ───────────────────────────────────────────

// KPIs
const kpis = [
  { title: 'Revenue (YTD)', value: '$2,847,500', change: '+12.3%', positive: true, icon: DollarSign },
  { title: 'Total AR Outstanding', value: '$487,200', change: '+3.1%', positive: false, icon: FileText },
  { title: 'Total AP Outstanding', value: '$312,800', change: '-8.2%', positive: true, icon: TrendingDown },
  { title: 'Net Cash Position', value: '$744,300', change: '+26.1%', positive: true, icon: Target },
  { title: 'WIP Over-Billing', value: '$82,400', change: '-12.5%', positive: true, icon: TrendingUp },
  { title: 'Total Retainage Held', value: '$196,500', change: '+4.3%', positive: false, icon: Building2 },
];

const sparklineData = [
  { value: 65 }, { value: 78 }, { value: 72 }, { value: 85 },
  { value: 92 }, { value: 88 }, { value: 95 },
];

// AR by Job
const arByJob = [
  { job: 'Riverside Estate Custom Home', customer: 'David & Sarah Mitchell', invoiceNum: 'INV-2024-142', amount: 125000, dueDate: '2024-02-15', daysPastDue: 0, status: 'Current' },
  { job: 'Riverside Estate Custom Home', customer: 'David & Sarah Mitchell', invoiceNum: 'INV-2024-138', amount: 85000, dueDate: '2024-01-20', daysPastDue: 26, status: 'Past Due' },
  { job: 'Mountain View Remodel', customer: 'Jennifer Pratt', invoiceNum: 'INV-2024-151', amount: 32000, dueDate: '2024-02-28', daysPastDue: 0, status: 'Current' },
  { job: 'Mountain View Remodel', customer: 'Jennifer Pratt', invoiceNum: 'INV-2024-147', amount: 18500, dueDate: '2024-01-10', daysPastDue: 36, status: 'Past Due' },
  { job: 'Heritage Park Commercial', customer: 'Heritage Park LLC', invoiceNum: 'INV-2024-155', amount: 125000, dueDate: '2024-03-05', daysPastDue: 0, status: 'Current' },
  { job: 'Heritage Park Commercial', customer: 'Heritage Park LLC', invoiceNum: 'INV-2024-149', amount: 45000, dueDate: '2024-12-15', daysPastDue: 62, status: 'Past Due' },
  { job: 'Oakwood Duplex', customer: 'Oakwood Investments', invoiceNum: 'INV-2024-133', amount: 28700, dueDate: '2023-11-30', daysPastDue: 92, status: 'Past Due' },
  { job: 'Cedar Heights Addition', customer: 'Mark Thompson', invoiceNum: 'INV-2024-160', amount: 28000, dueDate: '2024-03-15', daysPastDue: 0, status: 'Current' },
];

// AP by Job
const apByJob = [
  { job: 'Riverside Estate Custom Home', vendor: 'Summit Lumber Supply', invoiceNum: 'BILL-4521', amount: 42500, dueDate: '2024-02-20', daysPastDue: 0, status: 'Current' },
  { job: 'Riverside Estate Custom Home', vendor: 'Wasatch Electric Co', invoiceNum: 'BILL-4498', amount: 18200, dueDate: '2024-01-15', daysPastDue: 31, status: 'Past Due' },
  { job: 'Riverside Estate Custom Home', vendor: 'Rocky Mtn Concrete', invoiceNum: 'BILL-4477', amount: 35000, dueDate: '2024-01-05', daysPastDue: 41, status: 'Past Due' },
  { job: 'Mountain View Remodel', vendor: 'Premier Plumbing', invoiceNum: 'BILL-4533', amount: 12800, dueDate: '2024-02-28', daysPastDue: 0, status: 'Current' },
  { job: 'Mountain View Remodel', vendor: 'Utah Tile & Stone', invoiceNum: 'BILL-4510', amount: 8500, dueDate: '2024-01-25', daysPastDue: 21, status: 'Past Due' },
  { job: 'Heritage Park Commercial', vendor: 'Intermountain Steel', invoiceNum: 'BILL-4545', amount: 87000, dueDate: '2024-03-10', daysPastDue: 0, status: 'Current' },
  { job: 'Heritage Park Commercial', vendor: 'Valley HVAC Systems', invoiceNum: 'BILL-4502', amount: 45300, dueDate: '2024-01-18', daysPastDue: 28, status: 'Past Due' },
  { job: 'Cedar Heights Addition', vendor: 'Quality Drywall Inc', invoiceNum: 'BILL-4550', amount: 15500, dueDate: '2024-03-01', daysPastDue: 0, status: 'Current' },
  { job: 'Cedar Heights Addition', vendor: 'Apex Roofing', invoiceNum: 'BILL-4488', amount: 22000, dueDate: '2024-01-08', daysPastDue: 38, status: 'Past Due' },
  { job: 'Oakwood Duplex', vendor: 'Pro Paint Solutions', invoiceNum: 'BILL-4560', amount: 9800, dueDate: '2024-03-15', daysPastDue: 0, status: 'Current' },
];

// WIP Tracking per Job
const wipData = [
  {
    job: 'Riverside Estate Custom Home',
    contractAmount: 950000,
    totalEstCost: 760000,
    costToDate: 623000,
    billedToDate: 710000,
    percentComplete: 82,
    estGrossProfit: 190000,
    earnedRevenue: 779000,
    overUnderBilled: -69000, // negative = over-billed
  },
  {
    job: 'Mountain View Remodel',
    contractAmount: 165000,
    totalEstCost: 132000,
    costToDate: 148000,
    billedToDate: 125500,
    percentComplete: 112,
    estGrossProfit: -17000,
    earnedRevenue: 165000,
    overUnderBilled: 39500, // positive = under-billed
  },
  {
    job: 'Heritage Park Commercial',
    contractAmount: 1450000,
    totalEstCost: 1160000,
    costToDate: 890000,
    billedToDate: 975000,
    percentComplete: 77,
    estGrossProfit: 290000,
    earnedRevenue: 1116500,
    overUnderBilled: -141500,
  },
  {
    job: 'Cedar Heights Addition',
    contractAmount: 210000,
    totalEstCost: 168000,
    costToDate: 157000,
    billedToDate: 140000,
    percentComplete: 93,
    estGrossProfit: 42000,
    earnedRevenue: 195300,
    overUnderBilled: 55300,
  },
  {
    job: 'Oakwood Duplex',
    contractAmount: 380000,
    totalEstCost: 304000,
    costToDate: 285000,
    billedToDate: 352000,
    percentComplete: 94,
    estGrossProfit: 76000,
    earnedRevenue: 357200,
    overUnderBilled: -5200,
  },
];

// Retainage Tracking per Job
const retainageData = [
  { job: 'Riverside Estate Custom Home', contractAmount: 950000, retainagePercent: 10, retainageReceivable: 71000, retainagePayable: 38200, netRetainage: 32800, releaseDate: '2024-06-15', status: 'Held' },
  { job: 'Mountain View Remodel', contractAmount: 165000, retainagePercent: 10, retainageReceivable: 12550, retainagePayable: 7400, netRetainage: 5150, releaseDate: '2024-04-01', status: 'Due Soon' },
  { job: 'Heritage Park Commercial', contractAmount: 1450000, retainagePercent: 10, retainageReceivable: 97500, retainagePayable: 52100, netRetainage: 45400, releaseDate: '2024-09-30', status: 'Held' },
  { job: 'Cedar Heights Addition', contractAmount: 210000, retainagePercent: 5, retainageReceivable: 7000, retainagePayable: 4200, netRetainage: 2800, releaseDate: '2024-05-01', status: 'Due Soon' },
  { job: 'Oakwood Duplex', contractAmount: 380000, retainagePercent: 10, retainageReceivable: 35200, retainagePayable: 18500, netRetainage: 16700, releaseDate: '2024-03-30', status: 'Ready to Release' },
  { job: 'Lakeside Office Park', contractAmount: 520000, retainagePercent: 10, retainageReceivable: 28500, retainagePayable: 15600, netRetainage: 12900, releaseDate: '2023-12-15', status: 'Overdue' },
  { job: 'Westfield Community Center', contractAmount: 680000, retainagePercent: 10, retainageReceivable: 31200, retainagePayable: 18900, netRetainage: 12300, releaseDate: '2023-11-20', status: 'Overdue' },
  { job: 'Sunset Hills Renovations', contractAmount: 240000, retainagePercent: 5, retainageReceivable: 8500, retainagePayable: 4100, netRetainage: 4400, releaseDate: '2024-01-10', status: 'Overdue' },
  { job: 'Pinnacle Tower Interiors', contractAmount: 890000, retainagePercent: 10, retainageReceivable: 65200, retainagePayable: 42100, netRetainage: 23100, releaseDate: '2023-10-30', status: 'Paid' },
  { job: 'Summit Plaza Finishes', contractAmount: 445000, retainagePercent: 10, retainageReceivable: 18800, retainagePayable: 11200, netRetainage: 7600, releaseDate: '2023-09-15', status: 'Paid' },
  { job: 'Riverfront Lofts', contractAmount: 620000, retainagePercent: 10, retainageReceivable: 22400, retainagePayable: 14300, netRetainage: 8100, releaseDate: '2023-08-20', status: 'Paid' },
];

// Sales Dashboard Data
const salesPipelineData = [
  { stage: 'Leads', count: 24, value: 4200000 },
  { stage: 'Proposals', count: 8, value: 2850000 },
  { stage: 'Negotiation', count: 4, value: 1680000 },
  { stage: 'Won', count: 3, value: 1250000 },
];

const salesByMonth = [
  { month: 'Jul', closed: 380000, pipeline: 520000 },
  { month: 'Aug', closed: 420000, pipeline: 610000 },
  { month: 'Sep', closed: 290000, pipeline: 480000 },
  { month: 'Oct', closed: 510000, pipeline: 720000 },
  { month: 'Nov', closed: 340000, pipeline: 550000 },
  { month: 'Dec', closed: 470000, pipeline: 680000 },
  { month: 'Jan', closed: 560000, pipeline: 830000 },
  { month: 'Feb', closed: 410000, pipeline: 710000 },
];

const recentDeals = [
  { name: 'Silverstone Commercial Build', client: 'Silverstone Properties', value: 620000, probability: 85, stage: 'Negotiation', rep: 'Cory Salisbury' },
  { name: 'Meadow Creek Townhomes (3 units)', client: 'Meadow Creek Dev', value: 890000, probability: 60, stage: 'Proposal', rep: 'Sarah Whitfield' },
  { name: 'Summit Ridge Custom Home', client: 'The Andersons', value: 445000, probability: 90, stage: 'Negotiation', rep: 'Cory Salisbury' },
  { name: 'Downtown Office Remodel', client: 'TechStart Inc', value: 185000, probability: 40, stage: 'Proposal', rep: 'Jake Mercer' },
  { name: 'Lakewood Kitchen & Bath', client: 'Patricia Chen', value: 78000, probability: 95, stage: 'Won', rep: 'Marcus Reyes' },
  { name: 'Hillcrest Garage + ADU', client: 'Robert Kim', value: 165000, probability: 70, stage: 'Proposal', rep: 'Sarah Whitfield' },
  { name: 'Westfield Fire Station Reno', client: 'Westfield Township', value: 1250000, probability: 35, stage: 'Proposal', rep: 'Cory Salisbury' },
  { name: 'Copper Ridge Spec Home', client: 'Salisbury Real Estate', value: 520000, probability: 75, stage: 'Negotiation', rep: 'Jake Mercer' },
];

const leadSourceData = [
  { name: 'Referrals', value: 42 },
  { name: 'Google/SEO', value: 28 },
  { name: 'Social Media', value: 15 },
  { name: 'Direct Mail', value: 10 },
  { name: 'Other', value: 5 },
];

const LEAD_COLORS = ['#6366f1', '#22c55e', '#eab308', '#ef9d44', '#8888a0'];

// Sales Team Member Data
const salesTeamMembers = [
  {
    name: 'Jake Mercer',
    role: 'Senior Estimator',
    avatar: 'JM',
    deals: 8,
    wonDeals: 4,
    pipelineValue: 2150000,
    wonValue: 890000,
    quota: 1200000,
    avgDealSize: 268750,
    winRate: 50,
    avgCycleTime: 32,
    leadSource: 'Referrals',
    monthlyTrend: [
      { month: 'Sep', closed: 180000 },
      { month: 'Oct', closed: 310000 },
      { month: 'Nov', closed: 0 },
      { month: 'Dec', closed: 220000 },
      { month: 'Jan', closed: 180000 },
      { month: 'Feb', closed: 0 },
    ],
  },
  {
    name: 'Sarah Whitfield',
    role: 'Business Development',
    avatar: 'SW',
    deals: 12,
    wonDeals: 5,
    pipelineValue: 3450000,
    wonValue: 1250000,
    quota: 1500000,
    avgDealSize: 287500,
    winRate: 42,
    avgCycleTime: 28,
    leadSource: 'Google/SEO',
    monthlyTrend: [
      { month: 'Sep', closed: 110000 },
      { month: 'Oct', closed: 200000 },
      { month: 'Nov', closed: 340000 },
      { month: 'Dec', closed: 250000 },
      { month: 'Jan', closed: 380000 },
      { month: 'Feb', closed: 410000 },
    ],
  },
  {
    name: 'Marcus Reyes',
    role: 'Project Estimator',
    avatar: 'MR',
    deals: 6,
    wonDeals: 2,
    pipelineValue: 1680000,
    wonValue: 420000,
    quota: 900000,
    avgDealSize: 280000,
    winRate: 33,
    avgCycleTime: 45,
    leadSource: 'Direct Mail',
    monthlyTrend: [
      { month: 'Sep', closed: 0 },
      { month: 'Oct', closed: 0 },
      { month: 'Nov', closed: 0 },
      { month: 'Dec', closed: 0 },
      { month: 'Jan', closed: 0 },
      { month: 'Feb', closed: 420000 },
    ],
  },
  {
    name: 'Cory Salisbury',
    role: 'Owner / Lead Sales',
    avatar: 'CS',
    deals: 13,
    wonDeals: 6,
    pipelineValue: 4120000,
    wonValue: 1820000,
    quota: 2000000,
    avgDealSize: 316923,
    winRate: 46,
    avgCycleTime: 21,
    leadSource: 'Referrals',
    monthlyTrend: [
      { month: 'Sep', closed: 290000 },
      { month: 'Oct', closed: 510000 },
      { month: 'Nov', closed: 340000 },
      { month: 'Dec', closed: 470000 },
      { month: 'Jan', closed: 210000 },
      { month: 'Feb', closed: 0 },
    ],
  },
];

const TEAM_COLORS = ['#6366f1', '#22c55e', '#eab308', '#a855f7'];

// ── Utility Functions ───────────────────────────────────
const formatCurrency = (val: number) => formatCompactCurrency(val);

const formatFullCurrency = (val: number) =>
  val < 0
    ? `-$${Math.abs(val).toLocaleString()}`
    : `$${val.toLocaleString()}`;

// ── Components ──────────────────────────────────────────

function KPICard({ title, value, change, positive, icon: Icon }: {
  title: string; value: string; change: string; positive: boolean; icon: React.ComponentType<any>;
}) {
  const { theme } = useChartTheme();
  const tc = theme.colors;
  const ds = theme.dashboard;

  return (
    <Card variant="metric" className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs mb-1 uppercase tracking-wide" style={{ color: ds.textMuted }}>{title}</p>
          <p className="text-xl font-bold" style={{ color: ds.textPrimary }}>{value}</p>
        </div>
        <div className="p-2 rounded-lg" style={{ backgroundColor: (positive ? tc.positive : tc.negative) + '1a' }}>
          <Icon size={18} style={{ color: positive ? tc.positive : tc.negative }} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-2">
          <ResponsiveContainer width="100%" height={32}>
            <LineChart data={sparklineData}>
              <Line type="monotone" dataKey="value" stroke={positive ? tc.positive : tc.negative} dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs font-semibold" style={{ color: positive ? tc.positive : tc.negative }}>
          {change}
        </div>
      </div>
    </Card>
  );
}

// ── Tab Content Components ──────────────────────────────

function OverviewTab() {
  const { theme } = useChartTheme();
  const tc = theme.colors;
  const ch = theme.chart;
  const ds = theme.dashboard;

  return (
    <div className="space-y-6">
      {/* AI Brief */}
      <div className="p-3 rounded-lg" style={{ backgroundColor: ds.briefBg, border: `1px solid ${ds.briefBorder}` }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: tc.primary }}>AI Brief</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.positive }}>▲</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.positive }}>Win:</span> Net cash position up 26.1% — strong collections and disciplined AP management are building a healthy runway</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.warning }}>▼</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.warning }}>Watch:</span> AR outstanding grew 3.1% while revenue grew 12.3% — collections are lagging behind billings. Review aging buckets</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.warning }}>▼</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.warning }}>Watch:</span> $82.4K in WIP over-billing exposes cash flow risk when those jobs close — align billing to % complete</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => <KPICard key={kpi.title} {...kpi} />)}
      </div>

      {/* Quick AR/AP Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} style={{ color: tc.primary }} /> AR Aging Summary
          </h2>
          <div className="space-y-3">
            {[
              { range: 'Current', amount: 310000, color: tc.positive },
              { range: '1-30 Days', amount: 85000, color: tc.warning },
              { range: '31-60 Days', amount: 63500, color: tc.tertiary },
              { range: '61-90 Days', amount: 28700, color: tc.negative },
            ].map((item) => (
              <div key={item.range} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-sm w-24" style={{ color: ds.textMuted }}>{item.range}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: ch.gridColor }}>
                  <div className="h-full rounded-full" style={{ backgroundColor: item.color, width: `${(item.amount / 310000) * 100}%` }} />
                </div>
                <span className="text-sm font-semibold w-20 text-right">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 size={20} style={{ color: tc.primary }} /> Cash Flow Forecast (4 Weeks)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={[
              { week: 'This Week', inflow: 185000, outflow: 142000 },
              { week: 'Week 2', inflow: 210000, outflow: 175000 },
              { week: 'Week 3', inflow: 165000, outflow: 120000 },
              { week: 'Week 4', inflow: 230000, outflow: 195000 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
              <XAxis dataKey="week" stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} />
              <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
              <defs>
                {ch.gradientFills && (
                  <>
                    <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={tc.positive} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={tc.positive} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={tc.negative} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={tc.negative} stopOpacity={0} />
                    </linearGradient>
                  </>
                )}
              </defs>
              <Area type="monotone" dataKey="inflow" stroke={tc.positive} fill={ch.gradientFills ? 'url(#inflowGrad)' : tc.positive} fillOpacity={ch.gradientFills ? 1 : ch.areaOpacity} strokeWidth={ch.strokeWidth} name="Cash In" />
              <Area type="monotone" dataKey="outflow" stroke={tc.negative} fill={ch.gradientFills ? 'url(#outflowGrad)' : tc.negative} fillOpacity={ch.gradientFills ? 1 : ch.areaOpacity} strokeWidth={ch.strokeWidth} name="Cash Out" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* WIP Summary + Sales Pipeline Mini */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">WIP Summary</h2>
          <div className="space-y-3">
            {wipData.map((w) => (
              <div key={w.job} className="flex items-center justify-between py-2 last:border-0" style={{ borderBottom: `1px solid ${ds.divider}` }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: ds.textPrimary }}>{w.job}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: ds.divider }}>
                      <div className="h-full rounded-full" style={{ backgroundColor: tc.primary, width: `${Math.min(w.percentComplete, 100)}%` }} />
                    </div>
                    <span className="text-xs" style={{ color: ds.textMuted }}>{w.percentComplete}%</span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <span className="text-sm font-semibold" style={{ color: w.overUnderBilled < 0 ? tc.warning : tc.positive }}>
                    {w.overUnderBilled < 0 ? 'Over' : 'Under'}: {formatCurrency(Math.abs(w.overUnderBilled))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Sales Pipeline</h2>
          <div className="space-y-3">
            {salesPipelineData.map((s) => (
              <div key={s.stage} className="flex items-center gap-3">
                <span className="text-sm w-24" style={{ color: ds.textMuted }}>{s.stage}</span>
                <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ backgroundColor: ds.divider }}>
                  <div className="rounded-full flex items-center justify-end pr-2" style={{ backgroundColor: tc.primary, width: `${(s.value / 4200000) * 100}%` }}>
                    <span className="text-xs font-bold text-white">{s.count}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold w-20 text-right">{formatCurrency(s.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ARByJobTab() {
  const { theme } = useChartTheme();
  const tc = theme.colors;
  const ds = theme.dashboard;

  const grouped = arByJob.reduce((acc, inv) => {
    if (!acc[inv.job]) acc[inv.job] = [];
    acc[inv.job].push(inv);
    return acc;
  }, {} as Record<string, typeof arByJob>);

  const totalAR = arByJob.reduce((s, i) => s + i.amount, 0);
  const pastDueAR = arByJob.filter(i => i.daysPastDue > 0).reduce((s, i) => s + i.amount, 0);
  const currentAR = totalAR - pastDueAR;
  const percentPastDue = totalAR > 0 ? Math.round((pastDueAR / totalAR) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* AI Brief */}
      <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: ds.briefBg, border: `1px solid ${ds.briefBorder}` }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: tc.primary }}>AI Brief</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.positive }}>▲</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.positive }}>Win:</span> {formatFullCurrency(currentAR)} ({100 - percentPastDue}%) of AR is current — solid billing discipline across active jobs</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.warning }}>▼</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.warning }}>Watch:</span> Oakwood Duplex invoice is 92 days past due ($28.7K) — escalate collections before it ages into write-off territory</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.warning }}>▼</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.warning }}>Watch:</span> Heritage Park has $45K at 62 days — contact Heritage Park LLC before this triggers a payment dispute</p>
          </div>
        </div>
      </div>

      {/* Compact Summary */}
      <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: ds.briefBg, border: `1px solid ${ds.briefBorder}` }}>
        <span style={{ color: ds.textSecondary }}>
          Total AR: <span className="font-semibold" style={{ color: ds.textPrimary }}>{formatFullCurrency(totalAR)}</span> · Past Due: <span className="font-semibold" style={{ color: tc.negative }}>{formatFullCurrency(pastDueAR)} ({percentPastDue}%)</span> · Current: <span className="font-semibold" style={{ color: tc.positive }}>{formatFullCurrency(currentAR)}</span>
        </span>
      </div>

      {Object.entries(grouped).map(([jobName, invoices]) => {
        const jobTotal = invoices.reduce((s, i) => s + i.amount, 0);
        const jobPastDue = invoices.filter(i => i.daysPastDue > 0).reduce((s, i) => s + i.amount, 0);
        // Sort invoices: past due first
        const sortedInvoices = [...invoices].sort((a, b) => {
          if (a.daysPastDue > 0 && b.daysPastDue === 0) return -1;
          if (a.daysPastDue === 0 && b.daysPastDue > 0) return 1;
          return b.daysPastDue - a.daysPastDue;
        });
        return (
          <Card key={jobName} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold">{jobName}</h3>
                <p className="text-xs" style={{ color: ds.textMuted }}>{invoices[0].customer}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold" style={{ color: ds.textPrimary }}>{formatFullCurrency(jobTotal)}</p>
                {jobPastDue > 0 && (
                  <p className="text-xs flex items-center gap-1 justify-end" style={{ color: tc.negative }}>
                    <AlertTriangle size={12} /> {formatFullCurrency(jobPastDue)} past due
                  </p>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${ds.divider}`, color: ds.textMuted }}>
                    <th className="text-left py-2 text-xs font-medium">Invoice #</th>
                    <th className="text-right py-2 text-xs font-medium">Amount</th>
                    <th className="text-right py-2 text-xs font-medium">Due Date</th>
                    <th className="text-right py-2 text-xs font-medium">Days Past Due</th>
                    <th className="text-right py-2 text-xs font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedInvoices.map((inv) => (
                    <tr key={inv.invoiceNum} style={{ borderBottom: '1px solid ' + ds.divider + '80', backgroundColor: inv.daysPastDue > 0 ? tc.negative + '0d' : 'transparent' }}>
                      <td className="py-2.5 font-mono text-xs">{inv.invoiceNum}</td>
                      <td className="py-2.5 text-right font-semibold" style={{ color: inv.daysPastDue > 0 ? tc.negative : 'inherit' }}>
                        {formatFullCurrency(inv.amount)}
                      </td>
                      <td className="py-2.5 text-right" style={{ color: ds.textMuted }}>{inv.dueDate}</td>
                      <td className="py-2.5 text-right font-semibold" style={{ color: inv.daysPastDue > 0 ? tc.negative : tc.positive }}>
                        {inv.daysPastDue > 0 ? inv.daysPastDue : '—'}
                      </td>
                      <td className="py-2.5 text-right">
                        <Badge variant={inv.daysPastDue > 0 ? 'danger' : 'success'}>
                          {inv.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function APByJobTab() {
  const { theme } = useChartTheme();
  const tc = theme.colors;
  const ds = theme.dashboard;

  const grouped = apByJob.reduce((acc, bill) => {
    if (!acc[bill.job]) acc[bill.job] = [];
    acc[bill.job].push(bill);
    return acc;
  }, {} as Record<string, typeof apByJob>);

  const totalAP = apByJob.reduce((s, i) => s + i.amount, 0);
  const pastDueAP = apByJob.filter(i => i.daysPastDue > 0).reduce((s, i) => s + i.amount, 0);
  const currentAP = totalAP - pastDueAP;
  const percentPastDue = totalAP > 0 ? Math.round((pastDueAP / totalAP) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* AI Brief */}
      <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: ds.briefBg, border: `1px solid ${ds.briefBorder}` }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: tc.primary }}>AI Brief</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.positive }}>▲</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.positive }}>Win:</span> AP is down 8.2% — you&apos;re paying vendors on time without overextending. This protects sub relationships and negotiating leverage</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.warning }}>▼</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.warning }}>Watch:</span> Rocky Mtn Concrete bill ($35K, 41 days past due) — late sub payments risk lien filings on the Riverside project</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.warning }}>▼</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.warning }}>Watch:</span> Valley HVAC ($45.3K, 28 days) on Heritage Park — verify this is held pending punch list, not just missed</p>
          </div>
        </div>
      </div>

      {/* Compact Summary */}
      <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: ds.briefBg, border: `1px solid ${ds.briefBorder}` }}>
        <span style={{ color: ds.textSecondary }}>
          Total AP: <span className="font-semibold" style={{ color: ds.textPrimary }}>{formatFullCurrency(totalAP)}</span> · Past Due: <span className="font-semibold" style={{ color: tc.negative }}>{formatFullCurrency(pastDueAP)} ({percentPastDue}%)</span> · Current: <span className="font-semibold" style={{ color: tc.positive }}>{formatFullCurrency(currentAP)}</span>
        </span>
      </div>

      {Object.entries(grouped).map(([jobName, bills]) => {
        const jobTotal = bills.reduce((s, i) => s + i.amount, 0);
        const jobPastDue = bills.filter(i => i.daysPastDue > 0).reduce((s, i) => s + i.amount, 0);
        // Sort bills: past due first
        const sortedBills = [...bills].sort((a, b) => {
          if (a.daysPastDue > 0 && b.daysPastDue === 0) return -1;
          if (a.daysPastDue === 0 && b.daysPastDue > 0) return 1;
          return b.daysPastDue - a.daysPastDue;
        });
        return (
          <Card key={jobName} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">{jobName}</h3>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatFullCurrency(jobTotal)}</p>
                {jobPastDue > 0 && (
                  <p className="text-xs flex items-center gap-1 justify-end" style={{ color: tc.negative }}>
                    <AlertTriangle size={12} /> {formatFullCurrency(jobPastDue)} past due
                  </p>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${ds.divider}`, color: ds.textMuted }}>
                    <th className="text-left py-2 text-xs font-medium">Vendor</th>
                    <th className="text-left py-2 text-xs font-medium">Bill #</th>
                    <th className="text-right py-2 text-xs font-medium">Amount</th>
                    <th className="text-right py-2 text-xs font-medium">Due Date</th>
                    <th className="text-right py-2 text-xs font-medium">Days Past Due</th>
                    <th className="text-right py-2 text-xs font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBills.map((bill) => (
                    <tr key={bill.invoiceNum} style={{ borderBottom: '1px solid ' + ds.divider + '80', backgroundColor: bill.daysPastDue > 0 ? tc.negative + '0d' : 'transparent' }}>
                      <td className="py-2.5">{bill.vendor}</td>
                      <td className="py-2.5 font-mono text-xs">{bill.invoiceNum}</td>
                      <td className="py-2.5 text-right font-semibold" style={{ color: bill.daysPastDue > 0 ? tc.negative : 'inherit' }}>
                        {formatFullCurrency(bill.amount)}
                      </td>
                      <td className="py-2.5 text-right" style={{ color: ds.textMuted }}>{bill.dueDate}</td>
                      <td className="py-2.5 text-right font-semibold" style={{ color: bill.daysPastDue > 0 ? tc.negative : tc.positive }}>
                        {bill.daysPastDue > 0 ? bill.daysPastDue : '—'}
                      </td>
                      <td className="py-2.5 text-right">
                        <Badge variant={bill.daysPastDue > 0 ? 'danger' : 'success'}>
                          {bill.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function WIPTrackingTab() {
  const { theme } = useChartTheme();
  const tc = theme.colors;
  const ds = theme.dashboard;

  const totalOverBilled = wipData.filter(w => w.overUnderBilled < 0).reduce((s, w) => s + Math.abs(w.overUnderBilled), 0);
  const totalUnderBilled = wipData.filter(w => w.overUnderBilled > 0).reduce((s, w) => s + w.overUnderBilled, 0);
  const totalContractValue = wipData.reduce((s, w) => s + w.contractAmount, 0);
  const totalGrossProfit = wipData.reduce((s, w) => s + w.estGrossProfit, 0);
  const portfolioMargin = totalContractValue > 0 ? ((totalGrossProfit / totalContractValue) * 100).toFixed(1) : '0';
  const overBilledProjects = wipData.filter(w => w.overUnderBilled > 0);
  const biggestUnderBill = overBilledProjects.length > 0 ? overBilledProjects.reduce((max, w) => w.overUnderBilled > max.overUnderBilled ? w : max) : null;

  return (
    <div className="space-y-6">
      {/* AI Summary Card */}
      <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: ds.briefBg, border: `1px solid ${ds.briefBorder}` }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: tc.primary }}>AI Summary</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.positive }}>▲</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.positive }}>Win:</span> Portfolio gross margin holding at {portfolioMargin}% across {wipData.length} active projects</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.warning }}>▼</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.warning }}>Watch:</span> {biggestUnderBill ? `${biggestUnderBill.job} is $${Math.round(biggestUnderBill.overUnderBilled / 1000)}k under-billed — submit draw request to maintain cash position` : 'All projects within billing targets'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="metric" className="p-5">
          <p className="text-xs uppercase tracking-wide" style={{ color: ds.textMuted }}>Total Contract Value</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(totalContractValue)}</p>
        </Card>
        <Card variant="metric" className="p-5">
          <p className="text-xs uppercase tracking-wide" style={{ color: ds.textMuted }}>Over-Billed</p>
          <p className="text-xl font-bold mt-1" style={{ color: tc.warning }}>{formatCurrency(totalOverBilled)}</p>
        </Card>
        <Card variant="metric" className="p-5">
          <p className="text-xs uppercase tracking-wide" style={{ color: ds.textMuted }}>Under-Billed</p>
          <p className="text-xl font-bold mt-1" style={{ color: tc.primary }}>{formatCurrency(totalUnderBilled)}</p>
        </Card>
        <Card variant="metric" className="p-5">
          <p className="text-xs uppercase tracking-wide" style={{ color: ds.textMuted }}>Net Position</p>
          <p className="text-xl font-bold mt-1" style={{ color: totalOverBilled > totalUnderBilled ? tc.warning : tc.positive }}>
            {totalOverBilled > totalUnderBilled ? 'Over' : 'Under'}: {formatCurrency(Math.abs(totalOverBilled - totalUnderBilled))}
          </p>
        </Card>
      </div>

      {wipData.map((w) => (
        <Card key={w.job} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold">{w.job}</h3>
              <p className="text-xs" style={{ color: ds.textMuted }}>Contract: {formatFullCurrency(w.contractAmount)}</p>
            </div>
            <Badge variant={w.estGrossProfit < 0 ? 'danger' : w.percentComplete >= 100 ? 'warning' : 'info'}>
              {w.percentComplete}% Complete
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: ds.divider }}>
              <div
                className="h-full rounded-full"
                style={{
                  backgroundColor: w.percentComplete > 100 ? tc.negative : tc.primary,
                  width: `${Math.min(w.percentComplete, 100)}%`
                }}
              />
            </div>
          </div>

          {/* WIP Detail Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="rounded-lg p-3" style={{ backgroundColor: ds.inputBg }}>
              <p className="text-xs" style={{ color: ds.textMuted }}>Est. Total Cost</p>
              <p className="font-semibold mt-1">{formatFullCurrency(w.totalEstCost)}</p>
            </div>
            <div className="rounded-lg p-3" style={{ backgroundColor: ds.inputBg }}>
              <p className="text-xs" style={{ color: ds.textMuted }}>Cost to Date</p>
              <p className="font-semibold mt-1" style={{ color: w.costToDate > w.totalEstCost ? tc.negative : 'inherit' }}>
                {formatFullCurrency(w.costToDate)}
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ backgroundColor: ds.inputBg }}>
              <p className="text-xs" style={{ color: ds.textMuted }}>Billed to Date</p>
              <p className="font-semibold mt-1">{formatFullCurrency(w.billedToDate)}</p>
            </div>
            <div className="rounded-lg p-3" style={{ backgroundColor: ds.inputBg }}>
              <p className="text-xs" style={{ color: ds.textMuted }}>Earned Revenue</p>
              <p className="font-semibold mt-1">{formatFullCurrency(w.earnedRevenue)}</p>
            </div>
            <div className="rounded-lg p-3" style={{ backgroundColor: ds.inputBg }}>
              <p className="text-xs" style={{ color: ds.textMuted }}>Est. Gross Profit</p>
              <p className="font-semibold mt-1" style={{ color: w.estGrossProfit < 0 ? tc.negative : tc.positive }}>
                {formatFullCurrency(w.estGrossProfit)}
              </p>
            </div>
            <div className="rounded-lg p-3" style={{
              backgroundColor: (w.overUnderBilled < 0 ? tc.warning : tc.primary) + '1a',
              border: `1px solid ${(w.overUnderBilled < 0 ? tc.warning : tc.primary) + '4d'}`
            }}>
              <p className="text-xs" style={{ color: ds.textMuted }}>{w.overUnderBilled < 0 ? 'Over-Billed' : 'Under-Billed'}</p>
              <p className="font-semibold mt-1" style={{ color: w.overUnderBilled < 0 ? tc.warning : tc.primary }}>
                {formatFullCurrency(Math.abs(w.overUnderBilled))}
              </p>
            </div>
            <div className="rounded-lg p-3 col-span-2" style={{ backgroundColor: ds.inputBg }}>
              <p className="text-xs" style={{ color: ds.textMuted }}>Gross Profit Margin</p>
              <p className="font-semibold mt-1" style={{ color: w.estGrossProfit < 0 ? tc.negative : tc.positive }}>
                {((w.estGrossProfit / w.contractAmount) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function RetainageTab() {
  const { theme } = useChartTheme();
  const tc = theme.colors;
  const ds = theme.dashboard;

  const totalReceivable = retainageData.reduce((s, r) => s + r.retainageReceivable, 0);
  const totalPayable = retainageData.reduce((s, r) => s + r.retainagePayable, 0);
  const totalNet = retainageData.reduce((s, r) => s + r.netRetainage, 0);
  const heldRetainage = retainageData.filter(r => r.status === 'Held' || r.status === 'Due Soon' || r.status === 'Ready to Release').reduce((s, r) => s + r.retainageReceivable, 0);
  const paidRetainage = retainageData.filter(r => r.status === 'Paid').reduce((s, r) => s + r.retainageReceivable, 0);
  const overdueRetainage = retainageData.filter(r => r.status === 'Overdue').reduce((s, r) => s + r.retainageReceivable, 0);

  // Sort by status priority
  const statusOrder: Record<string, number> = { 'Overdue': 0, 'Due Soon': 1, 'Held': 2, 'Ready to Release': 3, 'Paid': 4 };
  const sortedData = [...retainageData].sort((a, b) => (statusOrder[a.status] ?? 999) - (statusOrder[b.status] ?? 999));

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Overdue': return 'danger';
      case 'Due Soon': return 'warning';
      case 'Held': return 'default';
      case 'Ready to Release': return 'success';
      case 'Paid': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Brief */}
      <div className="p-3 rounded-lg" style={{ backgroundColor: ds.briefBg, border: `1px solid ${ds.briefBorder}` }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: tc.primary }}>AI Brief</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.positive }}>▲</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.positive }}>Win:</span> Net retainage position is {formatCurrency(totalNet)} in your favor — you&apos;re holding more than you owe, protecting cash flow</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.warning }}>▼</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.warning }}>Watch:</span> {formatCurrency(overdueRetainage)} in retainage is overdue for release across 3 completed jobs — file release requests immediately</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.warning }}>▼</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.warning }}>Watch:</span> Mountain View &amp; Cedar Heights retainage release dates are approaching — schedule final walk-throughs to avoid delays</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="metric" className="p-5">
          <p className="text-xs uppercase tracking-wide" style={{ color: ds.textMuted }}>Total Held</p>
          <p className="text-2xl font-bold mt-1" style={{ color: tc.positive }}>{formatFullCurrency(heldRetainage)}</p>
          <p className="text-xs mt-1" style={{ color: ds.textMuted }}>Active retainage</p>
        </Card>
        <Card variant="metric" className="p-5">
          <p className="text-xs uppercase tracking-wide" style={{ color: ds.textMuted }}>Total Overdue</p>
          <p className="text-2xl font-bold mt-1" style={{ color: tc.negative }}>{formatFullCurrency(overdueRetainage)}</p>
          <p className="text-xs mt-1" style={{ color: ds.textMuted }}>Past release date</p>
        </Card>
        <Card variant="metric" className="p-5">
          <p className="text-xs uppercase tracking-wide" style={{ color: ds.textMuted }}>Total Paid</p>
          <p className="text-2xl font-bold mt-1" style={{ color: tc.primary }}>{formatFullCurrency(paidRetainage)}</p>
          <p className="text-xs mt-1" style={{ color: ds.textMuted }}>Released to subs</p>
        </Card>
        <Card variant="metric" className="p-5">
          <p className="text-xs uppercase tracking-wide" style={{ color: ds.textMuted }}>Net Position</p>
          <p className="text-2xl font-bold mt-1" style={{ color: tc.primary }}>{formatFullCurrency(totalNet)}</p>
          <p className="text-xs mt-1" style={{ color: ds.textMuted }}>Cash impact on release</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Retainage by Job</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${ds.divider}`, color: ds.textMuted }}>
                <th className="text-left py-3 text-xs font-medium">Job</th>
                <th className="text-right py-3 text-xs font-medium">Contract</th>
                <th className="text-center py-3 text-xs font-medium">Ret %</th>
                <th className="text-right py-3 text-xs font-medium">Receivable</th>
                <th className="text-right py-3 text-xs font-medium">Payable</th>
                <th className="text-right py-3 text-xs font-medium">Net</th>
                <th className="text-right py-3 text-xs font-medium">Release Date</th>
                <th className="text-right py-3 text-xs font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((r) => (
                <tr key={r.job} className="hover:bg-[#1a1a26]" style={{
                  borderBottom: '1px solid ' + ds.divider + '80',
                  backgroundColor: r.status === 'Overdue' ? tc.negative + '0d' : r.status === 'Paid' ? tc.primary + '0d' : 'transparent'
                }}>
                  <td className="py-3 font-medium">{r.job}</td>
                  <td className="py-3 text-right">{formatFullCurrency(r.contractAmount)}</td>
                  <td className="py-3 text-center">{r.retainagePercent}%</td>
                  <td className="py-3 text-right font-semibold" style={{ color: tc.positive }}>{formatFullCurrency(r.retainageReceivable)}</td>
                  <td className="py-3 text-right font-semibold" style={{ color: tc.tertiary }}>{formatFullCurrency(r.retainagePayable)}</td>
                  <td className="py-3 text-right font-semibold" style={{ color: tc.primary }}>{formatFullCurrency(r.netRetainage)}</td>
                  <td className="py-3 text-right" style={{ color: ds.textMuted }}>{r.releaseDate}</td>
                  <td className="py-3 text-right">
                    <Badge variant={getStatusVariant(r.status)}>
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold" style={{ borderTop: `2px solid ${tc.primary + '4d'}` }}>
                <td className="py-3">TOTALS</td>
                <td className="py-3 text-right">{formatFullCurrency(sortedData.reduce((s, r) => s + r.contractAmount, 0))}</td>
                <td className="py-3 text-center">—</td>
                <td className="py-3 text-right" style={{ color: tc.positive }}>{formatFullCurrency(totalReceivable)}</td>
                <td className="py-3 text-right" style={{ color: tc.tertiary }}>{formatFullCurrency(totalPayable)}</td>
                <td className="py-3 text-right" style={{ color: tc.primary }}>{formatFullCurrency(totalNet)}</td>
                <td className="py-3 text-right">—</td>
                <td className="py-3 text-right">—</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SalesDashboardTab() {
  const { theme } = useChartTheme();
  const tc = theme.colors;
  const ch = theme.chart;
  const ds = theme.dashboard;
  const totalPipeline = salesPipelineData.reduce((s, p) => s + p.value, 0);
  const wonDeals = recentDeals.filter(d => d.stage === 'Won');
  const wonValue = wonDeals.reduce((s, d) => s + d.value, 0);
  const avgDealSize = totalPipeline / salesPipelineData.reduce((s, p) => s + p.count, 0);
  const teamTotalQuota = salesTeamMembers.reduce((s, m) => s + m.quota, 0);
  const teamTotalWon = salesTeamMembers.reduce((s, m) => s + m.wonValue, 0);
  const teamQuotaPercent = Math.round((teamTotalWon / teamTotalQuota) * 100);
  const TEAM_COLORS = theme.series.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* AI Brief */}
      <div className="p-3 rounded-lg" style={{ backgroundColor: ds.briefBg, border: `1px solid ${ds.briefBorder}` }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: tc.primary }}>AI Brief</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.positive }}>▲</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.positive }}>Win:</span> Team is at {teamQuotaPercent}% of quota with {formatCurrency(totalPipeline)} in the pipeline — on track to close the quarter strong</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.warning }}>▼</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.warning }}>Watch:</span> Westfield Fire Station ($1.25M) is at 35% probability — high-value deal needs a strategy session to move it forward</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm" style={{ color: tc.warning }}>▼</span>
            <p className="text-sm" style={{ color: ds.textSecondary }}><span className="font-medium" style={{ color: tc.warning }}>Watch:</span> Pipeline is top-heavy in proposals ({salesPipelineData[1]?.count} deals, {formatCurrency(salesPipelineData[1]?.value || 0)}) — focus on advancing stalled proposals to negotiation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="metric" className="p-5">
          <p className="text-xs uppercase tracking-wide" style={{ color: ds.textMuted }}>Total Pipeline</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(totalPipeline)}</p>
        </Card>
        <Card variant="metric" className="p-5">
          <p className="text-xs uppercase tracking-wide" style={{ color: ds.textMuted }}>Won (This Quarter)</p>
          <p className="text-xl font-bold mt-1" style={{ color: tc.positive }}>{formatCurrency(wonValue)}</p>
        </Card>
        <Card variant="metric" className="p-5">
          <p className="text-xs uppercase tracking-wide" style={{ color: ds.textMuted }}>Avg Deal Size</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(avgDealSize)}</p>
        </Card>
        <Card variant="metric" className="p-5">
          <p className="text-xs uppercase tracking-wide" style={{ color: ds.textMuted }}>Team Quota Attainment</p>
          <p className="text-xl font-bold mt-1" style={{ color: teamQuotaPercent >= 80 ? tc.positive : teamQuotaPercent >= 50 ? tc.warning : tc.negative }}>
            {teamQuotaPercent}%
          </p>
        </Card>
      </div>

      {/* Team Member Performance Cards */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Sales Team Performance</h2>
          <span className="text-xs" style={{ color: ds.textMuted }}>Current Quarter</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {salesTeamMembers.map((member, idx) => {
            const quotaPct = Math.round((member.wonValue / member.quota) * 100);
            return (
              <div key={member.name} className="rounded-xl p-4 space-y-3" style={{ backgroundColor: ds.inputBg, border: `1px solid ${ds.divider}` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: TEAM_COLORS[idx] + '25', color: TEAM_COLORS[idx] }}>
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{member.name}</p>
                    <p className="text-xs" style={{ color: ds.textMuted }}>{member.role}</p>
                  </div>
                </div>

                {/* Quota Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: ds.textMuted }}>Quota</span>
                    <span style={{ color: quotaPct >= 80 ? tc.positive : quotaPct >= 50 ? tc.warning : tc.negative }}>
                      {quotaPct}% ({formatCurrency(member.wonValue)} / {formatCurrency(member.quota)})
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: ds.divider }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(quotaPct, 100)}%`,
                        backgroundColor: quotaPct >= 80 ? tc.positive : quotaPct >= 50 ? tc.warning : tc.negative,
                      }}
                    />
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg p-2" style={{ backgroundColor: ds.cardBg }}>
                    <p style={{ color: ds.textMuted }}>Pipeline</p>
                    <p className="font-semibold">{formatCurrency(member.pipelineValue)}</p>
                  </div>
                  <div className="rounded-lg p-2" style={{ backgroundColor: ds.cardBg }}>
                    <p style={{ color: ds.textMuted }}>Win Rate</p>
                    <p className="font-semibold">{member.winRate}%</p>
                  </div>
                  <div className="rounded-lg p-2" style={{ backgroundColor: ds.cardBg }}>
                    <p style={{ color: ds.textMuted }}>Deals</p>
                    <p className="font-semibold">{member.wonDeals}W / {member.deals - member.wonDeals}O</p>
                  </div>
                  <div className="rounded-lg p-2" style={{ backgroundColor: ds.cardBg }}>
                    <p style={{ color: ds.textMuted }}>Avg Cycle</p>
                    <p className="font-semibold">{member.avgCycleTime}d</p>
                  </div>
                </div>

                {/* Sparkline Trend */}
                <div>
                  <p className="text-xs mb-1" style={{ color: ds.textMuted }}>Monthly Closed</p>
                  <ResponsiveContainer width="100%" height={40}>
                    <AreaChart data={member.monthlyTrend}>
                      <defs>
                        <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={TEAM_COLORS[idx]} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={TEAM_COLORS[idx]} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="closed" stroke={TEAM_COLORS[idx]} fill={`url(#grad-${idx})`} strokeWidth={1.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Team Leaderboard Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Team Leaderboard</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${ds.divider}`, color: ds.textMuted }}>
                <th className="text-left py-3 text-xs font-medium">Rank</th>
                <th className="text-left py-3 text-xs font-medium">Rep</th>
                <th className="text-right py-3 text-xs font-medium">Won Revenue</th>
                <th className="text-right py-3 text-xs font-medium">Pipeline</th>
                <th className="text-center py-3 text-xs font-medium">Win Rate</th>
                <th className="text-right py-3 text-xs font-medium">Avg Deal</th>
                <th className="text-center py-3 text-xs font-medium">Quota %</th>
                <th className="text-right py-3 text-xs font-medium">Top Source</th>
              </tr>
            </thead>
            <tbody>
              {[...salesTeamMembers]
                .sort((a, b) => b.wonValue - a.wonValue)
                .map((member, rank) => {
                  const quotaPct = Math.round((member.wonValue / member.quota) * 100);
                  return (
                    <tr key={member.name} className="hover:bg-[#1a1a26]" style={{ borderBottom: '1px solid ' + ds.divider + '80' }}>
                      <td className="py-3">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          rank === 0 ? 'bg-[#eab308]/20 text-[#eab308]' : rank === 1 ? 'bg-[#8888a0]/20 text-[#c0c0cc]' : rank === 2 ? 'bg-[#ef9d44]/20 text-[#ef9d44]' : 'bg-[#2a2a3d] text-[#8888a0]'
                        }`}>
                          {rank + 1}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: TEAM_COLORS[salesTeamMembers.indexOf(member)] + '25', color: TEAM_COLORS[salesTeamMembers.indexOf(member)] }}>
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-[10px]" style={{ color: ds.textMuted }}>{member.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right font-semibold" style={{ color: tc.positive }}>{formatFullCurrency(member.wonValue)}</td>
                      <td className="py-3 text-right">{formatCurrency(member.pipelineValue)}</td>
                      <td className="py-3 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: ds.divider }}>
                            <div className="h-full rounded-full" style={{
                              backgroundColor: member.winRate >= 45 ? tc.positive : member.winRate >= 35 ? tc.warning : tc.tertiary,
                              width: `${member.winRate}%`
                            }} />
                          </div>
                          <span className="text-xs">{member.winRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">{formatCurrency(member.avgDealSize)}</td>
                      <td className="py-3 text-center">
                        <Badge variant={quotaPct >= 80 ? 'success' : quotaPct >= 50 ? 'warning' : 'info'}>
                          {quotaPct}%
                        </Badge>
                      </td>
                      <td className="py-3 text-right" style={{ color: ds.textMuted }}>{member.leadSource}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Closed vs Pipeline (Monthly)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
              <XAxis dataKey="month" stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} />
              <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
              <Bar dataKey="closed" fill={tc.positive} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Closed" />
              <Bar dataKey="pipeline" fill={tc.primary} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Pipeline" opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Lead Sources */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Lead Sources</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {leadSourceData.map((_, i) => (
                    <Cell key={i} fill={theme.series[i] || '#8888a0'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {leadSourceData.map((source, i) => (
                <div key={source.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: theme.series[i] || '#8888a0' }} />
                  <span className="text-sm flex-1" style={{ color: ds.textMuted }}>{source.name}</span>
                  <span className="text-sm font-semibold">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Active Deals Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Active Deals</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${ds.divider}`, color: ds.textMuted }}>
                <th className="text-left py-3 text-xs font-medium">Project</th>
                <th className="text-left py-3 text-xs font-medium">Client</th>
                <th className="text-left py-3 text-xs font-medium">Rep</th>
                <th className="text-right py-3 text-xs font-medium">Value</th>
                <th className="text-center py-3 text-xs font-medium">Probability</th>
                <th className="text-right py-3 text-xs font-medium">Weighted</th>
                <th className="text-right py-3 text-xs font-medium">Stage</th>
              </tr>
            </thead>
            <tbody>
              {recentDeals.map((deal) => (
                <tr key={deal.name} className="hover:bg-[#1a1a26]" style={{ borderBottom: '1px solid ' + ds.divider + '80' }}>
                  <td className="py-3 font-medium">{deal.name}</td>
                  <td className="py-3" style={{ color: ds.textMuted }}>{deal.client}</td>
                  <td className="py-3 text-xs" style={{ color: ds.textMuted }}>{deal.rep}</td>
                  <td className="py-3 text-right font-semibold">{formatFullCurrency(deal.value)}</td>
                  <td className="py-3 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: ds.divider }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: deal.probability >= 80 ? tc.positive : deal.probability >= 50 ? tc.warning : tc.tertiary,
                            width: `${deal.probability}%`
                          }}
                        />
                      </div>
                      <span className="text-xs">{deal.probability}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-semibold" style={{ color: tc.primary }}>
                    {formatFullCurrency(Math.round(deal.value * deal.probability / 100))}
                  </td>
                  <td className="py-3 text-right">
                    <Badge variant={deal.stage === 'Won' ? 'success' : deal.stage === 'Negotiation' ? 'warning' : 'info'}>
                      {deal.stage}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── Demo Banner Component ───────────────────────────────
function DemoBanner({ onDismiss }: { onDismiss: () => void }) {
  const { theme } = useChartTheme();
  const tc = theme.colors;
  const ds = theme.dashboard;

  return (
    <div className="relative rounded-xl p-5 mb-2" style={{
      backgroundImage: `linear-gradient(to right, ${tc.primary}1a, transparent, ${tc.primary}1a)`,
      backgroundColor: ds.briefBg,
      border: `1px solid ${tc.primary + '4d'}`
    }}>
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 hover:text-[#e8e8f0] transition"
        style={{ color: ds.textMuted }}
        aria-label="Dismiss banner"
      >
        ✕
      </button>
      <div className="flex items-start gap-3">
        <div className="rounded-lg p-2 flex-shrink-0 mt-0.5" style={{ backgroundColor: tc.primary + '33' }}>
          <Eye size={20} style={{ color: tc.primary + 'e0' }} />
        </div>
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: ds.textPrimary }}>Welcome! You&apos;re viewing sample data.</p>
          <p className="text-sm leading-relaxed" style={{ color: ds.textSecondary }}>
            Once your platforms are connected, this dashboard becomes your real-time financial command center.
            One thing to keep in mind — the accuracy of your dashboard depends on the accuracy of your books.
            If anything looks off or you want help getting your data dialed in, our team at{' '}
            <a href="https://salisburybookkeeping.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#818cf8] transition font-medium" style={{ color: tc.primary }}>
              SalisburyBookkeeping.com
            </a>{' '}
            has your back.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard Component ────────────────────────────
export default function DashboardContent() {
  const { theme } = useChartTheme();
  const tc = theme.colors;
  const ds = theme.dashboard;
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  return (
    <div className="space-y-6">
      {/* Demo Data Banner */}
      {showDemoBanner && <DemoBanner onDismiss={() => setShowDemoBanner(false)} />}

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto pb-1" style={{ borderBottom: `1px solid ${ds.divider}` }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={activeTab === tab.key ? {
              backgroundColor: tc.primary + '26',
              color: tc.primary + 'e0',
              borderBottom: `2px solid ${tc.primary}`,
            } : {
              color: ds.textMuted
            }}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? ''
                : 'hover:bg-[#1a1a26]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'ar' && <ARByJobTab />}
      {activeTab === 'ap' && <APByJobTab />}
      {activeTab === 'wip' && <WIPTrackingTab />}
      {activeTab === 'retainage' && <RetainageTab />}
      {activeTab === 'sales' && <SalesDashboardTab />}
    </div>
  );
}
