import { getData, postData } from "@/lib/axios/client";

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
