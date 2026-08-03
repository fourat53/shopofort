import { unstable_cache } from "next/cache";
import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import { CACHE_REVALIDATE_SECONDS, prisma } from "@/lib/prisma";

const ORDER_ITEMS_HEADER: string[] = [
	"OrderItem ID",
	"Price",
	"Quantity",
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
		async () => {
			const orderItems = await prisma.orderItem.findMany({
				skip: (page - 1) * PAGE_SIZE,
				take: PAGE_SIZE,
				orderBy: { id: "asc" },
			});
			return orderItems.map(({ id, price, ...rest }) => ({
				id,
				price: Number(price),
				...rest,
			}));
		},
		["order-items-page", String(page)],
		{ revalidate: CACHE_REVALIDATE_SECONDS, tags: ["order-items"] },
	)();
}

export { getOrderItemCount, getOrderItemsPage, ORDER_ITEMS_HEADER };
