'use client';

import { Inter } from 'next/font/google';
import { useState, ReactNode } from 'react';
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
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

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
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div style={inter.style} className="bg-[#0a0a0f] text-[#e8e8f0] min-h-screen flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#12121a] border-r border-[#2a2a3d] lg:relative`}
      >
        {/* Logo */}
        <div className="h-16 border-b border-[#2a2a3d] flex items-center justify-center px-4">
          {sidebarOpen && (
            <div className="font-bold text-lg tracking-tight">
              <span className="text-[#6366f1]">Salisbury</span>
              <div className="text-xs text-[#8888a0] font-normal">Bookkeeping</div>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-10 h-10 rounded-lg bg-[#6366f1] flex items-center justify-center font-bold text-sm">
              SB
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

        {/* User Profile */}
        <div className="border-t border-[#2a2a3d] p-3">
          <div
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              sidebarOpen ? 'bg-[#1a1a26]' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center font-semibold text-sm flex-shrink-0">
              JD
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">John Doe</div>
                <div className="text-xs text-[#8888a0] truncate">
                  Summit Ridge Construction
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-[#6366f1] text-white p-3 rounded-lg shadow-lg hover:bg-[#4f46e5]"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Top Bar */}
        <div className="h-16 border-b border-[#2a2a3d] bg-[#12121a] flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <div className="hidden sm:flex items-center gap-2 text-sm text-[#8888a0]">
              <span>Last synced:</span>
              <span className="text-[#22c55e]">2 minutes ago</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
