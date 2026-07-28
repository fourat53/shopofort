import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import type { OrderStatus } from "@/lib/generated/prisma/client";
import { prisma, CACHE_REVALIDATE_SECONDS } from "@/lib/prisma";
import type { Order } from "@/lib/generated/prisma/client";
import { unstable_cache } from "next/cache";
import { formatDate } from "@/lib/date-format";

const ORDERS_HEADER: string[] = [
  "Order ID",
  "Order Date",
  "Total Amount",
  "Order Status",
  "User ID",
] as const;

const getOrderCount = unstable_cache(
  async () => prisma.order.count(),
  ["orders-count"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["orders"] },
);

function getOrdersPage(page: number) {
  return unstable_cache(
    async () => {
      const orders = await prisma.order.findMany({
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: { id: "asc" },
      });

      return orders.map((order) => ({
        ...order,
        orderDate: formatDate(order.orderDate),
      }));
    },
    ["orders-page", String(page)],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["orders"] },
  )();
}

type OrderType = Omit<Order, "orderDate"> & {
  orderDate: string;
};

export { ORDERS_HEADER, type OrderType, getOrderCount, getOrdersPage };
