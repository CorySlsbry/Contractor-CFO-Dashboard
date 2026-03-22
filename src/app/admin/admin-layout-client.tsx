'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Activity,
  Settings,
  Menu,
  X,
  ArrowLeft,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

const navItems: NavItem[] = [
  { label: 'Platform Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Subscribers', href: '/admin/subscribers', icon: Users },
  { label: 'Error Log', href: '/admin/errors', icon: AlertTriangle },
  { label: 'System Health', href: '/admin/health', icon: Activity },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin' || pathname === '/admin/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="bg-[#0a0a0f] text-[#e8e8f0] min-h-screen flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#12121a] border-r border-[#2a2a3d] lg:relative`}
      >
        {/* Logo with ADMIN badge */}
        <div className="h-16 border-b border-[#2a2a3d] flex items-center justify-between px-4">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="font-bold text-lg tracking-tight">
                <span className="text-[#6366f1]">Salisbury</span>
              </div>
              <span className="px-2 py-1 bg-[#ef4444] text-white text-xs font-bold rounded">
                ADMIN
              </span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[#ef4444] flex items-center justify-center font-bold text-sm text-white">
              A
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-[#8888a0] hover:text-[#e8e8f0]"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
                      ? 'bg-[#ef4444] text-white shadow-lg shadow-[#ef4444]/20'
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

        {/* Back to Dashboard & Logout */}
        <div className="border-t border-[#2a2a3d] p-3 space-y-2">
          <Link href="/dashboard">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#8888a0] hover:text-[#e8e8f0] hover:bg-[#2a2a3d] transition-all duration-200">
              <ArrowLeft size={20} />
              {sidebarOpen && <span>Back to Dashboard</span>}
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#8888a0] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all duration-200"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
