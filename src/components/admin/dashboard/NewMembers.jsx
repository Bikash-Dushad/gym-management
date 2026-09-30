"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Users,
  UserPlus,
  Search,
  Droplets,
} from "lucide-react";

export default function NewMembers({
  users = [],
}) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filterActiveOnly, setFilterActiveOnly] =
    useState(false);

  const filteredNewUsers = users.filter(
    (user) => {
      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        user?.name
          ?.toLowerCase()
          .includes(search) ||
        user?.email
          ?.toLowerCase()
          .includes(search) ||
        user?.phone?.includes(searchTerm) ||
        user?.bloodGroup
          ?.toLowerCase()
          .includes(search);

      const matchesActive =
        filterActiveOnly
          ? user?.isActive === true
          : true;

      return (
        matchesSearch &&
        matchesActive
      );
    }
  );

  return (
    <div className="lg:col-span-7 flex flex-col gap-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">

        <div className="flex items-center gap-2.5">

          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <UserPlus size={18} />
          </div>

          <div>

            <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">

              Newly Joined Members

              <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                {users.length}
              </span>

            </h2>

            <p className="text-xs text-gray-400">
              Recent gym registrations & onboarded
              accounts
            </p>

          </div>

        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-2">

          <div className="relative">

            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Filter recent members..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              className="pl-8 pr-3 py-1.5 bg-[#0a0d14] border border-white/10 rounded-xl text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors w-40 sm:w-48"
            />

          </div>

          <button
            onClick={() =>
              setFilterActiveOnly(
                (prev) => !prev
              )
            }
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              filterActiveOnly
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-white/[0.05] text-gray-400 border-white/10 hover:text-gray-200"
            }`}
            title="Toggle active only"
          >
            Active Only
          </button>

        </div>

      </div>

      {/* Users Table */}
      <div className="bg-[#121824]/60 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">

        {filteredNewUsers.length > 0 ? (

          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs text-gray-300">

              <thead className="bg-white/[0.03] text-gray-400 font-semibold uppercase tracking-wider border-b border-white/10">

                <tr>

                  <th className="px-4 py-3">
                    Member
                  </th>

                  <th className="px-4 py-3">
                    Contact
                  </th>

                  <th className="px-4 py-3">
                    Details
                  </th>

                  <th className="px-4 py-3">
                    Status
                  </th>

                  <th className="px-4 py-3">
                    Joined
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-white/5">

                {filteredNewUsers.map(
                  (user) => (

                    <tr
                      key={user.id}
                      onClick={() =>
                        router.push(
                          "/admin/users"
                        )
                      }
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                    >

                      {/* Member */}
                      <td className="px-4 py-3.5">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600/40 to-purple-600/40 border border-indigo-500/40 text-indigo-200 font-bold flex items-center justify-center text-sm shrink-0">

                            {user?.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "U"}

                          </div>

                          <div className="flex flex-col">

                            <span className="font-bold text-gray-100 group-hover:text-indigo-400 transition-colors">
                              {user.name}
                            </span>

                            <span className="text-[11px] text-gray-400">
                              {user.email}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3.5 font-medium text-gray-300">
                        {user.phone ||
                          "N/A"}
                      </td>

                      {/* Details */}
                      <td className="px-4 py-3.5">

                        <div className="flex items-center gap-1.5 flex-wrap">

                          {user.bloodGroup && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-0.5">

                              <Droplets
                                size={10}
                              />

                              {user.bloodGroup}

                            </span>
                          )}

                          {user.age && (
                            <span className="text-[11px] text-gray-400">
                              {user.age} yrs
                            </span>
                          )}

                          {user.height && (
                            <span className="text-[11px] text-gray-500">
                              • {user.height} ft
                            </span>
                          )}

                        </div>

                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">

                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            user.isActive
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          }`}
                        >

                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              user.isActive
                                ? "bg-emerald-400"
                                : "bg-amber-400"
                            }`}
                          />

                          {user.isActive
                            ? "Active"
                            : "Inactive"}

                        </span>

                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3.5 text-gray-400 text-[11px] whitespace-nowrap">

                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Recently"}

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (

          /* Empty State */
          <div className="py-12 px-4 text-center text-gray-400 text-sm flex flex-col items-center justify-center gap-2">

            <Users
              size={28}
              className="text-gray-500 mb-1"
            />

            <p className="font-semibold text-gray-300">
              No New Members Found
            </p>

            <p className="text-xs text-gray-500">

              {searchTerm
                ? "No members match your search criteria."
                : "No new member registrations available yet."}

            </p>

          </div>
        )}

      </div>
    </div>
  );
}