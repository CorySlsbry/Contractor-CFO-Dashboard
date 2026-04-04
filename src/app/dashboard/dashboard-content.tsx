'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { OnboardingWizard } from './onboarding-wizard';
import { Badge } from '@/components/ui/badge';
import { formatCompactCurrency } from '@/lib/utils';
import { useChartTheme } from '@/components/chart-theme-provider';
import { ChartTypeSelector, useChartType } from '@/components/chart-type-selector';
import type { ChartVariant } from '@/components/chart-type-selector';
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
const kpis: any[] = [];

const sparklineData: any[] = [];

// AR by Job
const arByJob: any[] = [];

// AP by Job
const apByJob: any[] = [];

// WIP Tracking per Job
const wipData: any[] = [];

// Retainage Tracking per Job
const retainageData: any[] = [];

// Sales Dashboard Data
const salesPipelineData: any[] = [];

const salesByMonth: any[] = [];

const recentDeals: any[] = [];

const leadSourceData: any[] = [];

const LEAD_COLORS = ['#6366f1', '#22c55e', '#eab308', '#ef9d44', '#8888a0'];

// Sales Team Member Data
const salesTeamMembers: any[] = [];

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

const cashFlowData: any[] = [];

const arAgingData: any[] = [];

function OverviewTab() {
  const { theme } = useChartTheme();
  const tc = theme.colors;
  const ch = theme.chart;
  const ds = theme.dashboard;
  const [arChartType, setArChartType] = useChartType('ar-aging', 'horizontalBar');
  const [cashFlowType, setCashFlowType] = useChartType('cash-flow', 'area');
  const [pipelineType, setPipelineType] = useChartType('pipeline-mini', 'horizontalBar');
  const [wipSummaryType, setWipSummaryType] = useChartType('wip-summary', 'horizontalBar');

  if (kpis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#6366f1]/10 flex items-center justify-center mb-4">
          <DollarSign size={28} className="text-[#6366f1]" />
        </div>
        <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">No Financial Data Yet</h3>
        <p className="text-sm text-[#8888a0] max-w-md">Connect QuickBooks from the Integrations tab to see your real-time financial overview, AR/AP aging, WIP tracking, and more.</p>
      </div>
    );
  }

  const wipChartData = wipData.map(w => ({
    name: w.job.split(' ').slice(0, 2).join(' '),
    fullName: w.job,
    value: Math.abs(w.overUnderBilled),
    overUnder: w.overUnderBilled,
  }));
  const wipColors = wipData.map(w => w.overUnderBilled < 0 ? tc.warning : tc.primary);

  const arColors = [tc.positive, tc.warning, tc.tertiary, tc.negative];

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText size={20} style={{ color: tc.primary }} /> AR Aging Summary
            </h2>
            <ChartTypeSelector options={['horizontalBar', 'bar', 'pie', 'donut']} value={arChartType} onChange={setArChartType} />
          </div>

          {arChartType === 'horizontalBar' && (
            <div className="space-y-3">
              {arAgingData.map((item, i) => (
                <div key={item.range} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: arColors[i] }} />
                  <span className="text-sm w-24" style={{ color: ds.textMuted }}>{item.range}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: ch.gridColor }}>
                    <div className="h-full rounded-full" style={{ backgroundColor: arColors[i], width: `${(item.amount / 310000) * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold w-20 text-right">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          )}

          {arChartType === 'bar' && (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={arAgingData}>
                <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
                <XAxis dataKey="range" stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} />
                <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                <Bar dataKey="amount" radius={[ch.barRadius, ch.barRadius, 0, 0]}>
                  {arAgingData.map((_, i) => <Cell key={i} fill={arColors[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {(arChartType === 'pie' || arChartType === 'donut') && (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie data={arAgingData} cx="50%" cy="50%" innerRadius={arChartType === 'donut' ? 50 : 0} outerRadius={80} paddingAngle={3} dataKey="amount" nameKey="range">
                    {arAgingData.map((_, i) => <Cell key={i} fill={arColors[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {arAgingData.map((item, i) => (
                  <div key={item.range} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: arColors[i] }} />
                    <span className="text-sm flex-1" style={{ color: ds.textMuted }}>{item.range}</span>
                    <span className="text-sm font-semibold">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Building2 size={20} style={{ color: tc.primary }} /> Cash Flow Forecast (4 Weeks)
            </h2>
            <ChartTypeSelector options={['area', 'bar', 'groupedBar', 'line']} value={cashFlowType} onChange={setCashFlowType} />
          </div>
          {cashFlowType === 'area' && (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
                <XAxis dataKey="week" stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} />
                <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                <defs>
                  <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tc.positive} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={tc.positive} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tc.negative} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={tc.negative} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="inflow" stroke={tc.positive} fill="url(#inflowGrad)" strokeWidth={ch.strokeWidth} name="Cash In" />
                <Area type="monotone" dataKey="outflow" stroke={tc.negative} fill="url(#outflowGrad)" strokeWidth={ch.strokeWidth} name="Cash Out" />
              </AreaChart>
            </ResponsiveContainer>
          )}
          {cashFlowType === 'line' && (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
                <XAxis dataKey="week" stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} />
                <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                <Line type="monotone" dataKey="inflow" stroke={tc.positive} strokeWidth={ch.strokeWidth} dot={{ r: 4, fill: tc.positive }} name="Cash In" />
                <Line type="monotone" dataKey="outflow" stroke={tc.negative} strokeWidth={ch.strokeWidth} dot={{ r: 4, fill: tc.negative }} name="Cash Out" />
              </LineChart>
            </ResponsiveContainer>
          )}
          {(cashFlowType === 'bar' || cashFlowType === 'groupedBar') && (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
                <XAxis dataKey="week" stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} />
                <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                <Bar dataKey="inflow" fill={tc.positive} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Cash In" stackId={cashFlowType === 'bar' ? 'stack' : undefined} />
                <Bar dataKey="outflow" fill={tc.negative} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Cash Out" stackId={cashFlowType === 'bar' ? 'stack' : undefined} opacity={cashFlowType === 'groupedBar' ? 0.7 : 1} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* WIP Summary + Sales Pipeline Mini */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">WIP Summary</h2>
            <ChartTypeSelector options={['horizontalBar', 'bar', 'pie', 'donut']} value={wipSummaryType} onChange={setWipSummaryType} />
          </div>

          {wipSummaryType === 'horizontalBar' && (
            <div className="space-y-3">
              {wipData.map((w, i) => (
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
          )}

          {wipSummaryType === 'bar' && (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={wipChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
                <XAxis dataKey="name" stroke={ds.textMuted} style={{ fontSize: '0.65rem' }} />
                <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any, _: any, props: any) => [`${formatFullCurrency(Number(v))} (${props.payload.overUnder < 0 ? 'Over' : 'Under'})`, 'Billing Gap']} />
                <Bar dataKey="value" radius={[ch.barRadius, ch.barRadius, 0, 0]}>
                  {wipChartData.map((_, i) => <Cell key={i} fill={wipColors[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {(wipSummaryType === 'pie' || wipSummaryType === 'donut') && (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie data={wipChartData} cx="50%" cy="50%" innerRadius={wipSummaryType === 'donut' ? 50 : 0} outerRadius={80} paddingAngle={3} dataKey="value" nameKey="name">
                    {wipChartData.map((_, i) => <Cell key={i} fill={wipColors[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any, _: any, props: any) => [`${formatFullCurrency(Number(v))} (${props.payload.overUnder < 0 ? 'Over' : 'Under'})`, 'Billing Gap']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {wipData.map((w, i) => (
                  <div key={w.job} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: wipColors[i] }} />
                    <span className="text-xs flex-1 truncate" style={{ color: ds.textMuted }}>{w.job.split(' ').slice(0, 3).join(' ')}</span>
                    <span className="text-xs font-semibold" style={{ color: wipColors[i] }}>{w.overUnderBilled < 0 ? 'O' : 'U'}: {formatCurrency(Math.abs(w.overUnderBilled))}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Sales Pipeline</h2>
            <ChartTypeSelector options={['horizontalBar', 'bar', 'pie', 'donut']} value={pipelineType} onChange={setPipelineType} />
          </div>

          {pipelineType === 'horizontalBar' && (
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
          )}

          {pipelineType === 'bar' && (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salesPipelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
                <XAxis dataKey="stage" stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} />
                <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                <Bar dataKey="value" fill={tc.primary} radius={[ch.barRadius, ch.barRadius, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {(pipelineType === 'pie' || pipelineType === 'donut') && (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie data={salesPipelineData} cx="50%" cy="50%" innerRadius={pipelineType === 'donut' ? 50 : 0} outerRadius={80} paddingAngle={3} dataKey="value" nameKey="stage">
                    {salesPipelineData.map((_, i) => <Cell key={i} fill={theme.series[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {salesPipelineData.map((s, i) => (
                  <div key={s.stage} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: theme.series[i] }} />
                    <span className="text-sm flex-1" style={{ color: ds.textMuted }}>{s.stage} ({s.count})</span>
                    <span className="text-sm font-semibold">{formatCurrency(s.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function ARByJobTab() {
  const { theme } = useChartTheme();
  const tc = theme.colors;
  const ch = theme.chart;
  const ds = theme.dashboard;
  const [arJobChartType, setArJobChartType] = useChartType('ar-by-job', 'bar');

  if (arByJob.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#6366f1]/10 flex items-center justify-center mb-4">
          <FileText size={28} className="text-[#6366f1]" />
        </div>
        <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">No AR Data Yet</h3>
        <p className="text-sm text-[#8888a0] max-w-md">Connect QuickBooks from the Integrations tab to see your accounts receivable by job.</p>
      </div>
    );
  }

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

      {/* AR by Job Chart */}
      {(() => {
        const arJobChartData = Object.entries(grouped).map(([jobName, invoices]) => ({
          name: jobName.split(' ').slice(0, 2).join(' '),
          fullName: jobName,
          current: invoices.filter(i => i.daysPastDue === 0).reduce((s, i) => s + i.amount, 0),
          pastDue: invoices.filter(i => i.daysPastDue > 0).reduce((s, i) => s + i.amount, 0),
          total: invoices.reduce((s, i) => s + i.amount, 0),
        }));
        return (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">AR by Job</h2>
              <ChartTypeSelector options={['bar', 'horizontalBar', 'pie', 'donut']} value={arJobChartType} onChange={setArJobChartType} />
            </div>

            {arJobChartType === 'bar' && (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={arJobChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
                  <XAxis dataKey="name" stroke={ds.textMuted} style={{ fontSize: '0.65rem' }} />
                  <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
                  <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                  <Bar dataKey="current" fill={tc.positive} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Current" stackId="ar" />
                  <Bar dataKey="pastDue" fill={tc.negative} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Past Due" stackId="ar" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {arJobChartType === 'horizontalBar' && (
              <div className="space-y-3">
                {arJobChartData.map((job) => (
                  <div key={job.fullName} className="flex items-center gap-3">
                    <span className="text-sm w-28 truncate" style={{ color: ds.textMuted }}>{job.name}</span>
                    <div className="flex-1 h-4 rounded-full overflow-hidden flex" style={{ backgroundColor: ds.divider }}>
                      <div className="h-full" style={{ backgroundColor: tc.positive, width: `${(job.current / totalAR) * 100}%` }} />
                      <div className="h-full" style={{ backgroundColor: tc.negative, width: `${(job.pastDue / totalAR) * 100}%` }} />
                    </div>
                    <span className="text-sm font-semibold w-20 text-right">{formatCurrency(job.total)}</span>
                  </div>
                ))}
              </div>
            )}

            {(arJobChartType === 'pie' || arJobChartType === 'donut') && (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={220}>
                  <PieChart>
                    <Pie data={arJobChartData} cx="50%" cy="50%" innerRadius={arJobChartType === 'donut' ? 50 : 0} outerRadius={80} paddingAngle={3} dataKey="total" nameKey="name">
                      {arJobChartData.map((_, i) => <Cell key={i} fill={theme.series[i % theme.series.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {arJobChartData.map((job, i) => (
                    <div key={job.fullName} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: theme.series[i % theme.series.length] }} />
                      <span className="text-sm flex-1 truncate" style={{ color: ds.textMuted }}>{job.fullName}</span>
                      <span className="text-sm font-semibold">{formatCurrency(job.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        );
      })()}

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
  const ch = theme.chart;
  const ds = theme.dashboard;
  const [apJobChartType, setApJobChartType] = useChartType('ap-by-job', 'bar');

  if (apByJob.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#6366f1]/10 flex items-center justify-center mb-4">
          <FileText size={28} className="text-[#6366f1]" />
        </div>
        <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">No AP Data Yet</h3>
        <p className="text-sm text-[#8888a0] max-w-md">Connect QuickBooks from the Integrations tab to see your accounts payable by job.</p>
      </div>
    );
  }

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

      {/* AP by Job Chart */}
      {(() => {
        const apJobChartData = Object.entries(grouped).map(([jobName, bills]) => ({
          name: jobName.split(' ').slice(0, 2).join(' '),
          fullName: jobName,
          current: bills.filter(i => i.daysPastDue === 0).reduce((s, i) => s + i.amount, 0),
          pastDue: bills.filter(i => i.daysPastDue > 0).reduce((s, i) => s + i.amount, 0),
          total: bills.reduce((s, i) => s + i.amount, 0),
        }));
        return (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">AP by Job</h2>
              <ChartTypeSelector options={['bar', 'horizontalBar', 'pie', 'donut']} value={apJobChartType} onChange={setApJobChartType} />
            </div>

            {apJobChartType === 'bar' && (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={apJobChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
                  <XAxis dataKey="name" stroke={ds.textMuted} style={{ fontSize: '0.65rem' }} />
                  <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
                  <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                  <Bar dataKey="current" fill={tc.positive} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Current" stackId="ap" />
                  <Bar dataKey="pastDue" fill={tc.negative} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Past Due" stackId="ap" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {apJobChartType === 'horizontalBar' && (
              <div className="space-y-3">
                {apJobChartData.map((job) => (
                  <div key={job.fullName} className="flex items-center gap-3">
                    <span className="text-sm w-28 truncate" style={{ color: ds.textMuted }}>{job.name}</span>
                    <div className="flex-1 h-4 rounded-full overflow-hidden flex" style={{ backgroundColor: ds.divider }}>
                      <div className="h-full" style={{ backgroundColor: tc.positive, width: `${(job.current / totalAP) * 100}%` }} />
                      <div className="h-full" style={{ backgroundColor: tc.negative, width: `${(job.pastDue / totalAP) * 100}%` }} />
                    </div>
                    <span className="text-sm font-semibold w-20 text-right">{formatCurrency(job.total)}</span>
                  </div>
                ))}
              </div>
            )}

            {(apJobChartType === 'pie' || apJobChartType === 'donut') && (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={220}>
                  <PieChart>
                    <Pie data={apJobChartData} cx="50%" cy="50%" innerRadius={apJobChartType === 'donut' ? 50 : 0} outerRadius={80} paddingAngle={3} dataKey="total" nameKey="name">
                      {apJobChartData.map((_, i) => <Cell key={i} fill={theme.series[i % theme.series.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {apJobChartData.map((job, i) => (
                    <div key={job.fullName} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: theme.series[i % theme.series.length] }} />
                      <span className="text-sm flex-1 truncate" style={{ color: ds.textMuted }}>{job.fullName}</span>
                      <span className="text-sm font-semibold">{formatCurrency(job.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        );
      })()}

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
  const ch = theme.chart;
  const ds = theme.dashboard;
  const [wipChartType, setWipChartType] = useChartType('wip-tracking', 'groupedBar');

  if (wipData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#6366f1]/10 flex items-center justify-center mb-4">
          <Clock size={28} className="text-[#6366f1]" />
        </div>
        <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">No WIP Data Yet</h3>
        <p className="text-sm text-[#8888a0] max-w-md">Connect QuickBooks from the Integrations tab to see your work-in-progress tracking and billing analysis.</p>
      </div>
    );
  }

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

      {/* WIP Billing Position Chart */}
      {(() => {
        const wipBillingData = wipData.map(w => ({
          name: w.job.split(' ').slice(0, 2).join(' '),
          fullName: w.job,
          billed: w.billedToDate,
          earned: w.earnedRevenue,
          gap: Math.abs(w.overUnderBilled),
          isOver: w.overUnderBilled < 0,
        }));
        return (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Billing vs Earned Revenue</h2>
              <ChartTypeSelector options={['groupedBar', 'bar', 'horizontalBar', 'area']} value={wipChartType} onChange={setWipChartType} />
            </div>

            {(wipChartType === 'groupedBar' || wipChartType === 'bar') && (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={wipBillingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
                  <XAxis dataKey="name" stroke={ds.textMuted} style={{ fontSize: '0.65rem' }} />
                  <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
                  <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                  <Bar dataKey="billed" fill={tc.primary} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Billed" stackId={wipChartType === 'bar' ? 'stack' : undefined} />
                  <Bar dataKey="earned" fill={tc.positive} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Earned" opacity={wipChartType === 'groupedBar' ? 0.6 : 1} stackId={wipChartType === 'bar' ? 'stack' : undefined} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {wipChartType === 'horizontalBar' && (
              <div className="space-y-3">
                {wipBillingData.map((w) => (
                  <div key={w.fullName}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs truncate" style={{ color: ds.textMuted }}>{w.name}</span>
                      <span className="text-xs font-semibold" style={{ color: w.isOver ? tc.warning : tc.positive }}>
                        {w.isOver ? 'Over' : 'Under'}: {formatCurrency(w.gap)}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <div className="h-3 rounded-full" style={{ backgroundColor: tc.primary, width: `${(w.billed / Math.max(...wipBillingData.map(d => Math.max(d.billed, d.earned)))) * 50}%` }} />
                      <div className="h-3 rounded-full opacity-60" style={{ backgroundColor: tc.positive, width: `${(w.earned / Math.max(...wipBillingData.map(d => Math.max(d.billed, d.earned)))) * 50}%` }} />
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 mt-2 text-xs" style={{ color: ds.textMuted }}>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: tc.primary }} /> Billed</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full opacity-60" style={{ backgroundColor: tc.positive }} /> Earned</div>
                </div>
              </div>
            )}

            {wipChartType === 'area' && (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={wipBillingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
                  <XAxis dataKey="name" stroke={ds.textMuted} style={{ fontSize: '0.65rem' }} />
                  <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
                  <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                  <defs>
                    <linearGradient id="billedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={tc.primary} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={tc.primary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="earnedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={tc.positive} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={tc.positive} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="billed" stroke={tc.primary} fill="url(#billedGrad)" strokeWidth={ch.strokeWidth} name="Billed" />
                  <Area type="monotone" dataKey="earned" stroke={tc.positive} fill="url(#earnedGrad)" strokeWidth={ch.strokeWidth} name="Earned" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>
        );
      })()}

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
  const ch = theme.chart;
  const ds = theme.dashboard;
  const [retChartType, setRetChartType] = useChartType('retainage-summary', 'bar');

  if (retainageData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#6366f1]/10 flex items-center justify-center mb-4">
          <AlertTriangle size={28} className="text-[#6366f1]" />
        </div>
        <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">No Retainage Data Yet</h3>
        <p className="text-sm text-[#8888a0] max-w-md">Connect QuickBooks from the Integrations tab to see your retainage tracking across projects.</p>
      </div>
    );
  }

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

      {/* Retainage Summary Chart */}
      {(() => {
        const activeRetainage = retainageData.filter(r => r.status !== 'Paid');
        const retChartData = activeRetainage.map(r => ({
          name: r.job.split(' ').slice(0, 2).join(' '),
          fullName: r.job,
          receivable: r.retainageReceivable,
          payable: r.retainagePayable,
          net: r.netRetainage,
        }));
        const statusGroups = [
          { name: 'Held', value: retainageData.filter(r => r.status === 'Held').reduce((s, r) => s + r.retainageReceivable, 0) },
          { name: 'Due Soon', value: retainageData.filter(r => r.status === 'Due Soon').reduce((s, r) => s + r.retainageReceivable, 0) },
          { name: 'Ready', value: retainageData.filter(r => r.status === 'Ready to Release').reduce((s, r) => s + r.retainageReceivable, 0) },
          { name: 'Overdue', value: overdueRetainage },
          { name: 'Paid', value: paidRetainage },
        ].filter(g => g.value > 0);
        const statusColors = [tc.primary, tc.warning, tc.positive, tc.negative, tc.tertiary];
        return (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Retainage Overview</h2>
              <ChartTypeSelector options={['bar', 'horizontalBar', 'pie', 'donut']} value={retChartType} onChange={setRetChartType} />
            </div>

            {retChartType === 'bar' && (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={retChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
                  <XAxis dataKey="name" stroke={ds.textMuted} style={{ fontSize: '0.65rem' }} />
                  <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
                  <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                  <Bar dataKey="receivable" fill={tc.positive} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Receivable" />
                  <Bar dataKey="payable" fill={tc.tertiary} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Payable" opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {retChartType === 'horizontalBar' && (
              <div className="space-y-3">
                {retChartData.map((r) => (
                  <div key={r.fullName}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs truncate" style={{ color: ds.textMuted }}>{r.name}</span>
                      <span className="text-xs font-semibold" style={{ color: tc.primary }}>Net: {formatCurrency(r.net)}</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="h-3 rounded-full" style={{ backgroundColor: tc.positive, width: `${(r.receivable / totalReceivable) * 100}%` }} />
                      <div className="h-3 rounded-full opacity-60" style={{ backgroundColor: tc.tertiary, width: `${(r.payable / totalReceivable) * 100}%` }} />
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 mt-2 text-xs" style={{ color: ds.textMuted }}>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: tc.positive }} /> Receivable</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full opacity-60" style={{ backgroundColor: tc.tertiary }} /> Payable</div>
                </div>
              </div>
            )}

            {(retChartType === 'pie' || retChartType === 'donut') && (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={220}>
                  <PieChart>
                    <Pie data={statusGroups} cx="50%" cy="50%" innerRadius={retChartType === 'donut' ? 50 : 0} outerRadius={80} paddingAngle={3} dataKey="value" nameKey="name">
                      {statusGroups.map((_, i) => <Cell key={i} fill={statusColors[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {statusGroups.map((g, i) => (
                    <div key={g.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: statusColors[i] }} />
                      <span className="text-sm flex-1" style={{ color: ds.textMuted }}>{g.name}</span>
                      <span className="text-sm font-semibold">{formatCurrency(g.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        );
      })()}

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
  const [salesTrendType, setSalesTrendType] = useChartType('sales-trend', 'groupedBar');
  const [leadSourceType, setLeadSourceType] = useChartType('lead-source', 'donut');
  const [teamSparkType, setTeamSparkType] = useChartType('team-spark', 'area');
  const [activeDealsType, setActiveDealsType] = useChartType('active-deals', 'horizontalBar');

  if (recentDeals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#6366f1]/10 flex items-center justify-center mb-4">
          <TrendingUp size={28} className="text-[#6366f1]" />
        </div>
        <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">No Sales Data Yet</h3>
        <p className="text-sm text-[#8888a0] max-w-md">Connect your CRM from the Integrations tab to see your sales pipeline, deals, and team performance.</p>
      </div>
    );
  }

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
          <ChartTypeSelector options={['area', 'line', 'bar']} value={teamSparkType} onChange={setTeamSparkType} />
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
                  {teamSparkType === 'area' && (
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
                  )}
                  {teamSparkType === 'line' && (
                    <ResponsiveContainer width="100%" height={40}>
                      <LineChart data={member.monthlyTrend}>
                        <Line type="monotone" dataKey="closed" stroke={TEAM_COLORS[idx]} strokeWidth={1.5} dot={{ r: 2, fill: TEAM_COLORS[idx] }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                  {teamSparkType === 'bar' && (
                    <ResponsiveContainer width="100%" height={40}>
                      <BarChart data={member.monthlyTrend}>
                        <Bar dataKey="closed" fill={TEAM_COLORS[idx]} radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Closed vs Pipeline (Monthly)</h2>
            <ChartTypeSelector options={['groupedBar', 'stackedBar', 'area', 'line']} value={salesTrendType} onChange={setSalesTrendType} />
          </div>
          {salesTrendType === 'area' && (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
                <XAxis dataKey="month" stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} />
                <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                <defs>
                  <linearGradient id="closedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tc.positive} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={tc.positive} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pipeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tc.primary} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={tc.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="closed" stroke={tc.positive} fill="url(#closedGrad)" strokeWidth={ch.strokeWidth} name="Closed" />
                <Area type="monotone" dataKey="pipeline" stroke={tc.primary} fill="url(#pipeGrad)" strokeWidth={ch.strokeWidth} name="Pipeline" />
              </AreaChart>
            </ResponsiveContainer>
          )}
          {salesTrendType === 'line' && (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
                <XAxis dataKey="month" stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} />
                <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                <Line type="monotone" dataKey="closed" stroke={tc.positive} strokeWidth={ch.strokeWidth} dot={{ r: 4, fill: tc.positive }} name="Closed" />
                <Line type="monotone" dataKey="pipeline" stroke={tc.primary} strokeWidth={ch.strokeWidth} dot={{ r: 4, fill: tc.primary }} name="Pipeline" />
              </LineChart>
            </ResponsiveContainer>
          )}
          {(salesTrendType === 'groupedBar' || salesTrendType === 'stackedBar') && (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
                <XAxis dataKey="month" stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} />
                <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
                <Bar dataKey="closed" fill={tc.positive} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Closed" stackId={salesTrendType === 'stackedBar' ? 'stack' : undefined} />
                <Bar dataKey="pipeline" fill={tc.primary} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Pipeline" opacity={salesTrendType === 'groupedBar' ? 0.5 : 1} stackId={salesTrendType === 'stackedBar' ? 'stack' : undefined} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Lead Sources */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Lead Sources</h2>
            <ChartTypeSelector options={['donut', 'pie', 'bar', 'horizontalBar']} value={leadSourceType} onChange={setLeadSourceType} />
          </div>

          {(leadSourceType === 'donut' || leadSourceType === 'pie') && (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={leadSourceType === 'donut' ? 50 : 0} outerRadius={80} paddingAngle={3} dataKey="value">
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
          )}

          {leadSourceType === 'bar' && (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={leadSourceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
                <XAxis dataKey="name" stroke={ds.textMuted} style={{ fontSize: '0.65rem' }} />
                <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => `${v}%`} />
                <Bar dataKey="value" radius={[ch.barRadius, ch.barRadius, 0, 0]}>
                  {leadSourceData.map((_, i) => <Cell key={i} fill={theme.series[i] || '#8888a0'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {leadSourceType === 'horizontalBar' && (
            <div className="space-y-3">
              {leadSourceData.map((source, i) => (
                <div key={source.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: theme.series[i] || '#8888a0' }} />
                  <span className="text-sm w-24" style={{ color: ds.textMuted }}>{source.name}</span>
                  <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: ds.divider }}>
                    <div className="h-full rounded-full" style={{ backgroundColor: theme.series[i] || '#8888a0', width: `${(source.value / 42) * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{source.value}%</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Active Deals */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active Deals</h2>
          <ChartTypeSelector options={['horizontalBar', 'bar', 'pie', 'donut']} value={activeDealsType} onChange={setActiveDealsType} />
        </div>

        {activeDealsType === 'horizontalBar' && (
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
        )}

        {activeDealsType === 'bar' && (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={recentDeals.map(d => ({ name: d.name.split(' ').slice(0, 2).join(' '), value: d.value, weighted: Math.round(d.value * d.probability / 100) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke={ch.gridColor} vertical={false} />
              <XAxis dataKey="name" stroke={ds.textMuted} style={{ fontSize: '0.6rem' }} angle={-20} textAnchor="end" height={50} />
              <YAxis stroke={ds.textMuted} style={{ fontSize: '0.7rem' }} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
              <Bar dataKey="value" fill={tc.primary} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Deal Value" opacity={0.5} />
              <Bar dataKey="weighted" fill={tc.positive} radius={[ch.barRadius, ch.barRadius, 0, 0]} name="Weighted Value" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {(activeDealsType === 'pie' || activeDealsType === 'donut') && (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={280}>
              <PieChart>
                <Pie data={recentDeals.map(d => ({ name: d.name.split(' ').slice(0, 2).join(' '), value: d.value }))} cx="50%" cy="50%" innerRadius={activeDealsType === 'donut' ? 55 : 0} outerRadius={90} paddingAngle={2} dataKey="value" nameKey="name">
                  {recentDeals.map((_, i) => <Cell key={i} fill={theme.series[i % theme.series.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: ch.tooltipBg, border: `1px solid ${ch.tooltipBorder}`, borderRadius: '0.5rem', color: ds.textPrimary }} formatter={(v: any) => formatFullCurrency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 flex-1 max-h-[280px] overflow-y-auto">
              {recentDeals.map((deal, i) => (
                <div key={deal.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: theme.series[i % theme.series.length] }} />
                  <span className="text-xs flex-1 truncate" style={{ color: ds.textMuted }}>{deal.name}</span>
                  <span className="text-xs font-semibold">{formatCurrency(deal.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
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
  const [hasIntegrations, setHasIntegrations] = useState<boolean | null>(null);
  const [orgName, setOrgName] = useState<string>('');

  useEffect(() => {
    async function checkIntegrations() {
      try {
        const res = await fetch('/api/integrations/status');
        if (res.ok) {
          const data = await res.json();
          const connections = data.connections || [];
          const connected = connections.filter((c: { status: string }) => c.status === 'connected');
          setHasIntegrations(connected.length > 0);
          if (data.org_name) setOrgName(data.org_name);
        } else {
          // If status check fails, show dashboard anyway
          setHasIntegrations(true);
        }
      } catch {
        setHasIntegrations(true);
      }
    }
    checkIntegrations();
  }, []);

  // Show loading while checking
  if (hasIntegrations === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#8888a0] text-sm">Loading dashboard...</div>
      </div>
    );
  }

  // Show onboarding wizard if no integrations connected
  if (!hasIntegrations) {
    return <OnboardingWizard orgName={orgName} />;
  }

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
