import { unstable_cache } from "next/cache";
import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import type { OrderStatus, Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const FILTERED_CACHE_SECONDS = 10;

function buildWhereClause(
	searchParams: Record<string, string | string[] | undefined>,
): Prisma.OrderWhereInput {
	const where: Prisma.OrderWhereInput = {};
	if (searchParams.id) where.id = Number(searchParams.id);
	if (searchParams.totalAmount)
		where.totalAmount = Number(searchParams.totalAmount);
	if (searchParams.userId) where.userId = String(searchParams.userId);
	if (searchParams.orderStatus)
		where.orderStatus = searchParams.orderStatus as OrderStatus;
	if (searchParams.orderDate) {
		const date = new Date(String(searchParams.orderDate));
		if (!Number.isNaN(date.getTime())) {
			where.orderDate = date;
		}
	}
	return where;
}

function getOrderCount(
	searchParams: Record<string, string | string[] | undefined> = {},
) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () => prisma.order.count({ where }),
		["orders-count", JSON.stringify(searchParams)],
		{
			revalidate: Object.keys(searchParams).length
				? FILTERED_CACHE_SECONDS
				: 3600,
			tags: ["orders"],
		},
	)();
}

function getOrdersPage(
	page: number,
	searchParams: Record<string, string | string[] | undefined> = {},
) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () => {
			return await prisma.order.findMany({
				where,
				skip: (page - 1) * PAGE_SIZE,
				take: PAGE_SIZE,
				orderBy: { id: "asc" },
			});
		},
		["orders-page", String(page), JSON.stringify(searchParams)],
		{
			revalidate: Object.keys(searchParams).length
				? FILTERED_CACHE_SECONDS
				: 3600,
			tags: ["orders"],
		},
	)();
}

export { getOrderCount, getOrdersPage };
