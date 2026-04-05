'use client';

import { Inter } from 'next/font/google';
import { useState, useEffect, useCallback, ReactNode } from 'react';
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
  MapPin,
} from 'lucide-react';
import LocationSelector from '@/components/location-selector';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';

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
  { label: 'Locations', href: '/dashboard/locations', icon: MapPin },
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
  const [userProfile, setUserProfile] = useState<{
    fullName: string;
    companyName: string;
    initials: string;
  }>({ fullName: '', companyName: '', initials: '?' });
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [clients, setClients] = useState<Array<{ id: string; name: string; qbo_realm_id: string | null }>>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  const handleSync = useCallback(async () => {
    setSyncing(true);
    try {
      const body = selectedClientId ? JSON.stringify({ clientCompanyId: selectedClientId }) : undefined;
      const res = await fetch('/api/qbo/sync', {
        method: 'POST',
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body,
      });
      if (res.ok) {
        setLastSyncTime(new Date().toISOString());
        window.location.reload();
      }
    } catch (e) {
      console.error('Sync failed:', e);
    } finally {
      setSyncing(false);
    }
  }, [selectedClientId]);

  const handleClientSwitch = useCallback((clientId: string) => {
    setSelectedClientId(clientId);
    setClientDropdownOpen(false);
    setLastSyncTime(null);
    // Store selection so dashboard-content can read it
    if (typeof window !== 'undefined') {
      window.localStorage?.setItem?.('selectedClientId', clientId);
      // Dispatch event so dashboard-content can react
      window.dispatchEvent(new CustomEvent('clientChanged', { detail: { clientId } }));
    }
  }, []);

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

    // Load client companies
    const fetchClients = async () => {
      try {
        const res = await fetch('/api/clients');
        const json = await res.json();
        if (json.success && json.data?.length > 0) {
          setClients(json.data);
          // Restore previous selection or default to first
          const stored = typeof window !== 'undefined' ? window.localStorage?.getItem?.('selectedClientId') : null;
          const validStored = stored && json.data.some((c: any) => c.id === stored);
          const defaultId = validStored ? stored : json.data[0].id;
          setSelectedClientId(defaultId);
        }
      } catch (e) {
        console.error('Failed to fetch clients:', e);
      }
    };
    fetchClients();

    // Load last sync time from latest snapshot
    const fetchLastSync = async () => {
      const { data } = await supabase
        .from('dashboard_snapshots')
        .select('pulled_at')
        .order('pulled_at', { ascending: false })
        .limit(1)
        .single();
      if (data?.pulled_at) {
        setLastSyncTime(data.pulled_at);
      }
    };
    fetchLastSync();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard/';
    }
    return pathname?.startsWith(href);
  };

  const sidebarOpen = !sidebarCollapsed;

  return (
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

        {/* Location Selector */}
        <div className="border-t border-[#2a2a3d] pt-3">
          {sidebarOpen ? (
            <>
              <div className="px-3 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8888a0]">
                  Location Filter
                </span>
              </div>
              <LocationSelector collapsed={false} />
            </>
          ) : (
            <LocationSelector collapsed={true} />
          )}
        </div>

        {/* User Profile & Logout */}
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

            {/* Mobile User Profile & Logout */}
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
            {/* Client Selector */}
            {clients.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a26] border border-[#2a2a3d] rounded-lg text-sm hover:border-[#6366f1] transition-colors"
                >
                  <span className="text-[#e8e8f0] max-w-[160px] truncate">{selectedClient?.name || 'Select Client'}</span>
                  <svg className={`w-4 h-4 text-[#8888a0] transition-transform ${clientDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {clientDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-[#1a1a26] border border-[#2a2a3d] rounded-lg shadow-xl z-50 py-1 max-h-64 overflow-y-auto">
                    {clients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => handleClientSwitch(client.id)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          client.id === selectedClientId
                            ? 'bg-[#6366f1]/20 text-[#6366f1]'
                            : 'text-[#e8e8f0] hover:bg-[#2a2a3d]'
                        }`}
                      >
                        <div className="font-medium truncate">{client.name}</div>
                        {client.qbo_realm_id && (
                          <div className="text-xs text-[#8888a0] mt-0.5">QBO Connected</div>
                        )}
                      </button>
                    ))}
                    <div className="border-t border-[#2a2a3d] mt-1 pt-1">
                      <button
                        onClick={() => {
                          setClientDropdownOpen(false);
                          window.location.href = '/api/qbo/connect';
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#6366f1] hover:bg-[#2a2a3d] transition-colors"
                      >
                        + Connect New QBO Company
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="hidden sm:flex items-center gap-2 text-sm text-[#8888a0]">
              <span>Last synced:</span>
              <span className="text-[#22c55e]">{lastSyncTime ? formatTimeAgo(lastSyncTime) : 'never'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={handleSync}
              disabled={syncing}
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Sync with QBO'}</span>
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
  );
}
