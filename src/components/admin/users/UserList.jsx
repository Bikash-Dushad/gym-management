"use client";
import { useState, useEffect } from "react";
import { UserPlus, Edit3, Trash2, AlertOctagon } from "lucide-react";
import AddEditUserForm from "./AddEditUserForm";
import { useQueryState } from "@/hooks/useQueryState";
import { useUserManagement } from "@/hooks/useUserManagement";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";

// Separate presentational components
const UserRow = ({ user, onEdit, onDelete, isLoading }) => {
  const id = user.id;

  return (
    <tr className="border-b border-white/10 hover:bg-white/[0.025] transition-colors">
      <td className="px-4 py-3.5 align-middle">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-semibold flex items-center justify-center shrink-0 text-sm">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-100">{user.name}</span>
            <span className="text-xs text-gray-400">{user.email}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 align-middle text-sm text-gray-300">{user.phone}</td>
      <td className="px-4 py-3.5 align-middle text-sm text-gray-300">{user.planTitle}</td>
      <td className="px-4 py-3.5 align-middle text-sm text-gray-400">
        {user.subscribedDate ? new Date(user.subscribedDate).toLocaleDateString() : "N/A"}
      </td>
      <td className="px-4 py-3.5 align-middle text-sm text-gray-400">
        {user.expiryDate ? new Date(user.expiryDate).toLocaleDateString() : "N/A"}
      </td>
      <td className="px-4 py-3.5 align-middle">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            user.isActive
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/15 text-amber-400 border-amber-500/30"
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-4 py-3.5 align-middle text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            className="p-1.5 rounded-lg text-gray-400 hover:bg-indigo-500/15 hover:text-indigo-400 transition-colors disabled:opacity-50 cursor-pointer"
            title="Edit User"
            onClick={() => onEdit(id)}
            disabled={isLoading}
          >
            <Edit3 size={15} />
          </button>
          <button
            className="p-1.5 rounded-lg text-gray-400 hover:bg-rose-500/15 hover:text-rose-400 transition-colors disabled:opacity-50 cursor-pointer"
            title="Delete User"
            onClick={() => onDelete(id)}
            disabled={isLoading}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const Filters = ({ query, onFieldChange }) => {
  const [searchValue, setSearchValue] = useState(query.name || "");
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    setSearchValue(query.name || "");
  }, [query.name]);

  useEffect(() => {
    if (debouncedSearch !== (query.name || "")) {
      onFieldChange("name", debouncedSearch);
    }
  }, [debouncedSearch, onFieldChange, query.name]);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <input
        type="text"
        placeholder="Search by name..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-60 px-3.5 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all"
      />
      <select
        value={query.status}
        onChange={(e) => onFieldChange("status", e.target.value)}
        className="px-3.5 py-2 bg-[#121824] border border-white/10 rounded-lg text-gray-200 text-sm outline-none focus:border-indigo-500 transition-all cursor-pointer"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
};

const Pagination = ({ page, totalPages, onPageChange }) => (
  <div className="flex justify-end items-center gap-3 mt-4">
    <button
      className="px-3.5 py-1.5 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      disabled={page <= 1}
      onClick={() => onPageChange(page - 1)}
    >
      Previous
    </button>
    <span className="text-sm font-semibold text-gray-300">
      Page {page} of {totalPages || 1}
    </span>
    <button
      className="px-3.5 py-1.5 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      disabled={page >= totalPages}
      onClick={() => onPageChange(page + 1)}
    >
      Next
    </button>
  </div>
);

export default function UserList({
  initialUsers,
  initialQuery,
  total,
  totalPages,
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const { query, setQueryField, setQueryBatch } = useQueryState(initialQuery);
  const {
    users,
    loading,
    error,
    setError,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useUserManagement(initialUsers);

  const openAddModal = () => {
    setEditingUserId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (id) => {
    setEditingUserId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
    setError(null);
  };

  const handlePageChange = (newPage) => {
    setQueryBatch({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addOrEditUser = async (formData) => {
    try {
      if (editingUserId) {
        await handleUpdate(editingUserId, formData);
      } else {
        await handleCreate(formData);
      }
      closeModal();
      router.refresh();
    } catch (err) {
      // Error handled in hook
    }
  };

  return (
    <div className="bg-[#121824]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-gray-100 tracking-tight">
          Users ({total || users.length})
        </h2>
        <Filters query={query} onFieldChange={setQueryField} />
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(99,102,241,0.35)] active:translate-y-0 cursor-pointer"
          onClick={openAddModal}
        >
          <UserPlus size={16} />
          <span>Add User</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-lg text-rose-400 text-xs font-medium">
          <AlertOctagon size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-white/[0.03] text-[0.72rem] font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
            <tr>
              <th className="px-4 py-3.5">Name</th>
              <th className="px-4 py-3.5">Phone</th>
              <th className="px-4 py-3.5">Plan Title</th>
              <th className="px-4 py-3.5">Subscribed Date</th>
              <th className="px-4 py-3.5">Expiry Date</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <UserRow
                  key={user._id || user.id}
                  user={user}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  isLoading={loading}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-10 text-center text-gray-400 text-sm"
                >
                  {loading ? "Loading..." : "No users found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {users.length > 0 && (
        <Pagination
          page={query.page}
          totalPages={
            totalPages ||
            Math.ceil((total || users.length) / (query.limit || 10)) ||
            1
          }
          onPageChange={handlePageChange}
        />
      )}

      {isModalOpen && (
        <AddEditUserForm
          userId={editingUserId}
          onClose={closeModal}
          onSave={addOrEditUser}
          saving={loading}
        />
      )}
    </div>
  );
}