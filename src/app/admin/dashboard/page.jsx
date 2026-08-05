import { cookies } from "next/headers";
import { getAdminProfileService } from "@/services/admin/server.service";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Dashboard | Nexus",
  description: "Server-side rendered admin dashboard metrics",
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;

  if (!token) {
    redirect("/admin-login");
  }

  return (
    <>
      <p>hello</p>
    </>
  );
}
