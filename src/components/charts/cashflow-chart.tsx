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

const maxValue = Math.max(...baseData.map((d) => Math.max(d.inflows, d.outflows)));

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
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
        <p style={{ color: '#4ade80', marginBottom: '0.25rem' }}>
          Money In: ${(dataPoint.inflows / 1000).toFixed(0)}k
        </p>
        <p style={{ color: '#f87171', marginBottom: '0.25rem' }}>
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
      {/* Overlapping bar chart — same style as landing page */}
      <div className="flex items-end gap-2 sm:gap-3" style={{ height: 340, padding: '20px 16px 0' }}>
        {baseData.map((d) => {
          const inflowPct = (d.inflows / maxValue) * 100;
          const outflowPct = (d.outflows / maxValue) * 100;
          const isPositive = d.inflows >= d.outflows;
          const forecastOpacity = d.isForecast ? 0.55 : 1;

          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 group relative">
              <div className="w-full relative flex items-end justify-center" style={{ height: 280 }}>
                {/* Taller bar (behind) */}
                <div
                  className="absolute bottom-0 left-2 right-2 rounded-t-md transition-all"
                  style={{
                    height: `${Math.max(inflowPct, outflowPct)}%`,
                    backgroundColor: isPositive ? '#14532d' : '#7f1d1d',
                    border: `1.5px solid ${isPositive ? '#4ade80' : '#f87171'}`,
                    borderBottom: 'none',
                    opacity: forecastOpacity,
                  }}
                />
                {/* Shorter bar (in front, overlapping) */}
                <div
                  className="absolute bottom-0 left-2 right-2 rounded-t-sm transition-all"
                  style={{
                    height: `${Math.min(inflowPct, outflowPct)}%`,
                    backgroundColor: isPositive ? '#7f1d1d' : '#14532d',
                    border: `1.5px solid ${isPositive ? '#f87171' : '#4ade80'}`,
                    borderBottom: 'none',
                    opacity: forecastOpacity,
                  }}
                />
                {/* Net indicator on top */}
                <div className="absolute -top-5 left-0 right-0 text-center">
                  <span
                    className="text-[9px] sm:text-[10px] font-bold"
                    style={{
                      color: isPositive ? '#4ade80' : '#f87171',
                      opacity: forecastOpacity,
                    }}
                  >
                    {isPositive ? '+' : '-'}${(Math.abs(d.net) / 1000).toFixed(0)}k
                  </span>
                </div>

                {/* Hover tooltip */}
                <div className="hidden group-hover:block absolute -top-24 left-1/2 -translate-x-1/2 z-20 bg-[#1a1a26] border border-[#2a2a3d] rounded-lg p-2.5 text-xs whitespace-nowrap shadow-xl">
                  <p className="text-[#e8e8f0] font-bold mb-1">
                    {d.month} {d.isForecast && '(Forecast)'}
                  </p>
                  <p style={{ color: '#4ade80' }}>In: ${(d.inflows / 1000).toFixed(0)}k</p>
                  <p style={{ color: '#f87171' }}>Out: ${(d.outflows / 1000).toFixed(0)}k</p>
                  <p style={{ color: '#6366f1' }} className="mt-1">Net: ${(d.net / 1000).toFixed(0)}k</p>
                </div>
              </div>
              <span
                className="text-[9px] sm:text-xs"
                style={{
                  color: '#8888a0',
                  opacity: d.isForecast ? 0.6 : 1,
                  fontWeight: d.isForecast ? 400 : 500,
                }}
              >
                {d.month}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 px-4 py-3 rounded border" style={{ borderColor: '#2a2a3d' }}>
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#14532d', border: '1.5px solid #4ade80' }} />
            <span className="text-xs" style={{ color: '#b0b0c8' }}>Cash In</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#7f1d1d', border: '1.5px solid #f87171' }} />
            <span className="text-xs" style={{ color: '#b0b0c8' }}>Cash Out</span>
          </div>
          <span className="text-xs" style={{ color: '#8888a0', opacity: 0.7 }}>
            Months with * = 3-month forecast
          </span>
        </div>
      </div>
    </div>
  );
};
