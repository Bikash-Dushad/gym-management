import UserList from "@/components/admin/users/UserList";
import { getListOfUsersService } from "@/services/admin/server.service";

export const metadata = {
  title: "User Management | Nexus Admin",
  description:
    "Manage users, assign roles, inspect account statuses server-side",
};

export default async function UsersPage({ searchParams }) {
  const params = await searchParams;

  const payload = {
    status: params.status || "all",
    name: params.name || "",
    page: Number(params.page) || 1,
    limit: Math.min(100, Math.max(1, Number(params.limit) || 10)),
  };

  const resData = await getListOfUsersService(payload);

  const users = resData?.users || (Array.isArray(resData) ? resData : []);
  const total = resData?.totalUsers ?? resData?.total ?? users.length;
  const totalPages = resData?.totalPages ?? Math.ceil(total / payload.limit) ?? 1;

  return (
    <UserList
      initialUsers={users}
      initialQuery={payload}
      total={total}
      totalPages={totalPages}
    />
  );
}
