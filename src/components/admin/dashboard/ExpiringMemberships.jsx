"use client";

import {
  AlertTriangle,
  ChevronRight,
  Clock,
  Calendar,
  CheckCircle2,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function ExpiringMemberships({
  memberships = [],
}) {
  const router = useRouter();

  const getExpiryDetails = (expiryDateStr) => {
    if (!expiryDateStr) {
      return {
        days: 0,
        text: "Unknown",
        color: "gray",
      };
    }

    const expiry = new Date(expiryDateStr);
    const today = new Date();

    const diffTime = expiry - today;

    const diffDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return {
        days: diffDays,
        text: "Expired",
        color: "rose",
      };
    }

    if (diffDays === 0) {
      return {
        days: 0,
        text: "Expires Today",
        color: "rose",
      };
    }

    if (diffDays === 1) {
      return {
        days: 1,
        text: "1 Day Remaining",
        color: "amber",
      };
    }

    return {
      days: diffDays,
      text: `${diffDays} Days Left`,
      color: "emerald",
    };
  };

  return (
    <div className="lg:col-span-5 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">

        <div className="flex items-center gap-2.5">

          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle size={18} />
          </div>

          <div>

            <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">

              Expiring Soon

              <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                {memberships.length}
              </span>

            </h2>

            <p className="text-xs text-gray-400">
              Plans requiring upcoming renewal
            </p>

          </div>

        </div>

        <button
          onClick={() =>
            router.push("/admin/users")
          }
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
        >
          <span>View All</span>

          <ChevronRight size={14} />
        </button>

      </div>

      {/* Membership Cards */}
      <div className="flex flex-col gap-3">

        {memberships.length > 0 ? (
          memberships.map((item) => {

            const details = getExpiryDetails(
              item?.expiryDate
            );

            return (
              <div
                key={
                  item.id ||
                  item.user?.id
                }
                className="p-4 bg-[#121824]/60 hover:bg-[#121824] border border-white/10 hover:border-amber-500/40 rounded-2xl backdrop-blur-xl transition-all group relative overflow-hidden"
              >

                <div className="flex items-start justify-between gap-3">

                  {/* Member Information */}
                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold flex items-center justify-center text-sm shrink-0">

                      {item?.user?.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "M"}

                    </div>

                    <div className="flex flex-col">

                      <span className="font-bold text-gray-100 text-sm group-hover:text-amber-400 transition-colors">
                        {item?.user?.name ||
                          "Unknown Member"}
                      </span>

                      <div className="flex items-center gap-2 mt-0.5">

                        <span className="text-xs text-gray-400">

                          Plan:{" "}

                          <strong className="text-gray-300 font-semibold">
                            {item?.membershipPlan?.name ||
                              "Basic"}
                          </strong>

                        </span>

                        <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          ₹
                          {item?.membershipPlan
                            ?.price ?? 0}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Expiry Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border shrink-0 ${
                      details.color === "rose"
                        ? "bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse"
                        : details.color ===
                          "amber"
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    <Clock size={12} />

                    {details.text}
                  </span>

                </div>

                {/* Expiry Date */}
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">

                  <div className="flex items-center gap-1.5">

                    <Calendar
                      size={13}
                      className="text-gray-500"
                    />

                    <span>

                      Expiry:{" "}

                      {item?.expiryDate
                        ? new Date(
                            item.expiryDate
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}

                    </span>

                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        "/admin/users"
                      )
                    }
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                  >
                    Renew Subscription
                  </button>

                </div>

              </div>
            );
          })
        ) : (

          /* Empty State */
          <div className="py-12 px-4 text-center bg-[#121824]/40 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2">

            <CheckCircle2
              size={32}
              className="text-emerald-400/80 mb-1"
            />

            <p className="text-sm font-semibold text-gray-200">
              No Memberships Expiring Soon
            </p>

            <p className="text-xs text-gray-400 max-w-xs">
              All active gym subscriptions are healthy
              with plenty of validity remaining.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}