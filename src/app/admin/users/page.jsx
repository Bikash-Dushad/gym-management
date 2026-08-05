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

  const { users, totalUsers, totalPages } = await getListOfUsersService(query);

  return <UserList initialUsers={data.users} />;
}
