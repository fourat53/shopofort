import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import { ORDERS_HEADER } from "@/lib/entity/entity-header";
import type { OrderStatus, ParameterType } from "@/lib/entity/types";
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function buildWhereClause(searchParams: ParameterType): Prisma.OrderWhereInput {
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

function buildOrderClause(
	orderParams: ParameterType,
): Prisma.OrderOrderByWithRelationInput {
	const sortBy =
		typeof orderParams.sortBy === "string" ? orderParams.sortBy : undefined;
	const order = orderParams.order === "desc" ? "desc" : "asc";

	const sortableColumns = new Set<keyof Prisma.OrderOrderByWithRelationInput>(
		ORDERS_HEADER.map(
			(header) => header.name as keyof Prisma.OrderOrderByWithRelationInput,
		),
	);

	if (
		sortBy &&
		sortableColumns.has(sortBy as keyof Prisma.OrderOrderByWithRelationInput)
	)
		return {
			[sortBy]: order,
		} as Prisma.OrderOrderByWithRelationInput;
	return { id: "asc" };
}

function getOrdersPage(
	page: number,
	searchParams: ParameterType = {},
	orderParams: ParameterType = {},
) {
	const where = buildWhereClause(searchParams);
	const orderBy = buildOrderClause(orderParams);
	return unstable_cache(
		async () => {
			return await prisma.order.findMany({
				where,
				skip: (page - 1) * PAGE_SIZE,
				take: PAGE_SIZE,
				orderBy,
			});
		},
		[
			"orders-page",
			String(page),
			JSON.stringify(searchParams),
			JSON.stringify(orderParams),
		],
		{
			revalidate: Object.keys(searchParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["orders"],
		},
	)();
}

function getOrderCount(searchParams: ParameterType = {}) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () => prisma.order.count({ where }),
		["orders-count", JSON.stringify(searchParams)],
		{
			revalidate: Object.keys(searchParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["orders"],
		},
	)();
}

export { getOrderCount, getOrdersPage };
