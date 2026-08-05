import axios from "axios";
import { extractErrorMessage } from "@/helper/error";

export function createApiInstance() {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      if (status === 401) {
        console.warn("Unauthorized! User session expired or invalid.", error);
        // Optional: redirect to login or clear token state
      }
      if (status === 400) {
        console.warn("Validation / Bad Request:");
      }
      if (status === 500) {
        console.error("Server Error:");
      }
      return Promise.reject(error);
    },
  );
  return instance;
}

export function makeHelpers(instance) {
  return {
    getData: async (endpoint) => {
      try {
        const response = await instance.get(endpoint);
        return response.data;
      } catch (error) {
        const msg = extractErrorMessage(error);
        console.error("Error fetching data:", msg, error);
        throw new Error(msg);
      }
    },

    postData: async (endpoint, payload) => {
      try {
        const response = await instance.post(endpoint, payload);
        return response.data;
      } catch (error) {
        const msg = extractErrorMessage(error);
        console.error("Error posting data:", msg, error);
        throw new Error(msg);
      }
    },
  };
}
