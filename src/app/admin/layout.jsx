import Navbar from "@/components/admin/layout/Navbar";
import Sidebar from "@/components/admin/layout/Sidebar";

export const metadata = {
  title: "Gym Management Admin",
  description: "Administrative portal for Gym Management",
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0a0d14] bg-[radial-gradient(ellipse_at_20%_0%,rgba(99,102,241,0.08)_0%,transparent_60%),radial-gradient(ellipse_at_80%_100%,rgba(6,182,212,0.05)_0%,transparent_60%)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 sm:p-8 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
