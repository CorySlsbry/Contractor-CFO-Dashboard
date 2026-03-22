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

const upcomingPayments: Payment[] = [
  {
    id: '1',
    vendor: 'Summit Materials & Supply',
    amount: 45200,
    dueDate: '2024-03-25',
    status: 'Due Soon',
  },
  {
    id: '2',
    vendor: 'Johnson Electrical Services',
    amount: 28500,
    dueDate: '2024-03-27',
    status: 'Due Soon',
  },
  {
    id: '3',
    vendor: 'BuildRight Equipment Rental',
    amount: 12800,
    dueDate: '2024-03-28',
    status: 'Scheduled',
  },
  {
    id: '4',
    vendor: 'Premium Lumber Co.',
    amount: 67300,
    dueDate: '2024-04-05',
    status: 'Scheduled',
  },
  {
    id: '5',
    vendor: 'Concrete Innovations Ltd',
    amount: 34900,
    dueDate: '2024-04-10',
    status: 'Scheduled',
  },
  {
    id: '6',
    vendor: 'Elite Construction Services',
    amount: 52100,
    dueDate: '2024-04-15',
    status: 'Scheduled',
  },
  {
    id: '7',
    vendor: 'Steel & Iron Fabrication',
    amount: 41200,
    dueDate: '2024-04-18',
    status: 'Scheduled',
  },
  {
    id: '8',
    vendor: 'ProCare Maintenance Inc',
    amount: 8900,
    dueDate: '2024-04-22',
    status: 'Scheduled',
  },
  {
    id: '9',
    vendor: 'Safety First Equipment',
    amount: 6700,
    dueDate: '2024-04-25',
    status: 'Scheduled',
  },
  {
    id: '10',
    vendor: 'FastTrack Delivery Services',
    amount: 3500,
    dueDate: '2024-04-30',
    status: 'Scheduled',
  },
];

const upcomingReceivables: Receivable[] = [
  {
    id: '1',
    customer: 'Heritage Park Development',
    amount: 125000,
    expectedDate: '2024-03-27',
    status: 'Expected',
  },
  {
    id: '2',
    customer: 'Mrs. Sarah Mitchell',
    amount: 50000,
    expectedDate: '2024-03-30',
    status: 'Expected',
  },
  {
    id: '3',
    customer: 'Oakwood Properties LLC',
    amount: 35000,
    expectedDate: '2024-04-05',
    status: 'Expected',
  },
  {
    id: '4',
    customer: 'The Cedar Family',
    amount: 20000,
    expectedDate: '2024-04-10',
    status: 'Expected',
  },
  {
    id: '5',
    customer: 'John & Patricia Johnson',
    amount: 25000,
    expectedDate: '2024-04-12',
    status: 'At Risk',
  },
  {
    id: '6',
    customer: 'Riverside Development Corp',
    amount: 88500,
    expectedDate: '2024-04-20',
    status: 'Expected',
  },
  {
    id: '7',
    customer: 'Mountain View Investors',
    amount: 42300,
    expectedDate: '2024-04-25',
    status: 'Expected',
  },
  {
    id: '8',
    customer: 'Heritage Restoration Inc',
    amount: 67200,
    expectedDate: '2024-05-02',
    status: 'Expected',
  },
  {
    id: '9',
    customer: 'Sunset Properties Group',
    amount: 78900,
    expectedDate: '2024-05-08',
    status: 'Expected',
  },
  {
    id: '10',
    customer: 'Premium Estates LLC',
    amount: 112400,
    expectedDate: '2024-05-15',
    status: 'Expected',
  },
];

const forecastData = [
  { week: 'This Week', balance: 487200 },
  { week: 'Week 2', balance: 512400 },
  { week: 'Week 3', balance: 538900 },
  { week: 'Week 4', balance: 562100 },
];

export default function CashFlowPage() {
  const totalUpcomingPayments = upcomingPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const totalUpcomingReceivables = upcomingReceivables.reduce(
    (sum, r) => sum + r.amount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Hero Card - Current Cash Position */}
      <Card className="p-8 bg-gradient-to-br from-[#6366f1]/10 to-[#1a1a26] border-[#6366f1]/20">
        <p className="text-[#8888a0] text-sm mb-2">Current Cash Position</p>
        <h1 className="text-5xl font-bold text-[#e8e8f0] mb-4">$487,200</h1>
        <div className="flex items-center gap-2">
          <TrendingUp className="text-[#22c55e]" size={20} />
          <span className="text-[#22c55e] font-semibold">+8.7% from last month</span>
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
