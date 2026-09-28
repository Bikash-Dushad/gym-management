import { getData, postData } from "@/lib/axios/server";

export const getAdminProfileService = async () => {
  const response = await getData("/admin/get-admin-profile");
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export const getListOfUsersService = async (payload) => {
  const response = await postData("/admin/get-list-of-users", payload);
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
  return response;
};

export const getUserDetailsService = async (userId) => {
  const response = await postData("/admin/get-user-details", userId);
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
