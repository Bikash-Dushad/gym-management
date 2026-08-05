import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLogin from "@/components/admin/login/AdminLogin";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;

  if (token) {
    redirect("/admin/dashboard");
  }

  return <AdminLogin />;
}
