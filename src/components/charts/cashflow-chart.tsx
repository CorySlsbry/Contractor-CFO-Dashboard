'use client';

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', inflows: 285000, outflows: 195000, net: 90000 },
  { month: 'Feb', inflows: 312000, outflows: 218000, net: 94000 },
  { month: 'Mar', inflows: 298000, outflows: 205000, net: 93000 },
  { month: 'Apr', inflows: 425000, outflows: 289000, net: 136000 },
  { month: 'May', inflows: 520000, outflows: 356000, net: 164000 },
  { month: 'Jun', inflows: 498000, outflows: 334000, net: 164000 },
  { month: 'Jul', inflows: 312000, outflows: 218000, net: 94000 },
  { month: 'Aug', inflows: 425000, outflows: 289000, net: 136000 },
  { month: 'Sep', inflows: 467000, outflows: 312000, net: 155000 },
  { month: 'Oct', inflows: 489000, outflows: 334000, net: 155000 },
  { month: 'Nov', inflows: 512000, outflows: 356000, net: 156000 },
  { month: 'Dec', inflows: 520000, outflows: 345000, net: 175000 },
];

export const CashFlowChart = () => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
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
          />
          <Bar dataKey="inflows" fill="#22c55e" name="Inflows" />
          <Bar dataKey="outflows" fill="#ef4444" name="Outflows" />
          <Line
            type="monotone"
            dataKey="net"
            stroke="#6366f1"
            strokeWidth={3}
            name="Net Cash Flow"
            dot={{ fill: '#6366f1', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
