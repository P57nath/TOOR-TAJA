import BuyerShell from "@/components/buyer/BuyerShell";
import BuyerProfileClient from "@/components/buyer/BuyerProfileClient";
import { requireRole } from "@/lib/auth";

export default async function BuyerProfilePage() {
  const session = await requireRole("buyer");

  return (
    <BuyerShell notificationRole="buyer" notificationUserId={session.userId}>
      <BuyerProfileClient />
    </BuyerShell>
  );
}
