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
  MessageSquare,
  Send,
  X as XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import { ChartThemeProvider } from '@/components/chart-theme-provider';
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
    <div style={inter.style} className="bg-[#0a0a0f] text-[#e8e8f0] min-h-screen flex">
      {/* Desktop Sidebar — hidden on mobile */}
      <div
        className={`hidden lg:flex fixed inset-y-0 left-0 z-40 transition-all duration-300 flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#12121a] border-r border-[#2a2a3d]`}
      >
        {/* Logo */}
        <div className="h-16 border-b border-[#2a2a3d] flex items-center justify-center px-4 cursor-pointer"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarOpen ? (
            <div className="font-bold text-lg tracking-tight">
              <span className="text-[#6366f1]">Builder</span><span className="text-[#e8e8f0]">CFO</span>
              <div className="text-[10px] text-[#8888a0] font-normal">by Salisbury Bookkeeping</div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[#6366f1] flex items-center justify-center font-bold text-sm">
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20'
                      : 'text-[#8888a0] hover:text-[#e8e8f0] hover:bg-[#2a2a3d]'
                  }`}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* User Profile, Feedback & Logout */}
        <div className="border-t border-[#2a2a3d] p-3 space-y-2">
          <div
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              sidebarOpen ? 'bg-[#1a1a26]' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center font-semibold text-sm flex-shrink-0">
              {userProfile.initials}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{userProfile.fullName || 'Loading...'}</div>
                <div className="text-xs text-[#8888a0] truncate">
                  {userProfile.companyName}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setFeedbackOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#8888a0] hover:text-[#6366f1] hover:bg-[#6366f1]/10 transition-all duration-200"
          >
            <MessageSquare size={20} />
            {sidebarOpen && <span>Send Feedback</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#8888a0] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all duration-200"
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
          <div className="fixed inset-y-0 left-0 w-72 z-50 bg-[#12121a] border-r border-[#2a2a3d] flex flex-col lg:hidden animate-in slide-in-from-left duration-200">
            {/* Mobile Header */}
            <div className="h-16 border-b border-[#2a2a3d] flex items-center justify-between px-4">
              <div className="font-bold text-lg tracking-tight">
                <span className="text-[#6366f1]">Builder</span><span className="text-[#e8e8f0]">CFO</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-[#2a2a3d] rounded-lg text-[#8888a0]"
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
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20'
                          : 'text-[#8888a0] hover:text-[#e8e8f0] hover:bg-[#2a2a3d]'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile User Profile, Feedback & Logout */}
            <div className="border-t border-[#2a2a3d] p-3 space-y-2">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1a1a26]">
                <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {userProfile.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{userProfile.fullName || 'Loading...'}</div>
                  <div className="text-xs text-[#8888a0] truncate">{userProfile.companyName}</div>
                </div>
              </div>
              <button
                onClick={() => { setFeedbackOpen(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#8888a0] hover:text-[#6366f1] hover:bg-[#6366f1]/10 transition-all duration-200"
              >
                <MessageSquare size={20} />
                <span>Send Feedback</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#8888a0] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all duration-200"
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
        <div className="h-14 sm:h-16 border-b border-[#2a2a3d] bg-[#12121a] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 hover:bg-[#2a2a3d] rounded-lg text-[#8888a0] hover:text-[#e8e8f0] transition"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-lg sm:text-xl font-bold">Dashboard</h1>
            <div className="hidden sm:flex items-center gap-2 text-sm text-[#8888a0]">
              <span>Last synced:</span>
              <span className="text-[#22c55e]">2 minutes ago</span>
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
            <button className="p-2 hover:bg-[#2a2a3d] rounded-lg transition-colors text-[#8888a0] hover:text-[#e8e8f0]">
              <Bell size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-[#0a0a0f]">
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
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#2a2a3d]">
              <h3 className="text-lg font-semibold">Send Feedback</h3>
              <button onClick={() => setFeedbackOpen(false)} className="p-1 hover:bg-[#2a2a3d] rounded-lg text-[#8888a0] hover:text-[#e8e8f0] transition">
                <XIcon size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {feedbackSent ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-3">&#10003;</div>
                  <p className="text-lg font-semibold text-[#22c55e]">Thank you!</p>
                  <p className="text-sm text-[#8888a0] mt-1">Your feedback has been sent to the Salisbury team.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-[#8888a0]">
                    Tell us what you love, what&apos;s broken, or what you wish the dashboard could do. We read every message.
                  </p>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={5}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-3 text-sm text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#6366f1] resize-none"
                    autoFocus
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-[#8888a0]">
                      Sent to info@salisburybookkeeping.com
                    </p>
                    <button
                      onClick={handleFeedbackSubmit}
                      disabled={feedbackSending || !feedbackText.trim()}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white bg-[#6366f1] hover:bg-[#5558d9] disabled:opacity-40 disabled:cursor-not-allowed transition"
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
    </ChartThemeProvider>
  );
}
