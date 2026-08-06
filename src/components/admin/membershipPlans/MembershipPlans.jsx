"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import MembershipCard from "./MembershipCard";
import AddEditMembershipModal from "./AddEditMembershipModal";
import {
  createMembershipPlanService,
  updateMembershipPlanService,
} from "@/services/admin/client.service";

export default function MembershipPlans({ plans = [] }) {
  const router = useRouter();
  const [planList, setPlanList] = useState(plans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPlanList(plans);
  }, [plans]);

  const handleOpenAddModal = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (plan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleSavePlan = async (payload) => {
    setSaving(true);
    try {
      if (editingPlan) {
        const updated = await updateMembershipPlanService(payload);
        setPlanList((prev) =>
          prev.map((item) =>
            item.id === payload.id
              ? { ...item, ...payload, ...updated }
              : item
          )
        );
      } else {
        const created = await createMembershipPlanService(payload);
        setPlanList((prev) => [...prev, created || payload]);
      }
      handleCloseModal();
      router.refresh();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header section with Add Button */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
            Membership Plans
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage plans, pricing, and validity periods for your gym members
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(99,102,241,0.35)] active:translate-y-0 cursor-pointer"
        >
          <Plus size={18} />
          <span>Add Membership Plan</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {planList.length > 0 ? (
          planList.map((plan) => (
            <MembershipCard
              key={plan.id || plan.title}
              title={plan.title}
              price={plan.price}
              validity={plan.validity}
              onEdit={() => handleOpenEditModal(plan)}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-400 text-sm bg-[#121824]/50 border border-white/10 rounded-2xl">
            No membership plans available. Click "Add Membership Plan" to create one.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <AddEditMembershipModal
          plan={editingPlan}
          onClose={handleCloseModal}
          onSave={handleSavePlan}
          saving={saving}
        />
      )}
    </div>
  );
}