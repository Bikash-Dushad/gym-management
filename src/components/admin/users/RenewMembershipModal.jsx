"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  listOfMembershipPlansService,
  getUserDetailsService,
  renewMembershipService,
} from "@/services/admin/client.service";
import {
  X,
  RefreshCw,
  Award,
  DollarSign,
  Weight as WeightIcon,
  Tag,
  UserCheck,
  AlertOctagon,
  Calendar,
} from "lucide-react";

const TYPE_OPTIONS = ["Gain", "Weight loose", "Others"];

export default function RenewMembershipModal({ userId, onClose, onSuccess }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [userInfo, setUserInfo] = useState(null);
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  const [formData, setFormData] = useState({
    membershipPlanId: "",
    price: "",
    weight: "",
    type: "",
    trainerId: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [userData, plansData] = await Promise.all([
          getUserDetailsService(userId),
          listOfMembershipPlansService().catch(() => []),
        ]);

        const user = userData?.users || userData?.user || {};
        const membership = userData?.membership || {};
        const membershipPlan = userData?.membershipPlans || userData?.membershipPlan || {};

        setUserInfo({
          name: user.name || "User",
          email: user.email || "",
          phone: user.phone || "",
          expiryDate: membership.expiryDate || user.expiryDate,
          currentPlanName: membershipPlan.title || membershipPlan.name || "N/A",
        });

        setPlans(plansData || []);

        const initialPlanId =
          membership.membershipPlan ||
          membership.membershipPlanId ||
          membershipPlan.id ||
          "";

        setFormData({
          membershipPlanId: initialPlanId,
          price: membership.price ?? membershipPlan.price ?? "",
          weight: membership.weight ?? user.weight ?? "",
          type: membership.type ?? user.type ?? "",
          trainerId: membership.trainerId ?? membership.trainer ?? user.trainerId ?? "",
        });
      } catch (err) {
        setError(err.message || "Failed to load user details for renewal");
      } finally {
        setLoading(false);
        setPlansLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePlanChange = (e) => {
    const selectedId = e.target.value;
    const selectedPlan = plans.find((p) => (p.id || p._id) === selectedId);
    setFormData((prev) => ({
      ...prev,
      membershipPlanId: selectedId,
      price: selectedPlan?.price ?? prev.price,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.membershipPlanId) {
      setError("Please select a membership plan");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        userId: userId,
        membershipPlanId: formData.membershipPlanId,
        price: formData.price !== "" ? Number(formData.price) : "",
        weight: formData.weight !== "" ? Number(formData.weight) : "",
        type: formData.type || "",
        trainerId: formData.trainerId || "",
      };

      await renewMembershipService(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to renew membership");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#121824] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] my-auto animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <RefreshCw size={20} className={submitting ? "animate-spin" : ""} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-100">Renew Membership</h3>
              <p className="text-xs text-gray-400">
                Update details & extend subscription plan
              </p>
            </div>
          </div>
          <button
            className="text-gray-400 hover:text-gray-100 p-1.5 rounded-lg transition-colors cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm flex flex-col items-center justify-center gap-3 min-h-[300px]">
            <RefreshCw size={24} className="animate-spin text-indigo-400" />
            <p>Loading user details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="p-6 flex flex-col gap-4 overflow-y-auto flex-1">
              {/* User info preview banner */}
              {userInfo && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-lg flex items-center justify-center shrink-0">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-gray-100 truncate text-sm">
                      {userInfo.name}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      {userInfo.email || "No email"}
                    </span>
                    <div className="flex items-center gap-3 mt-1 text-[0.72rem] text-gray-400">
                      <span>Plan: <strong className="text-gray-200">{userInfo.currentPlanName}</strong></span>
                      {userInfo.expiryDate && (
                        <span className="flex items-center gap-1 text-amber-400">
                          <Calendar size={12} />
                          {new Date(userInfo.expiryDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2.5 p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-lg text-rose-400 text-xs font-medium">
                  <AlertOctagon size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form Fields */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-300">
                  Membership Plan <span className="text-indigo-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <Award size={16} className="absolute left-3 text-gray-500 pointer-events-none" />
                  <select
                    value={formData.membershipPlanId}
                    onChange={handlePlanChange}
                    required
                    disabled={plansLoading}
                    className="w-full py-2.5 pl-10 pr-3 bg-[#121824] border border-white/10 rounded-lg text-gray-100 text-sm outline-none focus:border-indigo-500 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <option value="">
                      {plansLoading ? "Loading plans..." : "Select Membership Plan"}
                    </option>
                    {plans.map((plan) => (
                      <option key={plan.id || plan._id} value={plan.id || plan._id}>
                        {plan.title || plan.name} {plan.price ? `(Rs. ${plan.price})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-medium text-gray-300">
                    Price (Rs.)
                  </label>
                  <div className="relative flex items-center">
                    <DollarSign size={16} className="absolute left-3 text-gray-500 pointer-events-none" />
                    <input
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={handleChange("price")}
                      placeholder="e.g. 1500"
                      className="w-full py-2.5 pl-10 pr-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-medium text-gray-300">
                    Weight (kg)
                  </label>
                  <div className="relative flex items-center">
                    <WeightIcon size={16} className="absolute left-3 text-gray-500 pointer-events-none" />
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.weight}
                      onChange={handleChange("weight")}
                      placeholder="e.g. 70"
                      className="w-full py-2.5 pl-10 pr-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-medium text-gray-300">
                    Goal / Type
                  </label>
                  <div className="relative flex items-center">
                    <Tag size={16} className="absolute left-3 text-gray-500 pointer-events-none" />
                    <select
                      value={formData.type}
                      onChange={handleChange("type")}
                      className="w-full py-2.5 pl-10 pr-3 bg-[#121824] border border-white/10 rounded-lg text-gray-100 text-sm outline-none focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="">Select Type</option>
                      {TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-medium text-gray-300">
                    Trainer ID / Name
                  </label>
                  <div className="relative flex items-center">
                    <UserCheck size={16} className="absolute left-3 text-gray-500 pointer-events-none" />
                    <input
                      type="text"
                      value={formData.trainerId}
                      onChange={handleChange("trainerId")}
                      placeholder="Trainer ID or Name"
                      className="w-full py-2.5 pl-10 pr-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 p-6 pt-3 border-t border-white/10 shrink-0 bg-[#121824]">
              <button
                type="button"
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-gray-200 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-pointer disabled:opacity-50"
                disabled={submitting}
              >
                <RefreshCw size={15} className={submitting ? "animate-spin" : ""} />
                <span>{submitting ? "Renewing..." : "Confirm Renew"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
