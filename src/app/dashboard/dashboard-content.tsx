'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CashFlowChart } from '@/components/charts/cashflow-chart';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Loader2, Link as LinkIcon, RefreshCw, CheckCircle2, Clock, Users, Target, Phone, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import { formatCompactCurrency } from '@/lib/utils';

/**
 * Matches the DashboardData type from @/types
 * This is what /api/qbo/data returns at response.data
 */
interface DashboardData {
  revenue: number;
  expenses: number;
  profit: number;
  cash_balance: number;
  accounts_receivable: number;
  accounts_payable: number;
  jobs: Array<any>;
  invoices: Array<{
    id: string;
    invoice_number: string;
    customer_name: string;
    amount: number;
    due_date: string;
    status: string;
    days_overdue: number;
  }>;
  cash_flow: Array<{
    month: string;
    inflow: number;
    outflow: number;
    net: number;
  }>;
  metrics: Array<{
    label: string;
    value: number;
    change: number;
    changeType: string;
    format: string;
  }>;
  last_updated: string;
}

interface ApiResponse {
  success: boolean;
  data?: DashboardData;
  message?: string;
  error?: string;
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'cashflow', label: 'Cash Flow' },
  { id: 'wip', label: 'WIP' },
  { id: 'retainage', label: 'Retainage' },
  { id: 'sales', label: 'Sales' },
];

/* ──────────────────────────────────────────────────────
   DEMO / MOCK DATA
   Realistic data for a $3M custom home builder
   ────────────────────────────────────────────────────── */

const MOCK_INVOICES = [
  { id: '1', invoice_number: 'INV-2026-0147', customer_name: 'Riverside Estate — Draw #6', amount: 142500, due_date: '2026-04-18', status: 'sent', days_overdue: 0 },
  { id: '2', invoice_number: 'INV-2026-0143', customer_name: 'Cedar Heights Addition', amount: 63000, due_date: '2026-04-05', status: 'overdue', days_overdue: 7 },
  { id: '3', invoice_number: 'INV-2026-0139', customer_name: 'Heritage Park Commercial — Draw #9', amount: 218750, due_date: '2026-03-28', status: 'overdue', days_overdue: 15 },
  { id: '4', invoice_number: 'INV-2026-0135', customer_name: 'Oakwood Duplex — Final', amount: 95000, due_date: '2026-04-22', status: 'sent', days_overdue: 0 },
  { id: '5', invoice_number: 'INV-2026-0131', customer_name: 'Mountain View Remodel — Retainage Release', amount: 8250, due_date: '2026-04-01', status: 'overdue', days_overdue: 11 },
  { id: '6', invoice_number: 'INV-2026-0128', customer_name: 'Riverside Estate — Draw #5', amount: 142500, due_date: '2026-03-15', status: 'paid', days_overdue: 0 },
  { id: '7', invoice_number: 'INV-2026-0124', customer_name: 'Heritage Park Commercial — Draw #8', amount: 218750, due_date: '2026-03-01', status: 'paid', days_overdue: 0 },
  { id: '8', invoice_number: 'INV-2026-0121', customer_name: 'Cedar Heights Addition — Draw #3', amount: 42000, due_date: '2026-02-20', status: 'paid', days_overdue: 0 },
  { id: '9', invoice_number: 'INV-2026-0117', customer_name: 'Oakwood Duplex — Draw #7', amount: 57000, due_date: '2026-02-10', status: 'paid', days_overdue: 0 },
  { id: '10', invoice_number: 'INV-2026-0112', customer_name: 'Silverado Ranch Custom Home', amount: 185000, due_date: '2026-04-30', status: 'draft', days_overdue: 0 },
  { id: '11', invoice_number: 'INV-2026-0108', customer_name: 'Mountain View Remodel — Final', amount: 16500, due_date: '2026-01-25', status: 'paid', days_overdue: 0 },
  { id: '12', invoice_number: 'INV-2026-0104', customer_name: 'Heritage Park Commercial — Draw #7', amount: 218750, due_date: '2026-01-15', status: 'paid', days_overdue: 0 },
];

const MOCK_CASH_FLOW = [
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

const MOCK_WIP_JOBS = [
  {
    name: 'Riverside Estate Custom Home',
    contract: 950000,
    costsToDate: 689350,
    billedToDate: 712500,
    pctComplete: 82,
    estMargin: 27.4,
    billingStatus: 'Over-Billed' as const,
    billingVariance: 23150,
    status: 'Active',
  },
  {
    name: 'Heritage Park Commercial',
    contract: 1450000,
    costsToDate: 1182100,
    billedToDate: 1312500,
    pctComplete: 77,
    estMargin: 18.5,
    billingStatus: 'Over-Billed' as const,
    billingVariance: 130400,
    status: 'Active',
  },
  {
    name: 'Cedar Heights Addition',
    contract: 210000,
    costsToDate: 155400,
    billedToDate: 147000,
    pctComplete: 93,
    estMargin: 26.0,
    billingStatus: 'Under-Billed' as const,
    billingVariance: -8400,
    status: 'Active',
  },
  {
    name: 'Oakwood Duplex',
    contract: 380000,
    costsToDate: 296400,
    billedToDate: 304000,
    pctComplete: 94,
    estMargin: 22.0,
    billingStatus: 'Over-Billed' as const,
    billingVariance: 7600,
    status: 'Active',
  },
  {
    name: 'Silverado Ranch Custom Home',
    contract: 1120000,
    costsToDate: 112000,
    billedToDate: 56000,
    pctComplete: 12,
    estMargin: 24.8,
    billingStatus: 'Under-Billed' as const,
    billingVariance: -56000,
    status: 'Active',
  },
  {
    name: 'Mountain View Remodel',
    contract: 165000,
    costsToDate: 127050,
    billedToDate: 165000,
    pctComplete: 100,
    estMargin: 23.0,
    billingStatus: 'Fully Billed' as const,
    billingVariance: 0,
    status: 'Complete',
  },
];

const MOCK_RETAINAGE = [
  { jobName: 'Riverside Estate Custom Home', retainageHeld: 47500, pctContract: 5.0, eligibleDate: 'May 2026', status: 'Eligible' as const, gc: 'Owner-Direct' },
  { jobName: 'Heritage Park Commercial', retainageHeld: 72500, pctContract: 5.0, eligibleDate: 'Jul 2026', status: 'Pending' as const, gc: 'Summit Development' },
  { jobName: 'Mountain View Remodel', retainageHeld: 8250, pctContract: 5.0, eligibleDate: 'Apr 2026', status: 'Overdue' as const, gc: 'Parkside Homes' },
  { jobName: 'Cedar Heights Addition', retainageHeld: 31500, pctContract: 15.0, eligibleDate: 'Jun 2026', status: 'Eligible' as const, gc: 'Owner-Direct' },
  { jobName: 'Oakwood Duplex', retainageHeld: 36750, pctContract: 9.7, eligibleDate: 'Apr 2026', status: 'Overdue' as const, gc: 'Crestline Properties' },
  { jobName: 'Silverado Ranch Custom Home', retainageHeld: 5600, pctContract: 0.5, eligibleDate: 'Dec 2026', status: 'Pending' as const, gc: 'Owner-Direct' },
];

const MOCK_SALES_REPS = [
  {
    name: 'Jake Morrison',
    role: 'Senior Estimator',
    pipeline: 2850000,
    wonYTD: 1330000,
    lostYTD: 420000,
    closeRate: 76,
    avgDealSize: 332500,
    activeProposals: 4,
    callsMTD: 47,
    meetingsMTD: 12,
  },
  {
    name: 'Rachel Torres',
    role: 'Business Development',
    pipeline: 1920000,
    wonYTD: 890000,
    lostYTD: 310000,
    closeRate: 74,
    avgDealSize: 222500,
    activeProposals: 6,
    callsMTD: 63,
    meetingsMTD: 18,
  },
  {
    name: 'Marcus Webb',
    role: 'Estimator',
    pipeline: 1150000,
    wonYTD: 540000,
    lostYTD: 280000,
    closeRate: 66,
    avgDealSize: 180000,
    activeProposals: 3,
    callsMTD: 38,
    meetingsMTD: 9,
  },
];

const MOCK_SALES_PIPELINE = [
  { project: 'Aspen Ridge Spec Home', client: 'Internal Build', value: 875000, stage: 'Proposal Sent', probability: 90, estClose: 'Apr 2026', rep: 'Jake Morrison' },
  { project: 'Lakewood Office Renovation', client: 'Lakewood Medical Group', value: 420000, stage: 'Negotiation', probability: 75, estClose: 'May 2026', rep: 'Rachel Torres' },
  { project: 'Summit View Custom Home', client: 'Thompson Family', value: 1100000, stage: 'Qualification', probability: 40, estClose: 'Jun 2026', rep: 'Jake Morrison' },
  { project: 'Parkside Townhomes Ph.2', client: 'Crestline Properties', value: 2200000, stage: 'Proposal Sent', probability: 60, estClose: 'Jul 2026', rep: 'Rachel Torres' },
  { project: 'Downtown Loft Conversion', client: 'Metro Living LLC', value: 650000, stage: 'Discovery', probability: 25, estClose: 'Aug 2026', rep: 'Marcus Webb' },
  { project: 'Highland Ranch Addition', client: 'Garcia Family', value: 195000, stage: 'Verbal Commit', probability: 95, estClose: 'Apr 2026', rep: 'Marcus Webb' },
  { project: 'Willow Creek Remodel', client: 'Nguyen Family', value: 310000, stage: 'Proposal Sent', probability: 55, estClose: 'May 2026', rep: 'Rachel Torres' },
  { project: 'Valley Industrial Warehouse', client: 'West Valley Logistics', value: 1800000, stage: 'Discovery', probability: 20, estClose: 'Sep 2026', rep: 'Jake Morrison' },
];

/* ──────────────────────────────────────────────────────
   END MOCK DATA
   ────────────────────────────────────────────────────── */

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const getClientId = () =>
    typeof window !== 'undefined' ? window.localStorage?.getItem?.('selectedClientId') || null : null;

  const getLocationId = () =>
    typeof window !== 'undefined' ? window.localStorage?.getItem?.('selectedLocationId') || null : null;

  const fetchData = useCallback(async (cid?: string | null, lid?: string | null) => {
    try {
      setLoading(true);
      setError(null);
      const id = cid !== undefined ? cid : getClientId();
      const locationId = lid !== undefined ? lid : getLocationId();
      const params = new URLSearchParams();
      if (id) params.set('clientCompanyId', id);
      if (locationId) params.set('locationId', locationId);
      const qs = params.size > 0 ? '?' + params.toString() : '';
      const url = `/api/qbo/data${qs}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }
      const json: ApiResponse = await response.json();
      setData(json);

      // If no meaningful data yet, auto-trigger a sync
      const d = json.data;
      const isEmpty = !d || (d.revenue === 0 && d.expenses === 0 && d.invoices?.length === 0);
      if (json.success && isEmpty) {
        await triggerSync(id, locationId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerSync = async (cid?: string | null, lid?: string | null) => {
    try {
      setSyncing(true);
      const id = cid !== undefined ? cid : getClientId();
      const locationId = lid !== undefined ? lid : getLocationId();
      const body = id ? JSON.stringify({ clientCompanyId: id }) : undefined;
      const syncResponse = await fetch('/api/qbo/sync', {
        method: 'POST',
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body,
      });
      const syncJson = await syncResponse.json();

      if (syncJson.success && syncJson.data) {
        setData({ success: true, data: syncJson.data });
      } else {
        console.warn('Sync returned no data:', syncJson.error || syncJson.message);
        const params = new URLSearchParams();
        if (id) params.set('clientCompanyId', id);
        if (locationId) params.set('locationId', locationId);
        const qs = params.size > 0 ? '?' + params.toString() : '';
        const refetch = await fetch(`/api/qbo/data${qs}`);
        const refetchJson = await refetch.json();
        if (refetchJson.success) {
          setData(refetchJson);
        }
      }
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    const initialClient = getClientId();
    const initialLocation = getLocationId();
    setClientId(initialClient);
    fetchData(initialClient, initialLocation);

    // Listen for client switches from the layout
    const handleClientChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const newClientId = detail?.clientId ?? null;
      setClientId(newClientId);
      fetchData(newClientId, getLocationId());
    };

    // Listen for location switches from the sidebar
    const handleLocationChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      fetchData(getClientId(), detail?.locationId ?? null);
    };

    window.addEventListener('clientChanged', handleClientChange);
    window.addEventListener('locationChanged', handleLocationChange);
    return () => {
      window.removeEventListener('clientChanged', handleClientChange);
      window.removeEventListener('locationChanged', handleLocationChange);
    };
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const dashData = data?.data;
  const hasRealData = data?.success && dashData && (
    dashData.revenue > 0 ||
    dashData.expenses > 0 ||
    (dashData.invoices && dashData.invoices.length > 0) ||
    dashData.cash_balance > 0
  );

  /* When there's no real QBO data, use mock data so the dashboard looks alive */
  const useMock = !hasRealData;
  const revenue = hasRealData ? (dashData?.revenue || 0) : 2854200;
  const expenses = hasRealData ? (dashData?.expenses || 0) : 2109900;
  const profit = hasRealData ? (dashData?.profit || 0) : 744300;
  const cashBalance = hasRealData ? (dashData?.cash_balance || 0) : 487250;
  const arTotal = hasRealData ? (dashData?.accounts_receivable || 0) : 528500;
  const apTotal = hasRealData ? (dashData?.accounts_payable || 0) : 312800;
  const invoices = hasRealData ? (dashData?.invoices || []) : MOCK_INVOICES;
  const cashFlowData = hasRealData ? (dashData?.cash_flow || []) : MOCK_CASH_FLOW;

  // Calculate AR from invoices if the aggregate is 0
  const computedAR = arTotal > 0 ? arTotal : invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  /* Helper: format number as $XXX,XXX */
  const fmtDollar = (n: number) => '$' + n.toLocaleString('en-US');
  const fmtPct = (n: number) => n.toFixed(1) + '%';

  return (
    <div className="space-y-6">
      {/* Tab Navigation + Sync Button */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex-1 overflow-x-auto -mx-1 px-1 scrollbar-none">
          <div className="inline-flex min-w-full sm:min-w-0 bg-[#1a1a26] border border-[#2a2a3d] rounded-lg p-1 gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-[#2a2a3d]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={triggerSync}
          disabled={syncing}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1a1a26] border border-[#2a2a3d] text-gray-300 hover:text-white hover:bg-[#2a2a3d] rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
          title="Sync QuickBooks data"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Sync'}</span>
        </button>
      </div>

      {syncing && (
        <div className="flex items-center gap-3 p-3 bg-indigo-900/20 border border-indigo-800/30 rounded-lg">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <p className="text-indigo-300 text-sm">Syncing data from QuickBooks...</p>
        </div>
      )}

      {/* Demo banner */}
      {useMock && !syncing && (
        <div className="flex items-center gap-3 p-3 bg-indigo-900/15 border border-indigo-700/25 rounded-lg">
          <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <p className="text-indigo-300 text-sm">
            Showing sample data &mdash; connect QuickBooks and click <strong>Sync</strong> to see your real numbers.
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          OVERVIEW TAB
          ═══════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Win & Watch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#0d1f0d] border-l-2 border-[#22c55e] rounded-r-lg px-4 py-3">
              <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
              <p className="text-sm text-[#e8e8f0] mt-0.5">Net cash position up 26.1% &mdash; strongest quarter in 12 months.</p>
            </div>
            <div className="bg-[#1f1a0d] border-l-2 border-[#eab308] rounded-r-lg px-4 py-3">
              <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
              <p className="text-sm text-[#e8e8f0] mt-0.5">AR aging over 60 days crept up 8% &mdash; follow up on 3 invoices.</p>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { label: 'Revenue (YTD)', value: revenue, change: '+12.3%', up: true, icon: DollarSign, iconColor: 'text-indigo-500' },
              { label: 'Expenses (YTD)', value: expenses, change: '+6.8%', up: false, icon: TrendingUp, iconColor: 'text-orange-500' },
              { label: 'Accounts Receivable', value: computedAR, change: '+3.1%', up: false, icon: FileText, iconColor: 'text-yellow-500' },
              { label: 'Accounts Payable', value: apTotal, change: '-8.2%', up: true, icon: FileText, iconColor: 'text-blue-500' },
              { label: 'Cash Balance', value: cashBalance, change: '+26.1%', up: true, icon: DollarSign, iconColor: 'text-green-500' },
              { label: 'Net Profit', value: profit, change: '+18.7%', up: true, icon: TrendingUp, iconColor: 'text-emerald-500' },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <Card key={kpi.label} className={`bg-gray-800 border-gray-700 p-4 border-l-2 ${kpi.up ? '!border-l-green-500' : '!border-l-red-500'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-[11px] sm:text-xs font-medium">{kpi.label}</p>
                    <Icon className={`w-4 h-4 ${kpi.iconColor}`} />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-white">{formatCompactCurrency(kpi.value)}</p>
                  <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${kpi.up ? 'text-green-400' : 'text-red-400'}`}>
                    {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.change}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Invoices Summary */}
          {invoices.length > 0 && (
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Outstanding Invoices</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Invoice #</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Customer</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Due Date</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.slice(0, 10).map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-3 px-4 text-white font-mono text-xs">{invoice.invoice_number}</td>
                        <td className="py-3 px-4 text-gray-300">{invoice.customer_name}</td>
                        <td className="py-3 px-4 text-right text-white font-medium">
                          {formatCompactCurrency(invoice.amount)}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              invoice.status === 'overdue' ? 'danger' :
                              invoice.status === 'paid' ? 'success' :
                              'info'
                            }
                          >
                            {invoice.status === 'overdue'
                              ? `Overdue ${invoice.days_overdue}d`
                              : invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)
                            }
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Cash Flow Chart */}
          {cashFlowData.length > 0 && (
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Cash Flow (12 Months)</h3>
              <CashFlowChart
                data={cashFlowData.map((cf) => ({
                  month: cf.month,
                  inflows: cf.inflow,
                  outflows: cf.outflow,
                  net: cf.net,
                  isForecast: false,
                }))}
              />
            </Card>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          INVOICES TAB
          ═══════════════════════════════════════════════ */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          {/* Win & Watch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#0d1f0d] border-l-2 border-[#22c55e] rounded-r-lg px-4 py-3">
              <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
              <p className="text-sm text-[#e8e8f0] mt-0.5">6 of 12 invoices fully paid &mdash; $653.5K collected this quarter.</p>
            </div>
            <div className="bg-[#1f1a0d] border-l-2 border-[#eab308] rounded-r-lg px-4 py-3">
              <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
              <p className="text-sm text-[#e8e8f0] mt-0.5">Heritage Park Draw #9 is 15 days overdue ($218.7K) &mdash; escalate to project manager.</p>
            </div>
          </div>

          {/* AR Aging Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Current', amount: 422500, color: 'border-l-green-500', textColor: 'text-green-400' },
              { label: '1-30 Days', amount: 63000, color: 'border-l-yellow-500', textColor: 'text-yellow-400' },
              { label: '31-60 Days', amount: 0, color: 'border-l-orange-500', textColor: 'text-orange-400' },
              { label: '61-90 Days', amount: 227000, color: 'border-l-red-500', textColor: 'text-red-400' },
            ].map((bucket) => (
              <Card key={bucket.label} className={`bg-gray-800 border-gray-700 p-4 border-l-2 ${bucket.color}`}>
                <p className="text-xs text-gray-400 mb-1">{bucket.label}</p>
                <p className={`text-lg font-bold ${bucket.amount > 0 ? bucket.textColor : 'text-gray-600'}`}>
                  {bucket.amount > 0 ? fmtDollar(bucket.amount) : '$0'}
                </p>
              </Card>
            ))}
          </div>

          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">All Invoices</h3>
              <div className="flex gap-4 text-sm">
                <span className="text-gray-400">
                  Total: <span className="text-white font-medium">{fmtDollar(invoices.reduce((s, i) => s + i.amount, 0))}</span>
                </span>
                <span className="text-gray-400">
                  Overdue: <span className="text-red-400 font-medium">
                    {invoices.filter(i => i.status === 'overdue').length}
                  </span>
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Invoice #</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Customer</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Due Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Days Overdue</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-3 px-4 text-white font-mono text-xs">{invoice.invoice_number}</td>
                      <td className="py-3 px-4 text-gray-300">{invoice.customer_name}</td>
                      <td className="py-3 px-4 text-right text-white font-medium">
                        {fmtDollar(invoice.amount)}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            invoice.status === 'overdue' ? 'danger' :
                            invoice.status === 'paid' ? 'success' :
                            invoice.status === 'sent' ? 'info' :
                            'default'
                          }
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {invoice.days_overdue > 0 ? (
                          <span className="text-red-400 font-semibold">{invoice.days_overdue} days</span>
                        ) : (
                          <span className="text-gray-500">&mdash;</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          CASH FLOW TAB
          ═══════════════════════════════════════════════ */}
      {activeTab === 'cashflow' && (
        <div className="space-y-6">
          {/* Win & Watch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#0d1f0d] border-l-2 border-[#22c55e] rounded-r-lg px-4 py-3">
              <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
              <p className="text-sm text-[#e8e8f0] mt-0.5">Net positive cash flow for 3 of the last 4 months &mdash; $148K net inflow since January.</p>
            </div>
            <div className="bg-[#1f1a0d] border-l-2 border-[#eab308] rounded-r-lg px-4 py-3">
              <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
              <p className="text-sm text-[#e8e8f0] mt-0.5">December was the worst month at -$58K &mdash; plan draws around holiday slowdowns next year.</p>
            </div>
          </div>

          {/* Cash Flow KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Cash In (12mo)', value: 3950000, change: '+14.2%', up: true },
              { label: 'Total Cash Out (12mo)', value: 3705000, change: '+8.1%', up: false },
              { label: 'Net Cash Flow', value: 245000, change: '+42.3%', up: true },
              { label: 'Avg Monthly Net', value: 20417, change: '+18.9%', up: true },
            ].map((kpi) => (
              <Card key={kpi.label} className={`bg-gray-800 border-gray-700 p-4 border-l-2 ${kpi.up ? '!border-l-green-500' : '!border-l-red-500'}`}>
                <p className="text-xs text-gray-400 mb-1">{kpi.label}</p>
                <p className="text-lg font-bold text-white">{fmtDollar(kpi.value)}</p>
                <p className={`text-xs font-semibold ${kpi.up ? 'text-green-400' : 'text-red-400'}`}>{kpi.change}</p>
              </Card>
            ))}
          </div>

          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Monthly Cash Flow &mdash; Last 12 Months</h3>
            <CashFlowChart
              data={cashFlowData.map((cf) => ({
                month: cf.month,
                inflows: cf.inflow,
                outflows: cf.outflow,
                net: cf.net,
                isForecast: false,
              }))}
            />
          </Card>

          {/* Monthly Breakdown Table */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Monthly Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Month</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Cash In</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Cash Out</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Net</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {cashFlowData.map((cf) => {
                    const margin = cf.inflow > 0 ? ((cf.net / cf.inflow) * 100) : 0;
                    const isPositive = cf.net >= 0;
                    return (
                      <tr key={cf.month} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-3 px-4 text-white font-medium">{cf.month}</td>
                        <td className="py-3 px-4 text-right text-green-400">{fmtDollar(cf.inflow)}</td>
                        <td className="py-3 px-4 text-right text-red-400">{fmtDollar(cf.outflow)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {isPositive ? '+' : ''}{fmtDollar(cf.net)}
                        </td>
                        <td className={`py-3 px-4 text-right font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {margin.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          WIP TAB
          ═══════════════════════════════════════════════ */}
      {activeTab === 'wip' && (
        <div className="space-y-6">
          {/* Win & Watch */}
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

          {/* WIP Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Active Jobs', value: '5', sub: '1 Complete' },
              { label: 'Total Backlog', value: fmtDollar(MOCK_WIP_JOBS.reduce((s, j) => s + j.contract, 0)), sub: '6 contracts' },
              { label: 'Over-Billed', value: fmtDollar(MOCK_WIP_JOBS.filter(j => j.billingVariance > 0).reduce((s, j) => s + j.billingVariance, 0)), sub: 'Liability' },
              { label: 'Under-Billed', value: fmtDollar(Math.abs(MOCK_WIP_JOBS.filter(j => j.billingVariance < 0).reduce((s, j) => s + j.billingVariance, 0))), sub: 'Asset' },
            ].map((kpi) => (
              <Card key={kpi.label} className="bg-gray-800 border-gray-700 p-4">
                <p className="text-xs text-gray-400 mb-1">{kpi.label}</p>
                <p className="text-lg font-bold text-white">{kpi.value}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{kpi.sub}</p>
              </Card>
            ))}
          </div>

          {/* WIP Schedule Table */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">WIP Schedule &mdash; Active Jobs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Job Name</th>
                    <th className="text-right py-3 px-3 text-gray-400 font-semibold">Contract</th>
                    <th className="text-right py-3 px-3 text-gray-400 font-semibold">Costs to Date</th>
                    <th className="text-right py-3 px-3 text-gray-400 font-semibold">Billed to Date</th>
                    <th className="text-center py-3 px-3 text-gray-400 font-semibold">% Complete</th>
                    <th className="text-right py-3 px-3 text-gray-400 font-semibold">Est. Margin</th>
                    <th className="text-right py-3 px-3 text-gray-400 font-semibold">Billing Status</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_WIP_JOBS.map((job) => {
                    const billingColor = job.billingStatus === 'Over-Billed' ? 'text-yellow-400' : job.billingStatus === 'Under-Billed' ? 'text-red-400' : 'text-green-400';
                    const marginColor = job.estMargin >= 22 ? 'text-green-400' : job.estMargin >= 18 ? 'text-yellow-400' : 'text-red-400';
                    return (
                      <tr key={job.name} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-3 px-3 text-white font-medium whitespace-nowrap">{job.name}</td>
                        <td className="py-3 px-3 text-right text-gray-300">{fmtDollar(job.contract)}</td>
                        <td className="py-3 px-3 text-right text-gray-300">{fmtDollar(job.costsToDate)}</td>
                        <td className="py-3 px-3 text-right text-gray-300">{fmtDollar(job.billedToDate)}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${job.pctComplete >= 100 ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(job.pctComplete, 100)}%` }} />
                            </div>
                            <span className="text-xs text-gray-300">{job.pctComplete}%</span>
                          </div>
                        </td>
                        <td className={`py-3 px-3 text-right font-bold ${marginColor}`}>{fmtPct(job.estMargin)}</td>
                        <td className={`py-3 px-3 text-right font-semibold whitespace-nowrap ${billingColor}`}>
                          {job.billingStatus}{job.billingVariance !== 0 && ` ${fmtDollar(Math.abs(job.billingVariance))}`}
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant={job.status === 'Active' ? 'info' : 'success'}>{job.status}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          RETAINAGE TAB
          ═══════════════════════════════════════════════ */}
      {activeTab === 'retainage' && (
        <div className="space-y-6">
          {/* Win & Watch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#0d1f0d] border-l-2 border-[#22c55e] rounded-r-lg px-4 py-3">
              <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
              <p className="text-sm text-[#e8e8f0] mt-0.5">$79K in retainage eligible for release this month &mdash; submit release requests.</p>
            </div>
            <div className="bg-[#1f1a0d] border-l-2 border-[#eab308] rounded-r-lg px-4 py-3">
              <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
              <p className="text-sm text-[#e8e8f0] mt-0.5">2 GCs holding retainage past contractual release date &mdash; escalate to project lead.</p>
            </div>
          </div>

          {/* Retainage KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(() => {
              const totalHeld = MOCK_RETAINAGE.reduce((s, r) => s + r.retainageHeld, 0);
              const eligible = MOCK_RETAINAGE.filter(r => r.status === 'Eligible').reduce((s, r) => s + r.retainageHeld, 0);
              const overdue = MOCK_RETAINAGE.filter(r => r.status === 'Overdue').reduce((s, r) => s + r.retainageHeld, 0);
              const pending = MOCK_RETAINAGE.filter(r => r.status === 'Pending').reduce((s, r) => s + r.retainageHeld, 0);
              return [
                { label: 'Total Retainage Held', value: fmtDollar(totalHeld), color: 'text-white' },
                { label: 'Eligible for Release', value: fmtDollar(eligible), color: 'text-green-400' },
                { label: 'Pending', value: fmtDollar(pending), color: 'text-yellow-400' },
                { label: 'Overdue', value: fmtDollar(overdue), color: 'text-red-400' },
              ];
            })().map((kpi) => (
              <Card key={kpi.label} className="bg-gray-800 border-gray-700 p-4">
                <p className="text-xs text-gray-400 mb-1">{kpi.label}</p>
                <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</p>
              </Card>
            ))}
          </div>

          {/* Retainage Table */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Retainage Tracking</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Job Name</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">GC / Owner</th>
                    <th className="text-right py-3 px-3 text-gray-400 font-semibold">Retainage Held</th>
                    <th className="text-right py-3 px-3 text-gray-400 font-semibold">% of Contract</th>
                    <th className="text-right py-3 px-3 text-gray-400 font-semibold">Eligible Date</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_RETAINAGE.map((r) => (
                    <tr key={r.jobName} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-3 px-3 text-white font-medium whitespace-nowrap">{r.jobName}</td>
                      <td className="py-3 px-3 text-gray-300">{r.gc}</td>
                      <td className="py-3 px-3 text-right text-white font-medium">{fmtDollar(r.retainageHeld)}</td>
                      <td className="py-3 px-3 text-right text-gray-300">{fmtPct(r.pctContract)}</td>
                      <td className="py-3 px-3 text-right text-gray-300">{r.eligibleDate}</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            r.status === 'Eligible' ? 'success' :
                            r.status === 'Overdue' ? 'danger' :
                            'warning'
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          SALES TAB
          ═══════════════════════════════════════════════ */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          {/* Win & Watch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#0d1f0d] border-l-2 border-[#22c55e] rounded-r-lg px-4 py-3">
              <span className="text-[10px] uppercase tracking-wide text-[#22c55e] font-semibold">Win</span>
              <p className="text-sm text-[#e8e8f0] mt-0.5">$2.76M won YTD across 3 reps &mdash; team close rate averaging 72%.</p>
            </div>
            <div className="bg-[#1f1a0d] border-l-2 border-[#eab308] rounded-r-lg px-4 py-3">
              <span className="text-[10px] uppercase tracking-wide text-[#eab308] font-semibold">Watch</span>
              <p className="text-sm text-[#e8e8f0] mt-0.5">$1.01M in lost deals YTD &mdash; review Discovery-stage drop-offs with Marcus.</p>
            </div>
          </div>

          {/* Pipeline KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Total Pipeline', value: '$5.92M', sub: '8 active deals', icon: Target, iconColor: 'text-indigo-400' },
              { label: 'Won YTD', value: '$2.76M', sub: '10 contracts', icon: CheckCircle2, iconColor: 'text-green-400' },
              { label: 'Avg Close Rate', value: '72%', sub: 'Team average', icon: TrendingUp, iconColor: 'text-blue-400' },
              { label: 'Avg Deal Size', value: '$245K', sub: 'All reps', icon: DollarSign, iconColor: 'text-yellow-400' },
              { label: 'Weighted Pipeline', value: '$3.24M', sub: 'Probability-adjusted', icon: Target, iconColor: 'text-purple-400' },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <Card key={kpi.label} className="bg-gray-800 border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] text-gray-400">{kpi.label}</p>
                    <Icon className={`w-4 h-4 ${kpi.iconColor}`} />
                  </div>
                  <p className="text-lg font-bold text-white">{kpi.value}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{kpi.sub}</p>
                </Card>
              );
            })}
          </div>

          {/* Sales Rep KPIs */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Sales Rep Performance</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {MOCK_SALES_REPS.map((rep) => (
                <div key={rep.name} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 space-y-3">
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
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Pipeline</span>
                      <span className="text-white font-medium">{fmtDollar(rep.pipeline)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Won YTD</span>
                      <span className="text-green-400 font-medium">{fmtDollar(rep.wonYTD)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Lost YTD</span>
                      <span className="text-red-400 font-medium">{fmtDollar(rep.lostYTD)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Avg Deal Size</span>
                      <span className="text-white font-medium">{fmtDollar(rep.avgDealSize)}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-2 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-white">{rep.activeProposals}</p>
                      <p className="text-[10px] text-gray-500">Proposals</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{rep.callsMTD}</p>
                      <p className="text-[10px] text-gray-500">Calls MTD</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{rep.meetingsMTD}</p>
                      <p className="text-[10px] text-gray-500">Meetings</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Sales Pipeline Table */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Active Pipeline</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Project</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Client</th>
                    <th className="text-right py-3 px-3 text-gray-400 font-semibold">Value</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Stage</th>
                    <th className="text-center py-3 px-3 text-gray-400 font-semibold">Probability</th>
                    <th className="text-right py-3 px-3 text-gray-400 font-semibold">Weighted</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Est. Close</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Rep</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_SALES_PIPELINE.map((deal) => {
                    const weighted = deal.value * (deal.probability / 100);
                    const stageColor = deal.probability >= 80 ? 'text-green-400' :
                      deal.probability >= 50 ? 'text-yellow-400' :
                      deal.probability >= 30 ? 'text-orange-400' : 'text-red-400';
                    const stageBg = deal.probability >= 80 ? 'bg-green-400/10' :
                      deal.probability >= 50 ? 'bg-yellow-400/10' :
                      deal.probability >= 30 ? 'bg-orange-400/10' : 'bg-red-400/10';
                    return (
                      <tr key={deal.project} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-3 px-3 text-white font-medium whitespace-nowrap">{deal.project}</td>
                        <td className="py-3 px-3 text-gray-300">{deal.client}</td>
                        <td className="py-3 px-3 text-right text-white font-medium">{fmtDollar(deal.value)}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${stageColor} ${stageBg}`}>
                            {deal.stage}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-12 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${deal.probability >= 80 ? 'bg-green-500' : deal.probability >= 50 ? 'bg-yellow-500' : deal.probability >= 30 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${deal.probability}%` }} />
                            </div>
                            <span className={`text-xs font-semibold ${stageColor}`}>{deal.probability}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right text-gray-400">{fmtDollar(weighted)}</td>
                        <td className="py-3 px-3 text-gray-300">{deal.estClose}</td>
                        <td className="py-3 px-3 text-gray-300 whitespace-nowrap">{deal.rep}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-600">
                    <td className="py-3 px-3 text-white font-semibold" colSpan={2}>Total</td>
                    <td className="py-3 px-3 text-right text-white font-bold">{fmtDollar(MOCK_SALES_PIPELINE.reduce((s, d) => s + d.value, 0))}</td>
                    <td className="py-3 px-3" colSpan={2}></td>
                    <td className="py-3 px-3 text-right text-white font-bold">{fmtDollar(MOCK_SALES_PIPELINE.reduce((s, d) => s + d.value * (d.probability / 100), 0))}</td>
                    <td className="py-3 px-3" colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
