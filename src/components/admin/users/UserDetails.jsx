"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Ruler,
  Weight,
  Droplet,
  Tag,
  Award,
  DollarSign,
  UserCheck,
  Edit3,
  Trash2,
  AlertOctagon,
  Shield,
  Clock,
} from "lucide-react";
import AddEditUserForm from "./AddEditUserForm";
import { useUserManagement } from "@/hooks/useUserManagement";

export default function UserDetails({ userId, initialData, initialError }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(initialError);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { loading, handleDelete, handleUpdate } = useUserManagement([]);

  const user = data?.users || data?.user || data || {};
  const membership = data?.membership || {};
  const membershipPlan = data?.membershipPlans || {}

  const handleEditSave = async (formData) => {
    try {
      await handleUpdate(userId, formData);
      setIsEditModalOpen(false);
      router.refresh();
    } catch (err) {
      setError(err.message || "Failed to update user details");
    }
  };

  const onDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await handleDelete(userId);
        router.push("/admin/users");
      } catch (err) {
        setError(err.message || "Failed to delete user");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 animate-fade-in pb-12">
      {/* Top Header Navigation & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-100 transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
        >
          <ArrowLeft size={16} />
          <span>Back to Users</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-xl text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] cursor-pointer"
          >
            <Edit3 size={16} />
            <span>Edit User</span>
          </button>
          <button
            onClick={onDeleteClick}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-4 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
          <AlertOctagon size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Profile Hero Card */}
      <div className="bg-[#121824]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-400/40 text-white font-bold text-3xl flex items-center justify-center shadow-lg shrink-0">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-100">{user.name || "N/A"}</h1>
              <span
                className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold border ${user.isActive !== false
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                  }`}
              >
                {user.isActive !== false ? "Active Member" : "Inactive Member"}
              </span>
            </div>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Mail size={14} className="text-gray-500" />
              <span>{user.email || "No email provided"}</span>
            </p>
            <p className="text-xs text-gray-500">ID: {userId}</p>
          </div>
        </div>
      </div>

      {/* Grid of Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-[#121824]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
            <User className="text-indigo-400" size={20} />
            <h2 className="text-lg font-bold text-gray-100">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailItem icon={User} label="Full Name" value={user.name} />
            <DetailItem icon={Mail} label="Email Address" value={user.email} />
            <DetailItem icon={Phone} label="Phone Number" value={user.phone || "N/A"} />
            <DetailItem icon={Calendar} label="Age" value={user.age ? `${user.age} yrs` : "N/A"} />
            <DetailItem icon={Ruler} label="Height" value={user.height ? `${user.height} ft` : "N/A"} />
            <DetailItem icon={Weight} label="Weight" value={membership.weight || user.weight ? `${membership.weight || user.weight} kg` : "N/A"} />
            <DetailItem icon={Droplet} label="Blood Group" value={user.bloodGroup || "N/A"} />
            <DetailItem icon={Tag} label="Goal / Type" value={membership.type || user.type || "N/A"} />
          </div>
        </div>

        {/* Membership Details */}
        <div className="bg-[#121824]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
            <Award className="text-purple-400" size={20} />
            <h2 className="text-lg font-bold text-gray-100">Membership Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailItem
              icon={Award}
              label="Membership Plan"
              value={membershipPlan.title || "N/A"}
            />
            <DetailItem
              icon={DollarSign}
              label="Price"
              value={<span>Rs.{membership.price} <span className="text-xs text-gray-500">(Actual price: Rs.{membershipPlan.price})</span></span>}
            />
            <DetailItem
              icon={UserCheck}
              label="Assigned Trainer"
              value={membership.trainer || "self"}
            />
            <DetailItem
              icon={Shield}
              label="Status"
              value={membership.isActive !== false ? "Active" : "Inactive"}
            />
            <DetailItem
              icon={Clock}
              label="Subscribed Date"
              value={membership.subscribedDate ? new Date(membership.subscribedDate).toLocaleDateString() : "N/A"}
            />
            <DetailItem
              icon={Clock}
              label="Expiry Date"
              value={membership.expiryDate ? new Date(membership.expiryDate).toLocaleDateString() : "N/A"}

            />
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <AddEditUserForm
          userId={userId}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditSave}
          saving={loading}
        />
      )}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-white/[0.025] rounded-xl border border-white/5">
      <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
        <Icon size={14} className="text-gray-500" />
        <span>{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-100 truncate">
        {value || "N/A"}
      </span>
    </div>
  );
}
