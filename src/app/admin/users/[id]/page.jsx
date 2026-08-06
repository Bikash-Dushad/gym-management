import UserDetails from "@/components/admin/users/UserDetails";
import { getUserDetailsService } from "@/services/admin/server.service";

export const metadata = {
  title: "User Details | Nexus Admin",
  description: "View user detailed profile and membership info",
};

export default async function UserDetailsPage({ params }) {
  const resolvedParams = await params;
  const userId = resolvedParams.id;

  let userData = null;
  let errorMsg = null;

  try {
    userData = await getUserDetailsService({ userId });
  } catch (err) {
    errorMsg = err.message || "Failed to load user details";
  }

  return (
    <UserDetails
      userId={userId}
      initialData={userData}
      initialError={errorMsg}
    />
  );
}