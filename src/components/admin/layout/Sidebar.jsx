'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Settings,
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
  ];

  // const secondaryNav = [
  //   { label: 'Settings & API', href: '/admin/settings', icon: Settings },
  // ];

  return (
    <aside className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="brand-wrapper">
        <div className="brand-logo">
          <Hexagon className="hexagon-logo" size={28} />
        </div>
        {!collapsed && (
          <div className="brand-info animate-fade-in">
            <span className="brand-name">Invinsible</span>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="nav-menu">
        <div className="nav-section">
          {!collapsed && <span className="section-title">MAIN NAVIGATION</span>}
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className="nav-icon" />
                {!collapsed && <span className="nav-label">{item.label}</span>}
                {isActive && <div className="active-indicator"></div>}
              </Link>
            );
          })}
        </div>

        <div className="nav-section">
          {!collapsed && <span className="section-title">SYSTEM CONFIG</span>}
          {/* {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className="nav-icon" />
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </Link>
            );
          })} */}
        </div>
      </nav>

      {/* Footer Info & Collapse Toggle */}
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="api-badge-card">
            <div className="api-badge-header">
              <Database size={14} className="node-accent" />
              <span>Node.js Backend</span>
            </div>
            <p className="api-badge-text">App Router Server Components active</p>
          </div>
        )}

        <button
          className="collapse-toggle"
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
