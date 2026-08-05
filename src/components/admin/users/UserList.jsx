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
    <tr className="table-row">
      <td>
        <div className="user-profile-cell">
          <div className="user-avatar">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="user-names">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
        </div>
      </td>
      <td><span className="dept-label">{user.phone}</span></td>
      <td><span className="dept-label">{user.planTitle}</span></td>
      <td>
        <span className="date-label">
          {user.subscribedDate ? new Date(user.subscribedDate).toLocaleDateString() : "N/A"}
        </span>
      </td>
      <td>
        <span className="date-label">
          {user.expiryDate ? new Date(user.expiryDate).toLocaleDateString() : "N/A"}
        </span>
      </td>
      <td>
        <span className={`status-badge ${user.isActive ? "active" : "inactive"}`}>
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="text-right">
        <div className="action-buttons">
          <button
            className="action-btn edit-btn"
            title="Edit User"
            onClick={() => onEdit(id)}
            disabled={isLoading}
          >
            <Edit3 size={15} />
          </button>
          <button
            className="action-btn delete-btn"
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

  // Keep local state synced if query.name changes externally (e.g. URL change or reset)
  useEffect(() => {
    setSearchValue(query.name || "");
  }, [query.name]);

  // Trigger search update when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== (query.name || "")) {
      onFieldChange("name", debouncedSearch);
    }
  }, [debouncedSearch, onFieldChange, query.name]);

  return (
    <div className="table-filters">
      <input
        type="text"
        placeholder="Search by name..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="filter-input"
      />
      <select
        value={query.status}
        onChange={(e) => onFieldChange("status", e.target.value)}
        className="filter-select"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
};

const Pagination = ({ page, totalPages, onPageChange }) => (
  <div className="pagination-container">
    <button
      className="pagination-btn"
      disabled={page <= 1}
      onClick={() => onPageChange(page - 1)}
    >
      Previous
    </button>
    <span className="page-number">Page {page} of {totalPages || 1}</span>
    <button
      className="pagination-btn"
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
  totalPages 
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  
  const { query, setQueryField, setQueryBatch } = useQueryState(initialQuery);
  const { 
    users, 
    setUsers,
    loading, 
    error, 
    setError,
    handleCreate, 
    handleUpdate, 
    handleDelete 
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
    // Optionally scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addOrEditUser = async (formData) => {
    try {
      if (editingUserId) {
        await handleUpdate(editingUserId, formData);
      } else {
        await handleCreate(formData);
      }
      closeModal();
      router.refresh(); // Revalidate server data
    } catch (err) {
      // Error already handled in hook
    }
  };

  return (
    <div className="glass-panel user-table-card">
      <div className="table-controls">
        <h2 className="table-title">Users ({total || users.length})</h2>
        <Filters query={query} onFieldChange={setQueryField} />
        <button className="btn-add-user" onClick={openAddModal}>
          <UserPlus size={16} />
          <span>Add User</span>
        </button>
      </div>

      {error && (
        <div className="table-error-alert">
          <AlertOctagon size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Plan Title</th>
              <th>Subscribed Date</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th className="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
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
                <td colSpan="7" className="empty-row">
                  {loading ? 'Loading...' : 'No users found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {users.length > 0 && (
        <Pagination
          page={query.page}
          totalPages={totalPages || Math.ceil((total || users.length) / (query.limit || 10)) || 1}
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