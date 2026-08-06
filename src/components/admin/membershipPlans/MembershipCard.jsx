"use client";

import { BadgeDollarSign, CalendarDays, Edit3 } from "lucide-react";

export default function MembershipCard({
  title,
  price,
  validity,
  onEdit,
}) {
  return (
    <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-lg transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/10 flex flex-col justify-between">
      <div>
        {/* Plan Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
              <BadgeDollarSign size={24} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-sm text-zinc-400">Membership Plan</p>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-5">
          <p className="text-sm text-zinc-500">Price</p>

          <div className="mt-1 flex items-end gap-1">
            <span className="text-3xl font-bold text-cyan-400">
              ₹{price}
            </span>
          </div>
        </div>

        {/* Validity */}
        <div className="flex items-center gap-2 rounded-xl bg-zinc-800/80 p-3 mb-5">
          <CalendarDays size={18} className="text-emerald-400" />

          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Validity
            </p>

            <p className="font-medium text-white">
              {validity} Days
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onEdit}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-indigo-600/20 hover:border-indigo-500/40 text-gray-300 hover:text-indigo-300 border border-white/10 rounded-xl text-sm font-semibold transition-all cursor-pointer"
      >
        <Edit3 size={16} />
        <span>Update Plan</span>
      </button>
    </div>
  );
}