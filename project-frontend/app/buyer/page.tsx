import BuyerShell from "@/components/buyer/BuyerShell";
import BuyerProducts from "@/components/buyer/BuyerProducts";
import BuyerStories from "@/components/buyer/BuyerStories";
import { apiFetch } from "@/lib/api";
import { requireRole } from "@/lib/auth";

type Story = {
  id: string;
  title?: string;
  imagePath: string;
  sellerProfile?: { storeName?: string };
};

type Product = {
  id: string;
  name: string;
  price: number | string;
  categoryId?: string | null;
  category?: { id: string; name: string } | null;
  description?: string | null;
  imagePath?: string | null;
};

type Category = {
  id: string;
  name: string;
};

export default async function BuyerDashboard() {
  const session = await requireRole("buyer");
  const token = session.token ?? "";

  const [storiesResult, productsResult, categoriesResult] =
    await Promise.allSettled([
    apiFetch<Story[]>("/buyer/stories", { token }),
    apiFetch<{ data: Product[] }>("/products"),
    apiFetch<{ data: Category[] }>("/products/categories"),
  ]);

  const stories: Story[] =
    storiesResult.status === "fulfilled" ? storiesResult.value : [];
  const products =
    productsResult.status === "fulfilled"
      ? productsResult.value.data ?? []
      : [];
  const categories =
    categoriesResult.status === "fulfilled"
      ? categoriesResult.value.data ?? []
      : [];

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5010";

  return (
    <BuyerShell>
      <div className="flex w-full flex-col gap-10">
        <BuyerStories stories={stories} apiBaseUrl={apiBaseUrl} />

        <BuyerProducts
          products={products}
          categories={categories}
          imageBaseUrl={apiBaseUrl}
        />

        
      </div>
    </BuyerShell>
  );
}
