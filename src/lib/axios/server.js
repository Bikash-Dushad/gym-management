import "server-only"; // build-time guard: throws if bundled for the client
import { cookies } from "next/headers";
import { createApiInstance, makeHelpers } from "./base";

const Instance = createApiInstance();

Instance.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;
  if (token) {
    config.headers.cookie = `adminToken=${token}`;
  }
  return config;
});

export const { getData, postData } = makeHelpers(Instance);
