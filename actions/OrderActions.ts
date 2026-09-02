import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	PAGE_SIZE,
} from "@/components/pagination/PaginationParams";
import { getParamValues } from "@/lib/entity/entity-functions";
import { ORDERS_HEADER } from "@/lib/entity/entity-header";
import type { OrderStatus, ParameterType } from "@/lib/entity/types";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

type FilterBy = Prisma.OrderWhereInput;

function buildWhereClause(filterParams: ParameterType): FilterBy {
	const where: FilterBy = {};

	const ids = getParamValues(filterParams.id);
	if (ids.length) where.id = { in: ids.map(Number) };

	const from = Number(filterParams.totalAmountFrom);
	const to = Number(filterParams.totalAmountTo);
	if (!Number.isNaN(from) || !Number.isNaN(to)) {
		const range: { gte?: number; lte?: number } = {};
		if (!Number.isNaN(from)) range.gte = from;
		if (!Number.isNaN(to)) range.lte = to;
		where.totalAmount = range;
	}

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

	const orderStatuses = getParamValues(filterParams.orderStatus);
	if (orderStatuses.length)
		where.orderStatus = { in: orderStatuses as OrderStatus[] };

	const userIds = getParamValues(filterParams.userId);
	if (userIds.length) where.userId = { in: userIds };
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

async function getOrdersPage(
	page: number = 1,
	order: "asc" | "desc" = "asc",
	sortBy: string = "id",
	filterParams: ParameterType = {},
	pageSize: number = PAGE_SIZE,
) {
	const where = buildWhereClause(filterParams);
	const orderBy = buildOrderClause(sortBy, order);
	return unstable_cache(
		async () => {
			return await prisma.order.findMany({
				where,
				skip: (page - 1) * pageSize,
				take: pageSize,
				orderBy,
				// include: { orderItems: true },
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

async function getOrderCount(filterParams: ParameterType = {}) {
	const where = buildWhereClause(filterParams);
	return unstable_cache(
		() => prisma.order.count({ where }),
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
