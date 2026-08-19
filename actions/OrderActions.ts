import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import { ORDERS_HEADER } from "@/lib/entity/entity-header";
import type { OrderStatus, ParameterType } from "@/lib/entity/types";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

type FilterBy = Prisma.OrderWhereInput;

function buildWhereClause(filterParams: ParameterType): FilterBy {
	const where: FilterBy = {};
	if (filterParams.id) where.id = Number(filterParams.id);
	if (filterParams.totalAmount)
		where.totalAmount = Number(filterParams.totalAmount);
	if (filterParams.userId) where.userId = String(filterParams.userId);
	if (filterParams.orderStatus)
		where.orderStatus = filterParams.orderStatus as OrderStatus;
	if (filterParams.orderDate) {
		const date = new Date(String(filterParams.orderDate));
		if (!Number.isNaN(date.getTime())) {
			where.orderDate = date;
		}
	}
	return where;
}

type OrderBy = Prisma.OrderOrderByWithRelationInput;

function buildOrderClause(
	sortBy: string = "id",
	order: "asc" | "desc" = "asc",
): OrderBy {
	const sortableColumns = new Set<keyof OrderBy>(
		ORDERS_HEADER.map((header) => header.name as keyof OrderBy),
	);
	if (sortableColumns.has(sortBy as keyof OrderBy))
		return { [sortBy]: order } as OrderBy;
	return { id: "asc" };
}

function getOrdersPage(
	page: number = 1,
	filterParams: ParameterType = {},
	sortBy: string = "id",
	order: "asc" | "desc" = "asc",
) {
	const where = buildWhereClause(filterParams);
	const orderBy = buildOrderClause(sortBy, order);
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
			JSON.stringify(filterParams),
			JSON.stringify({ sortBy, order }),
		],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["orders"],
		},
	)();
}

function getOrderCount(filterParams: ParameterType = {}) {
	const where = buildWhereClause(filterParams);
	return unstable_cache(
		async () => prisma.order.count({ where }),
		["orders-count", JSON.stringify(filterParams)],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["orders"],
		},
	)();
}

export { getOrderCount, getOrdersPage };
