import { useState, useCallback, useEffect } from "react";
import {
  createUserService,
  renewMembershipService,
  //   deleteUserService,
  //   updateUserService,
} from "@/services/admin/client.service";

export function useUserManagement(initialUsers, onSuccess) {
  const [users, setUsers] = useState(initialUsers || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync state when initialUsers prop changes (e.g. after router.refresh())
  useEffect(() => {
    setUsers(initialUsers || []);
  }, [initialUsers]);

  const handleCreate = useCallback(
    async (formData) => {
      setLoading(true);
      setError(null);
      try {
        const newUser = await createUserService(formData);
        setUsers((prev) => [newUser, ...prev]);
        onSuccess?.("User created successfully");
        return newUser;
      } catch (err) {
        setError(err.message || "Failed to create user");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess],
  );

  const handleUpdate = useCallback(
    async (userId, formData) => {
      setLoading(true);
      setError(null);
      try {
        // const updated = await updateUserService(userId, formData);
        // setUsers((prev) =>
        //   prev.map((u) => ((u._id || u.id) === userId ? updated : u)),
        // );
        // onSuccess?.("User updated successfully");
        // return updated;
        console.log("user updated");
      } catch (err) {
        setError(err.message || "Failed to update user");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess],
  );

  const handleRenew = useCallback(
    async (payload) => {
      setLoading(true);
      setError(null);
      try {
        const res = await renewMembershipService(payload);
        onSuccess?.("Membership renewed successfully");
        return res;
      } catch (err) {
        setError(err.message || "Failed to renew membership");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess],
  );

  const handleDelete = useCallback(
    async (userId) => {
      if (!confirm("Are you sure you want to delete this user?")) return;

      setLoading(true);
      setError(null);
      try {
        console.log("user deleted");
        // await deleteUserService(userId);
        // setUsers((prev) => prev.filter((u) => (u._id || u.id) !== userId));
        // onSuccess?.("User deleted successfully");
      } catch (err) {
        setError(err.message || "Failed to delete user");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess],
  );

  return {
    users,
    setUsers,
    loading,
    error,
    setError,
    handleCreate,
    handleUpdate,
    handleRenew,
    handleDelete,
  };
}
