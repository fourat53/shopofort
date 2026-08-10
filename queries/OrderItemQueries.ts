import { unstable_cache } from "next/cache";
import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const FILTERED_CACHE_SECONDS = 10;

function buildWhereClause(searchParams: Record<string, string | string[] | undefined>): Prisma.OrderItemWhereInput {
	const where: Prisma.OrderItemWhereInput = {};
	if (searchParams.id) where.id = Number(searchParams.id);
	if (searchParams.quantity) where.quantity = Number(searchParams.quantity);
	if (searchParams.price) where.price = Number(searchParams.price);
	if (searchParams.orderId) where.orderId = Number(searchParams.orderId);
	if (searchParams.productId) where.productId = Number(searchParams.productId);
	return where;
}

function getOrderItemCount(searchParams: Record<string, string | string[] | undefined> = {}) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () => prisma.orderItem.count({ where }),
		["order-items-count", JSON.stringify(searchParams)],
		{ revalidate: Object.keys(searchParams).length ? FILTERED_CACHE_SECONDS : 3600, tags: ["order-items"] },
	)();
}

function getOrderItemsPage(page: number, searchParams: Record<string, string | string[] | undefined> = {}) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () => {
			const orderItems = await prisma.orderItem.findMany({
				where,
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
		["order-items-page", String(page), JSON.stringify(searchParams)],
		{ revalidate: Object.keys(searchParams).length ? FILTERED_CACHE_SECONDS : 3600, tags: ["order-items"] },
	)();
}

export { getOrderItemCount, getOrderItemsPage };
