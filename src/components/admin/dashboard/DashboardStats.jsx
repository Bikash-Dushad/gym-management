"use client";

import {
  Users,
  UserCheck,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";

export default function DashboardStats({
  totalUsers,
  activeUsers,
  inactiveUsers,
  totalRevenue,
  monthlyRevenue,
  activeRate,
  avgRevenuePerUser,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

      {/* Total Members */}
      <div className="relative group p-5 bg-[#121824]/70 border border-white/10 rounded-2xl backdrop-blur-xl hover:border-indigo-500/40 transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] overflow-hidden">

        <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex items-center justify-between">

          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Members
          </span>

          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users size={20} />
          </div>

        </div>

        <div className="mt-4 flex items-baseline gap-2">

          <span className="text-3xl font-extrabold text-white tracking-tight">
            {totalUsers.toLocaleString()}
          </span>

          <span className="text-xs text-gray-400">
            enrolled
          </span>

        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">

          <span className="text-gray-400">
            Active Rate
          </span>

          <span className="font-semibold text-emerald-400">
            {activeRate}%
          </span>

        </div>

        <div className="mt-1.5 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">

          <div
            className="h-full bg-linear-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                activeRate
              )}%`,
            }}
          />

        </div>

      </div>

      {/* Active Members */}
      <div className="relative group p-5 bg-[#121824]/70 border border-white/10 rounded-2xl backdrop-blur-xl hover:border-emerald-500/40 transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] overflow-hidden">

        <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex items-center justify-between">

          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Active Members
          </span>

          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserCheck size={20} />
          </div>

        </div>

        <div className="mt-4 flex items-baseline gap-2">

          <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
            {activeUsers.toLocaleString()}
          </span>

          <span className="text-xs text-emerald-300/70 font-medium">
            active now
          </span>

        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">

          <span className="text-gray-400">
            Inactive Accounts
          </span>

          <span className="font-medium text-amber-400">
            {inactiveUsers} users
          </span>

        </div>

        <div className="mt-1.5 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">

          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{
              width: `${
                totalUsers > 0
                  ? (activeUsers / totalUsers) * 100
                  : 0
              }%`,
            }}
          />

        </div>

      </div>

      {/* Total Revenue */}
      <div className="relative group p-5 bg-[#121824]/70 border border-white/10 rounded-2xl backdrop-blur-xl hover:border-purple-500/40 transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] overflow-hidden">

        <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-purple-500/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex items-center justify-between">

          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Revenue
          </span>

          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp size={20} />
          </div>

        </div>

        <div className="mt-4 flex items-baseline gap-1">

          <span className="text-3xl font-extrabold text-white tracking-tight">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </span>

        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">

          <span className="text-gray-400">
            Lifetime Collection
          </span>

          <span className="text-purple-400 font-semibold flex items-center gap-0.5">
            <ArrowUpRight size={13} />
            Gross
          </span>

        </div>

        <div className="mt-1.5 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">

          <div className="h-full bg-linear-to-r from-purple-500 to-indigo-500 rounded-full w-full" />

        </div>

      </div>

      {/* Monthly Revenue */}
      <div className="relative group p-5 bg-[#121824]/70 border border-white/10 rounded-2xl backdrop-blur-xl hover:border-cyan-500/40 transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)] overflow-hidden">

        <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex items-center justify-between">

          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Monthly Revenue
          </span>

          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CreditCard size={20} />
          </div>

        </div>

        <div className="mt-4 flex items-baseline gap-1">

          <span className="text-3xl font-extrabold text-cyan-300 tracking-tight">
            ₹{monthlyRevenue.toLocaleString("en-IN")}
          </span>

        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">

          <span className="text-gray-400">
            Avg / Member
          </span>

          <span className="text-cyan-400 font-semibold">
            ₹{avgRevenuePerUser.toLocaleString("en-IN")}
          </span>

        </div>

        <div className="mt-1.5 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">

          <div className="h-full bg-cyan-400 rounded-full w-4/5" />

        </div>

      </div>

    </div>
  );
}