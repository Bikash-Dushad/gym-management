import AdminDashboard from "@/components/admin/dashboard/AdminDashboard";
import { adminDashboardService } from "@/services/admin/server.service";

export const metadata = {
  title: "Admin Dashboard | Nexus Gym",
  description:
    "Server-side rendered admin dashboard metrics and gym management",
};
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  try {
    const response = await adminDashboardService();
    return <AdminDashboard initialData={response} />;
  } catch (error) {
    console.error("Failed to fetch initial dashboard data:", error);
    return <AdminDashboard initialData={null} />;
  }
}
