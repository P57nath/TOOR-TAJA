import SellerProfileClient from "@/components/seller/SellerProfileClient";
import { requireRole } from "@/lib/auth";

export default async function SellerProfilePage() {
  await requireRole("seller");

  return <SellerProfileClient />;
}
