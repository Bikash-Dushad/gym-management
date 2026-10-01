import { getData, postData } from "@/lib/axios/client";

export const checkServerStatusService = async () => {
  const response = await getData("/health");
  if (!response.success) {
    throw new Error(response.message);
  }
  return response;
};

export const getAdminProfileService = async () => {
  const response = await getData("/admin/get-admin-profile");
  if (!response) {
    throw new Error(response.message);
  }
  return response.data;
};

export const adminLoginService = async (payload) => {
  const response = await postData("/admin/admin-login", payload);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export const listOfMembershipPlansService = async () => {
  const response = await getData("/admin/list-of-membership-plans");
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export const createUserService = async (payload) => {
  const response = await postData("/admin/create-user", payload);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export const getUserDetailsService = async (userId) => {
  const response = await postData("/admin/get-user-details", { userId });
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export const createMembershipPlanService = async (payload) => {
  const response = await postData("/admin/create-membership-plan", payload);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export const updateMembershipPlanService = async (payload) => {
  const response = await postData("/admin/update-membership-plan", payload);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export const adminDashboardService = async () => {
  const response = await getData("/admin/admin-dashboard");
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export const renewMembershipService = async (payload) => {
  const response = await postData("/admin/renew-membership", payload);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export const updateUserService = async (payload) => {
  const response = await postData("/admin/update-user", payload)
  if (!response.success) {
    throw new Error(response.message)
  }
  return response.data
}
