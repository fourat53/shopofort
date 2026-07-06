import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import { prisma, CACHE_REVALIDATE_SECONDS } from "@/lib/prisma";
import type { CartItem } from "@/lib/generated/prisma/client";
import { unstable_cache } from "next/cache";

const getCartItemCount = unstable_cache(
  async () => prisma.cartItem.count(),
  ["cart-items-count"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["cart-items"] },
);

function getCartItemsPage(page: number) {
  return unstable_cache(
    async () =>
      prisma.cartItem.findMany({
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: { id: "asc" },
      }),
    ["cart-items-page", String(page)],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["cart-items"] },
  )();
}

type CartItemType = CartItem;
export { type CartItemType, getCartItemCount, getCartItemsPage };
