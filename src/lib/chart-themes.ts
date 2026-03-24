// Chart Theme System — inspired by Klipfolio PowerMetrics dark-mode visualization styles
// Provides multiple chart color palettes and style options users can toggle in settings

export type ChartThemeKey = 'default' | 'neon' | 'ocean' | 'sunset' | 'monochrome';

export interface ChartTheme {
  key: ChartThemeKey;
  name: string;
  description: string;
  // Primary palette (6 colors, matching KPI card accent, bar fills, pie slices, etc.)
  colors: {
    primary: string;     // main accent (indigo/cyan/etc)
    positive: string;    // green / up / good
    negative: string;    // red / down / bad
    warning: string;     // amber / caution
    secondary: string;   // muted accent
    tertiary: string;    // third accent
  };
  // Extended palette for pie charts, multi-series, etc.
  series: string[];
  // Chart-specific styling
  chart: {
    gridColor: string;
    tooltipBg: string;
    tooltipBorder: string;
    areaOpacity: number;
    barRadius: number;
    strokeWidth: number;
    glowEffect: boolean;   // neon glow on lines/bars
    gradientFills: boolean; // gradient fills on area/bar charts
  };
}

export const chartThemes: Record<ChartThemeKey, ChartTheme> = {
  default: {
    key: 'default',
    name: 'Classic',
    description: 'Clean, professional look with indigo accents',
    colors: {
      primary: '#6366f1',
      positive: '#22c55e',
      negative: '#ef4444',
      warning: '#eab308',
      secondary: '#a78bfa',
      tertiary: '#ef9d44',
    },
    series: ['#6366f1', '#22c55e', '#eab308', '#ef9d44', '#a78bfa', '#8888a0'],
    chart: {
      gridColor: '#2a2a3d',
      tooltipBg: '#1a1a26',
      tooltipBorder: '#2a2a3d',
      areaOpacity: 0.15,
      barRadius: 4,
      strokeWidth: 2,
      glowEffect: false,
      gradientFills: false,
    },
  },
  neon: {
    key: 'neon',
    name: 'Neon',
    description: 'Vibrant glow effects with electric colors',
    colors: {
      primary: '#00f0ff',
      positive: '#39ff14',
      negative: '#ff3366',
      warning: '#ffee00',
      secondary: '#bf5af2',
      tertiary: '#ff9500',
    },
    series: ['#00f0ff', '#39ff14', '#ffee00', '#ff9500', '#bf5af2', '#ff3366'],
    chart: {
      gridColor: '#1a2a3d',
      tooltipBg: '#0a1520',
      tooltipBorder: '#00f0ff30',
      areaOpacity: 0.2,
      barRadius: 6,
      strokeWidth: 2.5,
      glowEffect: true,
      gradientFills: true,
    },
  },
  ocean: {
    key: 'ocean',
    name: 'Ocean',
    description: 'Cool blues and teals for a calm, data-dense feel',
    colors: {
      primary: '#0ea5e9',
      positive: '#14b8a6',
      negative: '#f43f5e',
      warning: '#f59e0b',
      secondary: '#6366f1',
      tertiary: '#a78bfa',
    },
    series: ['#0ea5e9', '#14b8a6', '#6366f1', '#f59e0b', '#a78bfa', '#f43f5e'],
    chart: {
      gridColor: '#1e293b',
      tooltipBg: '#0f172a',
      tooltipBorder: '#1e293b',
      areaOpacity: 0.18,
      barRadius: 4,
      strokeWidth: 2,
      glowEffect: false,
      gradientFills: true,
    },
  },
  sunset: {
    key: 'sunset',
    name: 'Sunset',
    description: 'Warm oranges, reds, and golds',
    colors: {
      primary: '#f97316',
      positive: '#84cc16',
      negative: '#dc2626',
      warning: '#eab308',
      secondary: '#e11d48',
      tertiary: '#a855f7',
    },
    series: ['#f97316', '#84cc16', '#eab308', '#e11d48', '#a855f7', '#dc2626'],
    chart: {
      gridColor: '#2a2020',
      tooltipBg: '#1a1010',
      tooltipBorder: '#3a2020',
      areaOpacity: 0.15,
      barRadius: 4,
      strokeWidth: 2,
      glowEffect: false,
      gradientFills: true,
    },
  },
  monochrome: {
    key: 'monochrome',
    name: 'Monochrome',
    description: 'Elegant single-hue with tonal variation',
    colors: {
      primary: '#94a3b8',
      positive: '#cbd5e1',
      negative: '#64748b',
      warning: '#e2e8f0',
      secondary: '#475569',
      tertiary: '#f1f5f9',
    },
    series: ['#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155'],
    chart: {
      gridColor: '#1e293b',
      tooltipBg: '#0f172a',
      tooltipBorder: '#334155',
      areaOpacity: 0.12,
      barRadius: 2,
      strokeWidth: 1.5,
      glowEffect: false,
      gradientFills: false,
    },
  },
};

// Helper to get the current theme from localStorage (or default)
export function getStoredThemeKey(): ChartThemeKey {
  if (typeof window === 'undefined') return 'default';
  return (localStorage.getItem('buildercfo-chart-theme') as ChartThemeKey) || 'default';
}

export function storeThemeKey(key: ChartThemeKey): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('buildercfo-chart-theme', key);
}
