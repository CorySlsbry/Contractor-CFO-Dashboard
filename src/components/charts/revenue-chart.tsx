'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', revenue: 285000, expenses: 195000 },
  { month: 'Feb', revenue: 312000, expenses: 218000 },
  { month: 'Mar', revenue: 298000, expenses: 205000 },
  { month: 'Apr', revenue: 425000, expenses: 289000 },
  { month: 'May', revenue: 520000, expenses: 356000 },
  { month: 'Jun', revenue: 498000, expenses: 334000 },
  { month: 'Jul', revenue: 312000, expenses: 218000 },
  { month: 'Aug', revenue: 425000, expenses: 289000 },
  { month: 'Sep', revenue: 467000, expenses: 312000 },
  { month: 'Oct', revenue: 489000, expenses: 334000 },
  { month: 'Nov', revenue: 512000, expenses: 356000 },
  { month: 'Dec', revenue: 520000, expenses: 345000 },
];

export const RevenueChart = () => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2a2a3d"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke="#8888a0"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis
            stroke="#8888a0"
            style={{ fontSize: '0.875rem' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a26',
              border: '1px solid #2a2a3d',
              borderRadius: '0.5rem',
              color: '#e8e8f0',
            }}
            labelStyle={{ color: '#e8e8f0' }}
            formatter={(value: any) => `$${(Number(value) / 1000).toFixed(0)}k`}
          />
          <Legend
            wrapperStyle={{ paddingTop: '1.5rem' }}
            iconType="line"
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="Revenue"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorExpenses)"
            name="Expenses"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
