import { getAdminProfileService } from "@/services/admin/server.service";
import { User, Mail, Phone, ShieldCheck, Key } from "lucide-react";

export const metadata = {
  title: "Admin Profile | Nexus",
  description: "Server-side rendered admin dashboard metrics",
};

export default async function AdminProfilePage() {
  const response = await getAdminProfileService();
  const profile = response;

  // Fallback avatar initials if image is missing
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "A";

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Banner & Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Container */}
          <div className="relative">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-semibold border-4 border-slate-100 dark:border-slate-800">
                {initials}
              </div>
            )}
            <span
              className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"
              title="Active"
            ></span>
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {profile?.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 w-fit mx-auto sm:mx-0">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                {profile?.role}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              System Administrator • Full Access
            </p>
          </div>
        </div>
      </div>

      {/* Account Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Details Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Contact Information
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-slate-400 mt-1" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Email Address</p>
                <p className="text-slate-900 dark:text-slate-200 font-medium">{profile?.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-slate-400 mt-1" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Phone Number</p>
                <p className="text-slate-900 dark:text-slate-200 font-medium">{profile?.phone || "Not Provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Details Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            System Identification
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Key className="w-4 h-4 text-slate-400 mt-1" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Admin ID</p>
                <p className="font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded mt-1 break-all">
                  {profile?.id}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-slate-400 mt-1" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Role Privilege</p>
                <p className="text-slate-900 dark:text-slate-200 font-medium">{profile?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}