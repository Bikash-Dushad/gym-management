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
