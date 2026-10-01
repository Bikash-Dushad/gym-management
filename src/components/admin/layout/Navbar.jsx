"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  ChevronDown,
  User,
  LogOut,
  ShieldCheck,
  Server,
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
    <header className="h-18 px-6 sm:px-8 flex items-center justify-between bg-[#0a0d14]/70 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
      <div className="flex items-center gap-5 ml-auto">
        {/* Node.js Backend API Status Indicator */}
        <div
          className="flex items-center gap-2 px-3.5 py-1.5 bg-white/3 border border-white/10 rounded-full text-[0.78rem] text-gray-400"
          title="Server status"
        >
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              backendHealth.success
                ? "bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"
                : "bg-amber-500 shadow-[0_0_8px_#f59e0b]"
            }`}
          ></span>
          <Server size={14} className="text-cyan-400" />
        </div>

        {/* Notifications Button */}
        <button
          className="relative p-2 text-gray-400 hover:bg-white/10 hover:text-gray-100 rounded-full transition-colors cursor-pointer"
          aria-label="Notifications"
          onClick={() => setNotificationsCount(0)}
        >
          <Bell size={20} />
          {notificationsCount > 0 && (
            <span className="absolute top-1 right-1 bg-rose-500 text-white text-[0.68rem] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {notificationsCount}
            </span>
          )}
        </button>

        {/* Admin Profile Section */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-3 px-2.5 py-1.5 rounded-full border border-transparent hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <div className="relative">
              <img
                src="/adminAvatar.png"
                alt={admin.name}
                className="w-9.5 h-9.5 rounded-full object-cover border-2 border-indigo-500"
              />
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0a0d14] rounded-full"></span>
            </div>

            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-semibold text-gray-100 leading-tight">
                {admin.name}
              </span>
              <span className="flex items-center gap-1 text-[0.72rem] text-indigo-400 font-medium">
                <ShieldCheck size={12} />
                {admin.role || "Admin"}
              </span>
            </div>

            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-[calc(100%+10px)] right-0 w-60 bg-[#121824] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
              <div className="px-3 py-2.5">
                <p className="font-semibold text-sm text-gray-100">
                  {admin.name}
                </p>
                <p className="text-xs text-gray-400 truncate">{admin.email}</p>
              </div>

              <div className="h-px bg-white/10 my-1.5"></div>

              <a
                href="/admin/settings"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-gray-100 transition-colors w-full"
              >
                <User size={16} />
                <span>My Profile</span>
              </a>

              <div className="h-px bg-white/10 my-1.5"></div>

              <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-rose-500/15 hover:text-rose-400 transition-colors w-full cursor-pointer">
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
