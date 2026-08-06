import MembershipPlans from "@/components/admin/membershipPlans/MembershipPlans";
import { listOfMembershipPlansService } from "@/services/admin/server.service";

export const metadata = {
  title: "Membership plan",
  description:
    "Manage users, assign roles, inspect account statuses server-side",
};


export default async function membershipPlansPage() {
  const response = await listOfMembershipPlansService()
  return <MembershipPlans plans={response.data} />;
}
