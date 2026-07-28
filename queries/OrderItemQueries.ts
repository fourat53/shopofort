import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import { prisma, CACHE_REVALIDATE_SECONDS } from "@/lib/prisma";
import type { OrderItem } from "@/lib/generated/prisma/client";
import { unstable_cache } from "next/cache";

const ORDER_ITEMS_HEADER: string[] = [
  "OrderItem ID",
  "Quantity",
  "Price",
  "Order ID",
  "Product ID",
] as const;

const getOrderItemCount = unstable_cache(
  async () => prisma.orderItem.count(),
  ["order-items-count"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["order-items"] },
);

function getOrderItemsPage(page: number) {
  return unstable_cache(
    async () =>
      prisma.orderItem.findMany({
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: { id: "asc" },
      }),
    ["order-items-page", String(page)],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["order-items"] },
  )();
}

type OrderItemType = OrderItem;
export {
  ORDER_ITEMS_HEADER,
  type OrderItemType,
  getOrderItemCount,
  getOrderItemsPage,
};
