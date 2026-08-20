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

function getParamValues(param: ParameterType[string]): string[] {
	if (!param) return [];
	return Array.isArray(param) ? param : [param];
}

function buildWhereClause(filterParams: ParameterType): FilterBy {
	const where: FilterBy = {};
	if (filterParams.id) where.id = Number(filterParams.id);

	const totalAmountFrom = Number(filterParams.totalAmountFrom);
	const totalAmountTo = Number(filterParams.totalAmountTo);
	if (!Number.isNaN(totalAmountFrom) || !Number.isNaN(totalAmountTo)) {
		where.totalAmount = {};
		if (!Number.isNaN(totalAmountFrom)) where.totalAmount.gte = totalAmountFrom;
		if (!Number.isNaN(totalAmountTo)) where.totalAmount.lte = totalAmountTo;
	}

	const userIds = getParamValues(filterParams.userId);
	if (userIds.length) where.userId = { in: userIds };

	const orderStatuses = getParamValues(filterParams.orderStatus);
	if (orderStatuses.length)
		where.orderStatus = { in: orderStatuses as OrderStatus[] };

	const orderDateFrom = new Date(String(filterParams.orderDateFrom ?? ""));
	const orderDateTo = new Date(String(filterParams.orderDateTo ?? ""));
	if (
		!Number.isNaN(orderDateFrom.getTime()) ||
		!Number.isNaN(orderDateTo.getTime())
	) {
		where.orderDate = {};
		if (!Number.isNaN(orderDateFrom.getTime()))
			where.orderDate.gte = orderDateFrom;
		if (!Number.isNaN(orderDateTo.getTime())) where.orderDate.lte = orderDateTo;
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
