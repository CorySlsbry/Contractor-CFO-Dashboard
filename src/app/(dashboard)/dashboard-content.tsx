'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RevenueChart } from '@/components/charts/revenue-chart';
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
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

// Mock Data
const kpis = [
  {
    title: 'Revenue',
    value: '$2,847,500',
    change: '+12.3%',
    positive: true,
    icon: DollarSign,
  },
  {
    title: 'Expenses',
    value: '$2,103,200',
    change: '+5.2%',
    positive: false,
    icon: TrendingDown,
  },
  {
    title: 'Net Profit',
    value: '$744,300',
    change: '+26.1%',
    positive: true,
    icon: TrendingUp,
  },
  {
    title: 'Cash Balance',
    value: '$487,200',
    change: '+8.7%',
    positive: true,
    icon: Target,
  },
];

const sparklineData = [
  { value: 65 },
  { value: 78 },
  { value: 72 },
  { value: 85 },
  { value: 92 },
  { value: 88 },
  { value: 95 },
];

const jobsData = [
  {
    name: 'Riverside Estate Custom Home',
    estimated: 850000,
    actual: 823000,
    margin: 3.2,
    status: 'In Progress',
  },
  {
    name: 'Mountain View Remodel',
    estimated: 125000,
    actual: 148000,
    margin: -18.4,
    status: 'Over Budget',
  },
  {
    name: 'Heritage Park Commercial',
    estimated: 1200000,
    actual: 890000,
    margin: 25.8,
    status: 'In Progress',
  },
  {
    name: 'Oakwood Duplex',
    estimated: 340000,
    actual: 285000,
    margin: 16.2,
    status: 'Completed',
  },
  {
    name: 'Cedar Heights Addition',
    estimated: 180000,
    actual: 157000,
    margin: 12.8,
    status: 'In Progress',
  },
];

const cashFlowData = [
  { week: 'This Week', projected: 487200 },
  { week: 'Week 2', projected: 512400 },
  { week: 'Week 3', projected: 538900 },
  { week: 'Week 4', projected: 562100 },
];

const arData = [
  { range: '0-30 days', amount: 189000, percentage: 55 },
  { range: '31-60 days', amount: 98000, percentage: 29 },
  { range: '61-90 days', amount: 42000, percentage: 12 },
  { range: '90+ days', amount: 13500, percentage: 4 },
];

const activityData = [
  {
    description: 'Invoice #2024-156 paid by ABC Corp',
    amount: '$45,200',
    timestamp: '2 hours ago',
    type: 'payment',
  },
  {
    description: 'Labor cost added to Riverside Estate',
    amount: '$12,500',
    timestamp: '4 hours ago',
    type: 'expense',
  },
  {
    description: 'Invoice #2024-155 issued to Heritage Park',
    amount: '$125,000',
    timestamp: '6 hours ago',
    type: 'invoice',
  },
  {
    description: 'Equipment rental for Mountain View Remodel',
    amount: '$8,200',
    timestamp: '1 day ago',
    type: 'expense',
  },
  {
    description: 'Subcontractor payment cleared',
    amount: '$35,800',
    timestamp: '2 days ago',
    type: 'payment',
  },
];

const KPICard = ({
  title,
  value,
  change,
  positive,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ComponentType<any>;
}) => (
  <Card variant="metric" className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-sm text-[#8888a0] mb-1">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div
        className={`p-2 rounded-lg ${
          positive ? 'bg-[#22c55e]/10' : 'bg-[#ef4444]/10'
        }`}
      >
        <Icon
          size={20}
          className={positive ? 'text-[#22c55e]' : 'text-[#ef4444]'}
        />
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex-1 mr-2">
        <ResponsiveContainer width="100%" height={40}>
          <LineChart data={sparklineData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={positive ? '#22c55e' : '#ef4444'}
              dot={false}
              isAnimationActive={true}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div
        className={`text-sm font-semibold ${
          positive ? 'text-[#22c55e]' : 'text-[#ef4444]'
        }`}
      >
        {change}
      </div>
    </div>
  </Card>
);

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Revenue vs Expenses Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Revenue vs Expenses</h2>
        <RevenueChart />
      </Card>

      {/* Job Profitability & Cash Flow Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Profitability */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Job Profitability</h2>
          <div className="space-y-3">
            {jobsData.map((job) => (
              <div key={job.name} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{job.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-[#2a2a3d] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            job.margin > 0 ? 'bg-[#22c55e]' : 'bg-[#ef4444]'
                          }`}
                          style={{
                            width: `${Math.min(Math.abs(job.margin) * 3, 100)}%`,
                          }}
                        />
                      </div>
                      <span
                        className={`text-xs font-semibold whitespace-nowrap ${
                          job.margin > 0
                            ? 'text-[#22c55e]'
                            : 'text-[#ef4444]'
                        }`}
                      >
                        {job.margin > 0 ? '+' : ''}
                        {job.margin}%
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      job.status === 'Completed'
                        ? 'success'
                        : job.status === 'Over Budget'
                          ? 'danger'
                          : 'info'
                    }
                    className="flex-shrink-0 ml-2"
                  >
                    {job.status}
                  </Badge>
                </div>
                <div className="flex text-xs text-[#8888a0] gap-4">
                  <span>Est: ${(job.estimated / 1000).toFixed(0)}k</span>
                  <span>Act: ${(job.actual / 1000).toFixed(0)}k</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Cash Flow Forecast */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Cash Flow Forecast (4 Weeks)
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={cashFlowData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2a2a3d"
                vertical={false}
              />
              <XAxis dataKey="week" stroke="#8888a0" style={{ fontSize: '0.75rem' }} />
              <YAxis
                stroke="#8888a0"
                style={{ fontSize: '0.75rem' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a26',
                  border: '1px solid #2a2a3d',
                  borderRadius: '0.5rem',
                  color: '#e8e8f0',
                }}
                formatter={(value: any) => `$${(Number(value) / 1000).toFixed(0)}k`}
              />
              <Bar dataKey="projected" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* AR Aging & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AR Aging */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Accounts Receivable Aging
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Total Outstanding</span>
                <span className="text-sm font-semibold text-[#6366f1]">
                  $342,500
                </span>
              </div>
              <div className="flex h-8 gap-1 rounded-lg overflow-hidden bg-[#2a2a3d]">
                {arData.map((item, i) => (
                  <div
                    key={item.range}
                    className={`flex items-center justify-center text-xs font-bold transition-all hover:opacity-80 ${
                      i === 0
                        ? 'bg-[#22c55e]'
                        : i === 1
                          ? 'bg-[#eab308]'
                          : i === 2
                            ? 'bg-[#ef9d44]'
                            : 'bg-[#ef4444]'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                    title={`${item.range}: $${(item.amount / 1000).toFixed(0)}k`}
                  >
                    {item.percentage > 8 && `${item.percentage}%`}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {arData.map((item) => (
                <div key={item.range} className="flex justify-between p-2 bg-[#1a1a26] rounded">
                  <span className="text-[#8888a0]">{item.range}</span>
                  <span className="font-semibold text-[#e8e8f0]">
                    ${(item.amount / 1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activityData.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-[#2a2a3d] last:border-0">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'payment'
                      ? 'bg-[#22c55e]'
                      : activity.type === 'invoice'
                        ? 'bg-[#6366f1]'
                        : 'bg-[#eab308]'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#e8e8f0]">
                    {activity.description}
                  </p>
                  <p className="text-xs text-[#8888a0] mt-1">{activity.timestamp}</p>
                </div>
                <span className="text-sm font-semibold text-[#e8e8f0] flex-shrink-0">
                  {activity.amount}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
