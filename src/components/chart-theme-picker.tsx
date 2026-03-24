'use client';

import { chartThemes, ChartThemeKey } from '@/lib/chart-themes';
import { useChartTheme } from '@/components/chart-theme-provider';
import { Palette } from 'lucide-react';
import { useState } from 'react';

export default function ChartThemePicker() {
  const { themeKey, setThemeKey, theme } = useChartTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1a26] border border-[#2a2a3d] hover:border-[#6366f1]/50 transition text-sm text-[#e8e8f0]"
        title="Change chart style"
      >
        <Palette size={16} className="text-[#8888a0]" />
        <span className="hidden sm:inline text-[#8888a0]">Style:</span>
        <span className="font-medium">{theme.name}</span>
        {/* Color preview dots */}
        <div className="flex gap-0.5 ml-1">
          {theme.series.slice(0, 4).map((c, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-[#12121a] border border-[#2a2a3d] rounded-xl shadow-2xl p-3 space-y-1.5">
            <p className="text-xs text-[#8888a0] font-medium uppercase tracking-wider px-2 mb-2">Chart Style</p>
            {(Object.keys(chartThemes) as ChartThemeKey[]).map((key) => {
              const t = chartThemes[key];
              const isActive = key === themeKey;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setThemeKey(key);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-left ${
                    isActive
                      ? 'bg-[#6366f1]/15 border border-[#6366f1]/40'
                      : 'hover:bg-[#1a1a26] border border-transparent'
                  }`}
                >
                  {/* Color swatches */}
                  <div className="flex gap-0.5 flex-shrink-0">
                    {t.series.slice(0, 5).map((c, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: c,
                          boxShadow: t.chart.glowEffect ? `0 0 6px ${c}60` : 'none',
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#e8e8f0]">{t.name}</div>
                    <div className="text-[10px] text-[#8888a0] truncate">{t.description}</div>
                  </div>
                  {isActive && (
                    <div className="w-5 h-5 rounded-full bg-[#6366f1] flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}

            {/* Preview bar */}
            <div className="mt-3 px-2 pt-3 border-t border-[#2a2a3d]">
              <p className="text-[10px] text-[#8888a0] mb-2">Preview</p>
              <div className="flex items-end gap-1 h-10">
                {[65, 40, 80, 55, 70, 45].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t transition-all"
                    style={{
                      height: `${h}%`,
                      backgroundColor: chartThemes[themeKey].series[i] || '#8888a0',
                      borderRadius: `${chartThemes[themeKey].chart.barRadius}px ${chartThemes[themeKey].chart.barRadius}px 0 0`,
                      boxShadow: chartThemes[themeKey].chart.glowEffect
                        ? `0 0 8px ${chartThemes[themeKey].series[i]}40`
                        : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
