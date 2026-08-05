"use client";
import { useState, useEffect } from "react";
import { UserPlus, Edit3, Trash2, AlertOctagon } from "lucide-react";
import AddEditUserForm from "./AddEditUserForm";
import { createUserService } from "@/services/admin/client.service";
import { useRouter, useSearchParams } from "next/navigation";

export default function UserList({ initialUsers }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState(initialUsers || []);
  const [editingUserId, setEditingUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState(searchParams.get("name") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10);

  useEffect(() => {
    setUsers(initialUsers || []);
  }, [initialUsers]);

  const updateQueryParams = (values) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(values).forEach(([key, value]) => {
      params.set(key, value);
    });
    router.push(`?${params.toString()}`);
  };

  const handleDelete = async (id) => {
    if (
      !confirm("Are you sure you want to delete this user from the system?")
    ) {
      return;
    }
    setDeletingId(id);
    setErrorMsg("");
    try {
      //   await deleteUserService(id);
      //   setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id));
    } catch (error) {
      setErrorMsg(error.message || "Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

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
  };

  const addOrEditUser = async (formValues) => {
    setSaving(true);
    setErrorMsg("");
    try {
      if (editingUserId) {
        console.log("Updating user id is", editingUserId);
        // const updated = await updateUserService(existingUserId, formValues);
        // setUsers((prev) =>
        //   prev.map((u) => ((u._id || u.id) === existingUserId ? updated : u)),
        // );
      } else {
        const created = await createUserService(formValues);
        setUsers((prev) => [created, ...prev]);
      }
      router.refresh();
      closeModal();
    } catch (error) {
      setErrorMsg(error.message || "Failed to save user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-panel user-table-card">
      {/* Controls Bar: Add User only */}
      <div className="table-controls">
        <h2 className="table-title">Users</h2>

        <div className="table-filters">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);

              updateQueryParams({
                name: value,
                status,
                page: 1,
                limit,
              });
            }}
            className="filter-input"
          />

          {/* Status */}
          <select
            value={status}
            onChange={(e) => {
              const value = e.target.value;
              setStatus(value);

              updateQueryParams({
                name: search,
                status: value,
                page: 1,
                limit,
              });
            }}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Add User */}
          <button className="btn-add-user" onClick={openAddModal}>
            <UserPlus size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="table-error-alert">
          <AlertOctagon size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Data Table */}
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
              users.map((u) => {
                const id = u._id || u.id;
                return (
                  <tr key={id} className="table-row">
                    <td>
                      <div className="user-profile-cell">
                        <div className="user-avatar">
                          {u.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="user-names">
                          <span className="user-name">{u.name}</span>
                          <span className="user-email">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="dept-label">{u.phone}</span>
                    </td>

                    <td>
                      <span className="dept-label">{u.planTitle}</span>
                    </td>

                    <td>
                      <span className="date-label">
                        {u.subscribedDate
                          ? new Date(u.subscribedDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </td>

                    <td>
                      <span className="date-label">
                        {u.expiryDate
                          ? new Date(u.expiryDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${u.isActive ? "active" : "inactive"}`}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="text-right">
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          title="Edit User"
                          onClick={() => openEditModal(id)}
                          disabled={deletingId === id}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          title="Delete User"
                          onClick={() => handleDelete(id)}
                          disabled={deletingId === id}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="empty-row">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <button
          className="pagination-btn"
          disabled={page === 1}
          onClick={() => {
            const newPage = page - 1;
            setPage(newPage);

            updateQueryParams({
              name: search,
              status,
              page: newPage,
              limit,
            });
          }}
        >
          Previous
        </button>

        <span className="page-number">Page {page}</span>

        <button
          className="pagination-btn"
          onClick={() => {
            const newPage = page + 1;
            setPage(newPage);

            updateQueryParams({
              name: search,
              status,
              page: newPage,
              limit,
            });
          }}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <AddEditUserForm
          userId={editingUserId}
          onClose={closeModal}
          onSave={addOrEditUser}
          saving={saving}
        />
      )}
    </div>
  );
}
