'use client';

import { Inter } from 'next/font/google';
import { useState, useEffect, ReactNode } from 'react';
import {
  LayoutDashboard,
  Hammer,
  TrendingUp,
  FileText,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  RefreshCw,
  Plug,
  LogOut,
  Brain,
  Sparkles,
  MessageSquare,
  Send,
  X as XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import { ChartThemeProvider, useChartTheme } from '@/components/chart-theme-provider';
import ChartThemePicker from '@/components/chart-theme-picker';

const inter = Inter({ subsets: ['latin'] });

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Job Costing', href: '/dashboard/jobs', icon: Hammer },
  { label: 'Cash Flow', href: '/dashboard/cashflow', icon: TrendingUp },
  { label: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { label: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { label: 'CFO Advisor', href: '/dashboard/advisor', icon: Brain },
  { label: 'AI Toolkit', href: '/dashboard/toolkit', icon: Sparkles },
  { label: 'Integrations', href: '/dashboard/integrations', icon: Plug },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    fullName: string;
    companyName: string;
    initials: string;
  }>({ fullName: '', companyName: '', initials: '?' });
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, organizations(name)')
        .eq('id', user.id)
        .single();
      if (profile) {
        const name = (profile as any).full_name || user.user_metadata?.full_name || user.email || '';
        const org = (profile as any).organizations?.name || user.user_metadata?.company_name || '';
        setUserProfile({
          fullName: name,
          companyName: org,
          initials: getInitials(name),
        });
      }
    };
    fetchProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) return;
    setFeedbackSending(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: feedbackText,
          userName: userProfile.fullName,
          companyName: userProfile.companyName,
        }),
      });
      setFeedbackSent(true);
      setFeedbackText('');
      setTimeout(() => {
        setFeedbackOpen(false);
        setFeedbackSent(false);
      }, 2000);
    } catch {
      // Still close gracefully
      setFeedbackSent(true);
      setTimeout(() => {
        setFeedbackOpen(false);
        setFeedbackSent(false);
      }, 2000);
    } finally {
      setFeedbackSending(false);
    }
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard/';
    }
    return pathname?.startsWith(href);
  };

  const sidebarOpen = !sidebarCollapsed;

  return (
    <ChartThemeProvider>
    <DashboardThemedShell inter={inter} sidebarOpen={sidebarOpen} setSidebarCollapsed={setSidebarCollapsed} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} feedbackOpen={feedbackOpen} setFeedbackOpen={setFeedbackOpen} feedbackText={feedbackText} setFeedbackText={setFeedbackText} feedbackSending={feedbackSending} feedbackSent={feedbackSent} handleFeedbackSubmit={handleFeedbackSubmit} handleLogout={handleLogout} isActive={isActive} userProfile={userProfile}>
      {children}
    </DashboardThemedShell>
    </ChartThemeProvider>
  );
}

// Inner component that can use useChartTheme since it's inside ChartThemeProvider
function DashboardThemedShell({
  children, inter, sidebarOpen, setSidebarCollapsed, mobileMenuOpen, setMobileMenuOpen,
  feedbackOpen, setFeedbackOpen, feedbackText, setFeedbackText, feedbackSending, feedbackSent,
  handleFeedbackSubmit, handleLogout, isActive, userProfile,
}: {
  children: ReactNode; inter: any; sidebarOpen: boolean; setSidebarCollapsed: (v: boolean) => void;
  mobileMenuOpen: boolean; setMobileMenuOpen: (v: boolean) => void;
  feedbackOpen: boolean; setFeedbackOpen: (v: boolean) => void;
  feedbackText: string; setFeedbackText: (v: string) => void;
  feedbackSending: boolean; feedbackSent: boolean;
  handleFeedbackSubmit: () => void; handleLogout: () => void;
  isActive: (href: string) => boolean | undefined;
  userProfile: { fullName: string; companyName: string; initials: string };
}) {
  const { theme } = useChartTheme();
  const ds = theme.dashboard;
  const tc = theme.colors;

  return (
    <>
    <div style={{ ...inter.style, backgroundColor: ds.pageBg, color: ds.textPrimary }} className="min-h-screen flex">
      {/* Desktop Sidebar — hidden on mobile */}
      <div
        className={`hidden lg:flex fixed inset-y-0 left-0 z-40 transition-all duration-300 flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
        style={{ backgroundColor: ds.cardBg, borderRight: `1px solid ${ds.cardBorder}` }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center px-4 cursor-pointer"
          style={{ borderBottom: `1px solid ${ds.divider}` }}
          onClick={() => setSidebarCollapsed(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <div className="font-bold text-lg tracking-tight">
              <span style={{ color: tc.primary }}>Builder</span><span style={{ color: ds.textPrimary }}>CFO</span>
              <div className="text-[10px] font-normal" style={{ color: ds.textMuted }}>by Salisbury Bookkeeping</div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm" style={{ backgroundColor: tc.primary, color: '#fff' }}>
              BC
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={active ? {
                    backgroundColor: ds.tabActiveBg,
                    color: ds.tabActiveText,
                    boxShadow: `0 4px 12px ${ds.tabActiveBg}30`,
                  } : {
                    color: ds.tabInactiveText,
                  }}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* User Profile, Feedback & Logout */}
        <div className="p-3 space-y-2" style={{ borderTop: `1px solid ${ds.divider}` }}>
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
            style={sidebarOpen ? { backgroundColor: ds.inputBg } : {}}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0" style={{ backgroundColor: tc.primary, color: '#fff' }}>
              {userProfile.initials}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{userProfile.fullName || 'Loading...'}</div>
                <div className="text-xs truncate" style={{ color: ds.textMuted }}>
                  {userProfile.companyName}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setFeedbackOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{ color: ds.textMuted }}
          >
            <MessageSquare size={20} />
            {sidebarOpen && <span>Send Feedback</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{ color: ds.textMuted }}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 z-50 flex flex-col lg:hidden animate-in slide-in-from-left duration-200"
            style={{ backgroundColor: ds.cardBg, borderRight: `1px solid ${ds.cardBorder}` }}>
            {/* Mobile Header */}
            <div className="h-16 flex items-center justify-between px-4" style={{ borderBottom: `1px solid ${ds.divider}` }}>
              <div className="font-bold text-lg tracking-tight">
                <span style={{ color: tc.primary }}>Builder</span><span style={{ color: ds.textPrimary }}>CFO</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg"
                style={{ color: ds.textMuted }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                      style={active ? {
                        backgroundColor: ds.tabActiveBg,
                        color: ds.tabActiveText,
                        boxShadow: `0 4px 12px ${ds.tabActiveBg}30`,
                      } : { color: ds.tabInactiveText }}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile User Profile, Feedback & Logout */}
            <div className="p-3 space-y-2" style={{ borderTop: `1px solid ${ds.divider}` }}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ backgroundColor: ds.inputBg }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0" style={{ backgroundColor: tc.primary, color: '#fff' }}>
                  {userProfile.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{userProfile.fullName || 'Loading...'}</div>
                  <div className="text-xs truncate" style={{ color: ds.textMuted }}>{userProfile.companyName}</div>
                </div>
              </div>
              <button
                onClick={() => { setFeedbackOpen(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: ds.textMuted }}
              >
                <MessageSquare size={20} />
                <span>Send Feedback</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: ds.textMuted }}
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col w-full transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        {/* Top Bar */}
        <div className="h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30"
          style={{ backgroundColor: ds.cardBg, borderBottom: `1px solid ${ds.cardBorder}` }}>
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg transition"
              style={{ color: ds.textMuted }}
            >
              <Menu size={22} />
            </button>
            <h1 className="text-lg sm:text-xl font-bold" style={{ color: ds.textPrimary }}>Dashboard</h1>
            <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: ds.textMuted }}>
              <span>Last synced:</span>
              <span style={{ color: tc.positive }}>2 minutes ago</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ChartThemePicker />
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Sync with QBO</span>
            </Button>
            <button className="p-2 rounded-lg transition-colors" style={{ color: ds.textMuted }}>
              <Bell size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto" style={{ backgroundColor: ds.pageBg }}>
          <div className="p-3 sm:p-4 md:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>

    {/* Feedback Modal */}
    {feedbackOpen && (
      <>
        <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setFeedbackOpen(false)} />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md shadow-2xl" style={{ backgroundColor: ds.cardBg, border: `1px solid ${ds.cardBorder}`, borderRadius: ds.borderRadius, backdropFilter: ds.cardBlur }}>
            <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${ds.divider}` }}>
              <h3 className="text-lg font-semibold" style={{ color: ds.textPrimary }}>Send Feedback</h3>
              <button onClick={() => setFeedbackOpen(false)} className="p-1 rounded-lg transition" style={{ color: ds.textMuted }}>
                <XIcon size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {feedbackSent ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-3">&#10003;</div>
                  <p className="text-lg font-semibold" style={{ color: tc.positive }}>Thank you!</p>
                  <p className="text-sm mt-1" style={{ color: ds.textMuted }}>Your feedback has been sent to the Salisbury team.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm" style={{ color: ds.textMuted }}>
                    Tell us what you love, what&apos;s broken, or what you wish the dashboard could do. We read every message.
                  </p>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={5}
                    className="w-full rounded-lg p-3 text-sm focus:outline-none resize-none"
                    style={{ backgroundColor: ds.pageBg, border: `1px solid ${ds.inputBorder}`, color: ds.textPrimary }}
                    autoFocus
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-[10px]" style={{ color: ds.textMuted }}>
                      Sent to info@salisburybookkeeping.com
                    </p>
                    <button
                      onClick={handleFeedbackSubmit}
                      disabled={feedbackSending || !feedbackText.trim()}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                      style={{ backgroundColor: tc.primary }}
                    >
                      <Send size={14} />
                      {feedbackSending ? 'Sending...' : 'Send Feedback'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
}
