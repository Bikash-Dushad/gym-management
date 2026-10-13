import MembershipPlans from "@/components/admin/membershipPlans/MembershipPlans";
import { listOfMembershipPlansService } from "@/services/admin/server.service";

export const metadata = {
  title: "Membership plan",
  description:
    "Manage users, assign roles, inspect account statuses server-side",
};


export const dynamic = "force-dynamic";

export default async function membershipPlansPage() {
  try {
    const response = await listOfMembershipPlansService();
    return <MembershipPlans plans={response?.data || []} />;
  } catch (error) {
    console.error("Failed to load membership plans:", error);
    return <MembershipPlans plans={[]} />;
  }
}

