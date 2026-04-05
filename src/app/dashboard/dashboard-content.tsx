'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, AlertCircle, Loader2, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { formatCompactCurrency } from '@/lib/utils';

interface SnapshotData {
  revenue?: {
    total: number;
    by_month?: Array<{ month: string; amount: number }>;
  };
  expenses?: {
    total: number;
    by_category?: Array<{ category: string; amount: number }>;
  };
  accounts_receivable?: {
    total: number;
    invoices?: Array<{
      id: string;
      customer_id?: string;
      customer_name: string;
      amount: number;
      due_date: string;
      job_name?: string;
    }>;
  };
  accounts_payable?: {
    total: number;
    bills?: Array<{
      id: string;
      vendor_id?: string;
      vendor_name: string;
      amount: number;
      due_date: string;
      job_name?: string;
    }>;
  };
  cash_flow?: {
    operating: number;
    investing: number;
    financing: number;
  };
  profit_loss?: {
    gross_profit: number;
    net_income: number;
  };
  balance_sheet?: {
    total_assets: number;
    total_liabilities: number;
    equity: number;
  };
}

interface DashboardData {
  success: boolean;
  data?: {
    snapshot_data: SnapshotData;
  };
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'ar', label: 'AR by Job' },
  { id: 'ap', label: 'AP by Job' },
  { id: 'wip', label: 'WIP' },
  { id: 'retainage', label: 'Retainage' },
  { id: 'sales', label: 'Sales' },
];

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/qbo/data');
        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
        setError(errorMessage);
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const snapshotData = data?.data?.snapshot_data || {};
  const hasData = data?.success && snapshotData && Object.keys(snapshotData).length > 0;

  // KPI calculation helpers
  const revenue = snapshotData.revenue?.total || 0;
  const arTotal = snapshotData.accounts_receivable?.total || 0;
  const apTotal = snapshotData.accounts_payable?.total || 0;
  const netIncome = snapshotData.profit_loss?.net_income || 0;
  const operatingCashFlow = snapshotData.cash_flow?.operating || 0;
  const netCash = operatingCashFlow;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="grid w-full grid-cols-6 bg-[#1a1a26] border border-[#2a2a3d] rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-[#2a2a3d]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {!hasData ? (
            <Card className="bg-gray-800 border-gray-700 p-8">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <AlertCircle className="w-12 h-12 text-gray-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    Connect QuickBooks to see your financial overview
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Start tracking your revenue, expenses, and cash flow in real-time.
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
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-gray-800 border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm font-medium">Revenue</p>
                    <DollarSign className="w-4 h-4 text-indigo-500" />
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCompactCurrency(revenue)}</p>
                </Card>

                <Card className="bg-gray-800 border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm font-medium">Accounts Receivable</p>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCompactCurrency(arTotal)}</p>
                </Card>

                <Card className="bg-gray-800 border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm font-medium">Accounts Payable</p>
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCompactCurrency(apTotal)}</p>
                </Card>

                <Card className="bg-gray-800 border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm font-medium">Net Cash</p>
                    <DollarSign className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCompactCurrency(netCash)}</p>
                </Card>

                <Card className="bg-gray-800 border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm font-medium">Net Income</p>
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                  </div>
                  <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCompactCurrency(netIncome)}
                  </p>
                </Card>
              </div>

              {/* Revenue Chart */}
              {snapshotData.revenue?.by_month && snapshotData.revenue.by_month.length > 0 && (
                <Card className="bg-gray-800 border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={snapshotData.revenue.by_month}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#404050" />
                      <XAxis dataKey="month" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#2a2a3d', border: '1px solid #404050' }}
                        formatter={(value) => formatCompactCurrency(Number(value))}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#6366f1"
                        dot={{ fill: '#6366f1' }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Expenses by Category */}
              {snapshotData.expenses?.by_category && snapshotData.expenses.by_category.length > 0 && (
                <Card className="bg-gray-800 border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Expenses by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={snapshotData.expenses.by_category}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#404050" />
                      <XAxis dataKey="category" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#2a2a3d', border: '1px solid #404050' }}
                        formatter={(value) => formatCompactCurrency(Number(value))}
                      />
                      <Bar dataKey="amount" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {/* AR by Job Tab */}
      {activeTab === 'ar' && (
        <div className="space-y-6">
          {!hasData || !snapshotData.accounts_receivable?.invoices || snapshotData.accounts_receivable.invoices.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700 p-8">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <AlertCircle className="w-12 h-12 text-gray-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    {!hasData ? 'Connect QuickBooks to track AR' : 'No outstanding receivables'}
                  </h3>
                  {!hasData && (
                    <>
                      <p className="text-gray-400 mb-4">
                        View and manage your accounts receivable by job.
                      </p>
                      <Link href="/dashboard/integrations">
                        <button className="flex items-center gap-2 mx-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                          <LinkIcon className="w-4 h-4" />
                          Go to Integrations
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Job Name</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Customer</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Due Date</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshotData.accounts_receivable.invoices.map((invoice) => {
                      const dueDate = new Date(invoice.due_date);
                      const today = new Date();
                      const isOverdue = dueDate < today;

                      return (
                        <tr key={invoice.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="py-3 px-4 text-white">{invoice.job_name || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-300">{invoice.customer_name}</td>
                          <td className="py-3 px-4 text-right text-white font-medium">
                            {formatCompactCurrency(invoice.amount)}
                          </td>
                          <td className="py-3 px-4 text-gray-300">{dueDate.toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={isOverdue ? 'danger' : 'success'}
                            >
                              {isOverdue ? 'Overdue' : 'Current'}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* AP by Job Tab */}
      {activeTab === 'ap' && (
        <div className="space-y-6">
          {!hasData || !snapshotData.accounts_payable?.bills || snapshotData.accounts_payable.bills.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700 p-8">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <AlertCircle className="w-12 h-12 text-gray-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    {!hasData ? 'Connect QuickBooks to track AP' : 'No outstanding payables'}
                  </h3>
                  {!hasData && (
                    <>
                      <p className="text-gray-400 mb-4">
                        View and manage your accounts payable by job.
                      </p>
                      <Link href="/dashboard/integrations">
                        <button className="flex items-center gap-2 mx-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                          <LinkIcon className="w-4 h-4" />
                          Go to Integrations
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Job Name</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Vendor</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Due Date</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshotData.accounts_payable.bills.map((bill) => {
                      const dueDate = new Date(bill.due_date);
                      const today = new Date();
                      const isOverdue = dueDate < today;

                      return (
                        <tr key={bill.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="py-3 px-4 text-white">{bill.job_name || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-300">{bill.vendor_name}</td>
                          <td className="py-3 px-4 text-right text-white font-medium">
                            {formatCompactCurrency(bill.amount)}
                          </td>
                          <td className="py-3 px-4 text-gray-300">{dueDate.toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={isOverdue ? 'danger' : 'info'}
                            >
                              {isOverdue ? 'Overdue' : 'Pending'}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
