'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Server,
  ExternalLink
} from 'lucide-react';
import { ADMIN_PROFILE } from '@/data/mockData';
import { checkBackendHealth } from '@/services/api';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [backendHealth, setBackendHealth] = useState({ online: false, status: 'Checking...' });
  const [notificationsCount, setNotificationsCount] = useState(3);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function checkApi() {
      const health = await checkBackendHealth();
      setBackendHealth(health);
    }
    checkApi();

    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar-container">
      {/* Search Input */}
      <div className="search-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search metrics, users, backend logs... (Press Ctrl+K)"
          className="search-input"
        />
        <span className="search-shortcut">⌘K</span>
      </div>

      {/* Right Controls */}
      <div className="navbar-right">
        {/* Node.js Backend API Status Indicator */}
        <div className="node-status-badge" title={`Node.js Backend: ${backendHealth.url}`}>
          <span className={backendHealth.online ? "pulse-live" : "pulse-offline"}></span>
          <Server size={14} className="node-icon" />
          <span className="node-status-text">
            {backendHealth.online ? "Node.js API Connected" : "Mock Data Mode (Node API Offline)"}
          </span>
        </div>

        {/* Notifications Button */}
        <button
          className="icon-button"
          aria-label="Notifications"
          onClick={() => setNotificationsCount(0)}
        >
          <Bell size={20} />
          {notificationsCount > 0 && (
            <span className="notification-badge">{notificationsCount}</span>
          )}
        </button>

        {/* Admin Profile Section */}
        <div className="profile-wrapper" ref={dropdownRef}>
          <button
            className="profile-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <div className="avatar-container">
              <img
                src={ADMIN_PROFILE.avatar}
                alt={ADMIN_PROFILE.name}
                className="profile-avatar"
              />
              <span className="online-indicator"></span>
            </div>

            <div className="profile-details">
              <span className="admin-name">{ADMIN_PROFILE.name}</span>
              <span className="admin-role">
                <ShieldCheck size={12} className="shield-icon" />
                {ADMIN_PROFILE.role}
              </span>
            </div>

            <ChevronDown size={16} className={`chevron-icon ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="profile-dropdown animate-fade-in">
              <div className="dropdown-header">
                <p className="dropdown-user-name">{ADMIN_PROFILE.name}</p>
                <p className="dropdown-user-email">{ADMIN_PROFILE.email}</p>
                <div className="dept-tag">{ADMIN_PROFILE.department}</div>
              </div>

              <div className="dropdown-divider"></div>

              <a href="/admin/settings" className="dropdown-item">
                <User size={16} />
                <span>My Profile</span>
              </a>

              <a href="/admin/settings" className="dropdown-item">
                <Settings size={16} />
                <span>Node.js API Settings</span>
              </a>

              <a
                href={process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"}
                target="_blank"
                rel="noreferrer"
                className="dropdown-item"
              >
                <ExternalLink size={16} />
                <span>Node.js API Direct Link</span>
              </a>

              <div className="dropdown-divider"></div>

              <button className="dropdown-item danger-item">
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
