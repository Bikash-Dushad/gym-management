"use client";
import { useState, useEffect } from "react";
import { X, Check, BadgeDollarSign, CalendarDays, Award } from "lucide-react";

const emptyForm = {
  title: "",
  price: "",
  validity: "",
};

export default function AddEditMembershipModal({ plan, onClose, onSave, saving }) {
  const isEditMode = Boolean(plan);
  const [formData, setFormData] = useState(emptyForm);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (plan) {
      setFormData({
        title: plan.title || "",
        price: plan.price !== undefined ? String(plan.price) : "",
        validity: plan.validity !== undefined ? String(plan.validity) : "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [plan]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.title.trim()) {
      setErrorMsg("Please enter a plan title.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMsg("Please enter a valid price.");
      return;
    }
    if (!formData.validity || Number(formData.validity) <= 0) {
      setErrorMsg("Please enter a valid validity period (in days).");
      return;
    }

    const payload = {
      ...(plan?.id ? { id: plan.id } : {}),
      title: formData.title.trim(),
      price: Number(formData.price),
      validity: formData.validity,
    };

    try {
      await onSave(payload);
    } catch (err) {
      setErrorMsg(err.message || "Failed to save membership plan.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md p-6 bg-[#121824] border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <Award className="text-cyan-400" size={20} />
            <span>{isEditMode ? "Update Membership Plan" : "Add Membership Plan"}</span>
          </h3>
          <button
            className="text-gray-400 hover:text-gray-100 p-1 rounded-md transition-colors cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-lg text-rose-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-300">
              Plan Title
            </label>
            <div className="relative flex items-center">
              <Award size={16} className="absolute left-3 text-gray-500 pointer-events-none" />
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleChange("title")}
                placeholder="e.g. Gold Plan"
                className="w-full py-2.5 pl-10 pr-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-medium text-gray-300">
                Price (₹)
              </label>
              <div className="relative flex items-center">
                <BadgeDollarSign size={16} className="absolute left-3 text-gray-500 pointer-events-none" />
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.price}
                  onChange={handleChange("price")}
                  placeholder="e.g. 3499"
                  className="w-full py-2.5 pl-10 pr-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-medium text-gray-300">
                Validity (Days)
              </label>
              <div className="relative flex items-center">
                <CalendarDays size={16} className="absolute left-3 text-gray-500 pointer-events-none" />
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.validity}
                  onChange={handleChange("validity")}
                  placeholder="e.g. 180"
                  className="w-full py-2.5 pl-10 pr-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 mt-2 border-t border-white/10">
            <button
              type="button"
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-gray-200 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-pointer disabled:opacity-50"
              disabled={saving}
            >
              <Check size={16} />
              {saving ? "Saving..." : isEditMode ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
