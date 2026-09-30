"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Hexagon,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { adminLoginService } from "@/services/admin/client.service";

export default function AdminLogin() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password.trim()) {
      setErrorMsg("Please provide both Email/Phone and Password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        emailOrPhone,
        password,
      };
      await adminLoginService(payload);
      router.push("/admin/dashboard");
    } catch (error) {
      setErrorMsg(error.message || "Login failed . Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0d14] bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.15)_0%,transparent_60%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1)_0%,transparent_60%)]">
      <div className="w-full max-w-110 p-8 sm:p-9 bg-[#121824]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col gap-6 animate-fade-in">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-13 h-13 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-[0_6px_20px_rgba(99,102,241,0.4)] mb-2">
            <Hexagon size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
            Nexus Admin Portal
          </h1>
          <p className="text-sm text-gray-400">
            Sign in to access your administrative dashboard
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2.5 p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-lg text-rose-400 text-xs font-medium">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-300">
              Email Address or Phone Number
            </label>
            <div className="relative flex items-center">
              <User size={18} className="absolute left-3.5 text-gray-500 pointer-events-none" />
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="admin@nexus.io or +1234567890"
                className="w-full py-3 pl-11 pr-11 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/20"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-300">Password</label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-gray-500 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full py-3 pl-11 pr-11 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/20"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 text-gray-500 hover:text-gray-200 p-1.5 rounded-md transition-colors cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none mt-2 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
