"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Server,
  ExternalLink,
} from "lucide-react";
import {
  checkServerStatusService,
  getAdminProfileService,
} from "@/services/admin/client.service";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(10);
  const dropdownRef = useRef(null);
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    role: "Admin",
    avatar: "",
  });
  const [backendHealth, setBackendHealth] = useState({
    success: false,
    status: "Checking...",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [server, profile] = await Promise.all([
          checkServerStatusService(),
          getAdminProfileService(),
        ]);
        console.log(profile);
        setBackendHealth(server);
        setAdmin(profile);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar-container">
      <div className="navbar-right">
        {/* Node.js Backend API Status Indicator */}
        <div className="node-status-badge" title={`Server status`}>
          <span
            className={backendHealth.success ? "pulse-live" : "pulse-offline"}
          ></span>
          <Server size={14} className="node-icon" />
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
                src="/adminAvatar.png"
                alt={admin.name}
                className="profile-avatar"
              />
              <span className="online-indicator"></span>
            </div>

            <div className="profile-details">
              <span className="admin-name">{admin.name}</span>
              <span className="admin-role">
                <ShieldCheck size={12} className="shield-icon" />
                {admin.role || "Admin"}
              </span>
            </div>

            <ChevronDown
              size={16}
              className={`chevron-icon ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="profile-dropdown animate-fade-in">
              <div className="dropdown-header">
                <p className="dropdown-user-name">{admin.name}</p>
                <p className="dropdown-user-email">{admin.email}</p>
              </div>

              <div className="dropdown-divider"></div>

              <a href="/admin/settings" className="dropdown-item">
                <User size={16} />
                <span>My Profile</span>
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
