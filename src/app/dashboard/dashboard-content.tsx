'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CashFlowChart } from '@/components/charts/cashflow-chart';
import { DollarSign, TrendingUp, AlertCircle, Loader2, Link as LinkIcon, RefreshCw } from 'lucide-react';
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
  const hasData = data?.success && dashData && (
    dashData.revenue > 0 ||
    dashData.expenses > 0 ||
    (dashData.invoices && dashData.invoices.length > 0) ||
    dashData.cash_balance > 0
  );

  const revenue = dashData?.revenue || 0;
  const expenses = dashData?.expenses || 0;
  const profit = dashData?.profit || 0;
  const cashBalance = dashData?.cash_balance || 0;
  const arTotal = dashData?.accounts_receivable || 0;
  const apTotal = dashData?.accounts_payable || 0;
  const invoices = dashData?.invoices || [];
  const cashFlowData = dashData?.cash_flow || [];

  // Calculate AR from invoices if the aggregate is 0
  const computedAR = arTotal > 0 ? arTotal : invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {!hasData ? (
            <Card className="bg-gray-800 border-gray-700 p-8">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <AlertCircle className="w-12 h-12 text-gray-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    {data?.success ? 'No financial data yet' : 'Connect QuickBooks to see your financial overview'}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {data?.success
                      ? 'Click "Sync" above to pull your latest QuickBooks data, or add transactions in QBO first.'
                      : 'Start tracking your revenue, expenses, and cash flow in real-time.'}
                  </p>
                  {!data?.success && (
                    <Link href="/dashboard/integrations">
                      <button className="flex items-center gap-2 mx-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                        <LinkIcon className="w-4 h-4" />
                        Go to Integrations
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <Card className="bg-gray-800 border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm font-medium">Revenue</p>
                    <DollarSign className="w-4 h-4 text-indigo-500" />
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCompactCurrency(revenue)}</p>
                </Card>

                <Card className="bg-gray-800 border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm font-medium">Expenses</p>
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCompactCurrency(expenses)}</p>
                </Card>

                <Card className="bg-gray-800 border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm font-medium">Accounts Receivable</p>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCompactCurrency(computedAR)}</p>
                </Card>

                <Card className="bg-gray-800 border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm font-medium">Cash Balance</p>
                    <DollarSign className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCompactCurrency(cashBalance)}</p>
                </Card>

                <Card className="bg-gray-800 border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm font-medium">Net Profit</p>
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                  </div>
                  <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCompactCurrency(profit)}
                  </p>
                </Card>
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
                            <td className="py-3 px-4 text-white">{invoice.invoice_number}</td>
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
                  <h3 className="text-lg font-semibold text-white mb-4">Cash Flow</h3>
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
            </>
          )}
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          {invoices.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700 p-8">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <AlertCircle className="w-12 h-12 text-gray-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    {hasData ? 'No invoices found' : 'Connect QuickBooks to view invoices'}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {hasData
                      ? 'Create invoices in QuickBooks and click Sync to see them here.'
                      : 'View and manage all your invoices in one place.'}
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">All Invoices</h3>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-400">
                    Total: <span className="text-white font-medium">{formatCompactCurrency(invoices.reduce((s, i) => s + i.amount, 0))}</span>
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
                        <td className="py-3 px-4 text-white">{invoice.invoice_number}</td>
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
                              invoice.status === 'sent' ? 'info' :
                              'default'
                            }
                          >
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {invoice.days_overdue > 0 ? (
                            <span className="text-red-400">{invoice.days_overdue} days</span>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Cash Flow Tab */}
      {activeTab === 'cashflow' && (
        <div className="space-y-6">
          {cashFlowData.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700 p-8">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <AlertCircle className="w-12 h-12 text-gray-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    No cash flow data available
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Cash flow data will populate as transactions are recorded in QuickBooks.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Monthly Cash Flow</h3>
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

      {/* WIP Tracking Tab */}
      {activeTab === 'wip' && (
        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700 p-8">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <AlertCircle className="w-12 h-12 text-gray-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  Connect Procore or Buildertrend to track Work in Progress
                </h3>
                <p className="text-gray-400 mb-4">
                  Monitor job progress, costs, and schedules in real-time.
                </p>
                <Link href="/dashboard/integrations">
                  <button className="flex items-center gap-2 mx-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                    <LinkIcon className="w-4 h-4" />
                    Go to Integrations
                  </button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Retainage Tab */}
      {activeTab === 'retainage' && (
        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700 p-8">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <AlertCircle className="w-12 h-12 text-gray-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  Connect Procore or Buildertrend to track retainage
                </h3>
                <p className="text-gray-400 mb-4">
                  Monitor retainage amounts and release schedules.
                </p>
                <Link href="/dashboard/integrations">
                  <button className="flex items-center gap-2 mx-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                    <LinkIcon className="w-4 h-4" />
                    Go to Integrations
                  </button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700 p-8">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <AlertCircle className="w-12 h-12 text-gray-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  Connect Salesforce, HubSpot, or JobNimbus to track your sales pipeline
                </h3>
                <p className="text-gray-400 mb-4">
                  Sync your sales opportunities and team performance.
                </p>
                <Link href="/dashboard/integrations">
                  <button className="flex items-center gap-2 mx-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                    <LinkIcon className="w-4 h-4" />
                    Go to Integrations
                  </button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
