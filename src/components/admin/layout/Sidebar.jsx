'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Hexagon,
  Database
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const mainNav = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'MembershipPlans', href: '/admin/membershipPlans', icon: Dumbbell },

  ];

  return (
    <aside
      className={`h-screen sticky top-0 bg-[#0d121d] border-r border-white/10 flex flex-col transition-all duration-300 ease-out z-45 select-none shrink-0 ${collapsed ? 'w-20' : 'w-[260px]'
        }`}
    >
      {/* Brand Header */}
      <div className="h-[72px] px-5 flex items-center gap-3.5 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] shrink-0">
          <Hexagon size={28} />
        </div>
        {!collapsed && (
          <div className="flex flex-col animate-fade-in">
            <span className="font-bold text-base text-gray-100 tracking-tight">
              Invinsible
            </span>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 py-6 px-3.5 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          {!collapsed && (
            <span className="text-[0.68rem] font-bold text-gray-500 tracking-wider px-3 pb-1.5 uppercase">
              MAIN NAVIGATION
            </span>
          )}
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                  ? 'bg-indigo-500/15 text-indigo-400 font-semibold'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'
                  }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-l-md shadow-[0_0_10px_#6366f1]"></div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col gap-1.5">
          {!collapsed && (
            <span className="text-[0.68rem] font-bold text-gray-500 tracking-wider px-3 pb-1.5 uppercase">
              SYSTEM CONFIG
            </span>
          )}
        </div>
      </nav>

      {/* Footer Info & Collapse Toggle */}
      <div className="p-3.5 border-t border-white/10 flex flex-col gap-3">
        {!collapsed && (
          <div className="p-3 bg-white/[0.03] border border-white/10 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
              <Database size={14} className="text-emerald-400" />
              <span>Node.js Backend</span>
            </div>
            <p className="text-[0.7rem] text-gray-500 mt-0.5">
              App Router Server Components active
            </p>
          </div>
        )}

        <button
          className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl text-gray-400 text-xs font-medium hover:bg-white/10 hover:text-gray-100 transition-colors cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
