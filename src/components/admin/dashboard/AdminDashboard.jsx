"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react";

import { adminDashboardService } from "@/services/admin/client.service";

import DashboardStats from "./DashboardStats";
import ExpiringMemberships from "./ExpiringMemberships";
import NewMembers from "./NewMembers";

export default function AdminDashboard({ initialData = null }) {
  const router = useRouter();

  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const updated = await adminDashboardService();

      if (updated) {
        setData(updated);
      }

      router.refresh();
    } catch (err) {
      console.error(
        "Failed to refresh dashboard data:",
        err
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    } else {
      handleRefresh();
    }
  }, [initialData, handleRefresh]);

  const dashboardData = data || {};

  const totalUsers = Number(dashboardData?.totalUsers ?? 0);

  const activeUsers = Number(dashboardData?.activeUsers ?? 0);

  const inactiveUsers = Math.max(
    0,
    totalUsers - activeUsers
  );

  const totalRevenue = Number(
    dashboardData?.totalRevenew ??
      dashboardData?.totalRevenue ??
      0
  );

  const monthlyRevenue = Number(
    dashboardData?.monthlyRevenew ??
      dashboardData?.monthlyRevenue ??
      0
  );

  const expiringSoon = Array.isArray(
    dashboardData?.expiringSoon
  )
    ? dashboardData.expiringSoon
    : [];

  const newUsers = Array.isArray(
    dashboardData?.newUsers
  )
    ? dashboardData.newUsers
    : [];

  const activeRate =
    totalUsers > 0
      ? Math.round((activeUsers / totalUsers) * 100)
      : 0;

  const avgRevenuePerUser =
    totalUsers > 0
      ? Math.round(monthlyRevenue / totalUsers)
      : 0;

  return (
    <div className="flex flex-col gap-8 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#121824]/80 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">

        {/* Background glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-1.5">

          <div className="flex items-center gap-2.5">

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles
                size={13}
                className="text-indigo-400 animate-pulse"
              />

              Live Dashboard
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-100 tracking-tight">
            Gym Management Control Center
          </h1>

          <p className="text-sm text-gray-400 max-w-2xl">
            Monitor real-time active memberships, revenue
            growth, impending plan renewals, and newly
            registered members.
          </p>

        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex items-center flex-wrap gap-3">

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:border-white/20 active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Refresh dashboard metrics"
          >
            <RefreshCw
              size={15}
              className={`text-indigo-400 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />

            <span>
              {isRefreshing ? "Syncing..." : "Refresh"}
            </span>
          </button>

          <button
            onClick={() =>
              router.push("/admin/users")
            }
            className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)] active:translate-y-0 cursor-pointer"
          >
            <Plus size={16} />

            <span>Add Member</span>
          </button>

          <button
            onClick={() =>
              router.push("/admin/membershipPlans")
            }
            className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(6,182,212,0.4)] active:translate-y-0 cursor-pointer"
          >
            <Zap size={16} />

            <span>Manage Plans</span>
          </button>

        </div>
      </div>

      {/* Dashboard Statistics */}
      <DashboardStats
        totalUsers={totalUsers}
        activeUsers={activeUsers}
        inactiveUsers={inactiveUsers}
        totalRevenue={totalRevenue}
        monthlyRevenue={monthlyRevenue}
        activeRate={activeRate}
        avgRevenuePerUser={avgRevenuePerUser}
      />

      {/* Main Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <ExpiringMemberships
          memberships={expiringSoon}
        />

        <NewMembers
          users={newUsers}
        />

      </div>

    </div>
  );
}