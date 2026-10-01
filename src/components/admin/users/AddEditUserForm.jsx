"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  listOfMembershipPlansService,
  getUserDetailsService,
} from "@/services/admin/client.service";
import {
  X,
  Check,
  Mail,
  User,
  Phone,
  Ruler,
  Droplet,
  WeightIcon,
  Tag,
  Award,
} from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const TYPE = ["Gain", "Weight loose", "Others"];
const emptyForm = {
  name: "",
  email: "",
  phone: "",
  age: "",
  height: "",
  bloodGroup: "",
  membershipPlan: "",
  price: "",
  weight: "",
  type: "",
  trainer: "",
};

export default function AddEditUserForm({ userId, onClose, onSave, saving }) {
  const isEditMode = Boolean(userId);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [userLoading, setUserLoading] = useState(isEditMode);
  const [userError, setUserError] = useState("");

  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        const response = await listOfMembershipPlansService();
        setPlans(response || []);
      } catch (error) {
        setPlansError(error.message || "Failed to load membership plans");
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const data = await getUserDetailsService(userId);
        const userObj = data.users || data.user || {};
        const membershipObj = data.membership || {};
        const planObj = data.membershipPlans || data.membershipPlan || {};

        setFormData({
          name: userObj.name || "",
          email: userObj.email || "",
          phone: userObj.phone || "",
          age: userObj.age ?? "",
          height: userObj.height ?? "",
          bloodGroup: userObj.bloodGroup || "",
          membershipPlan:
            membershipObj.membershipPlan ||
            membershipObj.membershipPlanId ||
            planObj.id ||
            planObj._id ||
            "",
          price: membershipObj.price ?? planObj.price ?? "",
          weight: membershipObj.weight ?? userObj.weight ?? "",
          type: membershipObj.type ?? userObj.type ?? "",
          trainer: membershipObj.trainer || membershipObj.trainerId || "",
        });
      } catch (error) {
        setUserError(error.message || "Failed to load user details");
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePlanChange = (e) => {
    const selectedId = e.target.value;
    const selectedPlan = plans.find((p) => (p.id || p._id) === selectedId);
    setFormData((prev) => ({
      ...prev,
      membershipPlan: selectedId,
      price: selectedPlan?.price ?? prev.price,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      const payload = {
        userId: userId,
        name: formData.name || "",
        bloodGroup: formData.bloodGroup || "",
        age:
          formData.age !== "" && formData.age !== null && formData.age !== undefined
            ? String(formData.age)
            : "",
        height:
          formData.height !== "" &&
          formData.height !== null &&
          formData.height !== undefined
            ? String(formData.height)
            : "",
        weight:
          formData.weight !== "" &&
          formData.weight !== null &&
          formData.weight !== undefined
            ? String(formData.weight)
            : "",
        type: formData.type || "",
        membershipPlanId: formData.membershipPlan || "",
        price:
          formData.price !== "" &&
          formData.price !== null &&
          formData.price !== undefined
            ? String(formData.price)
            : "",
        trainerId: formData.trainer || "",
      };
      onSave(payload);
    } else {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: Number(formData.age),
        height: Number(formData.height),
        bloodGroup: formData.bloodGroup,
        membershipPlanId: formData.membershipPlan,
        price: Number(formData.price),
        weight: Number(formData.weight),
        type: formData.type,
        trainerId: formData.trainer || "",
      };
      onSave(payload);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#121824] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] my-auto animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10 shrink-0">
          <h3 className="text-lg font-bold text-gray-100">
            {isEditMode ? "Edit User Details" : "Add New User"}
          </h3>
          <button
            className="text-gray-400 hover:text-gray-100 p-1 rounded-md transition-colors cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {userLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm flex items-center justify-center min-h-[300px]">
            <p>Loading user details...</p>
          </div>
        ) : userError ? (
          <div className="p-6 text-center text-rose-400 text-sm">
            <p>{userError}</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 min-h-0 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4 overflow-y-auto flex-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-300">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User
                    size={16}
                    className="absolute left-3 text-gray-500 pointer-events-none"
                  />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange("name")}
                    placeholder="e.g. John Doe"
                    className="w-full py-2.5 pl-10 pr-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-300">
                  Email Address {isEditMode && <span className="text-xs text-gray-500 font-normal">(Cannot be updated)</span>}
                </label>
                <div className="relative flex items-center">
                  <Mail
                    size={16}
                    className="absolute left-3 text-gray-500 pointer-events-none"
                  />
                  <input
                    type="email"
                    required={!isEditMode}
                    disabled={isEditMode}
                    value={formData.email}
                    onChange={handleChange("email")}
                    placeholder="john.doe@gmail.com"
                    className="w-full py-2.5 pl-10 pr-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-medium text-gray-300">
                    Phone Number {isEditMode && <span className="text-xs text-gray-500 font-normal">(Cannot be updated)</span>}
                  </label>
                  <div className="relative flex items-center">
                    <Phone
                      size={16}
                      className="absolute left-3 text-gray-500 pointer-events-none"
                    />
                    <input
                      type="tel"
                      disabled={isEditMode}
                      value={formData.phone}
                      onChange={handleChange("phone")}
                      placeholder="e.g. 9800000000"
                      className="w-full py-2.5 pl-10 pr-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-medium text-gray-300">
                    Age
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.age}
                    onChange={handleChange("age")}
                    placeholder="e.g. 28"
                    className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-medium text-gray-300">
                    Height (ft)
                  </label>
                  <div className="relative flex items-center">
                    <Ruler
                      size={16}
                      className="absolute left-3 text-gray-500 pointer-events-none"
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.01"
                      value={formData.height}
                      onChange={handleChange("height")}
                      placeholder="e.g. 5.5"
                      className="w-full py-2.5 pl-10 pr-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-medium text-gray-300">
                    Weight (kg)
                  </label>
                  <div className="relative flex items-center">
                    <WeightIcon
                      size={16}
                      className="absolute left-3 text-gray-500 pointer-events-none"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
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
                    Blood Group
                  </label>
                  <div className="relative flex items-center">
                    <Droplet
                      size={16}
                      className="absolute left-3 text-gray-500 pointer-events-none"
                    />
                    <select
                      value={formData.bloodGroup}
                      onChange={handleChange("bloodGroup")}
                      className="w-full py-2.5 pl-10 pr-3 bg-[#121824] border border-white/10 rounded-lg text-gray-100 text-sm outline-none focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="">Select blood group</option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-medium text-gray-300">
                    Type
                  </label>
                  <div className="relative flex items-center">
                    <Tag
                      size={16}
                      className="absolute left-3 text-gray-500 pointer-events-none"
                    />
                    <select
                      value={formData.type}
                      onChange={handleChange("type")}
                      className="w-full py-2.5 pl-10 pr-3 bg-[#121824] border border-white/10 rounded-lg text-gray-100 text-sm outline-none focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="">Select Type</option>
                      {TYPE.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-medium text-gray-300">
                    Membership Plan
                  </label>
                  <div className="relative flex items-center">
                    <Award
                      size={16}
                      className="absolute left-3 text-gray-500 pointer-events-none"
                    />
                    <select
                      value={formData.membershipPlan}
                      onChange={handlePlanChange}
                      className="w-full py-2.5 pl-10 pr-3 bg-[#121824] border border-white/10 rounded-lg text-gray-100 text-sm outline-none focus:border-indigo-500 transition-all cursor-pointer disabled:opacity-50"
                      disabled={plansLoading}
                      required
                    >
                      <option value="">
                        {plansLoading ? "Loading plans..." : "Select a plan"}
                      </option>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  {plansError && (
                    <p className="text-xs text-rose-400 mt-1">{plansError}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-medium text-gray-300">
                    Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    readOnly
                    value={formData.price}
                    placeholder="Auto-filled from plan"
                    className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-300">
                  Trainer
                </label>
                <input
                  type="text"
                  value={formData.trainer}
                  onChange={handleChange("trainer")}
                  placeholder="e.g. Ramesh Shrestha"
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 pt-3 border-t border-white/10 shrink-0 bg-[#121824]">
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
                className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-pointer disabled:opacity-50"
                disabled={saving}
              >
                <Check size={16} />
                {saving ? "Saving..." : "Save User Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
