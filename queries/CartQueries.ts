import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import { prisma, CACHE_REVALIDATE_SECONDS } from "@/lib/prisma";
import type { Cart } from "@/lib/generated/prisma/client";
import { unstable_cache } from "next/cache";

const CARTS_HEADER: string[] = ["Cart ID", "Total Amount", "User ID"] as const;

const getCartCount = unstable_cache(
  async () => prisma.cart.count(),
  ["carts-count"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["carts"] },
);

function getCartsPage(page: number) {
  return unstable_cache(
    async () =>
      prisma.cart.findMany({
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: { id: "asc" },
      }),
    ["carts-page", String(page)],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["carts"] },
  )();
}

type CartType = Cart;

export { CARTS_HEADER, type CartType, getCartCount, getCartsPage };
