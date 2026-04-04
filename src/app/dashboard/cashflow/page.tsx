'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CashFlowChart } from '@/components/charts/cashflow-chart';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { formatCompactCurrency } from '@/lib/utils';

interface Payment {
  id: string;
  vendor: string;
  amount: number;
  dueDate: string;
  status: 'Due Soon' | 'Overdue' | 'Scheduled';
}

interface Receivable {
  id: string;
  customer: string;
  amount: number;
  expectedDate: string;
  status: 'Expected' | 'At Risk';
}

const upcomingPayments: Payment[] = [];

const upcomingReceivables: Receivable[] = [];

const forecastData = [];

export default function CashFlowPage() {
  const totalUpcomingPayments = upcomingPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const totalUpcomingReceivables = upcomingReceivables.reduce(
    (sum, r) => sum + r.amount,
    0
  );

  if (upcomingPayments.length === 0 && upcomingReceivables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">No Cash Flow Data Yet</h3>
        <p className="text-sm text-[#8888a0] max-w-md">Connect QuickBooks to see your upcoming payments, receivables, and cash flow forecast.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Executive Summary */}
      <div className="mb-4 p-4 rounded-lg bg-[#1a1a26] border border-[#2a2a3d]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">AI Executive Summary</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <span className="text-green-400 text-sm mt-0.5">▲</span>
            <p className="text-sm text-[#c8c8d8]"><span className="font-medium text-green-400">Win:</span> Net positive cash flow for 12 consecutive months, averaging +$134k/mo</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 text-sm mt-0.5">▼</span>
            <p className="text-sm text-[#c8c8d8]"><span className="font-medium text-amber-400">Watch:</span> Q2 forecast shows seasonal dip — Q1 inflows projected down 40% from peak</p>
          </div>
        </div>
      </div>

      {/* Hero Card - Current Cash Position */}
      <Card className="p-8 bg-gradient-to-br from-[#6366f1]/10 to-[#1a1a26] border-[#6366f1]/20">
        <p className="text-[#8888a0] text-sm mb-2">Current Cash Position</p>
        <h1 className="text-5xl font-bold text-[#e8e8f0] mb-4">$0</h1>
        <div className="flex items-center gap-2">
          <TrendingUp className="text-[#22c55e]" size={20} />
          <span className="text-[#22c55e] font-semibold">Pending connection</span>
        </div>
      </Card>

      {/* 12-Month Cash Flow Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">12-Month Cash Flow</h2>
        <CashFlowChart />
      </Card>

      {/* Upcoming Payments & Receivables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Payments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Payments</h2>
            <span className="text-sm font-bold text-[#ef4444]">
              {formatCompactCurrency(totalUpcomingPayments)} total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a3d]">
                  <th className="text-left py-2 px-2 text-[#8888a0] font-medium">
                    Vendor
                  </th>
                  <th className="text-right py-2 px-2 text-[#8888a0] font-medium">
                    Amount
                  </th>
                  <th className="text-right py-2 px-2 text-[#8888a0] font-medium">
                    Due
                  </th>
                  <th className="text-right py-2 px-2 text-[#8888a0] font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {upcomingPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-[#2a2a3d] hover:bg-[#1a1a26] transition-colors"
                  >
                    <td className="py-3 px-2 text-[#e8e8f0] truncate">
                      {payment.vendor}
                    </td>
                    <td className="py-3 px-2 text-right text-[#e8e8f0] font-semibold">
                      {formatCompactCurrency(payment.amount)}
                    </td>
                    <td className="py-3 px-2 text-right text-[#8888a0]">
                      {new Date(payment.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Badge
                        variant={
                          payment.status === 'Due Soon'
                            ? 'warning'
                            : 'info'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Upcoming Receivables */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Receivables</h2>
            <span className="text-sm font-bold text-[#22c55e]">
              {formatCompactCurrency(totalUpcomingReceivables)} total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a3d]">
                  <th className="text-left py-2 px-2 text-[#8888a0] font-medium">
                    Customer
                  </th>
                  <th className="text-right py-2 px-2 text-[#8888a0] font-medium">
                    Amount
                  </th>
                  <th className="text-right py-2 px-2 text-[#8888a0] font-medium">
                    Expected
                  </th>
                  <th className="text-right py-2 px-2 text-[#8888a0] font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {upcomingReceivables.map((receivable) => (
                  <tr
                    key={receivable.id}
                    className="border-b border-[#2a2a3d] hover:bg-[#1a1a26] transition-colors"
                  >
                    <td className="py-3 px-2 text-[#e8e8f0] truncate">
                      {receivable.customer}
                    </td>
                    <td className="py-3 px-2 text-right text-[#e8e8f0] font-semibold">
                      {formatCompactCurrency(receivable.amount)}
                    </td>
                    <td className="py-3 px-2 text-right text-[#8888a0]">
                      {new Date(receivable.expectedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Badge
                        variant={
                          receivable.status === 'At Risk'
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {receivable.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Cash Flow Forecast & Runway */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forecast */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">4-Week Projected Balance</h2>
          <div className="space-y-3">
            {forecastData.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#1a1a26] rounded-lg">
                <span className="text-sm font-medium">{item.week}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[#2a2a3d] rounded-full w-24 overflow-hidden">
                    <div
                      className="h-full bg-[#6366f1]"
                      style={{
                        width: `${Math.min((item.balance / 600000) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-[#e8e8f0] min-w-fit">
                    {formatCompactCurrency(item.balance)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Cash Runway */}
        <Card className="p-6 bg-gradient-to-br from-[#eab308]/10 to-[#1a1a26] border-[#eab308]/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#eab308]/20 rounded-lg flex-shrink-0">
              <AlertCircle className="text-[#eab308]" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-[#e8e8f0] mb-1">Cash Runway</h3>
              <p className="text-3xl font-bold text-[#eab308] mb-2">~8.2 months</p>
              <p className="text-sm text-[#8888a0]">
                At your current burn rate of $156k/month, you have approximately 8.2 months of runway
                before reaching critical cash levels.
              </p>
              <div className="mt-4 p-3 bg-[#1a1a26] rounded">
                <p className="text-xs text-[#8888a0] mb-1">Monthly Burn Rate</p>
                <p className="text-lg font-bold text-[#ef4444]">$156,000/month</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
