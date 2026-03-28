// Dashboard Style System — Full visual themes inspired by top BI platforms
// Klipfolio PowerMetrics, Tremor, Geckoboard, Glassmorphism, and more
// Each theme controls chart colors AND overall dashboard visual feel

export type ChartThemeKey = 'default' | 'powermetrics' | 'neon' | 'glass' | 'tremor' | 'midnight' | 'executive';

export interface DashboardStyle {
  // Surface & container colors
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  // Card effects
  cardBlur?: string;         // backdrop-blur for glass effects
  cardGradient?: string;     // optional gradient overlay
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  // Borders & dividers
  divider: string;
  // Input / interactive surfaces
  inputBg: string;
  inputBorder: string;
  // Tab navigation
  tabActiveBg: string;
  tabActiveText: string;
  tabInactiveText: string;
  // AI Brief card
  briefBg: string;
  briefBorder: string;
  // Badge / tag styling
  badgeStyle: 'solid' | 'soft' | 'outline' | 'glass';
  // Card border radius
  borderRadius: string;
  // KPI card specifics
  kpiValueSize: string;
  kpiLabelWeight: string;
}

export interface ChartTheme {
  key: ChartThemeKey;
  name: string;
  description: string;
  preview: string;  // emoji or short visual hint for picker
  colors: {
    primary: string;
    positive: string;
    negative: string;
    warning: string;
    secondary: string;
    tertiary: string;
  };
  series: string[];
  chart: {
    gridColor: string;
    tooltipBg: string;
    tooltipBorder: string;
    areaOpacity: number;
    barRadius: number;
    strokeWidth: number;
    glowEffect: boolean;
    gradientFills: boolean;
  };
  dashboard: DashboardStyle;
}

export const chartThemes: Record<ChartThemeKey, ChartTheme> = {
  // ── 1. Classic (BuilderCFO default) ──────────────────────
  default: {
    key: 'default',
    name: 'Classic',
    description: 'Clean, professional with indigo accents',
    preview: '🔵',
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
    dashboard: {
      pageBg: '#0a0a0f',
      cardBg: '#12121a',
      cardBorder: '#2a2a3d',
      cardShadow: 'none',
      textPrimary: '#e8e8f0',
      textSecondary: '#c8c8d8',
      textMuted: '#8888a0',
      divider: '#2a2a3d',
      inputBg: '#1a1a26',
      inputBorder: '#2a2a3d',
      tabActiveBg: '#6366f1',
      tabActiveText: '#ffffff',
      tabInactiveText: '#8888a0',
      briefBg: '#1a1a26',
      briefBorder: '#2a2a3d',
      badgeStyle: 'soft',
      borderRadius: '0.5rem',
      kpiValueSize: 'text-2xl',
      kpiLabelWeight: 'font-medium',
    },
  },

  // ── 2. PowerMetrics (Klipfolio-inspired) ─────────────────
  powermetrics: {
    key: 'powermetrics',
    name: 'PowerMetrics',
    description: 'Klipfolio-inspired — bold KPIs, gradient cards',
    preview: '📊',
    colors: {
      primary: '#7c5cfc',
      positive: '#00d68f',
      negative: '#ff4d6a',
      warning: '#ffaa00',
      secondary: '#00c1d4',
      tertiary: '#ff8a65',
    },
    series: ['#7c5cfc', '#00d68f', '#00c1d4', '#ffaa00', '#ff8a65', '#ff4d6a'],
    chart: {
      gridColor: '#232340',
      tooltipBg: '#16162a',
      tooltipBorder: '#7c5cfc30',
      areaOpacity: 0.2,
      barRadius: 6,
      strokeWidth: 2.5,
      glowEffect: false,
      gradientFills: true,
    },
    dashboard: {
      pageBg: '#0c0c1d',
      cardBg: '#13132a',
      cardBorder: '#252548',
      cardShadow: '0 4px 24px rgba(124, 92, 252, 0.06)',
      cardGradient: 'linear-gradient(135deg, rgba(124, 92, 252, 0.04) 0%, transparent 60%)',
      textPrimary: '#eaeaff',
      textSecondary: '#b8b8d4',
      textMuted: '#7878a0',
      divider: '#252548',
      inputBg: '#1a1a36',
      inputBorder: '#252548',
      tabActiveBg: '#7c5cfc',
      tabActiveText: '#ffffff',
      tabInactiveText: '#7878a0',
      briefBg: '#1a1a36',
      briefBorder: '#252548',
      badgeStyle: 'solid',
      borderRadius: '0.75rem',
      kpiValueSize: 'text-3xl',
      kpiLabelWeight: 'font-semibold',
    },
  },

  // ── 3. Neon (Cyberpunk / Electric) ───────────────────────
  neon: {
    key: 'neon',
    name: 'Neon',
    description: 'Vibrant glow effects with electric colors',
    preview: '⚡',
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
      gridColor: '#0d1f2d',
      tooltipBg: '#060e18',
      tooltipBorder: '#00f0ff25',
      areaOpacity: 0.2,
      barRadius: 6,
      strokeWidth: 2.5,
      glowEffect: true,
      gradientFills: true,
    },
    dashboard: {
      pageBg: '#060a10',
      cardBg: '#0a1018',
      cardBorder: '#0d2030',
      cardShadow: '0 0 20px rgba(0, 240, 255, 0.04)',
      textPrimary: '#e0f4ff',
      textSecondary: '#a0c8e0',
      textMuted: '#5888a0',
      divider: '#0d2030',
      inputBg: '#0a1420',
      inputBorder: '#0d2030',
      tabActiveBg: '#00f0ff',
      tabActiveText: '#060a10',
      tabInactiveText: '#5888a0',
      briefBg: '#0a1420',
      briefBorder: '#00f0ff15',
      badgeStyle: 'outline',
      borderRadius: '0.5rem',
      kpiValueSize: 'text-2xl',
      kpiLabelWeight: 'font-medium',
    },
  },

  // ── 4. Glassmorphism (Frosted / Translucent) ─────────────
  glass: {
    key: 'glass',
    name: 'Glass',
    description: 'Frosted glass cards with subtle blur effects',
    preview: '🧊',
    colors: {
      primary: '#818cf8',
      positive: '#34d399',
      negative: '#fb7185',
      warning: '#fbbf24',
      secondary: '#a78bfa',
      tertiary: '#f9a8d4',
    },
    series: ['#818cf8', '#34d399', '#fbbf24', '#f9a8d4', '#a78bfa', '#fb7185'],
    chart: {
      gridColor: 'rgba(255,255,255,0.06)',
      tooltipBg: 'rgba(15, 15, 30, 0.85)',
      tooltipBorder: 'rgba(255,255,255,0.1)',
      areaOpacity: 0.15,
      barRadius: 8,
      strokeWidth: 2,
      glowEffect: false,
      gradientFills: true,
    },
    dashboard: {
      pageBg: '#0e0e1a',
      cardBg: 'rgba(255, 255, 255, 0.04)',
      cardBorder: 'rgba(255, 255, 255, 0.08)',
      cardShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      cardBlur: 'blur(16px)',
      textPrimary: '#f0f0ff',
      textSecondary: '#c0c0e0',
      textMuted: '#8080a8',
      divider: 'rgba(255, 255, 255, 0.06)',
      inputBg: 'rgba(255, 255, 255, 0.04)',
      inputBorder: 'rgba(255, 255, 255, 0.08)',
      tabActiveBg: 'rgba(129, 140, 248, 0.25)',
      tabActiveText: '#ffffff',
      tabInactiveText: '#8080a8',
      briefBg: 'rgba(129, 140, 248, 0.06)',
      briefBorder: 'rgba(129, 140, 248, 0.12)',
      badgeStyle: 'glass',
      borderRadius: '1rem',
      kpiValueSize: 'text-2xl',
      kpiLabelWeight: 'font-medium',
    },
  },

  // ── 5. Tremor (Ultra-clean, minimal, rounded) ────────────
  tremor: {
    key: 'tremor',
    name: 'Tremor',
    description: 'Ultra-clean with rounded corners and subtle shadows',
    preview: '✨',
    colors: {
      primary: '#6366f1',
      positive: '#10b981',
      negative: '#ef4444',
      warning: '#f59e0b',
      secondary: '#8b5cf6',
      tertiary: '#ec4899',
    },
    series: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444'],
    chart: {
      gridColor: '#1f1f35',
      tooltipBg: '#15152a',
      tooltipBorder: '#2a2a45',
      areaOpacity: 0.1,
      barRadius: 8,
      strokeWidth: 2.5,
      glowEffect: false,
      gradientFills: true,
    },
    dashboard: {
      pageBg: '#0b0b16',
      cardBg: '#111122',
      cardBorder: '#1f1f35',
      cardShadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15)',
      textPrimary: '#f1f1f8',
      textSecondary: '#c4c4dd',
      textMuted: '#7a7a9e',
      divider: '#1f1f35',
      inputBg: '#161628',
      inputBorder: '#1f1f35',
      tabActiveBg: '#6366f1',
      tabActiveText: '#ffffff',
      tabInactiveText: '#7a7a9e',
      briefBg: '#161628',
      briefBorder: '#1f1f35',
      badgeStyle: 'soft',
      borderRadius: '1rem',
      kpiValueSize: 'text-3xl',
      kpiLabelWeight: 'font-semibold',
    },
  },

  // ── 6. Midnight (Geckoboard-inspired, deep navy, high contrast) ──
  midnight: {
    key: 'midnight',
    name: 'Midnight',
    description: 'Deep navy with high-contrast data readability',
    preview: '🌙',
    colors: {
      primary: '#38bdf8',
      positive: '#4ade80',
      negative: '#f87171',
      warning: '#fbbf24',
      secondary: '#c084fc',
      tertiary: '#fb923c',
    },
    series: ['#38bdf8', '#4ade80', '#fbbf24', '#fb923c', '#c084fc', '#f87171'],
    chart: {
      gridColor: '#1e2a3a',
      tooltipBg: '#0c1624',
      tooltipBorder: '#1e2a3a',
      areaOpacity: 0.18,
      barRadius: 3,
      strokeWidth: 2,
      glowEffect: false,
      gradientFills: false,
    },
    dashboard: {
      pageBg: '#0a1628',
      cardBg: '#0f1d32',
      cardBorder: '#1a2d48',
      cardShadow: 'none',
      textPrimary: '#e8f0ff',
      textSecondary: '#a8c0e0',
      textMuted: '#607898',
      divider: '#1a2d48',
      inputBg: '#0c1a2e',
      inputBorder: '#1a2d48',
      tabActiveBg: '#38bdf8',
      tabActiveText: '#0a1628',
      tabInactiveText: '#607898',
      briefBg: '#0c1a2e',
      briefBorder: '#1a2d48',
      badgeStyle: 'solid',
      borderRadius: '0.375rem',
      kpiValueSize: 'text-2xl',
      kpiLabelWeight: 'font-bold',
    },
  },

  // ── 7. Executive (Boardroom, minimal, monochrome) ────────
  executive: {
    key: 'executive',
    name: 'Executive',
    description: 'Minimal monochrome — boardroom-ready reports',
    preview: '🏢',
    colors: {
      primary: '#94a3b8',
      positive: '#a3e635',
      negative: '#f87171',
      warning: '#fcd34d',
      secondary: '#cbd5e1',
      tertiary: '#64748b',
    },
    series: ['#94a3b8', '#a3e635', '#fcd34d', '#64748b', '#cbd5e1', '#f87171'],
    chart: {
      gridColor: '#1e2430',
      tooltipBg: '#0e1218',
      tooltipBorder: '#2a3040',
      areaOpacity: 0.08,
      barRadius: 2,
      strokeWidth: 1.5,
      glowEffect: false,
      gradientFills: false,
    },
    dashboard: {
      pageBg: '#0c0e14',
      cardBg: '#12151e',
      cardBorder: '#1e2230',
      cardShadow: '0 1px 2px rgba(0,0,0,0.3)',
      textPrimary: '#e2e8f0',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      divider: '#1e2230',
      inputBg: '#161a24',
      inputBorder: '#1e2230',
      tabActiveBg: '#94a3b8',
      tabActiveText: '#0c0e14',
      tabInactiveText: '#64748b',
      briefBg: '#161a24',
      briefBorder: '#1e2230',
      badgeStyle: 'outline',
      borderRadius: '0.375rem',
      kpiValueSize: 'text-2xl',
      kpiLabelWeight: 'font-bold',
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
