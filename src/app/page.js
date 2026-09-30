import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminLogin from "@/components/admin/login/AdminLogin";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;

  if (token) {
    redirect("/admin/dashboard");
  }

  return <AdminLogin />;
}
