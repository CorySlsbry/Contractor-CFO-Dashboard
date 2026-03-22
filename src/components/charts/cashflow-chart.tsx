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
  Cell,
} from 'recharts';

// 12 months of actual data + 3 months of forecast
const baseData = [
  { month: 'Jan', inflows: 285000, outflows: 195000, net: 90000, isForecast: false },
  { month: 'Feb', inflows: 312000, outflows: 218000, net: 94000, isForecast: false },
  { month: 'Mar', inflows: 298000, outflows: 205000, net: 93000, isForecast: false },
  { month: 'Apr', inflows: 425000, outflows: 289000, net: 136000, isForecast: false },
  { month: 'May', inflows: 520000, outflows: 356000, net: 164000, isForecast: false },
  { month: 'Jun', inflows: 498000, outflows: 334000, net: 164000, isForecast: false },
  { month: 'Jul', inflows: 312000, outflows: 218000, net: 94000, isForecast: false },
  { month: 'Aug', inflows: 425000, outflows: 289000, net: 136000, isForecast: false },
  { month: 'Sep', inflows: 467000, outflows: 312000, net: 155000, isForecast: false },
  { month: 'Oct', inflows: 489000, outflows: 334000, net: 155000, isForecast: false },
  { month: 'Nov', inflows: 512000, outflows: 356000, net: 156000, isForecast: false },
  { month: 'Dec', inflows: 520000, outflows: 345000, net: 175000, isForecast: false },
  // 3-month forecast based on historical patterns and AR/AP projections
  { month: 'Jan*', inflows: 310000, outflows: 220000, net: 90000, isForecast: true },
  { month: 'Feb*', inflows: 335000, outflows: 235000, net: 100000, isForecast: true },
  { month: 'Mar*', inflows: 380000, outflows: 265000, net: 115000, isForecast: true },
];

// Transform data for stacked visualization:
// - Keep inflows as the full bar height
// - Outflows start at 0 (will stack on top to show consumption)
const data = baseData.map((d) => ({
  ...d,
  inflowsDisplay: d.inflows,
  outflowsDisplay: d.outflows,
}));

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    // Find the original data point
    const month = payload[0]?.payload?.month;
    const dataPoint = baseData.find((d) => d.month === month);

    if (!dataPoint) return null;

    return (
      <div
        style={{
          backgroundColor: '#1a1a26',
          border: '1px solid #2a2a3d',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          fontSize: '0.875rem',
        }}
      >
        <p style={{ color: '#e8e8f0', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          {dataPoint.month} {dataPoint.isForecast && '(Forecast)'}
        </p>
        <p style={{ color: '#22c55e', marginBottom: '0.25rem' }}>
          Money In: ${(dataPoint.inflows / 1000).toFixed(0)}k
        </p>
        <p style={{ color: '#ef4444', marginBottom: '0.25rem' }}>
          Money Out: ${(dataPoint.outflows / 1000).toFixed(0)}k
        </p>
        <p style={{ color: '#6366f1', marginTop: '0.5rem' }}>
          Net Cash: ${(dataPoint.net / 1000).toFixed(0)}k
        </p>
      </div>
    );
  }
  return null;
};

export const CashFlowChart = () => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
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
            tick={(props: any) => {
              const { x, y, payload } = props;
              const dataPoint = baseData.find((d) => d.month === payload.value);
              const isForecast = dataPoint?.isForecast;

              return (
                <text
                  x={x}
                  y={y + 10}
                  textAnchor="middle"
                  fill="#8888a0"
                  fontSize="0.875rem"
                  opacity={isForecast ? 0.6 : 1}
                  fontWeight={isForecast ? '400' : '500'}
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <YAxis
            stroke="#8888a0"
            style={{ fontSize: '0.875rem' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '1.5rem', fontSize: '0.875rem' }}
            formatter={(value) => {
              const labels: Record<string, string> = {
                inflowsDisplay: 'Money In (Green)',
                outflowsDisplay: 'Money Out (Red)',
                net: 'Net Cash Flow (Line)',
              };
              return labels[value] || value;
            }}
          />

          {/* Inflow bar - represents full cash inflow (green with lighter outline) */}
          <Bar
            dataKey="inflowsDisplay"
            fill="#22c55e"
            name="inflowsDisplay"
            radius={[8, 8, 0, 0]}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell
                key={`inflow-${index}`}
                fill={entry.isForecast ? '#4ade80' : '#22c55e'}
                stroke={entry.isForecast ? '#22c55e' : '#4ade80'}
                strokeWidth={2}
                opacity={entry.isForecast ? 0.5 : 1}
              />
            ))}
          </Bar>

          {/* Outflow bar - stacked on inflows, showing money being consumed (red creeping up from bottom) */}
          <Bar
            dataKey="outflowsDisplay"
            stackId="cashStack"
            fill="#ef4444"
            name="outflowsDisplay"
            radius={[0, 0, 0, 0]}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell
                key={`outflow-${index}`}
                fill={entry.isForecast ? '#fca5a5' : '#ef4444'}
                opacity={entry.isForecast ? 0.5 : 1}
              />
            ))}
          </Bar>

          {/* Net cash flow line - overlay showing true net position */}
          <Line
            type="monotone"
            dataKey="net"
            stroke="#6366f1"
            strokeWidth={3}
            name="net"
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              const dataPoint = baseData.find((d) => d.month === payload?.month);
              const isForecast = dataPoint?.isForecast;

              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={isForecast ? 3 : 4}
                  fill="#6366f1"
                  opacity={isForecast ? 0.5 : 1}
                />
              );
            }}
            activeDot={{ r: 6, fill: '#6366f1' }}
            isAnimationActive={true}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend explanation */}
      <div className="mt-4 px-4 py-3 rounded border border-gray-700" style={{ borderColor: '#2a2a3d' }}>
        <p className="text-xs" style={{ color: '#8888a0' }}>
          <span style={{ color: '#22c55e', fontWeight: 'bold' }}>●</span> Green bar = Total Money In |{' '}
          <span style={{ color: '#ef4444', fontWeight: 'bold' }}>●</span> Red bar = Money Out (consuming green) |{' '}
          <span style={{ color: '#6366f1', fontWeight: 'bold' }}>━</span> Net Cash Flow |{' '}
          <span style={{ opacity: 0.6 }}>Months with * = 3-month forecast based on AR/AP projections</span>
        </p>
      </div>
    </div>
  );
};
